const express = require('express');
const dotenv = require('dotenv');
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

dotenv.config();

connectDB();

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS — allow frontend origin
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

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
