# ===== Stage 1: Build =====
FROM node:25.8.1-alpine3.23 AS builder

# Install build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files and install dependencies
COPY src/ ./
ENV npm_config_nodedir=/usr/local
RUN npm ci --omit=dev

# ===== Stage 2: Production =====
FROM node:25.8.1-alpine3.23

WORKDIR /app

RUN apk add --no-cache su-exec tini

# Copy app from builder
COPY --from=builder /app /app

# Create dedicated non-root user
RUN addgroup -g 1001 wdt-app && adduser -u 1001 -G wdt-app -S wdt-app

# Copy entrypoint and make executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]

# Expose port
EXPOSE 3000

# Optional: declare volume (won’t affect host-mounted volumes)
VOLUME ["/app/data"]

# Default command
CMD ["node", "src/server.js"]