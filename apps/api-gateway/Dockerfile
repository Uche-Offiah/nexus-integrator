# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only necessary files first (better caching)
COPY package.json package-lock.json ./
COPY apps ./apps
COPY libs ./libs
COPY tsconfig*.json ./

RUN npm install

# Copy full project
#COPY . .

# Build all services
RUN npm run build

# ---------- RUNTIME STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Copy only built output + deps
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/apps/api-gateway/src/server.js"]