import React from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import MoodAnalyzer from "./pages/MoodAnalyzer";
import TravelHub from "./pages/TravelHub"; // ✔️ Correct Import
import Festivals from "./pages/Festivals";
import Sustainable from "./pages/Sustainable";
import Assistant from "./pages/Assistant";
import Register from "./pages/Register";

// Auto scroll to top when route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />

      {/* Page Wrapper */}
      <div className="min-h-screen flex flex-col bg-stone-50 text-gray-900 font-sans">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-grow pt-20 sm:pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mood" element={<MoodAnalyzer />} />
            <Route path="/travelhub" element={<TravelHub />} /> {/* ⭐ Fixed */}
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/sustainable" element={<Sustainable />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </HashRouter>
  );
};

export default App;
