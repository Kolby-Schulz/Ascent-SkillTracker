# Authentication Flow - Skill Roadmap Platform

## Overview

The platform uses JWT (JSON Web Token) based authentication for secure, stateless user sessions. This document explains the complete authentication flow from registration to accessing protected resources.

## Authentication Architecture

```
┌─────────┐         ┌─────────┐         ┌──────────┐
│ Browser │ ◄─────► │ React   │ ◄─────► │ Express  │
│         │  HTTP   │ Context │  REST   │ API      │
└─────────┘         └─────────┘         └────┬─────┘
     │                   │                    │
     │              localStorage              │
     │                   │                    ▼
     │                   │              ┌──────────┐
     │                   │              │ MongoDB  │
     │                   │              └──────────┘
     └───────────────────┴─────────────────────────┘
```

## Registration Flow

### Step 1: User Submits Registration Form

**Frontend** (`Register.js`)
```javascript
const response = await registerService({ email, password });
```

### Step 2: API Request

**Frontend** (`authService.js`)
```javascript
POST /api/v1/auth/register
Body: { email, password }
```

### Step 3: Backend Validation

**Backend** (`authValidation.js`)
- Validate email format
- Validate password length (min 6 characters)

### Step 4: Check Existing User

**Backend** (`authController.js`)
```javascript
const userExists = await User.findOne({ email });
if (userExists) throw new ErrorResponse('User already exists', 400);
```

### Step 5: Hash Password

**Backend** (`User.js` model)
```javascript
// Pre-save hook automatically hashes password
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});
```

### Step 6: Create User Record

**Backend** (`authController.js`)
```javascript
const user = await User.create({
  email,
  passwordHash: password, // Will be hashed by pre-save hook
});
```

### Step 7: Generate JWT Token

**Backend** (`jwt.js` utility)
```javascript
const token = jwt.sign({ id: userId }, jwtSecret, {
  expiresIn: '7d'
});
```

### Step 8: Return Response

**Backend** → **Frontend**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "507f...",
      "email": "user@example.com",
      "roles": ["user"]
    }
  }
}
```

### Step 9: Store Token

**Frontend** (`AuthContext.js`)
```javascript
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(userData));
setIsAuthenticated(true);
```

### Step 10: Redirect to Dashboard

**Frontend** (`Register.js`)
```javascript
navigate('/dashboard');
```

---

## Login Flow

### Step 1: User Submits Login Form

**Frontend** (`Login.js`)
```javascript
const response = await loginService({ email, password });
```

### Step 2: API Request

**Frontend** (`authService.js`)
```javascript
POST /api/v1/auth/login
Body: { email, password }
```

### Step 3: Backend Validation

**Backend** (`authValidation.js`)
- Validate email format
- Validate password is present

### Step 4: Find User

**Backend** (`authController.js`)
```javascript
const user = await User.findOne({ email }).select('+passwordHash');
if (!user) throw new ErrorResponse('Invalid credentials', 401);
```

### Step 5: Verify Password

**Backend** (`User.js` model method)
```javascript
const isMatch = await user.matchPassword(password);
if (!isMatch) throw new ErrorResponse('Invalid credentials', 401);
```

### Step 6: Generate JWT Token

Same as registration (Step 7)

### Step 7: Return Response

Same as registration (Step 8)

### Step 8: Store Token

Same as registration (Step 9)

### Step 9: Redirect to Dashboard

Same as registration (Step 10)

---

## Accessing Protected Routes

### Step 1: User Navigates to Protected Page

**Frontend** (`App.js`)
```javascript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

### Step 2: Check Authentication Status

**Frontend** (`ProtectedRoute.js`)
```javascript
const { isAuthenticated, loading } = useAuth();
if (!isAuthenticated) return <Navigate to="/login" />;
```

### Step 3: API Request with Token

**Frontend** (`api.js` interceptor)
```javascript
const token = localStorage.getItem('token');
config.headers.Authorization = `Bearer ${token}`;
```

### Step 4: Backend Extracts Token

**Backend** (`auth.js` middleware)
```javascript
const token = req.headers.authorization.split(' ')[1];
```

### Step 5: Verify Token

**Backend** (`auth.js` middleware)
```javascript
const decoded = jwt.verify(token, jwtSecret);
```

### Step 6: Fetch User

**Backend** (`auth.js` middleware)
```javascript
req.user = await User.findById(decoded.id).select('-passwordHash');
```

### Step 7: Allow Request

**Backend**
```javascript
next(); // Continue to route handler
```

---

## Logout Flow

### Step 1: User Clicks Logout

**Frontend** (`Dashboard.js`)
```javascript
logout(); // From useAuth hook
```

### Step 2: Clear Local Storage

**Frontend** (`AuthContext.js`)
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
setIsAuthenticated(false);
```

### Step 3: Redirect to Home

**Frontend**
- User is automatically redirected due to `isAuthenticated` state change
- ProtectedRoute component prevents access to authenticated pages

---

## Token Expiration Handling

### Automatic Token Check on App Load

**Frontend** (`AuthContext.js`)
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // Verify token is still valid
    const response = await getMe();
    setUser(response.data.user);
  }
}, []);
```

### API Response Interceptor

**Frontend** (`api.js`)
```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
);
```

---

## Security Considerations

### Password Security
- **Hashing**: bcrypt with 10 salt rounds
- **No plain text**: Passwords never stored in plain text
- **Select false**: Password hash not returned by default queries

### JWT Security
- **Signed tokens**: HMAC SHA256 algorithm
- **Secret key**: Strong secret from environment variables
- **Expiration**: Default 7 days, configurable
- **Payload**: Only user ID, no sensitive data

### API Security
- **CORS**: Restricted to frontend origin
- **Helmet**: Security headers middleware
- **Rate limiting**: 100 requests per 10 minutes
- **Input validation**: All inputs validated
- **Error messages**: No sensitive data exposed

### Frontend Security
- **LocalStorage**: Token stored client-side (consider httpOnly cookies for enhanced security)
- **HTTPS**: All production traffic should use HTTPS
- **XSS protection**: React automatically escapes output
- **CSRF**: Not applicable for stateless JWT auth

---

## Role-Based Access Control (Future)

### User Roles
```javascript
roles: ['user'] // Default role
roles: ['user', 'admin'] // Admin role
```

### Authorization Middleware
**Backend** (`auth.js`)
```javascript
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const hasRole = roles.some(role => req.user.roles.includes(role));
    if (!hasRole) throw new ErrorResponse('Not authorized', 403);
    next();
  };
};
```

### Protected Admin Route Example
```javascript
router.post('/admin-only', protect, authorize('admin'), handler);
```

---

## Refresh Token Strategy (Future Enhancement)

### Current: Single Token
- Access token only
- Long expiration (7 days)
- Simple but less secure

### Recommended: Dual Token
1. **Access Token**: Short-lived (15 min)
2. **Refresh Token**: Long-lived (7 days)
3. **Rotation**: New tokens on refresh
4. **Storage**: Refresh token in httpOnly cookie

### Implementation Steps
1. Add refresh token field to User model
2. Create `/auth/refresh` endpoint
3. Update frontend to handle token refresh
4. Implement automatic token refresh before expiration

---

## Testing Authentication

### Manual Testing

1. **Register**: Create a new user via `/register` page
2. **Login**: Login with created credentials
3. **Protected Route**: Navigate to `/dashboard` (should succeed)
4. **Logout**: Click logout button
5. **Protected Route**: Try to access `/dashboard` (should redirect to login)

### API Testing (cURL)

```bash
# Register
TOKEN=$(curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# Access protected route
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Common Issues & Troubleshooting

### Issue: "Not authorized to access this route"
- **Cause**: Missing or invalid token
- **Solution**: Ensure token is included in Authorization header with "Bearer " prefix

### Issue: Token expires too quickly
- **Cause**: Short JWT_EXPIRE value
- **Solution**: Update JWT_EXPIRE in backend/.env (e.g., "7d")

### Issue: CORS error on login
- **Cause**: Frontend origin not allowed
- **Solution**: Update CORS_ORIGIN in backend/.env to match frontend URL

### Issue: Password validation fails
- **Cause**: Password too short
- **Solution**: Ensure password is at least 6 characters

---

## Best Practices

1. **Always use HTTPS in production**
2. **Store JWT secret securely** (environment variables, secrets manager)
3. **Implement rate limiting** to prevent brute force attacks
4. **Use strong passwords** (consider adding complexity requirements)
5. **Consider refresh tokens** for enhanced security
6. **Log authentication events** for security monitoring
7. **Implement account lockout** after failed login attempts (future)
8. **Add email verification** for registration (future)
9. **Implement password reset** functionality (future)
10. **Use httpOnly cookies** instead of localStorage (future enhancement)
