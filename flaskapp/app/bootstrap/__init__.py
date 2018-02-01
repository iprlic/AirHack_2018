from flask import Flask

from app import extensions, modules
from app.bootstrap.config import DevConfig
from .json_encoder import JSONEncoder_newdefault
from json import JSONEncoder


def create_app(config=DevConfig, **kwargs):
    """
      Entry point to the Flask RESTful Server application.
    """
    app = Flask(__name__, **kwargs)
    app.config.from_object(config)

    # flask-restplus seem to use standard json lib and not the flask one
    # so we patch it here so it can handle UUIDs
    JSONEncoder.default = JSONEncoder_newdefault

    extensions.init_app(app)
    modules.init_app(app)

    return app
