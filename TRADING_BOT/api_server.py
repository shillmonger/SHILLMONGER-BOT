from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from telethon import TelegramClient
from telethon.tl.types import Channel, Chat
from config import API_ID, API_HASH, PHONE_NUMBER
from core.database import db
from core.logger import logger
from pathlib import Path
import asyncio
import MetaTrader5 as mt5
from pydantic import BaseModel
from typing import Optional

class MT5ValidationRequest(BaseModel):
    server: str
    login: str
    password: str

class CloseTradeRequest(BaseModel):
    ticket: int
    user_id: Optional[str] = None  # Optional: if provided, only close for specific user

class CloseAllTradesRequest(BaseModel):
    user_id: Optional[str] = None  # Optional: if provided, only close for specific user
    symbol: Optional[str] = None  # Optional: if provided, only close specific symbol

class CancelPendingRequest(BaseModel):
    ticket: int
    user_id: Optional[str] = None

class CancelAllPendingRequest(BaseModel):
    user_id: Optional[str] = None
    symbol: Optional[str] = None

app = FastAPI(title="Shillmonger Bot API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Connect to database and initialize MT5 validator terminal on startup"""
    db.connect()
    
    # Initialize MT5 validator terminal once for reuse
    validator_path = r"C:\Program Files\MT5_Validator\terminal64.exe"
    logger.info(f"Initializing MT5 validator terminal at: {validator_path}")
    
    if not mt5.initialize(path=validator_path, timeout=60000):
        logger.error(f"MT5 validator initialization failed: {mt5.last_error()}")
    else:
        # Wait for terminal to become responsive
        for attempt in range(20):  # up to ~10 seconds
            info = mt5.terminal_info()
            if info is not None:
                logger.success("MT5 validator terminal ready")
                break
            time.sleep(0.5)
        else:
            logger.error("MT5 validator terminal never became ready")
            mt5.shutdown()
    
    logger.success("FastAPI server started")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection and MT5 terminal on shutdown"""
    db.close()
    mt5.shutdown()
    logger.info("FastAPI server stopped")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "shillmonger-bot"}

@app.get("/api/telegram/groups")
async def get_telegram_groups():
    """
    Fetch all Telegram groups/channels from the bot's account
    """
    try:
        # Get the directory where this script is located
        script_dir = Path(__file__).parent
        session_path = script_dir / "sessions" / "tradingbot_api"

        client = TelegramClient(
            str(session_path),
            API_ID,
            API_HASH
        )
        
        await client.start(phone=PHONE_NUMBER)
        
        dialogs = await client.get_dialogs()
        
        groups = []
        
        for dialog in dialogs:
            if isinstance(dialog.entity, (Channel, Chat)):
                # Try to get profile photo
                profile_photo = None
                try:
                    photo = await client.get_profile_photos(dialog.entity)
                    if photo:
                        # Download the photo and convert to base64 or URL
                        # For now, we'll skip photo download to keep it simple
                        profile_photo = ""
                except:
                    profile_photo = ""
                
                groups.append({
                    "id": str(dialog.id),
                    "name": dialog.name,
                    "profile_image": profile_photo
                })
        
        groups.sort(key=lambda x: x["name"].lower())
        
        await client.disconnect()
        
        logger.success(f"Fetched {len(groups)} Telegram groups")
        return {"groups": groups}
        
    except Exception as e:
        logger.error(f"Failed to fetch Telegram groups: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/providers")
async def get_providers():
    """
    Get all saved providers from database
    """
    try:
        providers = db.get_all_providers()
        return {"providers": providers}
    except Exception as e:
        logger.error(f"Failed to get providers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/providers/refresh")
async def refresh_providers():
    """
    Refresh the bot's provider list from database
    This is called when providers are updated in the frontend
    """
    try:
        # In a real implementation, this would signal the listener to reload
        # For now, we'll just return success
        logger.info("Providers refresh requested")
        return {"status": "success", "message": "Providers refresh requested"}
    except Exception as e:
        logger.error(f"Failed to refresh providers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/mt5/validate")
async def validate_mt5_connection(request: MT5ValidationRequest):
    """
    Validate MT5 credentials by attempting to connect using pre-initialized validator terminal
    Returns account info if successful, error if failed
    """
    try:
        logger.info(
            f"""
Validating MT5 credentials
LOGIN = [{request.login}]
SERVER = [{request.server}]
PASSWORD LENGTH = {len(request.password)}
"""
        )

        # Check if terminal is initialized
        if mt5.terminal_info() is None:
            logger.error("MT5 validator terminal not initialized")
            return {
                "success": False,
                "error": "MT5 validator terminal not initialized. Please restart the server."
            }

        # Attempt login with provided credentials
        authorized = mt5.login(
            login=int(request.login),
            password=request.password,
            server=request.server
        )

        if not authorized:
            error_msg = f"MT5 login failed: {mt5.last_error()}"
            logger.error(error_msg)
            return {
                "success": False,
                "error": error_msg
            }

        # Get account information
        account = mt5.account_info()
        if account is None:
            error_msg = "Failed to retrieve account information"
            logger.error(error_msg)
            mt5.shutdown()
            return {
                "success": False,
                "error": error_msg
            }

        # Extract account info
        account_info = {
            "login": account.login,
            "server": account.server,
            "balance": account.balance,
            "equity": account.equity,
            "currency": account.currency,
            "margin": account.margin,
            "free_margin": account.margin_free,
            "profit": account.profit
        }

        logger.success(
            f"MT5 validation successful | "
            f"Login: {account.login} | "
            f"Server: {account.server} | "
            f"Balance: {account.balance}"
        )

        return {
            "success": True,
            "accountInfo": account_info
        }

    except ValueError as e:
        logger.error(f"Invalid login format: {e}")
        return {
            "success": False,
            "error": "Invalid login format. Login must be a number."
        }
    except Exception as e:
        logger.error(f"MT5 validation error: {e}")
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/trades/open")
async def get_open_trades():
    """
    Get all open trades from master_trades and trade_activity collections
    """
    try:
        trades = db.get_all_open_trades()
        return trades
    except Exception as e:
        logger.error(f"Failed to get open trades: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/trades/pending")
async def get_pending_orders():
    """
    Get all pending orders from all active MT5 accounts
    """
    try:
        # Check if terminal is initialized
        if mt5.terminal_info() is None:
            logger.error("MT5 validator terminal not initialized")
            return {
                "success": False,
                "error": "MT5 validator terminal not initialized. Please restart the server."
            }

        accounts = db.get_mt5_accounts_for_trades()
        all_pending_orders = []

        for account in accounts:
            try:
                login = int(account["mt5Login"])
                password = account["password"]
                server = account["server"]
                user_id = account["userId"]

                # Login to user account
                authorized = mt5.login(
                    login=login,
                    password=password,
                    server=server
                )

                if not authorized:
                    logger.error(f"Failed to login to account {login}")
                    continue

                # Get pending orders
                orders = mt5.orders_get()
                if orders:
                    for order in orders:
                        all_pending_orders.append({
                            "ticket": order.ticket,
                            "user_id": user_id,
                            "mt5_login": login,
                            "server": server,
                            "symbol": order.symbol,
                            "type": order.type,
                            "type_str": get_order_type_string(order.type),
                            "volume": order.volume_current,
                            "price": order.price,
                            "sl": order.sl,
                            "tp": order.tp,
                            "comment": order.comment,
                            "time_setup": order.time_setup,
                            "expiration": order.time_expiration
                        })

                # Logout
                mt5.login(login=0, password="", server="")

            except Exception as e:
                logger.error(f"Error getting pending orders for account {account['mt5Login']}: {e}")
                try:
                    mt5.login(login=0, password="", server="")
                except:
                    pass

        return {"pending_orders": all_pending_orders}

    except Exception as e:
        logger.error(f"Failed to get pending orders: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def get_order_type_string(order_type):
    """Convert MT5 order type to readable string"""
    type_map = {
        mt5.ORDER_TYPE_BUY_LIMIT: "BUY_LIMIT",
        mt5.ORDER_TYPE_SELL_LIMIT: "SELL_LIMIT",
        mt5.ORDER_TYPE_BUY_STOP: "BUY_STOP",
        mt5.ORDER_TYPE_SELL_STOP: "SELL_STOP",
        mt5.ORDER_TYPE_BUY_STOP_LIMIT: "BUY_STOP_LIMIT",
        mt5.ORDER_TYPE_SELL_STOP_LIMIT: "SELL_STOP_LIMIT"
    }
    return type_map.get(order_type, f"UNKNOWN_{order_type}")

@app.post("/api/trades/close")
async def close_trade(request: CloseTradeRequest):
    """
    Close a specific trade by ticket number
    """
    try:
        # Check if terminal is initialized
        if mt5.terminal_info() is None:
            logger.error("MT5 validator terminal not initialized")
            return {
                "success": False,
                "error": "MT5 validator terminal not initialized. Please restart the server."
            }

        # Find which account has this trade
        accounts = db.get_mt5_accounts_for_trades()
        
        for account in accounts:
            if request.user_id and account["userId"] != request.user_id:
                continue

            try:
                login = int(account["mt5Login"])
                password = account["password"]
                server = account["server"]

                # Login to user account
                authorized = mt5.login(
                    login=login,
                    password=password,
                    server=server
                )

                if not authorized:
                    logger.error(f"Failed to login to account {login}")
                    continue

                # Get the position
                position = mt5.positions_get(ticket=request.ticket)
                if position and len(position) > 0:
                    position = position[0]
                    
                    # Close the position
                    close_request = {
                        "action": mt5.TRADE_ACTION_DEAL,
                        "symbol": position.symbol,
                        "volume": position.volume,
                        "type": mt5.ORDER_TYPE_SELL if position.type == mt5.POSITION_TYPE_BUY else mt5.ORDER_TYPE_BUY,
                        "position": request.ticket,
                        "price": mt5.symbol_info_tick(position.symbol).bid if position.type == mt5.POSITION_TYPE_BUY else mt5.symbol_info_tick(position.symbol).ask,
                        "deviation": 20,
                        "magic": position.magic,
                        "comment": "Manual close via admin",
                        "type_time": mt5.ORDER_TIME_GTC,
                        "type_filling": mt5.ORDER_FILLING_IOC,
                    }

                    result = mt5.order_send(close_request)

                    if result and result.retcode == mt5.TRADE_RETCODE_DONE:
                        # Update database
                        db.update_trade_activity(request.ticket, {
                            "status": "CLOSED",
                            "profit": position.profit
                        })
                        
                        logger.success(f"Trade {request.ticket} closed successfully")
                        mt5.login(login=0, password="", server="")
                        return {"success": True, "message": f"Trade {request.ticket} closed successfully"}
                    else:
                        error_msg = f"Failed to close trade: {result.comment if result else 'Unknown error'}"
                        logger.error(error_msg)
                        mt5.login(login=0, password="", server="")
                        return {"success": False, "error": error_msg}

                # Logout
                mt5.login(login=0, password="", server="")

            except Exception as e:
                logger.error(f"Error closing trade on account {account['mt5Login']}: {e}")
                try:
                    mt5.login(login=0, password="", server="")
                except:
                    pass

        return {"success": False, "error": f"Trade {request.ticket} not found"}

    except Exception as e:
        logger.error(f"Failed to close trade: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trades/close-all")
async def close_all_trades(request: CloseAllTradesRequest):
    """
    Close all open trades, optionally filtered by user_id or symbol
    """
    try:
        # Check if terminal is initialized
        if mt5.terminal_info() is None:
            logger.error("MT5 validator terminal not initialized")
            return {
                "success": False,
                "error": "MT5 validator terminal not initialized. Please restart the server."
            }

        accounts = db.get_mt5_accounts_for_trades()
        total_closed = 0
        total_failed = 0
        errors = []

        for account in accounts:
            if request.user_id and account["userId"] != request.user_id:
                continue

            try:
                login = int(account["mt5Login"])
                password = account["password"]
                server = account["server"]

                # Login to user account
                authorized = mt5.login(
                    login=login,
                    password=password,
                    server=server
                )

                if not authorized:
                    logger.error(f"Failed to login to account {login}")
                    total_failed += 1
                    continue

                # Get all positions
                positions = mt5.positions_get()
                if positions:
                    for position in positions:
                        if request.symbol and position.symbol != request.symbol:
                            continue

                        try:
                            close_request = {
                                "action": mt5.TRADE_ACTION_DEAL,
                                "symbol": position.symbol,
                                "volume": position.volume,
                                "type": mt5.ORDER_TYPE_SELL if position.type == mt5.POSITION_TYPE_BUY else mt5.ORDER_TYPE_BUY,
                                "position": position.ticket,
                                "price": mt5.symbol_info_tick(position.symbol).bid if position.type == mt5.POSITION_TYPE_BUY else mt5.symbol_info_tick(position.symbol).ask,
                                "deviation": 20,
                                "magic": position.magic,
                                "comment": "Bulk close via admin",
                                "type_time": mt5.ORDER_TIME_GTC,
                                "type_filling": mt5.ORDER_FILLING_IOC,
                            }

                            result = mt5.order_send(close_request)

                            if result and result.retcode == mt5.TRADE_RETCODE_DONE:
                                # Update database
                                db.update_trade_activity(position.ticket, {
                                    "status": "CLOSED",
                                    "profit": position.profit
                                })
                                total_closed += 1
                            else:
                                total_failed += 1
                                error_msg = f"Failed to close {position.ticket}: {result.comment if result else 'Unknown'}"
                                errors.append(error_msg)
                                logger.error(error_msg)

                        except Exception as e:
                            total_failed += 1
                            errors.append(f"Error closing {position.ticket}: {str(e)}")
                            logger.error(f"Error closing position {position.ticket}: {e}")

                # Logout
                mt5.login(login=0, password="", server="")

            except Exception as e:
                total_failed += 1
                errors.append(f"Error on account {login}: {str(e)}")
                logger.error(f"Error processing account {login}: {e}")
                try:
                    mt5.login(login=0, password="", server="")
                except:
                    pass

        logger.success(f"Close all trades completed: {total_closed} closed, {total_failed} failed")
        return {
            "success": True,
            "message": f"Closed {total_closed} trades, {total_failed} failed",
            "closed": total_closed,
            "failed": total_failed,
            "errors": errors
        }

    except Exception as e:
        logger.error(f"Failed to close all trades: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trades/cancel-pending")
async def cancel_pending_order(request: CancelPendingRequest):
    """
    Cancel a specific pending order by ticket number
    """
    try:
        # Check if terminal is initialized
        if mt5.terminal_info() is None:
            logger.error("MT5 validator terminal not initialized")
            return {
                "success": False,
                "error": "MT5 validator terminal not initialized. Please restart the server."
            }

        accounts = db.get_mt5_accounts_for_trades()

        for account in accounts:
            if request.user_id and account["userId"] != request.user_id:
                continue

            try:
                login = int(account["mt5Login"])
                password = account["password"]
                server = account["server"]

                # Login to user account
                authorized = mt5.login(
                    login=login,
                    password=password,
                    server=server
                )

                if not authorized:
                    logger.error(f"Failed to login to account {login}")
                    continue

                # Get the order
                order = mt5.orders_get(ticket=request.ticket)
                if order and len(order) > 0:
                    order = order[0]
                    
                    # Cancel the order
                    cancel_request = {
                        "action": mt5.TRADE_ACTION_REMOVE,
                        "order": request.ticket,
                        "symbol": order.symbol,
                        "volume": order.volume,
                        "type": order.type,
                        "price": order.price,
                        "comment": "Manual cancel via admin",
                    }

                    result = mt5.order_send(cancel_request)

                    if result and result.retcode == mt5.TRADE_RETCODE_DONE:
                        logger.success(f"Order {request.ticket} cancelled successfully")
                        mt5.login(login=0, password="", server="")
                        return {"success": True, "message": f"Order {request.ticket} cancelled successfully"}
                    else:
                        error_msg = f"Failed to cancel order: {result.comment if result else 'Unknown error'}"
                        logger.error(error_msg)
                        mt5.login(login=0, password="", server="")
                        return {"success": False, "error": error_msg}

                # Logout
                mt5.login(login=0, password="", server="")

            except Exception as e:
                logger.error(f"Error cancelling order on account {account['mt5Login']}: {e}")
                try:
                    mt5.login(login=0, password="", server="")
                except:
                    pass

        return {"success": False, "error": f"Order {request.ticket} not found"}

    except Exception as e:
        logger.error(f"Failed to cancel pending order: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/trades/cancel-all-pending")
async def cancel_all_pending_orders(request: CancelAllPendingRequest):
    """
    Cancel all pending orders, optionally filtered by user_id or symbol
    """
    try:
        # Check if terminal is initialized
        if mt5.terminal_info() is None:
            logger.error("MT5 validator terminal not initialized")
            return {
                "success": False,
                "error": "MT5 validator terminal not initialized. Please restart the server."
            }

        accounts = db.get_mt5_accounts_for_trades()
        total_cancelled = 0
        total_failed = 0
        errors = []

        for account in accounts:
            if request.user_id and account["userId"] != request.user_id:
                continue

            try:
                login = int(account["mt5Login"])
                password = account["password"]
                server = account["server"]

                # Login to user account
                authorized = mt5.login(
                    login=login,
                    password=password,
                    server=server
                )

                if not authorized:
                    logger.error(f"Failed to login to account {login}")
                    total_failed += 1
                    continue

                # Get all pending orders
                orders = mt5.orders_get()
                if orders:
                    for order in orders:
                        if request.symbol and order.symbol != request.symbol:
                            continue

                        try:
                            cancel_request = {
                                "action": mt5.TRADE_ACTION_REMOVE,
                                "order": order.ticket,
                                "symbol": order.symbol,
                                "volume": order.volume,
                                "type": order.type,
                                "price": order.price,
                                "comment": "Bulk cancel via admin",
                            }

                            result = mt5.order_send(cancel_request)

                            if result and result.retcode == mt5.TRADE_RETCODE_DONE:
                                total_cancelled += 1
                            else:
                                total_failed += 1
                                error_msg = f"Failed to cancel {order.ticket}: {result.comment if result else 'Unknown'}"
                                errors.append(error_msg)
                                logger.error(error_msg)

                        except Exception as e:
                            total_failed += 1
                            errors.append(f"Error cancelling {order.ticket}: {str(e)}")
                            logger.error(f"Error cancelling order {order.ticket}: {e}")

                # Logout
                mt5.login(login=0, password="", server="")

            except Exception as e:
                total_failed += 1
                errors.append(f"Error on account {login}: {str(e)}")
                logger.error(f"Error processing account {login}: {e}")
                try:
                    mt5.login(login=0, password="", server="")
                except:
                    pass

        logger.success(f"Cancel all pending orders completed: {total_cancelled} cancelled, {total_failed} failed")
        return {
            "success": True,
            "message": f"Cancelled {total_cancelled} orders, {total_failed} failed",
            "cancelled": total_cancelled,
            "failed": total_failed,
            "errors": errors
        }

    except Exception as e:
        logger.error(f"Failed to cancel all pending orders: {e}")
        raise HTTPException(status_code=500, detail=str(e))
