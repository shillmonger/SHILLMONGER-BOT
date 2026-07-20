import MetaTrader5 as mt5

from config import (
    MT5_LOGIN,
    MT5_PASSWORD,
    MT5_SERVER,
)

from core.logger import logger


class MT5Connector:
    """
    Handles connection to the MetaTrader 5 terminal.
    """

    def __init__(self):
        self.connected = False

    def connect(self) -> bool:
        """
        Initialize MT5 and log into the trading account using dedicated master terminal.
        """

        # Initialize MT5 with dedicated validator terminal path
        validator_path = r"C:\Program Files\MT5_Validator\terminal64.exe"
        if not mt5.initialize(path=validator_path):
            logger.error(
                f"MT5 initialization failed: {mt5.last_error()}"
            )
            return False

        authorized = mt5.login(
            login=int(MT5_LOGIN),
            password=MT5_PASSWORD,
            server=MT5_SERVER,
        )

        if not authorized:
            logger.error(
                f"MT5 login failed: {mt5.last_error()}"
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
            f"Connected to MT5 | "
            f"Login: {account.login} | "
            f"Server: {account.server} | "
            f"Balance: {account.balance}"
        )

        return True

    def disconnect(self):
        """
        Close the MT5 connection.
        """

        if self.connected:
            mt5.shutdown()
            self.connected = False
            logger.info("MT5 connection closed.")

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
