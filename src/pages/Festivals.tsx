import { useState, useEffect, useMemo } from 'react';
import { Grid, Map as MapIcon, TrendingUp } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
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

const FlyToLocation = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => { if (position) map.flyTo(position, 6); }, [position, map]);
  return null;
};

const NextMonthHighlight = ({ festivalsData }: { festivalsData: any[] }) => {
  const months = ['January', 'February', 'March', 'April','May','June','July','August','September','October','November','December'];
  const nextMonthName = months[(new Date().getMonth() + 1) % 12];

  const events = festivalsData.filter((e: any) => e.month.includes(nextMonthName));

  return (
    <div className={`p-4 mb-8 rounded-lg shadow ${events.length ? "bg-green-50 border-l-4 border-green-600" : "bg-orange-50 border-l-4 border-orange-500"}`}>
      <TrendingUp className="inline-block mr-2" />
      {events.length ? (
        <span className="font-semibold">Upcoming in {nextMonthName}: {events.map(e => e.name).join(', ')}</span>
      ) : (
        "No festival next month. Stay tuned!"
      )}
    </div>
  );
};


// ---------------- MAIN COMPONENT ----------------
export default function Festivals() {

  const [filterType, setFilterType] = useState("all");
  const [showMore, setShowMore] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const allCards = useMemo(() => [
    ...festivalsData.map(f => ({ ...f, cardType: "festival" as const })),
    ...culturalHighlights.map((f, i) => ({ ...f, cardType: "culture" as const, id: 1000 + i })),
    ...historicalPlaces.map((f, i) => ({ ...f, cardType: "historical" as const, id: 2000 + i })),
  ], []);

  const filteredCards = useMemo(() => {
    if (filterType === "festival") return festivalsData.map(f => ({ ...f, cardType: "festival" as const }));
    if (filterType === "culture") return culturalHighlights.map((f, i) => ({ ...f, cardType: "culture" as const, id: 1000 + i }));
    if (filterType === "historical") return historicalPlaces.map((f, i) => ({ ...f, cardType: "historical" as const, id: 2000 + i }));
    return allCards;
  }, [filterType, allCards]);

  const displayedCards = showMore ? filteredCards : filteredCards.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-bold text-center mb-5">🇮🇳 Indian Festival Explorer</h1>

      <NextMonthHighlight festivalsData={festivalsData} />

      {/* FILTERS */}
      <div className="flex gap-2 justify-center my-6">
        {filterCategories.map(cat => (
          <button
            key={cat.value}
            onClick={() => { setShowMore(false); setFilterType(cat.value); }}
            className={`px-4 py-2 rounded-md border text-sm 
              ${filterType === cat.value ? "bg-teal-700 text-white" : "bg-white border-gray-300"}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* GRID VIEW */}
      {!showMap && (
        <>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCards.map((card: any) => {
            const desc = "desc" in card ? (card as any).desc : "description" in card ? (card as any).description : "";
            const img = "img" in card ? (card as any).img : "https://placehold.co/400";
            return (
              <div key={card.id} onClick={() => setSelectedCard(card)} className="bg-white shadow hover:shadow-lg cursor-pointer rounded-lg overflow-hidden">
                <img 
                  src={img || "https://placehold.co/400"}
                  className="h-48 w-full object-cover"
                  onError={(e: any)=>e.target.src="https://placehold.co/400"}
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg">{card.name}</h2>
                  <p className="text-gray-600 text-sm">{desc?.slice(0,100)}...</p>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCards.length > 6 && (
          <div className="text-center my-6">
            <button onClick={() => setShowMore(!showMore)} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              {showMore ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
        </>
      )}


      {/* MAP VIEW */}
      {showMap && (
        <div className="mt-8">
          <MapContainer center={[21, 78]} zoom={5} className="h-96 rounded-lg shadow-lg">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {festivalsData.map(f => (
              <Marker key={f.id} position={[f.lat, f.lng]}>
                <Popup>{f.name}</Popup>
              </Marker>
            ))}
            {selectedCard?.lat && <FlyToLocation position={[selectedCard.lat, selectedCard.lng]} />}
          </MapContainer>
        </div>
      )}

      {/* MAP TOGGLE BTN */}
      <div className="text-center mt-6">
        <button onClick={() => setShowMap(!showMap)} className="bg-teal-700 text-white px-5 py-2 rounded-lg flex mx-auto gap-2">
          {showMap ? <Grid /> : <MapIcon />} {showMap ? "Show List View" : "Show Map View"}
        </button>
      </div>
    </div>
  );
}
