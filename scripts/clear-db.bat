@echo off
REM Clear all collections in the skill-roadmap MongoDB database (Docker).
REM Requires the MongoDB container to be running (e.g. docker-compose up -d mongodb).

set CONTAINER_NAME=skill-roadmap-mongodb
set DB_NAME=skill-roadmap

docker ps --format "{{.Names}}" | findstr /R "^%CONTAINER_NAME%$" >nul 2>&1
if errorlevel 1 (
  echo Error: Container '%CONTAINER_NAME%' is not running.
  echo Start it with: docker-compose up -d mongodb
  exit /b 1
)

echo Clearing database '%DB_NAME%' in container '%CONTAINER_NAME%'...
docker exec %CONTAINER_NAME% mongosh %DB_NAME% --eval "db.dropDatabase()" --quiet
echo Database cleared successfully.
