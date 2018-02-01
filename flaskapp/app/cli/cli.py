from flask.cli import FlaskGroup

VERSION = "0.1.0"
help = str.format("""Gecko""", VERSION)

cli = FlaskGroup(help=help)
