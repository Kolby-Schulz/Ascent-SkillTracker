@echo off
REM Start only MongoDB + Backend (for local frontend with hot reload).
REM In another terminal: cd frontend && npm install && npm start
REM Then open http://localhost:3000 and log in; API runs at http://localhost:5001
cd /d "%~dp0\.."
echo Starting MongoDB + Backend (run frontend locally in another terminal)...
docker-compose up mongodb backend
