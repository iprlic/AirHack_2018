from gevent import monkey
monkey.patch_all()    # noqa

from app.bootstrap import create_app
from app.extensions import celery    # noqa

app = create_app()
