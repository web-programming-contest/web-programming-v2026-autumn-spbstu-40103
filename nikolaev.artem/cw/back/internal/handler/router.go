package handler

import (
    "net/http"

    "github.com/go-chi/chi/v5"
    chimw "github.com/go-chi/chi/v5/middleware"
    "github.com/go-chi/cors"

    "gadgethub/internal/middleware"
    "gadgethub/internal/service"
)

type Deps struct {
    Auth         *service.AuthService
    GoodsHandler *GoodsHandler
    OrderHandler *OrderHandler
    AuthHandler  *AuthHandler
    CORSOrigin   string
}

func NewRouter(d Deps) http.Handler {
    r := chi.NewRouter()

    r.Use(chimw.Logger)
    r.Use(chimw.Recoverer)
    r.Use(cors.Handler(cors.Options{
        AllowedOrigins:   []string{d.CORSOrigin},
        AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
        AllowCredentials: true,
        MaxAge:           300,
    }))

    r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
        writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
    })

    r.Post("/login", d.AuthHandler.Login)
    r.Post("/logout", d.AuthHandler.Logout)

    r.Get("/goods", d.GoodsHandler.List)
    r.Get("/goods/highlighted", d.GoodsHandler.Highlighted)
    r.Get("/goods/{id}", d.GoodsHandler.GetByID)

    r.Group(func(r chi.Router) {
        r.Use(middleware.RequireAuth(d.Auth))
        r.Get("/me", d.AuthHandler.Me)
        r.Get("/orders", d.OrderHandler.List)
        r.Post("/orders", d.OrderHandler.Create)
    })

    return r
}
