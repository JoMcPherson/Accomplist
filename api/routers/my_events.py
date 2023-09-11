from fastapi import APIRouter, Depends, Response
from typing import List, Union, Optional
from queries.authenticator import authenticator

from queries.my_events import (
    MyEventIn,
    MyEventOut,
    MyEventRepository,
    Error,
)

router = APIRouter()


@router.post("/api/my_events", response_model=MyEventOut)
def create_my_event(
    my_event: MyEventIn,
    repo: MyEventRepository = Depends(),
) -> MyEventOut:
    return repo.create(my_event)


@router.get("/api/my_events", response_model=List[MyEventOut])
def get_all_my_events(
    repo: MyEventRepository = Depends(),
) -> List[MyEventOut]:
    return repo.get_all()


@router.get(
    "/api/my_events/account/{user_id}",
    response_model=Union[List[MyEventOut], Error],
)
async def get_events_for_account(
    user_id: int,
    repo: MyEventRepository = Depends(),
    account_data: dict
    | None = Depends(authenticator.try_get_current_account_data),
) -> Union[List[MyEventOut], Error]:
    events = repo.get_all()
    filtered_events = [
        event for event in events if event.attendee_id == user_id
    ]
    return filtered_events


@router.delete("/api/my_events/{my_event_id}", response_model=bool)
def delete_my_event(
    my_event_id: int,
    repo: MyEventRepository = Depends(),
) -> bool:
    return repo.delete(my_event_id)


@router.get(
    "/api/my_events/{my_event_id}",
    response_model=Optional[MyEventOut],
)
def get_my_event(
    my_event_id: int,
    response: Response,
    repo: MyEventRepository = Depends(),
) -> Optional[MyEventOut]:
    my_event = repo.get_my_event(my_event_id)
    if my_event is None:
        response.status_code = 404
    return my_event
