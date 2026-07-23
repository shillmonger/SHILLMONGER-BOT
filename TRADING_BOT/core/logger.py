from loguru import logger
import sys

logger.remove()

logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | {message}"
)

def setup_logger(log_file="logs/trading_bot.log"):
    """Setup logger with custom log file name"""
    logger.add(
        log_file,
        rotation="10 MB",
        retention="30 days"
    )