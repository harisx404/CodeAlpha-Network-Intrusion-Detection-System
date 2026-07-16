"""System-wide constants."""
from enum import Enum

class Severity(str, Enum):
    INFO = "INFO"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class AlertStatus(str, Enum):
    NEW = "NEW"
    INVESTIGATING = "INVESTIGATING"
    MITIGATED = "MITIGATED"
    RESOLVED = "RESOLVED"
    FALSE_POSITIVE = "FALSE_POSITIVE"

class EventType(str, Enum):
    ALERT = "alert"
    DNS = "dns"
    HTTP = "http"
    TLS = "tls"
    FLOW = "flow"
    STATS = "stats"

# Map Suricata priority to our Severity enum
PRIORITY_MAP = {
    1: Severity.CRITICAL,
    2: Severity.HIGH,
    3: Severity.MEDIUM,
    4: Severity.LOW,
}

MAX_PAGE_SIZE = 100
DEFAULT_PAGE_SIZE = 20
