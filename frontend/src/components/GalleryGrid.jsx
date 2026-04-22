import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchFeaturedGallery, getStaticUrl } from '../api/api';

const GalleryGrid = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadFeaturedGallery = async () => {
      try {
        const { data } = await fetchFeaturedGallery();
        setImages(data.slice(0, 8)); // Display max 8 images on the homepage
      } catch (err) {
        console.error('Failed to load gallery', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedGallery();
  }, []);

  if (!loading && images.length === 0) return null;

  return (
    <section id="gallery" className="py-24 bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Studio <span className="text-yellow-500">Gallery</span>
          </h2>
        </div>

        {loading ? (
            <div className="text-center py-10"><i className="fas fa-spinner fa-spin text-yellow-500 text-3xl"></i></div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {images.map((img, index) => (
                <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={img._id}
                className={`relative group overflow-hidden rounded-xl cursor-pointer ${
                    index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'
                }`}
                onClick={() => setSelectedImage(img)}
                >
                <img
                    src={getStaticUrl(img.imagePath)}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                
                {/* Overlay Component */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                    <p className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {img.title}
                    </p>
                </div>
                </motion.div>
            ))}
            </div>
        )}

        <div className="text-center">
            <Link to="/gallery" className="inline-block border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 font-bold py-3 px-8 rounded-full transition-colors duration-300">
                View Full Gallery
            </Link>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-900/98 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
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
    </section>
  );
};

export default GalleryGrid;
