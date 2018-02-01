from app.extensions import celery
from app.bootstrap import create_app

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        celery.start()
