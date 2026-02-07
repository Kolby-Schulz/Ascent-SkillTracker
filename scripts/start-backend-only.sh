#!/bin/bash
# Start only MongoDB + Backend (for local frontend with hot reload).
# In another terminal: cd frontend && npm install && npm start
# Then open http://localhost:3000 and log in; API runs at http://localhost:5001

set -e
cd "$(dirname "$0")/.."
echo "Starting MongoDB + Backend (run frontend locally in another terminal)..."
docker-compose up mongodb backend
