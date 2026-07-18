import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from mt5.connector import MT5Connector

connector = MT5Connector()

if connector.connect():

    account = connector.account_info()

    print(account)

    connector.disconnect()
