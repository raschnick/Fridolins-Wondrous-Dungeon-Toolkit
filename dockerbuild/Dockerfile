FROM node:25.8.1-alpine3.23

# Build tools required to compile better-sqlite3 native addon
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies (cached layer, only re-runs when package files change)
COPY src/package*.json ./

# Point node-gyp to local headers — avoids downloading from unofficial-builds.nodejs.org
ENV npm_config_nodedir=/usr/local

RUN npm ci

# Copy application source
COPY src/ .

# Persistent volume mount point for SQLite database
RUN mkdir -p /app/data

EXPOSE 3000
CMD ["npm", "start"]