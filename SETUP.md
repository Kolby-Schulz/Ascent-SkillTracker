# Skill Roadmap Platform - Setup and Run Instructions

## Quick Start Guide

This guide will help you get the Skill Roadmap Platform running on your local machine in minutes.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
  - Download: https://www.docker.com/products/docker-desktop
  - Minimum version: 20.10+

- **Docker Compose**
  - Included with Docker Desktop
  - Minimum version: 2.0+

---

## Installation Steps

### Step 1: Clone the Repository

```bash
# If not already cloned
git clone <repository-url>
cd Hacklahoma-2026
```

### Step 2: Run Setup Script

#### Windows (Command Prompt or PowerShell)

```cmd
scripts\dev-setup.bat
```

#### Linux/Mac (Terminal)

```bash
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```

The setup script will:
- Check for Docker and Docker Compose
- Create `.env` files from templates
- Build Docker containers
- Start all services

### Step 3: Wait for Services to Start

The first build will take 5-10 minutes as it downloads dependencies. Subsequent starts will be much faster.

### Step 4: Access the Application

Once the containers are running:

- **Frontend**: Open http://localhost:3000 in your browser
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## Manual Setup (Alternative)

If you prefer not to use the setup script:

### 1. Create Environment Files

```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
```

### 2. Update Backend Environment Variables

Edit `backend/.env` and change the `JWT_SECRET` to a secure random string:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Build and Start Containers

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

---

## Verifying the Installation

### 1. Check Container Status

```bash
docker-compose ps
```

You should see three containers running:
- `skill-roadmap-frontend`
- `skill-roadmap-backend`
- `skill-roadmap-mongodb`

### 2. Test the Backend API

```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri http://localhost:5000/health

# Linux/Mac
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Open the Frontend

Navigate to http://localhost:3000 in your browser. You should see the Skill Roadmap Platform home page.

---

## Using the Application

### Register a New Account

1. Click **"Get Started"** or navigate to http://localhost:3000/register
2. Enter your email and password (minimum 6 characters)
3. Click **"Create Account"**
4. You'll be automatically logged in and redirected to the dashboard

### Login to Existing Account

1. Click **"Sign In"** or navigate to http://localhost:3000/login
2. Enter your email and password
3. Click **"Sign In"**
4. You'll be redirected to the dashboard

### Dashboard

After logging in, you'll see:
- Your user information
- Account details
- Coming soon features (skill roadmaps, progress tracking, etc.)

### Logout

Click the **"Logout"** button in the dashboard header to sign out.

---

## Development Workflow

### Hot Reloading

Both frontend and backend support hot reloading:

- **Frontend**: Changes to files in `frontend/src/` will automatically reload the browser
- **Backend**: Changes to files in `backend/src/` will automatically restart the server

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Stopping the Application

```bash
# Stop all services (preserves data)
docker-compose stop

# Stop and remove containers (preserves data)
docker-compose down

# Stop and remove everything including data (⚠️ DELETES DATABASE)
docker-compose down -v
```

### Restarting Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuilding After Code Changes

Most changes will be reflected automatically via hot reloading. However, if you change dependencies or Docker configuration:

```bash
docker-compose up --build
```

---

## Project Structure

```
Hacklahoma-2026/
├── frontend/                 # React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components (ProtectedRoute)
│   │   ├── context/         # React Context (AuthContext)
│   │   ├── pages/           # Page components (Login, Register, Dashboard, Home)
│   │   ├── services/        # API services (api.js, authService.js)
│   │   ├── App.js           # Main app component
│   │   └── index.js         # React entry point
│   ├── Dockerfile           # Frontend container config
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/         # Configuration (database, env vars)
│   │   ├── controllers/    # Request handlers (authController)
│   │   ├── middlewares/    # Middleware (auth, errorHandler)
│   │   ├── models/         # Mongoose models (User, Skill)
│   │   ├── routes/         # API routes (authRoutes)
│   │   ├── utils/          # Utilities (jwt, errorResponse)
│   │   ├── validations/    # Input validation (authValidation)
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── Dockerfile          # Backend container config
│   └── package.json        # Backend dependencies
│
├── docs/                   # Documentation
│   ├── architecture.md     # System architecture
│   ├── api-spec.md         # API documentation
│   ├── auth-flow.md        # Authentication flow
│   └── docker-setup.md     # Docker guide
│
├── scripts/                # Utility scripts
│   ├── dev-setup.sh        # Linux/Mac setup script
│   └── dev-setup.bat       # Windows setup script
│
├── docker-compose.yml      # Container orchestration
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
└── README.md               # Project overview
```

---

## Testing the API

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Login User
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Get Current User (Protected Route)
```bash
# Replace <token> with the token from login/register response
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Import the API endpoints
2. Create environment variable: `BASE_URL = http://localhost:5000/api/v1`
3. Test each endpoint
4. Save the token from login/register response
5. Use saved token for protected routes

---

## Database Management

### Connect to MongoDB

```bash
# Using mongosh in Docker container
docker-compose exec mongodb mongosh skill-roadmap

# List databases
show dbs

# Use skill-roadmap database
use skill-roadmap

# List collections
show collections

# Query users
db.users.find()
```

### MongoDB Compass (GUI)

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect with: `mongodb://localhost:27017/skill-roadmap`
3. Browse and manage data visually

### Reset Database

```bash
# Stop containers and delete data
docker-compose down -v

# Start fresh
docker-compose up
```

---

## Common Issues and Solutions

### Issue: Port Already in Use

**Error**: `Port 3000/5000/27017 is already in use`

**Solution**:
```bash
# Find and kill process using the port
# Windows
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Linux/Mac
lsof -i :3000
kill -9 <pid>
```

### Issue: Cannot Connect to Backend

**Solution**:
1. Check if backend is running: `docker-compose ps`
2. View backend logs: `docker-compose logs backend`
3. Test health endpoint: http://localhost:5000/health
4. Verify `REACT_APP_API_URL` in `frontend/.env`

### Issue: Authentication Not Working

**Solution**:
1. Clear browser localStorage (F12 → Application → Local Storage → Clear)
2. Check JWT_SECRET is set in `backend/.env`
3. View backend logs for error messages
4. Verify CORS_ORIGIN matches frontend URL

### Issue: Frontend Shows Blank Page

**Solution**:
1. Check browser console (F12) for errors
2. View frontend logs: `docker-compose logs frontend`
3. Rebuild containers: `docker-compose up --build`
4. Clear browser cache and reload

### Issue: Changes Not Reflected

**Solution**:
```bash
# Rebuild containers
docker-compose up --build

# Or rebuild without cache
docker-compose build --no-cache
docker-compose up
```

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://mongodb:27017/skill-roadmap` |
| `JWT_SECRET` | JWT signing secret (⚠️ change in production!) | `your-secret-key` |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api/v1` |

---

## Next Steps

Now that you have the authentication system running:

1. **Test the Authentication**: Create an account and login
2. **Explore the Code**: Review the backend and frontend structure
3. **Read the Documentation**: Check `docs/` folder for detailed guides
4. **Plan Future Features**: Skill roadmaps, progress tracking, etc.

### Future Development

According to the architecture, the next features to implement would be:

1. **Skill Management**
   - Create, read, update, delete skills
   - Skill categories and search

2. **Roadmap System**
   - Visual roadmap display with Framer Motion
   - Hierarchical sub-skills
   - Roadmap editor

3. **Progress Tracking**
   - Mark skills as completed
   - Progress visualization
   - Achievement system

4. **Admin Dashboard**
   - User management
   - Skill moderation
   - Analytics

---

## Additional Resources

- **Architecture**: See `docs/architecture.md`
- **API Documentation**: See `docs/api-spec.md`
- **Authentication Flow**: See `docs/auth-flow.md`
- **Docker Guide**: See `docs/docker-setup.md`

---

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs: `docker-compose logs -f`
3. Verify environment variables are set correctly
4. Ensure Docker Desktop is running
5. Try rebuilding: `docker-compose up --build`

---

## Contributing

When contributing to this project:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit a pull request

---

## Security Notes

⚠️ **Important for Production**:

1. Change `JWT_SECRET` to a strong random string
2. Use HTTPS with SSL certificates
3. Enable MongoDB authentication
4. Use environment-specific `.env` files
5. Never commit `.env` files to version control
6. Implement rate limiting and input validation
7. Use managed database services (MongoDB Atlas)
8. Enable security scanning for containers

---

Congratulations! You now have a fully functional authentication system running. Happy coding! 🚀
