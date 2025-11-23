import React, { useState } from 'react';
import { Leaf, Plane, Train, Bus, Car, Loader2, ArrowRight, Gift } from 'lucide-react';
import { getSustainableRouteOptions } from '../services/geminiService';

const Sustainable: React.FC = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    setLoading(true);
    try {
      const data = await getSustainableRouteOptions(from, to);
      setRouteData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (mode: string) => {
    const m = mode.toLowerCase();
    if (m.includes('flight') || m.includes('air')) return <Plane size={24} />;
    if (m.includes('train') || m.includes('rail')) return <Train size={24} />;
    if (m.includes('bus')) return <Bus size={24} />;
    return <Car size={24} />;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-teal-100 p-3 rounded-full text-teal-700">
          <Leaf size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-800">Green Route Planner</h1>
          <p className="text-stone-500">Calculate your footprint, earn rewards, and travel sustainably.</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-10">
        <form onSubmit={handlePlan} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Origin</label>
            <input 
              type="text" 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g., New Delhi"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
          </div>
          <div className="hidden md:block pb-4 text-stone-400">
            <ArrowRight />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Destination</label>
            <input 
              type="text" 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g., Jaipur"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md w-full md:w-auto flex items-center justify-center gap-2 h-[50px]"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Calculate Impact'}
          </button>
        </form>
      </div>

      {/* Results */}
      {routeData && routeData.options && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {routeData.options.map((opt: any, idx: number) => (
            <div key={idx} className={`relative bg-white p-6 rounded-xl shadow-sm border-2 transition hover:shadow-md ${opt.greenScore >= 8 ? 'border-teal-500' : 'border-transparent'}`}>
              {opt.greenScore >= 8 && (
                <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg flex items-center gap-1">
                  <Leaf size={12} /> Eco Choice
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${opt.greenScore >= 8 ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-stone-600'}`}>
                  {getIcon(opt.mode)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-800">{opt.mode}</h3>
                  <p className="text-xs text-stone-500">{opt.time} • approx. ₹{opt.cost}</p>
                </div>
              </div>

              <p className="text-stone-600 text-sm mb-4">{opt.description}</p>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg">
                <div>
                    <span className="block text-xs text-stone-500 mb-1">Emissions</span>
                    <span className={`font-bold text-lg ${opt.co2 < 50 ? 'text-teal-600' : 'text-orange-600'}`}>
                        {opt.co2} <span className="text-xs text-stone-500 font-normal">kg CO₂</span>
                    </span>
                </div>
                <div className="text-right">
                     <span className="block text-xs text-stone-500 mb-1">Reward Points</span>
                     <span className="font-bold text-lg text-orange-600 flex items-center justify-end gap-1">
                         <Gift size={16} /> {opt.rewards || 0}
                     </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-stone-200 flex justify-between items-center">
                    <span className="text-xs text-stone-500">Sustainability Score</span>
                    <div className="flex items-center gap-1">
                         <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full ${opt.greenScore >= 7 ? 'bg-teal-500' : opt.greenScore >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${opt.greenScore * 10}%` }}
                             ></div>
                         </div>
                         <span className="font-bold text-stone-800 text-sm">{opt.greenScore}/10</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sustainable;