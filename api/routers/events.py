from fastapi import APIRouter, Depends, Response
from typing import Union, List, Optional
from queries.events import EventIn, eventsRepo, EventOut, Error

router = APIRouter()


@router.post("/events", response_model=Union[EventOut, Error])
def create_event(event: EventIn, response: Response,
                 repo: eventsRepo = Depends()):
    response.status_code = 200
    return repo.create(event)
    return {"message": "error!"}


@router.get("/events", response_model=Union[Error, List[EventOut]])
def get_all(
        repo: eventsRepo = Depends(),
):
    return repo.get_all()


@router.put("/events/{event_id}", response_model=Union[Error, EventOut])
def update_event(
        event_id: int,
        event: EventIn,
        repo: eventsRepo = Depends()) -> Union[Error, EventOut]:
    return repo.update(event_id, event)


@router.delete("/vacations/{event_id}", response_model=bool)
def delete_event(
        event_id: int,
        repo: eventsRepo = Depends()) -> bool:
    return repo.delete(event_id)


@router.get("/events/{event_id}", response_model=Optional[EventOut])
def get_one_event(
        event_id: int,
        response: Response,
        repo: eventsRepo = Depends()
        ) -> EventOut:
    event = repo.get_one(event_id)
    if event is None:
        response.status_code = 404
    return event
