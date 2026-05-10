import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STATIC_BASE_URL = import.meta.env.VITE_STATIC_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Songs
export const fetchSongs = () => api.get('/songs');
export const fetchFeaturedSongs = () => api.get('/songs/featured');
export const fetchSongById = (id) => api.get(`/songs/${id}`);
export const createSong = (songData) => api.post('/songs', songData);
export const updateSong = (id, songData) => api.put(`/songs/${id}`, songData);
export const deleteSong = (id) => api.delete(`/songs/${id}`);
export const uploadFiles = (formData) => api.post('/upload', formData);

// Bookings
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const fetchBookings = () => api.get('/bookings');
export const updateBookingStatus = (id, status, adminReply) => api.put(`/bookings/${id}/status`, { status, adminReply });
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);




// Gallery
export const fetchGallery = () => api.get('/gallery');
export const fetchFeaturedGallery = () => api.get('/gallery/featured');
export const createGallery = (galleryData) => api.post('/gallery', galleryData);
export const updateGallery = (id, galleryData) => api.put(`/gallery/${id}`, galleryData);
export const deleteGallery = (id) => api.delete(`/gallery/${id}`);

// Services
export const fetchServices = () => api.get('/services');
export const fetchFeaturedServices = () => api.get('/services/featured');
export const createService = (serviceData) => api.post('/services', serviceData);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Releases
export const fetchReleases = () => api.get('/releases');
export const createRelease = (releaseData) => api.post('/releases', releaseData);
export const updateRelease = (id, releaseData) => api.put(`/releases/${id}`, releaseData);
export const deleteRelease = (id) => api.delete(`/releases/${id}`);

// Contact
export const createContact = (contactData) => api.post('/contact', contactData);
export const fetchContacts = () => api.get('/contact');
export const deleteContact = (id) => api.delete(`/contact/${id}`);

// Auth
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const googleLogin = (credential) => api.post('/auth/google', { credential });
export const getUserProfile = () => api.get('/auth/profile');
export const updateUserProfile = (profileData) => api.put('/auth/profile', profileData);

// User Bookings
export const fetchUserBookings = () => api.get('/user/bookings');

// Helper to get full static URL — handles both Cloudinary URLs and legacy relative paths
export const getStaticUrl = (path) => {
  if (!path) return '';
  // If it's already a full URL (Cloudinary, etc.), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  // If it's an image path, return as-is to load directly from frontend's public/images folder
  // This bypasses the backend 30s cold start for static landing page images
  if (path.startsWith('/images/')) return path;

  // Otherwise, prepend the backend static URL (e.g. for /songs/)
  return `${STATIC_BASE_URL}${path}`;
};

export default api;
