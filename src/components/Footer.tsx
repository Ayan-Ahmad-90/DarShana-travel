import React from "react";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white">DarShana</h2>
          <p className="text-sm text-stone-400">
            Discover the soul of India through AI-powered experiences. From the Himalayas to the Indian Ocean, find your perfect journey.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-orange-500 transition" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
            <a href="#" className="hover:text-orange-500 transition" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
            <a href="#" className="hover:text-orange-500 transition" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#/mood" className="hover:text-orange-500">Mood Analyzer</a></li>
            <li><a href="#/festivals" className="hover:text-orange-500">Festival Calendar</a></li>
            <li><a href="#/sustainable" className="hover:text-orange-500">Eco-Planner</a></li>
            <li><a href="#/register" className="hover:text-orange-500">Book Now</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Luxury Trains</li>
            <li>Heritage Walks</li>
            <li>Adventure Tours</li>
            <li>Wellness Retreats</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> Lucknow, India</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-orange-500" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-orange-500" /> hello@darshana.travel</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} DarShana Travels. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
