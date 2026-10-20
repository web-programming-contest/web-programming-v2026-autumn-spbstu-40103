-- +goose Up
-- +goose StatementBegin
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE sessions (
    token      TEXT PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE goods (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price       INTEGER NOT NULL,
    old_price   INTEGER,
    discount    INTEGER,
    rating      NUMERIC(2,1) NOT NULL DEFAULT 0,
    image_url   TEXT NOT NULL DEFAULT '',
    category    TEXT NOT NULL,
    color       TEXT NOT NULL,
    is_new      BOOLEAN NOT NULL DEFAULT false,
    is_hit      BOOLEAN NOT NULL DEFAULT false,
    hit_rank    INTEGER NOT NULL DEFAULT 1000,
    new_rank    INTEGER NOT NULL DEFAULT 1000,
    specs       JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE INDEX idx_goods_category ON goods(category);
CREATE INDEX idx_goods_color ON goods(color);
CREATE INDEX idx_goods_price ON goods(price);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE orders (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number  SERIAL,
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone         TEXT NOT NULL,
    email         TEXT,
    delivery_type TEXT NOT NULL,
    address       TEXT,
    payment_type  TEXT NOT NULL,
    need_package  BOOLEAN NOT NULL DEFAULT false,
    total         INTEGER NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE order_items (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    good_id    UUID NOT NULL REFERENCES goods(id),
    title      TEXT NOT NULL,
    price      INTEGER NOT NULL,
    quantity   INTEGER NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS goods;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
