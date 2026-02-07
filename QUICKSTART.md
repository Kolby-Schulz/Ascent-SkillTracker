# Skill Roadmap Platform - Quick Reference

## Start the Application

### Windows
```cmd
scripts\dev-setup.bat
```

### Linux/Mac
```bash
./scripts/dev-setup.sh
```

## Access Points

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## Common Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up --build

# Reset database (⚠️ deletes data)
docker-compose down -v
```

## API Endpoints

### Public
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Protected (requires auth token)
- `GET /api/v1/auth/me` - Get current user

## File Structure

```
frontend/src/
├── components/     # ProtectedRoute
├── context/        # AuthContext
├── pages/          # Login, Register, Dashboard, Home
└── services/       # API client, auth service

backend/src/
├── config/         # Database, environment
├── controllers/    # Auth controller
├── middlewares/    # Auth, error handling
├── models/         # User, Skill
├── routes/         # Auth routes
├── utils/          # JWT, error response
└── validations/    # Input validation
```

## Troubleshooting

1. **Port in use**: Kill process or change port in docker-compose.yml
2. **Can't connect**: Check `docker-compose ps` and logs
3. **Changes not reflected**: Run `docker-compose up --build`
4. **Auth not working**: Clear browser localStorage

## Documentation

- `docs/architecture.md` - System architecture
- `docs/api-spec.md` - API documentation
- `docs/auth-flow.md` - Authentication details
- `docs/docker-setup.md` - Docker guide
- `SETUP.md` - Full setup instructions
