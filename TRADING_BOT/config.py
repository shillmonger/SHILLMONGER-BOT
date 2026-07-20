from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env from TRADING_BOT directory
script_dir = Path(__file__).parent
env_path = script_dir / ".env"
load_dotenv(env_path)

API_ID = int(os.getenv("API_ID"))
API_HASH = os.getenv("API_HASH")

PHONE_NUMBER = os.getenv("PHONE_NUMBER")

MT5_LOGIN = int(os.getenv("MT5_LOGIN"))
MT5_PASSWORD = os.getenv("MT5_PASSWORD")
MT5_SERVER = os.getenv("MT5_SERVER")

LOT_SIZE = float(os.getenv("LOT_SIZE"))

SYMBOL = os.getenv("SYMBOL")

MONGODB_URI = os.getenv("MONGODB_URI")