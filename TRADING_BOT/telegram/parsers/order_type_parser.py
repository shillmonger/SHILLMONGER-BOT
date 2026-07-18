"""
Order type parser for Telegram trading signals.

Detects order type from message content and keywords.
"""

import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class OrderTypeParser:
    """
    Detects order type from message.
    
    Supported formats:
    - BUY
    - SELL
    - BUY NOW
    - SELL NOW
    - BUY LIMIT
    - SELL LIMIT
    - BUY STOP
    - SELL STOP
    - BUY ZONE
    - SELL ZONE
    - BUY ENTRY
    - SELL ENTRY
    
    Returns:
    - MARKET
    - BUY_LIMIT
    - SELL_LIMIT
    - BUY_STOP
    - SELL_STOP
    """

    # Order type patterns
    PATTERNS = [
        # BUY NOW, SELL NOW
        re.compile(r'\b(BUY|SELL)\s+NOW\b', re.IGNORECASE),
        # BUY LIMIT, SELL LIMIT
        re.compile(r'\b(BUY|SELL)\s+LIMIT\b', re.IGNORECASE),
        # BUY STOP, SELL STOP
        re.compile(r'\b(BUY|SELL)\s+STOP\b', re.IGNORECASE),
        # BUY ZONE, SELL ZONE
        re.compile(r'\b(BUY|SELL)\s+ZONE\b', re.IGNORECASE),
        # BUY ENTRY, SELL ENTRY
        re.compile(r'\b(BUY|SELL)\s+ENTRY\b', re.IGNORECASE),
    ]

    def extract(self, message: str, direction: Optional[str] = None) -> str:
        """
        Extract order type from message.
        
        Args:
            message: Normalized message text
            direction: Normalized direction (BUY or SELL) if already known
            
        Returns:
            Order type string
        """
        for pattern in self.PATTERNS:
            match = pattern.search(message)
            if match:
                raw_direction = match.group(1).upper()
                raw_order_type = match.group(0).upper()
                normalized = self._normalize(raw_direction, raw_order_type)
                logger.debug(f"Order type extracted: {raw_order_type} -> {normalized}")
                return normalized

        # Default to MARKET if direction is known, otherwise PENDING
        if direction:
            logger.debug(f"No explicit order type, defaulting to MARKET for {direction}")
            return 'MARKET'
        
        logger.debug("No order type detected, defaulting to PENDING")
        return 'PENDING'

    def _normalize(self, direction: str, raw_order_type: str) -> str:
        """
        Normalize order type to standard format.
        
        Args:
            direction: Direction (BUY or SELL)
            raw_order_type: Raw order type string from match
            
        Returns:
            Normalized order type
        """
        direction = direction.upper()
        
        if 'NOW' in raw_order_type:
            return 'MARKET'
        elif 'LIMIT' in raw_order_type:
            return f'{direction}_LIMIT'
        elif 'STOP' in raw_order_type:
            return f'{direction}_STOP'
        elif 'ZONE' in raw_order_type or 'ENTRY' in raw_order_type:
            # ZONE and ENTRY are typically treated as LIMIT orders
            return f'{direction}_LIMIT'
        
        return 'MARKET'
