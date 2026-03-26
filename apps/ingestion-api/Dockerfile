FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./

COPY apps/ingestion-api ./apps/ingestion-api
COPY libs ./libs

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/apps/ingestion-api/server.js"]