from datetime import datetime

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import json


DB_USERS = "database/users.json"
DB_GOODS = "database/goods.json"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login")
async def post_login(request: Request):
    body = await request.json()
    username = body.get("username")
    password = body.get("password")

    with open(DB_USERS, "r", encoding="utf-8") as file:
        database_data = json.load(file)

    for user in database_data:
        if username == user["username"] \
        and password == user["password"]:
            return True

    raise HTTPException(status_code=401, detail="Неправильный логин или пароль")


@app.post("/logout")
def post_logout():
    return True


@app.post("/cart/save")
async def save_cart(request: Request):
    body = await request.json()
    username = body.get("username")
    cart = body.get("cart", [])

    with open(DB_USERS, "r", encoding="utf-8") as file:
        users = json.load(file)

    for user in users:
        if user["username"] == username:
            user["cart"] = cart
            break

    with open(DB_USERS, "w", encoding="utf-8") as file:
        json.dump(users, file, ensure_ascii=False, indent=4)

    return { "success": True }


@app.get("/cart/{username}")
async def get_cart(username: str):
    with open(DB_USERS, "r", encoding="utf-8") as file:
        users = json.load(file)

    for user in users:
        if user["username"] == username:
            return { "cart": user.get("cart", []) }

    raise HTTPException(status_code=404, detail="Пользователь не найден")


@app.get("/goods")
def get_goods():
    with open(DB_GOODS, "r", encoding="utf-8") as file:
        database_data = json.load(file)

    return database_data


@app.get("/orders/{username}")
async def get_orders(username: str):
    with open("database/users.json", "r", encoding="utf-8") as file:
        users = json.load(file)

    for user in users:
        if user["username"] == username:
            return { "orders": user.get("orders", []) }

    raise HTTPException(status_code=404, detail="Пользователь не найден")


@app.post("/orders")
async def post_orders(request: Request):
    body = await request.json()
    username = body.get("username")
    cart = body.get("cart", [])
    order_id = body.get("order_id")

    order = {
        "id": order_id,
        "date": datetime.now().strftime("%d.%m.%Y %H:%M"),
        "contacts": {
            "tel": body.get("tel"),
            "email": body.get("email"),
            "address": body.get("address"),
        },
        "items": cart,
        "delivery": body.get("delivery"),
        "payment": body.get("payment"),
        "packaging": body.get("packaging"),
        "total": sum((item["price"] * item["quantity"]) for item in cart)
    }

    with open("database/users.json", "r", encoding="utf-8") as file:
        users = json.load(file)

    for user in users:
        if user["username"] == username:
            if "orders" not in user:
                user["odrers"] = []
            user["orders"].append(order)
            user["cart"] = []
            break

    with open("database/users.json", "w", encoding="utf-8") as file:
        json.dump(users, file, ensure_ascii=False, indent=4)

    return { "success": True, "order_id": order_id }