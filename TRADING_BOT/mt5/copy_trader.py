import MetaTrader5 as mt5
from core.logger import logger
from core.models import TradeResult


class MT5CopyTrader:
    """
    Handles trade execution on user accounts for the copy engine.
    """

    MAGIC_NUMBER = 20260714  # Different magic number for copied trades

    def __init__(self, connector):
        self.connector = connector

    def execute_copy_trade(self, master_trade, lot_size: float) -> TradeResult:
        """
        Execute a copy trade on the connected user account.
        """
        if not self.connector.is_connected():
            return TradeResult(
                success=False,
                message="MT5 Copy Engine is not connected."
            )

        symbol = master_trade["symbol"]

        # Ensure symbol is available
        symbol_info = mt5.symbol_info(symbol)

        if symbol_info is None:
            return TradeResult(
                success=False,
                message=f"Symbol {symbol} not found."
            )

        if not symbol_info.visible:
            if not mt5.symbol_select(symbol, True):
                return TradeResult(
                    success=False,
                    message=f"Unable to select {symbol}."
                )

        tick = mt5.symbol_info_tick(symbol)

        if tick is None:
            return TradeResult(
                success=False,
                message="Unable to obtain market price."
            )

        # Determine order type and price based on master trade
        trade_type = master_trade["type"].upper()
        
        if trade_type == "BUY":
            order_type = mt5.ORDER_TYPE_BUY
            price = tick.ask
            trade_action = mt5.TRADE_ACTION_DEAL
            type_filling = mt5.ORDER_FILLING_IOC
        elif trade_type == "SELL":
            order_type = mt5.ORDER_TYPE_SELL
            price = tick.bid
            trade_action = mt5.TRADE_ACTION_DEAL
            type_filling = mt5.ORDER_FILLING_IOC
        else:
            return TradeResult(
                success=False,
                message=f"Unknown trade type: {trade_type}"
            )

        request = {
            "action": trade_action,
            "symbol": symbol,
            "volume": lot_size,
            "type": order_type,
            "price": price,
            "sl": master_trade.get("sl"),
            "tp": master_trade.get("tp", [])[0] if master_trade.get("tp") else None,
            "deviation": 20,
            "magic": self.MAGIC_NUMBER,
            "comment": f"Copy from Master #{master_trade['master_ticket']}",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": type_filling,
        }

        result = mt5.order_send(request)

        if result is None:
            return TradeResult(
                success=False,
                message="order_send() returned None."
            )

        if result.retcode != mt5.TRADE_RETCODE_DONE:
            logger.error(
                f"Copy trade failed for {symbol} | "
                f"Error: {result.retcode} | "
                f"Comment: {result.comment}"
            )
            return TradeResult(
                success=False,
                message=result.comment,
                error_code=result.retcode,
            )

        logger.success(
            f"Copy trade executed {trade_type} {symbol} | "
            f"User Ticket: {result.order} | "
            f"Master Ticket: {master_trade['master_ticket']}"
        )

        return TradeResult(
            success=True,
            ticket=result.order,
            symbol=symbol,
            direction=trade_type,
            entry_price=price,
            lot_size=lot_size,
            message="Copy trade executed successfully."
        )
