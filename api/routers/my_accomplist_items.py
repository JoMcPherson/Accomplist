from fastapi import APIRouter, Depends, Response
from typing import List, Union, Optional
from queries.my_accomplist_items import (
    MyAccomplistItemIn,
    MyAccomplistItemOut,
    MyAccomplistItemRepository,
    Error,
)

router = APIRouter()


@router.post("/my_accomplist_items", response_model=MyAccomplistItemOut)
def create_my_accomplist_item(
    my_accomplist_item: MyAccomplistItemIn,
    repo: MyAccomplistItemRepository = Depends(),
) -> MyAccomplistItemOut:
    return repo.create(my_accomplist_item)


@router.get(
    "/my_accomplist_items",
    response_model=Union[List[MyAccomplistItemOut], Error],
)
def get_all(
    repo: MyAccomplistItemRepository = Depends(),
) -> Union[List[MyAccomplistItemOut], Error]:
    return repo.get_all()


@router.put(
    "/my_accomplist_items/{my_accomplist_item_id}",
    response_model=Union[Error, MyAccomplistItemOut],
)
def update_my_accomplist_item(
    my_accomplist_item_id: int,
    my_accomplist_item: MyAccomplistItemIn,
    repo: MyAccomplistItemRepository = Depends(),
) -> Union[Error, MyAccomplistItemOut]:
    return repo.update(my_accomplist_item_id, my_accomplist_item)


@router.delete(
    "/my_accomplist_items/{my_accomplist_item_id}", response_model=bool
)
def delete_my_accomplist_item(
    my_accomplist_item_id: int,
    repo: MyAccomplistItemRepository = Depends(),
) -> bool:
    return repo.delete(my_accomplist_item_id)


@router.get(
    "/my_accomplist_items/{my_accomplist_item_id}",
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
