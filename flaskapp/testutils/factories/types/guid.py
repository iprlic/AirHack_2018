from factory import LazyFunction

from app.database.types.guid import GUID


class GUIDFactory(LazyFunction):

    def __init__(self, *args, **kwargs):
        LazyFunction.__init__(self, GUID.default_value, *args, **kwargs)
