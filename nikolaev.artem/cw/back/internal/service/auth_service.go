package service

import (
    "context"
    "crypto/rand"
    "encoding/hex"
    "errors"

    "golang.org/x/crypto/bcrypt"

    "gadgethub/internal/model"
    "gadgethub/internal/repository"
)

var ErrInvalidCredentials = errors.New("invalid credentials")

const sessionTTLSeconds = 60 * 60 * 24 * 7

type AuthService struct {
    users *repository.UserRepository
}

func NewAuthService(users *repository.UserRepository) *AuthService {
    return &AuthService{users: users}
}

func (s *AuthService) Login(ctx context.Context, username, password string) (*model.User, string, error) {
    u, err := s.users.GetByUsername(ctx, username)
    if err != nil {
        if errors.Is(err, repository.ErrNotFound) {
            return nil, "", ErrInvalidCredentials
        }

        return nil, "", err
    }

    if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password)); err != nil {
        return nil, "", ErrInvalidCredentials
    }

    token, err := generateToken()
    if err != nil {
        return nil, "", err
    }

    if err := s.users.CreateSession(ctx, token, u.ID, sessionTTLSeconds); err != nil {
        return nil, "", err
    }

    return u, token, nil
}

func (s *AuthService) Logout(ctx context.Context, token string) error {
    return s.users.DeleteSession(ctx, token)
}

func (s *AuthService) UserByToken(ctx context.Context, token string) (*model.User, error) {
    userID, err := s.users.GetSessionUserID(ctx, token)
    if err != nil {
        return nil, err
    }

    return s.users.GetByID(ctx, userID)
}

func generateToken() (string, error) {
    b := make([]byte, 32)
    if _, err := rand.Read(b); err != nil {
        return "", err
    }

    return hex.EncodeToString(b), nil
}
