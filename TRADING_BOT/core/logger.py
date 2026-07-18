from loguru import logger
import sys

logger.remove()

logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | {message}"
)

logger.add(
    "logs/trading_bot.log",
    rotation="10 MB",
    retention="30 days"
)