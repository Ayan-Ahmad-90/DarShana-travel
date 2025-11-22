import React, { useState } from 'react';
import { Calendar, MapPin, Search as SearchIcon , Filter, Map as MapIcon, Grid, Sparkles, X } from 'lucide-react';
import { getFestivalDetails } from '../services/geminiService';

const festivalsData = [
  { id: 1, name: "Diwali", type: "Religious", month: "November", location: "Pan-India", desc: "The festival of lights, celebrating the victory of light over darkness.", img: "https://images.unsplash.com/photo-1572299242440-78056c04d776?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
  { id: 2, name: "Holi", type: "Cultural", month: "March", location: "North India", desc: "The festival of colors, signifying the arrival of spring.", img: "https://images.unsplash.com/photo-1615462464295-3db418175a0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
  { id: 3, name: "Durga Puja", type: "Religious", month: "October", location: "Kolkata", desc: "Celebration of Goddess Durga's victory over Mahishasura.", img: "https://images.unsplash.com/photo-1569846706846-f58ebec70207?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
  { id: 4, name: "Pushkar Camel Fair", type: "Cultural", month: "November", location: "Rajasthan", desc: "A vibrant livestock fair with music, dance, and competitions.", img: "https://images.unsplash.com/photo-1574433282077-9d631e1c8000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
  { id: 5, name: "Onam", type: "Cultural", month: "September", location: "Kerala", desc: "Harvest festival marked by boat races and floral designs.", img: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
  { id: 6, name: "Ganesh Chaturthi", type: "Religious", month: "September", location: "Mumbai", desc: "Celebration of the birth of Lord Ganesha.", img: "https://images.unsplash.com/photo-1567591414240-e8fc1f211960?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" },
];

const Festivals: React.FC = () => {
  const [filterType, setFilterType] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [showMap, setShowMap] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const filteredFestivals = festivalsData.filter(f => {
    return (filterType === 'All' || f.type === filterType) &&
           (filterMonth === 'All' || f.month === filterMonth);
  });

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleAiInsight = async (festival: any) => {
    setSelectedFestival(festival);
    setLoadingInsight(true);
    setAiInsight('');
    try {
        const text = await getFestivalDetails(festival.name);
        setAiInsight(text || "No details available.");
    } catch (e) {
        setAiInsight("Could not fetch details.");
    } finally {
        setLoadingInsight(false);
    }
  }

  const closeInsight = () => {
      setSelectedFestival(null);
      setAiInsight('');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-stone-800 mb-4">Festival Calendar</h1>
        <p className="text-stone-600">Immerse yourself in the vibrant colors of Indian culture.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Filters */}
          <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-200 flex gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200">
                <Filter size={16} className="text-stone-500" />
                <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-transparent outline-none text-sm text-stone-700"
                >
                    <option value="All">All Types</option>
                    <option value="Religious">Religious</option>
                    <option value="Cultural">Cultural</option>
                </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-lg border border-stone-200">
                <Calendar size={16} className="text-stone-500" />
                <select 
                    value={filterMonth} 
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="bg-transparent outline-none text-sm text-stone-700"
                >
                    <option value="All">All Months</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
          </div>

          {/* View Toggle */}
          <div className="bg-stone-100 p-1 rounded-lg flex">
              <button 
                onClick={() => setShowMap(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${!showMap ? 'bg-white shadow-sm text-orange-600' : 'text-stone-500'}`}
              >
                  <Grid size={16} /> List
              </button>
              <button 
                onClick={() => setShowMap(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${showMap ? 'bg-white shadow-sm text-orange-600' : 'text-stone-500'}`}
              >
                  <MapIcon size={16} /> Map
              </button>
          </div>
      </div>

      {/* Content */}
      {!showMap ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFestivals.map(festival => (
            <div key={festival.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative h-48 overflow-hidden">
                <img src={festival.img} alt={festival.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className="text-white text-xs bg-orange-600 px-2 py-1 rounded mb-2 inline-block">{festival.type}</span>
                    <h3 className="text-xl font-bold text-white">{festival.name}</h3>
                </div>
                </div>
                <div className="p-5">
                <div className="flex items-center gap-4 text-sm text-stone-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {festival.month}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {festival.location}</span>
                </div>
                <p className="text-stone-600 text-sm mb-4 line-clamp-2">{festival.desc}</p>
                <button 
                    onClick={() => handleAiInsight(festival)}
                    className="w-full border border-teal-200 text-teal-700 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                >
                    <Sparkles size={16} /> Ask AI About This
                </button>
                </div>
            </div>
            ))}
        </div>
      ) : (
          <div className="w-full h-[500px] bg-stone-100 rounded-2xl flex items-center justify-center border border-stone-300 relative overflow-hidden">
              {/* Simulated Map Background */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/India_posten_map.svg/1200px-India_posten_map.svg.png')] bg-center bg-contain bg-no-repeat"></div>
              <div className="text-center z-10 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm">
                  <MapIcon size={48} className="mx-auto text-orange-500 mb-4" />
                  <h3 className="font-bold text-lg text-stone-800">Interactive Map View</h3>
                  <p className="text-stone-600 text-sm mb-4">Festivals plotted geographically would appear here.</p>
                  <button onClick={() => setShowMap(false)} className="text-teal-700 font-medium hover:underline">Return to List</button>
              </div>
          </div>
      )}

      {filteredFestivals.length === 0 && (
        <div className="text-center py-12 text-stone-400">
            No festivals found for the selected filters.
        </div>
      )}

      {/* AI Insight Modal */}
      {selectedFestival && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="relative h-32">
                     <img src={selectedFestival.img} className="w-full h-full object-cover" alt={selectedFestival.name} />
                     <div className="absolute inset-0 bg-black/40 flex items-center p-6">
                         <h2 className="text-2xl font-bold text-white font-serif">{selectedFestival.name} Insight</h2>
                     </div>
                     <button onClick={closeInsight} className="absolute top-4 right-4 bg-black/20 text-white p-1 rounded-full hover:bg-black/40 transition">
                         <X size={20} />
                     </button>
                </div>
                <div className="p-6">
                    {loadingInsight ? (
                        <div className="flex flex-col items-center py-8">
                            <Sparkles className="animate-spin text-orange-500 mb-2" size={32} />
                            <p className="text-stone-500 text-sm">Asking AI for latest details...</p>
                        </div>
                    ) : (
                        <div className="prose prose-stone text-sm">
                            <p className="whitespace-pre-wrap leading-relaxed text-stone-700">{aiInsight}</p>
                        </div>
                    )}
                </div>
                <div className="bg-stone-50 p-4 border-t border-stone-100 flex justify-end">
                    <button onClick={closeInsight} className="px-4 py-2 bg-stone-200 text-stone-800 rounded-lg text-sm font-medium hover:bg-stone-300 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Festivals;