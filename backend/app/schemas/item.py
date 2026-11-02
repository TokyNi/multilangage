"""
Pydantic schemas for data validation and API responses.
"""
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class LanguageEnum(str, Enum):
    FRENCH = "fr"
    ENGLISH = "en"
    MALAGASY = "mg"


class TranslationPair(BaseModel):
    name: str
    description: str


class ItemCreate(BaseModel):
    name_fr: str = Field(..., min_length=2, max_length=150, description="Nom en Français")
    name_en: str = Field(..., min_length=2, max_length=150, description="Name in English")
    name_mg: str = Field(..., min_length=2, max_length=150, description="Anarana amin'ny teny Malagasy")
    description_fr: str = Field(..., min_length=5, description="Description en Français")
    description_en: str = Field(..., min_length=5, description="Description in English")
    description_mg: str = Field(..., min_length=5, description="Famaritana amin'ny teny Malagasy")
    category: str = Field("spices", description="Category identifier (e.g. spices, handicraft, coffee)")
    price: float = Field(..., gt=0, description="Price in EUR or primary currency")
    currency: str = Field("EUR", max_length=5)
    in_stock: bool = True
    image_url: Optional[str] = None
    rating: float = Field(5.0, ge=0.0, le=5.0)


class ItemUpdate(BaseModel):
    name_fr: Optional[str] = None
    name_en: Optional[str] = None
    name_mg: Optional[str] = None
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    description_mg: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    in_stock: Optional[bool] = None
    image_url: Optional[str] = None
    rating: Optional[float] = None


class LocalizedItemResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str
    category_localized: str
    price: float
    currency: str
    in_stock: bool
    image_url: Optional[str] = None
    rating: float
    language: str
    translations: Dict[str, TranslationPair]
    created_at: str


class ItemListResponse(BaseModel):
    total: int
    language: str
    language_name: str
    message: str
    items: List[LocalizedItemResponse]


class ItemActionResponse(BaseModel):
    success: bool
    message: str
    language: str
    item: Optional[LocalizedItemResponse] = None
