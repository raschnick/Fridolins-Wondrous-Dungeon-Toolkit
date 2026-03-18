#!/bin/sh
set -e

# Ensure /app/data exists
mkdir -p /app/data

# Set ownership
chown -R wdt-app:wdt-app /app

# Drop to non-root user and exec the main command
exec su-exec wdt-app "$@"