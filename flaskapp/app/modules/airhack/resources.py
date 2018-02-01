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


        return {'Status': 'OK'}

