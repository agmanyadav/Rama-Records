import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchFeaturedSongs, getStaticUrl } from '../api/api';
import { usePlayer } from '../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

const fallbackSongs = [
  { _id: '1', title: 'Shaamein', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Shaamein.png', audioFile: '/songs/Shaamein.wav', duration: '2:47' },
  { _id: '2', title: 'Aa Bhi Jaa', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Aa Bhi Jaa.png', audioFile: '/songs/Aa Bhi Jaa.wav', duration: '4:15' },
  { _id: '3', title: 'Kahani', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Kahani.png', audioFile: '/songs/Kahani.wav', duration: '2:56' },
  { _id: '4', title: 'Khwab', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Khwab.png', audioFile: '/songs/Khwab.wav', duration: '3:30' },
  { _id: '5', title: 'Paatal Lok', artists: 'Anurag Dhimaan & Akshay Tyagi', coverImage: '/images/songs_thumbnails/Paatal Lok.png', audioFile: '/songs/Paatal Lok.wav', duration: '3:30' },
];

const SongCarousel = () => {
  const [songs, setSongs] = useState(fallbackSongs);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const { playSong, setPlaylist } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const { data } = await fetchFeaturedSongs();
        if (data && data.length > 0) {
          setSongs(data);
        }
      } catch (err) {
        // Keep fallback data
      }
    };
    loadSongs();
  }, []);

  useEffect(() => {
    if (songs.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % songs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [songs.length]);

  const goTo = (dir) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + songs.length) % songs.length);
  };

  const handlePlay = () => {
    if (songs.length === 0) return;
    const mapped = songs.map((s) => ({
      ...s,
      audioUrl: getStaticUrl(s.audioFile),
      coverUrl: getStaticUrl(s.coverImage),
    }));
    playSong(mapped[current], mapped, current);
  };

  const handleGoToSongs = () => {
    navigate('/songs');
  };

  if (songs.length === 0) return null;

  const song = songs[current];

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.9, transition: { duration: 0.3 } }),
  };

  return (
    <section id="songs" className="py-20 px-6 bg-gray-100 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center text-yellow-500 section-title">
          Latest Releases
        </h3>

        <div className="flex flex-col items-center">
          <div className="relative w-72 h-72 md:w-80 md:h-80 mb-6">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 cursor-pointer"
                onClick={handleGoToSongs}
              >
                <img
                  src={getStaticUrl(song.coverImage)}
                  alt={song.title}
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 rounded-2xl transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePlay(); }}
                    className="bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <i className="fas fa-play text-gray-900 text-xl ml-1"></i>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p
            key={`title-${current}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center font-semibold text-yellow-600 text-xl mb-2"
          >
            {song.title}
          </motion.p>
          <p className="text-gray-600 text-sm mb-4">{song.artists}</p>

          <div className="flex space-x-4 mb-6">
            <i className="fab fa-spotify text-2xl text-yellow-500 hover:text-gray-800 cursor-pointer transition-colors"></i>
            <i className="fab fa-apple text-2xl text-yellow-500 hover:text-gray-800 cursor-pointer transition-colors"></i>
            <i className="fab fa-youtube text-2xl text-yellow-500 hover:text-gray-800 cursor-pointer transition-colors"></i>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => goTo(-1)}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-full text-xl transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <button
              onClick={() => goTo(1)}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-full text-xl transition-all duration-300 transform hover:scale-110 shadow-md"
            >
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-6">
            {songs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === current ? 'bg-yellow-500 scale-125' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SongCarousel;
