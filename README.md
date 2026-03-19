# Nexus Integrator

A lightweight event-driven integration hub built with Node.js and RabbitMQ.

## Architecture

Client -> Ingestion API -> RabbitMQ -> Transformer Service

## Features (Phase 1)

- REST event ingestion
- Event-driven messaging (RabbitMQ)
- Canonical event envelope
- Correlation ID tracking
- Producer/consumer architecture

## Tech Stack

- Node.js (TypeScript)
- RabbitMQ
- Docker
- Express

## Setup

### 1. Install dependencies
npm install

### 2. Start RabbitMQ
docker-compose up -d

### 3. Run services
npm run dev:api
npm run dev:transformer

## Test

curl -X POST http://localhost:3000/events \
-H "Content-Type: application/json" \
-d '{
  "eventType": "USER_CREATED",
  "payload": {
    "userId": "123",
    "email": "test@test.com"
  }
}'

## Next Steps (Phase 2)

- Idempotency
- Retry + Dead Letter Queue
- Structured logging
- OAuth2 security
- API Gateway