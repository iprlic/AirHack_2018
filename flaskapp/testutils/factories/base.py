from factory.alchemy import SQLAlchemyModelFactory
from app.extensions import db


class BaseModelFactory(SQLAlchemyModelFactory):

    class Meta:
        sqlalchemy_session = db.session
