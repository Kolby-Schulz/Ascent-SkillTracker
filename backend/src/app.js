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

const app = express();

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
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
