package main

import (
    "context"
    "errors"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/joho/godotenv"

    "gadgethub/internal/config"
    "gadgethub/internal/handler"
    "gadgethub/internal/repository"
    "gadgethub/internal/service"
)

func main() {
    _ = godotenv.Load()

    cfg := config.Load()

    ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
    defer stop()

    pool, err := repository.NewPool(ctx, cfg.DatabaseURL)
    if err != nil {
        log.Fatalf("failed to connect to database: %v", err)
    }
    defer pool.Close()

    userRepo := repository.NewUserRepository(pool)
    goodsRepo := repository.NewGoodsRepository(pool)
    orderRepo := repository.NewOrderRepository(pool)

    authService := service.NewAuthService(userRepo)
    orderService := service.NewOrderService(orderRepo, goodsRepo)

    secureCookie := os.Getenv("SECURE_COOKIE") == "true"

    router := handler.NewRouter(handler.Deps{
        Auth:         authService,
        GoodsHandler: handler.NewGoodsHandler(goodsRepo),
        OrderHandler: handler.NewOrderHandler(orderService),
        AuthHandler:  handler.NewAuthHandler(authService, secureCookie),
        CORSOrigin:   cfg.CORSOrigin,
    })

    srv := &http.Server{
        Addr:              ":" + cfg.Port,
        Handler:           router,
        ReadHeaderTimeout: 5 * time.Second,
    }

    go func() {
        log.Printf("gadgethub backend listening on :%s", cfg.Port)

        if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
            log.Fatalf("server error: %v", err)
        }
    }()

    <-ctx.Done()
    log.Println("shutting down...")

    shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    if err := srv.Shutdown(shutdownCtx); err != nil {
        log.Printf("graceful shutdown failed: %v", err)
    }
}
