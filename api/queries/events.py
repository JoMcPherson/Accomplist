from pydantic import BaseModel, SecretStr, HttpUrl
from typing import Optional, List, Union
from queries.pool import pool


class Error(BaseModel):
    message: str


class EventIn(BaseModel):
    name: str
    date: str
    time: str
    cost: str
    location: str
    description: str
    organizer_id: Optional[int]
    organizer_username: Optional[str]
    goal_id: Optional[int]


class UpdatedEventIn(BaseModel):
    name: Optional[str]
    date: Optional[str]
    time: Optional[str]
    cost: Optional[str]
    location: Optional[str]
    description: Optional[str]
    organizer_id: Optional[int]
    organizer_username: Optional[str]
    goal_id: Optional[int]


class EventOut(BaseModel):
    event_id: int
    name: str
    date: str
    time: str
    cost: str
    location: str
    description: str
    organizer_id: Optional[int]
    organizer_username: Optional[str]
    goal_id: Optional[int]


class UpdatedEventOut(BaseModel):
    event_id: int
    name: Optional[str]
    date: Optional[str]
    time: Optional[str]
    cost: Optional[str]
    location: Optional[str]
    description: Optional[str]
    organizer_id: Optional[int]
    organizer_username: Optional[str]
    goal_id: Optional[int]


class MyEventIn(BaseModel):
    event_id: int
    user_id: int


class MyEventOut(BaseModel):
    my_event_id: int
    event_id: int
    user_id: int
    myevent_name: str
    myevent_organizer: str


class eventsRepo:
    def get_name_by_id(self, event_id: int) -> str:
        try:
            # connect to the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT name
                        FROM events
                        WHERE event_id = %s
                        """,
                        [event_id],
                    )
                    result = cur.fetchone()
                    if result:
                        return result[0]
        except Exception as e:
            print(e)
            return {"message": "could not retrieve event name from events"}

    def get_organizer_by_id(self, organizer: int) -> str:
        try:
            # connect to the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT username
                        FROM user_accounts
                        WHERE id = %s
                        """,
                        [organizer],
                    )
                    result = cur.fetchone()
                    if result:
                        return result[0]
        except Exception as e:
            print(e)
            return {"message": "could not retrive organizer by user id"}

    def get_one(self, event_id: int) -> Optional[EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                    SELECT event_id
                    , name
                    , date
                    , time
                    , cost
                    , location
                    , description
                    , organizer_id
                    , organizer_username
                    , goal_id
                    FROM events
                    WHERE event_id = %s
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
                    WHERE event_id = %s
                        """,
                        [event_id],
                    )
                    return True
        except Exception as e:
            print(e)
            return False

    def update(
        self, event_id: int, event: UpdatedEventIn, accprint: dict
    ) -> Union[UpdatedEventOut, Error]:
        update_event = event.dict(exclude_unset=True)
        query_list = []
        for key, value in update_event.items():
            if isinstance(value, SecretStr):
                value = value.get_secret_value()
            if isinstance(value, HttpUrl):
                value = str(value)
            query_list.append(f"{key} = %s")
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        f"""
                        UPDATE events
                        SET {', '.join(query_list)}
                        WHERE event_id=%s
                        RETURNING *;
                        """,
                        [*update_event.values(), event_id],
                    )
                    old_data = event.dict()

                    return UpdatedEventOut(event_id=event_id, **old_data)
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
                    name, date, time, cost, location, description,
                    organizer_id, organizer_username, goal_id
                    )
                    VALUES
                    (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING event_id;
                    """,
                    [
                        event.name,
                        event.date,
                        event.time,
                        event.cost,
                        event.location,
                        event.description,
                        event.organizer_id,
                        event.organizer_username,
                        event.goal_id,
                    ],
                )
                id = result.fetchone()[0]

                old_data = event.dict()
                return EventOut(event_id=id, **old_data)

    def get_all(self) -> Union[Error, List[EventOut]]:
        try:
            # connect to db
            with pool.connection() as conn:
                # get cursor
                with conn.cursor() as db:
                    # run select statement
                    result = db.execute(
                        """
                        SELECT event_id, name, date, time, cost, location,
                        description, organizer_id, organizer_username, goal_id
                        FROM events
                        ORDER BY date
                        """
                    )
                    result = []
                    for record in db:
                        event = EventOut(
                            event_id=record[0],
                            name=record[1],
                            date=record[2],
                            time=record[3],
                            cost=record[4],
                            location=record[5],
                            description=record[6],
                            organizer_id=record[7],
                            organizer_username=record[8],
                            goal_id=record[9],
                        )
                        result.append(event)
                    return result
        except Exception as e:
            print(e)
            return {"message": "Could not get all events"}

    def record_to_event_out(self, record):
        return EventOut(
            event_id=record[0],
            name=record[1],
            date=record[2],
            time=record[3],
            cost=record[4],
            location=record[5],
            description=record[6],
            organizer_id=record[7],
            organizer_username=record[8],
            goal_id=record[9],
        )

    def get_events_hosted(
        self, account_id: int
    ) -> Union[Error, List[EventOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT event_id, name, date, time, cost, location,
                        description, organizer_id, organizer_username, goal_id
                        FROM events
                        WHERE organizer_id = %s
                        """,
                        [account_id],
                    )
                    result = []
                    for record in db:
                        event = EventOut(
                            event_id=record[0],
                            name=record[1],
                            date=record[2],
                            time=record[3],
                            cost=record[4],
                            location=record[5],
                            description=record[6],
                            organizer_id=record[7],
                            organizer_username=record[8],
                            goal_id=record[9],
                        )
                        result.append(event)
                    return result
        except Exception as e:
            print(e)
            return {"message": "Could not get events hosted"}

    def search_events(self, query: str) -> List[EventOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT event_id, name, date, time, cost, location, description,
                            organizer_id, organizer_username, goal_id
                    FROM events
                    WHERE LOWER(name) LIKE LOWER(%s);
                    """,
                    (f"%{query}%",)  # SQL parameters
                )
                events = []
                for ev in cur.fetchall():
                    event = EventOut(
                        event_id=ev[0],
                        name=ev[1],
                        date=ev[2],
                        time=ev[3],
                        cost=ev[4],
                        location=ev[5],
                        description=ev[6],
                        organizer_id=ev[7],
                        organizer_username=ev[8],
                        goal_id=ev[9],
                    )
                    events.append(event)
                return events
