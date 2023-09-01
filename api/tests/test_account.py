from fastapi.testclient import TestClient
from queries.accounts import AccountRepo
from main import app
from pydantic import BaseModel
from queries.authenticator import authenticator

client = TestClient(app)


class EmptyAccountQueries:
    def get_all_accounts(self):
        return []


class AccountOut(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str
    date_created: str
    bio: str
    photo: str
    id: int


def fake_get_current_account_data():
    return AccountOut(
        username="janedoe",
        email="janedoe@test.com",
        id=13,
        first_name="Jane",
        last_name="Doe",
        date_created="2023-08-31",
        bio="This is a test.",
        photo="www.google.com",
    )


def test_get_all_users():
    app.dependency_overrides[AccountRepo] = EmptyAccountQueries
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_get_current_account_data

    response = client.get("/api/accounts")
    app.dependency_overrides = {}

    assert response.status_code == 200
    assert response.json() == []
    print(response.content)
