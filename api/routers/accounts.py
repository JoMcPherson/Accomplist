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
    UpdateAccount,
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


@router.get("/api/accounts/{account_id}", response_model=Optional[AccountOut])
def get_user_by_id(
    account_id: int,
    response: Response,
    repo: AccountRepo = Depends(),
    account: dict = Depends(authenticator.get_current_account_data),
) -> AccountOut:
    account = repo.get_user_by_id(account_id)
    if account is None:
        response.status_code = 404
    return account


@router.get(
    "/api/accounts/user/{username}", response_model=Optional[AccountOut]
)
def get_user_by_username(
    username: str,
    response: Response,
    repo: AccountRepo = Depends(),
    public_account: dict = Depends(authenticator.get_current_account_data),
) -> AccountOut:
    public_account = repo.get_user_by_username(username)
    if public_account is None:
        response.status_code = 404
    return public_account


@router.get("/api/accounts", response_model=List[AccountOut])
def get_or_search_accounts(
    query: Optional[str] = None,
    repo: AccountRepo = Depends(),
    # account: dict = Depends(authenticator.get_current_account_data),
):
    if query:
        return repo.search_accounts(query)
    return repo.get_all_accounts()


@router.delete("/api/accounts/{account_id}", response_model=bool)
def delete_user(account_id: int, repo: AccountRepo = Depends()) -> bool:
    return repo.delete_user(account_id)


@router.put("/api/accounts/{user_id}", response_model=AccountOut)
def update_account(
    user_id: int,
    updated_data: AccountIn,
    repo: AccountRepo = Depends(),
    account: dict = Depends(authenticator.get_current_account_data),
) -> AccountOut:
    try:
        updated_account = repo.update_user(user_id, updated_data)
        return updated_account
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/api/accounts/{account_id}", response_model=AccountOut)
def patch_account_bio(
    account_id: int,
    update_data: UpdateAccount,
    account: dict = Depends(authenticator.get_current_account_data),
):
    account_repo = AccountRepo()
    return account_repo.patch_bio(account_id, update_data)

# leaving just in case something bad happens
# @router.get("/api/accounts", response_model=List[AccountOut])
# def get_all_accounts(
#     repo: AccountRepo = Depends(),
#     account: dict = Depends(authenticator.get_current_account_data),
# ):
#     accounts = repo.get_all_accounts()
#     return accounts
