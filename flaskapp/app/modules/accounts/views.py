"""
OAuth2 provider setup.
It is based on the code from the example:
https://github.com/lepture/example-oauth2-server
More details are available here:
* http://flask-oauthlib.readthedocs.org/en/latest/oauth2.html
* http://lepture.com/en/2013/create-oauth-server
"""
from flask import Blueprint, request, render_template
from flask_login import current_user
from .models import OAuthClient
from ...extensions import auth
from ...extensions import api
from http import HTTPStatus

auth_blueprint = Blueprint('auth', __name__, url_prefix='/auth', template_folder='templates')


@auth_blueprint.route('/oauth2/token', methods=['GET', 'POST'])
@auth.token_handler
def access_token():
    """
    This endpoint is for exchanging/refreshing an access token.
    Returns:
        response (dict): a dictionary or None as the extra credentials for
        creating the token response.
    """
    return None


@auth_blueprint.route('/oauth2/revoke', methods=['POST'])
@auth.revoke_handler
def revoke_token():
    """
    This endpoint allows a user to revoke their access token.
    """
    pass


@auth_blueprint.route('/oauth2/authorize', methods=['GET', 'POST'])
@auth.authorize_handler
def authorize(*args, **kwargs):
    """
    This endpoint asks user if he grants access to his data to the requesting
    application.
    """
    if not current_user.is_authenticated:
        return api.abort(code=HTTPStatus.UNAUTHORIZED)

    if request.method == 'GET':
        client_id = kwargs.get('client_id')
        oauth2_client = OAuthClient.query.get_or_404(client_id=client_id)
        kwargs['client'] = oauth2_client
        kwargs['user'] = current_user
        # TODO: improve template design
        return render_template('authorize.html', **kwargs)

    confirm = request.form.get('confirm', 'no')
    return confirm == 'yes'


@auth_blueprint.route('/errors', methods=['GET'])
def errors(*args, **kwargs):
    return render_template('error.html', **kwargs)
