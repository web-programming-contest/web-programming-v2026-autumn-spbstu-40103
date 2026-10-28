package middleware

import (
    "context"
    "net/http"

    "gadgethub/internal/model"
    "gadgethub/internal/service"
)

type contextKey string

const userContextKey contextKey = "user"

const SessionCookieName = "session_token"

func RequireAuth(auth *service.AuthService) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            cookie, err := r.Cookie(SessionCookieName)
            if err != nil || cookie.Value == "" {
                writeUnauthorized(w)
                return
            }

            user, err := auth.UserByToken(r.Context(), cookie.Value)
            if err != nil {
                writeUnauthorized(w)
                return
            }

            ctx := context.WithValue(r.Context(), userContextKey, user)
            next.ServeHTTP(w, r.WithContext(ctx))
        })
    }
}

func UserFromContext(ctx context.Context) (*model.User, bool) {
    u, ok := ctx.Value(userContextKey).(*model.User)
    return u, ok
}

func writeUnauthorized(w http.ResponseWriter) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusUnauthorized)
    _, _ = w.Write([]byte(`{"error":"unauthorized","message":"Требуется авторизация"}`))
}
