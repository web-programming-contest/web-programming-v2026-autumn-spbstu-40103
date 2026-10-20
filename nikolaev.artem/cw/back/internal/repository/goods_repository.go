package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"gadgethub/internal/model"
)

type GoodsRepository struct {
	pool *pgxpool.Pool
}

func NewGoodsRepository(pool *pgxpool.Pool) *GoodsRepository {
	return &GoodsRepository{pool: pool}
}

type GoodsFilter struct {
	MinPrice   *int
	MaxPrice   *int
	Categories []string
	Colors     []string
	Sort       string
	Page       int
	PageSize   int
}

type GoodsPage struct {
	Items      []model.Good
	Total      int
	Page       int
	PageSize   int
	TotalPages int
}

func (r *GoodsRepository) List(ctx context.Context, f GoodsFilter) (*GoodsPage, error) {
	where := []string{"1=1"}

	var args []any

	argN := 1

	if f.MinPrice != nil {
		where = append(where, fmt.Sprintf("price >= $%d", argN))
		args = append(args, *f.MinPrice)
		argN++
	}

	if f.MaxPrice != nil {
		where = append(where, fmt.Sprintf("price <= $%d", argN))
		args = append(args, *f.MaxPrice)
		argN++
	}

	if len(f.Categories) > 0 {
		where = append(where, fmt.Sprintf("category = ANY($%d)", argN))
		args = append(args, f.Categories)
		argN++
	}

	if len(f.Colors) > 0 {
		where = append(where, fmt.Sprintf("color = ANY($%d)", argN))
		args = append(args, f.Colors)
		argN++
	}

	// id в конце — стабильный порядок при равных значениях, иначе пагинация может дублировать/терять товары.
	orderBy := "is_new DESC, created_at DESC, id"

	switch f.Sort {
	case "price_asc":
		orderBy = "price ASC, id"
	case "price_desc":
		orderBy = "price DESC, id"
	case "rating_desc":
		orderBy = "rating DESC, id"
	case "new":
		orderBy = "is_new DESC, created_at DESC, id"
	case "new_asc":
		orderBy = "is_new ASC, created_at ASC, id"
	case "popular":
		orderBy = "is_hit DESC, hit_rank ASC, rating DESC, id"
	case "popular_asc":
		orderBy = "is_hit ASC, hit_rank DESC, rating ASC, id"
	}

	whereClause := strings.Join(where, " AND ")

	var total int

	countQuery := fmt.Sprintf(`SELECT count(*) FROM goods WHERE %s`, whereClause)
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, fmt.Errorf("count goods: %w", err)
	}

	page := max(f.Page, 1)

	pageSize := f.PageSize
	if pageSize < 1 {
		pageSize = 9
	}

	pageSize = min(pageSize, 100)

	offset := (page - 1) * pageSize

	query := fmt.Sprintf(`
        SELECT id, title, description, price, old_price, discount, rating,
               image_url, category, color, is_new, is_hit, specs, created_at
        FROM goods
        WHERE %s
        ORDER BY %s
        LIMIT $%d OFFSET $%d
    `, whereClause, orderBy, argN, argN+1)

	args = append(args, pageSize, offset)

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query goods: %w", err)
	}
	defer rows.Close()

	items, err := scanGoods(rows)
	if err != nil {
		return nil, err
	}

	totalPages := max((total+pageSize-1)/pageSize, 1)

	return &GoodsPage{
		Items:      items,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, nil
}

func (r *GoodsRepository) GetByID(ctx context.Context, id uuid.UUID) (*model.Good, error) {
	row := r.pool.QueryRow(ctx, `
        SELECT id, title, description, price, old_price, discount, rating,
               image_url, category, color, is_new, is_hit, specs, created_at
        FROM goods WHERE id = $1
    `, id)

	g, err := scanGood(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}

		return nil, err
	}

	return g, nil
}

func (r *GoodsRepository) GetByIDs(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]model.Good, error) {
	rows, err := r.pool.Query(ctx, `
        SELECT id, title, description, price, old_price, discount, rating,
               image_url, category, color, is_new, is_hit, specs, created_at
        FROM goods WHERE id = ANY($1)
    `, ids)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items, err := scanGoods(rows)
	if err != nil {
		return nil, err
	}

	result := make(map[uuid.UUID]model.Good, len(items))
	for _, g := range items {
		result[g.ID] = g
	}

	return result, nil
}

func (r *GoodsRepository) Highlighted(ctx context.Context, flag string, limit int) ([]model.Good, error) {
	col, rank := "is_hit", "hit_rank"
	if flag == "new" {
		col, rank = "is_new", "new_rank"
	}

	query := fmt.Sprintf(`
        SELECT id, title, description, price, old_price, discount, rating,
               image_url, category, color, is_new, is_hit, specs, created_at
        FROM goods WHERE %s = true
        ORDER BY %s ASC, created_at DESC
        LIMIT $1
    `, col, rank)

	rows, err := r.pool.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanGoods(rows)
}

type rowScanner interface {
	Scan(dest ...any) error
}

func scanGood(row rowScanner) (*model.Good, error) {
	var (
		g        model.Good
		specsRaw []byte
	)
	if err := row.Scan(
		&g.ID, &g.Title, &g.Description, &g.Price, &g.OldPrice, &g.Discount, &g.Rating,
		&g.ImageURL, &g.Category, &g.Color, &g.IsNew, &g.IsHit, &specsRaw, &g.CreatedAt,
	); err != nil {
		return nil, err
	}

	if len(specsRaw) > 0 {
		_ = json.Unmarshal(specsRaw, &g.Specs)
	}

	return &g, nil
}

func scanGoods(rows pgx.Rows) ([]model.Good, error) {
	var result []model.Good

	for rows.Next() {
		g, err := scanGood(rows)
		if err != nil {
			return nil, err
		}

		result = append(result, *g)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}
