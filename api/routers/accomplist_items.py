from fastapi import APIRouter, Depends
from typing import List, Union
from queries.accomplist_items import (
    AccomplistItemIn,
    AccomplistItemOut,
    AccomplistItemRepository,
    Error,
)

router = APIRouter()


@router.post("/accomplist_items",
             response_model=AccomplistItemOut)
def create_accomplist_item(
    accomplist_item: AccomplistItemIn,
    repo: AccomplistItemRepository = Depends(),
):
    return repo.create(accomplist_item)


@router.get("/accomplist_items",
            response_model=Union[List[AccomplistItemOut], Error])
def get_all(repo: AccomplistItemRepository = Depends()):
    return repo.get_all()
