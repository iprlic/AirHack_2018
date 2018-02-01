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
import requests

log = logging.getLogger(__name__)
api = Namespace('airhack', description="Airhack endpoints")


@api.route('/sms')
class SMS(Resource):
    """
    Send sms
    """
    @api.parameters(parameters.SendSmsParameters())
    def post(self, kwargs):
        pars = {
            "to": kwargs['message_to'],
            "text": kwargs['message_text']
        }
        if 'message_from' in kwargs:
            pars['message_from'] = kwargs['message_from']
        result = requests.post('http://api.infobip.com/sms/1/text/single',
                        json = pars,
                        headers={
                            'Authorization': 'Basic SGFja2F0b240OjNmRXZQRUJh'
                        }

                      )

        return {'Status': 'OK'}


@api.route('/trip')
class Trip(Resource):
    """
    Send sms
    """
    @api.parameters(parameters.RegisterTripParameters())
    def post(self, kwargs):

        with api.commit_or_abort(db.session, "Failed to create a trip."):
            trip = models.Trip(**kwargs)
            airports = []
            for airport in kwargs['departure_airports']:
                aptModel = models.TripAirports(icao_code = airport, trip = trip, role = models.AirportRole.departure)

                db.session.add(aptModel)

                #airports.append(aptModel)
            '''
            user = models.User(**kwargs)
            user_activation = models.UserToken(
                type=models.UserTokenType.activation,
                user=user,
                expires_at=datetime.utcnow() + timedelta(hours=24))
            user_activation.generate_token()
            
            db.session.add(user)
            '''
            db.session.add(airports)
            db.session.add(trip)

        return trip


        return {'Status': 'OK'}

