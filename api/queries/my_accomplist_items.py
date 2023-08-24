from pydantic import BaseModel
from typing import Optional, Union, List
from queries.pool import pool


class Error(BaseModel):
    message: str


class MyAccomplistItemIn(BaseModel):
    item_id: int
    user_id: int
    completed: bool


class MyAccomplistItemOut(BaseModel):
    id: int
    item_id: int
    user_id: int
    completed: bool
    item_title: str
    username: str


class MyAccomplistItemRepository:
    def get_title_by_id(self, item_id: int) -> str:
        try:
            # connect to the database
            with pool.connection() as conn:
                # get a cursor
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT title
                        FROM accomplist_items
                        WHERE id = %s
                        """,
                        [item_id],
                    )
                    result = cur.fetchone()
                    if result:
                        return result[0]
        except Exception as e:
            print(e)
            return ""

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

    def my_accomplist_in_to_out(
        self, id: int, my_accomplist_item: MyAccomplistItemIn
    ) -> MyAccomplistItemOut:
        old_data = my_accomplist_item.dict()
        return MyAccomplistItemOut(
            id=id,
            item_id=old_data["item_id"],
            user_id=old_data["user_id"],
            completed=old_data["completed"],
            item_title=self.get_title_by_id(old_data["item_id"]),
            username=self.get_username_by_id(old_data["user_id"]),
        )

    def record_to_my_accomplist_item_out(self, record) -> MyAccomplistItemOut:
        return MyAccomplistItemOut(
            id=record[0],
            item_id=record[1],
            user_id=record[2],
            completed=record[3],
            item_title=self.get_title_by_id(record[1]),
            username=self.get_username_by_id(record[2]),
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
                               item_id,
                               user_id,
                               completed
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
                        SET item_id = %s,
                            user_id = %s,
                            completed = %s
                        WHERE id = %s
                        """,
                        [
                            my_accomplist_item.item_id,
                            my_accomplist_item.user_id,
                            my_accomplist_item.completed,
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
                            item_id,
                            user_id,
                            completed
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
                    cur.execute(
                        """
                        INSERT INTO my_accomplist_items
                            (item_id,
                             user_id,
                             completed)
                        VALUES
                            (%s, %s, %s)
                        RETURNING id;
                        """,
                        [
                            my_accomplist_item.item_id,
                            my_accomplist_item.user_id,
                            my_accomplist_item.completed,
                        ],
                    )

                    id = cur.fetchone()[0]
                    # Return new data
                    return self.my_accomplist_in_to_out(id, my_accomplist_item)
        except Exception as e:
            print(e)
            return Error(message="could not create my accomplist item")
