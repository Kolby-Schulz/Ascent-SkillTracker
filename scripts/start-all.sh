#!/bin/bash
# One-click: MongoDB + Backend + Frontend
# For teammates - run this after a restart and everything comes up

echo "======================================"
echo "Skill Roadmap - Start Everything"
echo "======================================"
echo ""

# Stop Docker backend (uses port 5001, we need 5000)
docker stop skill-roadmap-backend 2>/dev/null
echo "[OK] Ensured Docker backend is stopped"

# Start MongoDB
docker start skill-roadmap-mongodb 2>/dev/null || docker run -d -p 27017:27017 --name skill-roadmap-mongodb mongo:7.0
echo "[OK] MongoDB running"

echo ""
echo "Starting backend in background..."
cd "$(dirname "$0")/../backend"
npm start &
BACKEND_PID=$!
cd - > /dev/null

echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend..."
cd "$(dirname "$0")/../frontend"
npm start
