import MetaTrader5 as mt5
import time
from core.logger import logger
from core.models import TradeResult


class MT5CopyTrader:
    """
    Handles trade execution on user accounts for the copy engine.
    """

    MAGIC_NUMBER = 20260714  # Different magic number for copied trades

    def __init__(self, connector):
        self.connector = connector

    def get_valid_tick(self, symbol: str, max_retries: int = 3, retry_delay: float = 0.5):
        """
        Get valid tick data for a symbol with retries.
        Returns None if unable to get valid tick data after retries.
        """
        for attempt in range(max_retries):
            tick = mt5.symbol_info_tick(symbol)
            
            if tick is None:
                if attempt < max_retries - 1:
                    logger.warning(f"Tick data is None for {symbol}, retrying ({attempt + 1}/{max_retries})...")
                    time.sleep(retry_delay)
                    continue
                else:
                    return None
            
            # Check if prices are valid (non-zero)
            if tick.ask > 0 and tick.bid > 0:
                return tick
            
            if attempt < max_retries - 1:
                logger.warning(f"Invalid tick prices for {symbol} (ask={tick.ask}, bid={tick.bid}), retrying ({attempt + 1}/{max_retries})...")
                time.sleep(retry_delay)
                continue
            else:
                logger.error(f"Invalid tick prices for {symbol} after {max_retries} retries (ask={tick.ask}, bid={tick.bid})")
                return None
        
        return None

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

        tick = self.get_valid_tick(symbol)

        if tick is None:
            return TradeResult(
                success=False,
                message="Unable to obtain valid market price after retries."
            )

        # Determine order type and price based on master trade
        trade_type = master_trade["type"].upper()
        order_type_from_db = master_trade.get("order_type", "MARKET").upper()
        entry_price = master_trade.get("entry")
        
        # Handle different order types
        if order_type_from_db == "MARKET":
            # Market order - execute immediately
            if trade_type == "BUY":
                order_type = mt5.ORDER_TYPE_BUY
                price = tick.ask
                trade_action = mt5.TRADE_ACTION_DEAL
                type_filling = mt5.ORDER_FILLING_IOC
            else:  # SELL
                order_type = mt5.ORDER_TYPE_SELL
                price = tick.bid
                trade_action = mt5.TRADE_ACTION_DEAL
                type_filling = mt5.ORDER_FILLING_IOC
        elif order_type_from_db == "BUY_LIMIT":
            # Buy Limit order
            order_type = mt5.ORDER_TYPE_BUY_LIMIT
            price = entry_price
            trade_action = mt5.TRADE_ACTION_PENDING
            type_filling = mt5.ORDER_FILLING_RETURN
        elif order_type_from_db == "SELL_LIMIT":
            # Sell Limit order
            order_type = mt5.ORDER_TYPE_SELL_LIMIT
            price = entry_price
            trade_action = mt5.TRADE_ACTION_PENDING
            type_filling = mt5.ORDER_FILLING_RETURN
        elif order_type_from_db == "BUY_STOP":
            # Buy Stop order
            order_type = mt5.ORDER_TYPE_BUY_STOP
            price = entry_price
            trade_action = mt5.TRADE_ACTION_PENDING
            type_filling = mt5.ORDER_FILLING_RETURN
        elif order_type_from_db == "SELL_STOP":
            # Sell Stop order
            order_type = mt5.ORDER_TYPE_SELL_STOP
            price = entry_price
            trade_action = mt5.TRADE_ACTION_PENDING
            type_filling = mt5.ORDER_FILLING_RETURN
        elif order_type_from_db == "PENDING":
            # Legacy PENDING - auto-detect based on entry price vs current price
            trade_action = mt5.TRADE_ACTION_PENDING
            price = entry_price
            
            if trade_type == "BUY":
                if entry_price <= tick.ask:
                    # Entry below current price → BUY LIMIT
                    order_type = mt5.ORDER_TYPE_BUY_LIMIT
                else:
                    # Entry above current price → BUY STOP
                    order_type = mt5.ORDER_TYPE_BUY_STOP
            else:  # SELL
                if entry_price >= tick.bid:
                    # Entry above current price → SELL LIMIT
                    order_type = mt5.ORDER_TYPE_SELL_LIMIT
                else:
                    # Entry below current price → SELL STOP
                    order_type = mt5.ORDER_TYPE_SELL_STOP
            
            type_filling = mt5.ORDER_FILLING_RETURN
        else:
            # Fallback to MARKET if order_type is unknown
            logger.warning(f"Unknown order_type '{order_type_from_db}', defaulting to MARKET")
            if trade_type == "BUY":
                order_type = mt5.ORDER_TYPE_BUY
                price = tick.ask
                trade_action = mt5.TRADE_ACTION_DEAL
                type_filling = mt5.ORDER_FILLING_IOC
            else:  # SELL
                order_type = mt5.ORDER_TYPE_SELL
                price = tick.bid
                trade_action = mt5.TRADE_ACTION_DEAL
                type_filling = mt5.ORDER_FILLING_IOC

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
            # Formula: price_distance = (sl_dollar * trade_tick_size) / (trade_tick_value * lot_size)
            symbol_info_data = mt5.symbol_info(symbol)
            if symbol_info_data:
                tick_size = symbol_info_data.trade_tick_size
                tick_value = symbol_info_data.trade_tick_value
                logger.info(f"SL Conversion - Entry: {price}, Lot: {lot_size}, SL Dollar: ${sl_dollar}, Tick Size: {tick_size}, Tick Value: {tick_value}")
                if tick_value and tick_value > 0 and tick_size and tick_size > 0:
                    ticks = sl_dollar / (tick_value * lot_size)
                    price_distance = ticks * tick_size
                    logger.info(f"SL Conversion - Ticks: {ticks}, Price Distance: {price_distance}")
                    if trade_type == "BUY":
                        sl_price = price - price_distance
                    else:  # SELL
                        sl_price = price + price_distance
                    logger.info(f"SL Conversion - Calculated SL Price: {sl_price}")
                else:
                    logger.warning(f"Invalid tick_value or tick_size for {symbol}, cannot convert SL")
            else:
                logger.warning(f"Cannot get symbol info for {symbol}, cannot convert SL")

        # Validate and adjust SL/TP to meet minimum stop level requirements
        symbol_info_data = mt5.symbol_info(symbol)
        if symbol_info_data:
            # Get minimum stop level from symbol
            stops_level = symbol_info_data.trade_stops_level  # Minimum distance in points
            point = symbol_info_data.point  # Value of one point
            min_distance = stops_level * point if stops_level > 0 else 0

            if min_distance > 0:
                # Validate SL
                if sl_price is not None:
                    if trade_type == "BUY":
                        if price - sl_price < min_distance:
                            logger.warning(f"SL too close to entry for {symbol}. Adjusting to minimum distance.")
                            sl_price = price - min_distance
                    else:  # SELL
                        if sl_price - price < min_distance:
                            logger.warning(f"SL too close to entry for {symbol}. Adjusting to minimum distance.")
                            sl_price = price + min_distance

                # Validate TP
                if tp_to_use is not None:
                    if trade_type == "BUY":
                        if tp_to_use - price < min_distance:
                            logger.warning(f"TP too close to entry for {symbol}. Adjusting to minimum distance.")
                            tp_to_use = price + min_distance
                    else:  # SELL
                        if price - tp_to_use < min_distance:
                            logger.warning(f"TP too close to entry for {symbol}. Adjusting to minimum distance.")
                            tp_to_use = price - min_distance

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
