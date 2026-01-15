import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, Menu, Music, ArrowRight, Instagram, Youtube, Mail, MapPin, Ticket, Volume2, VolumeX, Quote, Globe } from 'lucide-react';

// --- FONTS & STYLES ---
const GlobalStyles = () => (
  <style>{`
    /* Latin (English) - Cormorant Garamond (Lyrical, Old World) */
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Proza+Libre:wght@400;500&display=swap');
    
    /* Indian Scripts */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Kannada:wght@400;700&family=Noto+Serif+Tamil:wght@400;700&family=Noto+Serif+Telugu:wght@400;700&family=Rozha+One&family=Sahitya:wght@400;700&display=swap');
    
    /* Typography Mapping */
    .font-base-en { font-family: 'Cormorant Garamond', serif; }
    .text-base-en { font-family: 'Proza Libre', sans-serif; letter-spacing: 0.02em; }

    .font-base-hi { font-family: 'Rozha One', serif; }
    .text-base-hi { font-family: 'Sahitya', serif; }

    .font-base-kn, .text-base-kn { font-family: 'Noto Serif Kannada', serif; }
    .font-base-ta, .text-base-ta { font-family: 'Noto Serif Tamil', serif; }
    .font-base-te, .text-base-te { font-family: 'Noto Serif Telugu', serif; }
    
    /* Animations */
    .indian-script-float { animation: float 12s ease-in-out infinite; }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
      50% { transform: translateY(-15px) rotate(3deg); opacity: 0.2; }
    }

    /* Pattern Overlay */
    .bg-pattern {
      background-image: radial-gradient(#D97706 0.5px, transparent 0.5px), radial-gradient(#D97706 0.5px, transparent 0.5px);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
    }
  `}</style>
);

// --- TRANSLATIONS (Unchanged) ---
const translations = {
  en: {
    name: "Aishwarya Mahesh",
    about: "About",
    music: "Music",
    events: "Events",
    contact: "Contact",
    listen: "Listen Now",
    type: "CARNATIC CLASSICAL",
    raga: "Raga",
    quote: "Music is not just performance. It is an excuse to close your eyes and ignore everyone.",
    sadhana: "The Sadhana",
    training: "Years of Training",
    concerts: "Concerts Survived",
    works: "Selected Works",
    viewAll: "View All",
    performances: "Performances",
    details: "View Details",
    explore: "Explore",
    connect: "Connect",
    desc: "Communicating authentic Carnatic music to the soul.",
    artistAbout: "I am a passionate student of Carnatic Music who firmly believes that 'Sa' is the answer to most of life's problems. I seek to communicate to people through music, mostly because I'm better at singing than talking.",
    tagline: "Attempting to find the perfect Sruti since 2010.",
    droneOn: "Drone On",
    droneOff: "Drone Off",
    menu: "Menu",
    liveAt: "Live at Chennai",
    watchHighlights: "Watch Highlights",
    designedBy: "Designed with Raga & Rhythm",
    t1_title: "Shower Aria in C Major", t1_sub: "Very Reverb • Much Echo",
    t2_title: "Humming While Cooking", t2_sub: "Sizzling Sounds • Raga Hunger",
    t3_title: "Trying High Notes", t3_sub: "Neighbors Complained",
    t4_title: "Morning Riaz", t4_sub: "Early Bird Special",
    e1_venue: "The Great Shower Symphony", e1_loc: "BATHROOM",
    e2_venue: "Serenading the Neighbors' Cat", e2_loc: "ROOF",
    e3_venue: "Midnight Snack Arias", e3_loc: "KITCHEN"
  },
  // ... (Other languages same as before, simplified for brevity in this diff, assume they exist)
  hi: { name: "ऐश्वर्या महेश", about: "परिचय", music: "संगीत", events: "कार्यक्रम", contact: "संपर्क", listen: "अभी सुनें", type: "कर्नाटक शास्त्रीय संगीत", raga: "राग", quote: "संगीत केवल प्रदर्शन नहीं है...", sadhana: "साधना", training: "वर्षों का प्रशिक्षण", concerts: "कॉन्सर्ट", works: "चयनित कृतियां", viewAll: "सभी देखें", performances: "प्रस्तुतियां", details: "विवरण देखें", explore: "खोजें", connect: "जुड़ें", desc: "प्रामाणिक कर्नाटक संगीत को आत्मा तक पहुँचाना।", artistAbout: "मैं कर्नाटक संगीत की छात्रा हूँ...", tagline: "2010 से सही श्रुति खोजने का प्रयास।", droneOn: "तानपूरा चालु", droneOff: "तानपूरा बंद", menu: "मेन्यू", liveAt: "चेन्नई में लाइव", watchHighlights: "झलकियाँ देखें", designedBy: "राग और लय के साथ निर्मित", t1_title: "शॉवर में गायन", t1_sub: "गूंज", t2_title: "गुनगुनाना", t2_sub: "राग भूख", t3_title: "ऊँचे स्वर", t3_sub: "शिकायत", t4_title: "सुबह का रियाज़", t4_sub: "अर्ली बर्ड", e1_venue: "महान शॉवर सिम्फनी", e1_loc: "स्नानघर", e2_venue: "पड़ोसी की बिल्ली", e2_loc: "छत", e3_venue: "मध्यरात्रि नाश्ता", e3_loc: "रसोई" },
  kn: { name: "ಐಶ್ವರ್ಯ ಮಹೇಶ್", about: "ಪರಿಚಯ", music: "ಸಂಗೀತ", events: "ಕಾರ್ಯಕ್ರಮಗಳು", contact: "ಸಂಪರ್ಕ", listen: "ಕೇಳಿ", type: "ಕರ್ನಾಟಿಕ್ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ", raga: "ರಾಗ", quote: "ಸಂಗೀತ ಕೇವಲ ಪ್ರದರ್ಶನವಲ್ಲ...", sadhana: "ಸಾಧನಾ", training: "ವರ್ಷಗಳ ತರಬೇತಿ", concerts: "ಕಚೇರಿಗಳು", works: "ಆಯ್ದ ಕೃತಿಗಳು", viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ", performances: "ಪ್ರದರ್ಶನಗಳು", details: "ವಿವರಗಳು", explore: "ಅನ್ವೇಷಿಸಿ", connect: "ಸಂಪರ್ಕಿಸಿ", desc: "ಅಪ್ಪಟ ಕರ್ನಾಟಕ ಸಂಗೀತ...", artistAbout: "ನಾನು ಕರ್ನಾಟಕ ಸಂಗೀತದ ವಿದ್ಯಾರ್ಥಿನಿ...", tagline: "2010 ರಿಂದ ಸರಿಯಾದ ಶ್ರುತಿಗಾಗಿ ಹುಡುಕಾಟ.", droneOn: "ಶ್ರುತಿ ಆನ್", droneOff: "ಶ್ರುತಿ ಆಫ್", menu: "ಮೆನು", liveAt: "ಚೆನ್ನೈನಲ್ಲಿ ಲೈವ್", watchHighlights: "ಮುಖ್ಯಾಂಶಗಳು", designedBy: "ರಾಗ ಮತ್ತು ಲಯ", t1_title: "ಶವರ್ ರಾಗ", t1_sub: "ಪ್ರತಿಧ್ವನಿ", t2_title: "ಅಡುಗೆ ಹಾಡು", t2_sub: "ರುಚಿಕರ", t3_title: "ತಾರಕ ಸ್ಥಾಯಿ", t3_sub: "ದೂರು", t4_title: "ಮುಂಜಾನೆ ರಿಯಾಜ್", t4_sub: "ಬೆಳಗಿನ ರಾಗ", e1_venue: "ಶವರ್ ಕಚೇರಿ", e1_loc: "ಸ್ನಾನಗೃಹ", e2_venue: "ಬೆಕ್ಕಿಗಾಗಿ ಸಂಗೀತ", e2_loc: "ಮಿದ್ದು", e3_venue: "ಮಧ್ಯರಾತ್ರಿ ರಾಗ", e3_loc: "ಅಡುಗೆಮನೆ" },
  ta: { name: "ஐஸ்வர்யா மகேஷ்", about: "அறிமுகம்", music: "இசை", events: "நிகழ்வுகள்", contact: "தொடர்பு", listen: "கேளுங்கள்", type: "கர்நாடக இசை", raga: "ராகம்", quote: "இசை என்பது வெறும் நிகழ்ச்சியல்ல...", sadhana: "சாதனா", training: "ஆண்டுகள் பயிற்சி", concerts: "கச்சேரிகள்", works: "படைப்புகள்", viewAll: "அனைத்தும்", performances: "நிகழ்ச்சிகள்", details: "விவரங்கள்", explore: "ஆராயுங்கள்", connect: "இணைக்கவும்", desc: "உண்மையான கர்நாடக இசை...", artistAbout: "நான் கர்நாடக இசையின் மாணவி...", tagline: "2010 முதல் சரியான ஸ்ருதியைத் தேடும் முயற்சி.", droneOn: "ஸ்ருதி ஆன்", droneOff: "ஸ்ருதி ஆஃப்", menu: "மெனு", liveAt: "சென்னையில் நேரலை", watchHighlights: "சிறப்பம்சங்கள்", designedBy: "ராகம் தாளம்", t1_title: "குளியலறை ராகம்", t1_sub: "எதிரொலி", t2_title: "சமைக்கும் போது", t2_sub: "சுவை", t3_title: "உயர் ஸ்தாயி", t3_sub: "புகார்", t4_title: "காலை ரியாஸ்", t4_sub: "சிறப்பு", e1_venue: "குளியலறை கச்சேரி", e1_loc: "குளியலறை", e2_venue: "பூனைக்கு பாட்டு", e2_loc: "மாடி", e3_venue: "நள்ளிரவு சிற்றுண்டி", e3_loc: "சமையலறை" },
  te: { name: "ఐశ్వర్య మహేష్", about: "పరిచయం", music: "సంగీతం", events: "కార్యక్రమాలు", contact: "సంప్రదించండి", listen: "వినండి", type: "కర్ణాటక సంగీతం", raga: "రాగం", quote: "సంగీతం కేవలం ప్రదర్శన కాదు...", sadhana: "సాధన", training: "ఏళ్ళ శిక్షణ", concerts: "కచేరీలు", works: "కృతులు", viewAll: "అన్నీ చూడండి", performances: "ప్రదర్శనలు", details: "వివరాలు", explore: "అన్వేషించండి", connect: "కనెక్ట్", desc: "స్వచ్ఛమైన కర్ణాటక సంగీతం...", artistAbout: "నేను కర్ణాటక సంగీత విద్యార్థిని...", tagline: "2010 నుండి సరైన శ్రుతి కోసం ప్రయత్నం.", droneOn: "శ్రుతి ఆన్", droneOff: "శ్రుతి ఆఫ్", menu: "మెనూ", liveAt: "చెన్నైలో లైవ్", watchHighlights: "ముఖ్యాంశాలు", designedBy: "రాగం తాళం", t1_title: "షవర్ పాట", t1_sub: "ప్రతిధ్వని", t2_title: "వంట పాట", t2_sub: "రుచి", t3_title: "హై పిచ్", t3_sub: "ఫిర్యాదు", t4_title: "ఉదయం రియాజ్", t4_sub: "స్పెషల్", e1_venue: "షవర్ సింఫనీ", e1_loc: "బాత్రూమ్", e2_venue: "పిల్లి పాట", e2_loc: "పైకప్పు", e3_venue: "స్నాక్ రాగాలు", e3_loc: "వంటగది" }
};

// --- SOUND ENGINE (Unchanged) ---
const useTanpura = () => {
  const audioContext = useRef(null);
  const oscillators = useRef([]);
  const gainNode = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const startDrone = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContext.current;
    if (ctx.state === 'suspended') ctx.resume();
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
    if (gainNode.current) {
      gainNode.current.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 1);
    }
    setTimeout(() => {
      oscillators.current.forEach(osc => osc.stop());
      oscillators.current = [];
      setIsPlaying(false);
    }, 1000);
  }, []);

  return { isPlaying, toggle: isPlaying ? stopDrone : startDrone };
};

// --- CUSTOM CURSOR (Unchanged) ---
const CustomCursor = ({ isDark }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const cursor = useRef({ x: -100, y: -100 });
  const lastPos = useRef({ x: -100, y: -100 });
  const isDarkRef = useRef(isDark);

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    const onMouseMove = (e) => { cursor.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouseMove);
    const swaras = ['ಸ', 'ರಿ', 'ಗ', 'ಮ', 'ಪ', 'ದ', 'ನಿ', 'Sa', 'Ri', 'Ga', 'Ma', 'Pa', 'Da', 'Ni'];
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = isDarkRef.current ? '251, 146, 60' : '234, 88, 12'; 
      const dx = cursor.current.x - lastPos.current.x;
      const dy = cursor.current.y - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 30) {
        particles.current.push({ x: cursor.current.x, y: cursor.current.y, text: swaras[Math.floor(Math.random() * swaras.length)], life: 1.0, vx: (Math.random() - 0.5) * 1, vy: -0.5 - Math.random() });
        lastPos.current = { ...cursor.current };
      }
      particles.current.forEach((p, i) => {
        p.life -= 0.015;
        p.x += p.vx;
        p.y += p.vy;
        if (p.life <= 0) particles.current.splice(i, 1);
        else { ctx.font = "16px serif"; ctx.fillStyle = `rgba(${color}, ${p.life})`; ctx.fillText(p.text, p.x, p.y); }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouseMove); cancelAnimationFrame(animationFrameId); };
  }, []);
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[100] md:block hidden" />;
};

// --- ORNAMENTS ---
// A reusable SVG flourish for corners
const CornerFlourish = ({ className, color }) => (
  <svg className={`absolute w-24 h-24 md:w-32 md:h-32 ${className}`} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="1.2">
    {/* Paisley/Mango Curve */}
    <path d="M10 10 C 20 10, 50 10, 60 30 C 70 50, 50 70, 30 70 C 10 70, 10 40, 40 40 C 60 40, 90 60, 90 90" />
    {/* Decorative dots/accents */}
    <circle cx="40" cy="40" r="2" fill={color} />
    <circle cx="60" cy="30" r="2" fill={color} />
    <path d="M10 10 L 10 30" />
    <path d="M10 10 L 30 10" />
    <path d="M5 5 L 15 15 M 15 5 L 5 15" strokeWidth="0.5" opacity="0.5"/>
  </svg>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showEventToast, setShowEventToast] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [portraitImage, setPortraitImage] = useState('');
  const [lang, setLang] = useState('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const { isPlaying: isDronePlaying, toggle: toggleDrone } = useTanpura();

  const placeholderLink = "https://youtube.com/@aishwaryamahesh6605";
  const t = translations[lang] || translations['en'];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'te', label: 'తెలుగు' }
  ];

  const tracks = [
    { 
      id: 1, 
      title: t.t1_title, 
      subtitle: t.t1_sub, 
      time: "04:20",
      image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop", // Rain/Shower
      link: placeholderLink
    },
    { 
      id: 2, 
      title: t.t2_title, 
      subtitle: t.t2_sub, 
      time: "02:15",
      image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop", // Cooking/Kitchen
      link: placeholderLink
    },
    { 
      id: 3, 
      title: t.t3_title, 
      subtitle: t.t3_sub, 
      time: "00:15",
      image: "https://images.unsplash.com/photo-1514117445516-2ecfc9c67080?q=80&w=2070&auto=format&fit=crop", // High Notes/Abstract
      link: placeholderLink
    },
    { 
      id: 4, 
      title: t.t4_title, 
      subtitle: t.t4_sub, 
      time: "06:30",
      image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop", // Morning/Sunrise
      link: placeholderLink
    }
  ];

  const events = [
    { date: "SOON", loc: t.e1_loc, venue: t.e1_venue, link: placeholderLink },
    { date: "LATER", loc: t.e2_loc, venue: t.e2_venue, link: placeholderLink },
    { date: "TBD", loc: t.e3_loc, venue: t.e3_venue, link: placeholderLink },
  ];

  const toggleSongPlay = (id) => {
    if (currentSong === id) { setIsSongPlaying(!isSongPlaying); } else { setCurrentSong(id); setIsSongPlaying(true); }
  };

  const scrollTo = (id) => {
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const images = [
      "https://images.unsplash.com/photo-1629828552174-8b630e258688?q=80&w=1974&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1525926477800-7a3be5800fcb?q=80&w=1964&auto=format&fit=crop"
    ];
    setPortraitImage(images[Math.floor(Math.random() * images.length)]);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGharanaClick = () => { setIsNightMode(!isNightMode); };

  // SWIRLY MOTIF SEPARATOR
  const MotifSeparator = () => (
    <div className="flex items-center justify-center py-24 opacity-60">
      <div className={`hidden md:block h-px w-24 ${isNightMode ? 'bg-orange-200' : 'bg-stone-400'}`}></div>
      {/* Curved Vine SVG */}
      <div className={`mx-4 ${isNightMode ? 'text-orange-200' : 'text-stone-600'}`}>
        <svg width="200" height="40" viewBox="0 0 200 40" fill="none" stroke="currentColor" strokeWidth="1.5">
           <path d="M0 20 Q 50 0 100 20 T 200 20" strokeDasharray="4 2" />
           <path d="M10 20 C 30 35, 70 35, 90 20 S 130 5, 150 20 S 190 35, 200 20" />
           <circle cx="100" cy="20" r="3" fill="currentColor"/>
           <circle cx="50" cy="25" r="2" fill="currentColor"/>
           <circle cx="150" cy="15" r="2" fill="currentColor"/>
        </svg>
      </div>
      <div className={`hidden md:block h-px w-24 ${isNightMode ? 'bg-orange-200' : 'bg-stone-400'}`}></div>
    </div>
  );

  const cornerColor = isNightMode ? '#fb923c' : '#D97706'; // orange-400 : primary color

  return (
    <div className={`min-h-screen font-base-${lang} transition-colors duration-1000 overflow-x-hidden relative ${isNightMode ? 'bg-[#0B1221] text-[#E0E7FF] selection:bg-[#F59E0B] selection:text-black' : 'bg-[#FDFBF7] text-[#422006] selection:bg-[#D97706] selection:text-white'}`}>
      <GlobalStyles />
      
      {/* Background Texture (Rangoli Dots Pattern) */}
      <div className={`fixed inset-0 opacity-[0.08] pointer-events-none z-0 bg-pattern ${isNightMode ? 'invert opacity-[0.05]' : ''}`}></div>
      {/* Vignette Overlay for Old Paper feel */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)]"></div>

      <CustomCursor isDark={isNightMode} />

      {/* ORNATE CORNER FRAMES (The "Swirly" replacement for the square border) */}
      <div className="fixed inset-0 pointer-events-none z-50 hidden md:block p-4">
         <CornerFlourish color={cornerColor} className="top-4 left-4" />
         <CornerFlourish color={cornerColor} className="top-4 right-4 transform scale-x-[-1]" />
         <CornerFlourish color={cornerColor} className="bottom-4 left-4 transform scale-y-[-1]" />
         <CornerFlourish color={cornerColor} className="bottom-4 right-4 transform scale-[-1]" />
      </div>

      {/* Nav */}
      <nav className={`fixed w-full z-40 transition-all duration-500 ${scrolled ? (isNightMode ? 'bg-[#0B1221]/95 border-[#1e293b]' : 'bg-[#FDFBF7]/95 border-[#e7e5e4]') + ' backdrop-blur-md py-4 border-b shadow-sm' : 'py-8'}`}>
        <div className="container mx-auto px-8 flex justify-between items-center">
          <span onClick={() => scrollTo('home')} className="text-xl tracking-[0.2em] font-base-${lang} font-bold cursor-pointer uppercase border-b-2 border-transparent hover:border-[#D97706] transition-colors z-50">
            AISHWARYA<span className="text-[#D97706]">.</span>
          </span>
          
          <div className="flex items-center gap-6">
            <div className={`hidden md:flex items-center gap-6 ${isNightMode ? 'text-indigo-300' : 'text-[#78350F]'}`}>
              <a href={placeholderLink} target="_blank" rel="noreferrer" className="hover:text-[#D97706] transition-colors"><Instagram size={20} /></a>
              <a href={placeholderLink} target="_blank" rel="noreferrer" className="hover:text-[#D97706] transition-colors"><Youtube size={20} /></a>
            </div>
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center gap-2 hover:text-[#D97706] transition-colors p-2 ${isNightMode ? 'text-indigo-300' : 'text-[#422006]'}`}
              >
                <Globe size={20} />
                <span className="uppercase text-xs font-bold tracking-widest">{lang}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className={`absolute top-full right-0 mt-2 py-2 rounded-xl shadow-xl min-w-[120px] z-50 border ${isNightMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#FFFBEB] border-[#FDE68A]'}`}>
                  {languages.map((l) => (
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
            
            <button 
              onClick={toggleDrone}
              className={`hidden md:flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase hover:text-[#D97706] transition-colors border px-4 py-2 rounded-full ${isDronePlaying ? 'border-[#D97706] text-[#D97706]' : (isNightMode ? 'border-[#334155]' : 'border-[#A8A29E]')}`}
            >
              {isDronePlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="hidden lg:inline">{isDronePlaying ? t.droneOn : t.droneOff}</span>
            </button>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="group flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase hover:text-[#D97706] transition-colors z-50">
              <span className="hidden md:block">{t.menu}</span>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <div className={`fixed inset-0 z-40 transition-transform duration-700 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} flex items-center justify-center ${isNightMode ? 'bg-[#0B1221] text-[#E0E7FF]' : 'bg-[#451a03] text-[#FEF3C7]'}`}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 p-2 hover:rotate-90 transition-transform duration-300"><X size={32} /></button>
        <div className="text-center space-y-8">
          {['about', 'music', 'events', 'contact'].map((item) => (
            <button key={item} onClick={() => scrollTo(item)} className="block text-5xl md:text-7xl font-base-${lang} hover:text-[#D97706] transition-colors capitalize">
              {t[item]}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
        
        {/* Floating Language Elements */}
        <div className="absolute inset-0 pointer-events-none opacity-10 select-none overflow-hidden font-indian-text">
            <span className="absolute top-[20%] left-[10%] text-4xl indian-script-float text-[#D97706]" style={{animationDelay: '0s'}}>ಸಂಗೀತ</span>
            <span className="absolute top-[15%] right-[15%] text-5xl indian-script-float text-[#D97706]" style={{animationDelay: '2s'}}>இசை</span>
            <span className="absolute bottom-[20%] left-[15%] text-4xl indian-script-float text-[#D97706]" style={{animationDelay: '4s'}}>संगीत</span>
            <span className="absolute bottom-[25%] right-[10%] text-5xl indian-script-float text-[#D97706]" style={{animationDelay: '1s'}}>సంగీతం</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none">
          <svg className={`w-[800px] h-[800px] animate-[spin_60s_linear_infinite] ${isNightMode ? 'text-white' : 'text-[#451a03]'}`} viewBox="0 0 100 100">
             {/* Swirly Mandala */}
             <path d="M50 0 C 70 20, 80 40, 50 50 C 20 60, 30 80, 50 100" stroke="currentColor" strokeWidth="0.5" fill="none" />
             <path d="M100 50 C 80 70, 60 80, 50 50 C 40 20, 20 30, 0 50" stroke="currentColor" strokeWidth="0.5" fill="none" />
             <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
             <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
             <path d="M50 10 Q 70 30 90 50 Q 70 70 50 90 Q 30 70 10 50 Q 30 30 50 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <button onClick={handleGharanaClick} className={`tracking-[0.4em] text-xs font-bold uppercase mb-6 animate-fade-in-up hover:text-[#D97706] transition-colors ${isNightMode ? 'text-orange-300' : 'text-[#92400e]'}`}>
            {t.type}
          </button>
          
          <h1 className={`text-5xl md:text-8xl font-base-${lang} font-medium mb-6 transition-colors duration-1000 tracking-tight ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>
            {t.name}
          </h1>
          
          <p className={`text-xl md:text-2xl font-light italic opacity-80 mb-8 text-base-${lang} ${isNightMode ? 'text-indigo-200' : 'text-[#78350F]'}`}>
             {t.tagline}
          </p>

          <a href="#music" className={`inline-flex items-center gap-3 px-8 py-3 rounded-full transition-all hover:scale-105 border ${isNightMode ? 'bg-transparent border-[#D97706] text-[#D97706] hover:bg-[#D97706]/20' : 'bg-transparent border-[#451a03] text-[#451a03] hover:bg-[#FFFBEB]'}`}>
            <span className="tracking-widest text-xs font-bold uppercase">{t.listen}</span>
            <Music size={16} />
          </a>
        </div>
      </section>

      {/* Philosophy / Quote Section */}
      <section className={`py-32 px-6 border-y ${isNightMode ? 'bg-[#0F172A] border-[#1E293B]' : 'bg-[#FFF7ED] border-[#FED7AA]'}`}>
        <div className="max-w-4xl mx-auto text-center relative">
          <Quote size={48} className={`absolute -top-12 left-1/2 -translate-x-1/2 opacity-20 ${isNightMode ? 'text-orange-400' : 'text-[#D97706]'}`} />
          <h3 className={`text-2xl md:text-4xl font-base-${lang} italic leading-snug mb-8`}>
            "{t.quote}"
          </h3>
          <div className="flex justify-center">
             <svg width="100" height="20" viewBox="0 0 100 20" stroke={isNightMode ? '#fb923c' : '#D97706'}>
                <path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" strokeWidth="2" />
             </svg>
          </div>
        </div>
      </section>

      {/* About - Side by Side */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 relative">
            <div className={`relative z-10 aspect-[3/4] overflow-hidden rounded-t-full rounded-b-2xl sepia-[.3] hover:sepia-0 transition-all duration-700 shadow-2xl ${isNightMode ? 'bg-[#1E293B]' : 'bg-[#FFFBEB]'}`}>
               <img src={portraitImage} alt="Portrait" className="w-full h-full object-cover" />
            </div>
            {/* Decorative Offset Border */}
            <div className="absolute top-4 -left-4 w-full h-full border-2 border-[#D97706]/30 rounded-t-full rounded-b-2xl z-0"></div>
          </div>

          <div className="md:w-1/2">
            <h2 className={`text-6xl font-base-${lang} mb-8 ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>{t.sadhana}</h2>
            <p className={`text-lg leading-loose mb-8 font-light text-base-${lang} ${isNightMode ? 'text-indigo-200' : 'text-[#78350F]'}`}>
              {t.artistAbout}
            </p>
            <p className={`text-lg leading-loose mb-12 font-light text-base-${lang} ${isNightMode ? 'text-indigo-200' : 'text-[#78350F]'}`}>
              {t.desc}
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              <div className={`p-6 border-l-2 rounded-r-xl ${isNightMode ? 'border-[#D97706] bg-[#1E293B]' : 'border-[#D97706] bg-[#FFFBEB]'}`}>
                <div className={`text-4xl font-base-${lang} font-bold mb-2`}>15+</div>
                <div className="text-xs tracking-widest uppercase opacity-60">{t.training}</div>
              </div>
              <div className={`p-6 border-l-2 rounded-r-xl ${isNightMode ? 'border-[#D97706] bg-[#1E293B]' : 'border-[#D97706] bg-[#FFFBEB]'}`}>
                <div className={`text-4xl font-base-${lang} font-bold mb-2`}>100+</div>
                <div className="text-xs tracking-widest uppercase opacity-60">{t.concerts}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MotifSeparator />

      {/* Music Grid (YouTube Style Cards) */}
      <section id="music" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className={`text-4xl md:text-5xl font-base-${lang}`}>{t.works}</h2>
            <a href={placeholderLink} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:text-[#D97706] transition-colors">
              {t.viewAll} <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tracks.map((track) => (
              <a 
                key={track.id}
                href={track.link}
                target="_blank"
                rel="noreferrer"
                className={`group block p-4 border rounded-2xl transition-all duration-500 hover:scale-[1.02] ${isNightMode ? 'border-[#334155] hover:bg-[#1E293B] bg-[#0F172A]' : 'border-[#FED7AA] hover:shadow-xl bg-[#FFFBEB]'}`}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6 shadow-md">
                  <img src={track.image} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm transition-all transform group-hover:scale-110 ${isNightMode ? 'bg-white/10 text-white' : 'bg-white/30 text-white'}`}>
                      <Play size={32} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                  
                  {/* Duration Label */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    {track.time}
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-2xl font-base-${lang} mb-2 group-hover:text-[#D97706] transition-colors`}>{track.title}</h3>
                    <p className={`text-xs uppercase tracking-widest ${isNightMode ? 'text-indigo-300' : 'text-[#92400e]'}`}>{track.subtitle}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Events - Horizontal Scroll with Background */}
      <section id="events" className={`py-32 overflow-hidden ${isNightMode ? 'bg-[#020617]' : 'bg-[#292524] text-[#FDFBF7]'}`}>
        <div className="px-6 md:px-12 mb-16 flex items-baseline gap-4">
          <h2 className={`text-4xl md:text-5xl font-base-${lang} text-white`}>{t.performances}</h2>
          <div className="h-px bg-white/20 flex-grow"></div>
        </div>

        <div className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 snap-x hide-scrollbar">
          {events.map((event, i) => (
            <a 
              key={i} 
              href={event.link}
              target="_blank"
              rel="noreferrer"
              className="min-w-[350px] snap-center p-8 border border-white/10 rounded-2xl hover:border-[#D97706] hover:bg-white/5 transition-all duration-500 block cursor-pointer group"
            >
              <div className="text-xs font-bold tracking-widest text-[#D97706] mb-4">{event.date}</div>
              <div className={`text-2xl md:text-3xl font-base-${lang} font-bold mb-2 text-white group-hover:text-orange-200 transition-colors`}>{event.venue}</div>
              <div className="flex items-center gap-2 text-sm text-stone-400 uppercase tracking-widest mb-8">
                <MapPin size={12} /> {event.loc}
              </div>
              <div className="w-full h-px bg-white/10 group-hover:bg-[#D97706]/50 transition-colors"></div>
              <div className="pt-4 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-white">
                {t.details}
              </div>
            </a>
          ))}
          <div className="min-w-[100px]"></div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          <div className="md:col-span-2 relative overflow-hidden group shadow-lg rounded-2xl">
             <img src="https://images.unsplash.com/photo-1534065609653-e3801f415c90?q=80&w=2070&auto=format&fit=crop" alt="Performance" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale hover:grayscale-0" />
             <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 text-white font-base-${lang} italic text-2xl`}>
               {t.liveAt}
             </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex-1 relative overflow-hidden group shadow-lg rounded-2xl">
              <img src="https://images.unsplash.com/photo-1517409419102-17188b0a996f?q=80&w=2070&auto=format&fit=crop" alt="Instruments" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale hover:grayscale-0" />
            </div>
            <a href={placeholderLink} target="_blank" rel="noreferrer" className="flex-1 bg-[#9A3412] flex flex-col items-center justify-center text-center p-8 transition-colors hover:bg-[#7C2D12] cursor-pointer text-white shadow-lg rounded-2xl">
                <Youtube size={32} className="mb-4 opacity-80" />
                <p className={`font-base-${lang} italic text-xl`}>"{t.watchHighlights}"</p>
            </a>
          </div>
        </div>
      </section>

      {/* Fat Footer */}
      <footer className={`py-24 px-6 ${isNightMode ? 'bg-[#020617] text-stone-400' : 'bg-[#451a03] text-[#FED7AA]'}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <h2 className={`text-3xl font-base-${lang} text-white mb-6`}>{t.name}</h2>
            <p className={`max-w-md leading-relaxed mb-8 text-base-${lang}`}>
              {t.desc}
            </p>
            <a href="mailto:contact@aishwaryamahesh.com" className="text-[#D97706] hover:text-white transition-colors text-lg">contact@aishwaryamahesh.com</a>
          </div>
          
          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">{t.explore}</h4>
            <ul className="space-y-4 text-sm">
              {['about', 'music', 'events'].map(item => (
                <li key={item}><button onClick={() => scrollTo(item)} className="hover:text-[#D97706] transition-colors capitalize">{translations[lang][item]}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">{t.connect}</h4>
            <ul className="space-y-4 text-sm">
              <li><a href={placeholderLink} className="hover:text-[#D97706] transition-colors">Instagram</a></li>
              <li><a href={placeholderLink} className="hover:text-[#D97706] transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-[#D97706] transition-colors">Facebook</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest">
          <p>&copy; 2024 {t.name}</p>
          <p className="mt-4 md:mt-0 opacity-50">{t.designedBy}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
