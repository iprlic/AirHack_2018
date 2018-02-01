import pytest

from sqlalchemy import event
from sqlalchemy.orm import Session
from app.bootstrap import create_app
from sqlalchemy_utils.functions import drop_database, create_database, database_exists

from app.extensions import db as db_object
from flask_migrate import upgrade
from .client import AirhackTestClient
from app.bootstrap.config import TestConfig


@pytest.fixture(scope='session')
def app(request):
    app_object = create_app(config=TestConfig)
    app_object.testing = True
    app_object.test_client_class = AirhackTestClient
    yield app_object


@pytest.fixture(scope='session', autouse=True)
def db(request, app):
    # db_name = session_config['db_name']
    with app.app_context():
        url = db_object.engine.url

        # Recreate db
        if database_exists(url):
            drop_database(url)
        create_database(url)

        # Run all migrations
        upgrade()

        # TODO: need to kill db connections in order to drop database
        #     config.db.drop_all()
        #     os.system('dropdb %s' % db_name)
        return db_object


@event.listens_for(Session, "after_transaction_end")
def restart_savepoint(session, transaction):
    if transaction.nested and not transaction._parent.nested:
        session.begin_nested()


@pytest.fixture(scope='function')
def req_ctx(request, app):
    with app.test_request_context() as req_ctx:
        yield req_ctx


@pytest.fixture(scope='function', autouse=True)
def db_session(request, req_ctx, db):
    db.session.begin_nested()

    yield db.session

    # transaction.rollback()
    # connection.close()
    # db.session.remove()


@pytest.fixture(scope='function')
def client(app):
    with app.test_client() as client:
        yield client
