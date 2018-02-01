from datetime import datetime, timezone
import time


def now():
    return datetime.now(timezone.utc)


def timestamp():
    return int(time.time())
