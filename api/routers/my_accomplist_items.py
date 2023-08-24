from fastapi import APIRouter, Depends, Response
from typing import List, Union, Optional
from queries.authenticator import authenticator

from queries.my_accomplist_items import (
    MyAccomplistItemIn,
    MyAccomplistItemOut,
    MyAccomplistItemRepository,
    Error,
)

router = APIRouter()


@router.post("/api/my_accomplist_items", response_model=MyAccomplistItemOut)
def create_my_accomplist_item(
    my_accomplist_item: MyAccomplistItemIn,
    repo: MyAccomplistItemRepository = Depends(),
) -> MyAccomplistItemOut:
    return repo.create(my_accomplist_item)



@router.get(
    "/api/my_accomplist_items/{account_id}",
    response_model=Union[List[MyAccomplistItemOut], Error],
)
async def get_items_for_account(
    account_id: int,
    repo: MyAccomplistItemRepository = Depends(),
    account_data: dict | None = Depends(authenticator.try_get_current_account_data)
) -> Union[List[MyAccomplistItemOut], Error]:
    items = repo.get_all()
    filtered_items = [item for item in items if item.user_id == account_id]
    return filtered_items

@router.put(
    "/api/my_accomplist_items/{my_accomplist_item_id}",
    response_model=Union[Error, MyAccomplistItemOut],
)
def update_my_accomplist_item(
    my_accomplist_item_id: int,
    my_accomplist_item: MyAccomplistItemIn,
    repo: MyAccomplistItemRepository = Depends(),
) -> Union[Error, MyAccomplistItemOut]:
    return repo.update(my_accomplist_item_id, my_accomplist_item)


@router.delete(
    "/api/my_accomplist_items/{my_accomplist_item_id}", response_model=bool
)
def delete_my_accomplist_item(
    my_accomplist_item_id: int,
    repo: MyAccomplistItemRepository = Depends(),
) -> bool:
    return repo.delete(my_accomplist_item_id)


@router.get(
    "/api/my_accomplist_items/{my_accomplist_item_id}",
    response_model=Optional[MyAccomplistItemOut],
)
def get_my_accomplist_item(
    my_accomplist_item_id: int,
    response: Response,
    repo: MyAccomplistItemRepository = Depends(),
) -> Optional[MyAccomplistItemOut]:
    my_accomplist_item = repo.get_my_accomplist_item(my_accomplist_item_id)
    if my_accomplist_item is None:
        response.status_code = 404
        return my_accomplist_item
