# Database Backup and Restore Scripts

This directory contains scripts to backup and restore your MongoDB database.

## Prerequisites

- MongoDB must be running (either locally or in Docker)
- If using Docker, the container must be named `skill-roadmap-mongodb`
- For Linux/Mac: `mongodump` and `mongorestore` should be available (or use Docker)
- For Windows: Docker is required

## Backup Script

### Linux/Mac (`backup-db.sh`)

Creates a compressed backup of the database and saves it to the `backups/` directory.

**Usage:**
```bash
./scripts/backup-db.sh
```

**Environment Variables:**
- `MONGO_HOST` - MongoDB host (default: `localhost`)
- `MONGO_PORT` - MongoDB port (default: `27017`)

**Output:**
- Creates a compressed `.tar.gz` file in `backups/` directory
- File naming: `backup_YYYYMMDD_HHMMSS.tar.gz`

### Windows (`backup-db.bat`)

**Usage:**
```cmd
scripts\backup-db.bat
```

**Note:** Windows script creates uncompressed directories. To compress, use:
```cmd
tar -czf backup_TIMESTAMP.tar.gz backups\backup_TIMESTAMP
```

## Restore Script

### Linux/Mac (`restore-db.sh`)

Lists available backups and allows you to select which one to restore.

**Usage:**
```bash
./scripts/restore-db.sh
```

**Features:**
- Interactive menu showing all available backups
- Shows backup size and date
- Confirmation prompt before restoring
- Automatically drops existing database before restore

### Windows (`restore-db.bat`)

**Usage:**
```cmd
scripts\restore-db.bat
```

## Examples

### Create a backup:
```bash
# Linux/Mac
./scripts/backup-db.sh

# Windows
scripts\backup-db.bat
```

### Restore a backup:
```bash
# Linux/Mac
./scripts/restore-db.sh

# Windows
scripts\restore-db.bat
```

## Backup Location

All backups are stored in the `backups/` directory at the project root.

## Important Notes

⚠️ **WARNING:** Restoring a backup will **replace** your current database. Always create a backup before restoring!

- Backups are compressed (Linux/Mac) to save space
- The restore process will drop the existing database before restoring
- Make sure MongoDB is running before attempting backup/restore operations

## Troubleshooting

### "mongodump not found"
- Install MongoDB tools locally, or
- Ensure Docker container is running (scripts will use Docker automatically)

### "MongoDB container not found"
- Start MongoDB: `docker-compose up -d mongodb`
- Or ensure MongoDB is running locally on the configured port

### "No backup files found"
- Create a backup first using the backup script
- Check that backups are in the `backups/` directory
