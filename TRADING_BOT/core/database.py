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

    def connect(self):
        try:
            self.client = MongoClient(MONGODB_URI)
            self.db = self.client.get_database()
            self.providers_collection = self.db.providers
            self.master_trades_collection = self.db.master_trades
            self.trade_activity_collection = self.db.trade_activity
            self.copy_jobs_collection = self.db.copy_jobs
            self.mt5_accounts_collection = self.db.mt5accounts
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
            trade_data["profit"] = 0.0
            trade_data["loss"] = 0.0
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

    def mark_master_trade_copied(self, master_ticket):
        """Mark a master trade as copied"""
        try:
            self.master_trades_collection.update_one(
                {"master_ticket": master_ticket},
                {"$set": {"copied": True}}
            )
        except Exception as e:
            logger.error(f"Failed to mark trade as copied: {e}")

    def update_master_trade_status(self, master_ticket, status, profit=0.0, loss=0.0):
        """Update master trade status (OPEN/CLOSED) and profit/loss"""
        try:
            update_data = {"status": status}
            if profit != 0.0:
                update_data["profit"] = profit
            if loss != 0.0:
                update_data["loss"] = loss
            if status == "CLOSED":
                update_data["closed_at"] = datetime.utcnow()
            
            self.master_trades_collection.update_one(
                {"master_ticket": master_ticket},
                {"$set": update_data}
            )
        except Exception as e:
            logger.error(f"Failed to update master trade status: {e}")

    # Trade Activity Collection Methods
    def save_trade_activity(self, activity_data):
        """Save a trade activity record for a user"""
        try:
            activity_data["created_at"] = datetime.utcnow()
            activity_data["profit"] = 0.0
            activity_data["loss"] = 0.0
            result = self.trade_activity_collection.insert_one(activity_data)
            return result.inserted_id
        except Exception as e:
            logger.error(f"Failed to save trade activity: {e}")
            return None

    def update_trade_activity(self, user_ticket, update_data):
        """Update trade activity (e.g., when trade closes)"""
        try:
            update_data["updated_at"] = datetime.utcnow()
            if "status" in update_data and update_data["status"] == "CLOSED":
                update_data["closed_at"] = datetime.utcnow()
            self.trade_activity_collection.update_one(
                {"user_ticket": user_ticket},
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

    # Copy Jobs Collection Methods
    def create_copy_job(self, master_ticket):
        """Create a new copy job"""
        try:
            job_data = {
                "master_ticket": master_ticket,
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
            accounts = list(self.mt5_accounts_collection.find({"status": "connected"}))
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

    def get_trade_activities_by_master_ticket(self, master_ticket):
        """Get all trade activities for a specific master ticket"""
        try:
            activities = list(self.trade_activity_collection.find({"master_ticket": master_ticket}))
            return activities
        except Exception as e:
            logger.error(f"Failed to get trade activities by master ticket: {e}")
            return []

# Global database instance
db = Database()
