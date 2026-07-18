"""
Stop Loss parser for Telegram trading signals.

Extracts stop loss values from messages.
"""

import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class StopLossParser:
    """
    Extracts stop loss from messages.
    
    Supported formats:
    - SL 4065
    - SL:4065
    - SL =4065
    - STOPLOSS 4065
    - STOP LOSS 4065
    - STOP:4065
    - 🛑4065
    """

    # Stop loss patterns
    PATTERNS = [
        # SL 4065 (without separator)
        re.compile(r'\bSL\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # SL 4065, SL:4065, SL =4065 (with separator)
        re.compile(r'\bSL\s*[:\-=@]\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # S/L 4065 (without separator)
        re.compile(r'\bS/L\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # S/L 4065, S/L:4065 (with separator)
        re.compile(r'\bS/L\s*[:\-=@]\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # STOPLOSS 4065
        re.compile(r'\bSTOPLOSS\s*[:\-=@]?\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # STOP LOSS 4065
        re.compile(r'\bSTOP\s+LOSS\s*[:\-=@]?\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # STOP:4065
        re.compile(r'\bSTOP\s*[:\-=@]\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # 🛑4065, 🛑 4065
        re.compile(r'🛑\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
    ]

    def extract(self, message: str) -> Optional[float]:
        """
        Extract stop loss from message.
        
        Args:
            message: Normalized message text
            
        Returns:
            Stop loss price or None if not found
        """
        for pattern in self.PATTERNS:
            match = pattern.search(message)
            if match:
                try:
                    sl_value = float(match.group(1))
                    logger.debug(f"Stop loss extracted: {sl_value}")
                    return sl_value
                except (ValueError, IndexError):
                    continue

        logger.debug("No stop loss detected")
        return None
