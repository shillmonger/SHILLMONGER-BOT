from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from telethon import TelegramClient
from telethon.tl.types import Channel, Chat
from config import API_ID, API_HASH, PHONE_NUMBER
from core.database import db
from core.logger import logger
from pathlib import Path
import asyncio

app = FastAPI(title="Shillmonger Bot API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Connect to database on startup"""
    db.connect()
    logger.success("FastAPI server started")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    db.close()
    logger.info("FastAPI server stopped")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "shillmonger-bot"}

@app.get("/api/telegram/groups")
async def get_telegram_groups():
    """
    Fetch all Telegram groups/channels from the bot's account
    """
    try:
        # Get the directory where this script is located
        script_dir = Path(__file__).parent
        session_path = script_dir / "sessions" / "tradingbot_api"

        client = TelegramClient(
            str(session_path),
            API_ID,
            API_HASH
        )
        
        await client.start(phone=PHONE_NUMBER)
        
        dialogs = await client.get_dialogs()
        
        groups = []
        
        for dialog in dialogs:
            if isinstance(dialog.entity, (Channel, Chat)):
                # Try to get profile photo
                profile_photo = None
                try:
                    photo = await client.get_profile_photos(dialog.entity)
                    if photo:
                        # Download the photo and convert to base64 or URL
                        # For now, we'll skip photo download to keep it simple
                        profile_photo = ""
                except:
                    profile_photo = ""
                
                groups.append({
                    "id": str(dialog.id),
                    "name": dialog.name,
                    "profile_image": profile_photo
                })
        
        groups.sort(key=lambda x: x["name"].lower())
        
        await client.disconnect()
        
        logger.success(f"Fetched {len(groups)} Telegram groups")
        return {"groups": groups}
        
    except Exception as e:
        logger.error(f"Failed to fetch Telegram groups: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/providers")
async def get_providers():
    """
    Get all saved providers from database
    """
    try:
        providers = db.get_all_providers()
        return {"providers": providers}
    except Exception as e:
        logger.error(f"Failed to get providers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/providers/refresh")
async def refresh_providers():
    """
    Refresh the bot's provider list from database
    This is called when providers are updated in the frontend
    """
    try:
        # In a real implementation, this would signal the listener to reload
        # For now, we'll just return success
        logger.info("Providers refresh requested")
        return {"status": "success", "message": "Providers refresh requested"}
    except Exception as e:
        logger.error(f"Failed to refresh providers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
