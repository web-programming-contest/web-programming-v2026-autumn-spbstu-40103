package repository

import (
    "context"

    "github.com/google/uuid"
    "github.com/jackc/pgx/v5/pgxpool"

    "gadgethub/internal/model"
)

type OrderRepository struct {
    pool *pgxpool.Pool
}

func NewOrderRepository(pool *pgxpool.Pool) *OrderRepository {
    return &OrderRepository{pool: pool}
}

func (r *OrderRepository) Create(ctx context.Context, userID uuid.UUID, req model.CreateOrderRequest, items []model.OrderItem, total int) (*model.Order, error) {
    tx, err := r.pool.Begin(ctx)
    if err != nil {
        return nil, err
    }
    // После успешного Commit Rollback вернёт ErrTxClosed — это ожидаемо, игнорируем осознанно.
    defer func() { _ = tx.Rollback(ctx) }()

    var order model.Order

    row := tx.QueryRow(ctx, `
        INSERT INTO orders (user_id, phone, email, delivery_type, address, payment_type, need_package, total)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, order_number, user_id, phone, email, delivery_type, address, payment_type, need_package, total, created_at
    `, userID, req.Phone, req.Email, req.DeliveryType, req.Address, req.PaymentType, req.NeedPackage, total)

    if err := row.Scan(
        &order.ID, &order.OrderNumber, &order.UserID, &order.Phone, &order.Email,
        &order.DeliveryType, &order.Address, &order.PaymentType, &order.NeedPackage,
        &order.Total, &order.CreatedAt,
    ); err != nil {
        return nil, err
    }

    for _, item := range items {
        if _, err := tx.Exec(ctx, `
            INSERT INTO order_items (order_id, good_id, title, price, quantity)
            VALUES ($1, $2, $3, $4, $5)
        `, order.ID, item.GoodID, item.Title, item.Price, item.Quantity); err != nil {
            return nil, err
        }

        order.Items = append(order.Items, item)
    }

    if err := tx.Commit(ctx); err != nil {
        return nil, err
    }

    return &order, nil
}

func (r *OrderRepository) ListByUser(ctx context.Context, userID uuid.UUID) ([]model.Order, error) {
    rows, err := r.pool.Query(ctx, `
        SELECT id, order_number, user_id, phone, email, delivery_type, address, payment_type, need_package, total, created_at
        FROM orders WHERE user_id = $1
        ORDER BY created_at DESC
    `, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var orders []model.Order

    for rows.Next() {
        var o model.Order
        if err := rows.Scan(
            &o.ID, &o.OrderNumber, &o.UserID, &o.Phone, &o.Email,
            &o.DeliveryType, &o.Address, &o.PaymentType, &o.NeedPackage,
            &o.Total, &o.CreatedAt,
        ); err != nil {
            return nil, err
        }

        orders = append(orders, o)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    for i := range orders {
        items, err := r.itemsForOrder(ctx, orders[i].ID)
        if err != nil {
            return nil, err
        }

        orders[i].Items = items
    }

    return orders, nil
}

func (r *OrderRepository) itemsForOrder(ctx context.Context, orderID uuid.UUID) ([]model.OrderItem, error) {
    rows, err := r.pool.Query(ctx, `
        SELECT id, good_id, title, price, quantity FROM order_items WHERE order_id = $1
    `, orderID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var items []model.OrderItem

    for rows.Next() {
        var it model.OrderItem
        if err := rows.Scan(&it.ID, &it.GoodID, &it.Title, &it.Price, &it.Quantity); err != nil {
            return nil, err
        }

        items = append(items, it)
    }

    return items, rows.Err()
}
