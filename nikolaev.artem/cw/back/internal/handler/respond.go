package handler

import (
    "encoding/json"
    "net/http"

    "gadgethub/internal/model"
)

func writeJSON(w http.ResponseWriter, status int, payload any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)

    if payload != nil {
        _ = json.NewEncoder(w).Encode(payload)
    }
}

func writeError(w http.ResponseWriter, status int, code, message string) {
    writeJSON(w, status, model.ErrorResponse{Error: code, Message: message})
}

func writeValidationError(w http.ResponseWriter, fields map[string]string) {
    writeJSON(w, http.StatusBadRequest, model.ErrorResponse{
        Error:   "validation_error",
        Fields:  fields,
        Message: "Проверьте правильность заполнения полей",
    })
}
