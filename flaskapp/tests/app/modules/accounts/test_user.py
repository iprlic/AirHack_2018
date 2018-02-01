def test_users_unauthorized(client, default_user):
    resp = client.get('/api/accounts/users')
    assert resp.status_code == 401


def test_create_user(client):
    resp = client.post(
        '/api/accounts/users',
        json={
            'email': 'iprlic@gmail.com',
            'first_name': 'Ivan',
            'last_name': 'Prlic',
            'password': 'qwerty123'
        })
    data = resp.json()
    assert resp.status_code == 200
    assert data['id'] is not None
