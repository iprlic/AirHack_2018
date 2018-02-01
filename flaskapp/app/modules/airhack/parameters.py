"""
Input arguments (Parameters) for Accounts resources RESTful API
-----------------------------------------------------------
"""
from . import schemas, models
from ...extensions.api import Parameters, PatchJSONParameters
from ...extensions.api import ModelSchema
from flask_marshmallow import base_fields
from marshmallow import fields


class SendSmsParameters(Parameters):
    message_to = base_fields.String(description="SMS recepient", required=True)
    message_text = base_fields.String(description="SMS text", required=True)
    message_from = base_fields.String(description="SMS sender", required=False)

class RegisterTripParameters(Parameters):
    departure_airports = base_fields.List(description="Departure airports", required=True, cls_or_instance=fields.Raw({"type": "string"}, io="r"))
    destination_airports = base_fields.List(description="Destination airports", required=True, cls_or_instance=fields.Raw({"type": "string"}, io="r"))
    departure_date = base_fields.Date(description = "Departure date", required=True)
    return_date = base_fields.Date(description = "Return date", required=False)
    flex_days = base_fields.Integer(description = "Flex days", required=False, default=0)
    mobile_number = base_fields.Integer(description = "Mobile contact", required=True)
    include_transport = base_fields.Boolean(description = "Include transport", required=False, default = False)
    include_accommodation = base_fields.Boolean(description = "Include accommodation", required=False, default = False)

    #search_profile = base_fields.Dict(description = "Search profile", required=True)
    #user_contact = base_fields.Dict(description = "User contact info (SMS, mail...)", required=True)



