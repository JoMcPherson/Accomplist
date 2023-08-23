from queries.authenticator import authenticator
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Response,
    Request,
)
from jwtdown_fastapi.authentication import Token
from pydantic import BaseModel
from queries.accounts import (
    AccountIn,
    AccountOut,
    AccountRepo,
    DuplicateAccountError,
)
from typing import Optional, List


class AccountForm(BaseModel):
    username: str
    password: str


class AccountToken(Token):
    account: AccountOut


class HttpError(BaseModel):
    detail: str


router = APIRouter()


@router.post("/api/accounts", response_model=AccountToken | HttpError)
async def create_account(
    info: AccountIn,
    request: Request,
    response: Response,
    repo: AccountRepo = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = repo.create_user(info, hashed_password)
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an account with those credentials",
        )
    form = AccountForm(username=info.username, password=info.password)
    token = await authenticator.login(response, request, form, repo)
    return AccountToken(account=account, **token.dict())


@router.get("/token", response_model=AccountToken | None)
async def get_token(
    request: Request,
    account: AccountOut = Depends(authenticator.try_get_current_account_data),
) -> AccountToken | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account,
        }


@router.get("/api/accounts/{user_id}", response_model=Optional[AccountOut])
def get_user_by_id(
    user_id: int, response: Response, repo: AccountRepo = Depends()
) -> AccountOut:
    account = repo.get_user_by_id(user_id)
    if account is None:
        response.status_code = 404
    return account


@router.get("/api/accounts/", response_model=List[AccountOut])
def get_all_accounts(repo: AccountRepo = Depends()):
    accounts = repo.get_all_accounts()
    return accounts


# @router.put("/api/accounts/{user_id}")


# @router.get("/api/accounts/{user_id}")
# async def get_user(
#     user_id: int,
#     accounts: AccountRepo = Depends(),
#     ra=(authenticator.get_current_account_data),
# ) -> AccountOut:
#     try:
#         account = accounts.get_user_by_id(user_id)
#     except AuthenticationException:
#         return HTTPException(status.HTTP_401_UNAUTHORIZED)
#     return account
