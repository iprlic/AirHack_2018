"""
Fixtures of models and other things that can be use in test
"""
import pytest
from . import factories
from .factories.types.geo import GeoFactory


@pytest.fixture(scope='function')
def default_user():
    return factories.UserFactory(
        email='iprlic@gmail.com', first_name='Test', last_name='Testsson', active=True)
