# Production Dockerfile for RepoBuddy Backend API
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
