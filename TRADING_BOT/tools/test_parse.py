import re
from telegram.parser import SignalParser

# Example signal
message = """GOLD BUY 4072.4071

TP 4080
TP 4090
TP 4150

SL 4065"""

parser = SignalParser()

print("=" * 80)
print("PARSER INVESTIGATION TEST")
print("=" * 80)
print()

print("Original message:")
print(repr(message))
print()

# Step 1: Clean message
cleaned_message = parser._clean_message(message)
print("Step 1: Cleaned message:")
print(repr(cleaned_message))
print()

# Step 2: Check non-trading patterns
print("Step 2: Non-trading message check:")
is_non_trading = parser._is_non_trading_message(cleaned_message)
print(f"Is non-trading: {is_non_trading}")
print()

# Step 3: Symbol extraction
print("Step 3: Symbol extraction:")
symbol_match = parser.SYMBOL_PATTERN.search(cleaned_message)
print(f"Symbol pattern: {parser.SYMBOL_PATTERN.pattern}")
if symbol_match:
    print(f"Symbol match: {symbol_match.group()}")
    raw_symbol = symbol_match.group(1).upper()
    symbol = parser._normalize_symbol(raw_symbol)
    print(f"Raw symbol: {raw_symbol}")
    print(f"Normalized symbol: {symbol}")
else:
    print("No symbol match")
print()

# Step 4: Direction extraction
print("Step 4: Direction extraction:")
direction, order_type, confidence = parser._extract_direction_and_order_type(cleaned_message)
print(f"Direction: {direction}")
print(f"Order type: {order_type}")
print(f"Confidence: {confidence}")
print()

# Step 5: Entry extraction
print("Step 5: Entry extraction:")
entry, entry_confidence = parser._extract_entry_with_confidence(cleaned_message)
print(f"Entry: {entry}")
print(f"Entry confidence: {entry_confidence}")
print("Testing all entry patterns:")
for i, pattern in enumerate(parser.ENTRY_PATTERNS):
    match = pattern.search(cleaned_message)
    if match:
        print(f"  Pattern {i} matched: {pattern.pattern}")
        print(f"    Match: {match.group()}")
        print(f"    Groups: {match.groups()}")
print()

# Step 6: SL extraction
print("Step 6: Stop Loss extraction:")
print(f"SL pattern: {parser.SL_PATTERN.pattern}")
sl_match = parser.SL_PATTERN.search(cleaned_message)
if sl_match:
    print(f"SL match: {sl_match.group()}")
    print(f"SL value: {sl_match.group(1)}")
else:
    print("No SL match")
print()

# Step 7: TP extraction
print("Step 7: Take Profit extraction:")
print(f"TP pattern: {parser.TP_PATTERN.pattern}")
tp_matches = parser.TP_PATTERN.findall(cleaned_message)
print(f"TP matches: {tp_matches}")
print(f"Number of TP matches: {len(tp_matches)}")
print()

# Test individual TP formats
print("Testing individual TP formats:")
test_formats = [
    "TP 4080",
    "TP: 4080",
    "TP1 4080",
    "TP1: 4080",
    "Take Profit 4080",
]
for test_format in test_formats:
    match = parser.TP_PATTERN.search(test_format)
    print(f"  '{test_format}' -> Match: {match.group() if match else 'NO MATCH'}")
print()

# Test with the actual message lines
print("Testing TP pattern on actual message lines:")
for line in cleaned_message.split('\n'):
    if 'TP' in line.upper():
        match = parser.TP_PATTERN.search(line)
        print(f"  Line: '{line}' -> Match: {match.group() if match else 'NO MATCH'}")
print()

# Step 8: Final state
print("=" * 80)
print("INTERMEDIATE PARSER STATE:")
print("=" * 80)
print(f"Symbol: {symbol}")
print(f"Direction: {direction}")
print(f"Order type: {order_type}")
print(f"Entry: {entry}")
print(f"Stop loss: {float(sl_match.group(1)) if sl_match else None}")
print(f"Take profits: {[float(tp) for tp in tp_matches] if tp_matches else []}")
print()

# Step 9: Full parse attempt
print("=" * 80)
print("FULL PARSE ATTEMPT:")
print("=" * 80)
signal = parser.parse(message, chat_id=123, group_name="TestGroup")
if signal:
    print("Signal parsed successfully!")
    print(f"Symbol: {signal.symbol}")
    print(f"Direction: {signal.direction}")
    print(f"Entry: {signal.entry}")
    print(f"Stop loss: {signal.stop_loss}")
    print(f"Take profits: {signal.take_profits}")
    print(f"Order type: {signal.order_type}")
    print(f"Confidence: {signal.confidence}")
else:
    print("Signal parsing returned None (rejected)")
