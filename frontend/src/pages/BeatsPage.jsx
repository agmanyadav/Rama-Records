import { useState, useEffect } from 'react';
import { fetchBeats, getStaticUrl } from '../api/api';
import { usePlayer } from '../context/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';

const BeatsPage = () => {
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [buyModal, setBuyModal] = useState(null);
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadBeats = async () => {
      try {
        const { data } = await fetchBeats();
        setBeats(data);
      } catch (err) {
        console.error('Failed to load beats', err);
      } finally {
        setLoading(false);
      }
    };
    loadBeats();
  }, []);

  const filteredBeats = beats.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const playlist = filteredBeats.map((b) => ({
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

  const handleBuy = (beat) => {
    setBuyModal(beat);
  };

  const getMailLink = (beat) => {
    const subject = encodeURIComponent(`Beat Purchase Inquiry: ${beat.title}`);
    const body = encodeURIComponent(`Hi Rama Records,\n\nI'm interested in purchasing the beat "${beat.title}"${beat.price ? ` listed at ${beat.price}` : ''}.\n\nPlease let me know the details.\n\nThanks!`);
    return `mailto:agmanyadav09@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Instrumental <span className="text-yellow-500">Beats</span></h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse our exclusive catalog of high-quality instrumental beats.
            Ready for your next track? Find your perfect sound below and purchase.
          </p>
        </div>

        {/* Search */}
        <div className="mb-10 max-w-2xl mx-auto relative">
          <input
            type="text"
            placeholder="Search beats by title or tags..."
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-yellow-500 transition-colors shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <i className="fas fa-spinner fa-spin text-4xl mb-4 block text-yellow-500"></i>
            Loading Beats...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBeats.map((beat, index) => {
              const isCurrentPlaying = currentSong?.id === beat._id && isPlaying;
              return (
                <motion.div
                  key={beat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gray-800 rounded-2xl overflow-hidden border transition-all duration-300 group ${
                    currentSong?.id === beat._id ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-gray-700 hover:border-yellow-500/50'
                  }`}
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-900">
                    <img
                      src={getStaticUrl(beat.coverImage)}
                      alt={beat.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                       <button
                          onClick={() => handlePlay(beat, index)}
                          className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform cursor-pointer"
                        >
                          <i className={`fas ${isCurrentPlaying ? 'fa-pause' : 'fa-play'} text-gray-900 ${isCurrentPlaying ? '' : 'pl-1'} text-xl`}></i>
                        </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors line-clamp-1">{beat.title}</h3>
                            <p className="text-sm text-gray-400 line-clamp-1">{beat.tags || 'Instrumental'}</p>
                        </div>
                        {beat.price && (
                            <div className="bg-gray-700 px-3 py-1 rounded-full text-sm font-bold text-yellow-500 whitespace-nowrap">
                                {beat.price}
                            </div>
                        )}
                    </div>
                    
                    <button
                      onClick={() => handleBuy(beat)}
                      className="mt-4 w-full block text-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition-colors cursor-pointer shadow-md"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      {beat.price ? `Buy Now - ${beat.price}` : 'Get This Beat'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredBeats.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <i className="fas fa-compact-disc text-4xl mb-4 block"></i>
            No beats found matching your search.
          </div>
        )}
      </div>

      {/* Buy Modal */}
      <AnimatePresence>
        {buyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setBuyModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl w-full max-w-md p-8 border border-gray-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <img
                  src={getStaticUrl(buyModal.coverImage)}
                  alt={buyModal.title}
                  className="w-32 h-32 rounded-xl object-cover mx-auto mb-4 shadow-lg"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                />
                <h3 className="text-2xl font-bold text-white">{buyModal.title}</h3>
                <p className="text-gray-400">{buyModal.tags || 'Instrumental Beat'}</p>
                {buyModal.price && (
                  <div className="mt-2 inline-block bg-yellow-500/20 text-yellow-400 font-bold text-xl px-4 py-1 rounded-full">
                    {buyModal.price}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <a
                  href={getMailLink(buyModal)}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                >
                  <i className="fas fa-envelope text-xl"></i>
                  Email Us
                </a>

                <a
                  href={`https://wa.me/919368172591?text=${encodeURIComponent(`Hi! I'm interested in buying the beat "${buyModal.title}"${buyModal.price ? ` (${buyModal.price})` : ''}. Please share more details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
                >
                  <i className="fab fa-whatsapp text-xl"></i>
                  WhatsApp Us
                </a>
              </div>

              <button
                onClick={() => setBuyModal(null)}
                className="mt-4 w-full text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BeatsPage;
