import { motion } from 'framer-motion';
import { getStaticUrl } from '../api/api';

const HeroSection = ({ onBookSession }) => {
  const scrollToContent = () => {
    const el = document.querySelector('#ceo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${getStaticUrl('/images/hero.bg1.JPG')})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#0f0f0f]" />

      {/* Character Left */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute left-[3%] bottom-0 hidden lg:flex items-end z-10"
      >
        <img
          src={getStaticUrl('/images/left_char.png')}
          alt="Artist Character"
          className="h-[70vh] object-contain drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        />
      </motion.div>

      {/* Character Right */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute right-[3%] bottom-0 hidden lg:flex items-end z-10"
      >
        <img
          src={getStaticUrl('/images/right_char.png')}
          alt="Artist Character"
          className="h-[70vh] object-contain drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        />
      </motion.div>

      {/* Center Content */}
      <div className="relative z-20 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-yellow-500/80 text-lg md:text-xl uppercase tracking-[0.3em] mb-4 font-light"
        >
          Welcome to
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase tracking-wider"
          style={{ textShadow: '0 0 40px rgba(234,179,8,0.3)' }}
        >
          Rama Records
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-2xl md:text-3xl font-bold text-yellow-500 mt-4 tracking-[0.4em]"
        >
          CREATE. MIX. INSPIRE.
        </motion.p>

        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center items-center">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(234,179,8,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContent}
            className="bg-transparent border-2 border-yellow-500 hover:bg-yellow-500/10 text-yellow-500 font-bold py-3 px-10 rounded-full text-lg transition-all duration-300"
          >
            <i className="fas fa-arrow-down mr-2"></i>Explore
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(234,179,8,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onBookSession}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-10 rounded-full text-lg transition-all duration-300 shadow-lg"
          >
            <i className="fas fa-calendar-alt mr-2"></i>Book Session
          </motion.button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-yellow-500/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-yellow-500 rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
