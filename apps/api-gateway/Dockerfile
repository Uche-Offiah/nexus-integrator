# Use node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy app source
COPY apps/api-gateway ./apps/api-gateway
COPY libs ./libs

# Install dependencies
RUN npm install

# Build Typescript
RUN npm run build

# Expose port
EXPOSE 4000

# Start app
CMD ["node", "dist/apps/api-gateway/server.js"]