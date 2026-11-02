"""
Tests for multilingual FastAPI backend endpoints.
Verifies Malagasy, French, and English responses.
"""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_multilingual_responses():
    # Test French (default)
    res_fr = client.get("/")
    assert res_fr.status_code == 200
    assert res_fr.json()["language"] == "fr"
    assert "Bienvenue" in res_fr.json()["message"]

    # Test Malagasy
    res_mg = client.get("/?lang=mg")
    assert res_mg.status_code == 200
    assert res_mg.json()["language"] == "mg"
    assert "Tongasoa" in res_mg.json()["message"]

    # Test English
    res_en = client.get("/?lang=en")
    assert res_en.status_code == 200
    assert res_en.json()["language"] == "en"
    assert "Welcome" in res_en.json()["message"]


def test_health_check_multilingual():
    res_mg = client.get("/api/health?lang=mg")
    assert res_mg.status_code == 200
    assert "Mandeha tsara" in res_mg.json()["message"]

    res_en = client.get("/api/health?lang=en")
    assert res_en.status_code == 200
    assert "operating smoothly" in res_en.json()["message"]


def test_list_items_in_malagasy():
    res = client.get("/api/items?lang=mg")
    assert res.status_code == 200
    data = res.json()
    assert data["language"] == "mg"
    assert len(data["items"]) > 0
    # First item should have Malagasy name
    first_item = data["items"][0]
    assert "Lavanila" in first_item["name"]


def test_list_items_in_english():
    res = client.get("/api/items?lang=en")
    assert res.status_code == 200
    data = res.json()
    assert data["language"] == "en"
    first_item = data["items"][0]
    assert "Madagascar Bourbon Vanilla" in first_item["name"]


def test_list_items_in_french():
    res = client.get("/api/items?lang=fr")
    assert res.status_code == 200
    data = res.json()
    assert data["language"] == "fr"
    first_item = data["items"][0]
    assert "Vanille Bourbon de Madagascar" in first_item["name"]


def test_accept_language_header_negotiation():
    # Accept-Language: mg
    res = client.get("/api/items", headers={"Accept-Language": "mg-MG,mg;q=0.9"})
    assert res.status_code == 200
    assert res.json()["language"] == "mg"


def test_create_and_delete_item():
    new_item = {
        "name_fr": "Chocolat Noir d'Ambanja",
        "name_en": "Ambanja Single Origin Dark Chocolate",
        "name_mg": "Sôkôla Mainty avy any Ambanja",
        "description_fr": "Chocolat grand cru 75% cacao de la vallée du Sambirano.",
        "description_en": "Single origin 75% dark chocolate from Sambirano Valley.",
        "description_mg": "Sôkôla voakaly tsara 75% kakao avy ao Sambirano.",
        "category": "gastronomy",
        "price": 6.50,
        "currency": "EUR",
        "in_stock": True,
        "rating": 5.0
    }

    create_res = client.post("/api/items?lang=mg", json=new_item)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["success"] is True
    assert "Voatahiry" in created_data["message"]
    item_id = created_data["item"]["id"]

    # Verify localized fetch in English
    fetch_res = client.get(f"/api/items/{item_id}?lang=en")
    assert fetch_res.status_code == 200
    assert fetch_res.json()["name"] == "Ambanja Single Origin Dark Chocolate"

    # Delete
    del_res = client.delete(f"/api/items/{item_id}?lang=fr")
    assert del_res.status_code == 200
    assert "supprimé avec succès" in del_res.json()["message"]
