from sqlalchemy_utils.functions import create_database, drop_database
from app.extensions import db
from .cli import cli


@cli.command(help='Create required database and load initial schema and data')
def db_create():
    create_database(db.engine.url)


@cli.command(help='Remove database (and all data contained within)')
def db_drop():
    drop_database(db.engine.url)


@cli.command(help='Recreate required database with initial data')
def db_recreate():
    drop_database(db.engine.url)
    create_database(db.engine.url)
