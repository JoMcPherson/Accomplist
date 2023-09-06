from pydantic import BaseModel
from typing import Optional, Union, List
from datetime import date
from queries.pool import pool


class Error(BaseModel):
    message: str


class AccomplistItemIn(BaseModel):
    user_id: int
    title: str
    details: str
    photo: Optional[str]
    resources: Optional[str]
    comments: Optional[str]
    date_added: date


class AccomplistItemOut(BaseModel):
    id: int
    user_id: int
    title: str
    details: str
    photo: Optional[str]
    resources: Optional[str]
    comments: Optional[str]
    date_added: date


class AccomplistItemRepository:
    def get_username_by_id(self, user_id: int) -> str:
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
                        [user_id],
                    )
                    result = cur.fetchone()
                    if result:
                        return result[0]
        except Exception as e:
            print(e)
            return ""

    def accomplist_in_to_out(
        self, id: int, accomplist_item: AccomplistItemIn
    ) -> AccomplistItemOut:
        old_data = accomplist_item.dict()
        return AccomplistItemOut(id=id, **old_data)

    def record_to_accomplist_item_out(self, record) -> AccomplistItemOut:
        return AccomplistItemOut(
            id=record[0],
            user_id=record[1],
            title=record[2],
            details=record[3],
            photo=record[4],
            resources=record[5],
            comments=record[6],
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
                               user_id,
                               title,
                               details,
                               photo,
                               resources,
                               comments,
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
                        SET user_id = %s,
                            title = %s,
                            details = %s,
                            photo = %s,
                            resources = %s,
                            comments = %s,
                            date_added = %s
                        WHERE id = %s
                        """,
                        [
                            accomplist_item.user_id,
                            accomplist_item.title,
                            accomplist_item.details,
                            accomplist_item.photo,
                            accomplist_item.resources,
                            accomplist_item.comments,
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
                            user_id,
                            title,
                            details,
                            photo,
                            resources,
                            comments,
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
                            (user_id,
                            title,
                             details,
                             photo,
                             resources,
                             comments,
                             date_added)
                        VALUES
                            (%s,%s, %s, %s, %s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            accomplist_item.user_id,
                            accomplist_item.title,
                            accomplist_item.details,
                            accomplist_item.photo,
                            accomplist_item.resources,
                            accomplist_item.comments,
                            accomplist_item.date_added,
                        ],
                    )
                    id = result.fetchone()[0]
                    # Return new data
                    return self.accomplist_in_to_out(id, accomplist_item)
        except Exception as e:
            print(e)
            return Error(message="could not create accomplist item")

    def get_my_accomplist_items_completed(
        self, accomplist_item_id: int, completed: bool
    ):
        try:
            # Connect to the database
            with pool.connection() as conn:
                # Get a cursor
                with conn.cursor() as cur:
                    # Execute the query to fetch matching items
                    # from my_accomplist_items table
                    cur.execute(
                        """
                        SELECT COUNT(*)
                        FROM my_accomplist_items
                        WHERE item_id = %s AND completed = %s
                        """,
                        [accomplist_item_id, completed],
                    )
                    # Fetch the count
                    count = cur.fetchone()[0]

                    return count

        except Exception as e:
            print(e)
