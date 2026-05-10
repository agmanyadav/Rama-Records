import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[100] w-11 h-11 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 border-2 theme-toggle-btn"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
      style={{
        background: isDark ? '#eab308' : '#1a1a1a',
        borderColor: isDark ? '#ca8a04' : '#333',
      }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.i
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="fas fa-sun text-white text-base"
          />
        ) : (
          <motion.i
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="fas fa-moon text-yellow-400 text-base"
          />
        )}
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
