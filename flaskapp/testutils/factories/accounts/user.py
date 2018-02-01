import factory

from app.modules.accounts import models
from ..types.guid import GUIDFactory
from ..base import BaseModelFactory


class UserFactory(BaseModelFactory):

    class Meta:
        model = models.User

    id = GUIDFactory()
    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    password = factory.Faker('password')
    active = True
