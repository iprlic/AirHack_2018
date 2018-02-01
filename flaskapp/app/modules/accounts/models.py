"""
User database models
--------------------
"""
from enum import Enum
from sqlalchemy_utils import types as column_types
from sqlalchemy.sql import expression, and_
from flask import current_app as app, request
from datetime import datetime

from app.extensions import db, mail
from flask_mail import Message
from app.utils.security.tokens import url_timed_token_serializer
from app.database.mixins import PersonAttributes, StandardAttributes, Timestamp
from app.database.types.guid import GUID
from app.extensions.permissions import UserType
from jinja2 import Environment, FileSystemLoader
import os


class UserTokenType(Enum):
    activation = 1
    forgot_password = 2


class User(PersonAttributes, db.Model):
    # used as a username and thus required
    email = db.Column(column_types.EmailType(length=256), nullable=False, unique=True, index=True)
    password = db.Column(
        column_types.password.PasswordType(max_length=128, schemes=('bcrypt',)), nullable=False)

    roles = db.Column(
        db.Integer, nullable=False, default=UserType.REGULAR_USER.value, server_default='1')
    active = db.Column(
        db.Boolean, nullable=False, default=False, server_default=expression.false())

    @property
    def roles_list(self):
        return UserType.get_as_dic_list(self.roles)

    def has_role(self, role):
        return (self.roles & role.value) != 0

    def set_role(self, role):
        if self.has_role(role):
            return
        self.roles |= role.value

    def unset_role(self, role):
        if not self.has_role(role):
            return
        self.roles ^= role.value

    def is_regular_user(self, role):
        return True

    def check_owner(self, user):
        return self == user

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @classmethod
    def find_with_password(cls, email, password):
        """
        Args:
            email (str)
            password (str) - plain-text password
        Returns:
            user (User) - if there is a user with a specified username and
            password, None otherwise.
        """
        email = email.replace(' ', '+')    # fix for + serialization issue
        user = cls.query.filter_by(email=email).first()
        # fetching only by username and then checking password
        # helps prevent that brute force attacks don't "choke" the server
        # only activate users
        if not user:
            return None
        if not user.active:
            return None
        if user.password == password:
            return user
        return None


class UserToken(StandardAttributes, db.Model):
    user_id = db.Column(GUID, db.ForeignKey('user.id'), index=True, nullable=False)
    code = db.Column(db.String(255), nullable=False, unique=True)
    type = db.Column(db.Enum(UserTokenType), nullable=False)
    expires_at = db.Column(db.DateTime(False), nullable=False)
    user = db.relationship('User', backref='user_tokens', cascade='delete')
    used = db.Column(db.Boolean, nullable=False, default=False, server_default=expression.false())

    def check_owner(self, user):
        return self.user_id == user.id

    @classmethod
    def get_by_code(cls, code):
        return cls.query.filter(UserToken.code == code,
                                UserToken.used.is_(False),
                                UserToken.expires_at >= datetime.utcnow()).first()

    def generate_token(self):
        self.code = url_timed_token_serializer().dumps(self.type.name + self.user.email,
                                                       app.config['SECRET_KEY'])

    def send_message(self, subject, to):
        template = 'activate_account.html'
        token_link = app.config['USER_ACTIVATION_URL'] + self.code
        if (self.type == UserTokenType.forgot_password):
            template = 'forgot_password.html'
            token_link = app.config['FORGOT_PASS_URL'] + self.code

        template_args = {'token_link': token_link}

        templatedir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'templates')
        env = Environment(loader=FileSystemLoader(templatedir))

        msg = Message(
            subject=subject,
            recipients=[
                to,
            ],
            html=env.get_template(template).render(template_args))
        mail.send(msg)


class OAuthClient(Timestamp, db.Model):
    """
    OAuth2 client model
    """
    __tablename__ = 'oauth_client'

    # human readable name, required
    name = db.Column(db.String(40), nullable=False, unique=True)
    # human readable description, not required
    description = db.Column(db.String(400))

    client_id = db.Column(db.String(40), primary_key=True, unique=True, index=True, nullable=False)
    client_secret = db.Column(db.String(55), unique=True, index=True, nullable=False)

    # public or confidential
    is_confidential = db.Column(
        db.Boolean, default=False, server_default=expression.false(), nullable=False)

    _redirect_uris = db.Column(db.Text)
    _default_scopes = db.Column(db.Text)

    @property
    def client_type(self):
        if self.is_confidential:
            return 'confidential'
        return 'public'

    @property
    def redirect_uris(self):
        if self._redirect_uris:
            return self._redirect_uris.split()
        return []

    @property
    def default_redirect_uri(self):
        if len(self.redirect_uris) > 0:
            return self.redirect_uris[0]
        return None

    @property
    def default_scopes(self):
        if self._default_scopes:
            return self._default_scopes.split()
        return []

    @property
    def allowed_grant_types(self):
        """
            Returns allowed grant types.
        """
        return [
            'authorization_code', 'implicit', 'password', 'client_credentials', 'refresh_token'
        ]

    @classmethod
    def find(cls, client_id):
        if not client_id:
            return
        return cls.query.get(client_id)


class OAuthGrant(StandardAttributes, db.Model):
    __tablename__ = 'oauth_grant'

    user_id = db.Column(GUID, db.ForeignKey('user.id', ondelete='CASCADE'))
    user = db.relationship('User')

    client_id = db.Column(
        db.String(40),
        db.ForeignKey('oauth_client.client_id'),
        nullable=False,
    )
    client = db.relationship('OAuthClient')

    code = db.Column(db.String(255), index=True, nullable=False)

    redirect_uri = db.Column(db.String(255))
    expires = db.Column(db.DateTime)

    _scopes = db.Column(db.Text)

    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return self

    @property
    def scopes(self):
        if self._scopes:
            return self._scopes.split()
        return []

    @classmethod
    def find(cls, client_id, code):
        return cls.query.filter_by(client_id=client_id, code=code).first()


class OAuthToken(StandardAttributes, db.Model):
    __tablename__ = 'oauth_token'

    client_id = db.Column(
        db.String(40),
        db.ForeignKey('oauth_client.client_id'),
        nullable=False,
    )
    client = db.relationship('OAuthClient')

    user_id = db.Column(GUID, db.ForeignKey('user.id'))
    user = db.relationship('User', cascade='delete')

    # currently only bearer is supported
    token_type = db.Column(db.String(40))

    access_token = db.Column(db.String(8000), unique=True)
    refresh_token = db.Column(db.String(255), unique=True)
    expires = db.Column(db.DateTime)
    _scopes = db.Column(db.Text)

    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return self

    @property
    def scopes(self):
        if self._scopes:
            return self._scopes.split()
        return []

    @scopes.setter
    def scopes(self, value):
        self._scopes = value

    @classmethod
    def find(cls, access_token=None, refresh_token=None):
        if access_token:
            return cls.query.filter_by(access_token=access_token).first()
        elif refresh_token:
            return cls.query.filter_by(refresh_token=refresh_token).first()
