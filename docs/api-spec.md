# API Specification - Skill Roadmap Platform

## Base URL

```
Development: http://localhost:5000/api/v1
Production:  https://api.yourdomain.com/api/v1
```

## Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Rate Limiting

- **Window**: 10 minutes
- **Max Requests**: 100 per IP
- **Response**: 429 Too Many Requests

## Endpoints

---

### Authentication

#### Register User

Create a new user account.

**Endpoint**: `POST /api/v1/auth/register`

**Access**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation**:
- Email must be valid format
- Password must be at least 6 characters

**Success Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "roles": ["user"]
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation error or user already exists
- `500 Internal Server Error`: Server error

**Example**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

#### Login User

Authenticate existing user.

**Endpoint**: `POST /api/v1/auth/login`

**Access**: Public

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation**:
- Email must be valid format
- Password is required

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "roles": ["user"]
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

**Example**:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

#### Get Current User

Get authenticated user's profile.

**Endpoint**: `GET /api/v1/auth/me`

**Access**: Private (requires authentication)

**Headers**:
```
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "roles": ["user"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

**Example**:
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <token>"
```

---

### Health Check

#### Check API Health

Check if the API is running.

**Endpoint**: `GET /health`

**Access**: Public

**Success Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Example**:
```bash
curl -X GET http://localhost:5000/health
```

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Common Error Messages

### Validation Errors
- "Please provide a valid email"
- "Password must be at least 6 characters long"
- "Password is required"

### Authentication Errors
- "Invalid credentials"
- "Not authorized to access this route"
- "User not found"

### Database Errors
- "User already exists"
- "Duplicate field value entered"

## JWT Token

### Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxNjE2ODQzODIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Token Payload
```json
{
  "id": "507f1f77bcf86cd799439011",
  "iat": 1616239022,
  "exp": 1616843822
}
```

### Token Expiration
- Default: 7 days
- Configurable via `JWT_EXPIRE` environment variable

## Future Endpoints (Not Yet Implemented)

### Skills
- `GET /api/v1/skills` - List all skills
- `GET /api/v1/skills/:id` - Get skill details
- `POST /api/v1/skills` - Create new skill (admin)
- `PUT /api/v1/skills/:id` - Update skill (admin)
- `DELETE /api/v1/skills/:id` - Delete skill (admin)

### Roadmaps
- `GET /api/v1/roadmaps` - List roadmaps
- `GET /api/v1/roadmaps/:id` - Get roadmap details
- `POST /api/v1/roadmaps` - Create roadmap
- `PUT /api/v1/roadmaps/:id` - Update roadmap
- `DELETE /api/v1/roadmaps/:id` - Delete roadmap

### User Progress
- `GET /api/v1/progress` - Get user progress
- `POST /api/v1/progress` - Update progress
- `DELETE /api/v1/progress/:id` - Reset progress

## Testing with Postman

1. Import the API endpoints into Postman
2. Create an environment with `BASE_URL` = `http://localhost:5000/api/v1`
3. Register a new user
4. Save the returned token
5. Use the token in the Authorization header for protected routes

## Testing with cURL

See examples in each endpoint section above.
