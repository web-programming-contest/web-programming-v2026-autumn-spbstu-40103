"""Gadget Hub — бэкенд (FastAPI).

Запуск:  uvicorn main:app --reload --port 8000
Документация API (Swagger):  http://localhost:8000/docs
"""
import os
import re
import secrets
from typing import Literal

from fastapi import Cookie, Depends, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator
from starlette.concurrency import run_in_threadpool

import storage
from security import hash_password, verify_password

SESSION_COOKIE = "session"
SESSION_TTL = 7 * 24 * 3600

ALLOWED_ORIGINS = [
    "http://localhost:5173", "http://127.0.0.1:5173",
    "http://localhost:4173", "http://127.0.0.1:4173",
    "http://localhost:3000", "http://127.0.0.1:3000",
] + [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]

app = FastAPI(title="Gadget Hub API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions: dict[str, str] = {}

_DUMMY_SALT = "00" * 16
_DUMMY_HASH = "00" * 32


class LoginIn(BaseModel):
    login: str = Field(min_length=1)
    password: str = Field(min_length=1)


class RegisterIn(BaseModel):
    login: str = Field(min_length=3, max_length=32, pattern=r"^[a-zA-Z0-9_-]+$")
    password: str = Field(min_length=8, max_length=128)


class OrderItemIn(BaseModel):
    goodId: int
    qty: int = Field(ge=1, le=99)


class OrderIn(BaseModel):
    items: list[OrderItemIn] = Field(min_length=1)
    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    phone: str | None = None
    delivery: Literal["pickup", "delivery"]
    address: str | None = None
    payment: Literal["card", "cash"]
    packaging: bool = False

    @model_validator(mode="after")
    def check_fields(self):
        if self.phone is not None:
            self.phone = self.phone.strip() or None
        if self.phone and len(re.sub(r"\D", "", self.phone)) < 10:
            raise ValueError("Некорректный номер телефона")
        if self.delivery == "delivery":
            self.address = (self.address or "").strip()
            if not self.address:
                raise ValueError("Укажите адрес доставки")
        else:
            self.address = None
        return self

def current_user(session: str | None = Cookie(default=None)) -> str:
    login = sessions.get(session) if session else None
    if not login:
        raise HTTPException(status_code=401, detail="Требуется авторизация")
    return login


@app.post("/login")
async def login(data: LoginIn, response: Response):
    users = await storage.read_json("users.json")
    user = next((u for u in users if u["login"] == data.login), None)
    salt, pwd_hash = (user["salt"], user["hash"]) if user else (_DUMMY_SALT, _DUMMY_HASH)
    ok = await run_in_threadpool(verify_password, data.password, salt, pwd_hash)
    if not user or not ok:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    token = secrets.token_urlsafe(32)
    sessions[token] = user["login"]
    response.set_cookie(SESSION_COOKIE, token, max_age=SESSION_TTL, httponly=True, samesite="lax")
    return {"login": user["login"]}


@app.post("/register", status_code=201)
async def register(data: RegisterIn):
    """Создаёт пользователя, сохраняя только соль и PBKDF2-хеш пароля."""
    salt, pwd_hash = await run_in_threadpool(hash_password, data.password)
    created = await storage.add_user({
        "login": data.login,
        "salt": salt,
        "hash": pwd_hash,
    })
    if not created:
        raise HTTPException(status_code=409, detail="Пользователь с таким логином уже существует")
    return {"login": data.login}


@app.post("/logout")
async def logout(response: Response, session: str | None = Cookie(default=None)):
    if session:
        sessions.pop(session, None)
    response.delete_cookie(SESSION_COOKIE)
    return {"ok": True}


@app.get("/me")
async def me(login: str = Depends(current_user)):
    """Нужен фронтенду, чтобы после перезагрузки страницы понять, вошёл ли пользователь."""
    return {"login": login}

@app.get("/goods")
async def goods():
    """Список всех товаров. Открыт всем: хиты и новинки видны на главной без входа."""
    return await storage.read_json("goods.json")


@app.get("/orders")
async def orders(login: str = Depends(current_user)):
    return await storage.get_orders(login)


@app.post("/orders", status_code=201)
async def create_order(data: OrderIn, login: str = Depends(current_user)):
    catalog = {g["id"]: g for g in await storage.read_json("goods.json")}

    qty_by_id: dict[int, int] = {}
    for item in data.items:
        if item.goodId not in catalog:
            raise HTTPException(status_code=422, detail=f"Товар {item.goodId} не найден")
        qty_by_id[item.goodId] = qty_by_id.get(item.goodId, 0) + item.qty

    items = [
        {"goodId": gid, "name": catalog[gid]["name"], "qty": qty, "price": catalog[gid]["price"]}
        for gid, qty in qty_by_id.items()
    ]
    order = {
        "login": login,
        "items": items,
        "itemsCount": sum(i["qty"] for i in items),
        "total": sum(i["qty"] * i["price"] for i in items),
        "email": data.email,
        "phone": data.phone,
        "delivery": data.delivery,
        "address": data.address,
        "payment": data.payment,
        "packaging": data.packaging,
    }
    return await storage.add_order(order)
