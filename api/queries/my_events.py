from pydantic import BaseModel
from typing import Optional, Union, List
from queries.pool import pool


class Error(BaseModel):
    message: str


class MyEventIn(BaseModel):
    event_id: int
    attendee_id: int


class MyEventOut(BaseModel):
    id: int
    event_id: int
    attendee_id: int


class MyEventRepository:
    def my_event_in_to_out(self, id: int, my_event: MyEventIn) -> MyEventOut:
        old_data = my_event.dict()
        return MyEventOut(
            id=id,
            event_id=old_data["event_id"],
            attendee_id=old_data["attendee_id"],
        )

    def record_to_my_event_out(self, record) -> MyEventOut:
        return MyEventOut(
            id=record[0],
            event_id=record[1],
            attendee_id=record[2],
        )

    def get_my_event(self, my_event_id: int) -> Optional[MyEventOut]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    result = cur.execute(
                        """
                        SELECT id,
                               event_id,
                               attendee_id
                        FROM my_events
                        WHERE id = %s
                        """,
                        [my_event_id],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_my_event_out(record)
        except Exception as e:
            print(e)
            return None

    def delete(self, my_event_id: int) -> bool:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    result = cur.execute(
                        """
                        DELETE FROM my_events
                        WHERE id = %s
                        """,
                        [my_event_id],
                    )
                    if result.rowcount == 0:
                        return False
                    return True
        except Exception as e:
            print(e)
            return False

    def get_all(self) -> Union[Error, List[MyEventOut]]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT
                            id,
                            event_id,
                            attendee_id
                        FROM my_events
                        ORDER BY id
                        """
                    )
                    return [
                        self.record_to_my_event_out(record) for record in cur
                    ]
        except Exception as e:
            print(e)
            return Error(message="could not get all my event items")

    def create(self, my_event: MyEventIn) -> MyEventOut:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    # run our INSERT statement
                    cur.execute(
                        """
                        INSERT INTO my_events
                            (event_id,
                             attendee_id)
                        VALUES
                            (%s, %s)
                        RETURNING id;
                        """,
                        [my_event.event_id, my_event.attendee_id],
                    )

                    id = cur.fetchone()[0]
                    # Return new data
                    return self.my_event_in_to_out(id, my_event)
        except Exception as e:
            print(e)
            return Error(message="could not create my event item")
