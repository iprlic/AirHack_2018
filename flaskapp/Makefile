.PHONY: init_venv init_system clean celery server db


init_venv:
	pip install pipenv
	pip install pre-commit
	pipenv install --dev --three

init_system:
	pip install pipenv
	pip install pre-commit
	pipenv install --system --three --dev

celery:
	python runcelery.py -A app.app_instance:celery worker

server:
	python gecko.py runserver --host 0.0.0.0

db:
	python gecko.py db_recreate

clean:
	find . -name '*.pyc' -delete

