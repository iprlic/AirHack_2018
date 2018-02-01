"""accounts

Revision ID: 7e5dd2aaf648
Revises:
Create Date: 2017-12-12 08:47:48.750248

"""
from alembic import op
import sqlalchemy as sa
import app.extensions
import sqlalchemy_utils
import geoalchemy2
from sqlalchemy.sql import text

# revision identifiers, used by Alembic.
revision = '7e5dd2aaf648'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('oauth_client',
                    sa.Column(
                        'created',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column(
                        'updated',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column('name', sa.String(length=40), nullable=False),
                    sa.Column('description', sa.String(length=400), nullable=True),
                    sa.Column('client_id', sa.String(length=40), nullable=False),
                    sa.Column('client_secret', sa.String(length=55), nullable=False),
                    sa.Column(
                        'is_confidential',
                        sa.Boolean(),
                        server_default=sa.text('false'),
                        nullable=False),
                    sa.Column('_redirect_uris', sa.Text(), nullable=True),
                    sa.Column('_default_scopes', sa.Text(), nullable=True),
                    sa.PrimaryKeyConstraint('client_id', name=op.f('pk_oauth_client')),
                    sa.UniqueConstraint('name', name=op.f('uq_oauth_client_name')))
    op.create_index(op.f('ix_oauth_client_client_id'), 'oauth_client', ['client_id'], unique=True)
    op.create_index(
        op.f('ix_oauth_client_client_secret'), 'oauth_client', ['client_secret'], unique=True)
    op.create_table('user',
                    sa.Column(
                        'created',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column(
                        'updated',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column(
                        'email',
                        sqlalchemy_utils.types.email.EmailType(length=256),
                        nullable=False),
                    sa.Column(
                        'password',
                        sqlalchemy_utils.types.password.PasswordType(max_length=128),
                        nullable=False),
                    sa.Column('roles', sa.Integer(), server_default='0', nullable=False),
                    sa.Column(
                        'active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
                    sa.Column('first_name', sa.String(length=256), nullable=False),
                    sa.Column('last_name', sa.String(length=256), nullable=False),
                    sa.Column('phone', sa.String(length=256), nullable=True),
                    sa.Column(
                        'id',
                        app.database.types.guid.GUID(),
                        server_default=sa.text('uuid_generate_v4()'),
                        nullable=False), sa.PrimaryKeyConstraint('id', name=op.f('pk_user')))
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_table('oauth_grant',
                    sa.Column(
                        'created',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column(
                        'updated',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column('user_id', app.database.types.guid.GUID(), nullable=True),
                    sa.Column('client_id', sa.String(length=40), nullable=False),
                    sa.Column('code', sa.String(length=255), nullable=False),
                    sa.Column('redirect_uri', sa.String(length=255), nullable=True),
                    sa.Column('expires', sa.DateTime(), nullable=True),
                    sa.Column('_scopes', sa.Text(), nullable=True),
                    sa.Column(
                        'id',
                        app.database.types.guid.GUID(),
                        server_default=sa.text('uuid_generate_v4()'),
                        nullable=False),
                    sa.ForeignKeyConstraint(
                        ['client_id'], ['oauth_client.client_id'],
                        name=op.f('fk_oauth_grant_client_id_oauth_client')),
                    sa.ForeignKeyConstraint(
                        ['user_id'], ['user.id'],
                        name=op.f('fk_oauth_grant_user_id_user'),
                        ondelete='CASCADE'),
                    sa.PrimaryKeyConstraint('id', name=op.f('pk_oauth_grant')))
    op.create_index(op.f('ix_oauth_grant_code'), 'oauth_grant', ['code'], unique=False)
    op.create_table('oauth_token',
                    sa.Column(
                        'created',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column(
                        'updated',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column('client_id', sa.String(length=40), nullable=False),
                    sa.Column('user_id', app.database.types.guid.GUID(), nullable=True),
                    sa.Column('token_type', sa.String(length=40), nullable=True),
                    sa.Column('access_token', sa.String(length=8000), nullable=True),
                    sa.Column('refresh_token', sa.String(length=255), nullable=True),
                    sa.Column('expires', sa.DateTime(), nullable=True),
                    sa.Column('_scopes', sa.Text(), nullable=True),
                    sa.Column(
                        'id',
                        app.database.types.guid.GUID(),
                        server_default=sa.text('uuid_generate_v4()'),
                        nullable=False),
                    sa.ForeignKeyConstraint(
                        ['client_id'], ['oauth_client.client_id'],
                        name=op.f('fk_oauth_token_client_id_oauth_client')),
                    sa.ForeignKeyConstraint(
                        ['user_id'], ['user.id'], name=op.f('fk_oauth_token_user_id_user')),
                    sa.PrimaryKeyConstraint('id', name=op.f('pk_oauth_token')),
                    sa.UniqueConstraint('access_token', name=op.f('uq_oauth_token_access_token')),
                    sa.UniqueConstraint(
                        'refresh_token', name=op.f('uq_oauth_token_refresh_token')))
    op.create_table('user_token',
                    sa.Column(
                        'created',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column(
                        'updated',
                        sa.DateTime(),
                        server_default=sa.text("TIMEZONE('utc', CURRENT_TIMESTAMP)"),
                        nullable=False),
                    sa.Column('user_id', app.database.types.guid.GUID(), nullable=False),
                    sa.Column('code', sa.String(length=255), nullable=False),
                    sa.Column(
                        'type',
                        sa.Enum('activation', 'forgot_password', name='usertokentype'),
                        nullable=False),
                    sa.Column('expires_at', sa.DateTime(), nullable=False),
                    sa.Column(
                        'id',
                        app.database.types.guid.GUID(),
                        server_default=sa.text('uuid_generate_v4()'),
                        nullable=False),
                    sa.ForeignKeyConstraint(
                        ['user_id'], ['user.id'], name=op.f('fk_user_token_user_id_user')),
                    sa.PrimaryKeyConstraint('id', name=op.f('pk_user_token')),
                    sa.UniqueConstraint('code', name=op.f('uq_user_token_code')))
    op.create_index(op.f('ix_user_token_user_id'), 'user_token', ['user_id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_token_user_id'), table_name='user_token')
    op.drop_table('user_token')
    op.drop_table('oauth_token')
    op.drop_index(op.f('ix_oauth_grant_code'), table_name='oauth_grant')
    op.drop_table('oauth_grant')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_oauth_client_client_secret'), table_name='oauth_client')
    op.drop_index(op.f('ix_oauth_client_client_id'), table_name='oauth_client')
    op.drop_table('oauth_client')
    # ### end Alembic commands ###