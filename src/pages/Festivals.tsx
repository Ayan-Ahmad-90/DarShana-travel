import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Filter, Grid, Map as MapIcon, X, TrendingUp, Download } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- LEAFLET ICON FIX ---
// Do not remove this for proper marker icons!
delete (L.Icon.Default.prototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- DATA ARRAYS (FULL) ---
const festivalsData = [
    {
        id: 1,
        name: "Diwali (दीपावली)",
        type: "Religious (Hindu, Sikh, Jain)",
        month: "October/November",
        location: "Pan-India",
        desc: "The festival of lights, celebrating the victory of light over darkness and good over evil. Associated with Goddess Lakshmi and Lord Rama's return.",
        img: "https://placehold.co/500x300/f8c050/ffffff?text=Diwali+Lights",
        lat: 20.5937,
        lng: 78.9629
    },
    {
        id: 2,
        name: "Holi (होली)",
        type: "Cultural/Religious (Hindu)",
        month: "March",
        location: "Pan-India, especially North India",
        desc: "The festival of colors, signifying the arrival of spring and the triumph of good over evil (Holika Dahan). People play with dry and wet colors.",
        img: "https://placehold.co/500x300/ff69b4/ffffff?text=Holi+Colors",
        lat: 28.6139,
        lng: 77.209
    },
    {
        id: 3,
        name: "Durga Puja (दुर्गा पूजा)",
        type: "Religious (Hindu)",
        month: "September/October",
        location: "Kolkata, West Bengal",
        desc: "Celebration of Goddess Durga's victory over the buffalo demon Mahishasura. Marked by grand Pandal installations and idol immersion.",
        img: "https://placehold.co/500x300/800080/ffffff?text=Durga+Pooja+Pandal",
        lat: 22.5726,
        lng: 88.3639
    },
    {
        id: 4,
        name: "Pushkar Camel Fair (पुष्कर मेला)",
        type: "Cultural/Livestock",
        month: "November",
        location: "Pushkar, Rajasthan",
        desc: "A vibrant five-day livestock fair featuring camel trading, cultural performances, music, and competitions near the Pushkar Lake.",
        img: "https://placehold.co/500x300/ffa500/000000?text=Pushkar+Fair",
        lat: 26.4907,
        lng: 74.5539
    },
    {
        id: 5,
        name: "Onam (ओणम)",
        type: "Cultural/Harvest (Hindu)",
        month: "August/September",
        location: "Kerala",
        desc: "Harvest festival marked by elaborate flower carpets (Pookalam), the grand Onam Sadhya feast, and spectacular snake boat races (Vallamkali).",
        img: "https://placehold.co/500x300/4CAF50/ffffff?text=Onam+Pookalam",
        lat: 10.8505,
        lng: 76.2711
    },
    {
        id: 6,
        name: "Ganesh Chaturthi (गणेश चतुर्थी)",
        type: "Religious (Hindu)",
        month: "August/September",
        location: "Mumbai, Maharashtra, Karnataka",
        desc: "A 10-day celebration of the birth of Lord Ganesha, marked by the installation of large idols and a final grand immersion ceremony (Visarjan).",
        img: "https://placehold.co/500x300/9932CC/ffffff?text=Ganesh+Idol",
        lat: 19.076,
        lng: 72.8777
    },
    {
        id: 7,
        name: "Eid al-Fitr (ईद उल-फित्र)",
        type: "Religious (Islam)",
        month: "Variable (Lunar)",
        location: "Pan-India",
        desc: "The 'Festival of Breaking the Fast' marks the end of Ramadan. Celebrated with congregational prayers, feasting, and the giving of charity (Zakat al-Fitr).",
        img: "https://placehold.co/500x300/228B22/ffffff?text=Eid+Celebration",
        lat: 28.7041,
        lng: 77.1025
    },
    {
        id: 8,
        name: "Christmas",
        type: "Religious (Christian)",
        month: "December",
        location: "Goa, Mumbai, Northeast India",
        desc: "Celebration of the birth of Jesus Christ. Marked by midnight mass, carol singing, decorated Christmas trees, and gift-giving.",
        img: "https://placehold.co/500x300/D22B2B/ffffff?text=Christmas+Tree",
        lat: 15.2993,
        lng: 74.124
    },
    {
        id: 9,
        name: "Gurupurab (गुरुपर्व)",
        type: "Religious (Sikh)",
        month: "October/November",
        location: "Punjab, Pan-India",
        desc: "Celebration of the birth of the Sikh Gurus. Marked by processions (Nagar Kirtan) and reading of the Guru Granth Sahib.",
        img: "https://placehold.co/500x300/3CB371/ffffff?text=Gurpurab+Nagar+Kirtan",
        lat: 30.7333,
        lng: 76.7794
    },
    {
        id: 10,
        name: "Pongal (पोंगल)",
        type: "Harvest (Hindu)",
        month: "January",
        location: "Tamil Nadu",
        desc: "A four-day harvest festival dedicated to the Sun God (Surya). The second day is the main day, where rice is boiled until it spills over.",
        img: "https://placehold.co/500x300/FFD700/000000?text=Pongal+Dish",
        lat: 13.0827,
        lng: 80.2707
    },
    {
        id: 11,
        name: "Navratri (नवरात्रि)",
        type: "Religious (Hindu)",
        month: "September/October",
        location: "Gujarat, Maharashtra",
        desc: "A nine-night festival worshipping Goddess Durga. Famous for the traditional folk dances Garba and Dandiya Raas, especially in Gujarat.",
        img: "https://placehold.co/500x300/4682B4/ffffff?text=Garba+Dance",
        lat: 23.0225,
        lng: 72.5714
    },
    {
        id: 12,
        name: "Kumbh Mela (कुंभ मेला)",
        type: "Religious (Hindu)",
        month: "Variable (Cycle)",
        location: "Allahabad, Haridwar, Ujjain, Nashik",
        desc: "One of the largest peaceful gatherings in the world, held once every three years on a rotating basis at four river-bank pilgrimage sites.",
        img: "https://placehold.co/500x300/87CEEB/000000?text=Kumbh+Mela+Snan",
        lat: 25.4358,
        lng: 81.8463
    },
    {
        id: 13,
        name: "Rath Yatra (रथ यात्रा)",
        type: "Religious (Hindu)",
        month: "June/July",
        location: "Puri, Odisha",
        desc: "The annual chariot festival of Lord Jagannath, his brother Balabhadra, and sister Subhadra. The deities are carried in massive, decorated chariots.",
        img: "https://placehold.co/500x300/CD5C5C/ffffff?text=Rath+Yatra+Puri",
        lat: 19.8142,
        lng: 85.831
    },
    {
        id: 14,
        name: "Hornbill Festival",
        type: "Cultural (Tribal)",
        month: "December",
        location: "Nagaland",
        desc: "A week-long annual festival showcasing the rich cultural heritage and traditions of the 16 Naga tribes with folk dances, sports, and crafts.",
        img: "https://placehold.co/500x300/90EE90/000000?text=Hornbill+Dance",
        lat: 26.1824,
        lng: 94.5714
    },
    {
        id: 15,
        name: "Eid al-Adha (बकरी ईद)",
        type: "Religious (Islam)",
        month: "Variable (Lunar)",
        location: "Pan-India",
        desc: "The 'Festival of Sacrifice,' honoring Prophet Ibrahim's willingness to sacrifice his son. It involves animal sacrifice and distribution of meat.",
        img: "https://placehold.co/500x300/A52A2A/ffffff?text=Eid+al-Adha",
        lat: 24.5,
        lng: 79.0
    },
];

// ----------------------------------------------------------------------------------
// 2. 10 CULTURAL HIGHLIGHTS (सांस्कृतिक झलकियाँ) - Key non-festival cultural aspects
// ----------------------------------------------------------------------------------
const culturalHighlights = [
    {
        name: "Classical Dance Forms (शास्त्रीय नृत्य)",
        aspect: "Performing Arts",
        description: "Includes Bharatanatyam, Kathak, Kathakali, Odissi, Manipuri, Mohiniyattam, and Kuchipudi, each telling stories through intricate mudras and expressions."
    },
    {
        name: "Yoga and Ayurveda (योग और आयुर्वेद)",
        aspect: "Wellness & Philosophy",
        description: "Ancient Indian systems for health and well-being. Yoga focuses on physical, mental, and spiritual practices, while Ayurveda is a traditional medicine system."
    },
    {
        name: "Indian Cuisine (भारतीय व्यंजन)",
        aspect: "Gastronomy",
        description: "Known for its vast regional diversity—from North Indian curries and bread to South Indian idli/dosa, Bengali fish, and Goan vindaloo. Focuses on spices and balance of six tastes."
    },
    {
        name: "Bollywood & Regional Cinema (सिनेमा)",
        aspect: "Mass Media & Arts",
        description: "The world's largest film industry, headquartered in Mumbai, influencing music, fashion, and social narratives globally. Includes vibrant regional cinemas like Tamil, Telugu, and Bengali."
    },
    {
        name: "Traditional Textiles & Sari (वस्त्र और साड़ी)",
        aspect: "Fashion & Craft",
        description: "India's rich textile heritage features handloom fabrics like Silk (Banarasi, Kanjivaram), Cotton (Khadi), and intricate works like Pashmina shawls and bandhani dying."
    },
    {
        name: "Kathputli (कठपुतली) & Puppetry",
        aspect: "Folk Arts",
        description: "Traditional string puppetry, most prominent in Rajasthan, used for storytelling and conveying social messages through intricate wooden dolls."
    },
    {
        name: "Hindustani & Carnatic Music (शास्त्रीय संगीत)",
        aspect: "Music",
        description: "The two main branches of Indian classical music. Hindustani (North India) focuses on improvisational Ragas, while Carnatic (South India) is based on composed Kriti songs."
    },
    {
        name: "Kalarippayattu (कलरीपयट्टु)",
        aspect: "Martial Arts",
        description: "One of the oldest surviving martial arts in the world, originating in Kerala. Involves strikes, kicks, weapon training, and healing methods."
    },
    {
        name: "Tribal Art Forms (जनजातीय कला)",
        aspect: "Visual Arts",
        description: "Includes distinct styles like Warli painting (Maharashtra), Gond art (Madhya Pradesh), and Madhubani painting (Bihar), reflecting tribal life and myths."
    },
    {
        name: "Miniature Painting (लघु चित्रकला)",
        aspect: "Visual Arts",
        description: "Detailed, colorful paintings developed under Mughal, Rajput, and Pahari royal courts, depicting epics, portraits, and courtly life on small scale."
    },
];

const historicalPlaces = [
    {
        id: 1,
        name: "Taj Mahal",
        era: "Mughal Empire",
        location: "Agra, Uttar Pradesh",
        description: "An iconic white marble mausoleum commissioned by Emperor Shah Jahan in memory of his wife Mumtaz Mahal (UNESCO World Heritage Site)."
    },
    {
        id: 2,
        name: "Red Fort (लाल किला)",
        era: "Mughal Empire",
        location: "Delhi",
        description: "A historic fort in Old Delhi that served as the main residence of the Mughal Emperors for nearly 200 years. The Prime Minister addresses the nation here on Independence Day (UNESCO World Heritage Site)."
    },
    {
        id: 3,
        name: "Qutub Minar",
        era: "Delhi Sultanate",
        location: "Delhi",
        description: "A 73-meter tall minaret and complex, the tallest brick minaret in the world, started by Qutub-ud-din Aibak (UNESCO World Heritage Site)."
    },
    {
        id: 4,
        name: "Humayun's Tomb",
        era: "Mughal Empire",
        location: "Delhi",
        description: "The tomb of the Mughal Emperor Humayun, often considered the first garden-tomb on the Indian subcontinent (UNESCO World Heritage Site)."
    },
    {
        id: 5,
        name: "Fatehpur Sikri",
        era: "Mughal Empire",
        location: "Near Agra, Uttar Pradesh",
        description: "A city founded by Mughal Emperor Akbar, which served as the capital from 1571 to 1585, now perfectly preserved in red sandstone (UNESCO World Heritage Site)."
    },
    {
        id: 6,
        name: "Agra Fort",
        era: "Mughal Empire",
        location: "Agra, Uttar Pradesh",
        description: "The primary residence of the emperors of the Mughal Dynasty until 1638. A massive red sandstone fortress (UNESCO World Heritage Site)."
    },
    {
        id: 7,
        name: "Group of Monuments at Hampi",
        era: "Vijayanagara Empire",
        location: "Hampi, Karnataka",
        description: "The ruins of the magnificent capital city of the Vijayanagara Empire, featuring stunning temples and stone chariots (UNESCO World Heritage Site)."
    },
    {
        id: 8,
        name: "Khajuraho Group of Monuments",
        era: "Chandela Dynasty",
        location: "Khajuraho, Madhya Pradesh",
        description: "A group of Hindu and Jain temples famous for their intricate and erotic sculptures (UNESCO World Heritage Site)."
    },
    {
        id: 9,
        name: "Ajanta Caves",
        era: "Satavahana & Vakataka Dynasties",
        location: "Maharashtra",
        description: "Rock-cut Buddhist cave monuments featuring beautifully preserved paintings and sculptures depicting the Jataka tales (UNESCO World Heritage Site)."
    },
    {
        id: 10,
        name: "Ellora Caves",
        era: "Rashtrakuta Dynasty",
        location: "Maharashtra",
        description: "One of the largest rock-cut monastery-temple cave complexes in the world, featuring Buddhist, Hindu, and Jain monuments (UNESCO World Heritage Site)."
    },
    {
        id: 11,
        name: "Sanchi Stupa",
        era: "Mauryan Empire",
        location: "Sanchi, Madhya Pradesh",
        description: "The oldest stone structure in India, commissioned by Emperor Ashoka, famous for its grand stupa and ornamental gateways (UNESCO World Heritage Site)."
    },
    {
        id: 12,
        name: "Konark Sun Temple",
        era: "Eastern Ganga Dynasty",
        location: "Konark, Odisha",
        description: "Dedicated to the Sun God Surya, this temple is designed as a colossal chariot with twelve pairs of intricately carved stone wheels (UNESCO World Heritage Site)."
    },
    {
        id: 13,
        name: "Meenakshi Amman Temple",
        era: "Pandyan/Nayak Dynasties",
        location: "Madurai, Tamil Nadu",
        description: "A historic Hindu temple with 14 magnificent Gopurams (gate towers) covered with thousands of mythological figures."
    },
    {
        id: 14,
        name: "Victoria Memorial",
        era: "British Raj",
        location: "Kolkata, West Bengal",
        description: "A large marble building constructed between 1906 and 1921, dedicated to the memory of Queen Victoria."
    },
    {
        id: 15,
        name: "Gateway of India",
        era: "British Raj",
        location: "Mumbai, Maharashtra",
        description: "An iconic arch monument built to commemorate the landing of King-Emperor George V and Queen-Empress Mary at Apollo Bunder in 1911."
    },
    {
        id: 16,
        name: "Jallianwala Bagh",
        era: "Modern History",
        location: "Amritsar, Punjab",
        description: "A garden of national importance marking the site of the 1919 massacre by British forces."
    },
    {
        id: 17,
        name: "Charminar",
        era: "Qutb Shahi Dynasty",
        location: "Hyderabad, Telangana",
        description: "A monument and mosque built in 1591, known as the 'Arc de Triomphe of the East', and the city's global icon."
    },
    {
        id: 18,
        name: "Golconda Fort",
        era: "Kakatiya/Qutb Shahi Dynasties",
        location: "Hyderabad, Telangana",
        description: "A magnificent fort, originally a mud fort, famous for its acoustics and being the source of world-renowned diamonds like the Koh-i-Noor."
    },
    {
        id: 19,
        name: "Amer Fort (आमेर का किला)",
        era: "Kachhwaha Dynasty",
        location: "Jaipur, Rajasthan",
        description: "A beautiful fort built of red sandstone and marble, known for its artistic Hindu style elements (UNESCO World Heritage Site)."
    },
    {
        id: 20,
        name: "Chittorgarh Fort",
        era: "Mewar Kingdom",
        location: "Chittorgarh, Rajasthan",
        description: "The largest fort in India and a UNESCO World Heritage Site, famed for its association with Rajput history, courage, and sacrifice."
    },
    {
        id: 21,
        name: "Nalanda University Ruins",
        era: "Gupta/Pala Empires",
        location: "Bihar",
        description: "The ruins of an ancient Buddhist monastic university, a major center of learning from the 5th to 13th centuries (UNESCO World Heritage Site)."
    },
    {
        id: 22,
        name: "Shore Temple",
        era: "Pallava Dynasty",
        location: "Mahabalipuram, Tamil Nadu",
        description: "A structural temple complex built with blocks of granite, overlooking the Bay of Bengal (UNESCO World Heritage Site)."
    },
];
const filterCategories = [
  { label: "All Types", value: "all" },
  { label: "Festivals", value: "festival" },
  { label: "Cultures", value: "culture" },
  { label: "Historical Places", value: "historical" },
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const getNextMonthName = () => {
  const nextMonthIndex = (new Date().getMonth() + 1) % 12;
  return months[nextMonthIndex];
};

// --- MAP FLY TO COMPONENT ---
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => { if (position) map.flyTo(position, 6); }, [position, map]);
  return null;
};

// --- NEXT MONTH HIGHLIGHT ---
const NextMonthHighlight = ({ festivalsData }) => {
  const nextMonthName = getNextMonthName();
  const nextMonthFestivals = useMemo(() =>
    festivalsData.filter(f => f.month.includes(nextMonthName)),
    [nextMonthName, festivalsData]
  );
  if (nextMonthFestivals.length === 0) {
    return (
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8 rounded-lg shadow-sm flex items-center gap-3">
        <TrendingUp size={20} className="text-orange-600 flex-shrink-0" />
        <p className="text-sm text-orange-800 font-medium">
          <b>Next Month ({nextMonthName})</b>: No major events scheduled yet. Check back for updates!
        </p>
      </div>
    );
  }
  const festivalNames = nextMonthFestivals.map(f => f.name).join(', ');
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-lg shadow-lg flex items-start gap-3 animate-pulse-slow">
      <TrendingUp size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
      <div className='flex-grow'>
        <p className="text-sm text-green-800 font-bold">
          ✨ UPCOMING EVENTS - {nextMonthName.toUpperCase()} ✨
        </p>
        <p className="text-xs text-green-700 mt-1">
          Don't miss: <b>{festivalNames}</b>. Plan your travels now!
        </p>
      </div>
    </div>
  );
};

const Festivals = () => {
  const [filterType, setFilterType] = useState('all');
  const [showMore, setShowMore] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Prepare all cards with cardType and unique ids for cultures/historicals
  const allCards = [
    ...festivalsData.map(f => ({ ...f, cardType: "festival" })),
    ...culturalHighlights.map((f, i) => ({ ...f, cardType: "culture", id: 1000 + i })),
    ...historicalPlaces.map((f, i) => ({ ...f, cardType: "historical", id: 2000 + i })),
  ];

  // Filtered cards by filterType
  const filteredCards = useMemo(() => {
    if (filterType === "festival") return festivalsData.map(f => ({ ...f, cardType: "festival" }));
    if (filterType === "culture") return culturalHighlights.map((f, i) => ({ ...f, cardType: "culture", id: 1000 + i }));
    if (filterType === "historical") return historicalPlaces.map((f, i) => ({ ...f, cardType: "historical", id: 2000 + i }));
    return allCards;
  }, [filterType]);

  const showCards = showMore ? filteredCards : filteredCards.slice(0, 6);

  // Map focus utilities
  const highlightedCard = selectedCard
    || (showMap ? filteredCards.find(f => f.id === hoveredCardId) : null)
    || filteredCards[0];
  const initialMapCenter = highlightedCard && highlightedCard.lat && highlightedCard.lng
    ? [highlightedCard.lat, highlightedCard.lng]
    : [21, 78];

  // Cleanup when view changes
  useEffect(() => { setSelectedCard(null); setHoveredCardId(null); }, [showMap, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-stone-800 mb-4">🇮🇳 Indian Festival Explorer 🇮🇳</h1>
        <p className="text-stone-600">Immerse yourself in the vibrant colors of Indian culture, religion, and history.</p>
      </div>
      <NextMonthHighlight festivalsData={festivalsData} />
      {/* Filter Buttons */}
      <div className="flex gap-3 mb-8 justify-center flex-wrap">
        {filterCategories.map(cat => (
          <button
            key={cat.value}
            className={`px-4 py-2 rounded-lg font-bold border text-sm ${filterType === cat.value ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-stone-700 border-stone-200'}`}
            onClick={() => { setFilterType(cat.value); setShowMore(false); }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List or Map View */}
      {!showMap ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showCards.map(card => (
              <div
                key={card.id || card.name}
                className="bg-white rounded-xl shadow-lg border border-stone-100 overflow-hidden hover:shadow-2xl transition-all group cursor-pointer"
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => setSelectedCard(card)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.img || 'https://placehold.co/500x300?text=Culture+or+Historical'}
                    alt={card.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => e.target.src = 'https://via.placeholder.com/500x300?text=Festival+Image'}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                    <span className="text-white text-xs bg-orange-600 px-2 py-1 rounded-full mb-2 inline-block font-semibold">
                      {card.cardType === "festival" ? card.type
                        : card.cardType === "culture" ? card.aspect
                        : card.cardType === "historical" ? card.era : ""}
                    </span>
                    <h3 className="text-2xl font-bold text-white font-serif">{card.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  {card.cardType === "festival" && (
                    <>
                      <div className="flex items-center gap-4 text-sm text-stone-500 mb-3">
                        <span className="flex items-center gap-1"><Calendar size={14} className="text-teal-600" /> {card.month}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-red-500" /> {card.location}</span>
                      </div>
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">{card.desc}</p>
                    </>
                  )}
                  {card.cardType === "culture" && (
                    <p className="text-stone-600 text-sm mb-4">{card.description}</p>
                  )}
                  {card.cardType === "historical" && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
                        <span><MapPin size={14} className="text-red-500" /> {card.location}</span>
                      </div>
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">{card.description}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {filteredCards.length > 6 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowMore(prev => !prev)}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg shadow font-bold"
              >
                {showMore ? "Show Less" : "See More"}
              </button>
            </div>
          )}
        </>
      ) : (
        // MAP VIEW
        <div className="w-full h-[600px] rounded-2xl flex flex-col border border-stone-300 overflow-hidden shadow-xl">
          <MapContainer
            center={initialMapCenter}
            zoom={5}
            scrollWheelZoom
            style={{ flexGrow: 1, zIndex: 1 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredCards
              .filter(card => card.lat && card.lng)
              .map(card => (
                <Marker
                  key={card.id}
                  position={[card.lat, card.lng]}
                  opacity={hoveredCardId === card.id ? 1.0 : 0.8}
                  eventHandlers={{
                    mouseover: () => setHoveredCardId(card.id),
                    mouseout: () => setHoveredCardId(null),
                    click: () => setSelectedCard(card)
                  }}
                >
                  <Popup>
                    <div className="font-sans">
                      <h3 className="font-bold text-teal-700 mb-1">{card.name}</h3>
                      <p className="text-xs text-stone-600 italic">{card.location || ""}</p>
                      <p className="text-sm mt-1">{card.desc ? card.desc.substring(0, 50) : card.description?.substring(0, 50)}...</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            {/* Focus/fly to selected */}
            {highlightedCard && highlightedCard.lat && highlightedCard.lng && (
              <FlyToLocation position={[highlightedCard.lat, highlightedCard.lng]} />
            )}
          </MapContainer>
          <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center">
            <div className="flex items-center gap-3 text-stone-600">
              <Download size={20} className="text-blue-500" />
              <p className="text-sm">
                <b>Offline Maps:</b> This feature is not supported yet. Use a travel app for offline access.
              </p>
            </div>
            <button onClick={() => setShowMap(false)} className="text-teal-700 font-medium hover:underline text-sm">Return to List</button>
          </div>
        </div>
      )}

      {/* VIEW TOGGLE BUTTONS */}
      <div className="flex mt-10 mb-2 justify-center">
        <div className="bg-stone-100 p-1 rounded-lg flex shadow-inner">
          <button
            onClick={() => setShowMap(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${!showMap ? 'bg-white shadow-md text-teal-700' : 'text-stone-500 hover:bg-stone-200'}`}
          >
            <Grid size={16} /> List View
          </button>
          <button
            onClick={() => setShowMap(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${showMap ? 'bg-white shadow-md text-teal-700' : 'text-stone-500 hover:bg-stone-200'}`}
          >
            <MapIcon size={16} /> Map View
          </button>
        </div>
      </div>

      {/* CARD MODAL */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="relative h-32">
              <img
                src={selectedCard.img || 'https://placehold.co/500x300?text=Culture+or+Historical'}
                className="w-full h-full object-cover"
                alt={selectedCard.name}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center p-6">
                <h2 className="text-2xl font-bold text-white font-serif">{selectedCard.name}</h2>
              </div>
              <button onClick={() => setSelectedCard(null)} className="absolute top-4 right-4 bg-black/20 text-white p-1 rounded-full hover:bg-black/40 transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-sm">
                {selectedCard.cardType === "festival" && (
                  <>
                    <b>Month:</b> {selectedCard.month}<br />
                    <b>Location:</b> {selectedCard.location}<br /><br />
                    {selectedCard.desc}
                  </>
                )}
                {selectedCard.cardType === "culture" && (
                  <>
                    <b>Aspect:</b> {selectedCard.aspect}<br /><br />
                    {selectedCard.description}
                  </>
                )}
                {selectedCard.cardType === "historical" && (
                  <>
                    <b>Era:</b> {selectedCard.era}<br />
                    <b>Location:</b> {selectedCard.location}<br /><br />
                    {selectedCard.description}
                  </>
                )}
              </div>
            </div>
            <div className="bg-stone-50 p-4 border-t border-stone-100 flex justify-end">
              <button onClick={() => setSelectedCard(null)} className="px-4 py-2 bg-stone-200 text-stone-800 rounded-lg text-sm font-medium hover:bg-stone-300 transition">
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
