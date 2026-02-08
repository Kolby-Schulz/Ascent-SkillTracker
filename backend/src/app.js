const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const guideRoutes = require('./routes/guideRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const userSkillProgressRoutes = require('./routes/userSkillProgressRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const friendRoutes = require('./routes/friendRoutes');
const postRoutes = require('./routes/postRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Trust proxy (dev server forwards requests with X-Forwarded-For)
app.set('trust proxy', 1);

// CORS (supports single origin or array) - must be before other middleware
app.use(
  cors({
    origin: Array.isArray(config.corsOrigin) ? config.corsOrigin : config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Security middleware (configured to work with CORS)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (very lenient for development)
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development mode or for auth routes
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    // Skip rate limiting for auth routes (they have their own limiter in authRoutes.js)
    return req.path.startsWith('/api/v1/auth');
  },
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/guides', guideRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/user-skills', userSkillProgressRoutes);
app.use('/api/v1/roadmaps', roadmapRoutes);
app.use('/api/v1/friends', friendRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/progress', require('./routes/progressRoutes'));
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
