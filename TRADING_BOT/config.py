from dotenv import load_dotenv
import os

load_dotenv()

API_ID = int(os.getenv("API_ID"))
API_HASH = os.getenv("API_HASH")

PHONE_NUMBER = os.getenv("PHONE_NUMBER")

MT5_LOGIN = int(os.getenv("MT5_LOGIN"))
MT5_PASSWORD = os.getenv("MT5_PASSWORD")
MT5_SERVER = os.getenv("MT5_SERVER")

LOT_SIZE = float(os.getenv("LOT_SIZE"))

SYMBOL = os.getenv("SYMBOL")