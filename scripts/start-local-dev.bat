@echo off
REM Recommended: Run backend + frontend locally, MongoDB in Docker
REM Prevents login 500 errors (frontend expects backend on port 5000)

echo ======================================
echo Skill Roadmap - Local Dev (Recommended)
echo ======================================
echo.

REM Stop Docker backend - it uses port 5001, frontend expects 5000
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
echo ======================================
echo Open a SECOND terminal and run:
echo   cd frontend
echo   npm start
echo ======================================
echo.
echo Starting backend on port 5000...
echo.

cd /d "%~dp0..\backend"
npm start
