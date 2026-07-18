"""
Message normalizer for Telegram trading signals.

Handles text normalization, Unicode conversion, and format standardization.
"""

import re
import logging

logger = logging.getLogger(__name__)


class MessageNormalizer:
    """
    Normalizes Telegram messages for consistent parsing.
    
    Responsibilities:
    - Convert text to uppercase
    - Normalize line endings
    - Remove duplicate blank lines
    - Remove duplicate spaces
    - Replace fancy Unicode punctuation
    - Replace smart quotes
    - Replace interfering emojis
    - Normalize separators
    """

    # Unicode punctuation mappings
    UNICODE_PUNCTUATION = {
        '：': ':',
        '；': ';',
        '，': ',',
        '。': '.',
        '！': '!',
        '？': '?',
        '—': '-',
        '–': '-',
        '―': '-',
        '•': '*',
        '●': '*',
        '◆': '*',
        '▪': '*',
    }

    # Smart quotes
    SMART_QUOTES = {
        '"': '"',
        '"': '"',
        ''': "'",
        ''': "'",
        '`': "'",
        '´': "'",
    }

    # Emojis that interfere with parsing (keep trading emojis like 🎯)
    INTERFERING_EMOJIS = [
        r'[\U0001F600-\U0001F64F]',  # emoticons
        r'[\U0001F300-\U0001F5FF]',  # symbols & pictographs (except trading ones)
        r'[\U0001F680-\U0001F6FF]',  # transport & map symbols
        r'[\U0001F1E0-\U0001F1FF]',  # flags
        r'[\U00002702-\U000027B0]',  # dingbats
        r'[\U000024C2-\U0001F251]',  # enclosed characters
    ]

    # Trading-related emojis to preserve (will be handled by parsers)
    TRADING_EMOJIS = ['🎯', '🛑', '🟢', '🔴', '⬆️', '⬇️', '📈', '📉']

    def normalize(self, message: str) -> str:
        """
        Normalize a Telegram message for parsing.
        
        Args:
            message: Raw Telegram message
            
        Returns:
            Normalized message string
        """
        if not message:
            return ""

        logger.debug(f"Original message: {repr(message[:100])}")

        # Step 1: Convert to uppercase
        normalized = message.upper()

        # Step 2: Replace Unicode punctuation
        for unicode_char, ascii_char in self.UNICODE_PUNCTUATION.items():
            normalized = normalized.replace(unicode_char, ascii_char)

        # Step 3: Replace smart quotes
        for smart_quote, ascii_quote in self.SMART_QUOTES.items():
            normalized = normalized.replace(smart_quote, ascii_quote)

        # Step 4: Normalize line endings to \n
        normalized = normalized.replace('\r\n', '\n').replace('\r', '\n')

        # Step 5: Remove interfering emojis (preserve trading emojis)
        for pattern in self.INTERFERING_EMOJIS:
            # Remove emojis that are not in our trading emoji list
            def keep_trading_emoji(match):
                char = match.group()
                return char if char in self.TRADING_EMOJIS else ''
            normalized = re.sub(pattern, keep_trading_emoji, normalized)

        # Step 6: Normalize separators
        # Replace multiple separators with single colon
        normalized = re.sub(r'[:=]\s*[:=]', ':', normalized)
        # Replace separator combinations like : = with :
        normalized = re.sub(r'[:\-=@]\s*[:\-=@]', ':', normalized)

        # Step 7: Remove duplicate blank lines
        lines = normalized.split('\n')
        non_empty_lines = [line for line in lines if line.strip()]
        # Preserve structure but remove consecutive empty lines
        cleaned_lines = []
        prev_empty = False
        for line in lines:
            is_empty = not line.strip()
            if is_empty and prev_empty:
                continue
            cleaned_lines.append(line)
            prev_empty = is_empty
        normalized = '\n'.join(cleaned_lines)

        # Step 8: Remove duplicate spaces (but preserve newlines)
        normalized = re.sub(r'[ \t]+', ' ', normalized)

        # Step 9: Clean up spaces around separators
        normalized = re.sub(r'\s*[:\-=@]\s*', ': ', normalized)
        normalized = re.sub(r'\s*/\s*', ' / ', normalized)

        # Step 10: Remove leading/trailing whitespace from each line
        lines = normalized.split('\n')
        lines = [line.strip() for line in lines]
        normalized = '\n'.join(lines)

        # Step 11: Remove trailing whitespace
        normalized = normalized.strip()

        logger.debug(f"Normalized message: {repr(normalized[:100])}")

        return normalized

    def preserve_structure(self, message: str) -> str:
        """
        Normalize while preserving more structure for complex formats.
        
        Use this for messages with multi-line zones or complex layouts.
        """
        if not message:
            return ""

        # Less aggressive normalization
        normalized = message.upper()

        # Replace Unicode punctuation
        for unicode_char, ascii_char in self.UNICODE_PUNCTUATION.items():
            normalized = normalized.replace(unicode_char, ascii_char)

        # Replace smart quotes
        for smart_quote, ascii_quote in self.SMART_QUOTES.items():
            normalized = normalized.replace(smart_quote, ascii_quote)

        # Normalize line endings
        normalized = normalized.replace('\r\n', '\n').replace('\r', '\n')

        # Remove interfering emojis
        for pattern in self.INTERFERING_EMOJIS:
            def keep_trading_emoji(match):
                char = match.group()
                return char if char in self.TRADING_EMOJIS else ''
            normalized = re.sub(pattern, keep_trading_emoji, normalized)

        return normalized.strip()
