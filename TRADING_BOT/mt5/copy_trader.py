import MetaTrader5 as mt5
from core.logger import logger
from core.models import TradeResult


class MT5CopyTrader:
    """
    Handles trade execution on user accounts for the copy engine.
    """

    MAGIC_NUMBER = 20260714  # Different magic number for copied trades

    def __init__(self, connector):
        self.connector = connector

    def execute_copy_trade(self, master_trade, lot_size: float) -> TradeResult:
        """
        Execute a copy trade on the connected user account.
        """
        if not self.connector.is_connected():
            return TradeResult(
                success=False,
                message="MT5 Copy Engine is not connected."
            )

        symbol = master_trade["symbol"]

        # Ensure symbol is available
        symbol_info = mt5.symbol_info(symbol)

        if symbol_info is None:
            return TradeResult(
                success=False,
                message=f"Symbol {symbol} not found."
            )

        if not symbol_info.visible:
            if not mt5.symbol_select(symbol, True):
                return TradeResult(
                    success=False,
                    message=f"Unable to select {symbol}."
                )

        tick = mt5.symbol_info_tick(symbol)

        if tick is None:
            return TradeResult(
                success=False,
                message="Unable to obtain market price."
            )

        # Determine order type and price based on master trade
        trade_type = master_trade["type"].upper()
        
        if trade_type == "BUY":
            order_type = mt5.ORDER_TYPE_BUY
            price = tick.ask
            trade_action = mt5.TRADE_ACTION_DEAL
            type_filling = mt5.ORDER_FILLING_IOC
        elif trade_type == "SELL":
            order_type = mt5.ORDER_TYPE_SELL
            price = tick.bid
            trade_action = mt5.TRADE_ACTION_DEAL
            type_filling = mt5.ORDER_FILLING_IOC
        else:
            return TradeResult(
                success=False,
                message=f"Unknown trade type: {trade_type}"
            )

        # Handle backward compatibility for old database records
        master_order_ticket = master_trade.get("master_order_ticket") or master_trade.get("master_ticket")

        # Select TP based on number of TPs (same logic as master trader)
        # 1 TP: use TP[0]
        # 2-3 TPs: use last TP
        # 4+ TPs: use second-to-last TP
        tps = master_trade.get("tp", [])
        if tps:
            num_tps = len(tps)
            if num_tps == 1:
                tp_to_use = tps[0]
            elif num_tps <= 3:
                tp_to_use = tps[-1]  # Last TP
            else:
                tp_to_use = tps[-2]  # Second-to-last TP
        else:
            tp_to_use = None

        # Handle SL - check if it's a dollar amount that needs conversion to price level
        sl_price = master_trade.get("sl")
        sl_dollar = master_trade.get("sl_dollar")
        if sl_dollar is not None:
            # Convert dollar amount to price level
            # Formula: SL_price = Entry_price ± (Dollar_amount / (Lot_size * Tick_value))
            symbol_info_tick = mt5.symbol_info_tick(symbol)
            if symbol_info_tick:
                tick_value = symbol_info_tick.trade_tick_value  # Value of 1 tick in account currency
                if tick_value and tick_value > 0:
                    price_distance = sl_dollar / (lot_size * tick_value)
                    if trade_type == "BUY":
                        sl_price = price - price_distance
                    else:  # SELL
                        sl_price = price + price_distance
                    logger.info(f"Converted SL ${sl_dollar} to price level: {sl_price}")
                else:
                    logger.warning(f"Invalid tick_value for {symbol}, cannot convert SL")
            else:
                logger.warning(f"Cannot get tick info for {symbol}, cannot convert SL")
        
        request = {
            "action": trade_action,
            "symbol": symbol,
            "volume": lot_size,
            "type": order_type,
            "price": price,
            "sl": sl_price,
            "tp": tp_to_use,
            "deviation": 20,
            "magic": self.MAGIC_NUMBER,
            "comment": f"Copy from Master #{master_order_ticket}",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": type_filling,
        }

        result = mt5.order_send(request)

        if result is None:
            return TradeResult(
                success=False,
                message="order_send() returned None."
            )

        if result.retcode != mt5.TRADE_RETCODE_DONE:
            logger.error(
                f"Copy trade failed for {symbol} | "
                f"Error: {result.retcode} | "
                f"Comment: {result.comment}"
            )
            return TradeResult(
                success=False,
                message=result.comment,
                error_code=result.retcode,
            )

        logger.success(
            f"Copy trade executed {trade_type} {symbol} | "
            f"User Order: {result.order} Deal: {result.deal} | "
            f"Master Order: {master_trade['master_order_ticket']}"
        )

        return TradeResult(
            success=True,
            order=result.order,
            deal=result.deal,
            symbol=symbol,
            direction=trade_type,
            entry_price=price,
            lot_size=lot_size,
            message="Copy trade executed successfully."
        )
