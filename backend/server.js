const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load env vars BEFORE importing routes/controllers that use them

const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const connectDB = require('./config/db.js');

const songRoutes = require('./routes/songRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const contactRoutes = require('./routes/contactRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const galleryRoutes = require('./routes/galleryRoutes.js');
const serviceRoutes = require('./routes/serviceRoutes.js');
const releaseRoutes = require('./routes/releaseRoutes.js');
const userBookingRoutes = require('./routes/userBookingRoutes.js');

connectDB();

const app = express();

// Trust the reverse proxy (Render load balancers) so rate limiting works correctly per-IP
app.set('trust proxy', 1);

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS — allow frontend origin(s). Supports comma-separated FRONTEND_URL.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/+$/, '')).forEach(url => allowedOrigins.push(url));
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

// Main Routes
app.use('/api/songs', songRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/releases', releaseRoutes);
app.use('/api/user', userBookingRoutes);

// Protect audio files from direct download
app.use('/songs', (req, res, next) => {
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
