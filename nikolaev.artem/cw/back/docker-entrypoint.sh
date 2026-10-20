#!/bin/sh
set -e

echo "Waiting for postgres and applying migrations..."

GOOSE_DRIVER=postgres
GOOSE_DBSTRING="${DATABASE_URL}"

max_retries=30
count=0
until goose -dir /app/migrations postgres "$GOOSE_DBSTRING" up; do
  count=$((count+1))
  if [ "$count" -ge "$max_retries" ]; then
    echo "Migrations failed after $max_retries attempts"
    exit 1
  fi
  echo "Retrying migrations in 2s... ($count/$max_retries)"
  sleep 2
done

echo "Migrations applied. Starting server..."
exec /app/server
