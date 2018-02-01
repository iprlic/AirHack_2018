"""
Airhack database models
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
import os

