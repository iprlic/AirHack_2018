from sqlalchemy.sql import expression
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.types import DateTime


class UtcNow(expression.FunctionElement):
    type = DateTime()


@compiles(UtcNow, 'postgresql')
def pg_utcnow(element, compiler, **kw):
    return "TIMEZONE('utc', CURRENT_TIMESTAMP)"


@compiles(UtcNow, 'mssql')
def ms_utcnow(element, compiler, **kw):
    return "GETUTCDATE()"


# HACK: this won't work servers timezone must be UTC0
@compiles(UtcNow, 'mysql')
def my_utcnow(element, compiler, **kw):
    return "NOW()"
