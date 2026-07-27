from pymongo import MongoClient
from config import MONGODB_URI
from core.logger import logger
from datetime import datetime

class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.providers_collection = None
        self.master_trades_collection = None
        self.trade_activity_collection = None
        self.copy_jobs_collection = None
        self.mt5_accounts_collection = None
        self.lot_size_management_collection = None
        self.position_limits_collection = None
        self.stop_loss_management_collection = None

    def connect(self):
        try:
            self.client = MongoClient(MONGODB_URI)
            self.db = self.client.get_database()
            self.providers_collection = self.db.providers
            self.master_trades_collection = self.db.master_trades
            self.trade_activity_collection = self.db.trade_activity
            self.copy_jobs_collection = self.db.copy_jobs
            self.mt5_accounts_collection = self.db.mt5accounts
            self.lot_size_management_collection = self.db.lotsizemanagements
            self.position_limits_collection = self.db.positionlimits
            self.stop_loss_management_collection = self.db.stoplossmanagements
            logger.success("Connected to MongoDB")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            return False

    def get_active_providers(self):
        try:
            providers = list(self.providers_collection.find({"isActive": True}))
            return [int(provider["groupId"]) for provider in providers]
        except Exception as e:
            logger.error(f"Failed to get providers: {e}")
            return []

    def get_all_providers(self):
        try:
            providers = list(self.providers_collection.find({}))
            return [
                {
                    "id": str(provider["groupId"]),
                    "name": provider["groupName"],
                    "profile_image": provider.get("profileImage", "")
                }
                for provider in providers
            ]
        except Exception as e:
            logger.error(f"Failed to get all providers: {e}")
            return []

    def close(self):
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

    # Master Trades Collection Methods
    def save_master_trade(self, trade_data):
        """Save a master trade to master_trades collection"""
        try:
            trade_data["created_at"] = datetime.utcnow()
            trade_data["status"] = "OPEN"
            trade_data["copied"] = False
            trade_data["profit"] = None
            trade_data["closed_at"] = None
            result = self.master_trades_collection.insert_one(trade_data)
            logger.success(f"Master trade saved: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            logger.error(f"Failed to save master trade: {e}")
            return None

    def get_uncopied_master_trades(self):
        """Get all master trades that haven't been copied yet"""
        try:
            trades = list(self.master_trades_collection.find({"copied": False}))
            return trades
        except Exception as e:
            logger.error(f"Failed to get uncopied trades: {e}")
            return []

    def mark_master_trade_copied(self, master_order_ticket):
        """Mark a master trade as copied"""
        try:
            # Handle backward compatibility - try both field names
            result = self.master_trades_collection.update_one(
                {"master_order_ticket": master_order_ticket},
                {"$set": {"copied": True}}
            )
            if result.matched_count == 0:
                # Try old field name
                self.master_trades_collection.update_one(
                    {"master_ticket": master_order_ticket},
                    {"$set": {"copied": True}}
                )
        except Exception as e:
            logger.error(f"Failed to mark trade as copied: {e}")

    def update_master_trade_status(self, master_order_ticket, status, profit=None):
        """Update master trade status (OPEN/CLOSED) and profit (negative for loss)"""
        try:
            update_data = {"status": status}
            if profit is not None:
                update_data["profit"] = profit
            if status == "CLOSED":
                update_data["closed_at"] = datetime.utcnow()
            
            # Handle backward compatibility - try both field names
            result = self.master_trades_collection.update_one(
                {"master_order_ticket": master_order_ticket},
                {"$set": update_data}
            )
            if result.matched_count == 0:
                # Try old field name
                self.master_trades_collection.update_one(
                    {"master_ticket": master_order_ticket},
                    {"$set": update_data}
                )
        except Exception as e:
            logger.error(f"Failed to update master trade status: {e}")

    # Trade Activity Collection Methods
    def save_trade_activity(self, activity_data):
        """Save a trade activity record for a user"""
        try:
            activity_data["created_at"] = datetime.utcnow()
            activity_data["profit"] = None
            activity_data["closed_at"] = None
            result = self.trade_activity_collection.insert_one(activity_data)
            return result.inserted_id
        except Exception as e:
            logger.error(f"Failed to save trade activity: {e}")
            return None

    def update_trade_activity(self, user_order_ticket, update_data):
        """Update trade activity (e.g., when trade closes)"""
        try:
            update_data["updated_at"] = datetime.utcnow()
            if "status" in update_data and update_data["status"] == "CLOSED":
                update_data["closed_at"] = datetime.utcnow()
            
            # Handle backward compatibility - try both field names
            result = self.trade_activity_collection.update_one(
                {"user_order_ticket": user_order_ticket},
                {"$set": update_data}
            )
            if result.matched_count == 0:
                # Try old field name
                self.trade_activity_collection.update_one(
                    {"user_ticket": user_order_ticket},
                    {"$set": update_data}
                )
        except Exception as e:
            logger.error(f"Failed to update trade activity: {e}")

    def get_user_trade_activity(self, user_id):
        """Get all trade activity for a specific user"""
        try:
            activities = list(self.trade_activity_collection.find({"user_id": user_id}))
            return activities
        except Exception as e:
            logger.error(f"Failed to get user trade activity: {e}")
            return []

    def get_open_positions_count_for_user(self, user_id):
        """Count the number of open positions for a specific user"""
        try:
            count = self.trade_activity_collection.count_documents({"user_id": user_id, "status": "OPEN"})
            return count
        except Exception as e:
            logger.error(f"Failed to count open positions for user {user_id}: {e}")
            return 0

    # Copy Jobs Collection Methods
    def create_copy_job(self, master_order_ticket):
        """Create a new copy job"""
        try:
            job_data = {
                "master_order_ticket": master_order_ticket,
                "state": "IN_PROGRESS",
                "users_processed": 0,
                "users_failed": 0,
                "started_at": datetime.utcnow(),
                "finished_at": None
            }
            result = self.copy_jobs_collection.insert_one(job_data)
            return result.inserted_id
        except Exception as e:
            logger.error(f"Failed to create copy job: {e}")
            return None

    def update_copy_job(self, job_id, update_data):
        """Update copy job progress"""
        try:
            self.copy_jobs_collection.update_one(
                {"_id": job_id},
                {"$set": update_data}
            )
        except Exception as e:
            logger.error(f"Failed to update copy job: {e}")

    # MT5 Accounts Collection Methods
    def get_active_mt5_accounts(self):
        """Get all active MT5 accounts for copying"""
        try:
            accounts = list(self.mt5_accounts_collection.find({"status": "connected", "canTrade": True}))
            return accounts
        except Exception as e:
            logger.error(f"Failed to get active MT5 accounts: {e}")
            return []

    def get_open_master_trades(self):
        """Get all open master trades for monitoring"""
        try:
            trades = list(self.master_trades_collection.find({"status": "OPEN"}))
            return trades
        except Exception as e:
            logger.error(f"Failed to get open master trades: {e}")
            return []

    def get_trade_activities_by_master_order_ticket(self, master_order_ticket):
        """Get all trade activities for a specific master order ticket"""
        try:
            # Handle backward compatibility - try both field names
            activities = list(self.trade_activity_collection.find({"master_order_ticket": master_order_ticket}))
            if not activities:
                # Try old field name
                activities = list(self.trade_activity_collection.find({"master_ticket": master_order_ticket}))
            return activities
        except Exception as e:
            logger.error(f"Failed to get trade activities by master order ticket: {e}")
            return []

    # Lot Size Management Collection Methods
    def get_active_lot_size_rules(self):
        """Get all active lot size rules sorted by min_balance"""
        try:
            rules = list(self.lot_size_management_collection.find({"active": True}).sort("min_balance", 1))
            return rules
        except Exception as e:
            logger.error(f"Failed to get lot size rules: {e}")
            return []

    def get_lot_size_for_balance(self, balance):
        """
        Find the appropriate lot size for a given balance.
        Returns the lot size if a matching rule is found, None otherwise.
        """
        try:
            rules = self.get_active_lot_size_rules()
            
            for rule in rules:
                min_balance = rule.get("min_balance")
                max_balance = rule.get("max_balance")
                lot_size = rule.get("lot_size")
                
                if min_balance is not None and max_balance is not None and lot_size is not None:
                    if min_balance <= balance <= max_balance:
                        logger.info(f"Lot size rule matched for balance ${balance}: ${min_balance}-${max_balance} -> {lot_size}")
                        return lot_size
            
            logger.warning(f"No lot size rule found for balance ${balance}")
            return None
        except Exception as e:
            logger.error(f"Failed to get lot size for balance: {e}")
            return None

    # Position Limits Collection Methods
    def get_active_position_limits(self):
        """Get all active position limit rules sorted by min_balance"""
        try:
            rules = list(self.position_limits_collection.find({"active": True}).sort("min_balance", 1))
            return rules
        except Exception as e:
            logger.error(f"Failed to get position limits: {e}")
            return []

    def get_max_positions_for_balance(self, balance):
        """
        Find the maximum number of positions allowed for a given balance.
        Returns the max positions if a matching rule is found, None otherwise.
        """
        try:
            rules = self.get_active_position_limits()
            
            for rule in rules:
                min_balance = rule.get("min_balance")
                max_balance = rule.get("max_balance")
                max_positions = rule.get("max_positions")
                
                if min_balance is not None and max_balance is not None and max_positions is not None:
                    if min_balance <= balance <= max_balance:
                        logger.info(f"Position limit matched for balance ${balance}: ${min_balance}-${max_balance} -> {max_positions} positions")
                        return max_positions
            
            logger.warning(f"No position limit found for balance ${balance}")
            return None
        except Exception as e:
            logger.error(f"Failed to get max positions for balance: {e}")
            return None

    # Stop Loss Management Collection Methods
    def get_active_stop_loss_rules(self):
        """Get all active stop loss rules sorted by min_balance"""
        try:
            rules = list(self.stop_loss_management_collection.find({"active": True}).sort("min_balance", 1))
            return rules
        except Exception as e:
            logger.error(f"Failed to get stop loss rules: {e}")
            return []

    def get_stop_loss_for_balance(self, balance):
        """
        Find the stop loss amount for a given balance.
        Returns the stop loss amount if a matching rule is found, None otherwise.
        """
        try:
            rules = self.get_active_stop_loss_rules()
            
            for rule in rules:
                min_balance = rule.get("min_balance")
                max_balance = rule.get("max_balance")
                stop_loss = rule.get("stop_loss")
                
                if min_balance is not None and max_balance is not None and stop_loss is not None:
                    if min_balance <= balance <= max_balance:
                        logger.info(f"Stop loss rule matched for balance ${balance}: ${min_balance}-${max_balance} -> ${stop_loss}")
                        return stop_loss
            
            logger.warning(f"No stop loss rule found for balance ${balance}")
            return None
        except Exception as e:
            logger.error(f"Failed to get stop loss for balance: {e}")
            return None

    def get_all_open_trades(self):
        """Get all open trades from both master_trades and trade_activity collections"""
        try:
            # Get open master trades
            master_trades = list(self.master_trades_collection.find({"status": "OPEN"}))
            
            # Get open trade activities (user trades)
            trade_activities = list(self.trade_activity_collection.find({"status": "OPEN"}))
            
            # Get user account info for display
            user_accounts = {}
            for activity in trade_activities:
                user_id = activity.get("user_id")
                if user_id and user_id not in user_accounts:
                    account = self.mt5_accounts_collection.find_one({"userId": user_id})
                    if account:
                        user_accounts[user_id] = {
                            "mt5Login": account.get("mt5Login"),
                            "server": account.get("server")
                        }
            
            # Attach user account info to trade activities
            for activity in trade_activities:
                user_id = activity.get("user_id")
                if user_id in user_accounts:
                    activity["account_info"] = user_accounts[user_id]
                else:
                    activity["account_info"] = None
            
            return {
                "master_trades": master_trades,
                "trade_activities": trade_activities
            }
        except Exception as e:
            logger.error(f"Failed to get all open trades: {e}")
            return {"master_trades": [], "trade_activities": []}

    def get_mt5_accounts_for_trades(self):
        """Get all MT5 accounts with their credentials for trade management"""
        try:
            accounts = list(self.mt5_accounts_collection.find({"status": "connected", "canTrade": True}))
            # Return only necessary fields
            return [
                {
                    "userId": str(acc.get("userId")),
                    "mt5Login": acc.get("mt5Login"),
                    "password": acc.get("password"),
                    "server": acc.get("server")
                }
                for acc in accounts
            ]
        except Exception as e:
            logger.error(f"Failed to get MT5 accounts for trades: {e}")
            return []

# Global database instance
db = Database()
