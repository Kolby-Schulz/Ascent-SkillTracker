@echo off
REM One-click: MongoDB + Backend + Frontend
REM For teammates - run this after a restart and everything comes up

echo ======================================
echo Skill Roadmap - Start Everything
echo ======================================
echo.

REM Kill any leftover Node processes (so "already running on port" does not happen)
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (echo [OK] Stopped previous Node processes) else (echo [OK] No previous Node processes to stop)

REM Stop Docker backend (uses port 5001, we need 5000)
docker stop skill-roadmap-backend 2>nul
echo [OK] Ensured Docker backend is stopped

REM Start MongoDB
docker start skill-roadmap-mongodb 2>nul
if %errorlevel% neq 0 (
    echo Creating MongoDB container...
    docker run -d -p 27017:27017 --name skill-roadmap-mongodb mongo:7.0
)
echo [OK] MongoDB running

echo.
echo Installing dependencies (in case you just pulled)...
cd /d "%~dp0..\backend"
call npm install
cd "%~dp0..\frontend"
call npm install
cd /d "%~dp0.."
echo [OK] Dependencies ready

echo.
echo Starting backend in new window...
start "Backend (port 5000)" cmd /k "cd /d "%~dp0..\backend" && npm start"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend in new window...
start "Frontend (port 3001)" cmd /k "cd /d "%~dp0..\frontend" && set PORT=3001 && npm start"

echo.
echo ======================================
echo Done! Two windows should have opened.
echo   - Backend:  http://localhost:5000
echo   - Frontend: http://localhost:3001
echo ======================================
echo Close the Backend and Frontend windows to stop.
pause
