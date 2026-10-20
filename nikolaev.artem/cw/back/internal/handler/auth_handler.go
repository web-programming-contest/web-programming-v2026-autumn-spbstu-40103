package handler

import (
    "encoding/json"
    "errors"
    "net/http"
    "strings"
    "time"

    "gadgethub/internal/middleware"
    "gadgethub/internal/model"
    "gadgethub/internal/service"
)

type AuthHandler struct {
    auth         *service.AuthService
    secureCookie bool
}

func NewAuthHandler(auth *service.AuthService, secureCookie bool) *AuthHandler {
    return &AuthHandler{auth: auth, secureCookie: secureCookie}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
    var req model.LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        writeError(w, http.StatusBadRequest, "bad_request", "Некорректное тело запроса")
        return
    }

    fields := map[string]string{}
    if strings.TrimSpace(req.Username) == "" {
        fields["username"] = "Заполните обязательное поле"
    }

    if strings.TrimSpace(req.Password) == "" {
        fields["password"] = "Заполните обязательное поле"
    }

    if len(fields) > 0 {
        writeValidationError(w, fields)
        return
    }

    user, token, err := h.auth.Login(r.Context(), req.Username, req.Password)
    if err != nil {
        if errors.Is(err, service.ErrInvalidCredentials) {
            writeError(w, http.StatusUnauthorized, "invalid_credentials",
                "Такого пользователя нет, возможно неправильный логин или пароль - проверьте данные")

            return
        }

        writeError(w, http.StatusInternalServerError, "internal_error", "Внутренняя ошибка сервера")

        return
    }

    http.SetCookie(w, &http.Cookie{
        Name:     middleware.SessionCookieName,
        Value:    token,
        Path:     "/",
        HttpOnly: true,
        Secure:   h.secureCookie,
        SameSite: http.SameSiteLaxMode,
        Expires:  time.Now().Add(7 * 24 * time.Hour),
    })

    writeJSON(w, http.StatusOK, model.LoginResponse{User: *user})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
    cookie, err := r.Cookie(middleware.SessionCookieName)
    if err == nil && cookie.Value != "" {
        _ = h.auth.Logout(r.Context(), cookie.Value)
    }

    http.SetCookie(w, &http.Cookie{
        Name:     middleware.SessionCookieName,
        Value:    "",
        Path:     "/",
        HttpOnly: true,
        Secure:   h.secureCookie,
        SameSite: http.SameSiteLaxMode,
        Expires:  time.Unix(0, 0),
        MaxAge:   -1,
    })

    writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
    user, ok := middleware.UserFromContext(r.Context())
    if !ok {
        writeError(w, http.StatusUnauthorized, "unauthorized", "Требуется авторизация")
        return
    }

    writeJSON(w, http.StatusOK, map[string]any{"user": user})
}
