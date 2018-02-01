# TODO: maybe tasks should live inside modules? e.g. users module can have its own tasks.py
from celery.signals import task_postrun
from app.extensions import db
from app.extensions import celery


@celery.task
def send_registration_email(user, token):
    # mandril app
    pass


@task_postrun.connect
def close_session(*args, **kwargs):
    db.session.remove()
