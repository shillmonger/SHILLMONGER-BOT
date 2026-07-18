from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional


@dataclass
class TradingSignal:
    """
    Represents a parsed trading signal from Telegram.
    """

    chat_id: int
    group_name: str
    raw_message: str

    symbol: str
    direction: str  # BUY or SELL

    entry: float  # Average entry or single entry price
    entry_high: Optional[float] = None  # High entry for ranges
    entry_low: Optional[float] = None  # Low entry for ranges
    stop_loss: float = 0.0

    take_profits: List[float] = field(default_factory=list)

    order_type: str = "PENDING"  # MARKET or PENDING

    confidence: int = 100  # Confidence score (0-100)

    timestamp: datetime = field(default_factory=datetime.utcnow)


@dataclass
class TradeResult:
    """
    Represents the result of an executed MT5 trade.
    """

    success: bool

    ticket: Optional[int] = None

    symbol: Optional[str] = None

    direction: Optional[str] = None

    entry_price: Optional[float] = None

    lot_size: Optional[float] = None

    message: str = ""

    error_code: Optional[int] = None

    execution_time: datetime = field(default_factory=datetime.utcnow)