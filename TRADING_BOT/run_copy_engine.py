"""
Run the Copy Engine for copying trades from master to user accounts
This script runs continuously and watches for new master trades to copy
"""
from core.database import db
from copy_engine.engine import CopyEngine
from core.logger import logger, setup_logger

# Setup logger for copy engine service
setup_logger("logs/copy_engine.log")


def main():
    """Main entry point for the copy engine"""
    
    # Connect to database
    if not db.connect():
        logger.error("Failed to connect to database")
        return

    # Initialize copy engine
    copy_engine = CopyEngine()

    try:
        # Start the copy engine loop
        copy_engine.start()
    except KeyboardInterrupt:
        logger.info("Copy Engine stopped by user")
        copy_engine.stop()
    except Exception as e:
        logger.error(f"Copy Engine crashed: {e}")
        copy_engine.stop()
    finally:
        # Cleanup
        db.close()


if __name__ == "__main__":
    main()
