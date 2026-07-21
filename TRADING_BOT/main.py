import asyncio
import threading
from telegram.listener import TelegramListener
from mt5.trade_monitor import TradeMonitor


async def main():
    listener = TelegramListener()
    
    # Start trade monitor in background thread
    trade_monitor = TradeMonitor(listener.mt5_connector)
    monitor_thread = threading.Thread(target=trade_monitor.start, daemon=True)
    monitor_thread.start()
    
    # Start telegram listener
    await listener.start()


if __name__ == "__main__":
    asyncio.run(main())