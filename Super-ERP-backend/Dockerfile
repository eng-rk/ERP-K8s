# Stage 1: Build dependencies
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# Stage 2: Production runner
FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Set dynamic environment variable defaults
ENV PORT=5000 \
    NODE_ENV=production

# Expose port
EXPOSE 5000

# Create uploads directory and set permissions to standard non-root node user (uid=1000)
RUN mkdir -p uploads/gov-docs && chown -R node:node /usr/src/app

# Run as non-root user
USER node

# Healthcheck definition using wget (built-in in Alpine)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health/live || exit 1

# Production run command
CMD ["npm", "start"]
