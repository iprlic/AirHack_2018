"""
RESTful API User resources
--------------------------
"""

import logging
from http import HTTPStatus
from werkzeug.security import gen_salt
from datetime import datetime, timedelta
from . import schemas, parameters
from . import models
from flask import redirect, current_app
from ...extensions import db
from ...extensions.api import Namespace, Resource, abort
from ...extensions.api.parameters import PaginationParameters
from ...extensions.permissions import UserTypePermission, OwnerOrUserTypePermission, UserType

log = logging.getLogger(__name__)
api = Namespace('accounts', description="Accounts")


@api.route('/users')
class Users(Resource):
    """
    Manipulations with users.
    """

    @api.login_required(oauth_scopes=['accounts:read'])
    @api.parameters(PaginationParameters())
    @api.response(schemas.AdminUserSchema(many=True))
    @api.permission_required(UserTypePermission(UserType.USER_MANAGER))
    def get(self, args):
        """
        List of users.
        Returns a list of users starting from ``offset`` limited by ``limit``
        parameter.
        """
        return models.User.query.offset(args['offset']).limit(args['limit'])

    @api.parameters(parameters.CreateUserParameters())
    @api.response(schemas.BaseUserSchema())
    @api.response(code=HTTPStatus.FORBIDDEN)
    @api.response(code=HTTPStatus.CONFLICT)
    @api.doc(id='create_user')
    def post(self, kwargs):
        """
        Create a new user.
        """
        with api.commit_or_abort(db.session, "Failed to create a user."):
            user = models.User(**kwargs)
            user_activation = models.UserToken(
                type=models.UserTokenType.activation,
                user=user,
                expires_at=datetime.utcnow() + timedelta(hours=24))
            user_activation.generate_token()
            db.session.add(user)
            db.session.add(user_activation)
            user_activation.send_message('Activate your account', user.email)
        return user


@api.route('/users/details')
@api.login_required(oauth_scopes=['accounts:write'])
class UsersDetails(Resource):
    """
    Manipulations with users.
    """

    @api.permission_required(UserTypePermission(UserType.USER_MANAGER))
    @api.parameters(parameters.CreateAdminUserParameters())
    @api.response(schemas.AdminUserSchema())
    @api.response(code=HTTPStatus.FORBIDDEN)
    @api.response(code=HTTPStatus.CONFLICT)
    @api.doc(id='create_user_administrative')
    def post(self, kwargs):
        """
        Create a new user.
        """
        with api.commit_or_abort(db.session, "Failed to create a user."):
            user = models.User(**kwargs)
            db.session.add(user)
        return user


@api.login_required(oauth_scopes=['accounts:read'])
@api.route('/users/details/<uuid:user_id>')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="User not found.",
)
@api.resolve_object_by_model(models.User, 'user')
class UserDetailsByID(Resource):
    """
    Manipulations with a specific user
    """

    @api.response(schemas.AdminUserSchema())
    @api.permission_required(UserTypePermission(UserType.USER_MANAGER))
    def get(self, user):
        return user

    @api.parameters(parameters.PatchAdminUserDetailsParameters())
    @api.response(schemas.AdminUserSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    @api.permission_required(UserTypePermission(UserType.USER_MANAGER))
    @api.login_required(oauth_scopes=['accounts:write'])
    def patch(self, args, user):
        """
        Patch user details by ID.
        """
        with api.commit_or_abort(db.session, "Failed to update user details."):
            parameters.PatchAdminUserDetailsParameters.perform_patch(args, obj=user)
            db.session.merge(user)
        return user


@api.login_required(oauth_scopes=['accounts:read'])
@api.route('/users/<uuid:user_id>')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="User not found.",
)
@api.resolve_object_by_model(models.User, 'user')
class UserByID(Resource):
    """
    Manipulations with a specific user
    """

    @api.response(schemas.BaseUserSchema())
    @api.permission_required(OwnerOrUserTypePermission,
                             kwargs_on_request=lambda kwargs: {'roles': [UserType.USER_MANAGER],
                                                               'obj': kwargs['user']}
                             )
    def get(self, user):
        return user

    @api.response(code=HTTPStatus.CONFLICT)
    @api.response(code=HTTPStatus.NO_CONTENT)
    @api.permission_required(UserTypePermission(UserType.USER_MANAGER))
    @api.login_required(oauth_scopes=['accounts:write'])
    def delete(self, user):
        with api.commit_or_abort(db.session, "Failed to delete a user."):
            user.active = False
        return None

    @api.parameters(parameters.PatchUserDetailsParameters())
    @api.response(schemas.BaseUserSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    @api.permission_required(OwnerOrUserTypePermission,
                             kwargs_on_request=lambda kwargs: {'roles': [UserType.USER_MANAGER],
                                                               'obj': kwargs['user']}
                             )
    @api.login_required(oauth_scopes=['accounts:write'])
    def patch(self, args, user):
        """
        Patch user details by ID.
        """
        with api.commit_or_abort(db.session, "Failed to update user details."):
            parameters.PatchUserDetailsParameters.perform_patch(args, obj=user)
            db.session.merge(user)
        return user


@api.route('/users/forgot_password')
class ForgotPassword(Resource):

    @api.parameters(parameters.ForgotPasswordParameters())
    @api.response(code=HTTPStatus.NO_CONTENT)
    def post(self, args):
        with api.commit_or_abort(db.session, "Failed to send change password email."):
            user = models.User.query.filter(models.User.email == args['email']).first()
            if (user is not None):
                pass_reset = models.UserToken(
                    type=models.UserTokenType.forgot_password,
                    user=user,
                    expires_at=datetime.utcnow() + timedelta(hours=24))
                pass_reset.generate_token()
                db.session.add(pass_reset)
                pass_reset.send_message('Password reset link.', user.email)
        return None


@api.route('/users/reset_password')
class ResetPassword(Resource):

    @api.parameters(parameters.NewPasswordParameters())
    @api.response(code=HTTPStatus.NO_CONTENT)
    @api.response(code=HTTPStatus.NOT_FOUND)
    def post(self, args):
        with api.commit_or_abort(db.session, "Failed to change password."):
            pass_reset = models.UserToken.get_by_code(args['code'])
            if (pass_reset is not None):
                pass_reset.used = True
                pass_reset.user.password = args['password']
            else:
                abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="Reset password token not found or expired!")
        return None


@api.route('/users/activation')
class UserActivation(Resource):

    @api.parameters(parameters.ActivateUserParameters())
    @api.response(schemas.BaseUserSchema())
    @api.response(code=HTTPStatus.NOT_FOUND)
    def post(self, args):
        """
        Activate a new user.
        """
        with api.commit_or_abort(db.session, "Failed to activate a user."):
            userActivation = models.UserToken.get_by_code(args['code'])
            if (userActivation is not None):
                userActivation.used = True
                userActivation.user.active = True
            else:
                abort(code=HTTPStatus.NOT_FOUND, message="Activation token not found or expired!")

        return userActivation.user


@api.route('/clients')
@api.login_required(oauth_scopes=['accounts:read'])
class Clients(Resource):
    """
    Manipulations with clients.
    """

    @api.parameters(PaginationParameters())
    @api.response(schemas.ClientSchema(many=True))
    @api.permission_required(UserTypePermission(UserType.ADMIN))
    def get(self, args):
        """
        List of client.
        Returns a list of clients starting from ``offset`` limited by ``limit``
        parameter.
        """
        return models.OAuthClient.query.offset(args['offset']).limit(args['limit'])

    @api.login_required(oauth_scopes=['accounts:write'])
    @api.parameters(parameters.CreateClientParameters())
    @api.response(schemas.ClientSchema())
    @api.response(code=HTTPStatus.FORBIDDEN)
    @api.response(code=HTTPStatus.CONFLICT)
    @api.doc(id='create_client')
    @api.permission_required(UserTypePermission(UserType.ADMIN))
    def post(self, args):
        """
        Create a new client.
        """
        with api.commit_or_abort(db.session, "Failed to create a client."):
            client = models.OAuthClient(**args)
            client.client_id = gen_salt(40)
            client.client_secret = gen_salt(55)
            db.session.add(client)
        return client
