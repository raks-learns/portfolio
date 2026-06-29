import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, Menu, Music, ArrowRight, Instagram, Youtube, Mail, MapPin, Ticket, Volume2, VolumeX, Quote, Globe, Sun, Moon, Briefcase, Mic2, ChevronRight } from 'lucide-react';

// --- CONFIGURATION ---
// Paste the Google Sheet ID here (the long string in the sheet URL)
const SHEET_ID = "1P6r04LmQAfBhajoOXqOeuDjpZ08VOC_GZmKIPIQkPAI";
const DEFAULT_YT_LINK = "https://youtube.com/@aishwaryamahesh6605";

const gvizUrl = (tab) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tab)}`;

const parseGviz = (text) => {
  const match = text.match(/setResponse\(([\s\S]+)\);?\s*$/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const parseEventDate = (str) => {
  if (!str) return null;
  const parts = str.split(' ');
  if (parts.length !== 3) return null;
  const monthIdx = MONTHS.indexOf(parts[1]);
  if (monthIdx === -1) return null;
  return new Date(+parts[2], monthIdx, +parts[0]);
};

const formatGvizCell = (cell) => {
  if (!cell) return '';
  const v = cell.v;
  // gviz returns dates as "Date(year,month0indexed,day)"
  if (typeof v === 'string' && v.startsWith('Date(')) {
    const [y, m, d] = v.slice(5, -1).split(',').map(Number);
    return `${d} ${MONTHS[m]} ${y}`;
  }
  return cell.f ?? v ?? '';
};

const tableToRows = (table) => {
  if (!table) return [];
  const headers = table.cols.map(c => c.label);
  return table.rows.map(row =>
    Object.fromEntries(headers.map((h, i) => [h, formatGvizCell(row.c[i])]))
  );
};

// --- MOCK DATA FOR PREVIEW (Ensures UI looks good even if API fails) ---
const INITIAL_DATA = {
  // --- Content fields (owner edits these in npoint) ---
  name: "Aishwarya Mahesh",
  tagline: "Investment Strategist & Carnatic Vocalist.",
  shortIntro: "I am a 24-year-old investment strategist at ithought Financial Consulting LLP and an aspiring Carnatic vocalist, deeply rooted in tradition.",
  quote: "Music is not just an art, it is a way of life; it does not always have to have structure, let it flow!",
  desc: "Aishwarya Mahesh balances a dynamic professional career in finance with continual learning and creative expression in Carnatic music.",
  aboutTitle: "My Musical Journey",
  bioBlock1: "Born into a family steeped in Carnatic tradition, music has been part of my life since childhood. My great-grandfather was the mridangam maestro Shri Thanjavur Vaidyanatha Iyer, and I am also related to the composer Shri Maha Vaidyanatha Sivan. These roots, together with disciplined tutelage, deeply shape my interests as a performing artist.",
  bioBlock2Title: "Training",
  bioBlock2: "I currently train under the esteemed Vidushis Smt. Ranjani and Gayatri. Prior to this, I was privileged to receive 13 years of foundational training from Vidushi Smt. Jaysri Jeyaraaj Krishnan and Vidwan Sri J.T. Jeyaraaj Krishnan at the Veenavaadhini Sampradaya Sangit Trust, Chennai. This rigorous background enriched my vocal phrasings and instilled a deep respect for the art.",
  bioBlock3Title: "Performance",
  bioBlock3: "I perform across sabhas, temples, festivals, and digital platforms, exploring both classical repertoire and collaborative fusion projects. I strive to honor tradition while bringing a contemporary sensibility to my concerts. Outside music, I balance a professional career in finance with continual learning and creative expression.",
  cardSparkQuote: "Music has been part of my life since childhood, nurtured by a family steeped in tradition.",
  cardSparkContext: "From early recitations to performing at esteemed Sabhas, the journey is an ongoing Sadhana.",
  cardLineageText: "My great-grandfather was the mridangam maestro Shri Thanjavur Vaidyanatha Iyer. I am also related to composer Shri Maha Vaidyanatha Sivan.",
  cardPhilosophyText: "I balance a professional career in finance with continual learning and creative expression in Carnatic music.",
  // --- Dynamic data ---
  events: [
    { date: "MAR 21, 2026", loc: "PALAKKAD", venue: "Chokkanathapuram Temple", link: "#" },
    { date: "FEB 15, 2026", loc: "CHENNAI", venue: "House of Kutcheri", link: "#" },
    { date: "JAN 25, 2026", loc: "COIMBATORE", venue: "Isha Yoga Centre", link: "#" },
    { date: "DEC 18, 2025", loc: "CHENNAI", venue: "Rasika Ranjani Sabha", link: "#" }
  ],
  tracks: [
    { id: 1, title: "Vathapi Ganapathim", subtitle: "Hamsadhwani • Adi", time: "6:45", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop", link: "#" },
    { id: 2, title: "Endaro Mahanubhavulu", subtitle: "Sri • Adi", time: "12:30", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop", link: "#" },
    { id: 3, title: "Krishna Nee Begane", subtitle: "Yamunakalyani • Misra Chapu", time: "5:20", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop", link: "#" },
    { id: 4, title: "Thillana", subtitle: "Dhanashree • Adi", time: "4:15", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop", link: "#" }
  ],
  contact: {
    email: "aishumusicvv@gmail.com",
    phone: "+91 9962012601",
    instagram: "https://www.instagram.com/aishu_mahesh",
    youtube: "https://www.youtube.com/channel/UCtkoP3BfbUcPZvG9nPDYnVg",
    facebook: "#",
    websiteBy: "RagaDesigns",
    websiteByLink: "#"
  }
};

// --- IMAGE COLLECTIONS FOR SLIDESHOWS ---
const LINEAGE_IMAGES = [
  "src/assets/lineage1.png",
  "src/assets/lineage2.png",
  "src/assets/lineage3.png",
];

const MASTERY_IMAGES = [
  "src/assets/mastery1.png",
  "src/assets/mastery2.png",
  "src/assets/mastery3.png",
];

// --- FONTS & STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Proza+Libre:wght@400;500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Kannada:wght@400;700&family=Noto+Serif+Tamil:wght@400;700&family=Noto+Serif+Telugu:wght@400;700&family=Rozha+One&family=Sahitya:wght@400;700&display=swap');

    .font-base-en { font-family: 'Cormorant Garamond', serif; }
    .text-base-en { font-family: 'Proza Libre', sans-serif; letter-spacing: 0.02em; }
    .font-indian-style { font-family: 'Rozha One', serif; }

    .font-base-hi { font-family: 'Rozha One', serif; }
    .text-base-hi { font-family: 'Sahitya', serif; }
    .font-base-kn, .text-base-kn { font-family: 'Noto Serif Kannada', serif; }
    .font-base-ta, .text-base-ta { font-family: 'Noto Serif Tamil', serif; }
    .font-base-te, .text-base-te { font-family: 'Noto Serif Telugu', serif; }
    
    .bg-pattern {
      background-image: radial-gradient(#D97706 0.5px, transparent 0.5px), radial-gradient(#D97706 0.5px, transparent 0.5px);
      background-size: 32px 32px;
      background-position: 0 0, 16px 16px;
    }
    
    @keyframes slide-up {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
    
    /* Elegant gentle swing for tassels */
    @keyframes swing {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(5deg); }
      75% { transform: rotate(-5deg); }
      100% { transform: rotate(0deg); }
    }
    .tassel-swing { transform-origin: top center; animation: swing 4s ease-in-out infinite; }
    
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* Sound Wave Animation */
    @keyframes soundwave {
      0% { height: 4px; opacity: 0.3; }
      50% { height: 24px; opacity: 1; }
      100% { height: 4px; opacity: 0.3; }
    }
    .wave-bar { animation: soundwave 1.2s ease-in-out infinite; }
  `}</style>
);

const translations = {
  en: {
    // UI labels only — content (name, bio, quote, etc.) comes from npoint
    about: "The Journey",
    music: "Music", events: "Events", contact: "Contact", listen: "Listen Now",
    sadhana: "The Sadhana",
    training: "Years of Training", concerts: "Concerts Survived", works: "Works",
    viewAll: "View All", performances: "Performances", details: "View Details", explore: "Explore", connect: "Connect",
    soundOn: "Sound On", soundOff: "Sound Off", menu: "Menu", liveAt: "Live at Chennai", watchHighlights: "Watch Highlights", followInsta: "Follow Journey", designedBy: "Designed with Raga & Rhythm", upcoming: "Upcoming Event", getTickets: "Details"
  },
  kn: { name: "ಐಶ್ವರ್ಯ ಮಹೇಶ್", about: "ಪರಿಚಯ", music: "ಸಂಗೀತ", events: "ಕಾರ್ಯಕ್ರಮಗಳು", contact: "ಸಂಪರ್ಕ", listen: "ಕೇಳಿ", type: "ಕರ್ನಾಟಿಕ್ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ", tagline: "ಹೂಡಿಕೆ ತಂತ್ರಜ್ಞ ಮತ್ತು ಕರ್ನಾಟಿಕ್ ಗಾಯಕಿ.", soundOn: "ಧ್ವನಿ ಆನ್", soundOff: "ಧ್ವನಿ ಆಫ್", menu: "ಮೆನು", works: "ಆಯ್ದ ಕೃತಿಗಳು", performances: "ಪ್ರದರ್ಶನಗಳು", explore: "ಅನ್ವೇಷಿಸಿ", connect: "ಸಂಪರ್ಕಿಸಿ", upcoming: "ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮ", getTickets: "ವಿವರಗಳು" },
  hi: { name: "ऐश्वर्या महेश", about: "परिचय", music: "संगीत", events: "कार्यक्रम", contact: "संपर्क", listen: "अभी सुनें", type: "कर्नाटक शास्त्रीय संगीत", tagline: "निवेश रणनीतिकार और कर्नाटक गायिका।", soundOn: "ध्वनि चालु", soundOff: "ध्वनि बंद", menu: "मेन्यू", works: "चयनित कृतियां", performances: "प्रस्तुतियां", explore: "खोजें", connect: "जुड़ें", upcoming: "आगामी कार्यक्रम", getTickets: "विवरण" },
  ta: { name: "ஐஸ்வர்யா மகேஷ்", about: "அறிமுகம்", music: "இசை", events: "நிகழ்வுகள்", contact: "தொடர்பு", listen: "கேளுங்கள்", type: "கர்நாடக இசை", tagline: "முதலீட்டு வியூகவாதி & கர்நாடக பாடகி.", soundOn: "ஒலி ஆன்", soundOff: "ஒலி ஆஃப்", menu: "மெனு", works: "படைப்புகள்", performances: "நிகழ்ச்சிகள்", upcoming: "வரவிருக்கும் நிகழ்வு", getTickets: "விவரங்கள்" },
  te: { name: "ఐశ్వర్య మహేష్", about: "పరిచయం", music: "సంగీతం", events: "కార్యక్రమాలు", contact: "సంప్రదించండి", listen: "వినండి", type: "కర్ణాటక సంగీతం", tagline: "ఇన్వెస్ట్‌మెంట్ స్ట్రాటజిస్ట్ & కర్నాటిక్ వోకలిస్ట్.", soundOn: "సౌండ్ ఆన్", soundOff: "సౌండ్ ఆఫ్", menu: "మెనూ", works: "కృతులు", performances: "ప్రదర్శనలు", upcoming: "రాబోయే కార్యక్రమం", getTickets: "వివరాలు" }
};

// --- HELPER COMPONENTS ---

const MotifSeparator = ({ isNightMode }) => (
  <div className="flex items-center justify-center py-24 opacity-60 px-4">
    <div className={`hidden md:block h-px w-24 md:w-96 ${isNightMode ? 'bg-orange-200' : 'bg-stone-400'}`}></div>
    <div className={`mx-4 ${isNightMode ? 'text-orange-200' : 'text-stone-600'}`}>
      <svg width="300" height="60" viewBox="0 0 200 40" fill="none" stroke="currentColor" strokeWidth="1.5">
         <path d="M0 20 Q 50 0 100 20 T 200 20" strokeDasharray="4 2" />
         <path d="M10 20 C 30 35, 70 35, 90 20 S 130 5, 150 20 S 190 35, 200 20" />
         <circle cx="100" cy="20" r="3" fill="currentColor"/>
         <circle cx="50" cy="25" r="2" fill="currentColor"/>
         <circle cx="150" cy="15" r="2" fill="currentColor"/>
      </svg>
    </div>
    <div className={`hidden md:block h-px w-24 md:w-96 ${isNightMode ? 'bg-orange-200' : 'bg-stone-400'}`}></div>
  </div>
);

const SwaraWave = ({ isNightMode }) => (
  <div className="flex items-center gap-1 h-8">
    {[...Array(12)].map((_, i) => (
      <div 
        key={i} 
        className={`w-1 rounded-full wave-bar ${isNightMode ? 'bg-[#D97706]' : 'bg-[#D97706]'}`}
        style={{ animationDelay: `${i * 0.1}s` }}
      ></div>
    ))}
  </div>
);

const PlaceholderImg = ({ label, isNightMode, customIcon }) => (
  <div className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center transition-all hover:border-solid group ${isNightMode ? 'border-white/20 hover:border-[#D97706]' : 'border-stone-300 hover:border-[#D97706]'}`}>
     <div className="mb-4 opacity-50 group-hover:scale-110 transition-transform">
       {customIcon || (
         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
           <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
           <circle cx="8.5" cy="8.5" r="1.5"></circle>
           <polyline points="21 15 16 10 5 21"></polyline>
         </svg>
       )}
     </div>
     <p className="text-xs uppercase tracking-widest font-bold opacity-70 mb-2">Image</p>
     <p className="text-sm italic opacity-50">{label}</p>
  </div>
);

// --- NEW AUTO SCROLL FRAME COMPONENT ---
const AutoScrollFrame = ({ images, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-stone-200">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={img} 
            alt={`Slide ${index}`} 
            className="w-full h-full object-cover" 
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop"; }}
          />
        </div>
      ))}
      
      {/* Simple indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- ELEGANT FRAME COMPONENT (Replaces Comic Frame) ---
const ElegantFrame = ({ label, isNightMode }) => (
  <div className={`w-full h-full flex flex-col items-center justify-center p-4 shadow-xl transform transition-transform duration-500 hover:scale-105 rounded-xl ${isNightMode ? 'bg-[#1E293B] border border-white/10' : 'bg-white border border-stone-200'}`}>
     <div className="w-full h-48 border border-stone-300/50 flex items-center justify-center mb-4 relative overflow-hidden rounded-lg">
        <img src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop" alt="Early Days" className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"/>
     </div>
     <p className={`text-xs tracking-widest uppercase font-bold ${isNightMode ? 'text-stone-400' : 'text-stone-500'}`}>{label}</p>
  </div>
);

const MandalaBg = ({ isNightMode }) => (
  <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${isNightMode ? 'opacity-[0.05]' : 'opacity-[0.15]'}`}>
    <svg className={`w-[140vh] h-[140vh] animate-[spin_180s_linear_infinite] ${isNightMode ? 'text-white' : 'text-[#78350F]'}`} viewBox="0 0 200 200">
       <path d="M100 15 Q130 18, 185 100 Q130 182, 100 185 Q70 182, 15 100 Q70 18, 100 15" stroke="currentColor" strokeWidth="0.2" fill="none" opacity="0.3" />
       <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="0.3" fill="none" strokeDasharray="3 6" />
       {[...Array(12)].map((_, i) => (
         <g key={i} transform={`rotate(${i * 30} 100 100)`}>
            <path d="M100 40 C 112 60, 118 85, 100 100 C 82 85, 88 60, 100 40" stroke="currentColor" strokeWidth="0.6" fill="none" />
            <path d="M100 55 L 100 75" stroke="currentColor" strokeWidth="0.2" opacity="0.5" />
            <circle cx="100" cy="35" r="1.2" fill="currentColor" />
            <circle cx="110" cy="50" r="0.8" fill="currentColor" opacity="0.4" />
         </g>
       ))}
       <path d="M90 100 Q95 90 100 100 Q105 110 110 100 Q105 90 100 100 Q95 110 90 100" stroke="currentColor" strokeWidth="0.5" fill="none" />
       <circle cx="100" cy="100" r="8" stroke="currentColor" strokeWidth="0.4" fill="none" strokeDasharray="2 2" />
    </svg>
  </div>
);

// --- STATIC MENU TORAN ---
const MenuToran = () => (
  <div className="w-full absolute top-0 left-0 z-20 pointer-events-none overflow-hidden">
     <div className="w-full h-24 opacity-80" style={{
         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q 30 15 60 0' stroke='%23D97706' stroke-width='1.5' fill='none'/%3E%3Cpath d='M15 5 V 20 Q 5 35 15 50 Q 25 35 15 20' fill='%23D97706' fill-opacity='0.2' stroke='%23D97706' stroke-width='1.5'/%3E%3Cpath d='M45 5 V 20 Q 35 35 45 50 Q 55 35 45 20' fill='%23D97706' fill-opacity='0.2' stroke='%23D97706' stroke-width='1.5'/%3E%3Ccircle cx='15' cy='12' r='2' fill='%23D97706'/%3E%3Ccircle cx='45' cy='12' r='2' fill='%23D97706'/%3E%3C/svg%3E")`,
         backgroundRepeat: 'repeat-x',
         backgroundPosition: 'top center'
     }}></div>
  </div>
);

// --- HOOKS ---

const useTanpura = () => {
  const audioContext = useRef(null);
  const oscillators = useRef([]);
  const gainNode = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const initAudio = () => {
    if (!audioContext.current) audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    return audioContext.current;
  };

  const startDrone = useCallback(() => {
    const ctx = initAudio();
    if (ctx.state === 'suspended') ctx.resume();
    if (oscillators.current.length > 0) return;
    gainNode.current = ctx.createGain();
    gainNode.current.gain.value = 0.1;
    gainNode.current.connect(ctx.destination);
    const baseFreq = 207.65;
    [baseFreq, baseFreq * 1.5, baseFreq * 2].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      if (i > 0) osc.detune.value = Math.random() * 5 - 2.5;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.2 / (i + 1);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(gainNode.current);
      osc.start();
      oscillators.current.push(osc);
    });
    setIsPlaying(true);
  }, []);

  const stopDrone = useCallback(() => {
    if (gainNode.current && audioContext.current) gainNode.current.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 1);
    setTimeout(() => {
      oscillators.current.forEach(osc => osc.stop());
      oscillators.current = [];
      setIsPlaying(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      const ctx = initAudio();
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => { if (isPlaying && oscillators.current.length === 0) startDrone(); });
      }
      ['click', 'keydown', 'scroll'].forEach(ev => document.removeEventListener(ev, handleInteraction));
    };
    ['click', 'keydown', 'scroll'].forEach(ev => document.addEventListener(ev, handleInteraction));
    return () => ['click', 'keydown', 'scroll'].forEach(ev => document.removeEventListener(ev, handleInteraction));
  }, [isPlaying, startDrone]);

  return { isPlaying, toggle: () => isPlaying ? stopDrone() : startDrone() };
};

const CustomCursor = ({ isDark }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const cursor = useRef({ x: -100, y: -100 });
  const lastPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    const onMouseMove = (e) => { cursor.current = { x: e.clientX, y: e.clientY }; };
    const onTouchMove = (e) => { 
        if(e.touches.length > 0) {
            cursor.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; 
        }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchstart', onTouchMove);

    const swaras = ['ಸ', 'ರಿ', 'ಗ', 'ಮ', 'ಪ', 'ದ', 'ನಿ', 'Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Da', 'Ni'];
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = isDark ? '251, 146, 60' : '234, 88, 12';
      const dx = cursor.current.x - lastPos.current.x;
      const dy = cursor.current.y - lastPos.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > 30) {
        particles.current.push({ x: cursor.current.x, y: cursor.current.y, text: swaras[Math.floor(Math.random() * swaras.length)], life: 1.0, vx: (Math.random() - 0.5) * 1, vy: -0.5 - Math.random() });
        lastPos.current = { ...cursor.current };
      }
      particles.current.forEach((p, i) => {
        p.life -= 0.015; p.x += p.vx; p.y += p.vy;
        if (p.life <= 0) particles.current.splice(i, 1);
        else { ctx.font = "16px serif"; ctx.fillStyle = `rgba(${color}, ${p.life})`; ctx.fillText(p.text, p.x, p.y); }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => { 
        window.removeEventListener('resize', resize); 
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchstart', onTouchMove);
        cancelAnimationFrame(animationFrameId); 
    };
  }, [isDark]);
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[100]" />;
};

// --- MAIN APP ---

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showEventToast, setShowEventToast] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [lang, setLang] = useState('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // Changed default to a remote URL for preview
  const [portraitImage, setPortraitImage] = useState('src/assets/portrait.png');
  const [imageError, setImageError] = useState(false);

  const [data, setData] = useState(INITIAL_DATA);

  const { isPlaying: isDronePlaying, toggle: toggleDrone } = useTanpura();

  useEffect(() => {
    Promise.all([
      fetch(gvizUrl('Content')).then(r => r.text()).then(parseGviz),
      fetch(gvizUrl('Events')).then(r => r.text()).then(parseGviz),
      fetch(gvizUrl('Tracks')).then(r => r.text()).then(parseGviz),
    ]).then(([contentGviz, eventsGviz, tracksGviz]) => {
      const contentRows = tableToRows(contentGviz?.table);
      const contentObj = Object.fromEntries(
        contentRows.filter(r => r.Key).map(r => [r.Key, r.Value])
      );
      const events = tableToRows(eventsGviz?.table).filter(e => e.venue || e.date);
      const tracks = tableToRows(tracksGviz?.table)
        .filter(t => t.title)
        .map((t, i) => ({ ...t, id: i + 1 }));

      setData(prev => ({
        ...prev,
        ...contentObj,
        events: events.length > 0 ? events : prev.events,
        tracks: tracks.length > 0 ? tracks : prev.tracks,
        contact: {
          ...prev.contact,
          ...(contentObj.email && { email: contentObj.email }),
          ...(contentObj.phone && { phone: contentObj.phone }),
          ...(contentObj.instagram && { instagram: contentObj.instagram }),
          ...(contentObj.youtube && { youtube: contentObj.youtube }),
          ...(contentObj.facebook && { facebook: contentObj.facebook }),
          ...(contentObj.websiteBy && { websiteBy: contentObj.websiteBy }),
          ...(contentObj.websiteByLink && { websiteByLink: contentObj.websiteByLink }),
        }
      }));

      if (contentObj.portrait) setPortraitImage(contentObj.portrait);
    }).catch(e => console.warn('[sheets] Fetch failed, using fallback data:', e.message));
    
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[lang] || translations['en'];
  // Strip non-string fields from data before merging into content
  const { events: _e, tracks: _tr, contact: _c, portrait: _p, ...contentFields } = data;
  // content = UI labels from translations + content fields from npoint (en) or native translations (other langs)
  const content = lang === 'en'
    ? { ...translations.en, ...contentFields }
    : { ...translations.en, ...contentFields, ...t };
  const scrollTo = (id) => { setIsMenuOpen(false); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 500); };

  const handleImageError = () => {
      setPortraitImage('src/assets/portrait.png');
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const eventsWithDates = data.events.map(e => ({ ...e, _d: parseEventDate(e.date) }));
  const upcomingEvents = eventsWithDates.filter(e => e._d && e._d >= today).sort((a, b) => a._d - b._d);
  const pastEvents = eventsWithDates.filter(e => !e._d || e._d < today).sort((a, b) => (b._d || 0) - (a._d || 0));
  const featuredEvent = upcomingEvents[0] || pastEvents[0];
  const featuredLabel = upcomingEvents.length > 0 ? 'Upcoming Event' : 'Latest Event';

  return (
    <div className={`min-h-screen font-base-${lang} transition-colors duration-1000 overflow-x-hidden relative ${isNightMode ? 'bg-[#0B1221] text-[#E0E7FF]' : 'bg-[#FDFBF7] text-[#422006]'}`}>
      <GlobalStyles />
      <div className={`fixed inset-0 opacity-[0.08] pointer-events-none z-0 bg-pattern ${isNightMode ? 'invert opacity-[0.05]' : ''}`}></div>
      <CustomCursor isDark={isNightMode} />
      
      {showEventToast && featuredEvent && (
        <div className={`fixed bottom-8 right-8 z-[60] p-6 max-w-xs shadow-2xl border-l-4 border-[#D97706] animate-slide-up hidden md:block ${isNightMode ? 'bg-[#0B1221]' : 'bg-[#451a03] text-[#FEF3C7]'}`}>
          <button onClick={() => setShowEventToast(false)} className="absolute top-2 right-2 opacity-50 hover:opacity-100"><X size={14} /></button>
          <div className="text-xs tracking-[0.2em] uppercase text-[#D97706] mb-2">{featuredLabel}</div>
          <h4 className={`text-xl font-base-${lang} mb-1 font-bold`}>{featuredEvent.venue}</h4>
          <p className="text-sm mb-4 opacity-70">{featuredEvent.date} • {featuredEvent.loc}</p>
          <a href={featuredEvent.link} target="_blank" rel="noreferrer" className="w-full py-2 bg-[#D97706] text-white text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#b45309]">
            <Ticket size={14} /> {content.getTickets}
          </a>
        </div>
      )}

      {}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? (isNightMode ? 'bg-[#0B1221]/95 border-[#1e293b]' : 'bg-[#FDFBF7]/95 border-[#e7e5e4]') + ' backdrop-blur-md py-4 border-b' : 'py-8'}`}>
        <div className="container mx-auto px-8 flex justify-between items-center">
          <span onClick={() => scrollTo('home')} className={`text-xl tracking-[0.2em] font-base-${lang} font-bold cursor-pointer uppercase`}>AISHWARYA<span className="text-[#D97706]">.</span></span>
          
          <div className="hidden lg:flex items-center gap-12 absolute left-1/2 transform -translate-x-1/2">
             {['events', 'about', 'music', 'contact'].map((item) => (
               <button 
                 key={item} 
                 onClick={() => scrollTo(item)} 
                 className={`text-xs font-bold tracking-[0.2em] uppercase hover:text-[#D97706] transition-colors ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}
               >
                 {content[item]}
               </button>
             ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-2 hover:text-[#D97706] transition-colors p-2 text-xs font-bold uppercase tracking-widest ${isNightMode ? 'text-indigo-300' : 'text-[#422006]'}`}
              >
                <Globe size={16} /> <span>{lang}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className={`absolute top-full right-0 mt-2 py-2 rounded-xl shadow-xl min-w-[120px] z-50 border ${isNightMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#FFFBEB] border-[#FDE68A]'}`}>
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'kn', label: 'ಕನ್ನಡ' },
                    { code: 'ta', label: 'தமிழ்' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'te', label: 'తెలుగు' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setIsLangMenuOpen(false); }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:text-[#D97706] hover:bg-black/5 ${lang === l.code ? 'text-[#D97706] font-bold' : ''}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:flex gap-4">
               <button onClick={toggleDrone} className={`flex items-center gap-2 text-xs font-bold uppercase hover:text-[#D97706] border px-4 py-2 rounded-full ${isDronePlaying ? 'border-[#D97706] text-[#D97706]' : 'border-stone-300'}`}>
                 {isDronePlaying ? <Volume2 size={14} /> : <VolumeX size={14} />} {isDronePlaying ? content.soundOn : content.soundOff}
               </button>
               <button onClick={() => setIsNightMode(!isNightMode)} className={`p-2 hover:text-[#D97706] transition-colors ${isNightMode ? 'text-indigo-300' : 'text-stone-600'}`}>{isNightMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-3 text-xs font-bold uppercase hover:text-[#D97706] cursor-pointer"><span>{content.menu}</span><Menu size={24} /></button>
          </div>
        </div>
      </nav>

      {}
      {/* MENU CURTAINS - Softened for elegance */}
      <div className={`fixed inset-0 z-[60] pointer-events-none flex ${isMenuOpen ? 'pointer-events-auto' : ''}`}>
        {/* Left Curtain */}
        <div className={`relative w-1/2 h-full transition-transform duration-1000 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isNightMode ? 'bg-[#0B1221]/95 backdrop-blur-md' : 'bg-[#292524]/95 backdrop-blur-md'} flex items-center justify-end`}>
           <div className="absolute right-0 h-full transform translate-x-full z-10">
              <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className={`block ${isNightMode ? 'text-[#0B1221]' : 'text-[#292524]'}`}>
                 <path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="currentColor" />
              </svg>
           </div>
        </div>
        
        {/* Right Curtain */}
        <div className={`relative w-1/2 h-full transition-transform duration-1000 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} ${isNightMode ? 'bg-[#0B1221]/95 backdrop-blur-md' : 'bg-[#292524]/95 backdrop-blur-md'} flex items-center justify-start`}>
           <div className="absolute left-0 h-full transform -translate-x-full z-10 scale-x-[-1]">
              <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className={`block ${isNightMode ? 'text-[#0B1221]' : 'text-[#292524]'}`}>
                 <path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="currentColor" />
              </svg>
           </div>
        </div>

        {/* Menu Content */}
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-500 delay-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <MenuToran />
           <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-[#D97706] z-[70] cursor-pointer hover:rotate-90 transition-transform"><X size={36} /></button>
           
           <div className="text-center space-y-6 w-full px-8">
            {['events', 'about', 'music', 'contact'].map(item => <button key={item} onClick={() => scrollTo(item)} className={`block w-full text-4xl sm:text-5xl md:text-7xl font-base-${lang} text-[#FEF3C7] hover:text-[#D97706] capitalize transition-colors`}>{content[item]}</button>)}
          </div>

          <div className="flex flex-col items-center gap-6 mt-16">
             <button onClick={toggleDrone} className="flex items-center gap-2 text-xs font-bold uppercase border px-6 py-3 rounded-full text-[#FEF3C7] border-[#FEF3C7] hover:border-[#D97706] hover:text-[#D97706] transition-all">
              {isDronePlaying ? <Volume2 size={16} /> : <VolumeX size={16} />} <span>{isDronePlaying ? content.soundOn : content.soundOff}</span>
            </button>
            <div className="flex gap-8 text-[#FEF3C7]">
              <a href={data.contact.instagram} target="_blank" rel="noreferrer" className="hover:text-[#D97706] transition-colors"><Instagram size={28} /></a>
              <a href={data.contact.youtube} target="_blank" rel="noreferrer" className="hover:text-[#D97706] transition-colors"><Youtube size={28} /></a>
            </div>
          </div>
        </div>
      </div>

      {}
      {/* UPDATED HERO SECTION: Split layout with Portrait & Short Bio */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-8 md:px-16 overflow-hidden pt-32 pb-16">
        <MandalaBg isNightMode={isNightMode} />
        <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-10 items-center">
          
          <div className="text-left flex flex-col justify-center order-2 md:order-1 mt-8 md:mt-0">
            <h1 className={`text-6xl md:text-8xl font-indian-style mb-4 tracking-tight leading-none ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#292524]'}`}>{content.name}</h1>
            <p className="text-xl md:text-2xl font-light italic opacity-90 mb-6 text-[#D97706]">{content.tagline}</p>
            <p className={`text-base md:text-lg font-light opacity-80 mb-10 max-w-md leading-relaxed ${isNightMode ? 'text-stone-300' : 'text-stone-600'}`}>{content.shortIntro}</p>
            
            <div className="flex flex-wrap gap-4">
               <button onClick={() => scrollTo('music')} className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D97706] text-white hover:bg-[#b45309] transition-all shadow-lg hover:shadow-xl">
                 <span className="tracking-widest text-xs font-bold uppercase">{content.listen}</span><Music size={16} />
               </button>
               <button onClick={() => scrollTo('about')} className={`inline-flex items-center gap-3 px-8 py-4 rounded-full border transition-all ${isNightMode ? 'border-white/20 hover:bg-white hover:text-black' : 'border-black/20 hover:bg-black hover:text-white'}`}>
                 <span className="tracking-widest text-xs font-bold uppercase">{content.explore}</span>
               </button>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center md:justify-end relative">
             {/* Decorative Elements around Portrait */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border border-[#D97706]/20 animate-[spin_60s_linear_infinite] border-dashed"></div>
             
             {/* The Elegant Portrait Frame */}
             <div className="relative w-64 h-80 md:w-[25rem] md:h-[35rem] rounded-t-full rounded-b-3xl overflow-hidden shadow-2xl border-4 border-[#D97706]/10 group">
               <img src={portraitImage} alt="Aishwarya Mahesh" onError={handleImageError} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             </div>
          </div>

        </div>
      </section>

      <section className={`py-24 px-6 border-y ${isNightMode ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-[#FFF7ED] border-[#FED7AA]'}`}>
        <div className="max-w-4xl mx-auto text-center relative">
          <Quote size={40} className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-20 text-[#D97706]" />
          <h3 className={`text-2xl md:text-3xl font-base-${lang} italic mb-8 leading-relaxed font-light`}>"{content.quote}"</h3>
          <div className="flex justify-center"><svg width="60" height="20" viewBox="0 0 60 20" stroke="#D97706"><path d="M0 10 L 60 10" fill="none" strokeWidth="1" /></svg></div>
        </div>
      </section>

      <section id="events" className={`py-32 overflow-hidden ${isNightMode ? 'bg-[#020617]' : 'bg-[#292524] text-[#FDFBF7]'}`}>
        <div className="px-6 md:px-12 mb-16 flex items-baseline gap-4"><h2 className="text-4xl md:text-5xl text-white">{content.performances}</h2><div className="h-px bg-white/20 flex-grow"></div></div>
        <div className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 snap-x hide-scrollbar">
          {data.events.map((event, i) => (
            <a key={i} href={event.link} target="_blank" rel="noreferrer" className="min-w-[350px] snap-center p-8 border border-white/10 rounded-2xl hover:border-[#D97706] hover:bg-white/5 block group">
              <div className="text-base font-semibold text-[#D97706] mb-4">{event.date}</div>
              <div className="text-2xl md:text-3xl font-bold mb-2 text-white group-hover:text-orange-200">{event.venue}</div>
              <div className="flex items-center gap-2 text-sm text-stone-400 uppercase mb-8"><MapPin size={12} /> {event.loc}</div>
              <div className="w-full h-px bg-white/10 group-hover:bg-[#D97706]/50 transition-all"></div>
              <div className="pt-4 text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity text-white">{content.details}</div>
            </a>
          ))}
          <div className="min-w-[100px]"></div>
        </div>
      </section>

      {}
      <section id="about" className="py-12 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        
        {/* ROW 1: INTRODUCTION */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
           <div className="md:w-1/2">
             <h2 className={`text-5xl font-base-${lang} mb-8 leading-tight ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>{content.aboutTitle}</h2>
             <p className="text-lg leading-loose font-light mb-8">{content.bioBlock1}</p>
           </div>
           
           {/* Visual Element for Bio 1 */}
           <div className="md:w-1/2 relative h-full flex items-center justify-center">
              <div className={`p-10 rounded-2xl border ${isNightMode ? 'bg-[#1E293B] border-white/10' : 'bg-white border-stone-200'} shadow-lg w-full max-w-md`}>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#D97706]/10 flex items-center justify-center text-[#D97706]"><Music size={24}/></div>
                    <div>
                       <div className="text-sm font-bold uppercase tracking-widest">{content.name}</div>
                       <div className="text-xs opacity-60">Classical Vocals</div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-[#D97706] w-3/4"></div></div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-[#D97706]/70 w-full"></div></div>
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden"><div className="h-full bg-[#D97706]/40 w-1/2"></div></div>
                 </div>
              </div>
           </div>
        </div>

        {/* ROW 2: LINEAGE & TRAINING -> Text Left, Slideshow Right */}
        <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
            <div className="md:w-1/2 h-full w-full">
               <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl">
                  <img src={LINEAGE_IMAGES[0]} alt="Training & Tutelage" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
               </div>
            </div>

            <div className="md:w-1/2 text-left">
               <h2 className={`text-4xl font-base-${lang} mb-6 ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>{content.bioBlock2Title}</h2>
               <p className="text-lg leading-loose font-light">{content.bioBlock2}</p>
            </div>
        </div>

        {/* ROW 3: TECHNICAL MASTERY -> Slideshow Left, Text Right */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="md:w-1/2 h-full w-full">
               <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl">
                  <img src={MASTERY_IMAGES[0]} alt="Performance & Vision" className="w-full h-full object-cover" onError={(e) => { e.target.style.display='none'; }} />
               </div>
            </div>

            <div className="md:w-1/2 text-left">
               <h2 className={`text-4xl font-base-${lang} mb-6 ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>{content.bioBlock3Title}</h2>
               <p className="text-lg leading-loose font-light">{content.bioBlock3}</p>
            </div>
        </div>

      </section>

      <MotifSeparator isNightMode={isNightMode} />

      {}
      <section id="music" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16"><h2 className={`text-4xl md:text-5xl font-base-${lang}`}>{content.works}</h2><a href={data.contact.youtube} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase hover:text-[#D97706]">{content.viewAll} <ArrowRight size={14} /></a></div>
          <div className="grid md:grid-cols-2 gap-8">
            {data.tracks.map(track => (
              <a key={track.id} href={track.link} target="_blank" rel="noreferrer" className={`group block p-4 border rounded-2xl transition-all hover:scale-[1.02] ${isNightMode ? 'border-[#334155] bg-[#0F172A]' : 'border-[#FED7AA] bg-[#FFFBEB]'}`}>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6 shadow-md">
                  <img 
                    src={track.image} 
                    alt={track.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop"; }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center"><div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/30 text-white"><Play size={32} fill="currentColor" /></div></div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">{track.time}</div>
                </div>
                <h3 className="text-2xl font-base-${lang} mb-2 group-hover:text-[#D97706]">{track.title}</h3>
                <p className="text-xs uppercase tracking-widest opacity-60">{track.subtitle}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          <div className="md:col-span-2 relative overflow-hidden group shadow-lg rounded-2xl">
             <img src="https://images.unsplash.com/photo-1534065609653-e3801f415c90?q=80&w=2070&auto=format&fit=crop" alt="Performance" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-transform duration-1000 group-hover:scale-105" />
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-white italic text-2xl">{content.liveAt}</div>
          </div>
          <div className="flex flex-col gap-6">
            <a href={data.contact.instagram} target="_blank" rel="noreferrer" className={`flex-1 relative rounded-2xl flex flex-col items-center justify-center text-white transition-all transform hover:scale-105 ${isNightMode ? 'bg-[#BE185D]' : 'bg-[#C2410C]'}`}>
               <Instagram size={32} className="mb-4" /> <p className="italic text-xl">"{content.followInsta}"</p>
            </a>
            <a href={data.contact.youtube} target="_blank" rel="noreferrer" className="flex-1 bg-[#9A3412] rounded-2xl flex flex-col items-center justify-center text-white shadow-lg transition-all transform hover:scale-105">
                <Youtube size={32} className="mb-4" /> <p className="italic text-xl">"{content.watchHighlights}"</p>
            </a>
          </div>
        </div>
      </section>

      {}
      <footer id="contact" className={`py-24 px-6 ${isNightMode ? 'bg-[#020617] text-stone-400' : 'bg-[#451a03] text-[#FED7AA]'}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h2 className="text-3xl text-white mb-6 uppercase tracking-widest">{content.name}</h2>
            <p className="max-w-md leading-relaxed mb-8">{content.desc}</p>
            <div className="space-y-2 flex flex-col">
              <a href={`mailto:${data.contact.email}`} className="text-[#D97706] hover:text-white text-lg transition-colors">{data.contact.email}</a>
              {data.contact.phone && <a href={`tel:${data.contact.phone.replace(/\s+/g, '')}`} className="text-[#D97706] hover:text-white text-lg transition-colors">{data.contact.phone}</a>}
            </div>
          </div>
          <div><h4 className="text-white text-xs font-bold uppercase mb-6">{content.explore}</h4><ul className="space-y-4 text-sm">{['events', 'about', 'music'].map(item => <li key={item}><button onClick={() => scrollTo(item)} className="hover:text-[#D97706] transition-colors capitalize">{content[item]}</button></li>)}</ul></div>
          <div><h4 className="text-white text-xs font-bold uppercase mb-6">{content.connect}</h4><ul className="space-y-4 text-sm"><li><a href={data.contact.instagram} target="_blank" className="hover:text-[#D97706] transition-colors">Instagram</a></li><li><a href={data.contact.youtube} target="_blank" className="hover:text-[#D97706] transition-colors">YouTube</a></li><li><a href={data.contact.facebook} target="_blank" className="hover:text-[#D97706] transition-colors">Facebook</a></li></ul></div>
        </div>
        <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest">
          <p>&copy; 2026 {content.name}</p>
          <div className="flex flex-col items-center md:items-end"><p className="opacity-50">{content.designedBy}</p><a href={data.contact.websiteByLink} target="_blank" rel="noreferrer" className="mt-1 opacity-30 hover:opacity-100 transition-opacity text-[10px]">Website by: {data.contact.websiteBy}</a></div>
        </div>
      </footer>
    </div>
  );
};

export default App;