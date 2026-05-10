import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getStaticUrl } from '../api/api';
import { fetchFeaturedGalleryThunk } from '../store/gallerySlice';

const GalleryGrid = () => {
  const dispatch = useDispatch();
  const allFeatured = useSelector((state) => state.gallery.featured);
  const featuredStatus = useSelector((state) => state.gallery.featuredStatus);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = allFeatured.slice(0, 8); // Display max 8 images on the homepage
  const loading = featuredStatus === 'loading' || featuredStatus === 'idle';

  useEffect(() => {
    if (featuredStatus === 'idle') {
      dispatch(fetchFeaturedGalleryThunk());
    }
  }, [featuredStatus, dispatch]);

  if (!loading && images.length === 0) return null;

  return (
    <section id="gallery" className="py-24 bg-black border-t border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
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
                    alt="Studio gallery"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                </motion.div>
            ))}
            </div>
        )}

        <div className="text-center">
            <Link to="/gallery" className="inline-block border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-white transition-colors p-2"
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
                alt="Studio gallery"
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryGrid;
