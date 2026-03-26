FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.base.json ./

COPY apps/transformer-service ./apps/transformer-service
COPY libs ./libs

RUN npm install

RUN npm run build

CMD ["node", "dist/apps/transformer-service/index.js"]