import time
import MetaTrader5 as mt5
from core.database import db
from core.logger import logger


class TradeMonitor:
    """
    Monitors master account for closed trades and updates database with profit/loss.
    """

    def __init__(self, connector):
        self.connector = connector
        self.running = False

    def start(self):
        """Start the trade monitoring loop."""
        self.running = True
        logger.success("Trade Monitor started")

        while self.running:
            try:
                self.check_closed_trades()
                time.sleep(10)  # Check every 10 seconds
            except Exception as e:
                logger.error(f"Trade Monitor error: {e}")
                time.sleep(5)

    def stop(self):
        """Stop the trade monitor."""
        self.running = False
        logger.info("Trade Monitor stopped")

    def check_closed_trades(self):
        """Check for closed trades and update database."""
        if not self.connector.is_connected():
            return

        # Get open trades from database
        open_master_trades = db.get_open_master_trades()

        if not open_master_trades:
            return

        # Get current positions from MT5
        positions = mt5.positions_get()
        if positions is None:
            return

        # Get set of open ticket numbers from MT5
        open_tickets = {position.ticket for position in positions}

        # Check each database trade
        for trade in open_master_trades:
            master_ticket = trade["master_ticket"]

            # If ticket not in MT5 positions, trade has closed
            if master_ticket not in open_tickets:
                self.process_closed_trade(master_ticket)

    def process_closed_trade(self, master_ticket):
        """Process a closed trade and update database."""
        logger.info(f"Processing closed trade: {master_ticket}")

        # Get trade history from MT5
        history = mt5.history_deals_get(ticket=master_ticket)
        
        if history is None or len(history) == 0:
            logger.warning(f"No history found for ticket {master_ticket}")
            return

        deal = history[0]
        profit = deal.profit
        commission = deal.commission if hasattr(deal, 'commission') else 0
        swap = deal.swap if hasattr(deal, 'swap') else 0
        
        # Calculate net profit/loss
        net_profit = profit + commission + swap

        # Determine if profit or loss
        if net_profit > 0:
            profit_value = net_profit
            loss_value = 0.0
        else:
            profit_value = 0.0
            loss_value = abs(net_profit)

        # Update master trade record
        db.update_master_trade_status(
            master_ticket, 
            "CLOSED",
            profit=profit_value,
            loss=loss_value
        )

        logger.success(
            f"Master trade {master_ticket} closed | "
            f"Profit: ${profit_value:.2f} | Loss: ${loss_value:.2f}"
        )

        # Update all related trade activities
        activities = db.get_trade_activities_by_master_ticket(master_ticket)
        
        for activity in activities:
            user_ticket = activity["user_ticket"]
            
            # Get user trade history
            user_history = mt5.history_deals_get(ticket=user_ticket)
            
            if user_history and len(user_history) > 0:
                user_deal = user_history[0]
                user_profit = user_deal.profit
                user_commission = user_deal.commission if hasattr(user_deal, 'commission') else 0
                user_swap = user_deal.swap if hasattr(user_deal, 'swap') else 0
                
                user_net_profit = user_profit + user_commission + user_swap
                
                if user_net_profit > 0:
                    user_profit_value = user_net_profit
                    user_loss_value = 0.0
                else:
                    user_profit_value = 0.0
                    user_loss_value = abs(user_net_profit)

                # Update trade activity
                db.update_trade_activity(user_ticket, {
                    "status": "CLOSED",
                    "profit": user_profit_value,
                    "loss": user_loss_value
                })

                logger.success(
                    f"User trade {user_ticket} closed | "
                    f"Profit: ${user_profit_value:.2f} | Loss: ${user_loss_value:.2f}"
                )
