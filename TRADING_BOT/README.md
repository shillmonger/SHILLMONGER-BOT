# Trading Bot

A Telegram-based trading bot that listens to trading signals from Telegram groups and executes trades via MetaTrader 5.

## Features

- Listen to multiple Telegram groups for trading signals
- Parse trading signals (symbol, action, stop loss, take profit)
- Execute trades automatically via MetaTrader 5
- Risk management and position sizing
- Logging and session tracking

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables in `.env`:
```
API_ID=your_api_id
API_HASH=your_api_hash
PHONE_NUMBER=your_phone_number
MT5_LOGIN=your_mt5_login
MT5_PASSWORD=your_mt5_password
MT5_SERVER=your_mt5_server
```

3. Run the bot:
```bash
python main.py
```

# Terminal 1 - Master Trading Bot
python TRADING_BOT/main.py

# Terminal 2 - API Server (for validation)
python TRADING_BOT/run_api.py

# Terminal 3 - Copy Engine
python TRADING_BOT/run_copy_engine

## Tools

The `tools/` directory contains utility scripts for testing and configuration:

### List Telegram Groups
Lists all your Telegram groups and channels with their IDs:
```bash
python tools/list_groups.py
```

### Test MT5 Connection
Tests the connection to your MetaTrader 5 terminal:
```bash
python tools/test_mt5.py
```

### Test Trade Execution
Tests placing a trade on MT5 (use with caution):
```bash
python tools/test_trade.py
```

## Structure

- `telegram/` - Telegram listener and parser
- `mt5/` - MetaTrader 5 connector and trader
- `core/` - Core utilities (logger, models, utils)
- `data/` - Configuration files (groups, signals)
- `logs/` - Application logs
- `sessions/` - Session data
