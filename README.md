
# SHILLMONGER Trading Bot

A comprehensive trading bot system that copies trades from a master MT5 account to user-submitted accounts via Telegram signals.

## Architecture Overview

The system consists of three main components:

- **Frontend**: Next.js dashboard for user management and MT5 account connections
- **Backend API**: FastAPI server for MT5 validation and data management
- **Trading Bot**: Python bot that executes trades on master account and copies to user accounts

### MT5 Terminal Architecture

The system uses three separate MT5 terminal instances to prevent connection conflicts:

- **MT5_Master**: Always connected to your master trading account (executes trades from signals)
- **MT5_Validator**: Dedicated terminal for validating user MT5 credentials during connection
- **MT5_CopyEngine**: Future implementation for copying trades to user accounts

## Prerequisites

### System Requirements

- Windows Server (VPS) or Windows 10/11
- Python 3.10+
- Node.js 18+
- MongoDB (local or cloud)
- MetaTrader 5 terminal installations

### Required Accounts & Services

1. **Telegram Bot**: Create via @BotFather on Telegram
2. **Telegram API Credentials**: Get from my.telegram.org
3. **MongoDB**: MongoDB Atlas (cloud) or local installation
4. **MT5 Trading Account**: Your master Exness account
5. **Domain Name**: For frontend deployment (optional)

## Installation Guide

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd SMG-BOT
```

### 2. Telegram Setup

#### Create Telegram Bot
1. Open Telegram and search for @BotFather
2. Send `/newbot` and follow instructions
3. Save the bot token (format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

#### Get API Credentials
1. Visit https://my.telegram.org
2. Sign in with your phone number
3. Go to "API development tools"
4. Create a new application
5. Save:
   - `api_id` (numeric)
   - `api_hash` (string)

#### Add Bot to Trading Groups
1. Add your bot to the Telegram groups that provide trading signals
2. Make the bot an administrator in each group
3. Note the exact group names/IDs

### 3. MongoDB Setup

#### MongoDB Atlas (Recommended)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user with username and password
4. Whitelist your VPS IP address (0.0.0.0/0 for all)
5. Get connection string: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>`

#### Local MongoDB
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install with default settings
3. Connection string: `mongodb://localhost:27017/shillmonger`

### 4. MT5 Terminal Installation

#### Download MetaTrader 5
1. Download MT5 from https://www.metatrader5.com/en/download
2. Install to default location: `C:\Program Files\MetaTrader 5`

#### Install Three MT5 Instances

**MT5_Master Terminal**
```powershell
# Copy MT5 installation to Master directory
Copy-Item -Path "C:\Program Files\MetaTrader 5" -Destination "C:\Program Files\MT5_Master" -Recurse
```

**MT5_Validator Terminal**
```powershell
# Copy MT5 installation to Validator directory
Copy-Item -Path "C:\Program Files\MetaTrader 5" -Destination "C:\Program Files\MT5_Validator" -Recurse
```

**MT5_CopyEngine Terminal**
```powershell
# Copy MT5 installation to CopyEngine directory
Copy-Item -Path "C:\Program Files\MetaTrader 5" -Destination "C:\Program Files\MT5_CopyEngine" -Recurse
```

#### Configure MT5_Master Terminal
1. Launch `C:\Program Files\MT5_Master\terminal64.exe`
2. Login with your master Exness account credentials
3. Enable "Allow algorithmic trading" in Tools → Options → Expert Advisors
4. Enable "Allow WebRequest" for required URLs
5. Test connection to ensure it stays logged in

#### Configure MT5_Validator Terminal
1. Launch `C:\Program Files\MT5_Validator\terminal64.exe`
2. Close any login dialogs (will be used programmatically)
3. No permanent login required - used for temporary validation

#### Configure MT5_CopyEngine Terminal
1. Launch `C:\Program Files\MT5_CopyEngine\terminal64.exe`
2. Close any login dialogs (will be used programmatically for future copy engine)
3. No permanent login required currently

### 5. Python Environment Setup

#### Install Python 3.10
1. Download from https://www.python.org/downloads/
2. Install with "Add Python to PATH" enabled
3. Verify installation: `python --version`

#### Install Python Dependencies
```bash
cd TRADING_BOT
pip install -r requirements.txt
```

Required packages include:
- `fastapi` - API server
- `uvicorn` - ASGI server
- `pymongo` - MongoDB driver
- `python-telegram-bot` - Telegram integration
- `MetaTrader5` - MT5 Python API
- `pydantic` - Data validation
- `python-dotenv` - Environment variables

### 6. Frontend Setup

#### Install Node.js Dependencies
```bash
npm install
```

#### Configure Environment Variables
Create `.env.local` file in root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shillmonger

# NextAuth Secret (generate random string)
NEXTAUTH_SECRET=your-random-secret-string-here

# Bot API URL
NEXT_PUBLIC_BOT_API_URL=http://localhost:8000
```

### 7. Bot Configuration

#### Create TRADING_BOT/.env File
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shillmonger

# Telegram API Credentials
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
TELEGRAM_BOT_TOKEN=your_bot_token

# MT5 Master Account Credentials
MT5_LOGIN=your_master_login
MT5_PASSWORD=your_master_password
MT5_SERVER=Exness-MT5Real9  # or your specific server

# Trading Groups (comma-separated)
TRADING_GROUPS=Group1,Group2,Group3
```

#### Update Groups Reference
Edit `TRADING_BOT/data/groups_reference.json` with your actual Telegram group names:

```json
{
  "groups": [
    "Your Trading Group 1",
    "Your Trading Group 2",
    "Your Trading Group 3"
  ]
}
```

## Running the System

### Production Mode (VPS)

On your VPS, you need two running servers:

#### 1. Start the Trading Bot
```bash
cd TRADING_BOT
python main.py
```

This bot:
- Connects to your master MT5 account via MT5_Master terminal
- Listens to Telegram trading signals
- Executes trades on master account
- Monitors for future copy engine implementation

#### 2. Start the API Server
```bash
cd TRADING_BOT
python run_api.py
```

This server:
- Provides API endpoints for frontend
- Validates MT5 user credentials via MT5_Validator terminal
- Manages user account data in MongoDB
- Handles MT5 connection/disconnection requests

#### 3. Start the Frontend
```bash
npm run dev
```

For production, build and serve:
```bash
npm run build
npm start
```

### Development Mode (Local)

Same commands as above, but run in separate terminal windows.

## Troubleshooting & Diagnostics

### MT5 Connection Issues

#### Test MT5 Validator Terminal
```bash
python TRADING_BOT/tools/test_validator.py
```

Expected output:
```
Initializing...
SUCCESS
(500, 6034, '18 Jul 2026')
```

If you get `(-10005, 'IPC timeout')`:
- Kill stuck MT5 processes: `taskkill /F /IM terminal64.exe`
- Check terminal path in `api_server.py`
- Ensure terminal is not showing login dialog

If you get `(-6, 'Terminal: Authorization failed')`:
- Terminal configuration is corrupted
- Reset terminal configuration files
- Or temporarily use MT5_Master for validation

#### Test MT5 Master Connection
```bash
python TRADING_BOT/tools/test_master.py
```

### MongoDB Connection Issues

1. Check connection string in `.env` files
2. Verify IP whitelist in MongoDB Atlas
3. Ensure database user has correct permissions
4. Test connection: `python -c "from pymongo import MongoClient; client = MongoClient('your_connection_string'); print(client.server_info())"`

### Telegram Connection Issues

1. Verify bot token is correct
2. Ensure bot is added to trading groups as admin
3. Check API credentials from my.telegram.org
4. Verify group names match exactly in `groups_reference.json`

### API Server Issues

#### Check Port Availability
```bash
netstat -ano | findstr :8000
```

If port 8000 is in use:
```bash
taskkill /PID <process_id> /F
```

#### Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:8000/api/telegram/groups

# Test MT5 validation
curl -X POST http://localhost:8000/api/mt5/validate -H "Content-Type: application/json" -d "{\"login\":\"123456\",\"password\":\"pass\",\"server\":\"Exness-MT5Trial9\"}"
```

### Frontend Issues

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check environment variables in `.env.local`
4. Verify API server is running on port 8000

## File Structure

```
SMG-BOT/
├── app/                          # Next.js frontend
│   ├── api/                      # API routes
│   ├── user-dashboard/           # User dashboard pages
│   └── admin-dashboard/          # Admin dashboard pages
├── TRADING_BOT/                 # Python bot
│   ├── core/                     # Core functionality
│   ├── mt5/                      # MT5 connector
│   ├── telegram/                 # Telegram integration
│   ├── data/                     # Data files
│   ├── tools/                    # Diagnostic tools
│   ├── api_server.py             # FastAPI server
│   ├── main.py                   # Trading bot
│   └── run_api.py                # API server launcher
├── models/                       # Mongoose models
├── components/                    # React components
├── public/                       # Static assets
└── .env                          # Environment variables
```

## Security Considerations

1. **Never commit `.env` files** to version control
2. **Encrypt MT5 passwords** in production (currently stored in plain text)
3. **Use strong MongoDB passwords** and enable IP whitelisting
4. **Rotate API keys** periodically
5. **Enable firewall rules** on VPS to restrict access
6. **Use HTTPS** for frontend in production

## Deployment Checklist

- [ ] Clone repository to VPS
- [ ] Install Python 3.10+ and Node.js 18+
- [ ] Install MongoDB (local or Atlas)
- [ ] Install three MT5 terminal instances
- [ ] Configure MT5_Master with master account
- [ ] Create Telegram bot and get credentials
- [ ] Configure all environment variables
- [ ] Install Python dependencies
- [ ] Install Node.js dependencies
- [ ] Update `groups_reference.json` with trading groups
- [ ] Test MT5 validator terminal
- [ ] Test MT5 master connection
- [ ] Test MongoDB connection
- [ ] Test Telegram connection
- [ ] Start trading bot (main.py)
- [ ] Start API server (run_api.py)
- [ ] Start frontend (npm run dev/build)
- [ ] Verify all services are running
- [ ] Test MT5 connection from frontend
- [ ] Test trade execution with signals

## Maintenance

### Regular Tasks

1. **Monitor MT5 connections** - Ensure master account stays connected
2. **Check MongoDB storage** - Monitor database size and performance
3. **Review logs** - Check `TRADING_BOT/logs/` for errors
4. **Update dependencies** - Regularly update Python and Node.js packages
5. **Backup database** - Regular MongoDB backups
6. **Monitor VPS resources** - CPU, memory, disk usage

### Log Files

- Trading bot logs: `TRADING_BOT/logs/trading_bot.log`
- API server logs: Console output (consider adding file logging)
- Frontend logs: Next.js console output

## Support & Development

For issues or questions:
1. Check troubleshooting section above
2. Review log files for error messages
3. Test individual components using diagnostic tools
4. Verify environment variables and configuration files

## License

[Your License Here]
