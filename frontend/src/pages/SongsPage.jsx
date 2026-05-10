import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { getStaticUrl } from '../api/api';
import { usePlayer } from '../context/PlayerContext';
import { fetchAllSongs } from '../store/songsSlice';
import Footer from '../components/common/Footer';

const SongsPage = () => {
  const dispatch = useDispatch();
  const songs = useSelector((state) => state.songs.all);
  const allStatus = useSelector((state) => state.songs.allStatus);
  const [search, setSearch] = useState('');
  
  const loading = allStatus === 'loading' || allStatus === 'idle';
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    if (allStatus === 'idle') {
      dispatch(fetchAllSongs());
    }
  }, [allStatus, dispatch]);

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
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <h1 className="text-3xl font-bold text-white tracking-tight">SONGS</h1>
      </div>

      {/* Search */}
      <div className="flex justify-center py-6 bg-black">
        <div className="relative w-full max-w-md px-4">
          <i className="fas fa-search absolute left-7 top-1/2 -translate-y-1/2 text-white"></i>
          <input
            type="text"
            placeholder="Search songs, artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-yellow-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-black text-white shadow-sm"
          />
        </div>
      </div>

      {/* Song List */}
      <div className="max-w-6xl mx-auto px-4 pb-32">
        {/* Header Row */}
        <div className="flex items-center space-x-4 py-3 px-4 bg-black rounded-lg mb-2 text-sm font-medium text-white">
          <div className="w-10 text-center">#</div>
          <div className="flex-1">Title</div>
          <div className="w-1/4 hidden md:block">Album</div>
          <div className="w-28 text-center hidden sm:block">Listen on</div>
          <div className="w-12 text-right">
            <i className="far fa-clock"></i>
          </div>
        </div>

        {/* Songs */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-yellow-500">
            <i className="fas fa-spinner fa-spin text-4xl"></i>
          </div>
        ) : (
          <>
            {filteredSongs.map((song, index) => (
              <motion.div
                key={song._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center space-x-4 py-3 px-4 rounded-lg group cursor-pointer transition-colors ${
                  isCurrentPlaying(song) ? 'bg-yellow-500/10 border border-yellow-500/30' : 'hover:bg-yellow-500/10 border border-transparent'
                }`}
                onClick={() => handlePlaySong(song, index)}
              >
                <div className="w-10 text-center text-white">
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
                    <h3 className={`font-medium truncate ${isCurrentPlaying(song) ? 'text-yellow-500' : 'text-white'}`}>
                      {song.title}
                    </h3>
                    <p className="text-sm text-white truncate">{song.artists}</p>
                  </div>
                </div>
                <div className="w-1/4 text-white text-sm hidden md:block truncate">
                  {song.album || 'Rama Records'}
                </div>
                
                {/* DSP Links */}
                <div className="w-28 text-center hidden sm:flex justify-center space-x-4 text-white text-lg">
                  {song.dsps?.spotify && (
                    <a href={song.dsps.spotify} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-yellow-500 transition-colors" title="Listen on Spotify">
                      <i className="fab fa-spotify"></i>
                    </a>
                  )}
                  {song.dsps?.apple && (
                    <a href={song.dsps.apple} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-white transition-colors" title="Listen on Apple Music">
                      <i className="fab fa-apple"></i>
                    </a>
                  )}
                  {song.dsps?.youtube && (
                    <a href={song.dsps.youtube} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-red-500 transition-colors" title="Listen on YouTube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  )}
                </div>

                <div className="w-12 text-right text-white text-sm">{song.duration}</div>
              </motion.div>
            ))}

            {filteredSongs.length === 0 && (
              <div className="text-center py-10 text-white">
                <i className="fas fa-search text-3xl mb-3 block"></i>
                No songs found matching "{search}"
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SongsPage;
