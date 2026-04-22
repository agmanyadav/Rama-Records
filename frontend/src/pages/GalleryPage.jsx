import { useState, useEffect } from 'react';
import { fetchGallery, getStaticUrl } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadGallery = async () => {
      try {
        const { data } = await fetchGallery();
        setImages(data);
      } catch (err) {
        console.error('Failed to load gallery', err);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Studio <span className="text-yellow-500">Gallery</span></h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Take a look inside Rama Records.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            <i className="fas fa-spinner fa-spin text-4xl mb-4 block text-yellow-500"></i>
            Loading Gallery...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {images.map((img, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={img._id}
                  className="relative group overflow-hidden rounded-xl aspect-square cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={getStaticUrl(img.imagePath)}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                    <p className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {img.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <i className="fas fa-images text-4xl mb-4 block"></i>
                No images available yet.
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gray-900/98 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
              onClick={() => setSelectedImage(null)}
            >
              <i className="fas fa-times text-3xl"></i>
            </button>
            
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getStaticUrl(selectedImage.imagePath)}
                alt={selectedImage.title}
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <h3 className="text-white text-xl font-medium">{selectedImage.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
