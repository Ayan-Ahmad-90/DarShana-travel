import React from 'react';
import { ArrowRight, Users, Leaf, Map, Star, ShieldCheck, CreditCard, Train, Anchor, Mountain,Home as HomeIcon, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations = [
  {
    id: '1',
    name: 'Taj Mahal, Agra',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'The epitome of love and architectural magnificence.',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Varanasi Ghats',
    img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'The spiritual capital of India on the banks of the Ganges.',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Kerala Backwaters',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'Serene waterways lined with lush palms and houseboats.',
    rating: 4.9
  },
  {
    id: '4',
    name: 'Jaipur Palaces',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    desc: 'The Pink City known for its royal heritage and colors.',
    rating: 4.7
  }
];

const services = [
  { title: 'Adventure Tours', icon: Mountain, desc: 'Trekking in Himalayas, Rafting in Rishikesh, & Desert Safaris.' },
  { title: 'Luxury Trains', icon: Train, desc: 'Experience royalty on wheels like The Maharajas Express.' },
  { title: 'Cruises', icon: Anchor, desc: 'River cruises on the Brahmaputra and backwater houseboats in Kerala.' },
  { title: 'Villas & Stays', icon: HomeIcon, desc: 'Heritage havelis, eco-resorts, and luxury private villas.' },
  { title: 'Monuments', icon: Camera, desc: 'Guided tours of UNESCO World Heritage sites and ancient temples.' },
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white font-serif mb-6 drop-shadow-lg">
            Experience India's Wonders
          </h1>
          <p className="text-xl md:text-2xl text-stone-100 max-w-2xl mb-10 font-light drop-shadow-md">
            Discover a land of vibrant cultures, spiritual depths, and breathtaking landscapes tailored to your mood.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/mood" 
              className="bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              Find My Vibe <ArrowRight size={20} />
            </Link>
            <Link 
              to="/festivals" 
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition shadow-lg"
            >
              Explore Festivals
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-teal-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4">
            <Users className="w-8 h-8 mx-auto mb-3 text-teal-300" />
            <h3 className="text-3xl font-bold">50k+</h3>
            <p className="text-teal-200 text-sm">Happy Travelers</p>
          </div>
          <div className="p-4">
            <Map className="w-8 h-8 mx-auto mb-3 text-teal-300" />
            <h3 className="text-3xl font-bold">120+</h3>
            <p className="text-teal-200 text-sm">Destinations</p>
          </div>
          <div className="p-4">
            <Leaf className="w-8 h-8 mx-auto mb-3 text-teal-300" />
            <h3 className="text-3xl font-bold">2.5T</h3>
            <p className="text-teal-200 text-sm">CO₂ Offset</p>
          </div>
          <div className="p-4">
            <Star className="w-8 h-8 mx-auto mb-3 text-teal-300" />
            <h3 className="text-3xl font-bold">4.9/5</h3>
            <p className="text-teal-200 text-sm">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">Top Destinations</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={dest.img} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                  <Star size={12} className="text-orange-500 fill-orange-500" />
                  {dest.rating}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-stone-800 mb-2">{dest.name}</h3>
                <p className="text-stone-600 text-sm mb-4">{dest.desc}</p>
                <Link to="/register" className="text-orange-600 font-medium hover:text-orange-700 flex items-center gap-1">
                  Plan Trip <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-stone-800 mb-4">Curated Experiences</h2>
            <p className="text-stone-600">Tailored services for every kind of traveler</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {services.map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-stone-200 hover:border-orange-200 transition-colors text-center group flex flex-col items-center">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-100 transition-colors">
                  <service.icon className="text-stone-600 group-hover:text-orange-600" size={32} />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">{service.title}</h3>
                <p className="text-stone-500 text-sm mb-6 line-clamp-3">{service.desc}</p>
                <Link to="/register" className="mt-auto px-4 py-2 border border-stone-300 rounded-full text-sm font-medium hover:bg-stone-800 hover:text-white transition-colors">
                  Plan my trip
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment & Safety */}
      <section className="py-12 bg-white border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <ShieldCheck size={40} className="text-teal-600" />
            <div>
              <h4 className="font-bold text-stone-800">100% Secure Payments</h4>
              <p className="text-xs text-stone-500">We use encrypted SSL connections.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
             {/* Placeholder icons for cards */}
             <div className="flex gap-2 items-center">
                <CreditCard size={32} />
                <span className="text-sm font-bold">VISA</span>
             </div>
             <div className="flex gap-2 items-center">
                <CreditCard size={32} />
                <span className="text-sm font-bold">MasterCard</span>
             </div>
             <div className="flex gap-2 items-center">
                <CreditCard size={32} />
                <span className="text-sm font-bold">UPI</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
