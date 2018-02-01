from .cli import cli
from ..extensions import db
from ..modules.accounts.models import User, OAuthClient
import click
from werkzeug.security import gen_salt


@cli.group(help="Add initial data to your database")
def seed():
    click.echo('Adding data to database...')


@seed.command(help='Add user to the database')
@click.option('--email', prompt='Users email address')
@click.option('--password', prompt=True, hide_input=True, confirmation_prompt=True)
@click.option('--first_name', prompt='First name')
@click.option('--last_name', prompt='Last name')
@click.option('--roles', prompt='Roles')
def user(email, password, first_name, last_name, roles):
    user = User(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        roles=roles,
        active=True)
    db.session.add(user)
    db.session.commit()
    click.echo('User added.')


@seed.command(help='Add admin to the database')
@click.option('--email', prompt='Users email address')
@click.option('--password', prompt=True, hide_input=True, confirmation_prompt=True)
def admin(email, password):
    user = User(
        email=email,
        password=password,
        first_name='Admin',
        last_name='Admin',
        roles=7,
        active=True)
    db.session.add(user)
    db.session.commit()
    click.echo('User added.')


@seed.command(help='Add oauth client to the database')
@click.option('--name', prompt=True)
@click.option('--description', prompt=True)
@click.option('--confidential', prompt=True, is_flag=True)
def client(name, description, confidential):
    client = OAuthClient(name=name, description=description, is_confidential=confidential)
    client.client_id = gen_salt(40)
    client.client_secret = gen_salt(55)
    db.session.add(client)
    db.session.commit()
    click.echo('Client added. ID: ' + client.client_id + ', secret: ' + client.client_secret)
