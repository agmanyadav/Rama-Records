import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchSongs, getStaticUrl } from '../api/api';
import { usePlayer } from '../context/PlayerContext';
import Footer from '../components/Footer';

const defaultDsps = { spotify: '#', apple: '#', youtube: '#' };
const fallbackSongs = [
  { _id: '1', title: 'Shaamein', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Shaamein.png', audioFile: '/songs/Shaamein.wav', duration: '2:47', album: 'Rama Records', dsps: defaultDsps },
  { _id: '2', title: 'Aa Bhi Jaa', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Aa Bhi Jaa.png', audioFile: '/songs/Aa Bhi Jaa.wav', duration: '4:15', album: 'Rama Records', dsps: defaultDsps },
  { _id: '3', title: 'Kahani', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Kahani.png', audioFile: '/songs/Kahani.wav', duration: '2:56', album: 'Rama Records', dsps: defaultDsps },
  { _id: '4', title: 'Khwab', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Khwab.png', audioFile: '/songs/Khwab.wav', duration: '3:30', album: 'Rama Records', dsps: defaultDsps },
  { _id: '5', title: 'Paatal Lok', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Paatal Lok.png', audioFile: '/songs/Paatal Lok.wav', duration: '3:30', album: 'Rama Records', dsps: defaultDsps },
];

const SongsPage = () => {
  const [songs, setSongs] = useState(fallbackSongs);
  const [search, setSearch] = useState('');
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const { data } = await fetchSongs();
        if (data && data.length > 0) {
          setSongs(data);
        }
      } catch (err) {
        // Keep fallback data
      }
    };
    loadSongs();
  }, []);

  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artists.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlaySong = (song, index) => {
    const mapped = filteredSongs.map((s) => ({
      ...s,
      audioUrl: getStaticUrl(s.audioFile),
      coverUrl: getStaticUrl(s.coverImage),
    }));
    playSong(mapped[index], mapped, index);
  };

  const isCurrentPlaying = (song) => {
    return currentSong && currentSong.title === song.title && isPlaying;
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">ALL SONGS</h1>
      </div>

      {/* Search */}
      <div className="flex justify-center py-6 bg-gray-100">
        <div className="relative w-full max-w-md px-4">
          <i className="fas fa-search absolute left-7 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search songs, artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-800 shadow-sm"
          />
        </div>
      </div>

      {/* Song List */}
      <div className="max-w-6xl mx-auto px-4 pb-32">
        {/* Header Row */}
        <div className="flex items-center space-x-4 py-3 px-4 bg-gray-200 rounded-lg mb-2 text-sm font-medium text-gray-600">
          <div className="w-10 text-center">#</div>
          <div className="flex-1">Title</div>
          <div className="w-1/4 hidden md:block">Album</div>
          <div className="w-28 text-center hidden sm:block">Listen on</div>
          <div className="w-12 text-right">
            <i className="far fa-clock"></i>
          </div>
        </div>

        {/* Songs */}
        {filteredSongs.map((song, index) => (
          <motion.div
            key={song._id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center space-x-4 py-3 px-4 rounded-lg group cursor-pointer transition-colors ${
              isCurrentPlaying(song) ? 'bg-yellow-50 border border-yellow-200' : 'hover:bg-gray-200 border border-transparent'
            }`}
            onClick={() => handlePlaySong(song, index)}
          >
            <div className="w-10 text-center text-gray-500">
              <span className="group-hover:hidden">{index + 1}</span>
              <button className="hidden group-hover:block w-full">
                <i className={`fas ${isCurrentPlaying(song) ? 'fa-pause' : 'fa-play'} text-yellow-500`}></i>
              </button>
            </div>
            <div className="flex-1 flex items-center space-x-3 min-w-0">
              <img
                src={getStaticUrl(song.coverImage)}
                alt={song.title}
                className="w-10 h-10 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <h3 className={`font-medium truncate ${isCurrentPlaying(song) ? 'text-yellow-600' : 'text-gray-800'}`}>
                  {song.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">{song.artists}</p>
              </div>
            </div>
            <div className="w-1/4 text-gray-500 text-sm hidden md:block truncate">
              {song.album || 'Rama Records'}
            </div>
            
            {/* DSP Links */}
            <div className="w-28 text-center hidden sm:flex justify-center space-x-4 text-gray-400 text-lg">
              {song.dsps?.spotify && (
                <a href={song.dsps.spotify} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-green-500 transition-colors" title="Listen on Spotify">
                  <i className="fab fa-spotify"></i>
                </a>
              )}
              {song.dsps?.apple && (
                <a href={song.dsps.apple} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-gray-900 transition-colors" title="Listen on Apple Music">
                  <i className="fab fa-apple"></i>
                </a>
              )}
              {song.dsps?.youtube && (
                <a href={song.dsps.youtube} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-red-500 transition-colors" title="Listen on YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              )}
            </div>

            <div className="w-12 text-right text-gray-500 text-sm">{song.duration}</div>
          </motion.div>
        ))}

        {filteredSongs.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <i className="fas fa-search text-3xl mb-3 block"></i>
            No songs found matching "{search}"
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SongsPage;
