import React, { useState } from "react";
import { Plane, Train, Ship, Bike, Car, Search, MapPin, Rocket } from "lucide-react";

const TravelHub = () => {
  const [selectedMode, setSelectedMode] = useState("flight");

  const travelModes = [
    { id: "flight", label: "Flights", icon: Plane },
    { id: "train", label: "Train (Luxury + Local)", icon: Train },
    { id: "cruise", label: "Cruise Ship", icon: Ship },
    { id: "private", label: "Private Jet", icon: Rocket },
    { id: "cab", label: "Taxi / Ola / Uber", icon: Car },
    { id: "bike", label: "Bike & Scooty Rentals", icon: Bike },
  ];

  const bookingAPI = {
    flight: "https://api.flightbooking.com/v1/search",
    train: "https://indianrail.gov/api/search",
    cruise: "https://globalcruise.com/api/find",
    private: "https://privatejetapi.com/v2/booking",
    cab: "https://ola-uber-api.com/search",
    bike: "https://rentalbikes.com/api/list",
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          Travel <span className="text-teal-600">Hub</span>
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Compare routes, prices & transport options — all in one platform.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {travelModes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedMode(id)}
            className={`border rounded-xl py-4 flex flex-col items-center gap-2 transition-all duration-200 shadow-sm hover:scale-[1.03] 
              ${selectedMode === id ? "border-teal-600 bg-teal-50 shadow-md" : "hover:border-teal-500 hover:bg-gray-50"}`}
          >
            <Icon size={28} className="text-teal-700" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Search {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="font-medium text-gray-700 text-sm">From</label>
            <div className="flex items-center gap-3 px-4 py-3 border rounded-lg shadow-sm bg-white">
              <MapPin size={20} className="text-teal-600" />
              <input type="text" placeholder="City / Airport" className="w-full outline-none" />
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700 text-sm">To</label>
            <div className="flex items-center gap-3 px-4 py-3 border rounded-lg shadow-sm bg-white">
              <MapPin size={20} className="text-teal-600" />
              <input type="text" placeholder="Destination" className="w-full outline-none" />
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700 text-sm">Travel Date</label>
            <input type="date" className="px-4 py-3 border rounded-lg shadow-sm w-full outline-none" />
          </div>
        </div>

        <button className="mt-6 bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-xl text-lg flex items-center gap-2 shadow-md transition-all hover:scale-[1.03]">
          <Search size={20} /> Search & Compare
        </button>

        <p className="mt-4 text-xs text-gray-500">
          API Connected (prototype): <span className="font-mono text-teal-700">{bookingAPI[selectedMode]}</span>
        </p>
      </div>

      <div className="mt-12 p-6 rounded-xl border bg-gradient-to-r from-orange-50 to-teal-50 text-gray-800 shadow">
        <h3 className="font-semibold text-lg mb-1">🚀 Coming Soon: AI Smart Planning</h3>
        <p className="text-gray-600">Personalized route suggestions based on budget, weather, peak rush, and your mood!</p>
      </div>
    </div>
  );
};

export default TravelHub;
