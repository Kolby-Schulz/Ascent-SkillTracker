#!/usr/bin/env bash
# Clear all collections in the skill-roadmap MongoDB database (Docker).
# Requires the MongoDB container to be running (e.g. docker-compose up -d mongodb).

set -e

CONTAINER_NAME="skill-roadmap-mongodb"
DB_NAME="skill-roadmap"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Error: Container '${CONTAINER_NAME}' is not running."
  echo "Start it with: docker-compose up -d mongodb"
  exit 1
fi

echo "Clearing database '${DB_NAME}' in container '${CONTAINER_NAME}'..."
docker exec "${CONTAINER_NAME}" mongosh "${DB_NAME}" --eval "db.dropDatabase()" --quiet
echo "Database cleared successfully."
