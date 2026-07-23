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
- **MT5_CopyEngine**: Dedicated terminal for copying trades to user accounts

---

# PART 1: VPS SETUP (Trading Bot Backend)

This section covers setting up the trading bot backend on your Windows VPS.

## VPS Prerequisites

### System Requirements

- Windows Server (VPS) or Windows 10/11
- Python 3.10+
- MongoDB (local or cloud)
- MetaTrader 5 terminal installations
- Visual Studio Code (for editing files on VPS)

### Required Accounts & Services

1. **Telegram Bot**: Create via @BotFather on Telegram
2. **Telegram API Credentials**: Get from my.telegram.org
3. **MongoDB**: MongoDB Atlas (cloud) or local installation
4. **MT5 Trading Account**: Your master Exness account

## VPS Installation Guide

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd SMG-BOT
```

### 2. Install Visual Studio Code on VPS

VS Code is recommended for editing files on your VPS:

```powershell
# Download VS Code installer
# Visit: https://code.visualstudio.com/download
# Download the Windows User Installer (System Installer if you prefer)

# Alternatively, using PowerShell (if winget is available):
winget install Microsoft.VisualStudioCode

# Or download manually:
# 1. Open browser on VPS via RDP
# 2. Navigate to https://code.visualstudio.com/download
# 3. Download and run the Windows installer
# 4. Follow installation prompts
```

### 3. Azure VPS Network Configuration - Port 8000

To allow external access to your API server, you need to open port 8000 in Azure:

#### Via Azure Portal:
1. Go to Azure Portal → Virtual Machines
2. Select your VM (e.g., `mt5-bot-server196`)
3. Click on "Networking" in the left menu
4. Click "Add inbound port rule"
5. Configure:
   - **Destination port ranges**: `8000`
   - **Protocol**: `TCP`
   - **Action**: `Allow`
   - **Source**: `Any` (or specific IP for security)
   - **Source port ranges**: `*`
   - **Priority**: `310` (or next available)
   - **Name**: `Allow-8000`
6. Click "Add"

#### Via PowerShell (if you have Azure CLI):
```powershell
# Get your network security group
$nsg = Get-AzNetworkSecurityGroup -ResourceGroupName "<your-resource-group>" -Name "<your-nsg-name>"

# Add inbound rule for port 8000
$nsg | Add-AzNetworkSecurityRuleConfig -Name "Allow-8000" -Description "Allow API server" -Access Allow -Protocol Tcp -Direction Inbound -Priority 310 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * -DestinationPortRange 8000

# Apply the changes
$nsg | Set-AzNetworkSecurityGroup
```

### 4. Python Environment Setup

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
- `loguru` - Logging

### 5. MongoDB Setup

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

### 6. MT5 Terminal Installation

#### Download MetaTrader 5
1. Download MT5 from https://www.metatrader5.com/en/download
2. Install to default location: `C:\Program Files\MetaTrader 5`

#### Install Three MT5 Instances

The trading bot requires three separate MT5 terminal installations to prevent connection conflicts:

**MT5_Master Terminal** (for executing trades on master account)
```powershell
# Copy MT5 installation to Master directory
Copy-Item -Path "C:\Program Files\MetaTrader 5" -Destination "C:\Program Files\MT5_Master" -Recurse
```

**MT5_Validator Terminal** (for validating user credentials)
```powershell
# Copy MT5 installation to Validator directory
Copy-Item -Path "C:\Program Files\MetaTrader 5" -Destination "C:\Program Files\MT5_Validator" -Recurse
```

**MT5_CopyEngine Terminal** (for copying trades to user accounts)
```powershell
# Copy MT5 installation to CopyEngine directory
Copy-Item -Path "C:\Program Files\MetaTrader 5" -Destination "C:\Program Files\MT5_CopyEngine" -Recurse
```

#### Configure MT5_Master Terminal
1. Launch `C:\Program Files\MT5_Master\terminal64.exe`
2. Login with your master Exness account credentials
3. Enable "Allow algorithmic trading" in Tools → Options → Expert Advisors
4. Enable "Disable algorithmic trading when the account has been changed"
5. Enable "Disable algorithmic trading when the profile has been changed"
6. Enable "Allow WebRequest" for required URLs
7. Enable "Allow DLL imports"
8. Test connection to ensure it stays logged in
9. Close the terminal (the bot will manage the connection programmatically)

#### Configure MT5_Validator Terminal
1. Launch `C:\Program Files\MT5_Validator\terminal64.exe`
2. Close any login dialogs (will be used programmatically)
3. Enable "Allow algorithmic trading" in Tools → Options → Expert Advisors
4. Enable "Disable algorithmic trading when the account has been changed"
5. Enable "Disable algorithmic trading when the profile has been changed"
6. Enable "Allow DLL imports"
7. Enable "Allow WebRequest" for required URLs
8. No permanent login required - used for temporary validation only
9. Close the terminal

#### Configure MT5_CopyEngine Terminal
1. Launch `C:\Program Files\MT5_CopyEngine\terminal64.exe`
2. Close any login dialogs (will be used programmatically)
3. Enable "Allow algorithmic trading" in Tools → Options → Expert Advisors
4. Don't Enable "Disable algorithmic trading when the account has been changed"
5. Don't Enable "Disable algorithmic trading when the profile has been changed"
6. Enable "Allow DLL imports"
7. Enable "Allow WebRequest" for required URLs
8. No permanent login required - the copy engine will manage connections
9. Close the terminal

### 7. Telegram Setup

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

### 8. Bot Configuration

#### Create TRADING_BOT/.env File
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shillmonger

# Telegram API Credentials
API_ID=your_api_id
API_HASH=your_api_hash
PHONE_NUMBER=your_phone_number

# MT5 Master Account Credentials
MT5_LOGIN=your_master_login
MT5_PASSWORD=your_master_password
MT5_SERVER=Exness-MT5Real9  # or your specific server

# Trading Configuration
LOT_SIZE=0.01
SYMBOL=XAUUSDm
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

## Running the Trading Bot on VPS

The trading bot consists of three separate services that should run simultaneously:

### Terminal 1 - Master Trading Bot
```bash
cd TRADING_BOT
python main.py
```

This bot:
- Connects to your master MT5 account via MT5_Master terminal
- Listens to Telegram trading signals
- Executes trades on master account
- Saves master trades to database for copy engine

### Terminal 2 - API Server
```bash
cd TRADING_BOT
python run_api.py
```

This server:
- Provides API endpoints for frontend
- Validates MT5 user credentials via MT5_Validator terminal
- Manages user account data in MongoDB
- Handles MT5 connection/disconnection requests
- Runs on port 8000 (ensure Azure firewall allows this)

### Terminal 3 - Copy Engine
```bash
cd TRADING_BOT
python run_copy_engine.py
```

This service:
- Watches for new master trades in database
- Copies trades to user accounts via MT5_CopyEngine terminal
- Manages user-specific lot sizes and risk parameters
- Applies special rules for accounts with $10-$40 balance (fixed $5 SL)

### Running All Services Simultaneously

For production, consider using a process manager or running these in separate terminal windows:

```powershell
# In three separate PowerShell windows:

# Window 1
cd C:\Users\hp\Desktop\SMG BOT\TRADING_BOT
python main.py

# Window 2
cd C:\Users\hp\Desktop\SMG BOT\TRADING_BOT
python run_api.py

# Window 3
cd C:\Users\hp\Desktop\SMG BOT\TRADING_BOT
python run_copy_engine.py
```

---

# PART 2: FRONTEND SETUP (Next.js Dashboard)

This section covers setting up the Next.js frontend dashboard.

## Frontend Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (same as VPS setup)
- Bot API URL (from VPS)

## Frontend Installation Guide

### 1. Install Node.js Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` file in root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shillmonger

# NextAuth Secret (generate random string)
NEXTAUTH_SECRET=your-random-secret-string-here

# Bot API URL (use your VPS IP or domain)
NEXT_PUBLIC_BOT_API_URL=http://your-vps-ip:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

---

# PART 3: TROUBLESHOOTING & DIAGNOSTICS

## VPS Troubleshooting

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

#### Azure Network Issues
If you cannot access the API from external sources:
1. Verify Azure Network Security Group has port 8000 open
2. Check Windows Firewall on VPS allows port 8000
3. Ensure the API server is binding to `0.0.0.0` not `127.0.0.1`

### Logging Issues

The system now uses separate log files to prevent conflicts:

- **Master bot logs**: `TRADING_BOT/logs/master.log`
- **API server logs**: `TRADING_BOT/logs/api.log`
- **Copy engine logs**: `TRADING_BOT/logs/copy_engine.log`

If you see `PermissionError: [WinError 32]` in logs:
- This indicates multiple processes trying to write to the same log file
- The fix has been implemented with separate log files
- Ensure you're using the updated code with `setup_logger()` calls

## Frontend Troubleshooting

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check environment variables in `.env.local`
4. Verify API server is running on port 8000
5. Check browser console for errors
6. Ensure `NEXT_PUBLIC_BOT_API_URL` points to correct VPS IP/domain

---

# PART 4: FILE STRUCTURE

```
SMG-BOT/
├── app/                          # Next.js frontend
│   ├── api/                      # API routes
│   ├── user-dashboard/           # User dashboard pages
│   ├── admin-dashboard/          # Admin dashboard pages
│   └── auth-page/                # Authentication pages
├── TRADING_BOT/                 # Python bot
│   ├── core/                     # Core functionality
│   │   ├── database.py           # MongoDB operations
│   │   ├── logger.py             # Logging configuration
│   │   └── models.py              # Data models
│   ├── mt5/                      # MT5 connectors
│   │   ├── connector.py          # Master terminal
│   │   ├── copy_connector.py     # Copy engine terminal
│   │   ├── trader.py             # Master trade execution
│   │   └── copy_trader.py        # Copy trade execution
│   ├── telegram/                 # Telegram integration
│   │   ├── listener.py           # Signal listener
│   │   └── parser.py             # Signal parser
│   ├── copy_engine/              # Copy engine
│   │   └── engine.py             # Copy engine logic
│   ├── data/                     # Data files
│   │   ├── groups_reference.json # Trading groups
│   │   └── signals.json          # Signal reference
│   ├── logs/                     # Log files
│   │   ├── master.log            # Master bot logs
│   │   ├── api.log               # API server logs
│   │   └── copy_engine.log       # Copy engine logs
│   ├── tools/                    # Diagnostic tools
│   ├── api_server.py             # FastAPI server
│   ├── main.py                   # Trading bot entry
│   ├── run_api.py                # API server launcher
│   └── run_copy_engine.py        # Copy engine launcher
├── models/                       # Mongoose models
├── components/                   # React components
├── public/                       # Static assets
├── .env                          # Environment variables
└── README.md                     # This file
```

---

# PART 5: SECURITY CONSIDERATIONS

1. **Never commit `.env` files** to version control
2. **Encrypt MT5 passwords** in production (currently stored in plain text)
3. **Use strong MongoDB passwords** and enable IP whitelisting
4. **Rotate API keys** periodically
5. **Enable firewall rules** on VPS to restrict access
6. **Use HTTPS** for frontend in production
7. **Restrict Azure NSG rules** to specific IPs when possible
8. **Keep VS Code and dependencies updated** on VPS

---

# PART 6: DEPLOYMENT CHECKLIST

## VPS Deployment
- [ ] Clone repository to VPS
- [ ] Install Visual Studio Code on VPS
- [ ] Install Python 3.10+
- [ ] Install MongoDB (local or Atlas)
- [ ] Configure Azure Network Security Group for port 8000
- [ ] Install three MT5 terminal instances
- [ ] Configure MT5_Master with master account
- [ ] Create Telegram bot and get credentials
- [ ] Configure TRADING_BOT/.env file
- [ ] Install Python dependencies
- [ ] Update `groups_reference.json` with trading groups
- [ ] Test MT5 validator terminal
- [ ] Test MT5 master connection
- [ ] Test MongoDB connection
- [ ] Test Telegram connection
- [ ] Start trading bot (main.py)
- [ ] Start API server (run_api.py)
- [ ] Start copy engine (run_copy_engine.py)
- [ ] Verify all services are running
- [ ] Test API endpoints
- [ ] Test trade execution with signals

## Frontend Deployment
- [ ] Install Node.js 18+
- [ ] Install npm dependencies
- [ ] Configure .env.local with MongoDB URI
- [ ] Configure NEXT_PUBLIC_BOT_API_URL with VPS IP/domain
- [ ] Run development server (npm run dev)
- [ ] Test frontend functionality
- [ ] Build for production (npm run build)
- [ ] Deploy to hosting platform (Vercel, Netlify, etc.)

---

# PART 7: MAINTENANCE

## Regular Tasks

### VPS Maintenance
1. **Monitor MT5 connections** - Ensure master account stays connected
2. **Check MongoDB storage** - Monitor database size and performance
3. **Review logs** - Check `TRADING_BOT/logs/` for errors
4. **Update dependencies** - Regularly update Python packages
5. **Backup database** - Regular MongoDB backups
6. **Monitor VPS resources** - CPU, memory, disk usage
7. **Check Azure costs** - Monitor VM and storage costs
8. **Update VS Code** - Keep editor updated on VPS

### Frontend Maintenance
1. **Update Node.js dependencies** - Regular security updates
2. **Monitor API connectivity** - Ensure frontend can reach VPS API
3. **Review user feedback** - Check for reported issues
4. **Update deployment** - Regular production builds

## Log Files

- **Master bot**: `TRADING_BOT/logs/master.log`
- **API server**: `TRADING_BOT/logs/api.log`
- **Copy engine**: `TRADING_BOT/logs/copy_engine.log`

Log rotation is configured at 10 MB with 30-day retention.

---

# PART 8: SPECIAL TRADING LOGIC

## Account Balance-Based Risk Management

The system implements special logic for accounts with specific balance ranges:

### $10-$40 Balance Accounts
- **Fixed Stop Loss**: $5.00 (ignores signal's SL)
- **Entry Price**: Uses signal's entry price
- **Take Profit**: Uses signal's TP values
- **Lot Size**: Determined by database lot size rules

This logic is applied in both:
- **Master Engine** (`telegram/listener.py`)
- **Copy Engine** (`copy_engine/engine.py`)

Accounts outside this range use the signal's original SL, TP, and entry values.

---

# PART 9: SUPPORT & DEVELOPMENT

For issues or questions:
1. Check troubleshooting section above
2. Review log files for error messages
3. Test individual components using diagnostic tools
4. Verify environment variables and configuration files
5. Check Azure network security group rules
6. Verify MT5 terminal installations are correct

## License

[Your License Here]
