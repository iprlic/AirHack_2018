"""
User schemas
------------
"""
from app.extensions.api import ModelSchema

from .models import User, OAuthClient

BASE_FIELDS = (
    'id',
    'email',
    'first_name',
    'last_name',
)


class BaseUserSchema(ModelSchema):
    """
    Base user schema exposes only the most general fields.
    """

    class Meta:
        model = User
        fields = BASE_FIELDS
        dump_only = (User.id.key,)


class DetailedUserSchema(ModelSchema):
    """
    Detailed user schema exposes all useful fields.
    """

    class Meta:
        model = User
        fields = BASE_FIELDS + ('password',)
        dump_only = (User.id.key,)


class AdminUserSchema(ModelSchema):
    """
    Detailed user schema exposes all useful fields.
    """

    class Meta:
        model = User
        fields = BASE_FIELDS + ('active', 'roles', 'roles_list')


class DetailedAdminUserSchema(ModelSchema):
    """
    Detailed user schema exposes all useful fields.
    """

    class Meta:
        model = User
        fields = BASE_FIELDS + ('password', 'active', 'roles')
        dump_only = (User.id.key,)


class ClientSchema(ModelSchema):

    class Meta:
        model = OAuthClient
