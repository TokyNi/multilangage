"""
API Endpoints for multilingual items management.
Handles language negotiation from query param (?lang=mg|fr|en) or Accept-Language header.
"""
from typing import Optional
from fastapi import APIRouter, Header, HTTPException, Query, status
from backend.app.schemas.item import (
    ItemActionResponse,
    ItemCreate,
    ItemListResponse,
    ItemUpdate,
    LocalizedItemResponse
)
from backend.app.services.item_service import item_service
from backend.app.core.translations import normalize_language, get_translation

router = APIRouter(prefix="/items", tags=["Items"])


def resolve_language(lang_query: Optional[str], accept_header: Optional[str]) -> str:
    """Prioritizes explicit query param over Accept-Language header."""
    if lang_query:
        return normalize_language(lang_query)
    if accept_header:
        return normalize_language(accept_header)
    return "fr"


@router.get("", response_model=ItemListResponse)
def list_items(
    lang: Optional[str] = Query(None, description="Language code ('fr', 'en', 'mg')"),
    search: Optional[str] = Query(None, description="Search keyword in any language"),
    category: Optional[str] = Query(None, description="Category filter"),
    accept_language: Optional[str] = Header(None, alias="Accept-Language")
):
    selected_lang = resolve_language(lang, accept_language)
    items, norm_lang, lang_name = item_service.get_all(
        lang=selected_lang,
        search=search,
        category=category
    )
    message = get_translation("welcome", norm_lang)
    return ItemListResponse(
        total=len(items),
        language=norm_lang,
        language_name=lang_name,
        message=message,
        items=items
    )


@router.get("/stats")
def get_items_stats(
    lang: Optional[str] = Query(None),
    accept_language: Optional[str] = Header(None, alias="Accept-Language")
):
    selected_lang = resolve_language(lang, accept_language)
    return item_service.get_stats(lang=selected_lang)


@router.get("/{item_id}", response_model=LocalizedItemResponse)
def get_item(
    item_id: int,
    lang: Optional[str] = Query(None),
    accept_language: Optional[str] = Header(None, alias="Accept-Language")
):
    selected_lang = resolve_language(lang, accept_language)
    item = item_service.get_by_id(item_id, lang=selected_lang)
    if not item:
        err_msg = get_translation("item_not_found", selected_lang)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=err_msg
        )
    return item


@router.post("", response_model=ItemActionResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    item_in: ItemCreate,
    lang: Optional[str] = Query(None),
    accept_language: Optional[str] = Header(None, alias="Accept-Language")
):
    selected_lang = resolve_language(lang, accept_language)
    created = item_service.create(item_in, lang=selected_lang)
    msg = get_translation("item_created", selected_lang)
    return ItemActionResponse(
        success=True,
        message=msg,
        language=selected_lang,
        item=created
    )


@router.put("/{item_id}", response_model=ItemActionResponse)
def update_item(
    item_id: int,
    item_in: ItemUpdate,
    lang: Optional[str] = Query(None),
    accept_language: Optional[str] = Header(None, alias="Accept-Language")
):
    selected_lang = resolve_language(lang, accept_language)
    updated = item_service.update(item_id, item_in, lang=selected_lang)
    if not updated:
        err_msg = get_translation("item_not_found", selected_lang)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=err_msg
        )
    msg = get_translation("item_updated", selected_lang)
    return ItemActionResponse(
        success=True,
        message=msg,
        language=selected_lang,
        item=updated
    )


@router.delete("/{item_id}", response_model=ItemActionResponse)
def delete_item(
    item_id: int,
    lang: Optional[str] = Query(None),
    accept_language: Optional[str] = Header(None, alias="Accept-Language")
):
    selected_lang = resolve_language(lang, accept_language)
    success = item_service.delete(item_id)
    if not success:
        err_msg = get_translation("item_not_found", selected_lang)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=err_msg
        )
    msg = get_translation("item_deleted", selected_lang)
    return ItemActionResponse(
        success=True,
        message=msg,
        language=selected_lang,
        item=None
    )
