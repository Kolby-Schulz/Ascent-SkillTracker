#!/bin/bash

# Database Restore Script
# This script allows you to select and restore a MongoDB backup

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="./backups"
DB_NAME="skill-roadmap"
MONGO_HOST="${MONGO_HOST:-localhost}"
MONGO_PORT="${MONGO_PORT:-27017}"

echo -e "${BLUE}=== MongoDB Database Restore ===${NC}"
echo ""

# Check if backups directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}Error: Backups directory not found: ${BACKUP_DIR}${NC}"
    echo "Please create a backup first using: ./scripts/backup-db.sh"
    exit 1
fi

# Find all backup files
BACKUP_FILES=($(find "$BACKUP_DIR" -name "backup_*.tar.gz" -type f | sort -r))

if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
    echo -e "${RED}No backup files found in ${BACKUP_DIR}${NC}"
    echo "Please create a backup first using: ./scripts/backup-db.sh"
    exit 1
fi

# Display available backups
echo -e "${GREEN}Available backups:${NC}"
echo ""
for i in "${!BACKUP_FILES[@]}"; do
    BACKUP_FILE="${BACKUP_FILES[$i]}"
    FILE_NAME=$(basename "$BACKUP_FILE")
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    FILE_DATE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$BACKUP_FILE" 2>/dev/null || stat -c "%y" "$BACKUP_FILE" 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1)
    
    printf "  ${BLUE}[%2d]${NC} %s\n" $((i+1)) "$FILE_NAME"
    printf "       Size: %s | Date: %s\n" "$FILE_SIZE" "$FILE_DATE"
done

echo ""
echo -e "${YELLOW}WARNING: This will replace the current database!${NC}"
echo -e "${YELLOW}Make sure you have a backup of your current data.${NC}"
echo ""

# Get user selection
read -p "Select backup to restore (1-${#BACKUP_FILES[@]}) or 'q' to quit: " SELECTION

if [ "$SELECTION" = "q" ] || [ "$SELECTION" = "Q" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Validate selection
if ! [[ "$SELECTION" =~ ^[0-9]+$ ]] || [ "$SELECTION" -lt 1 ] || [ "$SELECTION" -gt ${#BACKUP_FILES[@]} ]; then
    echo -e "${RED}Invalid selection${NC}"
    exit 1
fi

SELECTED_BACKUP="${BACKUP_FILES[$((SELECTION-1))]}"
SELECTED_NAME=$(basename "$SELECTED_BACKUP")

echo ""
echo -e "${BLUE}Selected backup: ${GREEN}${SELECTED_NAME}${NC}"
echo ""

# Confirm restore
read -p "Are you sure you want to restore this backup? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ] && [ "$CONFIRM" != "y" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Extract backup
echo -e "${BLUE}Extracting backup...${NC}"
TEMP_DIR=$(mktemp -d)
tar -xzf "$SELECTED_BACKUP" -C "$TEMP_DIR"

# Find the database directory in the extracted backup
DB_BACKUP_PATH=$(find "$TEMP_DIR" -type d -name "$DB_NAME" | head -1)

if [ -z "$DB_BACKUP_PATH" ]; then
    echo -e "${RED}Error: Could not find database directory in backup${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${BLUE}Restoring database...${NC}"

# Check if mongorestore is available
if ! command -v mongorestore &> /dev/null; then
    echo -e "${YELLOW}Warning: mongorestore not found in PATH${NC}"
    echo "Attempting to use Docker MongoDB tools..."
    
    # Try using Docker exec if MongoDB is in a container
    if docker ps | grep -q "skill-roadmap-mongodb"; then
        echo -e "${BLUE}Using Docker container for restore...${NC}"
        
        # Copy backup to container
        docker cp "$DB_BACKUP_PATH" skill-roadmap-mongodb:/tmp/restore_${DB_NAME}
        
        # Drop existing database and restore
        docker exec skill-roadmap-mongodb mongorestore \
            --db="$DB_NAME" \
            --drop \
            /tmp/restore_${DB_NAME}/${DB_NAME}
        
        # Cleanup
        docker exec skill-roadmap-mongodb rm -rf /tmp/restore_${DB_NAME}
    else
        echo -e "${RED}Error: MongoDB container not found${NC}"
        echo "Please ensure MongoDB is running or install mongorestore locally"
        rm -rf "$TEMP_DIR"
        exit 1
    fi
else
    # Use local mongorestore
    mongorestore \
        --host="${MONGO_HOST}:${MONGO_PORT}" \
        --db="$DB_NAME" \
        --drop \
        "$DB_BACKUP_PATH"
fi

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}✓ Database restored successfully!${NC}"
echo -e "  Restored from: ${BLUE}${SELECTED_NAME}${NC}"
