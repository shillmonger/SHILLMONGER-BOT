import MetaTrader5 as mt5

# Initialize MT5
if not mt5.initialize():
    print(f"MT5 initialize failed: {mt5.last_error()}")
    exit()

# Try different symbol names
symbols = ["XAUUSD", "XAUUSDm", "GOLD"]

for symbol in symbols:
    info = mt5.symbol_info(symbol)
    if info:
        print(f"\n=== Symbol: {symbol} ===")
        print("point:", info.point)
        print("digits:", info.digits)
        print("trade_tick_size:", info.trade_tick_size)
        print("trade_tick_value:", info.trade_tick_value)
        print("trade_contract_size:", info.trade_contract_size)
        break
else:
    print("Failed to get symbol info for any of:", symbols)

mt5.shutdown()
