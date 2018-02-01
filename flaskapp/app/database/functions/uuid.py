from sqlalchemy.sql import expression
from sqlalchemy.ext.compiler import compiles
from ..types.guid import GUID


class UUUI4(expression.FunctionElement):
    type = GUID()


@compiles(UUUI4, 'postgresql')
def pg_uuid4(element, compiler, **kw):
    return "uuid_generate_v4()"


@compiles(UUUI4, 'mssql')
def ms_uuid4(element, compiler, **kw):
    return "NEWID()"


# HACK: cant be done in mysql
# https://stackoverflow.com/questions/270309/can-i-use-a-function-for-a-default-value-in-mysql
@compiles(UUUI4, 'mysql')
def my_uuid4(element, compiler, **kw):
    return ""
