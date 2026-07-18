from pymongo import MongoClient
from config import MONGODB_URI
from core.logger import logger

class Database:
    def __init__(self):
        self.client = None
        self.db = None
        self.providers_collection = None

    def connect(self):
        try:
            self.client = MongoClient(MONGODB_URI)
            self.db = self.client.get_database()
            self.providers_collection = self.db.providers
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

# Global database instance
db = Database()
