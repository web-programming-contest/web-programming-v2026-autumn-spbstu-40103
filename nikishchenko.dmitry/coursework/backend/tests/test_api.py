"""Тесты API. Запуск из папки backend:  pytest -v
Работают на временной копии data/, реальные заказы не затрагиваются."""
import shutil
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import main
import storage

LOGIN = {"login": "admin", "password": "gadget2024"}
ORDER = {
    "items": [{"goodId": 1, "qty": 2}, {"goodId": 33, "qty": 1}],
    "email": "me@example.com", "phone": "+7 999 123-45-67",
    "delivery": "pickup", "payment": "card", "packaging": True,
}


@pytest.fixture()
def client(tmp_path, monkeypatch):
    shutil.copytree(storage.DATA_DIR, tmp_path / "data")
    monkeypatch.setattr(storage, "DATA_DIR", tmp_path / "data")
    main.sessions.clear()
    return TestClient(main.app)


@pytest.fixture()
def auth(client):
    assert client.post("/login", json=LOGIN).status_code == 200
    return client


def test_goods_public(client):
    r = client.get("/goods")
    assert r.status_code == 200
    goods = r.json()
    assert len(goods) == 41
    assert {"id", "name", "price", "rating", "type", "color", "isNew", "isHit",
            "popularity", "createdAt", "image", "description", "specs"} <= goods[0].keys()


def test_login_wrong_password(client):
    r = client.post("/login", json={"login": "admin", "password": "nope"})
    assert r.status_code == 401
    assert "session" not in r.cookies


def test_login_unknown_user(client):
    assert client.post("/login", json={"login": "ghost", "password": "x"}).status_code == 401


def test_login_empty_fields(client):
    assert client.post("/login", json={"login": "", "password": ""}).status_code == 422


def test_session_flow(client):
    assert client.get("/me").status_code == 401
    assert client.post("/login", json=LOGIN).status_code == 200
    assert client.get("/me").json() == {"login": "admin"}
    client.post("/logout")
    assert client.get("/me").status_code == 401


def test_orders_require_auth(client):
    assert client.get("/orders").status_code == 401
    assert client.post("/orders", json=ORDER).status_code == 401


def test_seed_orders_sorted_newest_first(auth):
    orders = auth.get("/orders").json()
    assert [o["id"] for o in orders] == [567800, 436789, 405674]


def test_create_order_computes_total_on_server(auth):
    r = auth.post("/orders", json=ORDER)
    assert r.status_code == 201
    o = r.json()
    assert o["total"] == 2 * 1990 + 102099
    assert o["itemsCount"] == 3
    assert 10000 <= o["id"] <= 99999
    assert o["id"] in [x["id"] for x in auth.get("/orders").json()]


def test_client_cannot_set_price(auth):
    body = {**ORDER, "items": [{"goodId": 1, "qty": 1, "price": 1}]}
    assert auth.post("/orders", json=body).json()["total"] == 1990


def test_duplicate_items_are_merged(auth):
    body = {**ORDER, "items": [{"goodId": 1, "qty": 1}, {"goodId": 1, "qty": 2}]}
    o = auth.post("/orders", json=body).json()
    assert o["items"][0]["qty"] == 3 and len(o["items"]) == 1


def test_email_required_phone_optional(auth):
    no_phone = {k: v for k, v in ORDER.items() if k != "phone"}
    assert auth.post("/orders", json=no_phone).status_code == 201
    no_email = {k: v for k, v in ORDER.items() if k != "email"}
    assert auth.post("/orders", json=no_email).status_code == 422
    assert auth.post("/orders", json={**ORDER, "email": "not-an-email"}).status_code == 422


def test_address_required_only_for_delivery(auth):
    assert auth.post("/orders", json={**ORDER, "delivery": "delivery"}).status_code == 422
    ok = auth.post("/orders", json={**ORDER, "delivery": "delivery", "address": "СПб, Барочная 7"})
    assert ok.status_code == 201 and ok.json()["address"] == "СПб, Барочная 7"


def test_invalid_orders(auth):
    assert auth.post("/orders", json={**ORDER, "items": []}).status_code == 422
    assert auth.post("/orders", json={**ORDER, "items": [{"goodId": 9999, "qty": 1}]}).status_code == 422
    assert auth.post("/orders", json={**ORDER, "items": [{"goodId": 1, "qty": 0}]}).status_code == 422
    assert auth.post("/orders", json={**ORDER, "payment": "bitcoin"}).status_code == 422
