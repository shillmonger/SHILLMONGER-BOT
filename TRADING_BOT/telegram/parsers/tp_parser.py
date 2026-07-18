"""
Take Profit parser for Telegram trading signals.

Extracts take profit values from messages.
"""

import re
import logging
from typing import List

logger = logging.getLogger(__name__)


class TakeProfitParser:
    """
    Extracts take profit levels from messages.
    
    Supported formats:
    - TP 4080
    - TP:4080
    - TP =4080
    - TP-4080
    - TP @4080
    - TP1 4080
    - TP2 4090
    - TP3 4100
    - TP1:4080
    - TARGET 4080
    - TARGET1 4080
    - TARGET:4080
    - TAKE PROFIT 4080
    - 🎯4080
    - 🎯 4080
    
    Collects ALL TP values in order.
    """

    # Take profit patterns - ordered by specificity
    PATTERNS = [
        # TP1 4080, TP2 4090, TP3 4100 (numbered without separator)
        re.compile(r'\bTP\d*\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # TP1:4080, TP2:4090 (numbered with separator)
        re.compile(r'\bTP\d*\s*[:\-=@]\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # TARGET1 4080, TARGET2 4090 (numbered)
        re.compile(r'\bTARGET\d*\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # TARGET:4080 (with separator)
        re.compile(r'\bTARGET\s*[:\-=@]\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # TAKE PROFIT 4080
        re.compile(r'\bTAKE\s+PROFIT\s*[:\-=@]?\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # TP 4080 (without separator)
        re.compile(r'\bTP\s+(\d+(?:\.\d+)?)', re.IGNORECASE),
        # TP:4080 (with separator)
        re.compile(r'\bTP\s*[:\-=@]\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
        # 🎯4080, 🎯 4080
        re.compile(r'🎯\s*(\d+(?:\.\d+)?)', re.IGNORECASE),
    ]

    def extract(self, message: str) -> List[float]:
        """
        Extract all take profit values from message.
        
        Args:
            message: Normalized message text
            
        Returns:
            List of take profit prices in order of appearance
        """
        take_profits = []
        
        # Try each pattern and collect all matches
        for pattern in self.PATTERNS:
            matches = pattern.findall(message)
            for match in matches:
                try:
                    tp_value = float(match)
                    # Avoid duplicates while preserving order
                    if tp_value not in take_profits:
                        take_profits.append(tp_value)
                        logger.debug(f"Take profit extracted: {tp_value}")
                except (ValueError, TypeError):
                    continue

        logger.debug(f"Total take profits extracted: {len(take_profits)} - {take_profits}")
        return take_profits

    def extract_all(self, message: str) -> List[float]:
        """
        Extract all take profit values including duplicates.
        
        Use this when you want to preserve exact order including duplicates.
        
        Args:
            message: Normalized message text
            
        Returns:
            List of take profit prices in exact order of appearance
        """
        take_profits = []
        
        # Collect all matches from all patterns
        all_matches = []
        for pattern in self.PATTERNS:
            matches = pattern.finditer(message)
            for match in matches:
                all_matches.append((match.start(), match.group(1)))
        
        # Sort by position in message
        all_matches.sort(key=lambda x: x[0])
        
        # Extract values in order
        for _, value in all_matches:
            try:
                tp_value = float(value)
                take_profits.append(tp_value)
                logger.debug(f"Take profit extracted: {tp_value}")
            except (ValueError, TypeError):
                continue

        logger.debug(f"Total take profits extracted: {len(take_profits)} - {take_profits}")
        return take_profits
