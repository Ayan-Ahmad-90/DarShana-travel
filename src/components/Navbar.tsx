import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin, Leaf, Smile, Bot, Calendar, Plane } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Mood AI", path: "/mood", icon: Smile },
    { name: "Travel Hub", path: "/travelhub", icon: Plane },  // ✔️ FIXED ROUTE
    { name: "Cultural Odyssey", path: "/festivals", icon: Calendar },
    { name: "Eco Travel", path: "/sustainable", icon: Leaf },
    { name: "Assistant", path: "/assistant", icon: Bot },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold font-serif flex items-center">
            <span className="text-orange-600">Dar</span>
            <span className="text-teal-700">Shana</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 font-medium transition-all ${
                    isActive(link.path)
                      ? "text-orange-700 bg-orange-100"
                      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  {Icon && <Icon size={18} />}
                  {link.name}
                </Link>
              );
            })}

            {/* CTA */}
            <Link
              to="/register"
              className="ml-4 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow hover:scale-105"
            >
              Book Trip
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-orange-600"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-base transition ${
                    isActive(link.path)
                      ? "text-orange-700 bg-orange-100"
                      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  {Icon && <Icon size={20} />}
                  {link.name}
                </Link>
              );
            })}

            {/* CTA button */}
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-full mt-2 shadow-md"
            >
              Book Trip
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
