FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
COPY apps ./apps
COPY libs ./libs
COPY tsconfig*.json ./

RUN npm install

RUN npm run build

FROM node:20-alpine

WORKDIR /app


COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/apps/transformer-service/src/consumer.js"]