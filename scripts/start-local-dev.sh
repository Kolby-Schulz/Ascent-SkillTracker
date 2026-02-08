#!/bin/bash
# Recommended: Run backend + frontend locally, MongoDB in Docker
# Prevents login 500 errors (frontend expects backend on port 5000)

echo "======================================"
echo "Skill Roadmap - Local Dev (Recommended)"
echo "======================================"
echo ""

# Stop Docker backend - it uses port 5001, frontend expects 5000
docker stop skill-roadmap-backend 2>/dev/null
echo "[OK] Ensured Docker backend is stopped"

# Start MongoDB
docker start skill-roadmap-mongodb 2>/dev/null || docker run -d -p 27017:27017 --name skill-roadmap-mongodb mongo:7.0
echo "[OK] MongoDB running"

echo ""
echo "======================================"
echo "Open a SECOND terminal and run:"
echo "  cd frontend"
echo "  npm start"
echo "======================================"
echo ""
echo "Starting backend on port 5000..."
echo ""

cd "$(dirname "$0")/../backend"
npm start
