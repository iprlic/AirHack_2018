import time

from prometheus_client import Counter, Histogram
from prometheus_client import start_http_server
from flask import request

REQUEST_LATENCY = Histogram('request_latency_seconds', 'Request Latency', ['method', 'endpoint'])
REQUEST_COUNT = Counter('request_count', 'Request Count', ['method', 'endpoint', 'http_status'])


def before_request():
    request.start_time = time.time()


def after_request(response):
    request_latency = time.time() - request.start_time

    REQUEST_LATENCY.labels(request.method, request.path).observe(request_latency)
    REQUEST_COUNT.labels(request.method, request.path, response.status_code).inc()

    return response


def start_metrics_server(app, port=None, addr=None):
    if port is None:
        port = app.config['MONITORING_PORT']
    if addr is None:
        addr = app.config['MONITORING_ADDR']

    app.before_request(before_request)
    app.after_request(after_request)
    start_http_server(port, addr)
