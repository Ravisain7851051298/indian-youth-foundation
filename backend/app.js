const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Ensure uploads folder and category directories exist
const { uploadDir, ensureAllCategoryDirs } = require('./utils/fileCleaner');
const uploadsPath = uploadDir;
ensureAllCategoryDirs();

// Allowed Origins for Credentials Support
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

// CORS Middleware with credentials enabled (Required for HTTP-Only Cookie auth)
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server) or matched origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-admin-secret-key',
    'X-Admin-Secret-Key',
    'X-ADMIN-SECRET-KEY',
    'x-upload-category',
    'X-Upload-Category',
    'x-category',
    'X-Category',
    'Accept',
    'X-Requested-With'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}));

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Global Rate Limiting: 500 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Strict Rate Limiting on Authentication & Sensitive Endpoints:
// Only counts failed attempts or limits repeated attempts, avoiding blocking valid users
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Generous limit for normal user actions
  skipSuccessfulRequests: true, // Only failed logins/requests count towards the limit!
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.'
  }
});

// Apply rate limiting middleware
app.use('/api', apiLimiter);
app.post('/api/auth/login', authLimiter);
app.post('/api/auth/register', authLimiter);
app.post('/api/auth/forgot-password', authLimiter);
app.post('/api/auth/reset-password', authLimiter);
app.post('/api/auth/create-admin', authLimiter);

// Cookie Parser Middleware
app.use(cookieParser());

// Body Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory serving
app.use('/uploads', express.static(uploadsPath));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    ngo: 'भारतीय युवा क्रांति'
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;
