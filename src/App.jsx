import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, Menu, Music, ArrowRight, Instagram, Youtube, Mail, MapPin, Ticket, Volume2, VolumeX, Quote, Globe, Sun, Moon, Briefcase, Mic2, ChevronRight } from 'lucide-react';

// --- CONFIGURATION ---
const DATA_URL = "https://api.npoint.io/351d4f48fd1c2ad3df3b";
const DEFAULT_YT_LINK = "https://youtube.com/@aishwaryamahesh6605";

// --- MOCK DATA FOR PREVIEW (Ensures UI looks good even if API fails) ---
const INITIAL_DATA = {
  events: [
    { date: "OCT 24, 2025", loc: "CHENNAI", venue: "Music Academy", link: "#" },
    { date: "NOV 12, 2025", loc: "BANGALORE", venue: "Chowdiah Hall", link: "#" },
    { date: "DEC 01, 2025", loc: "MUMBAI", venue: "NCPA", link: "#" }
  ],
  tracks: [
    { id: 1, title: "Vathapi Ganapathim", subtitle: "Hamsadhwani • Adi", time: "6:45", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800&auto=format&fit=crop", link: "#" },
    { id: 2, title: "Endaro Mahanubhavulu", subtitle: "Sri • Adi", time: "12:30", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop", link: "#" },
    { id: 3, title: "Krishna Nee Begane", subtitle: "Yamunakalyani • Misra Chapu", time: "5:20", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop", link: "#" },
    { id: 4, title: "Thillana", subtitle: "Dhanashree • Adi", time: "4:15", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop", link: "#" }
  ],
  contact: { 
    email: "contact@aishwaryamahesh.com", 
    instagram: DEFAULT_YT_LINK, 
    youtube: DEFAULT_YT_LINK, 
    facebook: "#", 
    websiteBy: "RagaDesigns", 
    websiteByLink: "#" 
  }
};

// --- IMAGE COLLECTIONS FOR SLIDESHOWS ---
const LINEAGE_IMAGES = [
 "src/assets/test_img1.png",
 "src/assets/test_img2.png",
 "src/assets/test_img3.png"
];

const MASTERY_IMAGES = [
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800&auto=format&fit=crop", // Microphone
  "https://images.unsplash.com/photo-1507838153414-b4b713384ebd?q=80&w=800&auto=format&fit=crop", // Sheet Music/Notes
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop"  // Concert Lights
];

// --- FONTS & STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Proza+Libre:wght@400;500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Kannada:wght@400;700&family=Noto+Serif+Tamil:wght@400;700&family=Noto+Serif+Telugu:wght@400;700&family=Rozha+One&family=Sahitya:wght@400;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap');

    .font-base-en { font-family: 'Cormorant Garamond', serif; }
    .text-base-en { font-family: 'Proza Libre', sans-serif; letter-spacing: 0.02em; }
    .font-indian-style { font-family: 'Rozha One', serif; }
    .font-comic { font-family: 'Comic Neue', cursive; }

    .font-base-hi { font-family: 'Rozha One', serif; }
    .text-base-hi { font-family: 'Sahitya', serif; }
    .font-base-kn, .text-base-kn { font-family: 'Noto Serif Kannada', serif; }
    .font-base-ta, .text-base-ta { font-family: 'Noto Serif Tamil', serif; }
    .font-base-te, .text-base-te { font-family: 'Noto Serif Telugu', serif; }
    
    .indian-script-float { animation: float 12s ease-in-out infinite; }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
      50% { transform: translateY(-15px) rotate(3deg); opacity: 0.6; }
    }

    .bg-pattern {
      background-image: radial-gradient(#D97706 0.8px, transparent 0.8px), radial-gradient(#D97706 0.8px, transparent 0.8px);
      background-size: 24px 24px;
      background-position: 0 0, 12px 12px;
    }
    
    @keyframes slide-up {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }

    /* Updated Swing Animation - Stronger Movement */
    @keyframes swing {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(15deg); }
      75% { transform: rotate(-15deg); }
      100% { transform: rotate(0deg); }
    }
    .tassel-swing { transform-origin: top center; animation: swing 3.5s ease-in-out infinite; }
    
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
    name: "Aishwarya Mahesh",
    about: "The Journey", 
    music: "Music", events: "Events", contact: "Contact", listen: "Listen Now",
    type: "CARNATIC CLASSICAL", 
    quote: "Music is not just an art, it is a way of life; it does not always have to have structure, let it flow!",
    sadhana: "The Sadhana", 
    training: "Years of Training", concerts: "Concerts Survived", works: "Selected Works",
    viewAll: "View All", performances: "Performances", details: "View Details", explore: "Explore", connect: "Connect",
    desc: "Aishwarya Mahesh embodies the essence of Carnatic tradition while pursuing a dynamic professional life in finance.",
    
    // --- UPDATED NARRATIVE CONTENT ---
    aboutTitle: "Meet Aishwarya",
    
    // Block 1: Introduction & Philosophy
    bioBlock1: "Born into a musically vibrant family—where her father, aunts, uncles, and even mother nurtured her early exposure to shlokas, bhajans, and various forms of rhythm—she began formal training at age of 4, reciting Narayaneeyam with precise diction. My philosophy echoes my mother's advice: \"Always emote with your music,\" ensuring every sonic note conveys profound bhava. This dual life—finance by day, music eternal—is what drives my perseverance, and the want to be a better version of myself everyday.",
    
    // Block 2: Training & Lineage
    bioBlock2Title: "Musical Lineage & Training",
    bioBlock2: "Currently under Vidushis Smt. Ranjani and Gayatri, she honed her craft for 14 years under the able guidance of Veena duo Vidushi Smt. Jaysri Jeyaraaj Krishnan and Vidwan Sri. J.T. Jeyaraaj Krishnan of Veenavaadhini Sampradaya Sangit Trust. Training immersed her fully: living with gurus, accompanying their concerts, and absorbing veena nuances that enriched her vocal phrasings. She mastered voice culture via akaara sadhakam on sarali and janta varisais across speeds, enabling fluid brigas, gamakas, and jarus—essential for alapana and neraval. Varnams follow, transitioning to ragam-tanam-pallavi (RTP) practice, where she experiments with swara patterns in rare ragas, honoring the naadam-shruti-swaram-ragam progression central to Carnatic ethos.",
    
    // Block 3: Technical Mastery
    bioBlock3Title: "Technical Mastery",
    bioBlock3: "Carnatic music, for Aishwarya, begins with shruti's sacred vibration birthing swaras, arranged into ragas that evoke rasa. She distinguishes it from light music: Carnatic demands rigorous aakara for gamaka-heavy embellishments, unlike light music's falsetto agility and raga-nuance fusion. Daily practice layers varnams in Todi or Bhairavi for taanam precision, then RTP in ragas like Kalyani or Shanmukhapriya, weaving korvais with rhythmic complexity. Her repertoire spans kritis by Tyagaraja (e.g., Pancharatna krithis), Muthuswami Dikshitar (as in Dikshitar Utsavam), and Syama Sastri, delivered with layered sangatis that highlight jeeva swaras.",

    // Excerpts for Cards (Shortened for visual balance)
    cardSparkQuote: "My mother would often jokingly say that I was born with a speaker inside me, because the whole apartment could hear me cry!",
    cardSparkContext: "A pivotal moment came at age 11 during my debut at Apparswamy Temple in Mylapore.",
    cardLineageText: "Inherited from great-grandfather Thanjavur Vaidyanatha Iyer. Honed for 14 years under Veena duo Vidushi Smt. Jaysri Jeyaraaj Krishnan & Vidwan Sri. J.T. Jeyaraaj Krishnan.",
    cardPhilosophyText: "My philosophy echoes my mother's advice: \"Always emote with your music.\" This dual life—finance by day, music eternal—is what drives my perseverance.",

    tagline: "Finance by Day, Music Eternal.",
    soundOn: "Sound On", soundOff: "Sound Off", menu: "Menu", liveAt: "Live at Chennai", watchHighlights: "Watch Highlights", followInsta: "Follow Journey", designedBy: "Designed with Raga & Rhythm", upcoming: "Upcoming Event", getTickets: "Get Tickets"
  },
  kn: { name: "ಐಶ್ವರ್ಯ ಮಹೇಶ್", about: "ಪರಿಚಯ", music: "ಸಂಗೀತ", events: "ಕಾರ್ಯಕ್ರಮಗಳು", contact: "ಸಂಪರ್ಕ", listen: "ಕೇಳಿ", type: "ಕರ್ನಾಟಿಕ್ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ", tagline: "2010 ರಿಂದ ಸರಿಯಾದ ಶ್ರುತಿಗಾಗಿ ಹುಡುಕಾಟ.", soundOn: "ಧ್ವನಿ ಆನ್", soundOff: "ಧ್ವನಿ ಆಫ್", menu: "ಮೆನು", works: "ಆಯ್ದ ಕೃತಿಗಳು", performances: "ಪ್ರದರ್ಶನಗಳು", explore: "ಅನ್ವೇಷಿಸಿ", connect: "ಸಂಪರ್ಕಿಸಿ", upcoming: "ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮ", getTickets: "ಟಿಕೆಟ್ ಪಡೆಯಿರಿ" },
  hi: { name: "ऐश्वर्या महेश", about: "परिचय", music: "संगीत", events: "कार्यक्रम", contact: "संपर्क", listen: "अभी सुनें", type: "कर्नाटक शास्त्रीय संगीत", soundOn: "ध्वनि चालु", soundOff: "ध्वनि बंद", menu: "मेन्यू", works: "चयनित कृतियां", performances: "प्रस्तुतियां", explore: "खोजें", connect: "जुड़ें", upcoming: "आगामी कार्यक्रम", getTickets: "टिकट प्राप्त करें" },
  ta: { name: "ஐஸ்வர்யா மகேஷ்", about: "அறிமுகம்", music: "இசை", events: "நிகழ்வுகள்", contact: "தொடர்பு", listen: "கேளுங்கள்", type: "கர்நாடக இசை", soundOn: "ஒலி ஆன்", soundOff: "ஒலி ஆஃப்", menu: "மெனு", works: "படைப்புகள்", performances: "நிகழ்ச்சிகள்", upcoming: "வரவிருக்கும் நிகழ்வு", getTickets: "டிக்கெட் பெறுங்கள்" },
  te: { name: "ఐశ్వర్య మహేష్", about: "పరిచయం", music: "సంగీతం", events: "కార్యక్రమాలు", contact: "సంప్రదించండి", listen: "వినండి", type: "కర్ణాటక సంగీతం", soundOn: "సౌండ్ ఆన్", soundOff: "సౌండ్ ఆఫ్", menu: "మెనూ", works: "కృతులు", performances: "ప్రదర్శనలు", upcoming: "రాబోయే కార్యక్రమం", getTickets: "టిక్కెట్లు పొందండి" }
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
          <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
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

// --- COMIC FRAME COMPONENT ---
const ComicFrame = ({ label, isNightMode }) => (
  <div className={`w-full h-full flex flex-col items-center justify-center bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transform hover:rotate-2 transition-transform duration-300 ${isNightMode ? 'bg-gray-100 text-black' : ''}`}>
     <div className="w-full h-48 border-2 border-black border-dashed flex items-center justify-center mb-4 bg-gray-50 relative overflow-hidden">
        <img src="src/assets/baby.png" alt="portrait" className="absolute inset-0 w-full h-full object-cover"/>
     </div>
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
    fetch(DATA_URL).then(res => res.json()).then(json => {
        if (json) {
            setData(json);
            if (json.portrait) setPortraitImage(json.portrait); 
        }
    }).catch(e => console.log("Using mock data due to fetch error"));
    
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[lang] || translations['en'];
  const scrollTo = (id) => { setIsMenuOpen(false); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 500); };

  const handleImageError = () => {
      // Fallback if the main portrait fails
      setPortraitImage('https://images.unsplash.com/photo-1621886888495-2315b8004f81?q=80&w=1000&auto=format&fit=crop');
  };

  return (
    <div className={`min-h-screen font-base-${lang} transition-colors duration-1000 overflow-x-hidden relative ${isNightMode ? 'bg-[#0B1221] text-[#E0E7FF]' : 'bg-[#FDFBF7] text-[#422006]'}`}>
      <GlobalStyles />
      <div className={`fixed inset-0 opacity-[0.08] pointer-events-none z-0 bg-pattern ${isNightMode ? 'invert opacity-[0.05]' : ''}`}></div>
      <CustomCursor isDark={isNightMode} />
      
      {showEventToast && data.events.length > 0 && (
        <div className={`fixed bottom-8 right-8 z-[60] p-6 max-w-xs shadow-2xl border-l-4 border-[#D97706] animate-slide-up hidden md:block ${isNightMode ? 'bg-[#0B1221]' : 'bg-[#451a03] text-[#FEF3C7]'}`}>
          <button onClick={() => setShowEventToast(false)} className="absolute top-2 right-2 opacity-50 hover:opacity-100"><X size={14} /></button>
          <div className="text-xs tracking-[0.2em] uppercase text-[#D97706] mb-2">{t.upcoming}</div>
          <h4 className={`text-xl font-base-${lang} mb-1 font-bold`}>{data.events[0].venue}</h4>
          <p className="text-sm mb-4 opacity-70">{data.events[0].date} • {data.events[0].loc}</p>
          <a href={data.events[0].link} target="_blank" rel="noreferrer" className="w-full py-2 bg-[#D97706] text-white text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#b45309]">
            <Ticket size={14} /> {t.getTickets}
          </a>
        </div>
      )}

      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? (isNightMode ? 'bg-[#0B1221]/95 border-[#1e293b]' : 'bg-[#FDFBF7]/95 border-[#e7e5e4]') + ' backdrop-blur-md py-4 border-b' : 'py-8'}`}>
        <div className="container mx-auto px-8 flex justify-between items-center">
          <span onClick={() => scrollTo('home')} className={`text-xl tracking-[0.2em] font-base-${lang} font-bold cursor-pointer uppercase`}>AISHWARYA<span className="text-[#D97706]">.</span></span>
          
          <div className="hidden lg:flex items-center gap-12 absolute left-1/2 transform -translate-x-1/2">
             {['about', 'music', 'events', 'contact'].map((item) => (
               <button 
                 key={item} 
                 onClick={() => scrollTo(item)} 
                 className={`text-xs font-bold tracking-[0.2em] uppercase hover:text-[#D97706] transition-colors ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}
               >
                 {t[item]}
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
                 {isDronePlaying ? <Volume2 size={14} /> : <VolumeX size={14} />} {isDronePlaying ? t.soundOn : t.soundOff}
               </button>
               <button onClick={() => setIsNightMode(!isNightMode)} className={`p-2 hover:text-[#D97706] transition-colors ${isNightMode ? 'text-indigo-300' : 'text-stone-600'}`}>{isNightMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-3 text-xs font-bold uppercase hover:text-[#D97706] cursor-pointer"><span>{t.menu}</span><Menu size={24} /></button>
          </div>
        </div>
      </nav>

      {/* REVERTED MENU CURTAINS - SLIDING CURTAINS + TASSELS */}
      <div className={`fixed inset-0 z-[60] pointer-events-none flex ${isMenuOpen ? 'pointer-events-auto' : ''}`}>
        {/* Left Curtain */}
        <div className={`relative w-1/2 h-full transition-transform duration-1000 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isNightMode ? 'bg-[#0B1221]' : 'bg-[#451a03]'} flex items-center justify-end`}>
           <div className="absolute right-0 h-full transform translate-x-full z-10">
              <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className={`block ${isNightMode ? 'text-[#0B1221]' : 'text-[#451a03]'}`}>
                 <path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="currentColor" />
              </svg>
              {/* Tassels attached to scalloped edge - Fades out when menu opens */}
              <div className={`absolute top-0 left-0 h-full w-4 flex flex-col justify-around transition-opacity duration-500 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
                 {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 h-12 bg-[#D97706]/60 mx-auto tassel-swing origin-top relative">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D97706]"></div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
        
        {/* Right Curtain */}
        <div className={`relative w-1/2 h-full transition-transform duration-1000 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} ${isNightMode ? 'bg-[#0B1221]' : 'bg-[#451a03]'} flex items-center justify-start`}>
           <div className="absolute left-0 h-full transform -translate-x-full z-10 scale-x-[-1]">
              <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className={`block ${isNightMode ? 'text-[#0B1221]' : 'text-[#451a03]'}`}>
                 <path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="currentColor" />
              </svg>
              {/* Tassels - Fades out when menu opens */}
              <div className={`absolute top-0 left-0 h-full w-4 flex flex-col justify-around transition-opacity duration-500 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}>
                 {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 h-12 bg-[#D97706]/60 mx-auto tassel-swing origin-top relative" style={{animationDelay: '0.5s'}}>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D97706]"></div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Menu Content (Centered Overlay with Close Button) */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 delay-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <MenuToran />
           <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-[#D97706] z-[70] cursor-pointer"><X size={32} /></button>
           
           <div className="text-center space-y-6">
            {['about', 'music', 'events', 'contact'].map(item => <button key={item} onClick={() => scrollTo(item)} className={`block text-4xl md:text-7xl font-base-${lang} text-[#FEF3C7] hover:text-[#D97706] capitalize transition-colors`}>{t[item]}</button>)}
          </div>

          <div className="flex flex-col items-center gap-6 mt-12">
             <button onClick={toggleDrone} className="flex items-center gap-2 text-xs font-bold uppercase border px-6 py-3 rounded-full text-[#FEF3C7] border-[#FEF3C7] hover:border-[#D97706] transition-all">
              {isDronePlaying ? <Volume2 size={16} /> : <VolumeX size={16} />} <span>{isDronePlaying ? t.soundOn : t.soundOff}</span>
            </button>
            <div className="flex gap-8 text-[#FEF3C7]">
              <a href={data.contact.instagram} target="_blank" rel="noreferrer" className="hover:text-[#D97706] transition-colors"><Instagram size={24} /></a>
              <a href={data.contact.youtube} target="_blank" rel="noreferrer" className="hover:text-[#D97706] transition-colors"><Youtube size={24} /></a>
            </div>
          </div>
        </div>
      </div>

      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
        <MandalaBg isNightMode={isNightMode} />
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <p className="tracking-[0.4em] text-xs font-bold uppercase mb-6 text-[#92400e]">{t.type}</p>
          <h1 className={`text-6xl md:text-9xl font-indian-style font-medium mb-6 tracking-tight ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>{t.name}</h1>
          <p className="text-xl md:text-2xl font-light italic opacity-80 mb-8">{t.tagline}</p>
          <a href="#music" className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-[#D97706] text-white hover:bg-[#b45309] transition-all transform hover:scale-105 shadow-lg"><span className="tracking-widest text-xs font-bold uppercase">{t.listen}</span><Music size={18} /></a>
        </div>
      </section>

      <section className={`py-32 px-6 border-y ${isNightMode ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-[#FFF7ED] border-[#FED7AA]'}`}>
        <div className="max-w-4xl mx-auto text-center relative">
          <Quote size={48} className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-20 text-[#D97706]" />
          <h3 className={`text-2xl md:text-4xl font-base-${lang} italic mb-8 leading-relaxed`}>"{t.quote}"</h3>
          <div className="flex justify-center"><svg width="100" height="20" viewBox="0 0 100 20" stroke="#D97706"><path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" strokeWidth="2" /></svg></div>
        </div>
      </section>

      {/* --- RESTRUCTURED ABOUT SECTION --- */}
      <section id="about" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-32">
        
        {/* ROW 1: THE BEGINNING (HER NOW) -> Image Left, Intro Right */}
        <div className="flex flex-col md:flex-row gap-16 items-center">
           <div className="md:w-1/2 relative">
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
                 {/* Current Portrait */}
                 {portraitImage ? <img src={portraitImage} alt="Portrait" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-stone-200"></div>}
              </div>
              {/* Stats Overlay */}
              <div className="absolute -bottom-10 -right-6 bg-[#D97706] text-white p-6 shadow-xl max-w-xs z-10">
                 <div className="text-3xl font-bold mb-1">15+ Years</div>
                 <div className="text-[10px] tracking-widest uppercase opacity-80">Sadhana & Dedication</div>
              </div>
           </div>
           
           <div className="md:w-1/2">
             <h2 className={`text-5xl font-base-${lang} mb-8 leading-tight ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>{t.aboutTitle}</h2>
             <p className="text-lg leading-loose font-light mb-8">{t.bioBlock1}</p>
           </div>
        </div>

        {/* ROW 2: LINEAGE & TRAINING -> Text Left, Slideshow Right */}
        <div className="flex flex-col md:flex-row-reverse gap-16 items-center">
            <div className="md:w-1/2 h-full">
               <div className="aspect-[4/3] relative rounded-lg overflow-hidden border-2 border-[#D97706]/20 p-2 shadow-lg">
                  {/* Replaced Placeholder with AutoScrollFrame */}
                  <AutoScrollFrame images={LINEAGE_IMAGES} />
               </div>
            </div>

            <div className="md:w-1/2 text-left">
               <h2 className={`text-4xl font-base-${lang} mb-6 ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>{t.bioBlock2Title}</h2>
               <p className="text-lg leading-loose font-light">{t.bioBlock2}</p>
            </div>
        </div>

        {/* ROW 3: TECHNICAL MASTERY -> Slideshow Left, Text Right */}
        <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 h-full">
               <div className="aspect-[4/3] relative rounded-lg overflow-hidden border-2 border-[#D97706]/20 p-2 shadow-lg">
                  {/* Replaced Placeholder with AutoScrollFrame */}
                  <AutoScrollFrame images={MASTERY_IMAGES} />
               </div>
            </div>

            <div className="md:w-1/2 text-left">
               <h2 className={`text-4xl font-base-${lang} mb-6 ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>{t.bioBlock3Title}</h2>
               <p className="text-lg leading-loose font-light">{t.bioBlock3}</p>
            </div>
        </div>

        {/* PART 4: LIFE CHAPTERS CAROUSEL */}
        <div>
           <div className="flex items-center justify-between mb-8 px-2">
              <h3 className={`text-xl uppercase tracking-widest font-bold ${isNightMode ? 'text-[#D97706]' : 'text-[#92400e]'}`}>Visual Journey</h3>
              <div className="hidden md:flex items-center gap-2 opacity-50 text-xs uppercase tracking-widest"><span className={isNightMode ? 'text-white' : 'text-black'}>Scroll</span> <ArrowRight size={14} className={isNightMode ? 'text-white' : 'text-black'} /></div>
           </div>

           <div className="flex overflow-x-auto gap-8 pb-12 snap-x hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
              
              {/* CARD 1: THE SPARK (COMIC) */}
              <div className={`min-w-[85vw] md:min-w-[600px] snap-center p-8 rounded-3xl border flex flex-col md:flex-row gap-8 items-center shadow-lg ${isNightMode ? 'bg-[#1e293b] border-white/10' : 'bg-[#FFFBEB] border-[#FED7AA]'}`}>
                  <div className="w-full md:w-1/2 aspect-square relative transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                      <ComicFrame label="Childhood Singing" isNightMode={isNightMode} />
                  </div>
                  <div className="w-full md:w-1/2">
                      <h4 className={`text-2xl font-bold mb-4 ${isNightMode ? 'text-white' : 'text-[#451a03]'}`}>The Spark</h4>
                      <p className={`text-lg italic leading-relaxed mb-4 ${isNightMode ? 'text-indigo-200' : 'text-[#78350F]'}`}>"{t.cardSparkQuote}"</p>
                      <p className="text-sm opacity-80 leading-relaxed">{t.cardSparkContext}</p>
                  </div>
              </div>

              {/* CARD 2: LINEAGE (TRADITION) */}
              <div className={`min-w-[85vw] md:min-w-[600px] snap-center p-8 rounded-3xl border flex flex-col md:flex-row gap-8 items-center shadow-lg ${isNightMode ? 'bg-[#0f172a] border-white/10' : 'bg-stone-50 border-stone-200'}`}>
                  <div className="w-full md:w-1/2 aspect-[3/4] relative rounded-t-full overflow-hidden border-4 border-[#D97706]/20 p-2">
                      <div className="w-full h-full rounded-t-full overflow-hidden bg-stone-200">
                          <PlaceholderImg label="Great-Grandfather" isNightMode={isNightMode} />
                      </div>
                  </div>
                  <div className="w-full md:w-1/2">
                      <h4 className={`text-2xl font-bold mb-4 ${isNightMode ? 'text-white' : 'text-[#451a03]'}`}>Lineage</h4>
                      <p className="text-sm leading-loose opacity-80">{t.cardLineageText}</p>
                  </div>
              </div>

              {/* CARD 3: DUAL LIFE (FINANCE) */}
              <div className={`min-w-[85vw] md:min-w-[600px] snap-center p-8 rounded-3xl border flex flex-col md:flex-row gap-8 items-center shadow-lg ${isNightMode ? 'bg-slate-900 border-blue-900/30' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="w-full md:w-1/2 aspect-video relative rounded-lg overflow-hidden shadow-md border-2 border-slate-200/20">
                      <PlaceholderImg label="Finance Workplace" isNightMode={isNightMode} customIcon={<Briefcase size={32} />} />
                  </div>
                  <div className="w-full md:w-1/2">
                      <div className="flex items-center gap-2 mb-2">
                          <Briefcase size={16} className={isNightMode ? 'text-blue-400' : 'text-slate-500'} />
                          <span className={`text-xs font-bold uppercase tracking-widest ${isNightMode ? 'text-blue-400' : 'text-slate-500'}`}>Professional Life</span>
                      </div>
                      <h4 className={`text-2xl font-base-en mb-4 ${isNightMode ? 'text-white' : 'text-slate-800'}`}>Dual Life</h4>
                      <p className={`text-lg italic leading-relaxed mb-4 ${isNightMode ? 'text-slate-300' : 'text-slate-600'}`}>"{t.cardPhilosophyText}"</p>
                  </div>
              </div>

              {/* Spacer for scroll padding */}
              <div className="min-w-[20px]"></div>
           </div>
        </div>

      </section>

      <MotifSeparator isNightMode={isNightMode} />

      <section id="music" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16"><h2 className={`text-4xl md:text-5xl font-base-${lang}`}>{t.works}</h2><a href={data.contact.youtube} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase hover:text-[#D97706]">{t.viewAll} <ArrowRight size={14} /></a></div>
          <div className="grid md:grid-cols-2 gap-8">
            {data.tracks.map(track => (
              <a key={track.id} href={track.link} target="_blank" rel="noreferrer" className={`group block p-4 border rounded-2xl transition-all hover:scale-[1.02] ${isNightMode ? 'border-[#334155] bg-[#0F172A]' : 'border-[#FED7AA] bg-[#FFFBEB]'}`}>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6 shadow-md">
                  <img src={track.image} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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

      <section id="events" className={`py-32 overflow-hidden ${isNightMode ? 'bg-[#020617]' : 'bg-[#292524] text-[#FDFBF7]'}`}>
        <div className="px-6 md:px-12 mb-16 flex items-baseline gap-4"><h2 className="text-4xl md:text-5xl text-white">{t.performances}</h2><div className="h-px bg-white/20 flex-grow"></div></div>
        <div className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 snap-x hide-scrollbar">
          {data.events.map((event, i) => (
            <a key={i} href={event.link} target="_blank" rel="noreferrer" className="min-w-[350px] snap-center p-8 border border-white/10 rounded-2xl hover:border-[#D97706] hover:bg-white/5 block group">
              <div className="text-xs font-bold tracking-widest text-[#D97706] mb-4">{event.date}</div>
              <div className="text-2xl md:text-3xl font-bold mb-2 text-white group-hover:text-orange-200">{event.venue}</div>
              <div className="flex items-center gap-2 text-sm text-stone-400 uppercase mb-8"><MapPin size={12} /> {event.loc}</div>
              <div className="w-full h-px bg-white/10 group-hover:bg-[#D97706]/50 transition-all"></div>
              <div className="pt-4 text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity text-white">{t.details}</div>
            </a>
          ))}
          <div className="min-w-[100px]"></div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          <div className="md:col-span-2 relative overflow-hidden group shadow-lg rounded-2xl">
             <img src="https://images.unsplash.com/photo-1534065609653-e3801f415c90?q=80&w=2070&auto=format&fit=crop" alt="Performance" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-transform duration-1000 group-hover:scale-105" />
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-white italic text-2xl">{t.liveAt}</div>
          </div>
          <div className="flex flex-col gap-6">
            <a href={data.contact.instagram} target="_blank" rel="noreferrer" className={`flex-1 relative rounded-2xl flex flex-col items-center justify-center text-white transition-all transform hover:scale-105 ${isNightMode ? 'bg-[#BE185D]' : 'bg-[#C2410C]'}`}>
               <Instagram size={32} className="mb-4" /> <p className="italic text-xl">"{t.followInsta}"</p>
            </a>
            <a href={data.contact.youtube} target="_blank" rel="noreferrer" className="flex-1 bg-[#9A3412] rounded-2xl flex flex-col items-center justify-center text-white shadow-lg transition-all transform hover:scale-105">
                <Youtube size={32} className="mb-4" /> <p className="italic text-xl">"{t.watchHighlights}"</p>
            </a>
          </div>
        </div>
      </section>

      <footer id="contact" className={`py-24 px-6 ${isNightMode ? 'bg-[#020617] text-stone-400' : 'bg-[#451a03] text-[#FED7AA]'}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2"><h2 className="text-3xl text-white mb-6 uppercase tracking-widest">{t.name}</h2><p className="max-w-md leading-relaxed mb-8">{t.desc}</p><a href={`mailto:${data.contact.email}`} className="text-[#D97706] hover:text-white text-lg transition-colors">{data.contact.email}</a></div>
          <div><h4 className="text-white text-xs font-bold uppercase mb-6">{t.explore}</h4><ul className="space-y-4 text-sm">{['about', 'music', 'events'].map(item => <li key={item}><button onClick={() => scrollTo(item)} className="hover:text-[#D97706] transition-colors capitalize">{t[item]}</button></li>)}</ul></div>
          <div><h4 className="text-white text-xs font-bold uppercase mb-6">{t.connect}</h4><ul className="space-y-4 text-sm"><li><a href={data.contact.instagram} target="_blank" className="hover:text-[#D97706] transition-colors">Instagram</a></li><li><a href={data.contact.youtube} target="_blank" className="hover:text-[#D97706] transition-colors">YouTube</a></li><li><a href={data.contact.facebook} target="_blank" className="hover:text-[#D97706] transition-colors">Facebook</a></li></ul></div>
        </div>
        <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest">
          <p>&copy; 2026 {t.name}</p>
          <div className="flex flex-col items-center md:items-end"><p className="opacity-50">{t.designedBy}</p><a href={data.contact.websiteByLink} target="_blank" rel="noreferrer" className="mt-1 opacity-30 hover:opacity-100 transition-opacity text-[10px]">Website by: {data.contact.websiteBy}</a></div>
        </div>
      </footer>
    </div>
  );
};

export default App;