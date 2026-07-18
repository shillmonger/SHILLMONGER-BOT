"""
Run the FastAPI server for the bot
This provides API endpoints for the frontend to communicate with
"""
import uvicorn
from api_server import app

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
