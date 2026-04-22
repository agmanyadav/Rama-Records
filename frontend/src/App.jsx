import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Navbar';
import AudioPlayer from './components/AudioPlayer';
import HomePage from './pages/HomePage';
import SongsPage from './pages/SongsPage';
import BeatsPage from './pages/BeatsPage';
import GalleryPage from './pages/GalleryPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/beats" element={<BeatsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
        <AudioPlayer />
      </Router>
    </PlayerProvider>
  );
}

export default App;
