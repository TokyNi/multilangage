"""
Data model definition for Item in backend/app/models/item.py.
Supports storage of multilingual fields (French, Malagasy, English).
"""
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional


@dataclass
class ItemModel:
    id: int
    name_fr: str
    name_en: str
    name_mg: str
    description_fr: str
    description_en: str
    description_mg: str
    category: str
    price: float
    currency: str = "EUR"
    in_stock: bool = True
    image_url: Optional[str] = None
    rating: float = 4.8
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_localized_dict(self, lang: str = "fr") -> dict:
        """
        Convert to a localized dictionary based on chosen language ('fr', 'en', 'mg').
        """
        lang = lang.lower()
        if lang == "mg":
            name = self.name_mg
            description = self.description_mg
        elif lang == "en":
            name = self.name_en
            description = self.description_en
        else:
            name = self.name_fr
            description = self.description_fr

        return {
            "id": self.id,
            "name": name,
            "description": description,
            "category": self.category,
            "price": self.price,
            "currency": self.currency,
            "in_stock": self.in_stock,
            "image_url": self.image_url,
            "rating": self.rating,
            "language": lang,
            "translations": {
                "fr": {"name": self.name_fr, "description": self.description_fr},
                "en": {"name": self.name_en, "description": self.description_en},
                "mg": {"name": self.name_mg, "description": self.description_mg},
            },
            "created_at": self.created_at.isoformat()
        }
