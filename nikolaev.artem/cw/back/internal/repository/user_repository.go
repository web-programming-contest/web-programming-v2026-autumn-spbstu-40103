package repository

import (
    "context"
    "errors"
    "time"

    "github.com/google/uuid"
    "github.com/jackc/pgx/v5"
    "github.com/jackc/pgx/v5/pgxpool"

    "gadgethub/internal/model"
)

var ErrNotFound = errors.New("not found")

type UserRepository struct {
    pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
    return &UserRepository{pool: pool}
}

func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*model.User, error) {
    row := r.pool.QueryRow(ctx, `
        SELECT id, username, password_hash, created_at
        FROM users WHERE username = $1
    `, username)

    var u model.User
    if err := row.Scan(&u.ID, &u.Username, &u.PasswordHash, &u.CreatedAt); err != nil {
        if errors.Is(err, pgx.ErrNoRows) {
            return nil, ErrNotFound
        }

        return nil, err
    }

    return &u, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.User, error) {
    row := r.pool.QueryRow(ctx, `
        SELECT id, username, password_hash, created_at
        FROM users WHERE id = $1
    `, id)

    var u model.User
    if err := row.Scan(&u.ID, &u.Username, &u.PasswordHash, &u.CreatedAt); err != nil {
        if errors.Is(err, pgx.ErrNoRows) {
            return nil, ErrNotFound
        }

        return nil, err
    }

    return &u, nil
}

func (r *UserRepository) CreateSession(ctx context.Context, token string, userID uuid.UUID, ttlSeconds int) error {
    expiresAt := time.Now().Add(time.Duration(ttlSeconds) * time.Second)
    _, err := r.pool.Exec(ctx, `
        INSERT INTO sessions (token, user_id, expires_at)
        VALUES ($1, $2, $3)
    `, token, userID, expiresAt)

    return err
}

func (r *UserRepository) GetSessionUserID(ctx context.Context, token string) (uuid.UUID, error) {
    row := r.pool.QueryRow(ctx, `
        SELECT user_id FROM sessions
        WHERE token = $1 AND expires_at > now()
    `, token)

    var id uuid.UUID
    if err := row.Scan(&id); err != nil {
        if errors.Is(err, pgx.ErrNoRows) {
            return uuid.Nil, ErrNotFound
        }

        return uuid.Nil, err
    }

    return id, nil
}

func (r *UserRepository) DeleteSession(ctx context.Context, token string) error {
    _, err := r.pool.Exec(ctx, `DELETE FROM sessions WHERE token = $1`, token)
    return err
}
