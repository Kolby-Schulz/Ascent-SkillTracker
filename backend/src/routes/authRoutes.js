const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { register, login, getMe, getUserProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const {
  registerValidation,
  loginValidation,
} = require('../validations/authValidation');

// More lenient rate limiter for auth routes (development-friendly)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 login/register attempts per 15 minutes (very lenient for dev)
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // In development, allow unlimited attempts
    return process.env.NODE_ENV === 'development';
  },
});

// Public routes
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/user/:userId', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
