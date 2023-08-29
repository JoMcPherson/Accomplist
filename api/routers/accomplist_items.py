from fastapi import APIRouter, Depends, Response
from typing import List, Union, Optional
from queries.accomplist_items import (
    AccomplistItemIn,
    AccomplistItemOut,
    AccomplistItemRepository,
    Error,
)

router = APIRouter()


@router.post("/api/accomplist_items", response_model=AccomplistItemOut)
def create_accomplist_item(
    accomplist_item: AccomplistItemIn,
    repo: AccomplistItemRepository = Depends(),
) -> AccomplistItemOut:
    return repo.create(accomplist_item)


@router.get(
    "/api/accomplist_items",
    response_model=Union[List[AccomplistItemOut], Error],
)
def get_all(
    repo: AccomplistItemRepository = Depends(),
) -> Union[List[AccomplistItemOut], Error]:
    return repo.get_all()


@router.put(
    "/api/accomplist_items/{accomplist_item_id}",
    response_model=Union[Error, AccomplistItemOut],
)
def update_accomplist_item(
    accomplist_item_id: int,
    accomplist_item: AccomplistItemIn,
    repo: AccomplistItemRepository = Depends(),
) -> Union[Error, AccomplistItemOut]:
    return repo.update(accomplist_item_id, accomplist_item)


@router.delete(
    "/api/accomplist_items/{accomplist_item_id}", response_model=bool
)
def delete_accomplist_item(
    accomplist_item_id: int,
    repo: AccomplistItemRepository = Depends(),
) -> bool:
    return repo.delete(accomplist_item_id)


@router.get(
    "/api/accomplist_items/{accomplist_item_id}",
    response_model=Optional[AccomplistItemOut],
)
def get_accomplist_item(
    accomplist_item_id: int,
    response: Response,
    repo: AccomplistItemRepository = Depends(),
) -> Optional[AccomplistItemOut]:
    accomplist_item = repo.get_accomplist_item(accomplist_item_id)
    if accomplist_item is None:
        response.status_code = 404
    return accomplist_item

# Get count of how many people have completed
@router.get(
    "/api/accomplist_items/{accomplist_item_id}/{completed}",
    response_model=Optional[int],
)
def get_my_accomplist_items_completed(
    accomplist_item_id: int,
    completed:bool,
    response: Response,
    repo: AccomplistItemRepository = Depends(),
) -> int:
    accomplist_item_count = repo.get_my_accomplist_items_completed(accomplist_item_id, completed)
    if accomplist_item_count is None:
        response.status_code = 404
    return accomplist_item_count
