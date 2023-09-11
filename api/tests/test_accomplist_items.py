from fastapi.testclient import TestClient
from queries.accomplist_items import AccomplistItemRepository
from main import app

client = TestClient(app)


class CreateAccomplistItemRepo:
    def create(self, accomplist_item):
        result = {
            "id": 1010,
            "user_id": 0,
            "title": "Foo Bar",
            "details": "The Foo Barters",
            "photo": "foobar.jpg",
            "resources": "fooing.com",
            "comments": "foo foo",
            "date_added": "2023-08-29",
        }
        result.update(accomplist_item)
        return result


def test_create_item():
    app.dependency_overrides[
        AccomplistItemRepository
    ] = CreateAccomplistItemRepo

    json = {
        "user_id": 0,
        "title": "Foo Bar",
        "details": "The Foo Barters",
        "photo": "foobar.jpg",
        "resources": "fooing.com",
        "comments": "foo foo",
        "date_added": "2023-08-29",
    }

    response = client.post("/api/accomplist_items", json=json)
    app.dependency_overrides = {}

    print(response.json(), "response")
    assert response.status_code == 200
    assert response.json() == {
        "id": 1010,
        "user_id": 0,
        "title": "Foo Bar",
        "details": "The Foo Barters",
        "photo": "foobar.jpg",
        "resources": "fooing.com",
        "comments": "foo foo",
        "date_added": "2023-08-29",
    }
