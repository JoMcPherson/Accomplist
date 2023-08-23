from pydantic import BaseModel
from jwtdown_fastapi.authentication import Token
from psycopg_pool import ConnectionPool
import os
from typing import List


class Account(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str
    date_created: str
    bio: str
    photo: str


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

    def delete_user(self, pk: int) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM user_accounts
                    WHERE id = %s
                    RETURNING *;
                    """,
                    (pk),
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
