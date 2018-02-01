"""
Modules
=======
Modules enable logical resource separation.
You may control enabled modules by modifying ``ENABLED_MODULES`` config
variable.
"""

from flask import Blueprint
from ..extensions import api


def init_app(app, **kwargs):
    from importlib import import_module

    for module_name in app.config['ENABLED_MODULES']:
        import_module('.%s' % module_name, package=__name__).init_app(app, **kwargs)

    rest_api_blueprint = Blueprint('api', __name__, url_prefix='/api')
    api.rest_api.init_app(rest_api_blueprint)
    app.register_blueprint(rest_api_blueprint)
