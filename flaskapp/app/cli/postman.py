import json
from .cli import cli
from ..app_instance import app


@cli.command(help='Create postman collection')
def postman():
    data = app.extensions['api'].as_postman(urlvars=False, swagger=True)
    print(json.dumps(data))
