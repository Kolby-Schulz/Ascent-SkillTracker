#!/bin/bash

# Database Backup Script
# This script creates a backup of the MongoDB database and saves it locally

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="skill-roadmap"
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"

# Create backups directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo -e "${BLUE}=== MongoDB Database Backup ===${NC}"
echo -e "Database: ${GREEN}${DB_NAME}${NC}"
echo -e "Host: ${GREEN}${MONGO_HOST}:${MONGO_PORT}${NC}"
echo ""

# Check if mongodump is available
if ! command -v mongodump &> /dev/null; then
    echo -e "${YELLOW}Warning: mongodump not found in PATH${NC}"
    echo "Attempting to use Docker MongoDB tools..."
    
    # Try using Docker exec if MongoDB is in a container
    if docker ps | grep -q "skill-roadmap-mongodb"; then
        echo -e "${BLUE}Using Docker container for backup...${NC}"
        BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"
        mkdir -p "$BACKUP_PATH"
        
        docker exec skill-roadmap-mongodb mongodump \
            --db="$DB_NAME" \
            --out=/tmp/backup_${TIMESTAMP}
        
        docker cp skill-roadmap-mongodb:/tmp/backup_${TIMESTAMP}/${DB_NAME} "$BACKUP_PATH/"
        docker exec skill-roadmap-mongodb rm -rf /tmp/backup_${TIMESTAMP}
        
        # Create archive
        cd "$BACKUP_DIR"
        tar -czf "backup_${TIMESTAMP}.tar.gz" "backup_${TIMESTAMP}"
        rm -rf "backup_${TIMESTAMP}"
        cd - > /dev/null
        
        BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz"
    else
        echo -e "${YELLOW}Error: MongoDB container not found${NC}"
        echo "Please ensure MongoDB is running or install mongodump locally"
        exit 1
    fi
else
    # Use local mongodump
    echo -e "${BLUE}Creating backup...${NC}"
    BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"
    
    mongodump \
        --host="${MONGO_HOST}:${MONGO_PORT}" \
        --db="$DB_NAME" \
        --out="$BACKUP_PATH"
    
    # Create archive
    cd "$BACKUP_DIR"
    tar -czf "backup_${TIMESTAMP}.tar.gz" "backup_${TIMESTAMP}"
    rm -rf "backup_${TIMESTAMP}"
    cd - > /dev/null
    
    BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz"
fi

# Get file size
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo ""
echo -e "${GREEN}✓ Backup created successfully!${NC}"
echo -e "  File: ${BLUE}${BACKUP_FILE}${NC}"
echo -e "  Size: ${BLUE}${FILE_SIZE}${NC}"
echo ""
echo -e "To restore this backup, run: ${YELLOW}./scripts/restore-db.sh${NC}"
