def test_app_testing(app):
    assert app.testing


def test_api_docs_index(client):
    resp = client.get('/api/')
    assert resp.status_code == 200
