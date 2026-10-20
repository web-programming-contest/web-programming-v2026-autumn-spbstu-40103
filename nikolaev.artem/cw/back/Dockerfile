FROM golang:1.26-alpine AS build

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum* ./
RUN go mod download 2>/dev/null || true

COPY . .
RUN go mod tidy && CGO_ENABLED=0 GOOS=linux go build -o /app/bin/server ./cmd/server

RUN go install github.com/pressly/goose/v3/cmd/goose@v3.22.1

FROM alpine:3.20

RUN apk add --no-cache ca-certificates bash

WORKDIR /app

COPY --from=build /app/bin/server /app/server
COPY --from=build /go/bin/goose /usr/local/bin/goose
COPY migrations /app/migrations
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/app/docker-entrypoint.sh"]
