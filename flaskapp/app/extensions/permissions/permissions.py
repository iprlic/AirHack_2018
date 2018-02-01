import logging
from flask_sqlalchemy import BaseQuery
from permission import Permission as BasePermission
from . import rules, roles
from operator import ior
import functools

log = logging.getLogger(__name__)


class PermissionExtendedQuery(BaseQuery):
    """
    Extends BaseQuery class from flask_sqlalchemy to add get_or_403 method
    Example:
    >>> DataTransformation.query.get_or_403(id)
    """

    def __init__(self, permisssion, *args, **kwargs):
        super(PermissionExtendedQuery, self).__init__(*args, **kwargs)
        self.permisssion = permisssion

    def get_or_403(self, ident):
        obj = self.get_or_404(ident)
        with self.permisssion(obj=obj):
            return obj


class Permission(BasePermission):
    """
    Declares classmethod to provide extended BaseQuery to model,
    which adds additional method get_or_403
    """

    @classmethod
    def get_query_class(cls):
        """
        Returns extended BaseQuery class for flask_sqlalchemy model to provide get_or_403 method
        Example:
        >>> DataTransformation(db.Model):
        ...     query_class = OwnerRolePermission.get_query_class()
        """
        return lambda *args, **kwargs: PermissionExtendedQuery(cls, *args, **kwargs)


class PasswordRequiredPermissionMixin(object):
    """
    Helper rule mixin that ensure that user password is correct if
    `password_required` is set to True.
    """

    def __init__(self, password_required=False, password=None, **kwargs):
        # NOTE: kwargs is required since it is a mixin
        """
        Args:
            password_required (bool) - in some cases you may need to ask
                users for a password to allow certain actions, enforce this
                requirement by setting this :bool:`True`.
            password (str) - pass a user-specified password here.
        """
        self._password_required = password_required
        self._password = password
        super(PasswordRequiredPermissionMixin, self).__init__(**kwargs)

    def rule(self):
        _rule = super(PasswordRequiredPermissionMixin, self).rule()
        if self._password_required:
            _rule &= rules.PasswordRequiredRule(self._password)
        return _rule


class WriteAccessPermission(Permission):
    """
    Require a regular user role to perform an action.
    """

    def rule(self):
        return rules.WriteAccessRule()


class RolePermission(Permission):
    """
    This class aims to help distinguish all role-type permissions.
    """

    def __init__(self, partial=False, **kwargs):
        """
        Args:
            partial (bool) - True values is mostly useful for Swagger
                documentation purposes.
        """
        self._partial = partial
        super(RolePermission, self).__init__(**kwargs)

    def rule(self):
        if self._partial:
            return rules.PartialPermissionDeniedRule()
        return rules.AllowAllRule()


class UserTypePermission(PasswordRequiredPermissionMixin, RolePermission):
    """
    Specific user type role is required.
    """

    def __init__(self, *roles, **kwargs):
        """
        Args:
            *roles (UserType) - List of roles which have rights to execute this action
        """
        masks = map(lambda x: x.value, roles)
        ut = functools.reduce(ior, masks)
        self._roles = ut
        super(UserTypePermission, self).__init__(**kwargs)

    def rule(self):
        return rules.RoleRule(roles=self._roles) & super(UserTypePermission, self).rule()


class OwnerPermission(PasswordRequiredPermissionMixin, RolePermission):
    """
    Owner may execute this action.
    """

    def __init__(self, obj=None, **kwargs):
        """
        Args:
            obj (object) - any object can be passed here, which will be asked
                via ``check_owner(current_user)`` method whether a current user
                has enough permissions to perform an action on the given
                object.
        """
        self._obj = obj
        super(OwnerPermission, self).__init__(**kwargs)

    def rule(self):
        return rules.OwnerRoleRule(obj=self._obj) & super(OwnerPermission, self).rule()


class OwnerOrUserTypePermission(PasswordRequiredPermissionMixin, RolePermission):
    """
    Either owner or user of specific role may execute this action.
    """

    def __init__(self, roles=None, obj=None, **kwargs):
        """
        Args:
            roles (UserType) - List of roles which have rights to execute this action
            obj (object) - any object can be passed here, which will be asked
                via ``check_owner(current_user)`` method whether a current user
                has enough permissions to perform an action on the given
                object.
        """
        self._obj = obj
        self._roles = 0
        if roles is not None:
            masks = map(lambda x: x.value, roles)
            ut = functools.reduce(ior, masks)
            self._roles = ut
        super(OwnerOrUserTypePermission, self).__init__(**kwargs)

    def rule(self):
        return rules.OwnerOrRoleRule(
            roles=self._roles, obj=self._obj) & super(OwnerOrUserTypePermission, self).rule()


class ActiveUserRolePermission(RolePermission):
    """
    At least Active user is required.
    """

    def rule(self):
        return rules.RoleRule(roles=roles.UserType.REGULAR_USER.value)
