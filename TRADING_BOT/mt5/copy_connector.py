import MetaTrader5 as mt5
from core.logger import logger


class MT5CopyConnector:
    """
    Handles connection to the MetaTrader 5 Copy Engine terminal.
    This terminal is used for copying trades to user accounts.
    """

    def __init__(self):
        self.connected = False
        self.initialized = False

    def initialize(self) -> bool:
        """
        Initialize MT5 terminal once (before processing any users).
        """
        if self.initialized:
            return True

        copy_path = r"C:\Program Files\MT5_CopyEngine\terminal64.exe"
        if not mt5.initialize(path=copy_path):
            logger.error(
                f"MT5 Copy Engine initialization failed: {mt5.last_error()}"
            )
            return False

        self.initialized = True
        logger.success("MT5 Copy Engine terminal initialized")
        return True

    def connect(self, login: int, password: str, server: str) -> bool:
        """
        Log into a user account (terminal must already be initialized).
        """
        if not self.initialized:
            logger.error("MT5 Copy Engine not initialized. Call initialize() first.")
            return False

        authorized = mt5.login(
            login=login,
            password=password,
            server=server,
        )

        if not authorized:
            logger.error(
                f"MT5 Copy Engine login failed for {login}: {mt5.last_error()}"
            )
            return False

        account = mt5.account_info()

        if account is None:
            logger.error("Failed to retrieve account information.")
            return False

        self.connected = True

        logger.success(
            f"Copy Engine connected to MT5 | "
            f"Login: {account.login} | "
            f"Server: {account.server}"
        )

        return True

    def disconnect(self):
        """
        Logout from current user account (keeps terminal running).
        """
        if self.connected:
            # Just logout, don't shutdown the terminal
            mt5.login(login=0, password="", server="")
            self.connected = False
            logger.info("MT5 Copy Engine logged out from user account")

    def shutdown(self):
        """
        Shutdown the MT5 terminal (call once after all users processed).
        """
        if self.initialized:
            mt5.shutdown()
            self.initialized = False
            self.connected = False
            logger.info("MT5 Copy Engine terminal shutdown")

    def is_connected(self) -> bool:
        """
        Returns True if connected.
        """
        if not self.connected:
            return False
        return mt5.account_info() is not None

    def account_info(self):
        """
        Returns MT5 account information.
        """
        if not self.connected:
            return None
        return mt5.account_info()

    def terminal_info(self):
        """
        Returns MT5 terminal information.
        """
        if not self.connected:
            return None
        return mt5.terminal_info()

    def symbol_info(self, symbol: str):
        """
        Returns symbol information.
        """
        if not self.connected:
            return None
        return mt5.symbol_info(symbol)
