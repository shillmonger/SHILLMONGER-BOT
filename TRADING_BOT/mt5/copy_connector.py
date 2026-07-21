import MetaTrader5 as mt5
from core.logger import logger


class MT5CopyConnector:
    """
    Handles connection to the MetaTrader 5 Copy Engine terminal.
    This terminal is used for copying trades to user accounts.
    """

    def __init__(self):
        self.connected = False

    def connect(self, login: int, password: str, server: str) -> bool:
        """
        Initialize MT5 and log into a user account using copy engine terminal.
        """
        # Initialize MT5 with dedicated copy engine terminal path
        copy_path = r"C:\Program Files\MT5_CopyEngine\terminal64.exe"
        if not mt5.initialize(path=copy_path):
            logger.error(
                f"MT5 Copy Engine initialization failed: {mt5.last_error()}"
            )
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
            mt5.shutdown()
            return False

        account = mt5.account_info()

        if account is None:
            logger.error("Failed to retrieve account information.")
            mt5.shutdown()
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
        Close the MT5 connection.
        """
        if self.connected:
            mt5.shutdown()
            self.connected = False
            logger.info("MT5 Copy Engine connection closed.")

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
