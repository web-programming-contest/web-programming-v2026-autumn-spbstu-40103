"""Асинхронное хранилище данных в JSON-файлах."""
import asyncio
import json
import os
import random
from datetime import date
from pathlib import Path

import aiofiles

DATA_DIR = Path(os.environ.get("GADGET_DATA_DIR", Path(__file__).parent / "data"))

_orders_lock = asyncio.Lock()
_users_lock = asyncio.Lock()


async def read_json(name: str):
    async with aiofiles.open(DATA_DIR / name, "r", encoding="utf-8") as f:
        return json.loads(await f.read())


async def write_json(name: str, data) -> None:
    """Запись через временный файл + os.replace: файл не останется «наполовину записанным»."""
    path = DATA_DIR / name
    tmp = path.with_suffix(path.suffix + ".tmp")
    async with aiofiles.open(tmp, "w", encoding="utf-8") as f:
        await f.write(json.dumps(data, ensure_ascii=False, indent=2))
    os.replace(tmp, path)


async def get_orders(login: str) -> list[dict]:
    orders = await read_json("orders.json")
    mine = [o for o in orders if o["login"] == login]
    return sorted(mine, key=lambda o: (o["date"], o["id"]), reverse=True)


async def add_order(order: dict) -> dict:
    """Присваивает заказу уникальный номер, дату и сохраняет его."""
    async with _orders_lock:
        orders = await read_json("orders.json")
        used = {o["id"] for o in orders}
        order_id = random.randint(10000, 99999)
        while order_id in used:
            order_id = random.randint(10000, 99999)
        order = {"id": order_id, "date": date.today().isoformat(), **order}
        orders.append(order)
        await write_json("orders.json", orders)
        return order


async def add_user(user: dict) -> bool:
    """Добавляет пользователя, если логин ещё не занят. Возвращает False при дубликате."""
    async with _users_lock:
        users = await read_json("users.json")
        if any(existing["login"] == user["login"] for existing in users):
            return False
        users.append(user)
        await write_json("users.json", users)
        return True
