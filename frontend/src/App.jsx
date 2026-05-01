import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import ThemeToggle from './components/ThemeToggle';
import HomePage from './pages/HomePage';
import SongsPage from './pages/SongsPage';
import GalleryPage from './pages/GalleryPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ReleasesPage from './pages/ReleasesPage';
import ScrollToHash from './components/ScrollToHash';
import './App.css';

function App() {
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
          </Routes>
          <AudioPlayer />
        </Router>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
