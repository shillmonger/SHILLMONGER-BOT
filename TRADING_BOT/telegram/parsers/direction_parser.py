"""
Direction parser for Telegram trading signals.

Extracts and normalizes trade direction from messages.
"""

import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class DirectionParser:
    """
    Extracts and normalizes trade direction.
    
    Supported formats:
    - BUY
    - SELL
    - LONG
    - SHORT
    - BULLISH
    - BEARISH
    
    Normalized to: BUY or SELL
    """

    # Direction patterns
    PATTERNS = [
        # BUY, SELL
        re.compile(r'\b(BUY|SELL)\b', re.IGNORECASE),
        # LONG, SHORT
        re.compile(r'\b(LONG|SHORT)\b', re.IGNORECASE),
        # BULLISH, BEARISH
        re.compile(r'\b(BULLISH|BEARISH)\b', re.IGNORECASE),
    ]

    def extract(self, message: str) -> Optional[str]:
        """
        Extract direction from message.
        
        Args:
            message: Normalized message text
            
        Returns:
            Normalized direction ('BUY' or 'SELL') or None if not found
        """
        for pattern in self.PATTERNS:
            match = pattern.search(message)
            if match:
                raw_direction = match.group(1).upper()
                normalized = self._normalize(raw_direction)
                logger.debug(f"Direction extracted: {raw_direction} -> {normalized}")
                return normalized

        logger.debug("No direction detected")
        return None

    def _normalize(self, direction: str) -> str:
        """
        Normalize direction to standard format.
        
        Args:
            direction: Raw direction string
            
        Returns:
            Normalized direction ('BUY' or 'SELL')
        """
        # Map bullish/long to BUY
        if direction in ['LONG', 'BULLISH']:
            return 'BUY'
        
        # Map bearish/short to SELL
        if direction in ['SHORT', 'BEARISH']:
            return 'SELL'
        
        # BUY and SELL are already normalized
        return direction
