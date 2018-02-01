from itsdangerous import URLSafeSerializer, URLSafeTimedSerializer
from flask import current_app as app


def url_token_serializer():
    return URLSafeSerializer(app.config['SECRET_KEY'])


def url_timed_token_serializer():
    return URLSafeTimedSerializer(app.config['SECRET_KEY'])
