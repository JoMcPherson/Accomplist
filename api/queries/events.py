from pydantic import BaseModel
from typing import Optional, List, Union
from queries.pool import pool
from datetime import date


class Error(BaseModel):
    message: str


class EventIn(BaseModel):
    name: str
    date: date
    time: str
    cost: str
    location: str
    description: str
    organizer: Optional[str]


class EventOut(BaseModel):
    id: int
    name: str
    date: date
    time: str
    cost: str
    location: str
    description: str
    organizer: Optional[str]


class eventsRepo:
    def get_one(self, event_id: int) -> Optional[EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                    SELECT id
                    , name
                    , date
                    , time
                    , cost
                    , location
                    , description
                    , organizer
                    FROM events
                    WHERE id = %s
                        """,
                        [event_id],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_event_out(record)
        except Exception as e:
            print(e)
            return {"message": "could not retrieve event"}

    def delete(self, event_id: int) -> bool:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                    DELETE FROM events
                    WHERE id = %s
                        """,
                        [event_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False

    def update(self, event_id: int, event: EventIn) -> Union[EventOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                    UPDATE events
                    SET name = %s
                    , date = %s
                    , time = %s
                    , cost = %s
                    , location = %s
                    , description = %s
                    , organizer = %s
                        """,
                        [
                            event.name,
                            event.date,
                            event.time,
                            event.cost,
                            event.location,
                            event.description,
                            event.organizer,
                        ],
                    )
                    old_data = event.dict()
                    return EventOut(id=event_id, **old_data)

        except Exception as e:
            print(e)
            return {"message": "could not update event"}

    def create(self, event: EventIn) -> EventOut:
        # connect to database
        with pool.connection() as conn:
            # get a cursor
            with conn.cursor() as db:
                # run INSERT statement
                result = db.execute(
                    """
                    INSERT INTO events (
                    name, date, time, cost, location, description, organizer
                    )
                    VALUES
                    (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                    """,
                    [
                        event.name,
                        event.date,
                        event.time,
                        event.cost,
                        event.location,
                        event.description,
                        event.organizer,
                    ],
                )
                id = result.fetchone()[0]

                old_data = event.dict()
                return EventOut(id=id, **old_data)

    def get_all(self) -> Union[Error, List[EventOut]]:
        try:
            # connect to db
            with pool.connection() as conn:
                # get cursor
                with conn.cursor() as db:
                    # run select statement
                    result = db.execute(
                        """
                        SELECT id, name, date, time, cost, location,
                        description, organizer
                        FROM events
                        ORDER BY date
                        """
                    )
                    result = []
                    for record in db:
                        event = EventOut(
                            id=record[0],
                            name=record[1],
                            date=record[2],
                            time=record[3],
                            cost=record[4],
                            location=record[5],
                            description=record[6],
                            organizer=record[7],
                        )
                        result.append(event)
                    return result
        except Exception as e:
            print(e)
            return {"message": "Could not get all events"}

    def record_to_event_out(self, record):
        return EventOut(
            id=record[0],
            name=record[1],
            date=record[2],
            time=record[3],
            cost=record[4],
            location=record[5],
            description=record[6],
            organizer=record[7],
        )
