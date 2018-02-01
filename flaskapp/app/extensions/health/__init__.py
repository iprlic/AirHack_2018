from flask import Response
from healthcheck import HealthCheck, EnvironmentDump
from . import metrics, healthchecks


def init_app(app, **kwargs):
    # ping endpoint for monitoring purposes
    @app.route("/ping", methods=["GET"])
    def ping():
        return Response("PONG", mimetype="text/plain")

    health = HealthCheck(app, "/health")
    envdump = EnvironmentDump(app, "/env", include_config=False)

    health.add_check(healthchecks.db_connectivity)
    health.add_check(healthchecks.cpu_usage)
    health.add_check(healthchecks.memory_available)

    # TODO: add more config info to expose as required
    config_data = {'enabled_modules': app.config['ENABLED_MODULES']}

    envdump.add_section("config_data", lambda: config_data)

    app.extensions = getattr(app, 'extensions', {})
    app.extensions['metrics'] = metrics
