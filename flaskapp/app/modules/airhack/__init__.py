"""
Airhack module
============
"""

from ...extensions.api import rest_api
from ...extensions import login_manager, auth




def init_app(app, **kwargs):


    rest_api.add_oauth_scope('airhack:read', "Provide access to airhack details")
    rest_api.add_oauth_scope('airhack:write', "Provide write access to airhack details")

    # Touch underlying modules
    from . import models, resources    # noqa

    rest_api.add_namespace(resources.api)
