"""
Extended Api implementation with an application-specific helpers
----------------------------------------------------------------
"""
from six import iteritems
from flask import jsonify
from flask_restplus import Api as BaseApi
from .namespace import Namespace
from .swagger import Swagger
from werkzeug.utils import cached_property
from http import HTTPStatus
from flask import current_app


class Api(BaseApi):
    """
    Having app-specific handlers here.
    """

    @cached_property
    def __schema__(self):
        # The only purpose of this method is to pass custom Swagger class
        return Swagger(self).as_dict()

    def init_app(self, app):
        super(Api, self).init_app(app)
        app.errorhandler(HTTPStatus.UNPROCESSABLE_ENTITY.value)(handle_validation_error)

    def namespace(self, *args, **kwargs):
        # The only purpose of this method is to pass custom Namespace class
        _namespace = Namespace(*args, **kwargs)
        self.namespaces.append(_namespace)
        return _namespace

    def add_oauth_scope(self, scope_name, scope_description):
        for authorization_settings in self.authorizations.values():
            if authorization_settings['type'].startswith('oauth'):
                assert scope_name not in authorization_settings['scopes'], \
                    "OAuth scope %s already exists" % scope_name
                authorization_settings['scopes'][scope_name] = scope_description

    def add_namespace(self, ns, path=None):
        # Rewrite security rules for OAuth scopes since Namespaces don't have
        # enough information about authorization methods.
        for resource, _, _ in ns.resources:
            for method in resource.methods:
                method_func = getattr(resource, method.lower())

                if (hasattr(method_func, '__apidoc__') and 'security' in method_func.__apidoc__ and
                        '__oauth__' in method_func.__apidoc__['security']):
                    oauth_scopes = method_func.__apidoc__['security']['__oauth__']['scopes']

                    method_func.__apidoc__['security'] = {
                        auth_name: oauth_scopes
                        for auth_name, auth_settings in iteritems(self.authorizations)
                        if auth_settings['type'].startswith('oauth')
                    }

        super(Api, self).add_namespace(ns, path=path)

    def handle_error(self, e):
        if not current_app.debug or (e.code is not None and e.code != 500):
            return super(Api, self).handle_error(e)
        return e


# Return validation errors as JSON
# TODO: needs to be format agnostic, use marshmallow?
def handle_validation_error(err):
    exc = err.data['exc']
    return jsonify({
        'status': HTTPStatus.UNPROCESSABLE_ENTITY.value,
        'message': exc.messages
    }), HTTPStatus.UNPROCESSABLE_ENTITY.value
