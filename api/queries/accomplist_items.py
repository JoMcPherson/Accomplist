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


class AccomplistItemOut(BaseModel):
    id: int
    title: str
    details: str
    photo: Optional[str]
    resources: Optional[str]
    things_to_do: Optional[str]
    things_not_to_do: Optional[str]
    date_added: date


class AccomplistItemRepository:
    def accomplist_in_to_out(
        self, id: int, accomplist_item: AccomplistItemIn
    ) -> AccomplistItemOut:
        old_data = accomplist_item.dict()
        return AccomplistItemOut(id=id, **old_data)

    def record_to_accomplist_item_out(self, record) -> AccomplistItemOut:
        return AccomplistItemOut(
            id=record[0],
            title=record[1],
            details=record[2],
            photo=record[3],
            resources=record[4],
            things_to_do=record[5],
            things_not_to_do=record[6],
            date_added=record[7],
        )

    def get_accomplist_item(
        self, accomplist_item_id: int
    ) -> Optional[AccomplistItemOut]:
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
                        FROM accomplist_items
                        WHERE id = %s
                        """,
                        [accomplist_item_id],
                    )
                    record = result.fetchone()
                    if record is None:
                        return None
                    return self.record_to_accomplist_item_out(record)
        except Exception as e:
            print(e)
            return None

    def delete(self, accomplist_item_id: int) -> bool:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    result = cur.execute(
                        """
                        DELETE FROM accomplist_items
                        WHERE id = %s
                        """,
                        [accomplist_item_id],
                    )
                    if result.rowcount == 0:
                        return False
                    return True
        except Exception as e:
            print(e)
            return False

    def update(
        self, accomplist_item_id: int, accomplist_item: AccomplistItemIn
    ) -> Union[Error, AccomplistItemOut]:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE accomplist_items
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
                            accomplist_item.title,
                            accomplist_item.details,
                            accomplist_item.photo,
                            accomplist_item.resources,
                            accomplist_item.things_to_do,
                            accomplist_item.things_not_to_do,
                            accomplist_item.date_added,
                            accomplist_item_id,
                        ],
                    )
                    return self.accomplist_in_to_out(
                        accomplist_item_id, accomplist_item
                    )
        except Exception as e:
            print(e)
            return Error(message="could not update accomplist item")

    def get_all(self) -> Union[Error, List[AccomplistItemOut]]:
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
                        FROM accomplist_items
                        ORDER BY id
                        """
                    )
                    return [
                        self.record_to_accomplist_item_out(record)
                        for record in cur
                    ]
        except Exception as e:
            print(e)
            return Error(message="could not get all accomplist items")

    def create(self, accomplist_item: AccomplistItemIn) -> AccomplistItemOut:
        try:
            # connect the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    # run our INSERT statement
                    result = cur.execute(
                        """
                        INSERT INTO accomplist_items
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
                            accomplist_item.title,
                            accomplist_item.details,
                            accomplist_item.photo,
                            accomplist_item.resources,
                            accomplist_item.things_to_do,
                            accomplist_item.things_not_to_do,
                            accomplist_item.date_added,
                        ],
                    )
                    id = result.fetchone()[0]
                    # Return new data
                    return self.accomplist_in_to_out(id, accomplist_item)
        except Exception as e:
            print(e)
            return Error(message="could not create accomplist item")
