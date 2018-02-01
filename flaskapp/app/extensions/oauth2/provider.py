from flask_oauthlib import provider
import jwt
import time
import functools
from flask import current_app
from werkzeug.security import gen_salt
from app.utils import utc


class OAuth2Provider(provider.OAuth2Provider):

    def __init__(self, *args, **kwargs):
        super(OAuth2Provider, self).__init__(*args, **kwargs)

    def init_app(self, app):
        super(OAuth2Provider, self).init_app(app)
        app.config.setdefault('OAUTH2_PROVIDER_TOKEN_GENERATOR', self.generate_token)
        app.config.setdefault('OAUTH2_PROVIDER_REFRESH_TOKEN_GENERATOR',
                              self.generate_refresh_token)

    def generate_refresh_token(self, request):
        return gen_salt(55)

    def generate_token(self, request):

        token = {
            'user': {
                'id': request.user.id,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'email': request.user.email,
                'roles': request.user.roles_list
            },
            'exp': int(time.time() + request.expires_in),
            'iat': utc.timestamp()
        }

        if request.scopes is not None:
            token['scope'] = ' '.join(request.scopes)

        jwt_token = jwt.encode(token, current_app.config['JWT_KEY'], algorithm='HS256')
        return jwt_token.decode('ascii')

    def set_validator(self, validator):
        self._validator = validator

    def set_invalid_response(self, invalid_response):
        self.invalid_response(invalid_response)

    def require_oauth(self, *args, **kwargs):
        """
        A decorator to protect a resource with specified scopes. Access Token
        can be fetched from the specified locations (``headers`` or ``form``).
        Arguments:
            locations (list): a list of locations (``headers``, ``form``) where
                the access token should be looked up.
        Returns:
            function: a decorator.
        """
        locations = kwargs.pop('locations', ('cookies',))
        origin_decorator = super(OAuth2Provider, self).require_oauth(*args, **kwargs)

        def decorator(func):
            from flask import request
            origin_decorated_func = origin_decorator(func)

            @functools.wraps(origin_decorated_func)
            def wrapper(*args, **kwargs):
                if 'headers' not in locations:
                    # Invalidate authorization if developer specifically
                    # disables the lookup in the headers.
                    request.authorization = '!'
                if 'form' in locations:
                    if 'access_token' in request.form:
                        request.authorization = 'Bearer %s' % request.form['access_token']
                return origin_decorated_func(*args, **kwargs)

            return wrapper

        return decorator


auth = OAuth2Provider()
