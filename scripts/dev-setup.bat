@echo off
REM Skill Roadmap Platform - Development Setup Script (Windows)
REM NOTE: This starts backend on port 5001. For login to work, the frontend
REM expects backend on 5000. Prefer scripts\start-local-dev.bat instead.
REM See LOCAL-DEV-SETUP.md for the recommended setup.

echo ======================================
echo Skill Roadmap Platform - Dev Setup
echo ======================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo [OK] Docker Compose is installed
echo.

REM Create .env files if they don't exist
if not exist backend\.env (
    echo Creating backend\.env from template...
    copy backend\.env.example backend\.env >nul
    echo [OK] Created backend\.env
    echo     Please update JWT_SECRET and other values in backend\.env
) else (
    echo [OK] backend\.env already exists
)

if not exist frontend\.env (
    echo Creating frontend\.env from template...
    copy frontend\.env.example frontend\.env >nul
    echo [OK] Created frontend\.env
) else (
    echo [OK] frontend\.env already exists
)

echo.
echo ======================================
echo Starting Docker containers...
echo ======================================
echo.

REM Build and start containers
docker-compose up --build -d

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo Services are starting up...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo MongoDB:  localhost:27017
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.
echo Note: It may take a minute for all services to be ready.
echo ======================================
echo.
pause
