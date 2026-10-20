package service

import (
    "context"
    "errors"

    "github.com/google/uuid"

    "gadgethub/internal/model"
    "gadgethub/internal/repository"
)

var (
    ErrEmptyOrder      = errors.New("order has no items")
    ErrGoodNotFound    = errors.New("good not found")
    ErrInvalidQuantity = errors.New("invalid quantity")
)

type OrderService struct {
    orders *repository.OrderRepository
    goods  *repository.GoodsRepository
}

func NewOrderService(orders *repository.OrderRepository, goods *repository.GoodsRepository) *OrderService {
    return &OrderService{orders: orders, goods: goods}
}

func (s *OrderService) Create(ctx context.Context, userID uuid.UUID, req model.CreateOrderRequest) (*model.Order, error) {
    if len(req.Items) == 0 {
        return nil, ErrEmptyOrder
    }

    ids := make([]uuid.UUID, 0, len(req.Items))
    for _, it := range req.Items {
        if it.Quantity < 1 {
            return nil, ErrInvalidQuantity
        }

        ids = append(ids, it.GoodID)
    }

    goodsByID, err := s.goods.GetByIDs(ctx, ids)
    if err != nil {
        return nil, err
    }

    var items []model.OrderItem

    total := 0

    for _, it := range req.Items {
        g, ok := goodsByID[it.GoodID]
        if !ok {
            return nil, ErrGoodNotFound
        }

        items = append(items, model.OrderItem{
            GoodID:   g.ID,
            Title:    g.Title,
            Price:    g.Price,
            Quantity: it.Quantity,
        })
        total += g.Price * it.Quantity
    }

    return s.orders.Create(ctx, userID, req, items, total)
}

func (s *OrderService) ListByUser(ctx context.Context, userID uuid.UUID) ([]model.Order, error) {
    return s.orders.ListByUser(ctx, userID)
}
