const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
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
    ngo: 'भारतीय युवा क्रांति (Indian Youth Foundation)' 
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
