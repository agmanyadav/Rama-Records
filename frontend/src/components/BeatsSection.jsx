import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchFeaturedBeats, getStaticUrl } from '../api/api';
import { usePlayer } from '../context/PlayerContext';

const BeatsSection = () => {
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    const loadFeaturedBeats = async () => {
      try {
        const { data } = await fetchFeaturedBeats();
        setBeats(data.slice(0, 4)); // Show max 4 on homepage
      } catch (err) {
        console.error('Failed to load featured beats', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedBeats();
  }, []);

  const playlist = beats.map((b) => ({
    id: b._id,
    title: b.title,
    artist: b.tags || 'Rama Records',
    coverImage: getStaticUrl(b.coverImage),
    audioUrl: getStaticUrl(b.audioFile),
  }));

  const handlePlay = (beat, index) => {
    if (currentSong?.id === beat._id) {
      togglePlay();
    } else {
      const formattedBeat = playlist[index];
      playSong(formattedBeat, playlist, index);
    }
  };

  if (!loading && beats.length === 0) return null; // Don't render section if empty

  return (
    <section id="beats" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Latest <span className="text-yellow-500">Beats</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Featured instrumentals. Check out the full catalog for more.</p>
        </div>

        {loading ? (
            <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-yellow-500 text-3xl"></i></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {beats.map((beat, index) => {
                const isCurrentPlaying = currentSong?.id === beat._id && isPlaying;
                return (
                <motion.div
                    key={beat._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 group ${
                    currentSong?.id === beat._id ? 'border-yellow-500 shadow-md shadow-yellow-500/20' : 'border-gray-200 hover:border-yellow-500/50 hover:shadow-sm'
                    }`}
                >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                        src={getStaticUrl(beat.coverImage)}
                        alt={beat.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                            onClick={() => handlePlay(beat, index)}
                            className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform cursor-pointer"
                        >
                            <i className={`fas ${isCurrentPlaying ? 'fa-pause' : 'fa-play'} text-gray-900 pl-${isCurrentPlaying ? '0' : '1'} text-xl`}></i>
                        </button>
                    </div>
                    </div>
                    
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1">{beat.title}</h3>
                        <div className="flex justify-between items-center mt-2">
                           <p className="text-sm text-gray-500">{beat.tags || 'Instrumental'}</p>
                           {beat.price && <span className="text-yellow-600 font-bold text-sm">{beat.price}</span>}
                        </div>
                    </div>
                </motion.div>
                );
            })}
            </div>
        )}

        <div className="text-center">
            <Link to="/beats" className="inline-block border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-500 hover:text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-sm hover:border-yellow-500">
                View All Beats
            </Link>
        </div>
      </div>
    </section>
  );
};

export default BeatsSection;
