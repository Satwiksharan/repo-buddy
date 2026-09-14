# Unified Production Dockerfile for RepoBuddy (Frontend + Backend)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root and package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm run setup

# Copy full application source
COPY . .

# Build Vite frontend bundle
RUN npm run build:client

# Production Stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/

# Install server production dependencies
RUN npm install --prefix server --omit=dev

# Copy server code and built client dist
COPY server ./server
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "server/src/server.js"]
