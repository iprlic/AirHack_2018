from . import models
import logging
from datetime import datetime, timedelta
import sqlalchemy
from flask_login import current_user
from flask_oauthlib import provider
from app.extensions import db

log = logging.getLogger(__name__)


class OAuth2RequestValidator(provider.OAuth2RequestValidator):
    """
    A project-specific implementation of OAuth2RequestValidator, which connects
    our User and OAuth2* implementations together.
    """

    def __init__(self):
        self._client_class = models.OAuthClient
        self._grant_class = models.OAuthGrant
        self._token_class = models.OAuthToken
        super(OAuth2RequestValidator, self).__init__(
            usergetter=self._usergetter,
            clientgetter=self._client_class.find,
            tokengetter=self._token_class.find,
            grantgetter=self._grant_class.find,
            tokensetter=self._tokensetter,
            grantsetter=self._grantsetter,
        )

    def _usergetter(self, email, password, client, request):
        return models.User.find_with_password(email, password)

    def _tokensetter(self, token, request, *args, **kwargs):
        expires_in = token['expires_in']
        expires = datetime.utcnow() + timedelta(seconds=expires_in)
        try:
            token_instance = self._token_class(
                access_token=token['access_token'],
                refresh_token=token.get('refresh_token'),
                token_type=token['token_type'],
                scopes=token['scope'],
                expires=expires,
                client_id=request.client.client_id,
                user_id=request.user.id,
            )
            db.session.add(token_instance)
            db.session.commit()
        except sqlalchemy.exc.IntegrityError:
            log.exception("Token-setter has failed.")
            return None
        return token_instance

    def _grantsetter(self, client_id, code, request, *args, **kwargs):
        expires = datetime.utcnow() + timedelta(seconds=100)
        try:
            with db.session.begin():
                grant_instance = self._grant_class(
                    client_id=client_id,
                    code=code['code'],
                    redirect_uri=request.redirect_uri,
                    scopes=request.scopes,
                    user=current_user,
                    expires=expires)
                db.session.add(grant_instance)
        except sqlalchemy.exc.IntegrityError:
            log.exception("Grant-setter has failed.")
            return None
        return grant_instance
