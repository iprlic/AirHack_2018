"""
Input arguments (Parameters) for Accounts resources RESTful API
-----------------------------------------------------------
"""
from . import schemas, models
from ...extensions.api import Parameters, PatchJSONParameters
from ...extensions.api import ModelSchema
from flask_marshmallow import base_fields


class CreateUserParameters(Parameters, schemas.DetailedUserSchema):
    """
    Full user schema exposes all fields (only use on new user creation).
    """

    class Meta(schemas.DetailedUserSchema.Meta):
        fields = schemas.DetailedUserSchema.Meta.fields


class CreateAdminUserParameters(Parameters, schemas.DetailedAdminUserSchema):
    """
    Full user schema exposes all fields (only use on new user creation).
    """

    class Meta(schemas.DetailedAdminUserSchema.Meta):
        fields = schemas.DetailedAdminUserSchema.Meta.fields


class CreateClientParameters(Parameters, schemas.ClientSchema):
    """
    Client creation schema
    """

    class Meta(schemas.ClientSchema.Meta):
        fields = (
            models.OAuthClient.name.key,
            models.OAuthClient.description.key,
        )


class UserTokenParameters(Parameters, ModelSchema):

    class Meta:
        model = models.UserToken
        fields = (models.UserToken.code.key,)


class NewPasswordParameters(Parameters):
    code = base_fields.String(description="Change password token sent in an email", required=True)
    password = base_fields.String(description="New password", required=True)


class ForgotPasswordParameters(Parameters):
    email = base_fields.Email(description="Email to sent reset password token to", required=True)


class ActivateUserParameters(UserTokenParameters):

    class Meta(UserTokenParameters.Meta):
        fields = UserTokenParameters.Meta.fields


class PatchUserDetailsParameters(PatchJSONParameters):
    OPERATION_CHOICES = (PatchJSONParameters.OP_REPLACE,)

    PATH_CHOICES = tuple('/%s' % field
                         for field in (
                             models.User.first_name.key,
                             models.User.last_name.key,
                             models.User.email.key,
                         ))


class PatchAdminUserDetailsParameters(PatchJSONParameters):
    OPERATION_CHOICES = (PatchJSONParameters.OP_REPLACE,)

    PATH_CHOICES = tuple('/%s' % field
                         for field in (
                             models.User.first_name.key,
                             models.User.last_name.key,
                             models.User.email.key,
                             models.User.roles.key,
                             models.User.active.key,
                         ))
