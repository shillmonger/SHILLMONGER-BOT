import MetaTrader5 as mt5

from config import LOT_SIZE, SYMBOL
from core.logger import logger
from core.models import TradeResult, TradingSignal


class MT5Trader:

    MAGIC_NUMBER = 20260713

    def __init__(self, connector):
        self.connector = connector

    def execute_trade(self, signal: TradingSignal) -> TradeResult:
        """
        Execute a market or pending order based on a validated TradingSignal.
        Uses the default LOT_SIZE from config.
        """
        return self.execute_trade_with_lot_size(signal, LOT_SIZE)

    def execute_trade_with_lot_size(self, signal: TradingSignal, lot_size: float) -> TradeResult:
        """
        Execute a market or pending order based on a validated TradingSignal.
        Uses the provided lot_size parameter.
        """

        if not self.connector.is_connected():
            return TradeResult(
                success=False,
                message="MT5 is not connected."
            )

        symbol = SYMBOL

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

        # Determine order type and price based on signal
        if signal.order_type == "MARKET":
            # Market order - execute immediately
            trade_action = mt5.TRADE_ACTION_DEAL
            if signal.direction == "BUY":
                order_type = mt5.ORDER_TYPE_BUY
                price = tick.ask
            else:
                order_type = mt5.ORDER_TYPE_SELL
                price = tick.bid
            type_filling = mt5.ORDER_FILLING_IOC
        elif signal.order_type == "BUY_LIMIT":
            # Buy Limit order
            trade_action = mt5.TRADE_ACTION_PENDING
            order_type = mt5.ORDER_TYPE_BUY_LIMIT
            price = signal.entry
            type_filling = mt5.ORDER_FILLING_RETURN
        elif signal.order_type == "SELL_LIMIT":
            # Sell Limit order
            trade_action = mt5.TRADE_ACTION_PENDING
            order_type = mt5.ORDER_TYPE_SELL_LIMIT
            price = signal.entry
            type_filling = mt5.ORDER_FILLING_RETURN
        elif signal.order_type == "BUY_STOP":
            # Buy Stop order
            trade_action = mt5.TRADE_ACTION_PENDING
            order_type = mt5.ORDER_TYPE_BUY_STOP
            price = signal.entry
            type_filling = mt5.ORDER_FILLING_RETURN
        elif signal.order_type == "SELL_STOP":
            # Sell Stop order
            trade_action = mt5.TRADE_ACTION_PENDING
            order_type = mt5.ORDER_TYPE_SELL_STOP
            price = signal.entry
            type_filling = mt5.ORDER_FILLING_RETURN
        else:
            # Legacy PENDING - auto-detect based on entry price
            trade_action = mt5.TRADE_ACTION_PENDING
            price = signal.entry
            
            if signal.direction == "BUY":
                if signal.entry <= tick.ask:
                    # Entry below current price → BUY LIMIT
                    order_type = mt5.ORDER_TYPE_BUY_LIMIT
                else:
                    # Entry above current price → BUY STOP
                    order_type = mt5.ORDER_TYPE_BUY_STOP
            else:
                if signal.entry >= tick.bid:
                    # Entry above current price → SELL LIMIT
                    order_type = mt5.ORDER_TYPE_SELL_LIMIT
                else:
                    # Entry below current price → SELL STOP
                    order_type = mt5.ORDER_TYPE_SELL_STOP
            
            type_filling = mt5.ORDER_FILLING_RETURN

        request = {
            "action": trade_action,
            "symbol": symbol,
            "volume": lot_size,
            "type": order_type,
            "price": price,
            "sl": signal.stop_loss,
            "tp": signal.take_profits[0],      # TP1 only
            "deviation": 20,
            "magic": self.MAGIC_NUMBER,
            "comment": "Telegram Copier",
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
                f"Trade failed "
                f"{result.retcode} "
                f"{result.comment}"
            )

            return TradeResult(
                success=False,
                message=result.comment,
                error_code=result.retcode,
            )

        logger.success(
            f"{signal.direction} executed "
            f"{symbol} "
            f"Order={result.order} Deal={result.deal}"
        )

        return TradeResult(
            success=True,
            order=result.order,
            deal=result.deal,
            symbol=symbol,
            direction=signal.direction,
            entry_price=price,
            lot_size=lot_size,
            message="Trade executed successfully."
        )