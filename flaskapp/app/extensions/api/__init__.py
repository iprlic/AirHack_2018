"""
API extension
=============
"""
from .api import Api    # noqa
from .model import Schema, ModelSchema, DefaultHTTPErrorSchema    # noqa
from .namespace import Namespace    # noqa
from .parameters import Parameters, PostFormParameters, PatchJSONParameters, PaginationParameters    # noqa
from .swagger import Swagger    # noqa
from .resource import Resource    # noqa
from .http_exceptions import abort    # noqa
from copy import deepcopy

# TODO: from config
rest_api = Api(
    version='1.0',
    title="Airhack API",
    ui=False,
    description=("Airhack rest api\n"
                 "more info to need to be written down"),
)


def init_app(app, **kwargs):
    rest_api.authorizations = deepcopy(app.config['AUTHORIZATIONS'])
    app.extensions = getattr(app, 'extensions', {})
    app.extensions['api'] = rest_api
