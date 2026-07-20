import MetaTrader5 as mt5
from datetime import datetime, timedelta
from typing import Optional, Tuple

from config import SYMBOL
from core.logger import logger
from core.models import TradingSignal


class RiskManager:
    """
    Risk management module to validate trading signals and ensure safe trading.
    
    This module implements multiple safety checks before allowing trade execution:
    - Account balance-based trade limits
    - Account balance-based lot size limits
    - Duplicate pending order prevention
    - Market closed detection
    - AutoTrading disabled detection
    - Account disconnected detection
    - Signal age rejection
    """

    # ============================================================================
    # ACCOUNT BALANCE CONFIGURATION
    # ============================================================================

    # Maximum open trades based on account balance
    MAX_TRADES_100_60 = 10   # $100 - $60 account
    MAX_TRADES_50_30 = 5    # $50 - $30 account
    MAX_TRADES_20_10 = 3    # $20 - $10 account

    # Maximum lot size based on account balance
    MAX_LOT_SIZE_100_60 = 0.02  # $100 - $60 account
    MAX_LOT_SIZE_50_10 = 0.01   # $50 - $10 account

    # Signal age threshold (reject signals older than this)
    MAX_SIGNAL_AGE_MINUTES = 5

    def __init__(self, connector):
        """
        Initialize RiskManager with MT5 connector.
        
        Args:
            connector: MT5Connector instance for checking connection and account info
        """
        self.connector = connector

    # ============================================================================
    # MAIN VALIDATION METHOD
    # ============================================================================

    def validate_signal(self, signal: TradingSignal, lot_size: float) -> Tuple[bool, str]:
        """
        Perform all risk checks on a trading signal.
        
        Args:
            signal: TradingSignal to validate
            lot_size: Proposed lot size for the trade
            
        Returns:
            Tuple of (is_valid, reason) where:
            - is_valid: True if signal passes all checks, False otherwise
            - reason: Description of why validation failed (empty if valid)
        """
        
        # Check 1: Account connection
        if not self._check_connection():
            return False, "Account is disconnected from MT5."

        # Check 2: AutoTrading enabled
        if not self._check_autotrading():
            return False, "AutoTrading is disabled in MT5 terminal."

        # Check 3: Market is open
        if not self._check_market_open():
            return False, "Market is closed for trading."

        # Check 4: Signal age
        if not self._check_signal_age(signal):
            return False, f"Signal is too old (>{self.MAX_SIGNAL_AGE_MINUTES} minutes)."

        # Check 5: Account balance-based trade limits
        if not self._check_trade_limits():
            return False, "Maximum open trades limit reached for account balance."

        # Check 6: Account balance-based lot size limits
        if not self._check_lot_size_limits(lot_size):
            return False, "Lot size exceeds maximum allowed for account balance."

        # Check 7: Duplicate pending orders
        if signal.order_type == "PENDING":
            if not self._check_duplicate_pending(signal):
                return False, "Duplicate pending order already exists for this entry."

        # All checks passed
        return True, ""

    # ============================================================================
    # INDIVIDUAL RISK CHECKS
    # ============================================================================

    def _check_connection(self) -> bool:
        """
        Check if MT5 account is connected.
        
        Returns:
            True if connected, False otherwise
        """
        return self.connector.is_connected()

    def _check_autotrading(self) -> bool:
        """
        Check if AutoTrading is enabled in MT5 terminal.
        
        Returns:
            True if AutoTrading is enabled, False otherwise
        """
        terminal_info = mt5.terminal_info()
        if terminal_info is None:
            logger.error("Unable to get terminal info.")
            return False

        return terminal_info.trade_allowed

    def _check_market_open(self) -> bool:
        """
        Check if the market is currently open for trading.

        Returns:
            True if market is open, False otherwise
        """
        # Ensure symbol is available and selected
        symbol_info = mt5.symbol_info(SYMBOL)
        if symbol_info is None:
            logger.error(f"Symbol {SYMBOL} not found in MT5.")
            return False

        if not symbol_info.visible:
            logger.info(f"Selecting symbol {SYMBOL}...")
            if not mt5.symbol_select(SYMBOL, True):
                logger.error(f"Unable to select {SYMBOL}.")
                return False

        symbol_tick = mt5.symbol_info_tick(SYMBOL)
        if symbol_tick is None:
            logger.error("Unable to get symbol tick for market check.")
            return False

        # Market is open if we can get current time and bid/ask prices
        return symbol_tick.time > 0 and symbol_tick.bid > 0 and symbol_tick.ask > 0

    def _check_signal_age(self, signal: TradingSignal) -> bool:
        """
        Check if the signal is not too old.
        
        Args:
            signal: TradingSignal to check
            
        Returns:
            True if signal is within age limit, False otherwise
        """
        signal_age = datetime.utcnow() - signal.timestamp
        max_age = timedelta(minutes=self.MAX_SIGNAL_AGE_MINUTES)
        
        return signal_age <= max_age

    def _check_trade_limits(self) -> bool:
        """
        Check if the number of open trades is within limits based on account balance.
        
        Returns:
            True if within limits, False otherwise
        """
        account_info = mt5.account_info()
        if account_info is None:
            logger.error("Unable to get account info for trade limit check.")
            return False

        balance = account_info.balance
        
        # Get current open positions
        positions = mt5.positions_get()
        if positions is None:
            open_trades = 0
        else:
            open_trades = len(positions)

        # Determine max trades based on balance
        if balance >= 60:
            max_trades = self.MAX_TRADES_100_60
        elif balance >= 30:
            max_trades = self.MAX_TRADES_50_30
        else:
            max_trades = self.MAX_TRADES_20_10

        logger.info(f"Balance: ${balance:.2f}, Open trades: {open_trades}/{max_trades}")

        return open_trades < max_trades

    def _check_lot_size_limits(self, lot_size: float) -> bool:
        """
        Check if the proposed lot size is within limits based on account balance.
        
        Args:
            lot_size: Proposed lot size
            
        Returns:
            True if within limits, False otherwise
        """
        account_info = mt5.account_info()
        if account_info is None:
            logger.error("Unable to get account info for lot size check.")
            return False

        balance = account_info.balance

        # Determine max lot size based on balance
        if balance >= 60:
            max_lot = self.MAX_LOT_SIZE_100_60
        else:
            max_lot = self.MAX_LOT_SIZE_50_10

        logger.info(f"Balance: ${balance:.2f}, Lot size: {lot_size}/{max_lot}")

        return lot_size <= max_lot

    def _check_duplicate_pending(self, signal: TradingSignal) -> bool:
        """
        Check if a duplicate pending order already exists for this signal.
        
        Args:
            signal: TradingSignal to check
            
        Returns:
            True if no duplicate exists, False if duplicate found
        """
        # Get all pending orders
        orders = mt5.orders_get()
        if orders is None:
            return True  # No orders, so no duplicate

        # Check for orders with same symbol, direction, and entry price
        for order in orders:
            if (
                order.symbol == SYMBOL and
                abs(order.price_current - signal.entry) < 0.01  # Allow small price tolerance
            ):
                logger.warning(f"Duplicate pending order found: Order #{order.ticket}")
                return False

        return True

    # ============================================================================
    # UTILITY METHODS
    # ============================================================================

    def get_account_balance(self) -> Optional[float]:
        """
        Get current account balance.
        
        Returns:
            Account balance as float, or None if unable to retrieve
        """
        account_info = mt5.account_info()
        if account_info is None:
            return None
        return account_info.balance

    def get_open_trades_count(self) -> int:
        """
        Get the number of currently open trades.
        
        Returns:
            Number of open positions
        """
        positions = mt5.positions_get()
        if positions is None:
            return 0
        return len(positions)
