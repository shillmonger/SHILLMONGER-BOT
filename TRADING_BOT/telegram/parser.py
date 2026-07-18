import re
import logging
from typing import Optional

from core.models import TradingSignal
from telegram.parsers import (
    MessageNormalizer,
    SymbolParser,
    DirectionParser,
    OrderTypeParser,
    EntryParser,
    StopLossParser,
    TakeProfitParser,
)

logger = logging.getLogger(__name__)


class SignalParser:
    """
    Orchestrates parsing of Telegram trading signals into TradingSignal objects.
    
    This parser uses a modular pipeline with specialized parsers for each component:
    1. Message normalization
    2. Order type detection
    3. Symbol extraction
    4. Direction extraction
    5. Entry extraction
    6. Stop loss extraction
    7. Take profit extraction
    8. Validation
    """

    # Non-trading message patterns to reject
    NON_TRADING_PATTERNS = [
        re.compile(r"(?i)(join|vip|premium|subscription|referral|invite|link)", re.IGNORECASE),
        re.compile(r"(?i)(youtube\.com|youtu\.be|t\.me|telegram\.org)", re.IGNORECASE),
        re.compile(r"(?i)(hello|hi|hey|good morning|good evening|welcome)", re.IGNORECASE),
        re.compile(r"(?i)(pnl|balance|equity|account|deposit|withdraw)", re.IGNORECASE),
    ]

    def __init__(self):
        """Initialize all parser components."""
        self.normalizer = MessageNormalizer()
        self.symbol_parser = SymbolParser()
        self.direction_parser = DirectionParser()
        self.order_type_parser = OrderTypeParser()
        self.entry_parser = EntryParser()
        self.sl_parser = StopLossParser()
        self.tp_parser = TakeProfitParser()

    def parse(
        self,
        message: str,
        chat_id: int,
        group_name: str
    ) -> Optional[TradingSignal]:
        """
        Parse a Telegram message into a TradingSignal object.
        
        Args:
            message: Raw Telegram message
            chat_id: Telegram chat ID
            group_name: Telegram group name
            
        Returns:
            TradingSignal object if parsing succeeds, None otherwise
        """
        logger.info("=" * 60)
        logger.info("Signal received")
        logger.info(f"Raw message: {message[:100]}...")
        logger.info("=" * 60)

        # Stage 1: Normalize message
        normalized_message = self.normalizer.normalize(message)
        logger.info("✓ Message normalized")

        # Check for non-trading messages
        if self._is_non_trading_message(normalized_message):
            logger.info("✗ Rejected: Non-trading message detected")
            return None

        # Stage 2: Detect order type
        order_type = self.order_type_parser.extract(normalized_message)
        logger.info(f"✓ Order type: {order_type}")

        # Stage 3: Extract symbol
        symbol = self.symbol_parser.extract(normalized_message)
        if not symbol:
            # Default to XAUUSD if symbol not explicitly mentioned
            symbol = "XAUUSD"
            logger.info("✓ No explicit symbol detected, defaulting to XAUUSD")
        else:
            logger.info(f"✓ Symbol detected: {symbol}")

        # Stage 4: Extract direction
        direction = self.direction_parser.extract(normalized_message)
        if not direction:
            logger.warning("✗ Direction not detected")
            self._log_rejection()
            return None
        logger.info(f"✓ Direction detected: {direction}")

        # Re-extract order type with direction context
        order_type = self.order_type_parser.extract(normalized_message, direction)
        logger.info(f"✓ Order type: {order_type}")

        # Stage 5: Extract entry
        entry_high, entry_low = self.entry_parser.extract(normalized_message)
        if entry_high is None:
            logger.warning("✗ Entry not detected")
            self._log_rejection()
            return None
        
        entry = self.entry_parser.get_average_entry(entry_high, entry_low)
        if entry_low is not None:
            logger.info(f"✓ Entry detected: {entry_low} - {entry_high} (avg: {entry})")
        else:
            logger.info(f"✓ Entry detected: {entry}")

        # Stage 6: Extract stop loss
        stop_loss = self.sl_parser.extract(normalized_message)
        if stop_loss is None:
            logger.warning("✗ Stop Loss not detected")
            self._log_rejection()
            return None
        logger.info(f"✓ Stop Loss detected: {stop_loss}")

        # Stage 7: Extract take profits
        take_profits = self.tp_parser.extract(normalized_message)
        if not take_profits:
            logger.warning("✗ Take Profit not detected")
            self._log_rejection()
            return None
        logger.info(f"✓ {len(take_profits)} Take Profit(s) detected: {take_profits}")

        # Calculate confidence score
        confidence = self._calculate_confidence(len(take_profits))
        logger.info(f"✓ Confidence score: {confidence}")

        logger.info("=" * 60)
        logger.info("Signal parsed successfully")
        logger.info("=" * 60)

        return TradingSignal(
            chat_id=chat_id,
            group_name=group_name,
            raw_message=message,
            symbol=symbol,
            direction=direction,
            entry=entry,
            entry_high=entry_high if entry_high != entry else None,
            entry_low=entry_low if entry_low != entry else None,
            stop_loss=stop_loss,
            take_profits=take_profits,
            order_type=order_type,
            confidence=confidence,
        )

    def _is_non_trading_message(self, message: str) -> bool:
        """
        Check if the message is clearly not a trading signal.
        """
        for pattern in self.NON_TRADING_PATTERNS:
            if pattern.search(message):
                return True
        return False

    def _calculate_confidence(self, tp_count: int) -> int:
        """
        Calculate confidence score based on parsing results.
        
        Args:
            tp_count: Number of take profits detected
            
        Returns:
            Confidence score (0-100)
        """
        # Base score for successfully extracting all components
        base_score = 90
        
        # Bonus for multiple TPs
        tp_bonus = min(tp_count * 3, 10)
        
        final_score = min(base_score + tp_bonus, 100)
        return final_score

    def _log_rejection(self):
        """Log rejection message."""
        logger.info("=" * 60)
        logger.info("Signal rejected")
        logger.info("=" * 60)