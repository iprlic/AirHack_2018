Airhack REST API
==================
.. image:: https://img.shields.io/badge/python-3.6-blue.svg?maxAge=2592000

Airhack REST API project

Setup with Docker
-----------------

Install docker and docker-compose then run:

::

    $ docker-compose up -d

Init the database by running:

::

    $ docker exec -it airhack2018_app_1 make db

Database upgrade:

::

    $ docker exec airhack2018_app_1 python gecko.py db upgrade

Generate database migration files:

::

    $ docker exec airhack2018_app_1 python gecko.py db migrate

Check your code quality by running:

::

    $ docker exec -it airhack2018_app_1 flake8

Here's a sneak peak at the different services:

::

    airhack2018_adminer_1      entrypoint.sh docker-php-e ...   Up      0.0.0.0:8080->8080/tcp
    airhack2018_app_1          make server                      Up      0.0.0.0:5000->5000/tcp, 0.0.0.0:51814->51814/tcp, 0.0.0.0:8082->8082/tcp
    airhack2018_celery_1       make celery                      Up
    airhack2018_db_1           docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp
    airhack2018_redis_1        docker-entrypoint.sh redis ...   Up      6379/tcp, 0.0.0.0:6390->6390/tcp
    airhack2018_swagger-ui_1   sh /usr/share/nginx/docker ...   Up      0.0.0.0:8081->8080/tcp

Setup
-----

1. Install required services:

::

    $ brew install redis
    $ brew install postgresql
    $ brew install redis

2. Install Python packages:

::

    $ make init_venv

3. Set necessary environment variables:

::

    $ source .ENV

4. Setup database and seed with test data:

::

    $ make db

5. Run the celery worker:

::

    $ make celery

6. Run local server:

::

    $ make server


Dev Tools
---------

1. Pre-commit (http://pre-commit.com/)

::

    $ pip install pre-commit

or

::

    $ brew install pre-commit

then run:

::

    $ pre-commit install

Pre-commit will now run hooks configured in .pre-commit-confog.yaml.
To do a dry run (without doing git commit) do

::

    $ pre-commit run

To run on all files (not just the ones staged for commit) run:

::

    $ pre-commit run --all
