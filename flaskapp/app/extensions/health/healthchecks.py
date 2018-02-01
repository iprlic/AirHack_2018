from app.extensions import db
from psutil import cpu_percent, virtual_memory


def db_connectivity():
    check_ok = True
    output = "Database connection available"

    try:
        # to check database we will execute raw query
        db.engine.execute("SELECT 1")
    except Exception as e:
        output = repr(e)
        check_ok = False

    return check_ok, output


# TODO: THRESHOLD to config
def cpu_usage():
    cpu = cpu_percent(interval=1)
    return cpu <= 90, str.format("CPU at {}%", cpu)


# TODO: THRESHOLD to config
def memory_available():
    threshold = 100 * 1024 * 1024
    mem = virtual_memory()

    return mem.available >= threshold, str.format("{} MB memory available",
                                                  mem.available / 1024 / 1024
                                                  if mem.available > 0 else 0)
