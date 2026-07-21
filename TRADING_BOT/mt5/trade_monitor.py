import time
from datetime import datetime, timedelta
import MetaTrader5 as mt5
from core.database import db
from core.logger import logger


class TradeMonitor:
    """
    Monitors master account for closed trades and updates database with profit/loss.
    Uses time-window history search instead of ticket-based search for reliability.
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
                import traceback
                logger.error(traceback.format_exc())
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

        logger.info(f"Checking {len(open_master_trades)} open master trades")

        # Get current positions from MT5
        positions = mt5.positions_get()
        if positions is None:
            logger.warning("positions_get() returned None")
            return

        # Get set of open position ticket numbers from MT5
        open_tickets = {position.ticket for position in positions}
        logger.info(f"Open MT5 positions: {len(open_tickets)} tickets")

        # Check each database trade
        for trade in open_master_trades:
            # Handle backward compatibility for old database records
            master_order_ticket = trade.get("master_order_ticket") or trade.get("master_ticket")
            master_entry_deal = trade.get("master_entry_deal")

            logger.info(f"Checking master trade: Order={master_order_ticket}, Entry Deal={master_entry_deal}")

            # If order ticket not in MT5 positions, trade has closed
            if master_order_ticket not in open_tickets:
                logger.info(f"Trade {master_order_ticket} not in open positions - processing as closed")
                self.process_closed_trade(trade)

    def process_closed_trade(self, trade):
        """Process a closed trade and update database."""
        master_order_ticket = trade["master_order_ticket"]
        master_entry_deal = trade.get("master_entry_deal")
        symbol = trade["symbol"]

        logger.info(f"Processing closed trade: Order={master_order_ticket}, Symbol={symbol}")

        # Get history for the last 24 hours (or since trade was created)
        from_time = datetime.utcnow() - timedelta(hours=24)
        history = mt5.history_deals_get(from_time, datetime.utcnow())
        
        if history is None or len(history) == 0:
            logger.warning(f"No history found for time window")
            return

        logger.info(f"Found {len(history)} deals in history window")

        # Find all deals related to this trade (by symbol and matching entry deal)
        related_deals = []
        for deal in history:
            if deal.symbol == symbol and deal.ticket == master_entry_deal:
                related_deals.append(deal)
                logger.info(f"Found entry deal: {deal.ticket}")

        # Also find closing deals for this position (same symbol, opposite direction, or close type)
        for deal in history:
            if deal.symbol == symbol and deal.ticket != master_entry_deal:
                # This could be a closing deal
                related_deals.append(deal)
                logger.info(f"Found related deal: {deal.ticket}, Type: {deal.type}, Profit: {deal.profit}")

        if not related_deals:
            logger.warning(f"No related deals found for trade {master_order_ticket}")
            return

        # Calculate total profit/loss from all related deals
        total_profit = 0.0
        total_commission = 0.0
        total_swap = 0.0

        for deal in related_deals:
            total_profit += deal.profit
            total_commission += deal.commission if hasattr(deal, 'commission') else 0
            total_swap += deal.swap if hasattr(deal, 'swap') else 0

        net_profit = total_profit + total_commission + total_swap

        logger.info(
            f"Trade {master_order_ticket} P&L calculation: "
            f"Profit={total_profit:.2f}, Commission={total_commission:.2f}, "
            f"Swap={total_swap:.2f}, Net={net_profit:.2f}"
        )

        # Update master trade record
        db.update_master_trade_status(
            master_order_ticket, 
            "CLOSED",
            profit=net_profit
        )

        logger.success(
            f"Master trade {master_order_ticket} closed | Net Profit: ${net_profit:.2f}"
        )

        # Update all related trade activities
        activities = db.get_trade_activities_by_master_order_ticket(master_order_ticket)
        
        logger.info(f"Found {len(activities)} related trade activities to update")

        for activity in activities:
            # Handle backward compatibility for old database records
            user_order_ticket = activity.get("user_order_ticket") or activity.get("user_ticket")
            user_entry_deal = activity.get("user_entry_deal")
            
            logger.info(f"Processing user trade: Order={user_order_ticket}, Entry Deal={user_entry_deal}")

            # Get user trade history
            user_history = mt5.history_deals_get(from_time, datetime.utcnow())
            
            if user_history and len(user_history) > 0:
                # Find all deals related to this user trade
                user_related_deals = []
                for deal in user_history:
                    if deal.symbol == symbol and deal.ticket == user_entry_deal:
                        user_related_deals.append(deal)
                
                for deal in user_history:
                    if deal.symbol == symbol and deal.ticket != user_entry_deal:
                        user_related_deals.append(deal)

                if user_related_deals:
                    user_total_profit = 0.0
                    user_total_commission = 0.0
                    user_total_swap = 0.0

                    for deal in user_related_deals:
                        user_total_profit += deal.profit
                        user_total_commission += deal.commission if hasattr(deal, 'commission') else 0
                        user_total_swap += deal.swap if hasattr(deal, 'swap') else 0

                    user_net_profit = user_total_profit + user_total_commission + user_total_swap

                    logger.info(
                        f"User trade {user_order_ticket} P&L: "
                        f"Profit={user_total_profit:.2f}, Net={user_net_profit:.2f}"
                    )

                    # Update trade activity
                    db.update_trade_activity(user_order_ticket, {
                        "status": "CLOSED",
                        "profit": user_net_profit
                    })

                    logger.success(
                        f"User trade {user_order_ticket} closed | Net Profit: ${user_net_profit:.2f}"
                    )
                else:
                    logger.warning(f"No related deals found for user trade {user_order_ticket}")
            else:
                logger.warning(f"No history found for user trade {user_order_ticket}")
                logger.warning(f"No history found for user trade {user_order_ticket}")
