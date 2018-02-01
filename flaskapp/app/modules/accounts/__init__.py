"""
Service module
============
"""

from ...extensions.api import rest_api
from ...extensions import login_manager, auth
from .provider import OAuth2RequestValidator
from .views import auth_blueprint


def load_user_from_request(request):
    """
    Load user from OAuth2 Authentication header.
    """
    user = None
    if hasattr(request, 'oauth'):
        user = request.oauth.user
    else:
        is_valid, oauth = auth.verify_request(scopes=[])
        if is_valid:
            user = oauth.user
    return user


def init_app(app, **kwargs):
    """
    Init accounts module.
    """
    auth.set_validator(OAuth2RequestValidator())

    login_manager.request_loader(load_user_from_request)

    app.register_blueprint(auth_blueprint)

    rest_api.add_oauth_scope('accounts:read', "Provide access to accounts details")
    rest_api.add_oauth_scope('accounts:write', "Provide write access to accounts details")

    # Touch underlying modules
    from . import models, resources    # noqa

    rest_api.add_namespace(resources.api)
