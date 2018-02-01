"""
Extensions setup
================
Extensions provide access to common resources of the application.
Please, put new extension instantiations and initializations here.
"""
from flask_cors import CORS
from .database import create_db
from flask_login import LoginManager
from flask_marshmallow import Marshmallow
from flask_caching import Cache
from .celery import FlaskCelery
from flask_migrate import Migrate
from .oauth2.provider import auth
from . import api
from .api.http_exceptions import api_invalid_response
import logging
from flask_mail import Mail

logger = logging.getLogger(__name__)
db = create_db()
cache = Cache()
celery = FlaskCelery()
marshmallow = Marshmallow()
login_manager = LoginManager()
cors = CORS()
migrate = Migrate()
mail = Mail()

from . import health    # noqa, to be able to fetch db in healthchecks


def init_app(app):
    """
    Application extensions initialization.
    """
    for extension in (cors, db, login_manager, marshmallow, auth, api, health, celery, mail):
        extension.init_app(app)

    auth.set_invalid_response(api_invalid_response)
    migrate.init_app(app, db)

    cache.init_app(app, config=app.config)
    # DEBUG should be False, flaskwork should not be installed on prod env
    # if not true lets log it as warning
    try:
        if app.config['DEBUG']:
            from flask_flaskwork import Flaskwork
            flaskwork = Flaskwork()
            flaskwork.init_app(app)
    except Exception as e:
        logger.warning("Failed to init flaskwork", e)
