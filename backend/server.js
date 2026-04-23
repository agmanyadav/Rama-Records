const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load env vars BEFORE importing routes/controllers that use them

const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db.js');

const songRoutes = require('./routes/songRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const contactRoutes = require('./routes/contactRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const beatRoutes = require('./routes/beatRoutes.js');
const galleryRoutes = require('./routes/galleryRoutes.js');
const serviceRoutes = require('./routes/serviceRoutes.js');

connectDB();

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS — allow frontend origin(s). Supports comma-separated FRONTEND_URL.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').map(url => url.trim()).forEach(url => allowedOrigins.push(url));
}
console.log('Allowed CORS origins:', allowedOrigins);
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// Rate limiter for public form submissions (prevent spam)
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 submissions per 15 minutes per IP
    message: { message: 'Too many submissions, please try again later.' },
});

// Main Routes
app.use('/api/songs', songRoutes);
app.use('/api/bookings', formLimiter, bookingRoutes);
app.use('/api/contact', formLimiter, contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/beats', beatRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/services', serviceRoutes);

// Protect audio files from direct download
app.use('/songs', (req, res, next) => {
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});
app.use('/beats', (req, res, next) => {
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Make public folder accessible
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('API is running....');
});

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server running on port ${PORT}`)
);
