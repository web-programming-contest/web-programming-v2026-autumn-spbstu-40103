package handler

import (
    "errors"
    "net/http"
    "strconv"
    "strings"

    "github.com/google/uuid"

    "gadgethub/internal/repository"
)

type GoodsHandler struct {
    goods *repository.GoodsRepository
}

func NewGoodsHandler(goods *repository.GoodsRepository) *GoodsHandler {
    return &GoodsHandler{goods: goods}
}

func (h *GoodsHandler) List(w http.ResponseWriter, r *http.Request) {
    q := r.URL.Query()

    filter := repository.GoodsFilter{
        Sort:     q.Get("sort"),
        Page:     atoiOr(q.Get("page"), 1),
        PageSize: atoiOr(q.Get("pageSize"), 9),
    }

    if v := q.Get("minPrice"); v != "" {
        if n, err := strconv.Atoi(v); err == nil {
            filter.MinPrice = &n
        }
    }

    if v := q.Get("maxPrice"); v != "" {
        if n, err := strconv.Atoi(v); err == nil {
            filter.MaxPrice = &n
        }
    }

    if v := q.Get("category"); v != "" {
        filter.Categories = splitCSV(v)
    }

    if v := q.Get("color"); v != "" {
        filter.Colors = splitCSV(v)
    }

    page, err := h.goods.List(r.Context(), filter)
    if err != nil {
        writeError(w, http.StatusInternalServerError, "internal_error", "Не удалось получить список товаров")
        return
    }

    writeJSON(w, http.StatusOK, map[string]any{
        "items":      page.Items,
        "total":      page.Total,
        "page":       page.Page,
        "pageSize":   page.PageSize,
        "totalPages": page.TotalPages,
    })
}

func (h *GoodsHandler) GetByID(w http.ResponseWriter, r *http.Request) {
    idStr := r.PathValue("id")

    id, err := uuid.Parse(idStr)
    if err != nil {
        writeError(w, http.StatusBadRequest, "bad_request", "Некорректный идентификатор товара")
        return
    }

    good, err := h.goods.GetByID(r.Context(), id)
    if err != nil {
        if errors.Is(err, repository.ErrNotFound) {
            writeError(w, http.StatusNotFound, "not_found", "Товар не найден")
            return
        }

        writeError(w, http.StatusInternalServerError, "internal_error", "Не удалось получить товар")

        return
    }

    writeJSON(w, http.StatusOK, good)
}

func (h *GoodsHandler) Highlighted(w http.ResponseWriter, r *http.Request) {
    q := r.URL.Query()

    flag := q.Get("type")
    if flag != "new" {
        flag = "hits"
    }

    limit := atoiOr(q.Get("limit"), 10)

    items, err := h.goods.Highlighted(r.Context(), flag, limit)
    if err != nil {
        writeError(w, http.StatusInternalServerError, "internal_error", "Не удалось получить товары")
        return
    }

    writeJSON(w, http.StatusOK, map[string]any{"items": items})
}

func atoiOr(s string, fallback int) int {
    if s == "" {
        return fallback
    }

    n, err := strconv.Atoi(s)
    if err != nil {
        return fallback
    }

    return n
}

func splitCSV(s string) []string {
    parts := strings.Split(s, ",")

    result := make([]string, 0, len(parts))
    for _, p := range parts {
        p = strings.TrimSpace(p)
        if p != "" {
            result = append(result, p)
        }
    }

    return result
}
