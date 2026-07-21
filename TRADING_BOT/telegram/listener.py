from telethon import TelegramClient
from telethon import events
import os
from pathlib import Path

from config import *
from core.logger import logger
from core.database import db
from telegram.parser import SignalParser
from core.validator import SignalValidator
from mt5.connector import MT5Connector
from mt5.trader import MT5Trader
from mt5.risk import RiskManager


class TelegramListener:

    def __init__(self):

        # Get the directory where this script is located
        script_dir = Path(__file__).parent.parent
        session_path = script_dir / "sessions" / "tradingbot"

        self.client = TelegramClient(
            str(session_path),
            API_ID,
            API_HASH
        )

        # Connect to database
        if not db.connect():
            raise RuntimeError("Failed to connect to database")

        # Get groups from database instead of JSON file
        self.groups = db.get_active_providers()

        self.parser = SignalParser()
        self.validator = SignalValidator()

        self.mt5_connector = MT5Connector()
        self.mt5_trader = None
        self.risk_manager = None

    async def login(self):

        await self.client.start(PHONE_NUMBER)

        logger.success("Telegram Connected!")

    async def listen(self):

        @self.client.on(events.NewMessage(chats=self.groups))

        async def handler(event):

            logger.info("=" * 60)

            chat = await event.get_chat()

            group_name = "Unknown"

            if chat:
                group_name = getattr(chat, "title", "Unknown")

            logger.success(f"GROUP : {group_name}")
            logger.info(f"CHAT ID : {event.chat_id}")

            print()

            logger.info(event.raw_text)

            logger.info("=" * 60)

            signal = self.parser.parse(
                message=event.raw_text,
                chat_id=event.chat_id,
                group_name=group_name,
            )

            if signal is None:
                logger.warning("Not a valid trading signal.")
                return

            logger.success("Signal Parsed Successfully")
            logger.info(signal)

            valid, reason = self.validator.validate(signal)

            if not valid:
                logger.warning(reason)
                return

            logger.success("Signal Validated")

            # Risk management checks
            risk_valid, risk_reason = self.risk_manager.validate_signal(signal, LOT_SIZE)

            if not risk_valid:
                logger.warning(risk_reason)
                return

            logger.success("Risk Checks Passed")

            result = self.mt5_trader.execute_trade(signal)

            if result.success:
                logger.success(
                    f"Trade opened successfully. Order: {result.order}, Deal: {result.deal}"
                )
                
                # Save master trade to database for copy engine
                trade_data = {
                    "master_order_ticket": result.order,
                    "master_entry_deal": result.deal,
                    "symbol": result.symbol,
                    "type": result.direction,
                    "entry": result.entry_price,
                    "sl": signal.stop_loss,
                    "tp": signal.take_profits,
                    "lot": result.lot_size,
                    "group_name": group_name,  # Track which group sent the signal
                }
                db.save_master_trade(trade_data)
            else:
                logger.error(
                    f"Trade failed: {result.message}"
                )

    async def start(self):

        await self.login()

        if not self.mt5_connector.connect():
            raise RuntimeError("Failed to connect to MT5.")

        self.mt5_trader = MT5Trader(self.mt5_connector)
        self.risk_manager = RiskManager(self.mt5_connector)

        await self.listen()

        logger.success("Waiting For Signals...")

        await self.client.run_until_disconnected()