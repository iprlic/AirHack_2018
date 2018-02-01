import os


class BaseConfig(object):
    """Default configuration options."""
    SITE_NAME = 'Airhack'
    DEBUG = True

    SERVER_NAME = os.environ.get('SERVER_NAME', 'localhost:5000')
    ERROR_404_HELP = False

    # oauth server needs to be on a separete domain, adjust then
    OAUTH_SERVER = 'http://' + SERVER_NAME
    AUTHORIZATIONS = {
        'oauth2_password': {
            'type': 'oauth2',
            'flow': 'password',
            'scopes': {},
            'tokenUrl': OAUTH_SERVER + '/auth/oauth2/token',
            'refreshUrl': OAUTH_SERVER + '/auth/oauth2/token',
        }
    }

    ACTIVATE_USER_REDIRECTION_LINK = os.environ.get('ACTIVATE_USER_REDIRECTION_LINK',
                                                    'http://locahost:3000')

    ENABLED_MODULES = ('accounts', 'airhack')

    SWAGGER_UI_JSONEDITOR = True
    SWAGGER_UI_OAUTH_CLIENT_ID = 'documentation'
    SWAGGER_UI_OAUTH_REALM = "Authentication for Airhack server documentation"
    SWAGGER_UI_OAUTH_APP_NAME = "Airhack server documentation"

    SECRET_KEY = os.environ.get('SECRET_KEY', 'eb189369-4b6d-4eb0-80bb-39ee65c778ce')
    JWT_KEY = os.environ.get('SECRET_KEY', '7b1591bf-1146-43b3-9ad1-2abaa28a3289')

    CACHE_REDIS_HOST = os.environ.get('REDIS_TCP_ADDR', 'redis')
    CACHE_REDIS_PORT = os.environ.get('REDIS_TCP_PORT', '6390')

    CACHE_TYPE = 'redis'
    CACHE_KEY_PREFIX = 'airhack_'

    BROKER_URL = 'redis://{}:{}'.format(CACHE_REDIS_HOST, CACHE_REDIS_PORT)
    BROKER_BACKEND = BROKER_URL

    DB_HOST = os.environ.get('DB_ENV_ADDR', 'db')
    DB_PORT = os.environ.get('DB_ENV_PORT', '5432')
    DB_USER = os.environ.get('DB_ENV_USER', 'postgres')
    DB_PASS = os.environ.get('DB_ENV_PASS', 'postgres')
    DB_NAME = os.environ.get('DB_ENV_NAME', 'docker')

    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO' if DEBUG else 'ERROR')

    SQLALCHEMY_DATABASE_URI = 'postgresql://%s:%s@%s:%s/%s' % (DB_USER, DB_PASS, DB_HOST, DB_PORT,
                                                               DB_NAME)

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    MONITORING_PORT = 8082
    MONITORING_ADDR = '0.0.0.0'

    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.google.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', '123'))
    MAIL_USE_SSL = eval(os.environ.get('MAIL_USE_SSL', 'True').capitalize())
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'iprlic at gmail dot com')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', 'testtest')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'iprlic at gmail dot com')

    USER_ACTIVATION_URL = os.environ.get('USER_ACTIVATION_URL', 'http://localhost/nesto')
    FORGOT_PASS_URL = os.environ.get('FORGOT_PASS_URL', 'http://localhost/nesto')


class DevConfig(BaseConfig):
    """development configuration options."""
    DEBUG = True
    LOG_LEVEL = 'INFO'
    SITE_NAME = BaseConfig.SITE_NAME + '_DEV'
    SECRET_KEY = os.environ.get('SECRET_KEY', 'a165fb20-2dfc-42c6-a499-91a7779fe9b3')


class UatConfig(BaseConfig):
    """uat configuration options."""
    DEBUG = True
    SITE_NAME = BaseConfig.SITE_NAME + '_UAT'
    SECRET_KEY = os.environ.get('SECRET_KEY', 'b389d77e-f5b0-4bb7-875f-9f7c949003db')


class TestConfig(BaseConfig):
    """testing configuration options."""
    DEBUG = False
    TESTING = True
    SITE_NAME = BaseConfig.SITE_NAME + '_TESTING'
    SECRET_KEY = os.environ.get('SECRET_KEY', '96925421-bb34-4f2c-adb4-009f0eb19437')
    DB_HOST = os.environ.get('DB_ENV_ADDR', 'db')
    DB_PORT = os.environ.get('DB_ENV_PORT', '5432')
    DB_USER = os.environ.get('DB_ENV_USER', 'postgres')
    DB_PASS = os.environ.get('DB_ENV_PASS', 'postgres')
    DB_NAME = 'airhack_test'
    SQLALCHEMY_DATABASE_URI = 'postgresql://%s:%s@%s:%s/%s' % (DB_USER, DB_PASS, DB_HOST, DB_PORT,
                                                               DB_NAME)


class ProdConfig(BaseConfig):
    """prod configuration options."""
    SITE_NAME = BaseConfig.SITE_NAME + '_PROD'
    SECRET_KEY = os.environ.get('SECRET_KEY', '9b717022-c8b6-4284-ade2-423816d00de6')
    SQLALCHEMY_ECHO = False
