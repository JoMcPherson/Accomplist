import os
from fastapi import Depends
from datetime import timedelta
from jwtdown_fastapi.authentication import Authenticator
from queries.accounts import AccountQueries, AccountOut, AccountOutWithPassword


class AccountAuthenticator(Authenticator):
    async def get_account_data(
        self,
        username: str,
        accounts: AccountQueries,
    ):
        # Use your repo to get the account based on the
        # email (which could be an email)
        return accounts.get(username)

    def get_account_getter(
        self,
        accounts: AccountQueries = Depends(),
    ):
        # Return the accounts. That's it.
        return accounts

    def get_hashed_password(self, account: AccountOutWithPassword):
        # Return the encrypted password value from your
        # account object
        print("DICTIONARY", account)
        return account.__getitem__('hashed_password')

    def get_account_data_for_cookie(self, account: AccountOut):
        # Return the email and the data for the cookie.
        # You must return TWO values from this method.

        return account.get("email"), account


half_hour = timedelta(minutes=30)

authenticator = AccountAuthenticator(os.environ["SIGNING_KEY"], exp=half_hour,)
