import flask
from celery import Celery


class FlaskCelery(Celery):
    """
    A class that patches celery tasks and injects flask app context
    """

    def __init__(self, *args, **kwargs):
        self.app = None
        super(FlaskCelery, self).__init__(*args, **kwargs)
        self.patch_task()
        if 'app' in kwargs:
            self.init_app(kwargs['app'])

    def patch_task(self):
        task_base = self.Task
        _celery = self

        class ContextTask(task_base):
            abstract = True

            def __call__(self, *args, **kwargs):
                if flask.has_app_context():
                    return task_base.__call__(self, *args, **kwargs)
                else:
                    with _celery.app.app_context():
                        return task_base.__call__(self, *args, **kwargs)

        self.Task = ContextTask

    def init_app(self, app):
        self.app = app
        self.config_from_object(app.config)
