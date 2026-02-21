# Full Tech Stack - Ascent Platform

## Project Overview
**Ascent** - A skill learning platform that helps users "Reach New Heights" through structured learning roadmaps with a mountain/climbing theme.

---

## Frontend Stack

### Core Framework
- **React** `^18.2.0` - UI library
- **React DOM** `^18.2.0` - DOM rendering
- **React Router DOM** `^6.21.1` - Client-side routing

### Animation & UI
- **Framer Motion** `^10.16.16` - Animations and transitions
  - Page transitions
  - Component animations
  - Interactive UI elements

### Internationalization (i18n)
- **i18next** `^25.8.4` - Internationalization framework
- **react-i18next** `^16.5.4` - React bindings for i18next
- **i18next-browser-languagedetector** `^8.2.0` - Language detection
- **Supported Languages**: English, Spanish

### HTTP Client
- **Axios** `^1.6.5` - HTTP requests to backend API

### Build Tools
- **React Scripts** `5.0.1` - Create React App build tooling
- **Node.js** - Runtime environment

### Frontend Architecture
```
frontend/src/
├── components/        # Reusable UI components
│   ├── Achievements.js
│   ├── CodePlayground.js
│   ├── ConfirmationModal.js
│   ├── DashboardLayout.js
│   ├── DayNightCycle.js
│   ├── FloatingParticles.js
│   ├── Notification.js
│   ├── PeakReached.js
│   ├── SkillTimeline.js
│   └── ...
├── context/           # React Context providers
│   ├── AuthContext.js
│   ├── SkillsContext.js
│   └── ThemeContext.js
├── pages/             # Page components
│   ├── Dashboard.js
│   ├── Friends.js
│   ├── Profile.js
│   ├── Settings.js
│   ├── LearnSkill.js
│   └── ...
├── services/          # API service layer
│   ├── api.js
│   ├── authService.js
│   ├── friendService.js
│   └── ...
├── utils/            # Utility functions
│   ├── achievements.js
│   └── skillProgress.js
├── i18n/             # i18n configuration
│   └── config.js
└── locales/          # Translation files
    ├── en/
    └── es/
```

---

## Backend Stack

### Runtime & Framework
- **Node.js** - JavaScript runtime
- **Express.js** `^4.18.2` - Web framework

### Database
- **MongoDB** `7.0` - NoSQL database (Docker container)
- **Mongoose** `^8.0.3` - MongoDB ODM (Object Document Mapper)

### Authentication & Security
- **jsonwebtoken** `^9.0.2` - JWT token generation/verification
- **bcryptjs** `^2.4.3` - Password hashing
- **Helmet** `^7.1.0` - Security headers middleware
- **CORS** `^2.8.5` - Cross-Origin Resource Sharing
- **express-rate-limit** `^7.1.5` - Rate limiting

### Validation & Middleware
- **express-validator** `^7.0.1` - Request validation
- **dotenv** `^16.3.1` - Environment variable management

### Development Tools
- **Nodemon** `^3.0.2` - Auto-restart on file changes

### Backend Architecture
```
backend/src/
├── app.js              # Express app configuration
├── server.js            # Server entry point
├── config/              # Configuration
│   ├── database.js     # MongoDB connection
│   └── index.js        # App config
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── friendController.js
│   ├── roadmapController.js
│   └── ...
├── models/              # Mongoose schemas
│   ├── User.js
│   ├── Roadmap.js
│   ├── Friend.js
│   └── ...
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── friendRoutes.js
│   └── ...
├── middlewares/         # Custom middleware
│   ├── auth.js         # JWT authentication
│   └── errorHandler.js
├── validations/         # Request validation
│   ├── authValidation.js
│   └── roadmapValidation.js
├── utils/               # Utility functions
│   ├── jwt.js
│   └── errorResponse.js
├── scripts/             # Utility scripts
│   └── seedSkillTracks.js
└── data/                # Seed data
    ├── skillTracksSeed.json
    └── README.md
```

---

## Database

### MongoDB Collections
- **Users** - User accounts, authentication, profiles
- **Roadmaps** - Skill learning paths
- **Friends** - Friend relationships
- **Posts** - Social feed posts
- **Guides** - User-created guides
- **UserSkillProgress** - Progress tracking

### Database Features
- Persistent volumes via Docker
- Indexed queries for performance
- Embedded documents (sub-skills, resources)
- Population for related data

---

## DevOps & Infrastructure

### Containerization
- **Docker** - Container platform
- **Docker Compose** - Multi-container orchestration

### Services
1. **Frontend Container**
   - Node.js Alpine base image
   - React development server
   - Port: 3000
   - Hot reload enabled

2. **Backend Container**
   - Node.js Alpine base image
   - Express development server
   - Port: 5001 (mapped from 5000)
   - Auto-restart with nodemon

3. **MongoDB Container**
   - MongoDB 7.0 official image
   - Port: 27017
   - Persistent volume storage

### Networking
- Custom bridge network: `skill-roadmap-network`
- Service discovery via container names
- CORS configured for localhost:3000 and localhost:3001

---

## UI/UX Technologies

### CSS Features
- **CSS3 Animations** - Keyframe animations
- **CSS Gradients** - Background gradients
- **CSS Variables** - Dynamic theming
- **Backdrop Filter** - Glass morphism effects
- **Flexbox & Grid** - Layout systems
- **Media Queries** - Responsive design

### Visual Effects
- **Day/Night Cycle** - Animated sky with sun/moon
- **Floating Particles** - Canvas-based particle system
- **Glass Morphism** - Frosted glass UI elements
- **Gradient Overlays** - Dynamic color transitions
- **Smooth Transitions** - Cubic-bezier easing functions

---

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Helmet security headers
- Rate limiting
- Input validation
- Protected API routes
- Environment variable secrets

---

## Key Features Implemented

### User Features
- User registration & login
- Profile management
- Privacy settings (public/private)
- Friend system (add, accept, remove)
- Social feed
- Skill progress tracking
- Achievements & streaks
- Multi-language support (EN/ES)

### Learning Features
- Skill roadmaps with sub-skills
- Progress tracking
- Resource links (videos, articles)
- Code playgrounds
- Skill timeline visualization
- Published/community roadmaps

### UI Features
- Responsive design (mobile & desktop)
- Dark theme with day/night cycle
- Animated transitions
- Floating particles background
- Achievement badges
- Notification system
- Confirmation modals

---

## Development Tools

### Version Control
- **Git** - Source control
- **GitHub** - Remote repository

### Package Management
- **npm** - Node package manager
- **package.json** - Dependency management

### Scripts
- `npm start` - Start development server
- `npm run dev` - Backend with auto-reload
- `npm run seed` - Populate seed data
- `npm run build` - Production build

---

## Platform Support

### Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Devices
- Desktop (responsive)
- Tablet (responsive)
- Mobile (responsive)

---

## API Architecture

### Base URL
- Development: `http://localhost:5001/api/v1`
- Production: Configurable via environment variables

### API Endpoints
- **Auth**: `/api/v1/auth/*`
  - POST `/register`
  - POST `/login`
  - GET `/me`
  - PUT `/profile`

- **Roadmaps**: `/api/v1/roadmaps/*`
  - GET `/` - Get all published roadmaps
  - GET `/:id` - Get single roadmap
  - POST `/` - Create roadmap
  - PUT `/:id` - Update roadmap
  - DELETE `/:id` - Delete roadmap
  - PUT `/:id/publish` - Publish roadmap

- **Friends**: `/api/v1/friends/*`
  - GET `/` - Get friends list
  - POST `/request` - Send friend request
  - PUT `/request/:id` - Accept request
  - DELETE `/:id` - Remove friend

- **Posts**: `/api/v1/posts/*`
  - GET `/feed` - Get social feed
  - POST `/` - Create post

---

## Design Patterns Used

- **MVC Architecture** - Model-View-Controller
- **RESTful API** - REST principles
- **Context API** - React state management
- **Service Layer** - API abstraction
- **Middleware Pattern** - Express middleware
- **Component Composition** - React components
- **Custom Hooks** - Reusable logic

---

## Data Flow

```
User Action
    ↓
React Component
    ↓
Service Layer (axios)
    ↓
Express Route
    ↓
Middleware (auth, validation)
    ↓
Controller
    ↓
Model (Mongoose)
    ↓
MongoDB
```

---

## Deployment Ready

- Dockerized for easy deployment
- Environment variable configuration
- Production build scripts
- Database migration ready
- Error handling & logging
- Security best practices

---

## Additional Libraries & Tools

### Frontend Utilities
- **LocalStorage** - Client-side data persistence
- **Canvas API** - Particle animations
- **SVG** - Vector graphics (mountain icons, etc.)

### Backend Utilities
- **Mongoose Virtuals** - Computed properties
- **Mongoose Indexes** - Query optimization
- **Express Error Handling** - Centralized error management

---

## Theme & Styling

- **Color Scheme**: Dark theme with purple/gold accents
- **Typography**: System fonts with custom weights
- **Spacing**: Consistent rem/px units
- **Animations**: 60-90s cycles for day/night
- **Effects**: Glass morphism, gradients, shadows

---

This is a **full-stack MERN application** (MongoDB, Express, React, Node.js) with Docker containerization, internationalization, and a comprehensive feature set for skill learning and social interaction.
