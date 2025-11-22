import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin, Leaf, Smile, Bot, Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Mood AI', path: '/mood', icon: Smile },
    { name: 'Festivals', path: '/festivals', icon: Calendar },
    { name: 'Eco Travel', path: '/sustainable', icon: Leaf },
    { name: 'Assistant', path: '/assistant', icon: Bot },
    { name: 'Register', path: '/register', icon: MapPin },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold font-serif text-orange-600">Dar</span>
              <span className="text-2xl font-serif text-teal-700">Shana</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive(link.path)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-stone-600 hover:text-orange-600 hover:bg-stone-50'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {link.name}
                </Link>
              );
            })}
            <Link 
                to="/register"
                className="ml-4 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
            >
                Book Trip
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-stone-600 hover:text-orange-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-stone-600 hover:text-orange-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                    {link.icon && <link.icon size={18} />}
                    {link.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;