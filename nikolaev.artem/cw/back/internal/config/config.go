package config

import (
    "os"
)

type Config struct {
    Port        string
    DatabaseURL string
    CORSOrigin  string
}

func Load() Config {
    return Config{
        Port:        getEnv("PORT", "8080"),
        DatabaseURL: getEnv("DATABASE_URL", "postgres://gadgethub:gadgethub@localhost:5432/gadgethub?sslmode=disable"),
        CORSOrigin:  getEnv("CORS_ORIGIN", "http://localhost:3000"),
    }
}

func getEnv(key, fallback string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }

    return fallback
}
