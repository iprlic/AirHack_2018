"""
Input arguments (Parameters) for Accounts resources RESTful API
-----------------------------------------------------------
"""
from . import schemas, models
from ...extensions.api import Parameters, PatchJSONParameters
from ...extensions.api import ModelSchema
from flask_marshmallow import base_fields


class SendSmsParameters(Parameters):
    message_to = base_fields.String(description="SMS recepient", required=True)
    mesage_text = base_fields.String(description="SMS text", required=True)
    message_from = base_fields.String(description="SMS sender", required=True)
