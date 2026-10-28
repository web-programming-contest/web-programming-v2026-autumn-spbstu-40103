package model

import (
    "time"

    "github.com/google/uuid"
)

type User struct {
    ID           uuid.UUID `json:"id"`
    Username     string    `json:"username"`
    PasswordHash string    `json:"-"`
    CreatedAt    time.Time `json:"createdAt"`
}

type Good struct {
    ID          uuid.UUID         `json:"id"`
    Title       string            `json:"title"`
    Description string            `json:"description"`
    Price       int               `json:"price"`
    OldPrice    *int              `json:"oldPrice,omitempty"`
    Discount    *int              `json:"discount,omitempty"`
    Rating      float64           `json:"rating"`
    ImageURL    string            `json:"imageUrl"`
    Category    string            `json:"category"`
    Color       string            `json:"color"`
    IsNew       bool              `json:"isNew"`
    IsHit       bool              `json:"isHit"`
    Specs       map[string]string `json:"specs"`
    CreatedAt   time.Time         `json:"createdAt"`
}

type OrderItem struct {
    ID       uuid.UUID `json:"id"`
    GoodID   uuid.UUID `json:"goodId"`
    Title    string    `json:"title"`
    Price    int       `json:"price"`
    Quantity int       `json:"quantity"`
}

type Order struct {
    ID           uuid.UUID   `json:"id"`
    OrderNumber  int         `json:"orderNumber"`
    UserID       uuid.UUID   `json:"userId"`
    Phone        string      `json:"phone"`
    Email        *string     `json:"email,omitempty"`
    DeliveryType string      `json:"deliveryType"`
    Address      *string     `json:"address,omitempty"`
    PaymentType  string      `json:"paymentType"`
    NeedPackage  bool        `json:"needPackage"`
    Total        int         `json:"total"`
    Items        []OrderItem `json:"items"`
    CreatedAt    time.Time   `json:"createdAt"`
}

type LoginRequest struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

type LoginResponse struct {
    User User `json:"user"`
}

type CreateOrderItemRequest struct {
    GoodID   uuid.UUID `json:"goodId"`
    Quantity int       `json:"quantity"`
}

type CreateOrderRequest struct {
    Phone        string                   `json:"phone"`
    Email        *string                  `json:"email,omitempty"`
    DeliveryType string                   `json:"deliveryType"`
    Address      *string                  `json:"address,omitempty"`
    PaymentType  string                   `json:"paymentType"`
    NeedPackage  bool                     `json:"needPackage"`
    Items        []CreateOrderItemRequest `json:"items"`
}

type ErrorResponse struct {
    Error   string            `json:"error"`
    Fields  map[string]string `json:"fields,omitempty"`
    Message string            `json:"message,omitempty"`
}
