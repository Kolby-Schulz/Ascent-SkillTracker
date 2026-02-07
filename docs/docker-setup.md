# Docker Setup Guide - Skill Roadmap Platform

## Overview

This application is fully containerized using Docker and Docker Compose. This guide covers setup, development workflow, and troubleshooting.

## Prerequisites

### Required Software

1. **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
   - Download: https://www.docker.com/products/docker-desktop
   - Version: 20.10 or higher

2. **Docker Compose**
   - Included with Docker Desktop
   - Linux: Install separately if needed
   - Version: 2.0 or higher

### Verify Installation

```bash
docker --version
# Expected: Docker version 20.10.x or higher

docker-compose --version
# Expected: Docker Compose version 2.x.x or higher
```

---

## Quick Start

### Windows

1. Open Command Prompt or PowerShell
2. Navigate to project root
3. Run the setup script:

```cmd
cd "C:\Users\darre\git\Hacklahoma 2026\Hacklahoma-2026"
scripts\dev-setup.bat
```

### Linux/Mac

1. Open Terminal
2. Navigate to project root
3. Make script executable and run:

```bash
cd ~/path/to/Hacklahoma-2026
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

### Manual Setup

1. Create environment files:

```bash
# Copy backend environment template
cp backend/.env.example backend/.env

# Copy frontend environment template
cp frontend/.env.example frontend/.env
```

2. Update `backend/.env` with secure values:
   - Change `JWT_SECRET` to a strong random string
   - Adjust other values as needed

3. Start all containers:

```bash
docker-compose up --build -d
```

---

## Container Architecture

### Services

```yaml
services:
  mongodb:    # Database
    Port: 27017
    Volume: mongodb_data
    
  backend:    # Express API
    Port: 5000
    Depends on: mongodb
    
  frontend:   # React App
    Port: 3000
    Depends on: backend
```

### Network

All services communicate on a shared Docker network: `skill-roadmap-network`

### Volumes

- `mongodb_data`: Persistent MongoDB storage (survives container restarts)

---

## Development Workflow

### Starting the Application

```bash
# Start all services
docker-compose up

# Start in background (detached mode)
docker-compose up -d

# Start with fresh build
docker-compose up --build
```

### Accessing Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### Viewing Logs

```bash
# All services
docker-compose logs

# Follow logs (live tail)
docker-compose logs -f

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Last 100 lines
docker-compose logs --tail=100
```

### Stopping the Application

```bash
# Stop all services (preserves data)
docker-compose stop

# Stop and remove containers (preserves data)
docker-compose down

# Stop, remove containers, and delete volumes (DELETES ALL DATA)
docker-compose down -v
```

### Restarting Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuilding Containers

```bash
# Rebuild all containers
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and start
docker-compose up --build
```

---

## Hot Reloading

### Backend (Node.js)

- **Tool**: nodemon
- **Behavior**: Auto-restarts on file changes
- **Files watched**: `backend/src/**/*`

### Frontend (React)

- **Tool**: react-scripts
- **Behavior**: Auto-reloads browser on file changes
- **Files watched**: `frontend/src/**/*`

### How It Works

Volume mounts in `docker-compose.yml`:
```yaml
volumes:
  - ./backend:/app      # Mount source code
  - /app/node_modules   # Prevent overwriting
```

---

## Running Commands Inside Containers

### Execute Shell in Container

```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# MongoDB container
docker-compose exec mongodb mongosh
```

### Run One-Off Commands

```bash
# Install new backend dependency
docker-compose exec backend npm install package-name

# Run database migration (when available)
docker-compose exec backend npm run migrate

# Frontend dependency
docker-compose exec frontend npm install package-name
```

---

## Database Management

### Connect to MongoDB

```bash
# Using mongosh in container
docker-compose exec mongodb mongosh skill-roadmap

# Using MongoDB Compass (GUI)
# Connection string: mongodb://localhost:27017/skill-roadmap
```

### Database Backup

```bash
# Create backup
docker-compose exec mongodb mongodump --out=/data/backup

# Copy to host
docker cp skill-roadmap-mongodb:/data/backup ./backup
```

### Database Restore

```bash
# Copy backup to container
docker cp ./backup skill-roadmap-mongodb:/data/backup

# Restore
docker-compose exec mongodb mongorestore /data/backup
```

### Reset Database

```bash
# Stop containers and delete volumes
docker-compose down -v

# Start fresh
docker-compose up
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://mongodb:27017/skill-roadmap
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Important Notes

- Never commit `.env` files to version control
- Use `.env.example` as templates
- Change `JWT_SECRET` to a strong random string in production
- Update `CORS_ORIGIN` to match your frontend domain

---

## Troubleshooting

### Port Already in Use

**Problem**: Port 3000, 5000, or 27017 is already in use

**Solution**:
```bash
# Find process using port (Windows)
netstat -ano | findstr :3000

# Find process using port (Linux/Mac)
lsof -i :3000

# Kill process
# Windows: taskkill /PID <pid> /F
# Linux/Mac: kill -9 <pid>

# Or change port in docker-compose.yml
```

### Container Won't Start

**Problem**: Container exits immediately

**Solution**:
```bash
# Check logs
docker-compose logs [service-name]

# Common causes:
# - Syntax error in code
# - Missing environment variables
# - Database connection failed
```

### Cannot Connect to Backend

**Problem**: Frontend can't reach backend API

**Solution**:
1. Verify backend is running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Test API directly: `curl http://localhost:5000/health`
4. Verify `REACT_APP_API_URL` in frontend/.env

### MongoDB Connection Failed

**Problem**: Backend can't connect to MongoDB

**Solution**:
1. Verify MongoDB is running: `docker-compose ps mongodb`
2. Check MongoDB logs: `docker-compose logs mongodb`
3. Verify `MONGO_URI` in backend/.env
4. Ensure services are on same network

### Changes Not Reflecting

**Problem**: Code changes not updating in container

**Solution**:
```bash
# Rebuild containers
docker-compose up --build

# Clear Docker cache
docker-compose build --no-cache

# Verify volume mounts in docker-compose.yml
```

### Out of Disk Space

**Problem**: Docker using too much disk space

**Solution**:
```bash
# Remove unused containers, images, networks
docker system prune

# Remove unused volumes (CAUTION: deletes data)
docker system prune -a --volumes

# Check disk usage
docker system df
```

### Permission Issues (Linux)

**Problem**: Permission denied errors in container

**Solution**:
```bash
# Run with user permissions
docker-compose exec --user $(id -u):$(id -g) backend sh

# Or fix ownership
sudo chown -R $USER:$USER .
```

---

## Production Deployment

### Build Production Images

```bash
# Build production frontend
docker build --target production -t skill-roadmap-frontend:prod ./frontend

# Build production backend
docker build --target production -t skill-roadmap-backend:prod ./backend
```

### Production Considerations

1. **Environment Variables**
   - Use secrets management (AWS Secrets Manager, HashiCorp Vault)
   - Never hardcode secrets

2. **Database**
   - Use managed MongoDB (MongoDB Atlas, AWS DocumentDB)
   - Enable authentication
   - Use connection string with credentials

3. **Reverse Proxy**
   - Use Nginx or Traefik
   - Enable HTTPS with SSL certificates
   - Configure proper CORS

4. **Container Orchestration**
   - Kubernetes (recommended for scale)
   - AWS ECS/Fargate
   - Google Cloud Run
   - Azure Container Instances

5. **Monitoring**
   - Container health checks
   - Log aggregation (ELK, CloudWatch)
   - Metrics (Prometheus, DataDog)

### Example Production docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    image: skill-roadmap-backend:prod
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
    restart: always
    
  frontend:
    image: skill-roadmap-frontend:prod
    ports:
      - "80:80"
      - "443:443"
    restart: always
```

---

## Docker Commands Reference

### Container Management

```bash
docker-compose up           # Start containers
docker-compose down         # Stop and remove containers
docker-compose ps           # List containers
docker-compose logs         # View logs
docker-compose restart      # Restart containers
docker-compose exec         # Run command in container
```

### Image Management

```bash
docker images               # List images
docker build                # Build image
docker pull                 # Pull image from registry
docker push                 # Push image to registry
docker rmi                  # Remove image
```

### Volume Management

```bash
docker volume ls            # List volumes
docker volume inspect       # Inspect volume
docker volume rm            # Remove volume
docker volume prune         # Remove unused volumes
```

### System Management

```bash
docker system df            # Disk usage
docker system prune         # Remove unused data
docker stats                # Container resource usage
docker inspect              # Detailed container info
```

---

## Best Practices

1. **Use .dockerignore**: Exclude unnecessary files from build context
2. **Multi-stage builds**: Reduce production image size
3. **Volume mounts**: Enable hot reloading in development
4. **Named volumes**: Persist data between container recreations
5. **Health checks**: Monitor container health
6. **Resource limits**: Prevent containers from consuming too many resources
7. **Security scanning**: Scan images for vulnerabilities
8. **Keep images updated**: Regularly update base images
9. **Use official images**: Prefer official/verified images
10. **Clean up regularly**: Remove unused containers, images, volumes

---

## Additional Resources

- Docker Documentation: https://docs.docker.com/
- Docker Compose Documentation: https://docs.docker.com/compose/
- MongoDB Docker Image: https://hub.docker.com/_/mongo
- Node.js Docker Image: https://hub.docker.com/_/node
- Nginx Docker Image: https://hub.docker.com/_/nginx

---

## Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Ensure Docker Desktop is running (Windows/Mac)
4. Try rebuilding: `docker-compose up --build`
5. Check Docker disk space: `docker system df`
6. Consult Docker documentation
7. Search for similar issues on Stack Overflow/GitHub
