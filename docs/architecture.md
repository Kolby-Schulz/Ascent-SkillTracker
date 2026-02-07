# Skill Roadmap Platform - Architecture Documentation

## Overview

The Skill Roadmap Platform is a full-stack web application built with a microservices-inspired architecture, fully containerized with Docker for easy deployment and scalability.

## High-Level Architecture

```
┌─────────────────┐
│     Browser     │
│   (React App)   │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   Frontend      │
│   React + FM    │
│   Port: 3000    │
└────────┬────────┘
         │ API Calls
         │
┌────────▼────────┐
│   Backend       │
│   Express API   │
│   Port: 5000    │
└────────┬────────┘
         │ Mongoose
         │
┌────────▼────────┐
│   MongoDB       │
│   Database      │
│   Port: 27017   │
└─────────────────┘
```

## Technology Stack

### Frontend
- **React 18.2**: Modern UI framework with hooks
- **React Router 6**: Client-side routing
- **Framer Motion**: Animation library for smooth transitions
- **Axios**: HTTP client with interceptors
- **Context API**: Global state management

### Backend
- **Node.js 20**: JavaScript runtime
- **Express 4**: Web application framework
- **Mongoose 8**: MongoDB ODM
- **JWT**: JSON Web Tokens for authentication
- **bcrypt.js**: Password hashing
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **express-validator**: Request validation
- **express-rate-limit**: Rate limiting

### Database
- **MongoDB 7**: NoSQL document database
- Persistent volume storage
- Indexed collections for performance

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx** (production): Reverse proxy and static file serving

## Directory Structure

```
/
├── frontend/               # React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom React hooks (future)
│   │   └── styles/        # Global styles (future)
│   ├── Dockerfile         # Frontend container config
│   └── package.json       # Frontend dependencies
│
├── backend/               # Express API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── models/       # Mongoose models
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Custom middleware
│   │   ├── utils/        # Utility functions
│   │   ├── validations/  # Input validation
│   │   ├── app.js        # Express app setup
│   │   └── server.js     # Server entry point
│   ├── Dockerfile        # Backend container config
│   └── package.json      # Backend dependencies
│
├── scripts/              # Utility scripts
├── docs/                 # Documentation
├── docker-compose.yml    # Container orchestration
└── .env.example          # Environment variables template
```

## Key Design Patterns

### Backend

1. **MVC Architecture**: Separation of Models, Views (JSON responses), and Controllers
2. **Layered Architecture**: Routes → Controllers → Services → Models
3. **Middleware Pipeline**: Request validation, authentication, error handling
4. **Dependency Injection**: Configuration passed through modules
5. **Factory Pattern**: JWT token generation utilities

### Frontend

1. **Component-Based Architecture**: Reusable, self-contained components
2. **Container/Presenter Pattern**: Smart (pages) vs. dumb (components) components
3. **Context Pattern**: Global auth state management
4. **Service Layer**: Abstraction over HTTP calls
5. **HOC Pattern**: ProtectedRoute wrapper component

## Authentication Flow

```
1. User submits credentials (email/password)
   ↓
2. Frontend → POST /api/v1/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend includes token in Authorization header
   ↓
7. Backend verifies token on protected routes
```

## Security Considerations

1. **Password Security**: bcrypt hashing with salt rounds
2. **JWT Security**: Signed tokens with secret key
3. **HTTP Security**: Helmet middleware for headers
4. **Rate Limiting**: Prevent brute force attacks
5. **Input Validation**: express-validator on all inputs
6. **CORS Configuration**: Restricted to frontend origin
7. **Error Handling**: No sensitive data in error messages

## Scalability Considerations

### Current State
- Monolithic backend (single Express instance)
- Direct MongoDB connection
- Local file-based sessions (via JWT)

### Future Enhancements
- **Horizontal Scaling**: Load balancer + multiple backend instances
- **Caching**: Redis for sessions and frequent queries
- **CDN**: Static asset delivery
- **Database Replicas**: MongoDB replica sets
- **Microservices**: Separate services for auth, skills, roadmaps
- **Message Queue**: RabbitMQ/SQS for async operations

## Data Models

### User
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  passwordHash: String,
  roles: [String] (default: ['user']),
  createdAt: Date,
  updatedAt: Date
}
```

### Skill (Placeholder - Future)
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## API Versioning

Current version: `v1`

Base URL: `/api/v1`

Future versions will be added as `/api/v2`, etc., allowing backward compatibility.

## Environment Configuration

### Backend
- `NODE_ENV`: development | production
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: Token expiration time
- `CORS_ORIGIN`: Allowed frontend origin

### Frontend
- `REACT_APP_API_URL`: Backend API base URL

## Deployment Architecture

### Development (Current)
- Docker Compose with hot-reloading
- Volume mounts for live code updates
- Development server ports exposed

### Production (Recommended)
- Multi-stage Docker builds
- Nginx for frontend static files
- Environment-specific configurations
- MongoDB Atlas or managed database
- HTTPS with SSL certificates
- Container orchestration (Kubernetes/ECS)

## Performance Optimizations

1. **Database Indexing**: Email field indexed for fast lookups
2. **Connection Pooling**: Mongoose connection pool
3. **Compression**: gzip (can be added via middleware)
4. **Caching**: Browser caching for static assets
5. **Code Splitting**: React lazy loading (future)
6. **Image Optimization**: Responsive images (future)

## Monitoring & Logging (Future)

- Winston for structured logging
- Morgan for HTTP request logging
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
- Health check endpoints

## Testing Strategy (Future)

- **Unit Tests**: Jest for backend/frontend
- **Integration Tests**: Supertest for API
- **E2E Tests**: Cypress or Playwright
- **Load Testing**: k6 or Artillery

## CI/CD Pipeline (Future)

1. Code push to repository
2. Run linting and tests
3. Build Docker images
4. Push to container registry
5. Deploy to staging environment
6. Run smoke tests
7. Deploy to production
