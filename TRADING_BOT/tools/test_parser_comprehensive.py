"""
Comprehensive test suite for the modular Telegram signal parser.

Tests all supported signal formats and verifies parser functionality.
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from telegram.parser import SignalParser


def test_signal(message: str, test_name: str, expected_success: bool = True):
    """
    Test a single signal message.
    
    Args:
        message: Signal message to test
        test_name: Name of the test
        expected_success: Whether parsing should succeed
    """
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")
    print(f"Message: {message}")
    print(f"{'-'*80}")
    
    parser = SignalParser()
    signal = parser.parse(message, chat_id=123, group_name="TestGroup")
    
    if signal:
        print("✓ PARSED SUCCESSFULLY")
        print(f"  Symbol: {signal.symbol}")
        print(f"  Direction: {signal.direction}")
        print(f"  Order Type: {signal.order_type}")
        print(f"  Entry: {signal.entry}")
        if signal.entry_high and signal.entry_low:
            print(f"  Entry Range: {signal.entry_low} - {signal.entry_high}")
        print(f"  Stop Loss: {signal.stop_loss}")
        print(f"  Take Profits: {signal.take_profits}")
        print(f"  Confidence: {signal.confidence}")
        
        if not expected_success:
            print("⚠ WARNING: Expected failure but parsing succeeded")
            return False
        return True
    else:
        print("✗ PARSING FAILED")
        
        if expected_success:
            print("⚠ WARNING: Expected success but parsing failed")
            return False
        return True


def run_all_tests():
    """Run all parser tests."""
    print("\n" + "="*80)
    print("COMPREHENSIVE PARSER TEST SUITE")
    print("="*80)
    
    results = []
    
    # Test 1: Original failing signal
    results.append(test_signal(
        """GOLD BUY 4072.4071

TP 4080
TP 4090
TP 4150

SL 4065""",
        "Original failing signal (TP without separator)",
        expected_success=True
    ))
    
    # Test 2: Basic XAUUSD BUY
    results.append(test_signal(
        "XAUUSD BUY 4053\nTP 4080\nSL 4045",
        "Basic XAUUSD BUY signal",
        expected_success=True
    ))
    
    # Test 3: BUY GOLD
    results.append(test_signal(
        "BUY GOLD 3995\nTP 4020\nSL 3980",
        "BUY GOLD signal",
        expected_success=True
    ))
    
    # Test 4: #XAUUSD BUY Zone
    results.append(test_signal(
        "#XAUUSD BUY Zone 4112-4080\nTP 4150\nTP 4200\nSL 4070",
        "#XAUUSD BUY Zone with range",
        expected_success=True
    ))
    
    # Test 5: Gold BUY with decimal
    results.append(test_signal(
        "Gold BUY 4112.5435\nTP 4150\nSL 4100",
        "Gold BUY with decimal entry",
        expected_success=True
    ))
    
    # Test 6: BUY NOW with range
    results.append(test_signal(
        "BUY NOW 4078-4075\nTP 4085\nTP 4090\nSL 4070",
        "BUY NOW with entry range",
        expected_success=True
    ))
    
    # Test 7: BUY @ price
    results.append(test_signal(
        "BUY @4072\nTP 4080\nSL 4065",
        "BUY @ price format",
        expected_success=True
    ))
    
    # Test 8: BUY BETWEEN
    results.append(test_signal(
        "BUY BETWEEN 4072 AND 4068\nTP 4080\nSL 4065",
        "BUY BETWEEN format",
        expected_success=True
    ))
    
    # Test 9: TP without separator
    results.append(test_signal(
        "GOLD BUY 4072\nTP 4080\nTP 4090\nSL 4065",
        "TP without separator",
        expected_success=True
    ))
    
    # Test 10: TP1 numbered format
    results.append(test_signal(
        "GOLD BUY 4072\nTP1 4080\nTP2 4090\nTP3 4100\nSL 4065",
        "TP1 numbered format",
        expected_success=True
    ))
    
    # Test 11: TARGET format
    results.append(test_signal(
        "GOLD BUY 4072\nTARGET 4080\nSL 4065",
        "TARGET format",
        expected_success=True
    ))
    
    # Test 12: 🎯 emoji TP
    results.append(test_signal(
        "GOLD BUY 4072\n🎯 4080\nSL 4065",
        "🎯 emoji TP",
        expected_success=True
    ))
    
    # Test 13: STOP LOSS format
    results.append(test_signal(
        "GOLD BUY 4072\nTP 4080\nSTOP LOSS 4065",
        "STOP LOSS format",
        expected_success=True
    ))
    
    # Test 14: SL: format
    results.append(test_signal(
        "GOLD BUY 4072\nTP 4080\nSL:4065",
        "SL: format",
        expected_success=True
    ))
    
    # Test 15: BUY LIMIT
    results.append(test_signal(
        "BUY LIMIT 4068\nTP 4080\nSL 4060",
        "BUY LIMIT signal",
        expected_success=True
    ))
    
    # Test 16: SELL STOP
    results.append(test_signal(
        "SELL STOP 4050\nTP 4020\nSL 4060",
        "SELL STOP signal",
        expected_success=True
    ))
    
    # Test 17: Multiple TP formats mixed
    results.append(test_signal(
        "GOLD BUY 4072\nTP 4080\nTP2 4090\nTARGET 4100\n🎯 4150\nSL 4065",
        "Mixed TP formats",
        expected_success=True
    ))
    
    # Test 18: Entry with TO
    results.append(test_signal(
        "BUY 4072 TO 4068\nTP 4080\nSL 4065",
        "Entry with TO format",
        expected_success=True
    ))
    
    # Test 19: Entry with slash
    results.append(test_signal(
        "BUY 4072 / 4068\nTP 4080\nSL 4065",
        "Entry with slash separator",
        expected_success=True
    ))
    
    # Test 20: ENTRY keyword
    results.append(test_signal(
        "GOLD BUY\nENTRY: 4072\nTP 4080\nSL 4065",
        "ENTRY keyword format",
        expected_success=True
    ))
    
    # Test 21: Non-trading message
    results.append(test_signal(
        "Join our VIP group for premium signals!",
        "Non-trading message (should fail)",
        expected_success=False
    ))
    
    # Test 22: Missing TP
    results.append(test_signal(
        "GOLD BUY 4072\nSL 4065",
        "Missing TP (should fail)",
        expected_success=False
    ))
    
    # Test 23: Missing SL
    results.append(test_signal(
        "GOLD BUY 4072\nTP 4080",
        "Missing SL (should fail)",
        expected_success=False
    ))
    
    # Test 24: TP with equals separator
    results.append(test_signal(
        "GOLD BUY 4072\nTP=4080\nSL=4065",
        "TP with equals separator",
        expected_success=True
    ))
    
    # Test 25: Long/Bearish direction
    results.append(test_signal(
        "GOLD LONG 4072\nTP 4080\nSL 4065",
        "LONG direction",
        expected_success=True
    ))
    
    # Test 26: SELL signal
    results.append(test_signal(
        "XAUUSD SELL 4050\nTP 4020\nSL 4060",
        "SELL signal",
        expected_success=True
    ))
    
    # Test 27: BUY ZONE
    results.append(test_signal(
        "BUY ZONE 4072-4068\nTP 4080\nSL 4065",
        "BUY ZONE format",
        expected_success=True
    ))
    
    # Test 28: Unicode punctuation
    results.append(test_signal(
        "GOLD BUY 4072\nTP：4080\nSL：4065",
        "Unicode colon separator",
        expected_success=True
    ))
    
    # Test 29: Complex multi-line signal
    results.append(test_signal(
        """🟢 GOLD BUY LIMIT
Entry: 4072-4068
TP1: 4080
TP2: 4090
TP3: 4150
SL: 4065""",
        "Complex multi-line signal with emojis",
        expected_success=True
    ))
    
    # Test 30: TAKE PROFIT full text
    results.append(test_signal(
        "GOLD BUY 4072\nTAKE PROFIT 4080\nSL 4065",
        "TAKE PROFIT full text",
        expected_success=True
    ))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    print(f"Failed: {total - passed}/{total}")
    
    if passed == total:
        print("✓ ALL TESTS PASSED")
    else:
        print("✗ SOME TESTS FAILED")
    
    print("="*80)
    
    return passed == total


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
