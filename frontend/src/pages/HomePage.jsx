import { useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import CEOSection from '../components/CEOSection';
import SongCarousel from '../components/SongCarousel';
import ServicesSection from '../components/ServicesSection';
import GalleryGrid from '../components/GalleryGrid';
import ContactForm from '../components/ContactForm';
import BookingModal from '../components/BookingModal';
import Footer from '../components/Footer';

const AboutSection = () => (
  <section id="about" className="py-20 px-6 bg-black">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-3xl font-bold mb-6 text-yellow-500 section-title">About Us</h3>
        <p className="text-lg text-white leading-relaxed">
          Rama Records Studio is your creative space to bring music to life. Equipped with
          state-of-the-art gear and experienced sound engineers, we provide a professional
          environment for artists to record, mix, and master their music. Our studio is more
          than just a room — it's where ideas transform into art, where raw talent meets
          professional production, and where every beat tells a story.
        </p>
      </motion.div>
    </div>
  </section>
);

const HomePage = () => {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div>
      <HeroSection onBookSession={() => setBookingOpen(true)} />

      <CEOSection />
      <SongCarousel />
      <ServicesSection />
      <GalleryGrid />
      <AboutSection />
      <ContactForm />
      <Footer />

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
};

export default HomePage;
