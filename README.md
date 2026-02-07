# Hacklahoma-2026

# Skill Roadmap Platform — Full Stack Dockerized Architecture

You are helping scaffold a full-stack, production-ready, fully dockerized web application.

This README serves as the authoritative architecture and generation guide. Follow it to generate clean, scalable, modular code.

---

## Project Overview

We are building a responsive web application (desktop + mobile) that provides users with a visual, interactive roadmap for learning new skills.

Users select a skill (e.g., Guitar, Web Development, Photography), and the platform displays a structured, hierarchical roadmap of sub-skills required to master that skill.

Example for Guitar:
- Holding the guitar and pick
- Tuning the guitar
- Basic chords
- Strumming patterns
- Reading tabs
- Rhythm basics

Each skill is composed of ordered sub-skills (nodes) that can later be expanded, tracked, and visualized.

This foundation should be designed for future expansion (admin tools, skill editors, progress tracking, collaboration, recommendations), but DO NOT implement those yet.

---

## Tech Stack

### Frontend
- React
- Framer Motion
- Mobile-first responsive UI
- Component-based architecture
- Auth state management
- API service abstraction

### Backend
- Node.js
- Express.js
- REST API
- Modular folder structure
- JWT authentication
- Password hashing
- Middleware-based architecture

### Database
- MongoDB (Docker container)
- Mongoose ODM
- Scalable schema design

### Infrastructure
- Fully Dockerized
- docker-compose for local development
- Separate containers for:
  - frontend
  - backend
  - mongodb
- Persistent MongoDB volume
- Environment variables
- Cloud-deployment ready

---

## Required Top-Level Folder Structure

Generate and enforce this structure:

/
frontend/
backend/
scripts/
config/
docs/
docker-compose.yml
.env.example
README.md


---

## Core Features to Implement First

### 1. Authentication System
Implement a production-grade auth system with:

- User registration
- User login
- JWT-based authentication
- Password hashing (bcrypt)
- Auth middleware
- Protected routes
- Role-ready architecture (future admin, etc)
- Refresh-token ready architecture (even if not fully implemented)

---

### 2. Backend Architecture

Use a clean, scalable Express architecture:

backend/
src/
app.js
server.js
config/
controllers/
routes/
services/
models/
middlewares/
utils/
validations/


Requirements:
- Centralized error handling
- Request validation layer
- JWT utilities
- Auth middleware
- Environment-based config
- API versioning ready (/api/v1)

---

### 3. Frontend Architecture

Use a scalable React structure:

frontend/
src/
components/
pages/
layouts/
hooks/
context/
services/
routes/
animations/
styles/


Requirements:
- AuthContext provider
- ProtectedRoute component
- API service abstraction layer
- Login/Register pages
- Framer Motion page transitions
- Mobile-first responsive layout
- Clean separation of UI and data logic

---

### 4. Database Schema (Future-Ready)

Implement initial schemas with future expansion in mind:

#### User
- email (unique)
- passwordHash
- roles
- createdAt

#### Skill (future)
- name
- description
- category
- createdBy

#### Roadmap (future)
- skillId
- title
- orderedNodes

#### RoadmapNode / SubSkill (future)
- roadmapId
- title
- description
- order
- parentNodeId (for hierarchy)

Only fully implement User for now, but scaffold the others as placeholders.

---

## Docker Requirements

Generate:

### docker-compose.yml
Services:
- frontend
- backend
- mongodb

Requirements:
- Shared network
- MongoDB volume persistence
- Env file support
- Port mapping for dev

### Dockerfiles
- frontend/Dockerfile
- backend/Dockerfile

Requirements:
- Multi-stage builds where appropriate
- Dev + prod ready structure

---

## Config & Scripts

### config/
- Environment templates
- Shared constants
- App-level configuration

### scripts/
- Dev startup scripts
- Database seeding placeholders
- Migration placeholders

---

## Documentation

### docs/
Include:
- architecture.md
- api-spec.md
- auth-flow.md
- docker-setup.md

---

## API Design Standards

- RESTful endpoints
- Versioned routes (/api/v1)
- Consistent JSON response format
- Centralized error structure
- Auth middleware separation
- Clear controller/service separation

Example:
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/me


---

## Frontend Design Standards

- Mobile-first
- Component reusability
- Framer Motion for transitions and roadmap animation foundation
- Central API client
- Context-based auth state
- Route guards

---

## Security & Best Practices

- Never store plain-text passwords
- JWT secrets via env vars
- CORS configured properly
- Rate limiting ready
- Helmet middleware
- Input validation
- Centralized logging ready

---

## What to Generate

Generate:

1. Full folder structures
2. docker-compose.yml
3. Backend Dockerfile
4. Frontend Dockerfile
5. Express server bootstrap
6. MongoDB connection setup
7. User model
8. Auth routes
9. Auth controllers
10. Auth middleware
11. JWT utility
12. Password hashing utility
13. React app bootstrap
14. AuthContext
15. API client abstraction
16. Login/Register UI
17. ProtectedRoute
18. Example .env files
19. Documentation stubs in docs/
20. Setup & run instructions

---

## Explicit Non-Goals (For Now)

DO NOT:
- Implement AI
- Implement roadmap editing UI
- Implement admin dashboard
- Implement progress tracking
- Over-engineer prematurely

---

## Architectural Principles

- Highly modular
- Scalable
- Easy to extend
- Clear separation of concerns
- Future-proofed
- Production-minded

---

## Goal

This README defines a strong, real-world foundation for a serious, scalable product. Generate clean, maintainable, professional-grade code and configuration following this guide.

Explain major architectural decisions briefly where appropriate.