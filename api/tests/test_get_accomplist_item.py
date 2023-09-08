from fastapi.testclient import TestClient
from queries.accomplist_items import AccomplistItemRepository
from main import app

client = TestClient(app)


class GetAccomplistItemRepo:
    def get_accomplist_item(self, accomplist_item_id: int):
        if accomplist_item_id == 1337:
            return {
                "id": 1337,
                "user_id": 0,
                "title": "Leet",
                "details": "The most leet elite",
                "photo": "elite.jpg",
                "resources": "elite.com",
                "comments": "no one can possibly be this elite",
                "date_added": "2023-09-11",
            }
        elif accomplist_item_id == 9998:
            raise Exception("DB Connection Error!")
        return None


def test_get_existing_item():
    app.dependency_overrides[AccomplistItemRepository] = GetAccomplistItemRepo

    response = client.get("/api/accomplist_items/1337")
    app.dependency_overrides = {}

    print(response.json(), "response")
    assert response.status_code == 200
    assert response.json() == {
        "id": 1337,
        "user_id": 0,
        "title": "Leet",
        "details": "The most leet elite",
        "photo": "elite.jpg",
        "resources": "elite.com",
        "comments": "no one can possibly be this elite",
        "date_added": "2023-09-11",
    }


def test_get_item_with_exception():
    app.dependency_overrides[AccomplistItemRepository] = GetAccomplistItemRepo

    response = None

    try:
        response = client.get("/api/accomplist_items/9998")
    except Exception as e:
        assert str(e) == "DB Connection Error!"

    app.dependency_overrides = {}

    if response:
        assert response.status_code == 500


def test_get_nonexistent_item():
    app.dependency_overrides[AccomplistItemRepository] = GetAccomplistItemRepo

    response = client.get("/api/accomplist_items/9999")
    app.dependency_overrides = {}

    print(response.json(), "response")
    assert response.status_code == 404
