from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy_utils import types as column_types, generic_repr
from datetime import datetime
from sqlalchemy.sql import expression

from .types.guid import GUID
from .functions.datetime import UtcNow
from .functions import uuid
from app.extensions import db
from .softdelete import QueryWithSoftDelete


@generic_repr
class Timestamp(object):
    created = db.Column(
        db.DateTime(timezone=False),
        default=datetime.utcnow,
        nullable=False,
        server_default=UtcNow())
    updated = db.Column(
        db.DateTime(timezone=False),
        default=datetime.utcnow,
        nullable=False,
        server_default=UtcNow(),
        onupdate=datetime.utcnow)


@generic_repr
class SoftDeleteAttributes(object):
    """
       Use for creating soft deletable models
       """

    @declared_attr
    def active(self):
        return db.Column(
            db.Boolean, default=True, nullable=False, server_default=expression.true(), index=True)

    query_class = QueryWithSoftDelete


@generic_repr
class StandardAttributes(Timestamp, object):
    """
    Use for creating most models
    """

    @declared_attr
    def id(self):
        return db.Column(
            GUID,
            primary_key=True,
            default=GUID.default_value,
            nullable=False,
            server_default=uuid.UUUI4())


@generic_repr
class PersonAttributes(StandardAttributes, object):
    """
        Use for creating models containing lists of people (accounts, customers, staff etc..)
    """

    @declared_attr
    def first_name(self):
        return db.Column(db.String(length=256), nullable=False)

    @declared_attr
    def last_name(self):
        return db.Column(db.String(length=256), nullable=False)

    @declared_attr
    def email(self):
        return db.Column(column_types.EmailType(length=256), nullable=True)

    @declared_attr
    def phone(self):
        return db.Column(db.String(length=256), nullable=True)
