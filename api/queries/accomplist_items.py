from pydantic import BaseModel
from typing import Optional, Union, List
from datetime import date
from queries.pool import pool


class Error(BaseModel):
    message: str


class AccomplistItemIn(BaseModel):
    title: str
    details: str
    photo: Optional[str]
    resources: Optional[str]
    things_to_do: Optional[str]
    things_not_to_do: Optional[str]
    date_added: date


class MyAccomplistItemOut(BaseModel):
    id: int
    title: str
    details: str
    photo: Optional[str]
    resources: Optional[str]
    things_to_do: Optional[str]
    things_not_to_do: Optional[str]
    date_added: date


class MyAccomplistItemRepository:
    def my_accomplist_in_to_out(
        self, id: int, my_accomplist_item: MyAccomplistItemIn
    ) -> MyAccomplistItemOut:
        old_data = my_accomplist_item.dict()
        return MyAccomplistItemOut(id=id, **old_data)

    def record_to_my_accomplist_item_out(self, record) -> MyAccomplistItemOut:
        return MyAccomplistItemOut(
            id=record[0],
            title=record[1],
            details=record[2],
            photo=record[3],
            resources=record[4],
            things_to_do=record[5],
            things_not_to_do=record[6],
            date_added=record[7],
        )

    def get_my_accomplist_item(
        self, my_accomplist_item_id: int
    ) -> Optional[MyAccomplistItemOut]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    result = cur.execute(
                        """
                        SELECT id,
                               title,
                               details,
                               photo,
                               resources,
                               things_to_do,
                               things_not_to_do,
                               date_added
                        FROM my_accomplist_items
                        WHERE id = %s
                        """,
                        [my_accomplist_item_id],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_my_accomplist_item_out(record)
        except Exception as e:
            print(e)
            return None

    def delete(self, my_accomplist_item_id: int) -> bool:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    result = cur.execute(
                        """
                        DELETE FROM my_accomplist_items
                        WHERE id = %s
                        """,
                        [my_accomplist_item_id],
                    )
                    if result.rowcount == 0:
                        return False
                    return True
        except Exception as e:
            print(e)
            return False

    def update(
        self,
        my_accomplist_item_id: int,
        my_accomplist_item: MyAccomplistItemIn,
    ) -> Union[Error, MyAccomplistItemOut]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE my_accomplist_items
                        SET title = %s,
                            details = %s,
                            photo = %s,
                            resources = %s,
                            things_to_do = %s,
                            things_not_to_do = %s,
                            date_added = %s
                        WHERE id = %s
                        """,
                        [
                            my_accomplist_item.title,
                            my_accomplist_item.details,
                            my_accomplist_item.photo,
                            my_accomplist_item.resources,
                            my_accomplist_item.things_to_do,
                            my_accomplist_item.things_not_to_do,
                            my_accomplist_item.date_added,
                            my_accomplist_item_id,
                        ],
                    )
                    return self.my_accomplist_in_to_out(
                        my_accomplist_item_id, my_accomplist_item
                    )
        except Exception as e:
            print(e)
            return Error(message="could not update my accomplist item")

    def get_all(self) -> Union[Error, List[MyAccomplistItemOut]]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT
                            id,
                            title,
                            details,
                            photo,
                            resources,
                            things_to_do,
                            things_not_to_do,
                            date_added
                        FROM my_accomplist_items
                        ORDER BY id
                        """
                    )
                    return [
                        self.record_to_my_accomplist_item_out(record)
                        for record in cur
                    ]
        except Exception as e:
            print(e)
            return Error(message="could not get all my accomplist items")

    def create(
        self, my_accomplist_item: MyAccomplistItemIn
    ) -> MyAccomplistItemOut:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    # run our INSERT statement
                    result = cur.execute(
                        """
                        INSERT INTO my_accomplist_items
                            (title,
                             details,
                             photo,
                             resources,
                             things_to_do,
                             things_not_to_do,
                             date_added)
                        VALUES
                            (%s, %s, %s, %s, %s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            my_accomplist_item.title,
                            my_accomplist_item.details,
                            my_accomplist_item.photo,
                            my_accomplist_item.resources,
                            my_accomplist_item.things_to_do,
                            my_accomplist_item.things_not_to_do,
                            my_accomplist_item.date_added,
                        ],
                    )
                    id = result.fetchone()[0]
                    # Return new data
                    return self.my_accomplist_in_to_out(id, my_accomplist_item)
        except Exception as e:
            print(e)
            return Error(message="could not create my accomplist item")
