@echo off
REM Database Restore Script for Windows
REM This script allows you to select and restore a MongoDB backup

setlocal enabledelayedexpansion

REM Configuration
set BACKUP_DIR=backups
set DB_NAME=skill-roadmap
set MONGO_HOST=%MONGO_HOST%
if "%MONGO_HOST%"=="" set MONGO_HOST=localhost
set MONGO_PORT=%MONGO_PORT%
if "%MONGO_PORT%"=="" set MONGO_PORT=27017

echo === MongoDB Database Restore ===
echo.

REM Check if backups directory exists
if not exist "%BACKUP_DIR%" (
    echo Error: Backups directory not found: %BACKUP_DIR%
    echo Please create a backup first using: scripts\backup-db.bat
    exit /b 1
)

REM Find backup directories
set COUNT=0
for /d %%d in ("%BACKUP_DIR%\backup_*") do (
    set /a COUNT+=1
    set "BACKUP_!COUNT!=%%d"
)

if %COUNT% equ 0 (
    echo No backup directories found in %BACKUP_DIR%
    echo Please create a backup first using: scripts\backup-db.bat
    exit /b 1
)

REM Display available backups
echo Available backups:
echo.
set INDEX=0
for /l %%i in (1,1,%COUNT%) do (
    set /a INDEX+=1
    call set BACKUP_PATH=%%BACKUP_!INDEX!%%
    for %%f in ("!BACKUP_PATH!") do set BACKUP_NAME=%%~nxf
    echo   [!INDEX!] !BACKUP_NAME!
)

echo.
echo WARNING: This will replace the current database!
echo Make sure you have a backup of your current data.
echo.

REM Get user selection
set /p SELECTION="Select backup to restore (1-%COUNT%) or 'q' to quit: "

if /i "%SELECTION%"=="q" (
    echo Restore cancelled.
    exit /b 0
)

REM Validate selection
if %SELECTION% lss 1 (
    echo Invalid selection
    exit /b 1
)
if %SELECTION% gtr %COUNT% (
    echo Invalid selection
    exit /b 1
)

REM Get selected backup
call set SELECTED_BACKUP=%%BACKUP_%SELECTION%%%
for %%f in ("%SELECTED_BACKUP%") do set SELECTED_NAME=%%~nxf

echo.
echo Selected backup: %SELECTED_NAME%
echo.

REM Confirm restore
set /p CONFIRM="Are you sure you want to restore this backup? (yes/no): "

if /i not "%CONFIRM%"=="yes" (
    if /i not "%CONFIRM%"=="y" (
        echo Restore cancelled.
        exit /b 0
    )
)

REM Check if MongoDB container is running
docker ps | findstr "skill-roadmap-mongodb" >nul
if %errorlevel% equ 0 (
    echo Restoring database...
    
    REM Copy backup to container
    docker cp "%SELECTED_BACKUP%\%DB_NAME%" skill-roadmap-mongodb:/tmp/restore_%DB_NAME%
    
    REM Drop existing database and restore
    docker exec skill-roadmap-mongodb mongorestore --db=%DB_NAME% --drop /tmp/restore_%DB_NAME%
    
    REM Cleanup
    docker exec skill-roadmap-mongodb rm -rf /tmp/restore_%DB_NAME%
    
    echo.
    echo Database restored successfully!
    echo Restored from: %SELECTED_NAME%
) else (
    echo Error: MongoDB container not found
    echo Please ensure MongoDB is running
    exit /b 1
)
