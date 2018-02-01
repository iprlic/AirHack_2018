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


class AirportRole(Enum):
    departure = 1
    arrival = 2

class Trip(StandardAttributes, db.Model):
    departure_date = db.Column(db.DateTime(False), nullable=False)
    return_date = db.Column(db.DateTime(False), nullable=False)
    flex_days = db.Column(db.Integer, nullable=False, default = 0)

    used = db.Column(db.Boolean, nullable=False, default=False, server_default=expression.false())


class TripAirports(StandardAttributes, db.Model):
    trip_id = db.Column(GUID, db.ForeignKey('trip.id'), index=True, nullable=False)
    trip = db.relationship('Trip', backref='trip_airports', cascade='delete')
    role = db.Column(db.Enum(AirportRole), nullable=False)
    iata_code = db.Column(db.String(3), nullable=False)

class SearchProfile(StandardAttributes, db.Model):
    trip = db.relationship('Trip', backref='search_profile', cascade='delete')
    accomodation = db.Column(db.Boolean, nullable=False, default=False)
    transport = db.Column(db.Boolean, nullable=False, default=False)


class Traveller(StandardAttributes, db.Model):
    mobile_number = db.Column(db.String(255), nullable=False)
    default_accomodation = db.Column(db.Boolean, nullable=False, default=False)
    default_transport = db.Column(db.Boolean, nullable=False, default=False)

class TravellerTrips(StandardAttributes, db.Model):
    trip = db.relationship('Trip', backref='traveller_trips', cascade='delete')
    trip = db.relationship('Traveller', backref='traveller_trips', cascade='delete')

