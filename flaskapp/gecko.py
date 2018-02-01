#!/usr/bin/env python
import os
from app.cli.cli import cli

VERSION = "0.1.0"

if os.environ.get('FLASK_APP', None) is None:
    os.environ['FLASK_APP'] = 'app/app_instance.py'

if __name__ == '__main__':
    cli.main()
