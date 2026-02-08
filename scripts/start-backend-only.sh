#!/bin/bash
# Start backend and MongoDB only (for local frontend + Docker backend)

echo "======================================"
echo "Starting Backend + MongoDB (Docker)"
echo "======================================"
echo ""
echo "Run the frontend separately with:"
echo "  cd frontend"
echo "  npm install"
echo "  npm start"
echo ""
echo "API will be at http://localhost:5001"
echo "======================================"
echo ""

docker-compose up mongodb backend
