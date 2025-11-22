import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MoodAnalyzer from './pages/MoodAnalyzer';
import Festivals from './pages/Festivals';
import Sustainable from './pages/Sustainable';
import Assistant from './pages/Assistant';
import Register from './pages/Register';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mood" element={<MoodAnalyzer />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/sustainable" element={<Sustainable />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;