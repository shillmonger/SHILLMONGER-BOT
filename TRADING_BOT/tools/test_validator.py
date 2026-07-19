import MetaTrader5 as mt5
import time

path = r"C:\Program Files\MT5_Master\terminal64.exe"

print("Initializing...")

if mt5.initialize(path=path, timeout=60000):
    print("SUCCESS")
    print(mt5.version())
    mt5.shutdown()
else:
    print("FAILED")
    print(mt5.last_error())