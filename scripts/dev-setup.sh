#!/bin/bash

# Skill Roadmap Platform - Development Setup Script

echo "======================================"
echo "Skill Roadmap Platform - Dev Setup"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker is installed"
echo "✓ Docker Compose is installed"
echo ""

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env"
    echo "  Please update JWT_SECRET and other values in backend/.env"
else
    echo "✓ backend/.env already exists"
fi

if [ ! -f frontend/.env ]; then
    echo "Creating frontend/.env from template..."
    cp frontend/.env.example frontend/.env
    echo "✓ Created frontend/.env"
else
    echo "✓ frontend/.env already exists"
fi

echo ""
echo "======================================"
echo "Starting Docker containers..."
echo "======================================"
echo ""

# Build and start containers
docker-compose up --build -d

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Services are starting up..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "MongoDB:  localhost:27017"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop:      docker-compose down"
echo ""
echo "Note: It may take a minute for all services to be ready."
echo "======================================"
