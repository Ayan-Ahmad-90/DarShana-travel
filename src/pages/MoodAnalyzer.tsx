import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, MapPin, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';


// ...your MoodAnalyzer code, but NO Destination redefinition or DESTINATIONS array...


// ...your MoodAnalyzer code, but NO Destination redefinition or DESTINATIONS array...


// Mock payment: always success after short delay
async function makePayment(amount: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 1500));
}

// Sample destinations
type Destination = {
  title: string;
  img: string;
  label: string;
  tags: string[];
  mood: number[];
  energy: [number, number];
  social: [number, number];
  adventure: [number, number];
};

const STEPS = [
  { title: "How are you feeling today?", input: "mood" },
  { title: "What's your energy level?", input: "energy" },
  { title: "How social do you want to be?", input: "social" },
  { title: "How adventurous are you feeling?", input: "adventure" },
  { title: "Recommendations", input: "recommendations" },
  { title: "Payment", input: "payment" },
  { title: "Your Trip Ticket", input: "ticket" },
];

// Unified main component
const MoodAnalyzer: React.FC = () => {
  // Mode selection: 'ai' is default, 'manual' for optional self-select
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  // AI mood analyzer states
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [aiStep, setAIStep] = useState<number>(0); // 0: input, 1: recommendations shown
  const [isPayingAI, setIsPayingAI] = useState(false);
  const [paidAI, setPaidAI] = useState(false);

  // Manual multi-step analyzer states
  const [step, setStep] = useState<number>(0);
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number>(5);
  const [social, setSocial] = useState<number>(5);
  const [adventure, setAdventure] = useState<number>(5);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  // Handlers for AI flow
  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
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
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const analyzeAI = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // Your real backend API call here!
      // For demo, simulate an AI result
      const mockedResult = {
        detectedMood: "Happy & Excited",
        reasoning: "Your smile indicates high spirits.",
        recommendations: DESTINATIONS.slice(0, 3),
      };
      setResult(mockedResult);
      setAIStep(1);
    } catch {
      alert("Failed to analyze mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  async function payAI() {
    setIsPayingAI(true);
    const amount = 6500;
    await makePayment(amount);
    setIsPayingAI(false);
    setPaidAI(true);
  }
  function downloadTicketAI() {
    const dest = result?.recommendations?.[0];
    const doc = new jsPDF();
    doc.text(`Booking Confirmed!\nDestination: ${dest.title}\nAmount Paid: ₹6500`, 10, 20);
    doc.save('trip-ticket.pdf');
  }

const DESTINATIONS: Destination[] = [
  {
    title: "Ladakh, J&K",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    label: "Adventure",
    tags: ["Trekking", "Motorcycle Tours", "Camping"],
    mood: [2, 4], energy: [7, 10], social: [3, 8], adventure: [7, 10],
  },
  {
    title: "Rishikesh, Uttarakhand",
    img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
    label: "Spiritual",
    tags: ["Yoga", "River Rafting", "Temple Visits"],
    mood: [1, 5], energy: [2, 10], social: [1, 8], adventure: [2, 8],
  },
  {
    title: "Goa Beaches",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    label: "Relaxation",
    tags: ["Beach", "Water Sports", "Nightlife"],
    mood: [0, 6], energy: [5, 10], social: [4, 10], adventure: [1, 7],
  },
  {
    title: "Varanasi, UP",
    img: "https://images.unsplash.com/photo-1517154421773-6b0b64e2b1c1?auto=format&fit=crop&w=400&q=80",
    label: "Culture",
    tags: ["Ganga Aarti", "Temples", "Ghats"],
    mood: [1, 4], energy: [2, 8], social: [1, 7], adventure: [2, 5],
  },
  {
    title: "Jaipur, Rajasthan",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    label: "Heritage",
    tags: ["Palaces", "Forts", "Food"],
    mood: [0, 2], energy: [4, 10], social: [1, 10], adventure: [3, 7],
  },
  {
    title: "Kerala Backwaters",
    img: "https://images.unsplash.com/photo-1469022563428-4c0ae6a8f0c5?auto=format&fit=crop&w=400&q=80",
    label: "Nature",
    tags: ["Houseboat", "Ayurveda", "Lakes"],
    mood: [1, 4], energy: [2, 8], social: [1, 7], adventure: [1, 5],
  },
  {
    title: "Mumbai",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80",
    label: "Urban Life",
    tags: ["Nightlife", "Bollywood", "Street Food"],
    mood: [0, 6], energy: [5, 10], social: [5, 10], adventure: [1, 6],
  },
  {
    title: "Kolkata",
    img: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=400&q=80",
    label: "Culture",
    tags: ["Festivals", "Colonial Heritage", "Food"],
    mood: [5, 6], energy: [3, 10], social: [6, 10], adventure: [1, 6],
  },
  {
    title: "Agra, Taj Mahal",
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    label: "Monument",
    tags: ["Architecture", "History", "UNESCO World Heritage"],
    mood: [2, 4], energy: [3, 9], social: [1, 7], adventure: [2, 6],
  },
  {
    title: "Shimla, Himachal",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    label: "Hill Station",
    tags: ["Snow", "Toy Train", "Mall Road"],
    mood: [0, 4], energy: [3, 9], social: [1, 8], adventure: [2, 8],
  },
  {
    title: "Manali, Himachal",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
    label: "Adventure",
    tags: ["Paragliding", "Snow", "Hiking"],
    mood: [2, 4], energy: [5, 10], social: [2, 10], adventure: [5, 10],
  },
  {
    title: "Darjeeling, West Bengal",
    img: "https://images.unsplash.com/photo-1519961644764-5c3457c11ecc?auto=format&fit=crop&w=400&q=80",
    label: "Tea Gardens",
    tags: ["Toy Train", "Mountain Views", "Tea Estate"],
    mood: [1, 4], energy: [2, 8], social: [1, 6], adventure: [3, 8],
  },
  {
    title: "Ooty, Tamil Nadu",
    img: "https://images.unsplash.com/photo-1509006282699-9b13d1f8b1fd?auto=format&fit=crop&w=400&q=80",
    label: "Nature",
    tags: ["Botanical Gardens", "Mountain Train", "Lakes"],
    mood: [1, 3], energy: [2, 8], social: [1, 7], adventure: [2, 6],
  },
  {
    title: "Hampi, Karnataka",
    img: "https://images.unsplash.com/photo-1528731708534-816fe59f90b7?auto=format&fit=crop&w=400&q=80",
    label: "Heritage",
    tags: ["Ancient Temples", "Ruins", "UNESCO Site"],
    mood: [4, 5], energy: [2, 7], social: [1, 7], adventure: [2, 6],
  },
  {
    title: "Andaman Islands",
    img: "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?auto=format&fit=crop&w=400&q=80",
    label: "Beach",
    tags: ["Scuba Diving", "Snorkeling", "Islands"],
    mood: [0, 5], energy: [5, 10], social: [2, 10], adventure: [4, 10],
  },
  {
    title: "Leh, Ladakh",
    img: "https://images.unsplash.com/photo-1495433324511-bf8e92934d90?auto=format&fit=crop&w=400&q=80",
    label: "Mountains",
    tags: ["Monasteries", "Adventure", "Pangong Lake"],
    mood: [2, 4], energy: [5, 10], social: [2, 8], adventure: [7, 10],
  },
  {
    title: "Sikkim",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    label: "Nature",
    tags: ["Monasteries", "Lakes", "Himalayan Views"],
    mood: [1, 4], energy: [3, 9], social: [1, 7], adventure: [2, 6],
  },
  {
    title: "Pushkar, Rajasthan",
    img: "https://images.unsplash.com/photo-1526401485004-3e7b5c7a2c1e?auto=format&fit=crop&w=400&q=80",
    label: "Festival",
    tags: ["Camel Fair", "Sacred Lake", "Temples"],
    mood: [3, 5], energy: [2, 8], social: [2, 10], adventure: [2, 7],
  },
  {
    title: "Udaipur, Rajasthan",
    img: "https://images.unsplash.com/photo-1465101178521-df5cfbed3b09?auto=format&fit=crop&w=400&q=80",
    label: "Romantic",
    tags: ["Lakes", "Palaces", "Culture"],
    mood: [0, 5], energy: [2, 8], social: [1, 7], adventure: [2, 6],
  },
  {
    title: "Mysore, Karnataka",
    img: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80",
    label: "Culture",
    tags: ["Palace", "Dasara Festival", "Zoo"],
    mood: [1, 6], energy: [2, 8], social: [2, 9], adventure: [1, 6],
  },
  {
    title: "Puducherry",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    label: "Beach",
    tags: ["French Town", "Beaches", "Auroville"],
    mood: [0, 5], energy: [3, 10], social: [2, 10], adventure: [1, 7],
  },
  {
    title: "Mahabaleshwar, Maharashtra",
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
    label: "Nature",
    tags: ["Strawberry Farms", "Sunrise Views", "Forest"],
    mood: [1, 5], energy: [2, 10], social: [1, 8], adventure: [1, 6],
  },
  {
    title: "Dharamsala, Himachal",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
    label: "Spiritual",
    tags: ["Monasteries", "Trekking", "Tea Gardens"],
    mood: [1, 4], energy: [2, 8], social: [1, 6], adventure: [2, 8],
  },
  {
    title: "Haridwar, Uttarakhand",
    img: "https://images.unsplash.com/photo-1433878455169-4698b20b6be9?auto=format&fit=crop&w=400&q=80",
    label: "Spiritual",
    tags: ["Ganga Aarti", "Temples", "Kumbh Mela"],
    mood: [4, 5], energy: [2, 8], social: [2, 10], adventure: [1, 5],
  },
  {
    title: "Jaisalmer, Rajasthan",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    label: "Desert",
    tags: ["Camel Safari", "Forts", "Sand Dunes"],
    mood: [2, 4], energy: [4, 10], social: [2, 10], adventure: [5, 10],
  },
  {
    title: "Khajuraho, MP",
    img: "https://images.unsplash.com/photo-1528731708534-816fe59f90b7?auto=format&fit=crop&w=400&q=80",
    label: "Heritage",
    tags: ["Temples", "Sculpture Art", "UNESCO Site"],
    mood: [3, 5], energy: [2, 8], social: [1, 7], adventure: [2, 6],
  },
  {
    title: "Coorg, Karnataka",
    img: "https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?auto=format&fit=crop&w=400&q=80",
    label: "Nature",
    tags: ["Coffee Farms", "Hills", "River Rafting"],
    mood: [1, 4], energy: [2, 8], social: [2, 7], adventure: [1, 7],
  },
  {
    title: "Kanchenjunga National Park, Sikkim",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80",
    label: "Wildlife",
    tags: ["Himalayan Views", "Trekking", "Nature Trails"],
    mood: [2, 4], energy: [3, 10], social: [1, 7], adventure: [4, 10],
  },
  {
    title: "Sundarbans, West Bengal",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    label: "Wildlife",
    tags: ["Mangroves", "Tiger Reserve", "Boat Safari"],
    mood: [2, 4], energy: [3, 9], social: [1, 7], adventure: [4, 10],
  },
  {
    title: "Auli, Uttarakhand",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    label: "Snow",
    tags: ["Skiing", "Mountains", "Nature"],
    mood: [2, 4], energy: [6, 10], social: [2, 8], adventure: [7, 10],
  },
  {
    title: "Kutch, Gujarat",
    img: "https://images.unsplash.com/photo-1526401485004-3e7b5c7a2c1e?auto=format&fit=crop&w=400&q=80",
    label: "Festival",
    tags: ["Rann Utsav", "White Desert", "Culture"],
    mood: [3, 5], energy: [2, 10], social: [2, 10], adventure: [2, 7],
  },
  {
    title: "Amritsar, Punjab",
    img: "https://images.unsplash.com/photo-1465101178521-df5cfbed3b09?auto=format&fit=crop&w=400&q=80",
    label: "Spiritual",
    tags: ["Golden Temple", "Wagah Border", "Punjabi Food"],
    mood: [4, 5], energy: [2, 10], social: [2, 10], adventure: [1, 5],
  },
  {
    title: "Bodh Gaya, Bihar",
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
    label: "Spiritual",
    tags: ["Buddhist Temple", "Meditation", "Heritage"],
    mood: [4, 5], energy: [2, 8], social: [1, 8], adventure: [1, 5],
  },
  {
    title: "Tawang, Arunachal Pradesh",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    label: "Mountains",
    tags: ["Monasteries", "Himalayan Views", "Culture"],
    mood: [2, 4], energy: [6, 10], social: [2, 8], adventure: [7, 10],
  },
  {
    title: "Munnar, Kerala",
    img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80",
    label: "Nature",
    tags: ["Tea Gardens", "Hiking", "Waterfalls"],
    mood: [1, 4], energy: [2, 8], social: [1, 7], adventure: [2, 7],
  },
  {
    title: "Gangtok, Sikkim",
    img: "https://images.unsplash.com/photo-1519961644764-5c3457c11ecc?auto=format&fit=crop&w=400&q=80",
    label: "Mountains",
    tags: ["Culture", "Monuments", "Nature"],
    mood: [0, 4], energy: [2, 8], social: [2, 7], adventure: [2, 7],
  },
  {
    title: "Puri, Odisha",
    img: "https://images.unsplash.com/photo-1528731708534-816fe59f90b7?auto=format&fit=crop&w=400&q=80",
    label: "Festival",
    tags: ["Jagannath Temple", "Beach", "Culture"],
    mood: [3, 5], energy: [2, 10], social: [2, 10], adventure: [2, 7],
  },
  {
    title: "Ranthambore National Park",
    img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    label: "Wildlife",
    tags: ["Tiger Safari", "Jungle", "Nature"],
    mood: [2, 4], energy: [5, 10], social: [2, 9], adventure: [6, 10],
  },
  {
    title: "Kaziranga National Park",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80",
    label: "Wildlife",
    tags: ["Rhino Safari", "Bird Watching", "Nature"],
    mood: [2, 3], energy: [3, 10], social: [1, 7], adventure: [4, 10],
  },
  {
    title: "Mount Abu, Rajasthan",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    label: "Hill Station",
    tags: ["Boating", "Dilwara Temples", "Viewpoint"],
    mood: [1, 4], energy: [2, 8], social: [1, 7], adventure: [2, 6],
  },
  {
    title: "Jodhpur, Rajasthan",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    label: "Heritage",
    tags: ["Blue City", "Forts", "Palaces"],
    mood: [2, 5], energy: [4, 10], social: [2, 10], adventure: [3, 8],
  },
  {
    title: "Chennai, Tamil Nadu",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    label: "Urban",
    tags: ["Beach", "Culture", "Temples"],
    mood: [0, 5], energy: [3, 10], social: [2, 10], adventure: [1, 7],
  },
  {
    title: "Hyderabad, Telangana",
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
    label: "Culture",
    tags: ["Birla Mandir", "Charminar", "Cuisine"],
    mood: [1, 6], energy: [2, 8], social: [4, 9], adventure: [1, 6],
  },
  {
    title: "Kodaikanal, Tamil Nadu",
    img: "https://images.unsplash.com/photo-1509006282699-9b13d1f8b1fd?auto=format&fit=crop&w=400&q=80",
    label: "Nature",
    tags: ["Lake", "Forest", "Hiking"],
    mood: [2, 3], energy: [2, 8], social: [2, 7], adventure: [2, 7],
  },
  {
    title: "Alleppey, Kerala",
    img: "https://images.unsplash.com/photo-1465101178521-df5cfbed3b09?auto=format&fit=crop&w=400&q=80",
    label: "Backwaters",
    tags: ["Houseboat", "Canals", "Ayurveda"],
    mood: [1, 5], energy: [2, 8], social: [1, 8], adventure: [1, 5],
  },
  {
    title: "Spiti Valley, Himachal",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80",
    label: "Adventure",
    tags: ["Road Trip", "Buddhist Monasteries", "Lakes"],
    mood: [2, 4], energy: [7, 10], social: [1, 7], adventure: [7, 10],
  },
  {
    title: "Tirupati, Andhra Pradesh",
    img: "https://images.unsplash.com/photo-1528731708534-816fe59f90b7?auto=format&fit=crop&w=400&q=80",
    label: "Spiritual",
    tags: ["Balaji Temple", "Religious", "Heritage"],
    mood: [4, 5], energy: [2, 8], social: [1, 8], adventure: [1, 5],
  },
  {
    title: "Matheran, Maharashtra",
    img: "https://images.unsplash.com/photo-1469022563428-4c0ae6a8f0c5?auto=format&fit=crop&w=400&q=80",
    label: "Nature",
    tags: ["Forest", "Hiking", "Toy Train"],
    mood: [1, 5], energy: [2, 8], social: [1, 8], adventure: [1, 6],
  },
  {
    title: "Lakshadweep Islands",
    img: "https://images.unsplash.com/photo-1444065381814-865dc9da92c0?auto=format&fit=crop&w=400&q=80",
    label: "Beach",
    tags: ["Snorkeling", "Scuba Diving", "Islands"],
    mood: [0, 5], energy: [8, 10], social: [4, 10], adventure: [8, 10],
  },
  {
    title: "Rameswaram, Tamil Nadu",
    img: "https://images.unsplash.com/photo-1509006282699-9b13d1f8b1fd?auto=format&fit=crop&w=400&q=80",
    label: "Spiritual",
    tags: ["Temple", "Beach", "Heritage"],
    mood: [4, 5], energy: [2, 8], social: [1, 8], adventure: [1, 5],
  }
  // ...add more if needed by copying pattern above
];


  // Manual mode recommendation
  function getRecommendations(): Destination[] {
    const filtered = DESTINATIONS.filter(dest =>
      (mood !== null ? dest.mood.includes(mood) : true) &&
      energy >= dest.energy[0] && energy <= dest.energy[1] &&
      social >= dest.social[0] && social <= dest.social[1] &&
      adventure >= dest.adventure[0] && adventure <= dest.adventure[1]
    );
    return filtered.length ? filtered.slice(0, 3) : DESTINATIONS.slice(0, 3);
  }

  async function pay() {
    setIsPaying(true);
    const amount = 5000 + energy * 120 + adventure * 180 + social * 100;
    await makePayment(amount);
    setIsPaying(false);
    setStep(6);
  }
  function downloadTicket() {
    const dest = getRecommendations()[selectedIdx ?? 0];
    const doc = new jsPDF();
    doc.text(`Booking Confirmed!\nDestination: ${dest.title}\nAmount Paid: ₹${5000 + energy * 120 + adventure * 180 + social * 100}`, 10, 20);
    doc.save('trip-ticket.pdf');
  }

  // UI Start
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-center gap-2 mb-8">
        <button
          className={`px-8 py-3 rounded-full font-bold border transition duration-150 ${
            mode === 'ai' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-gray-300 text-gray-700'
          }`}
          onClick={() => setMode('ai')}
        >
          <Camera size={18} className="inline mr-2" /> AI Mood Analyzer
        </button>
        <button
          className={`px-8 py-3 rounded-full font-bold border transition duration-150 ${
            mode === 'manual' ? 'bg-teal-700 text-white border-teal-700' : 'bg-white border-gray-300 text-gray-700'
          }`}
          onClick={() => setMode('manual')}
        >
          <span role="img" aria-label="mood">😊</span> Self Choose Destination
        </button>
      </div>

      {mode === 'ai' ? (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
          {/* AI Analyzer steps */}
          {aiStep === 0 && (
            <div>
              <div className="font-bold text-2xl mb-3 text-center">AI Mood Travel Match</div>
              <p className="text-stone-600 text-center mb-6">
                Let our AI analyze your facial expression and recommend the perfect Indian destination for your current state of mind.
              </p>
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
                    onClick={() => { setImage(null); setResult(null); setAIStep(0); }}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              )}
              {image && !result && (
                <button 
                  onClick={analyzeAI}
                  disabled={loading}
                  className="w-full mt-6 bg-teal-700 text-white py-3 rounded-xl font-semibold hover:bg-teal-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Analyze Mood & Recommend'}
                </button>
              )}
            </div>
          )}

          {/* AI recommendations, payment, ticket */}
          {aiStep === 1 && result && !paidAI && (
            <div>
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6 text-center">
                <h3 className="font-bold text-orange-800 text-lg mb-1">Detected Mood: {result.detectedMood}</h3>
                <p className="text-orange-700 text-sm">{result.reasoning}</p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                {result.recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className="rounded-xl shadow-lg p-4 w-64 border border-orange-200 hover:border-orange-600 transition">
                    <img src={rec.img} alt={rec.title} className="rounded-md mb-3 w-full h-32 object-cover"/>
                    <div className="font-bold text-lg">{rec.title}</div>
                    <div className="mt-2">
                      <span className="rounded-full px-2 py-1 text-xs bg-orange-100 text-orange-600 mr-2">{rec.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 text-xs">
                      {rec.tags.map((tag: string,i:number) => <span key={i} className="bg-gray-200 rounded px-2 py-1">{tag}</span>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button className="btn-outline" onClick={()=>setAIStep(0)}>Analyze Again</button>
                <button className="btn-outline ml-3" onClick={payAI} disabled={isPayingAI}>
                  {isPayingAI ? <Loader2 className="animate-spin"/> : "Pay & Select Date"}
                </button>
              </div>
            </div>
          )}
          {paidAI && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-3">DarShana AI Trip Ticket</h2>
              <div className="mb-4 p-3 bg-orange-50 rounded-xl text-orange-900 text-center">
                <div><b>Destination:</b> {result.recommendations[0]?.title}</div>
                <div><b>Amount Paid:</b> ₹6500</div>
              </div>
              <div className="flex justify-center">
                <button className="btn-outline" onClick={downloadTicketAI}>Download PDF Slip</button>
                <button className="btn-outline ml-3" onClick={() => {setAIStep(0); setPaidAI(false); setImage(null);setResult(null);}}>Plan Another Trip</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Manual multi-step form flow preserved
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
          <div className="flex justify-center gap-2 mb-6">
            {STEPS.slice(0,-1).map((s, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${step===i?'bg-teal-500':'bg-gray-300'}`}></div>
            ))}
          </div>
          {step === 0 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-2">{STEPS[0].title}</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {['😊','😐','😮','😢','😃','🤔','😁'].map((em, idx) => (
                  <button key={idx} className={`rounded-xl px-4 py-3 border
                    ${mood === idx ? "bg-teal-600 text-white" : "bg-gray-100"}
                  `} onClick={() => setMood(idx)}>{em}</button>
                ))}
              </div>
              <button className="mt-6 px-6 py-2 bg-teal-700 text-white rounded-lg"
                disabled={mood===null}
                onClick={()=>setStep(1)}>Next</button>
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-2">{STEPS[1].title}</h2>
              <div className="flex flex-col items-center py-6">
                <span className="text-3xl">😊</span>
                <span className="text-lg mt-2">{energy<3?'Low':energy<7?'Moderate':'High'}</span>
                <input type="range" min={1} max={10} value={energy} onChange={e=>setEnergy(Number(e.target.value))} />
                <div className="flex justify-between w-full px-2 text-sm text-gray-500">
                  <span>Low</span><span>High</span>
                </div>
                <span className="mt-1">Energy Level: {energy}/10</span>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={()=>setStep(0)} className="btn-outline">Previous</button>
                <button onClick={()=>setStep(2)} className="btn-outline">Next</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-2">{STEPS[2].title}</h2>
              <div className="flex flex-col items-center py-6">
                <span className="text-3xl">👥</span>
                <span className="text-lg mt-2">{social<4?'Solo':social<7?'Small Groups':'Groups'}</span>
                <input type="range" min={1} max={10} value={social} onChange={e=>setSocial(Number(e.target.value))} />
                <div className="flex justify-between w-full px-4 text-sm text-gray-500">
                  <span>Solo</span><span>Group</span>
                </div>
                <span className="mt-1">Social Level: {social}/10</span>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={()=>setStep(1)} className="btn-outline">Previous</button>
                <button onClick={()=>setStep(3)} className="btn-outline">Next</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-2">{STEPS[3].title}</h2>
              <div className="flex flex-col items-center py-6">
                <span className="text-3xl">🚶</span>
                <span className="text-lg mt-2">{adventure<4?'Safe':adventure<7?'Mild Adventure':'Adventurous'}</span>
                <input type="range" min={1} max={10} value={adventure} onChange={e=>setAdventure(Number(e.target.value))} />
                <div className="flex justify-between w-full px-4 text-sm text-gray-500">
                  <span>Safe</span><span>Adventurous</span>
                </div>
                <span className="mt-1">Adventure Level: {adventure}/10</span>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={()=>setStep(2)} className="btn-outline">Previous</button>
                <button onClick={()=>setStep(4)} className="btn-outline">Analyze My Mood</button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-2">Your Personalized Recommendations</h2>
              <div className="flex flex-wrap gap-4 justify-center mb-6">
                {getRecommendations().map((dest, idx) => (
                  <div key={idx}
                    className={`rounded-xl shadow-lg p-4 w-64 transition border ${selectedIdx===idx?'border-teal-500':'border-gray-100'}`}
                    onClick={()=>setSelectedIdx(idx)}
                    style={{cursor:'pointer',background:'#f9fafe'}}
                  >
                    <img src={dest.img} alt={dest.title} className="rounded-md mb-3 w-full h-32 object-cover"/>
                    <div className="font-bold text-lg">{dest.title}</div>
                    <div className="mt-2">
                      <span className="rounded-full px-2 py-1 text-xs bg-teal-100 text-teal-600 mr-2">{dest.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 text-xs">
                      {dest.tags.map((tag,i)=> <span key={i} className="bg-gray-200 rounded px-2 py-1">{tag}</span>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button className="btn-outline" onClick={()=>setStep(0)}>Analyze Again</button>
                <button className="btn-outline" disabled={selectedIdx===null} onClick={()=>setStep(5)}>Pay & Select Date</button>
              </div>
            </div>
          )}
          {step === 5 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-2">Trip Booking Details</h2>
              <div className="mb-4">
                <div><b>Destination:</b> {getRecommendations()[selectedIdx ?? 0]?.title}</div>
                <div><b>Your Mood:</b> {['Happy & Excited','Calm & Peaceful','Curious & Explorative','Sad','Energetic','Reflective','Social'][mood ?? 0]}</div>
              </div>
              <div className="mb-2 text-lg font-bold text-teal-700">
                Trip Price: ₹{5000 + energy*120 + adventure*180 + social*100}
              </div>
              <button className="btn-outline" disabled={isPaying} onClick={pay}>{isPaying?<Loader2 className="animate-spin"/>:'Pay & Confirm'}</button>
            </div>
          )}
          {step === 6 && (
            <div>
              <h2 className="font-bold text-2xl text-center mb-3">DarShana AI Trip Ticket</h2>
              <div className="mb-4 p-3 bg-teal-50 rounded-xl text-teal-900 text-center">
                <div><b>Destination:</b> {getRecommendations()[selectedIdx ?? 0]?.title}</div>
                <div><b>Amount Paid:</b> ₹{5000 + energy*120 + adventure*180 + social*100}</div>
              </div>
              <div className="flex justify-center">
                <button className="btn-outline" onClick={downloadTicket}>Download PDF Slip</button>
                <button className="btn-outline ml-3" onClick={()=>setStep(0)}>Plan Another Trip</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodAnalyzer;
