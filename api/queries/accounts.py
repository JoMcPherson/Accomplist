from pydantic import BaseModel
from jwtdown_fastapi.authentication import Token
from psycopg_pool import ConnectionPool
import os
from typing import List, Optional
from fastapi import HTTPException


class Account(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str
    date_created: str
    bio: str
    photo: str


class UpdateAccount(BaseModel):
    photo: Optional[str] = None
    bio: Optional[str] = None


class AccountOut(Account):
    id: int


class AccountOutWithPassword(AccountOut):
    hashed_password: str


class AccountIn(Account):
    password: str


class AccountToken(Token):
    account: AccountOut


class AuthenticationException(Exception):
    pass


class DuplicateAccountError(ValueError):
    pass


pool = ConnectionPool(conninfo=os.environ["DATABASE_URL"])


class AccountRepo:
    def get_user_by_id(self, pk: int) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, first_name, last_name, email,
                    date_created, bio, photo
                    date_created, bio, photo
                    FROM user_accounts
                    WHERE id = %s;
                    """,
                    [pk],
                )
                ac = cur.fetchone()
                if ac is None:
                    raise AuthenticationException("Account not found")
                else:
                    try:
                        return AccountOut(
                            id=ac[0],
                            username=ac[1],
                            first_name=ac[2],
                            last_name=ac[3],
                            email=ac[4],
                            date_created=ac[5].isoformat(),
                            bio=ac[6],
                            photo=ac[7],
                        )
                    except Exception as e:
                        raise Exception("Error:", e)

    def get_user_by_username(self, username: str) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, first_name, last_name, email,
                    date_created, bio, photo
                    FROM user_accounts
                    WHERE username = %s;
                    """,
                    [username],
                )
                ac = cur.fetchone()
                if ac is None:
                    raise AuthenticationException("Account not found")
                else:
                    try:
                        return AccountOut(
                            id=ac[0],
                            username=ac[1],
                            first_name=ac[2],
                            last_name=ac[3],
                            email=ac[4],
                            date_created=ac[5].isoformat(),
                            bio=ac[6],
                            photo=ac[7],
                        )
                    except Exception as e:
                        raise Exception("Error:", e)

    def get(self, username: str) -> AccountOutWithPassword | None:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, first_name, last_name, email,
                    date_created, bio, photo, hashed_password
                    FROM user_accounts
                    WHERE username = %s;
                    """,
                    [username],
                )
                ac = cur.fetchone()
                if ac is None:
                    raise Exception("Account not found")
                else:
                    try:
                        print
                        return AccountOutWithPassword(
                            id=ac[0],
                            username=ac[1],
                            first_name=ac[2],
                            last_name=ac[3],
                            email=ac[4],
                            date_created=ac[5].isoformat(),
                            bio=ac[6],
                            photo=ac[7],
                            hashed_password=ac[8],
                        )
                    except Exception as e:
                        raise Exception("Error:", e)

    def create_user(
        self, account: AccountIn, hashed_password: str
    ) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                result = cur.execute(
                    """
                    INSERT INTO user_accounts
                    (username, hashed_password, first_name, last_name,
                    email, date_created, bio, photo)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING ID;
                    """,
                    (
                        account.username,
                        hashed_password,
                        account.first_name,
                        account.last_name,
                        account.email,
                        account.date_created,
                        account.bio,
                        account.photo,
                    ),
                )
                id = result.fetchone()[0]
                return AccountOut(
                    id=id,
                    username=account.username,
                    first_name=account.first_name,
                    last_name=account.last_name,
                    email=account.email,
                    date_created=account.date_created,
                    bio=account.bio,
                    photo=account.photo,
                )

    def get_all_accounts(self) -> List[AccountOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, first_name, last_name, email,
                    date_created, bio, photo
                    FROM user_accounts;
                    """
                )
                accounts = []
                for ac in cur.fetchall():
                    account = AccountOut(
                        id=ac[0],
                        username=ac[1],
                        first_name=ac[2],
                        last_name=ac[3],
                        email=ac[4],
                        date_created=ac[5].isoformat(),
                        bio=ac[6],
                        photo=ac[7],
                    )
                    accounts.append(account)
                return accounts

    def delete_user(self, pk: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM user_accounts
                    WHERE id = %s
                    RETURNING *;
                    """,
                    (pk,),
                )

    def update_user(self, pk: int, updated_data: UpdateAccount) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE user_accounts
                    SET username = %s,
                        first_name = %s,
                        last_name = %s,
                        email = %s,
                        date_created = %s,
                        bio = %s,
                        photo = %s
                    WHERE id = %s
                    RETURNING id, username, first_name, last_name, email,
                              date_created, bio, photo;
                    """,
                    (
                        updated_data.username,
                        updated_data.first_name,
                        updated_data.last_name,
                        updated_data.email,
                        updated_data.date_created,
                        updated_data.bio,
                        updated_data.photo,
                        pk,
                    ),
                )
                updated_account = cur.fetchone()
                if updated_account:
                    return AccountOut(
                        id=updated_account[0],
                        username=updated_account[1],
                        first_name=updated_account[2],
                        last_name=updated_account[3],
                        email=updated_account[4],
                        date_created=updated_account[5].isoformat(),
                        bio=updated_account[6],
                        photo=updated_account[7],
                    )
                else:
                    raise Exception("Update failed: Account not found")

    def patch_bio(self, pk: int, update_data: UpdateAccount) -> AccountOut:
        update_mappings = {
            "bio": update_data.bio,
            "photo": update_data.photo,
        }

        # Filter out None values and construct query
        update_fields = [
            f"{field} = %s"
            for field, value in update_mappings.items()
            if value is not None
        ]
        values = [
            value for value in update_mappings.values() if value is not None
        ]
        if not update_fields:  # If there's nothing to update
            raise ValueError("No valid fields provided for update.")

        values.append(pk)

        update_query = f"""
            UPDATE user_accounts
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING id, username, first_name, last_name, email,
                    date_created, bio, photo;
        """

        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(update_query, values)
                updated_account = cur.fetchone()

                if not updated_account:
                    raise HTTPException(
                        status_code=404, detail="Account not found"
                    )

                return AccountOut(
                    id=updated_account[0],
                    username=updated_account[1],
                    first_name=updated_account[2],
                    last_name=updated_account[3],
                    email=updated_account[4],
                    date_created=updated_account[5].isoformat(),
                    bio=updated_account[6],
                    photo=updated_account[7],
                )

    def search_accounts(self, query: str) -> List[AccountOut]:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, first_name, last_name, email,
                    date_created, bio, photo
                    FROM user_accounts
                    WHERE LOWER(username) LIKE LOWER(%s)
                    OR LOWER(first_name) LIKE LOWER(%s);
                    """,
                    (f"%{query}%", f"%{query}%")  # SQL parameters
                )
                accounts = []
                for ac in cur.fetchall():
                    account = AccountOut(
                        id=ac[0],
                        username=ac[1],
                        first_name=ac[2],
                        last_name=ac[3],
                        email=ac[4],
                        date_created=ac[5].isoformat(),
                        bio=ac[6],
                        photo=ac[7],
                    )
                    accounts.append(account)
                return accounts
