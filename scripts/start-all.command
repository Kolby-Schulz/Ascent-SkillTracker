#!/bin/bash
# One-click: MongoDB + Backend + Frontend (double-click in Finder to run)
# For teammates - run this after a restart and everything comes up

# Change to project root (important when double-clicked from Finder)
cd "$(dirname "$0")/.." || exit 1

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
echo "Installing dependencies (in case you just pulled)..."
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
echo "[OK] Dependencies ready"

echo ""
echo "Starting backend in new Terminal window..."
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'/backend\" && npm start"'
echo "[OK] Backend starting in new window"

echo "Waiting for backend to start..."
sleep 6

echo "Starting frontend in new Terminal window..."
osascript -e 'tell app "Terminal" to do script "cd \"'"$(pwd)"'/frontend\" && npm start"'

echo ""
echo "======================================"
echo "Done! Two Terminal windows should have opened."
echo "  - Backend:  http://localhost:5000"
echo "  - Frontend: http://localhost:3001"
echo "======================================"
echo "Close the Backend and Frontend Terminal windows to stop."
echo ""
read -p "Press Enter to close this window..."
