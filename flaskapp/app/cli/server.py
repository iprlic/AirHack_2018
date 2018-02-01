import click
from gevent.wsgi import WSGIServer
from werkzeug.serving import run_with_reloader
from werkzeug.debug import DebuggedApplication
from ..app_instance import app
from .cli import cli


@cli.command(help='Local development server using gevent')
@click.option('--host', default='0.0.0.0')
@click.option('--port', default=5000)
@click.option(
    '--server',
    default='gevent',
    help='Pick a server to run. Current options are gevent or flask.')
def runserver(host, port, server):
    app.extensions['metrics'].start_metrics_server(app)

    if server == 'gevent':
        run_with_reloader(run_gevent_server(host, port))
    else:
        app.run(host=host, port=port)


def run_gevent_server(host, port):
    if app.debug:
        application = DebuggedApplication(app)
    else:
        application = app

    http_server = WSGIServer((host, port), application)
    http_server.serve_forever()
