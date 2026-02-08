@echo off
REM Database Backup Script for Windows
REM This script creates a backup of the MongoDB database and saves it locally

setlocal enabledelayedexpansion

REM Configuration
set BACKUP_DIR=backups
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set DB_NAME=skill-roadmap
set MONGO_HOST=%MONGO_HOST%
if "%MONGO_HOST%"=="" set MONGO_HOST=localhost
set MONGO_PORT=%MONGO_PORT%
if "%MONGO_PORT%"=="" set MONGO_PORT=27017

REM Create backups directory if it doesn't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo === MongoDB Database Backup ===
echo Database: %DB_NAME%
echo Host: %MONGO_HOST%:%MONGO_PORT%
echo.

REM Check if MongoDB container is running
docker ps | findstr "skill-roadmap-mongodb" >nul
if %errorlevel% equ 0 (
    echo Using Docker container for backup...
    set BACKUP_PATH=%BACKUP_DIR%\backup_%TIMESTAMP%
    mkdir "%BACKUP_PATH%"
    
    docker exec skill-roadmap-mongodb mongodump --db=%DB_NAME% --out=/tmp/backup_%TIMESTAMP%
    docker cp skill-roadmap-mongodb:/tmp/backup_%TIMESTAMP%/%DB_NAME% "%BACKUP_PATH%\"
    docker exec skill-roadmap-mongodb rm -rf /tmp/backup_%TIMESTAMP%
    
    echo.
    echo Backup created successfully!
    echo Location: %BACKUP_PATH%
    echo.
    echo To create a compressed archive, use: tar -czf backup_%TIMESTAMP%.tar.gz %BACKUP_PATH%
) else (
    echo Error: MongoDB container not found
    echo Please ensure MongoDB is running
    exit /b 1
)

echo To restore this backup, run: scripts\restore-db.bat
