import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PlayerProvider } from './context/PlayerContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/common/Navbar';
import AudioPlayer from './components/common/AudioPlayer';
import ThemeToggle from './components/common/ThemeToggle';
import HomePage from './pages/HomePage';
import SongsPage from './pages/SongsPage';
import GalleryPage from './pages/GalleryPage';
import ReleasesPage from './pages/ReleasesPage';
import ScrollToHash from './components/common/ScrollToHash';

// Admin pages (moved to admin directory)
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';

// User pages
import UserLogin from './user/pages/UserLogin';
import UserDashboard from './user/pages/UserDashboard';

// Redux thunks for pre-loading
import { fetchFeatured } from './store/songsSlice';
import { fetchFeaturedGalleryThunk } from './store/gallerySlice';

import './App.css';

function App() {
  const dispatch = useDispatch();

  // Pre-load featured data on app mount for instant rendering
  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchFeaturedGalleryThunk());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <PlayerProvider>
        <Router>
          <ScrollToHash />
          <Navbar />
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/songs" element={<SongsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/releases" element={<ReleasesPage />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Routes>
          <AudioPlayer />
        </Router>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
