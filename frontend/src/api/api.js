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
export const uploadFiles = (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Bookings
export const createBooking = (bookingData) => api.post('/bookings', bookingData);
export const fetchBookings = () => api.get('/bookings');
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

// Beats
export const fetchBeats = () => api.get('/beats');
export const fetchFeaturedBeats = () => api.get('/beats/featured');
export const createBeat = (beatData) => api.post('/beats', beatData);
export const deleteBeat = (id) => api.delete(`/beats/${id}`);

// Gallery
export const fetchGallery = () => api.get('/gallery');
export const fetchFeaturedGallery = () => api.get('/gallery/featured');
export const createGallery = (galleryData) => api.post('/gallery', galleryData);
export const deleteGallery = (id) => api.delete(`/gallery/${id}`);

// Services
export const fetchServices = () => api.get('/services');
export const fetchFeaturedServices = () => api.get('/services/featured');
export const createService = (serviceData) => api.post('/services', serviceData);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Contact
export const createContact = (contactData) => api.post('/contact', contactData);
export const fetchContacts = () => api.get('/contact');

// Auth
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const googleLogin = (credential) => api.post('/auth/google', { credential });
export const getUserProfile = () => api.get('/auth/profile');

// Helper to get full static URL
export const getStaticUrl = (path) => `${STATIC_BASE_URL}${path}`;

export default api;
