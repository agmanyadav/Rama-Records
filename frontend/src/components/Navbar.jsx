import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getStaticUrl } from '../api/api';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const userInfoStr = localStorage.getItem('userInfo');
  const isAdmin = userInfoStr && userInfoStr !== 'undefined' && userInfoStr !== 'null';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== '/') {
      window.location.href = '/' + href;
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Common desktop link styles
  const desktopLinkClass = "relative px-4 py-2 text-sm font-medium text-white hover:text-yellow-400 transition-colors duration-300 group";
  const underlineSpan = <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur shadow-lg shadow-yellow-500/20' : 'bg-black/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center">
          <img
            src={getStaticUrl('/images/rama_studio_logo1.png')}
            alt="Rama Records Logo"
            className="h-10"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1">
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, '#about')}
            className={desktopLinkClass}
          >
            About
            {underlineSpan}
          </a>
          <a
            href="#services"
            onClick={(e) => handleNavClick(e, '#services')}
            className={desktopLinkClass}
          >
            Services
            {underlineSpan}
          </a>
          <Link to="/releases" className={desktopLinkClass}>
            Releases
            {underlineSpan}
          </Link>
          <Link to="/gallery" className={desktopLinkClass}>
            Gallery
            {underlineSpan}
          </Link>
          <Link to="/songs" className={desktopLinkClass}>
            All Songs
            {underlineSpan}
          </Link>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className={desktopLinkClass}
          >
            Contacts
            {underlineSpan}
          </a>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="ml-2 px-4 py-2 text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors duration-300 bg-yellow-500/10 rounded-full flex items-center"
            >
              <i className="fas fa-cog mr-1"></i> Admin
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl text-yellow-400 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-black/95 backdrop-blur`}
      >
        <div className="px-6 py-4 space-y-2">
          <button
            onClick={(e) => handleNavClick(e, '#about')}
            className="block w-full text-left py-2 text-white hover:text-yellow-400 transition-colors border-b border-yellow-500/20"
          >
            About
          </button>
          <button
            onClick={(e) => handleNavClick(e, '#services')}
            className="block w-full text-left py-2 text-white hover:text-yellow-400 transition-colors border-b border-yellow-500/20"
          >
            Services
          </button>
          <Link
            to="/releases"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-white hover:text-yellow-400 transition-colors border-b border-yellow-500/20"
          >
            Releases
          </Link>
          <Link
            to="/gallery"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-white hover:text-yellow-400 transition-colors border-b border-yellow-500/20"
          >
            Gallery
          </Link>
          <Link
            to="/songs"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-white hover:text-yellow-400 transition-colors border-b border-yellow-500/20"
          >
            All Songs
          </Link>
          <button
            onClick={(e) => handleNavClick(e, '#contact')}
            className="block w-full text-left py-2 text-white hover:text-yellow-400 transition-colors border-b border-yellow-500/20"
          >
            Contacts
          </button>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-yellow-500 font-bold hover:text-yellow-400 transition-colors"
            >
              <i className="fas fa-cog mr-2"></i> Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
