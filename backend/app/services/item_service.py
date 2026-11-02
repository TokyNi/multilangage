"""
Business logic and in-memory persistence service for multilingual items.
"""
from typing import List, Optional, Tuple
from datetime import datetime, timezone
from backend.app.models.item import ItemModel
from backend.app.schemas.item import ItemCreate, ItemUpdate, LocalizedItemResponse
from backend.app.core.translations import normalize_language, get_translation, LANGUAGE_NAMES


class ItemService:
    def __init__(self):
        self._items: List[ItemModel] = []
        self._next_id: int = 1
        self._seed_initial_data()

    def _seed_initial_data(self):
        sample_items = [
            {
                "name_fr": "Vanille Bourbon de Madagascar",
                "name_en": "Madagascar Bourbon Vanilla",
                "name_mg": "Lavanila Bourbon avy eto Madagasikara",
                "description_fr": "Gousses de vanille gourmet d'exception, cultivées dans la région de la SAVA. Arôme intense, boisé et délicatement sucré.",
                "description_en": "Premium gourmet vanilla beans grown in the lush SAVA region. Rich, woody, and intensely aromatic with sweet notes.",
                "description_mg": "Gousse lavanila voafantina manokana avy any amin'ny faritra SAVA. Manitra tsara, madio sy avo lenta indrindra.",
                "category": "spices",
                "price": 28.50,
                "currency": "EUR",
                "in_stock": True,
                "rating": 4.95,
                "image_url": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name_fr": "Poivre Sauvage Voatsiperifery",
                "name_en": "Voatsiperifery Wild Pepper",
                "name_mg": "Dipoavatra Ala Voatsiperifery",
                "description_fr": "Poivre sauvage rare récolté à la cime des arbres des forêts primaires malgaches. Notes florales, résineuses et d'agrumes.",
                "description_en": "Rare wild pepper harvested from tree tops in Madagascar's primary rainforests. Notes of flowers, cedar wood, and citrus.",
                "description_mg": "Dipoavatra dia vaozan'ny ala atsinanana. Manana tsiro miavaka sy fofona manokana mampavitrika.",
                "category": "spices",
                "price": 14.90,
                "currency": "EUR",
                "in_stock": True,
                "rating": 4.88,
                "image_url": "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name_fr": "Écharpe en Soie Sauvage Landy",
                "name_en": "Landy Wild Silk Handwoven Scarf",
                "name_mg": "Lamba Landy nentin-drazana",
                "description_fr": "Tissée à la main selon les techniques séculaires des Hauts-Plateaux. Douceur incomparable et reflets ambrés naturels.",
                "description_en": "Handcrafted on traditional wooden looms in the central highlands. Unrivaled softness and rich organic luster.",
                "description_mg": "Lamba vita amin'ny kofehin-dandy natoraly nozarina tamin'ny fomba nentim-paharazana. Malemy, tsara tarehy sady mafy.",
                "category": "textile",
                "price": 65.00,
                "currency": "EUR",
                "in_stock": True,
                "rating": 4.92,
                "image_url": "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name_fr": "Panier Artisanal en Rabane et Raphia",
                "name_en": "Handmade Raffia & Rabane Tote",
                "name_mg": "Harona Raphia sy Rarabana",
                "description_fr": "Tressé avec passion à partir de fibres naturelles de raphia récoltées durablement. Élégant et résistant au quotidien.",
                "description_en": "Expertly woven by local artisans using sustainably harvested raffia palm fibers. Stylish, lightweight, and durable.",
                "description_mg": "Harona kanto namboarin'ireo mpanao asa tanana tamin'ny rofia natoraly. Mateza, azo entina na aiza na aiza.",
                "category": "handicraft",
                "price": 34.00,
                "currency": "EUR",
                "in_stock": True,
                "rating": 4.79,
                "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name_fr": "Café Arabica Bourbon Pointu",
                "name_en": "Bourbon Pointu Arabica Coffee",
                "name_mg": "Kafe Arabica Bourbon Pointu",
                "description_fr": "Café de haute altitude d'une finesse incomparable, torréfié artisanalement. Notes de cacao doux et fruits rouges.",
                "description_en": "High-altitude specialty coffee roasted in small batches. Notes of gentle cocoa, subtle florals, and red berries.",
                "description_mg": "Kafe avo lenta nambolena tamin'ny toerana avo. Tsy dia mangidy, manitra ary manome hery mahafinaritra.",
                "category": "coffee",
                "price": 18.20,
                "currency": "EUR",
                "in_stock": True,
                "rating": 4.85,
                "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name_fr": "Huile Précieuse de Baobab & Moringa",
                "name_en": "Baobab & Moringa Organic Elixir",
                "name_mg": "Menaka Baobab sy Moringa natoraly",
                "description_fr": "Sérum botanique 100% pur pressé à froid dans le sud de l'île. Riche en vitamines A, E et acides gras essentiels.",
                "description_en": "100% pure cold-pressed botanical oil sourced from southern Madagascar. Rich in vitamins A, E, and essential omegas.",
                "description_mg": "Menaka natoraly voatsindry mangatsiaka avy amin'ny voan'ny Baobab sy Moringa. Mamelona ny hoditra sy ny volo.",
                "category": "handicraft",
                "price": 22.00,
                "currency": "EUR",
                "in_stock": False,
                "rating": 4.90,
                "image_url": "https://images.unsplash.com/photo-1608248597359-247514197938?auto=format&fit=crop&w=600&q=80"
            }
        ]

        for item_data in sample_items:
            item = ItemModel(
                id=self._next_id,
                name_fr=item_data["name_fr"],
                name_en=item_data["name_en"],
                name_mg=item_data["name_mg"],
                description_fr=item_data["description_fr"],
                description_en=item_data["description_en"],
                description_mg=item_data["description_mg"],
                category=item_data["category"],
                price=item_data["price"],
                currency=item_data["currency"],
                in_stock=item_data["in_stock"],
                rating=item_data["rating"],
                image_url=item_data["image_url"],
                created_at=datetime.now(timezone.utc)
            )
            self._items.append(item)
            self._next_id += 1

    def _format_item(self, item: ItemModel, lang: str) -> LocalizedItemResponse:
        norm_lang = normalize_language(lang)
        localized = item.to_localized_dict(norm_lang)
        cat_key = f"category_{item.category}"
        cat_localized = get_translation(cat_key, norm_lang)
        if cat_localized == cat_key:
            cat_localized = item.category.capitalize()

        return LocalizedItemResponse(
            id=localized["id"],
            name=localized["name"],
            description=localized["description"],
            category=localized["category"],
            category_localized=cat_localized,
            price=localized["price"],
            currency=localized["currency"],
            in_stock=localized["in_stock"],
            image_url=localized["image_url"],
            rating=localized["rating"],
            language=norm_lang,
            translations=localized["translations"],
            created_at=localized["created_at"]
        )

    def get_all(
        self,
        lang: str = "fr",
        search: Optional[str] = None,
        category: Optional[str] = None
    ) -> Tuple[List[LocalizedItemResponse], str, str]:
        norm_lang = normalize_language(lang)
        lang_name = LANGUAGE_NAMES.get(norm_lang, "Français")

        results = self._items
        if category and category.lower() != "all":
            results = [i for i in results if i.category.lower() == category.lower()]

        if search:
            query = search.strip().lower()
            results = [
                i for i in results
                if query in i.name_fr.lower()
                or query in i.name_en.lower()
                or query in i.name_mg.lower()
                or query in i.description_fr.lower()
                or query in i.description_en.lower()
                or query in i.description_mg.lower()
            ]

        formatted = [self._format_item(i, norm_lang) for i in results]
        return formatted, norm_lang, lang_name

    def get_by_id(self, item_id: int, lang: str = "fr") -> Optional[LocalizedItemResponse]:
        for item in self._items:
            if item.id == item_id:
                return self._format_item(item, lang)
        return None

    def create(self, item_in: ItemCreate, lang: str = "fr") -> LocalizedItemResponse:
        item = ItemModel(
            id=self._next_id,
            name_fr=item_in.name_fr,
            name_en=item_in.name_en,
            name_mg=item_in.name_mg,
            description_fr=item_in.description_fr,
            description_en=item_in.description_en,
            description_mg=item_in.description_mg,
            category=item_in.category,
            price=item_in.price,
            currency=item_in.currency,
            in_stock=item_in.in_stock,
            rating=item_in.rating,
            image_url=item_in.image_url or "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
            created_at=datetime.now(timezone.utc)
        )
        self._next_id += 1
        self._items.append(item)
        return self._format_item(item, lang)

    def update(self, item_id: int, item_in: ItemUpdate, lang: str = "fr") -> Optional[LocalizedItemResponse]:
        for item in self._items:
            if item.id == item_id:
                if item_in.name_fr is not None:
                    item.name_fr = item_in.name_fr
                if item_in.name_en is not None:
                    item.name_en = item_in.name_en
                if item_in.name_mg is not None:
                    item.name_mg = item_in.name_mg
                if item_in.description_fr is not None:
                    item.description_fr = item_in.description_fr
                if item_in.description_en is not None:
                    item.description_en = item_in.description_en
                if item_in.description_mg is not None:
                    item.description_mg = item_in.description_mg
                if item_in.category is not None:
                    item.category = item_in.category
                if item_in.price is not None:
                    item.price = item_in.price
                if item_in.currency is not None:
                    item.currency = item_in.currency
                if item_in.in_stock is not None:
                    item.in_stock = item_in.in_stock
                if item_in.image_url is not None:
                    item.image_url = item_in.image_url
                if item_in.rating is not None:
                    item.rating = item_in.rating
                return self._format_item(item, lang)
        return None

    def delete(self, item_id: int) -> bool:
        for idx, item in enumerate(self._items):
            if item.id == item_id:
                del self._items[idx]
                return True
        return False

    def get_stats(self, lang: str = "fr") -> dict:
        norm_lang = normalize_language(lang)
        total = len(self._items)
        in_stock = sum(1 for i in self._items if i.in_stock)
        categories = list({i.category for i in self._items})
        return {
            "total_items": total,
            "in_stock_items": in_stock,
            "out_of_stock": total - in_stock,
            "categories_count": len(categories),
            "language": norm_lang,
            "supported_languages": ["fr", "en", "mg"]
        }


# Singleton service instance
item_service = ItemService()
