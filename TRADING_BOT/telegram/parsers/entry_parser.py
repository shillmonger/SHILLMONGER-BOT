"""
Entry parser for Telegram trading signals.

Extracts entry prices from messages, supporting single prices and ranges.
"""

import re
import logging
from typing import Optional, Tuple

logger = logging.getLogger(__name__)


class EntryParser:
    """
    Extracts entry prices from messages.
    
    Supported formats:
    - 4072
    - 4072.5
    - 4072.50
    - BUY 4072
    - SELL 4072
    - BUY @4072
    - BUY @ 4072
    - ENTRY 4072
    - ENTRY:4072
    - ENTRY = 4072
    - BUY NOW 4072
    - BUY ZONE 4072-4068
    - BUY ZONE: 4072-4068
    - BUY 4072.4071
    - BUY 4072 / 4068
    - BUY 4072 TO 4068
    - BUY BETWEEN 4072 AND 4068
    
    Returns:
    - Single price: (price, None)
    - Range: (high_price, low_price)
    """

    # Entry patterns - ordered by specificity
    PATTERNS = [
        # BUY ZONE 4072-4068, SELL ZONE 4072-4068
        re.compile(r'\b(BUY|SELL)\s+ZONE\s*[:\s]*(\d+(?:\.\d+)?)\s*[-/]\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY BETWEEN 4072 AND 4068, SELL BETWEEN 4072 AND 4068
        re.compile(r'\b(BUY|SELL)\s+BETWEEN\s+(\d+(?:\.\d+)?)\s+AND\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY 4072 TO 4068, SELL 4072 TO 4068
        re.compile(r'\b(BUY|SELL)\s+(\d+(?:\.\d+)?)\s+TO\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY 4072.4071 (dot separator for range)
        re.compile(r'\b(BUY|SELL)\s+(\d+(?:\.\d+)?)\.(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY 4072 / 4068 (slash separator)
        re.compile(r'\b(BUY|SELL)\s+(\d+(?:\.\d+)?)\s*/\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # ENTRY 4072-4068, ENTRY: 4072-4068
        re.compile(r'\bENTRY\s*[:\s]*(\d+(?:\.\d+)?)\s*[-/]\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY @4072, SELL @4072
        re.compile(r'\b(BUY|SELL)\s+@\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY NOW 4072, SELL NOW 4072
        re.compile(r'\b(BUY|SELL)\s+NOW\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY LIMIT 4072, SELL LIMIT 4072
        re.compile(r'\b(BUY|SELL)\s+LIMIT\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY STOP 4072, SELL STOP 4072
        re.compile(r'\b(BUY|SELL)\s+STOP\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY 4072, SELL 4072
        re.compile(r'\b(BUY|SELL|LONG|SHORT)\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # XAUUSD BUY 4072, GOLD BUY 4072
        re.compile(r'(?:XAUUSD|XAU|GOLD)\s+(?:BUY|SELL|LONG|SHORT)\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # BUY GOLD 4072, SELL XAUUSD 4072, LONG GOLD 4072
        re.compile(r'(?:BUY|SELL|LONG|SHORT)\s+(?:XAUUSD|XAU|GOLD)\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # ENTRY 4072, ENTRY:4072, ENTRY = 4072
        re.compile(r'\bENTRY\s*[:\s=]+\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # PRICE 4072, PRICE:4072
        re.compile(r'\bPRICE\s*[:\s=]+\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # @4072 (standalone)
        re.compile(r'@\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # ZONE 4072-4068 (standalone)
        re.compile(r'\bZONE\s*[:\s]*(\d+(?:\.\d+)?)\s*[-/]\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # Fallback: any number after BUY/SELL/LIMIT/STOP/NOW
        re.compile(r'\b(?:BUY|SELL|LIMIT|STOP|NOW|ZONE|ENTRY|PRICE)[\s:@=]*(\d+(?:\.\d+)?)', re.IGNORECASE),
    ]

    def extract(self, message: str) -> Tuple[Optional[float], Optional[float]]:
        """
        Extract entry price(s) from message.
        
        Args:
            message: Normalized message text
            
        Returns:
            Tuple of (entry_high, entry_low)
            - Single price: (price, None)
            - Range: (high_price, low_price)
            - Not found: (None, None)
        """
        for pattern in self.PATTERNS:
            match = pattern.search(message)
            if match:
                groups = match.groups()
                
                # Handle range patterns (3 groups: direction, high, low)
                if len(groups) == 3 and all(groups):
                    try:
                        price1 = float(groups[1])
                        price2 = float(groups[2])
                        high, low = (price1, price2) if price1 > price2 else (price2, price1)
                        logger.debug(f"Entry range extracted: {low} - {high}")
                        return high, low
                    except (ValueError, IndexError):
                        continue
                
                # Handle range patterns without direction (2 groups: high, low)
                elif len(groups) == 2 and all(groups):
                    try:
                        price1 = float(groups[0])
                        price2 = float(groups[1])
                        high, low = (price1, price2) if price1 > price2 else (price2, price1)
                        logger.debug(f"Entry range extracted: {low} - {high}")
                        return high, low
                    except (ValueError, IndexError):
                        continue
                
                # Handle single price patterns
                elif len(groups) >= 1:
                    try:
                        # Findthe last numeric group (the price)
                        price = None
                        for group in reversed(groups):
                            if group and re.match(r'\d+(?:\.\d+)?', group):
                                price = float(group)
                                break
                        
                        if price:
                            logger.debug(f"Entry price extracted: {price}")
                            return price, None
                    except (ValueError, IndexError):
                        continue

        logger.debug("No entry detected")
        return None, None

    def get_average_entry(self, entry_high: Optional[float], entry_low: Optional[float]) -> Optional[float]:
        """
        Calculate average entry price from range.
        
        Args:
            entry_high: High entry price
            entry_low: Low entry price
            
        Returns:
            Average price or single price
        """
        if entry_high is None:
            return None
        
        if entry_low is None:
            return entry_high
        
        return (entry_high + entry_low) / 2
