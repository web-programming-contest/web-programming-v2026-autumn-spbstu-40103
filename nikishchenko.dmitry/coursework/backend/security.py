"""Хеширование паролей (только стандартная библиотека)."""
import hashlib
import hmac
import os

ITERATIONS = 200_000


def _derive(password: str, salt: bytes) -> str:
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERATIONS).hex()


def hash_password(password: str) -> tuple[str, str]:
    """Возвращает (salt_hex, hash_hex)."""
    salt = os.urandom(16)
    return salt.hex(), _derive(password, salt)


def verify_password(password: str, salt_hex: str, hash_hex: str) -> bool:
    return hmac.compare_digest(_derive(password, bytes.fromhex(salt_hex)), hash_hex)
