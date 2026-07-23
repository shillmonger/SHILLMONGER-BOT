"""
Run the FastAPI server for the bot
This provides API endpoints for the frontend to communicate with
"""
import uvicorn
from api_server import app
from core.logger import setup_logger

# Setup logger for API service
setup_logger("logs/api.log")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
