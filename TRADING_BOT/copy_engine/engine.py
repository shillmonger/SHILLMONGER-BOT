import time
import asyncio
from core.database import db
from core.logger import logger
from mt5.copy_connector import MT5CopyConnector
from mt5.copy_trader import MT5CopyTrader


class CopyEngine:
    """
    Watches master_trades collection and copies trades to user accounts.
    """

    def __init__(self):
        self.running = False
        self.copy_connector = MT5CopyConnector()
        self.copy_trader = None

    def start(self):
        """Start the copy engine loop."""
        self.running = True
        logger.success("Copy Engine started")

        # Initialize MT5 terminal once
        if not self.copy_connector.initialize():
            logger.error("Failed to initialize MT5 Copy Engine terminal")
            return

        try:
            while self.running:
                try:
                    self.process_uncopied_trades()
                    time.sleep(2)  # Check every 2 seconds
                except Exception as e:
                    logger.error(f"Copy Engine error: {e}")
                    time.sleep(5)
        finally:
            # Shutdown terminal when stopping
            self.copy_connector.shutdown()

    def stop(self):
        """Stop the copy engine."""
        self.running = False
        logger.info("Copy Engine stopping...")

    def process_uncopied_trades(self):
        """Process all uncopied master trades."""
        uncopied_trades = db.get_uncopied_master_trades()

        if not uncopied_trades:
            return

        logger.info(f"Found {len(uncopied_trades)} uncopied master trades")

        for trade in uncopied_trades:
            self.copy_trade_to_users(trade)

    def copy_trade_to_users(self, master_trade):
        """Copy a single master trade to all active users."""
        # Handle backward compatibility for old database records
        master_order_ticket = master_trade.get("master_order_ticket") or master_trade.get("master_ticket")
        
        logger.info(f"Processing copy job for master trade: {master_order_ticket}")

        # Create copy job record
        job_id = db.create_copy_job(master_order_ticket)
        
        users_processed = 0
        users_failed = 0

        # Get all active MT5 accounts
        active_accounts = db.get_active_mt5_accounts()
        
        logger.info(f"Found {len(active_accounts)} active accounts to copy to")

        for account in active_accounts:
            try:
                user_id = str(account["userId"])
                login = int(account["mt5Login"])
                password = account["password"]
                server = account["server"]
                
                # Login to user account
                if not self.copy_connector.connect(login, password, server):
                    logger.error(f"Failed to connect to user {login}")
                    users_failed += 1
                    continue

                self.copy_trader = MT5CopyTrader(self.copy_connector)

                # Calculate lot size based on user balance (simple 1:1 for now)
                # TODO: Implement proper lot sizing based on user balance vs master balance
                lot_size = master_trade["lot"]

                # Execute copy trade
                result = self.copy_trader.execute_copy_trade(master_trade, lot_size)

                if result.success:
                    # Save trade activity
                    activity_data = {
                        "user_id": user_id,
                        "master_order_ticket": master_order_ticket,
                        "user_order_ticket": result.order,
                        "user_entry_deal": result.deal,
                        "symbol": result.symbol,
                        "type": result.direction,
                        "entry": result.entry_price,
                        "lot": result.lot_size,
                        "sl": master_trade.get("sl"),
                        "tp": master_trade.get("tp"),
                        "status": "OPEN"
                    }
                    db.save_trade_activity(activity_data)
                    users_processed += 1
                else:
                    users_failed += 1

                # Logout from user account (keeps terminal running)
                self.copy_connector.disconnect()

            except Exception as e:
                logger.error(f"Error copying to user {login}: {e}")
                users_failed += 1
                try:
                    self.copy_connector.disconnect()
                except:
                    pass

        # Update copy job
        db.update_copy_job(job_id, {
            "state": "COMPLETED",
            "users_processed": users_processed,
            "users_failed": users_failed,
            "finished_at": None  # Will be set by database
        })

        # Mark master trade as copied
        db.mark_master_trade_copied(master_order_ticket)

        logger.success(
            f"Copy job completed for master trade {master_order_ticket} | "
            f"Processed: {users_processed} | Failed: {users_failed}"
        )
