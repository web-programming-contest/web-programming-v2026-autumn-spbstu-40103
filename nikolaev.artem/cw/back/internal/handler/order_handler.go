package handler

import (
    "encoding/json"
    "errors"
    "net/http"
    "strings"

    "gadgethub/internal/middleware"
    "gadgethub/internal/model"
    "gadgethub/internal/service"
)

type OrderHandler struct {
    orders *service.OrderService
}

func NewOrderHandler(orders *service.OrderService) *OrderHandler {
    return &OrderHandler{orders: orders}
}

func (h *OrderHandler) List(w http.ResponseWriter, r *http.Request) {
    user, ok := middleware.UserFromContext(r.Context())
    if !ok {
        writeError(w, http.StatusUnauthorized, "unauthorized", "Требуется авторизация")
        return
    }

    orders, err := h.orders.ListByUser(r.Context(), user.ID)
    if err != nil {
        writeError(w, http.StatusInternalServerError, "internal_error", "Не удалось получить историю заказов")
        return
    }

    writeJSON(w, http.StatusOK, map[string]any{"items": orders})
}

func (h *OrderHandler) Create(w http.ResponseWriter, r *http.Request) {
    user, ok := middleware.UserFromContext(r.Context())
    if !ok {
        writeError(w, http.StatusUnauthorized, "unauthorized", "Требуется авторизация")
        return
    }

    var req model.CreateOrderRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeError(w, http.StatusBadRequest, "bad_request", "Некорректное тело запроса")
        return
    }

    fields := map[string]string{}
    if strings.TrimSpace(req.Phone) == "" {
        fields["phone"] = "Заполните обязательное поле"
    }

    if req.DeliveryType != "pickup" && req.DeliveryType != "delivery" {
        fields["deliveryType"] = "Выберите способ получения"
    }

    if req.DeliveryType == "delivery" && (req.Address == nil || strings.TrimSpace(*req.Address) == "") {
        fields["address"] = "Заполните обязательное поле"
    }

    if req.PaymentType != "card" && req.PaymentType != "cash" {
        fields["paymentType"] = "Выберите способ оплаты"
    }

    if len(req.Items) == 0 {
        fields["items"] = "Корзина пуста"
    }

    if len(fields) > 0 {
        writeValidationError(w, fields)
        return
    }

    order, err := h.orders.Create(r.Context(), user.ID, req)
    if err != nil {
        switch {
        case errors.Is(err, service.ErrEmptyOrder):
            writeValidationError(w, map[string]string{"items": "Корзина пуста"})
        case errors.Is(err, service.ErrGoodNotFound):
            writeError(w, http.StatusBadRequest, "good_not_found", "Один из товаров не найден")
        case errors.Is(err, service.ErrInvalidQuantity):
            writeError(w, http.StatusBadRequest, "invalid_quantity", "Некорректное количество товара")
        default:
            writeError(w, http.StatusInternalServerError, "internal_error", "Не удалось оформить заказ")
        }

        return
    }

    writeJSON(w, http.StatusCreated, order)
}
