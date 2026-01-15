import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, Menu, Music, ArrowRight, Instagram, Youtube, Mail, MapPin, Ticket, Volume2, VolumeX, Quote, Globe, Sun, Moon } from 'lucide-react';

// --- CONFIGURATION ---
const DATA_URL = "https://api.npoint.io/351d4f48fd1c2ad3df3b";
const DEFAULT_YT_LINK = "https://youtube.com/@aishwaryamahesh6605";

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

    @keyframes swing {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(5deg); }
      75% { transform: rotate(-5deg); }
      100% { transform: rotate(0deg); }
    }
    .tassel-swing { transform-origin: top center; animation: swing 3s ease-in-out infinite; }
  `}</style>
);

const translations = {
  en: {
    name: "Aishwarya Mahesh",
    about: "About", music: "Music", events: "Events", contact: "Contact", listen: "Listen Now",
    type: "CARNATIC CLASSICAL", quote: "Music is not just performance. It is an excuse to close your eyes and ignore everyone.",
    sadhana: "The Sadhana", training: "Years of Training", concerts: "Concerts Survived", works: "Selected Works",
    viewAll: "View All", performances: "Performances", details: "View Details", explore: "Explore", connect: "Connect",
    desc: "Communicating authentic Carnatic music to the soul.",
    artistAbout: "I am a passionate student of Carnatic Music who firmly believes that 'Sa' is the answer to most of life's problems. I seek to communicate to people through music, mostly because I'm better at singing than talking.",
    tagline: "Attempting to find the perfect Sruti since 2010.",
    soundOn: "Sound On", soundOff: "Sound Off", menu: "Menu", liveAt: "Live at Chennai", watchHighlights: "Watch Highlights", followInsta: "Follow Journey", designedBy: "Designed with Raga & Rhythm", upcoming: "Upcoming Event", getTickets: "Get Tickets"
  },
  kn: { about: "ಪರಿಚಯ", music: "ಸಂಗೀತ", events: "ಕಾರ್ಯಕ್ರಮಗಳು", contact: "ಸಂಪರ್ಕ", listen: "ಕೇಳಿ", type: "ಕರ್ನಾಟಿಕ್ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ", tagline: "2010 ರಿಂದ ಸರಿಯಾದ ಶ್ರುತಿಗಾಗಿ ಹುಡುಕಾಟ.", soundOn: "ಧ್ವನಿ ಆನ್", soundOff: "ಧ್ವನಿ ಆಫ್", menu: "ಮೆನು", works: "ಆಯ್ದ ಕೃತಿಗಳು", performances: "ಪ್ರದರ್ಶನಗಳು", explore: "ಅನ್ವೇಷಿಸಿ", connect: "ಸಂಪರ್ಕಿಸಿ", upcoming: "ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮ", getTickets: "ಟಿಕೆಟ್ ಪಡೆಯಿರಿ" },
  hi: { about: "परिचय", music: "संगीत", events: "कार्यक्रम", contact: "संपर्क", listen: "अभी सुनें", type: "कर्नाटक शास्त्रीय संगीत", soundOn: "ध्वनि चालु", soundOff: "ध्वनि बंद", menu: "मेन्यू", works: "चयनित कृतियां", performances: "प्रस्तुतियां", explore: "खोजें", connect: "जुड़ें", upcoming: "आगामी कार्यक्रम", getTickets: "टिकट प्राप्त करें" },
  ta: { about: "அறிமுகம்", music: "இசை", events: "நிகழ்வுகள்", contact: "தொடர்பு", listen: "கேளுங்கள்", type: "கர்நாடக இசை", soundOn: "ஒலி ஆன்", soundOff: "ஒலி ஆஃப்", menu: "மெனு", works: "படைப்புகள்", performances: "நிகழ்ச்சிகள்", upcoming: "வரவிருக்கும் நிகழ்வு", getTickets: "டிக்கெட் பெறுங்கள்" },
  te: { about: "పరిచయం", music: "సంగీతం", events: "కార్యక్రమాలు", contact: "సంప్రదించండి", listen: "వినండి", type: "కర్ణాటక సంగీతం", soundOn: "సౌండ్ ఆన్", soundOff: "సౌండ్ ఆఫ్", menu: "మెనూ", works: "కృతులు", performances: "ప్రదర్శనలు", upcoming: "రాబోయే కార్యక్రమం", getTickets: "టిక్కెట్లు పొందండి" }
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

// Organic/Hand-drawn Mandala - Reduced Opacity
const MandalaBg = ({ isNightMode }) => (
  <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${isNightMode ? 'opacity-[0.05]' : 'opacity-[0.1]'}`}>
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

const MinimalFrame = ({ isNightMode, scrolled }) => {
  const color = isNightMode ? '#fb923c' : '#D97706';
  const size = scrolled ? "w-24 h-24 opacity-0 scale-95" : "w-24 h-24 md:w-48 md:h-48 opacity-100 scale-100";
  return (
    <div className={`fixed inset-0 pointer-events-none z-[45] hidden md:block transition-all duration-1000 ease-in-out ${scrolled ? 'pointer-events-none' : ''}`}>
       {[0, 90, 180, 270].map((rot, i) => (
         <svg key={i} className={`absolute ${size} transition-all duration-1000 m-6`} style={{ top: i < 2 ? 0 : 'auto', bottom: i >= 2 ? 0 : 'auto', left: (i === 0 || i === 3) ? 0 : 'auto', right: (i === 1 || i === 2) ? 0 : 'auto', transform: `rotate(${rot}deg)` }} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="1.5">
            <path d="M2 100 L 2 40 Q 2 2 40 2 L 100 2" fill="none" strokeLinecap="round" />
            {!scrolled && <circle cx="18" cy="18" r="4" fill={color} />}
         </svg>
       ))}
    </div>
  );
};

const TasselBorder = ({ scrolled }) => (
  <div className={`fixed inset-0 z-0 pointer-events-none hidden md:flex justify-between transition-opacity duration-1000 ${scrolled ? "opacity-0" : "opacity-100"}`}>
     {[0, 1].map(side => (
       <div key={side} className={`h-full w-12 relative ${side ? 'transform scale-x-[-1]' : ''}`}>
          <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className="text-[#D97706] opacity-30 block h-full absolute left-0">
             <path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-around py-12">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="w-0.5 h-20 bg-[#D97706]/40 ml-2 tassel-swing origin-top relative">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D97706]"></div>
                </div>
             ))}
          </div>
       </div>
     ))}
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
    window.addEventListener('mousemove', onMouseMove);
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
    return () => { window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMouseMove); cancelAnimationFrame(animationFrameId); };
  }, [isDark]);
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[100] md:block hidden" />;
};

// --- MAIN APP ---

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showEventToast, setShowEventToast] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [lang, setLang] = useState('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [data, setData] = useState({ 
    events: [{ date: "COMING SOON", loc: "...", venue: "...", link: DEFAULT_YT_LINK }],
    tracks: [],
    contact: { email: "contact@aishwaryamahesh.com", instagram: DEFAULT_YT_LINK, youtube: DEFAULT_YT_LINK, facebook: "#", websiteBy: "Name", websiteByLink: "#" }
  });

  const { isPlaying: isDronePlaying, toggle: toggleDrone } = useTanpura();

  useEffect(() => {
    fetch(DATA_URL).then(res => res.json()).then(json => setData(json)).catch(e => console.log("npoint error"));
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = translations[lang] || translations['en'];
  const scrollTo = (id) => { setIsMenuOpen(false); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 500); };

  return (
    <div className={`min-h-screen font-base-${lang} transition-colors duration-1000 overflow-x-hidden relative ${isNightMode ? 'bg-[#0B1221] text-[#E0E7FF]' : 'bg-[#FDFBF7] text-[#422006]'}`}>
      <GlobalStyles />
      <div className={`fixed inset-0 opacity-[0.08] pointer-events-none z-0 bg-pattern ${isNightMode ? 'invert opacity-[0.05]' : ''}`}></div>
      <CustomCursor isDark={isNightMode} />
      <MinimalFrame isNightMode={isNightMode} scrolled={scrolled} />
      <TasselBorder scrolled={scrolled} />

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

      {/* Increased Z-Index to 50 to ensure clickability above the frames */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? (isNightMode ? 'bg-[#0B1221]/95 border-[#1e293b]' : 'bg-[#FDFBF7]/95 border-[#e7e5e4]') + ' backdrop-blur-md py-4 border-b' : 'py-8'}`}>
        <div className="container mx-auto px-8 flex justify-between items-center">
          <span onClick={() => scrollTo('home')} className="text-xl tracking-[0.2em] font-base-${lang} font-bold cursor-pointer uppercase">AISHWARYA<span className="text-[#D97706]">.</span></span>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-4">
               <button onClick={toggleDrone} className={`flex items-center gap-2 text-xs font-bold uppercase hover:text-[#D97706] border px-4 py-2 rounded-full ${isDronePlaying ? 'border-[#D97706] text-[#D97706]' : 'border-stone-300'}`}>
                 {isDronePlaying ? <Volume2 size={14} /> : <VolumeX size={14} />} {isDronePlaying ? t.soundOn : t.soundOff}
               </button>
               <button onClick={() => setIsNightMode(!isNightMode)} className={`p-2 hover:text-[#D97706] transition-colors ${isNightMode ? 'text-indigo-300' : 'text-stone-600'}`}>{isNightMode ? <Sun size={20}/> : <Moon size={20}/>}</button>
            </div>
            {/* Added cursor-pointer explicit just in case */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-3 text-xs font-bold uppercase hover:text-[#D97706] cursor-pointer"><span>{t.menu}</span><Menu size={24} /></button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] pointer-events-none flex ${isMenuOpen ? 'pointer-events-auto' : ''}`}>
        <div className={`relative w-1/2 h-full transition-transform duration-1000 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isNightMode ? 'bg-[#0B1221]' : 'bg-[#451a03]'}`}>
           <div className="absolute right-0 h-full transform translate-x-full z-10">
              <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className={`block ${isNightMode ? 'text-[#0B1221]' : 'text-[#451a03]'}`}><path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="currentColor" /></svg>
              <div className="absolute top-0 left-0 h-full w-4 flex flex-col justify-around">
                 {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 h-12 bg-[#D97706]/60 mx-auto tassel-swing origin-top relative">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D97706]"></div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
        <div className={`relative w-1/2 h-full transition-transform duration-1000 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} ${isNightMode ? 'bg-[#0B1221]' : 'bg-[#451a03]'}`}>
           <div className="absolute left-0 h-full transform -translate-x-full z-10 scale-x-[-1]">
              <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className={`block ${isNightMode ? 'text-[#0B1221]' : 'text-[#451a03]'}`}><path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="currentColor" /></svg>
              <div className="absolute top-0 left-0 h-full w-4 flex flex-col justify-around">
                 {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1 h-12 bg-[#D97706]/60 mx-auto tassel-swing origin-top relative" style={{animationDelay: '0.5s'}}>
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#D97706]"></div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 delay-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-[#D97706] z-[70] cursor-pointer"><X size={32} /></button>
           <div className="text-center space-y-6">
            {['about', 'music', 'events', 'contact'].map(item => <button key={item} onClick={() => scrollTo(item)} className="block text-4xl md:text-7xl font-base-${lang} text-[#FEF3C7] hover:text-[#D97706] capitalize transition-colors">{t[item]}</button>)}
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
          <h3 className={`text-2xl md:text-4xl font-base-${lang} italic mb-8`}>"{t.quote}"</h3>
          <div className="flex justify-center"><svg width="100" height="20" viewBox="0 0 100 20" stroke="#D97706"><path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" strokeWidth="2" /></svg></div>
        </div>
      </section>

      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 relative">
            <div className={`relative z-10 aspect-[3/4] overflow-hidden rounded-t-full rounded-b-2xl shadow-2xl flex items-center justify-center ${isNightMode ? 'bg-[#1E293B]' : 'bg-[#FFFBEB]'}`}><div className="text-center p-8 opacity-30 text-6xl font-base-${lang}">A</div></div>
            <div className="absolute top-4 -left-4 w-full h-full border-2 border-[#D97706]/30 rounded-t-full rounded-b-2xl z-0"></div>
          </div>
          <div className="md:w-1/2">
            <h2 className={`text-6xl font-base-${lang} mb-8 ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>{t.sadhana}</h2>
            <p className="text-lg leading-loose mb-8 font-light">{t.artistAbout}</p>
            <div className="grid grid-cols-2 gap-8">
              {[{v: "15+", l: t.training}, {v: "100+", l: t.concerts}].map((s,i) => (
                <div key={i} className="p-6 border-l-2 border-[#D97706] bg-stone-50/5"><div className="text-4xl font-bold mb-2">{s.v}</div><div className="text-xs tracking-widest uppercase opacity-60">{s.l}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MotifSeparator isNightMode={isNightMode} />

      <section id="music" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16"><h2 className="text-4xl md:text-5xl font-base-${lang}">{t.works}</h2><a href={data.contact.youtube} target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase hover:text-[#D97706]">{t.viewAll} <ArrowRight size={14} /></a></div>
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

      <footer className={`py-24 px-6 ${isNightMode ? 'bg-[#020617] text-stone-400' : 'bg-[#451a03] text-[#FED7AA]'}`}>
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