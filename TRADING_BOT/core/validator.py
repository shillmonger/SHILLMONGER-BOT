from datetime import datetime, timedelta
from typing import Set

from core.models import TradingSignal


class SignalValidator:
    """
    Validates parsed trading signals before execution.
    """

    def __init__(self):
        self.processed_signals: Set[str] = set()

    def validate(self, signal: TradingSignal) -> tuple[bool, str]:
        """
        Returns:
            (True, "Valid") if the signal can be traded.
            (False, reason) otherwise.
        """

        # Symbol validation
        if signal.symbol != "XAUUSDm":
            return False, "Unsupported symbol."

        # Direction validation
        if signal.direction not in ("BUY", "SELL"):
            return False, "Invalid trade direction."

        # Required fields
        if signal.entry <= 0:
            return False, "Invalid entry price."

        if signal.stop_loss <= 0:
            return False, "Invalid stop loss."

        if not signal.take_profits:
            return False, "No take profit levels found."

        # Duplicate check
        fingerprint = self._fingerprint(signal)

        if fingerprint in self.processed_signals:
            return False, "Duplicate signal."

        # Expiry check (5 minutes)
        if datetime.utcnow() - signal.timestamp > timedelta(minutes=5):
            return False, "Signal expired."

        # Logical price validation
        if signal.direction == "BUY":

            if signal.stop_loss >= signal.entry:
                return False, "BUY stop loss must be below entry."

            if any(tp <= signal.entry for tp in signal.take_profits):
                return False, "BUY take profits must be above entry."

        if signal.direction == "SELL":

            if signal.stop_loss <= signal.entry:
                return False, "SELL stop loss must be above entry."

            if any(tp >= signal.entry for tp in signal.take_profits):
                return False, "SELL take profits must be below entry."

        self.processed_signals.add(fingerprint)

        return True, "Valid"

    def _fingerprint(self, signal: TradingSignal) -> str:
        """
        Generates a unique identifier for duplicate detection.
        """
        return (
            f"{signal.symbol}-"
            f"{signal.direction}-"
            f"{signal.entry}-"
            f"{signal.stop_loss}-"
            f"{signal.take_profits}"
        )