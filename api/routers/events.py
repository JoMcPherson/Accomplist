from fastapi import APIRouter, Depends, Response, HTTPException
from typing import Union, List, Optional
from queries.events import (
    EventIn,
    eventsRepo,
    EventOut,
    Error,
    UpdatedEventIn,
    UpdatedEventOut,
)
from queries.authenticator import authenticator


router = APIRouter()


@router.post("/events", response_model=Union[EventOut, Error])
def create_event(
    event: EventIn,
    response: Response,
    repo: eventsRepo = Depends(),
    account: dict = Depends(authenticator.get_current_account_data),
):
    if account:
        response.status_code = 200
        result = repo.create(event)
        return result
    else:
        raise HTTPException(status_code=401, detail="Login Required")


@router.get("/events", response_model=Union[Error, List[EventOut]])
def get_all(
    repo: eventsRepo = Depends(),
    account: dict = Depends(authenticator.get_current_account_data),
):
    return repo.get_all()


@router.put("/events/{event_id}", response_model=Union[Error, UpdatedEventOut])
def update_event(
    event_id: int,
    event: UpdatedEventIn,
    repo: eventsRepo = Depends(),
    account: dict = Depends(authenticator.get_current_account_data),
) -> Union[Error, EventOut]:
    accprint = account
    return repo.update(event_id, event, accprint)


@router.delete("/events/{event_id}", response_model=bool)
def delete_event(
    event_id: int,
    account: dict = Depends(authenticator.get_current_account_data),
    repo: eventsRepo = Depends(),
) -> bool:
    return repo.delete(event_id)


@router.get("/events/{event_id}", response_model=Optional[EventOut])
def get_one_event(
    event_id: int,
    response: Response,
    repo: eventsRepo = Depends(),
    account: dict = Depends(authenticator.get_current_account_data),
) -> EventOut:
    event = repo.get_one(event_id)
    if event is None:
        response.status_code = 404
    return event
