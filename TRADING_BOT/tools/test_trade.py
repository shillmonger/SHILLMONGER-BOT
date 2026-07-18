import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from mt5.connector import MT5Connector
from mt5.trader import MT5Trader

from core.models import TradingSignal


signal = TradingSignal(
    chat_id=1,
    group_name="Testing",
    raw_message="Manual Test",

    symbol="XAUUSD",

    direction="BUY",

    entry=4000,

    stop_loss=3950,

    take_profits=[4050],
)


connector = MT5Connector()

if connector.connect():

    trader = MT5Trader(connector)

    result = trader.execute_trade(signal)

    print(result)

    connector.disconnect()