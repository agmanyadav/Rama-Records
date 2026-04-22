import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getStaticUrl } from '../api/api';

const navLinks = [
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

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
    if (location.pathname !== '/' && href.startsWith('#')) {
      e.preventDefault();
      window.location.href = '/' + href;
      return;
    }
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur shadow-lg shadow-slate-900/50' : 'bg-slate-900/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="flex items-center">
          <img
            src={getStaticUrl('/images/rama_studio_logo1.png')}
            alt="Rama Records Logo"
            className="h-10"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-300 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <Link
            to="/songs"
            className="ml-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-300"
          >
            All Songs
          </Link>
          <Link
            to="/beats"
            className="ml-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-300"
          >
            All Beats
          </Link>
          <Link
            to="/gallery"
            className="ml-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors duration-300"
          >
            Gallery
          </Link>
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
        } bg-slate-900/95 backdrop-blur`}
      >
        <div className="px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors border-b border-slate-800"
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/songs"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
          >
            All Songs
          </Link>
          <Link
            to="/beats"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
          >
            All Beats
          </Link>
          <Link
            to="/gallery"
            onClick={() => setMobileOpen(false)}
            className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
          >
            Gallery
          </Link>
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
