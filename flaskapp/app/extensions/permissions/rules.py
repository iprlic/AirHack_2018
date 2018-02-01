from flask_login import current_user
from http import HTTPStatus
from permission import Rule as BaseRule
from ..api.http_exceptions import abort


class DenyAbortMixin(object):
    """
    A helper permissions mixin raising an HTTP Error (specified in
    ``DENY_ABORT_CODE``) on deny.
    NOTE: Apply this mixin before Rule class so it can override NotImplemented
    deny method.
    """

    DENY_ABORT_HTTP_CODE = HTTPStatus.FORBIDDEN
    DENY_ABORT_MESSAGE = None

    def deny(self):
        """
        Abort HTTP request by raising HTTP error exception with a specified
        HTTP code.
        """
        return abort(code=self.DENY_ABORT_HTTP_CODE, message=self.DENY_ABORT_MESSAGE)


class Rule(BaseRule):
    """
    Base Rule class that helps to automatically handle inherited
    rules.
    """

    def base(self):
        for base_class in self.__class__.__bases__:
            if issubclass(base_class, Rule):
                if base_class in {Rule, BaseRule}:
                    continue
                return base_class()


class AllowAllRule(Rule):
    """
    Helper rule that always grants access.
    """

    def check(self):
        return True


class WriteAccessRule(DenyAbortMixin, Rule):
    """
    Ensure that the current_user has has write access.
    """

    def check(self):
        return current_user.is_regular_user


class ActiveUserRule(DenyAbortMixin, Rule):
    """
    Ensure that the current_user is activated.
    """

    def check(self, **kwargs):
        # Do not override DENY_ABORT_HTTP_CODE because inherited classes will
        # better use HTTP 403/Forbidden code on denial.
        self.DENY_ABORT_HTTP_CODE = HTTPStatus.UNAUTHORIZED

        return current_user.is_authenticated


class PasswordRequiredRule(DenyAbortMixin, Rule):
    """
    Ensure that the current user has provided a correct password.
    """

    def __init__(self, password, **kwargs):
        super(PasswordRequiredRule, self).__init__(**kwargs)
        self._password = password

    def check(self):
        return current_user.password == self._password


class RoleRule(ActiveUserRule):
    """
    Ensure that the current_user has a specific role.
    """

    def __init__(self, roles, **kwargs):
        super(RoleRule, self).__init__(**kwargs)
        self._roles = roles

    def check(self, **kwargs):
        if self._roles is None:
            return False

        return (self._roles & current_user.roles != 0) and (self._roles <= current_user.roles)


class OwnerRoleRule(ActiveUserRule):
    """
    Ensure that the current_user has an Owner access to the given object.
    """

    def __init__(self, obj, **kwargs):
        super(OwnerRoleRule, self).__init__(**kwargs)
        self._obj = obj

    def check(self, **kwargs):
        if not hasattr(self._obj, 'check_owner'):
            return False
        return self._obj.check_owner(current_user) is True


class OwnerOrRoleRule(ActiveUserRule):
    """
        Ensure that the current_user has an Owner access to the given object or a specific role
    """

    def __init__(self, obj, roles, **kwargs):
        super(OwnerOrRoleRule, self).__init__(**kwargs)
        self._obj = obj
        self._roles = roles

    def check(self, **kwargs):
        if self._roles is not None and \
                (self._roles & current_user.roles != 0 and self._roles <= current_user.roles):
            return True

        if self._obj is not None and hasattr(self._obj, 'check_owner') and \
                self._obj.check_owner(current_user) is True:
            return True

        return False


class PartialPermissionDeniedRule(Rule):
    """
    Helper rule that must fail on every check since it should never be checked.
    """

    def __init__(self):
        pass

    def check(self):
        raise RuntimeError("Partial permissions are not intended to be checked")
