"""
Multilingual core translations and language normalization for FastAPI backend.
Supports Malagasy (mg), French (fr), and English (en).
"""
from typing import Dict, Optional

SUPPORTED_LANGUAGES = {"fr", "en", "mg"}
DEFAULT_LANGUAGE = "fr"

LANGUAGE_NAMES = {
    "mg": "Malagasy",
    "fr": "Français",
    "en": "English"
}

TRANSLATION_CATALOG: Dict[str, Dict[str, str]] = {
    "welcome": {
        "mg": "Tongasoa eto amin'ny API Multilangage (FastAPI)",
        "fr": "Bienvenue sur l'API Multilingue (FastAPI)",
        "en": "Welcome to the Multilingual API (FastAPI)"
    },
    "health_ok": {
        "mg": "Mandeha tsara sy milamina ny tolotra backend",
        "fr": "Le service backend fonctionne parfaitement",
        "en": "Backend service is operating smoothly"
    },
    "item_not_found": {
        "mg": "Tsy hita ilay entana nangatahana",
        "fr": "Article introuvable",
        "en": "Item not found"
    },
    "item_created": {
        "mg": "Voatahiry soa aman-tsara ny entana vaovao",
        "fr": "Nouvel article créé avec succès",
        "en": "New item created successfully"
    },
    "item_updated": {
        "mg": "Voavao soa aman-tsara ny mombamomba ny entana",
        "fr": "Article mis à jour avec succès",
        "en": "Item updated successfully"
    },
    "item_deleted": {
        "mg": "Voafafa soa aman-tsara ilay entana",
        "fr": "Article supprimé avec succès",
        "en": "Item deleted successfully"
    },
    "category_spices": {
        "mg": "Zava-manitra",
        "fr": "Épices et Aromates",
        "en": "Spices and Aromatics"
    },
    "category_handicraft": {
        "mg": "Asa tanana nentim-paharazana",
        "fr": "Artisanat traditionnel",
        "en": "Traditional Handicraft"
    },
    "category_textile": {
        "mg": "Lamba sy landy",
        "fr": "Textile et Soie",
        "en": "Textiles and Silk"
    },
    "category_coffee": {
        "mg": "Kafe sy dite",
        "fr": "Café et Infusions",
        "en": "Coffee and Tea"
    },
    "category_tech": {
        "mg": "Teknolojia sy nomerika",
        "fr": "Technologie & Numérique",
        "en": "Technology & Digital"
    }
}


def normalize_language(lang_input: Optional[str]) -> str:
    """
    Parses and normalizes a language input string from query param or Accept-Language header.
    Defaults to 'fr' if not found or unsupported.
    """
    if not lang_input:
        return DEFAULT_LANGUAGE

    # Clean and split header if comma-separated (e.g. 'mg,fr;q=0.9,en;q=0.8')
    candidates = lang_input.split(",")
    for candidate in candidates:
        code = candidate.split(";")[0].strip().lower()
        # Extract primary subtag (e.g., 'fr-FR' -> 'fr', 'en-US' -> 'en')
        primary = code.split("-")[0]
        if primary in SUPPORTED_LANGUAGES:
            return primary

    return DEFAULT_LANGUAGE


def get_translation(key: str, lang: str = DEFAULT_LANGUAGE) -> str:
    """
    Retrieves the translation for a key and language, falling back to French, then English.
    """
    lang_code = normalize_language(lang)
    entry = TRANSLATION_CATALOG.get(key)
    if not entry:
        return key

    return entry.get(lang_code) or entry.get(DEFAULT_LANGUAGE) or entry.get("en") or key
