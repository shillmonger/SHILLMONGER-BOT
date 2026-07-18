import asyncio

from telegram.listener import TelegramListener


async def main():

    listener = TelegramListener()

    await listener.start()


if __name__ == "__main__":

    asyncio.run(main())