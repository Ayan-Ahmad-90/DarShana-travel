import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, MapPin, Loader2 } from 'lucide-react';
import { analyzeMoodAndRecommend } from "../services/geminiService";

const MoodAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please use upload instead.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await analyzeMoodAndRecommend(image);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-stone-800 mb-4">AI Mood Travel Match</h1>
        <p className="text-stone-600 max-w-2xl mx-auto">
          Feeling adventurous? Stressed? Or just happy? Let our AI analyze your facial expression and recommend the perfect Indian destination for your current state of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-100">
          {!image && !isCameraOpen && (
            <div className="h-64 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-4 bg-stone-50">
              <button 
                onClick={startCamera}
                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-700 transition"
              >
                <Camera size={20} /> Open Camera
              </button>
              <span className="text-stone-400 text-sm">or</span>
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer hover:text-orange-600 transition">
                <Upload size={20} /> Upload Photo
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          )}

          {isCameraOpen && (
            <div className="relative h-64 bg-black rounded-xl overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <button 
                onClick={capturePhoto}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black p-3 rounded-full shadow-lg hover:bg-stone-100"
              >
                <Camera size={24} />
              </button>
            </div>
          )}

          {image && (
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img src={image} alt="Captured" className="w-full h-full object-cover" />
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          )}

          {image && !result && (
            <button 
              onClick={analyze}
              disabled={loading}
              className="w-full mt-6 bg-teal-700 text-white py-3 rounded-xl font-semibold hover:bg-teal-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Analyze Mood & Recommend'}
            </button>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 py-12">
              <Loader2 size={48} className="animate-spin text-orange-500 mb-4" />
              <p>Analyzing your vibe...</p>
            </div>
          )}

          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 py-12 bg-stone-50 rounded-2xl border border-stone-100">
              <p>Results will appear here</p>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6">
                <h3 className="font-bold text-orange-800 text-lg mb-1">Detected Mood: {result.detectedMood}</h3>
                <p className="text-orange-700 text-sm">{result.reasoning}</p>
              </div>

              <div className="space-y-4">
                {result.recommendations?.map((rec: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-stone-800 text-lg">{rec.name}</h4>
                      <span className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <MapPin size={12} /> {rec.location}
                      </span>
                    </div>
                    <p className="text-stone-600 text-sm mb-3">{rec.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.tags?.map((tag: string, tIdx: number) => (
                        <span key={tIdx} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">#{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodAnalyzer;