"""
Symbol parser for Telegram trading signals.

Extracts and normalizes trading symbols from messages.
"""

import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class SymbolParser:
    """
    Extracts and normalizes trading symbols.
    
    Supported formats:
    - XAUUSD
    - GOLD
    - #XAUUSD
    - XAU/USD
    - GOLD SIGNAL
    
    All normalized to: XAUUSD
    """

    # Symbol patterns
    PATTERNS = [
        # XAUUSD, GOLD, XAU, XAUUSDm
        re.compile(r'\b(XAUUSD|XAU/USD|XAU|GOLD|XAUUSDM)\b', re.IGNORECASE),
        # #XAUUSD, #GOLD
        re.compile(r'#(XAUUSD|XAU|GOLD)', re.IGNORECASE),
        # GOLD SIGNAL, XAUUSD SIGNAL
        re.compile(r'(XAUUSD|XAU|GOLD)\s+SIGNAL', re.IGNORECASE),
    ]

    def extract(self, message: str) -> Optional[str]:
        """
        Extract symbol from message.
        
        Args:
            message: Normalized message text
            
        Returns:
            Normalized symbol (e.g., 'XAUUSD') or None if not found
        """
        for pattern in self.PATTERNS:
            match = pattern.search(message)
            if match:
                raw_symbol = match.group(1).upper()
                normalized = self._normalize(raw_symbol)
                logger.debug(f"Symbol extracted: {raw_symbol} -> {normalized}")
                return normalized

        logger.debug("No symbol detected")
        return None

    def _normalize(self, symbol: str) -> str:
        """
        Normalize symbol to standard format.

        Args:
            symbol: Raw symbol string

        Returns:
            Normalized symbol
        """
        # Remove slashes
        normalized = symbol.replace('/', '')

        # Map common variations to XAUUSDm (MT5 symbol)
        if normalized in ['XAU', 'GOLD', 'XAUUSD', 'XAUUSDM']:
            return 'XAUUSDm'

        return normalized

    def is_supported(self, symbol: str) -> bool:
        """
        Check if a symbol is supported for trading.

        Args:
            symbol: Normalized symbol

        Returns:
            True if symbol is supported
        """
        return symbol == 'XAUUSDm'
