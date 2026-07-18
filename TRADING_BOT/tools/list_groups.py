import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from telethon import TelegramClient
from telethon.tl.types import Channel, Chat

from config import API_ID, API_HASH, PHONE_NUMBER


async def main():
    client = TelegramClient(
        "sessions/tradingbot",
        API_ID,
        API_HASH
    )

    await client.start(phone=PHONE_NUMBER)

    print("\n" + "=" * 80)
    print("YOUR TELEGRAM GROUPS / CHANNELS")
    print("=" * 80)

    dialogs = await client.get_dialogs()

    groups = []

    for dialog in dialogs:

        if isinstance(dialog.entity, (Channel, Chat)):

            groups.append({
                "name": dialog.name,
                "id": dialog.id
            })

    groups.sort(key=lambda x: x["name"].lower())

    for i, group in enumerate(groups, start=1):

        print(f"\n[{i}]")
        print(f"Name : {group['name']}")
        print(f"ID   : {group['id']}")
        print("-" * 80)

    print(f"\nTotal Groups/Channels Found: {len(groups)}")

    await client.disconnect()


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())