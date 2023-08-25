from pydantic import BaseModel
from fastapi.testclient import TestClient
from datetime import date, datetime
from typing import Optional
from queries.authenticator import authenticator
from queries.events import eventsRepo
from main import app

client = TestClient(app)


class AccountOut(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    date_created: str
    bio: str
    photo: str


class EventOut(BaseModel):
    id: int
    name: str
    date: date
    time: str
    cost: str
    location: str
    description: str
    organizer: Optional[str]


class fakeEventsRepo:
    def get_one(*args) -> Optional[EventOut]:
        datetime_object = datetime.strptime('10/01/01', '%m/%d/%y')
        event = EventOut(
            id=700,
            name='testEvent',
            date=datetime_object,
            time='10:00 PM',
            cost='$800',
            location='on the map',
            description='testing',
            organizer='galvanize',
        )
        return event

    def fake_get_current_account_data():
        return AccountOut(
            id=1,
            username='blue',
            first_name='chris',
            last_name='blue',
            email='bt_byrne@yahoo.com',
            date_created='01-01-01',
            bio='importance',
            photo='url',
            )


def test_get_one_event():
    # Arrange
    app.dependency_overrides[authenticator.get_current_account_data] = (
        fakeEventsRepo.fake_get_current_account_data)
    app.dependency_overrides[eventsRepo] = fakeEventsRepo

    # Act
    response = client.get("/events/700")

    # Clean up
    app.dependency_overrides = {}

    print(response.json())

    # Assert
    assert response.status_code == 200
    response.json() == fakeEventsRepo.get_one()
