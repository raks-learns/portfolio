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
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
      50% { transform: translateY(-15px) rotate(3deg); opacity: 0.6; }
    }

    /* Pattern Overlay */
    .bg-pattern {
      background-image: radial-gradient(#D97706 0.8px, transparent 0.8px), radial-gradient(#D97706 0.8px, transparent 0.8px);
      background-size: 24px 24px;
      background-position: 0 0, 12px 12px;
    }
    
    @keyframes slide-up {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up {
      animation: slide-up 0.5s ease-out forwards;
    }

    /* Tassel Swing Animation */
    @keyframes swing {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(5deg); }
      75% { transform: rotate(-5deg); }
      100% { transform: rotate(0deg); }
    }
    .tassel-swing {
      transform-origin: top center;
      animation: swing 3s ease-in-out infinite;
    }
  `}</style>
);

// --- TRANSLATIONS ---
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
    t1_title: "Concert for VVS Foundation", t1_sub: "Live Performance",
    t2_title: "Beeti Na Bitai Raina", t2_sub: "Cover • Light Classical",
    t3_title: "Suswara Concert", t3_sub: "Facebook Live Series",
    t4_title: "Tatvaloka", t4_sub: "Full Concert",
    e1_venue: "The Great Shower Symphony", e1_loc: "BATHROOM",
    e2_venue: "Serenading the Neighbors' Cat", e2_loc: "ROOF",
    e3_venue: "Midnight Snack Arias", e3_loc: "KITCHEN",
    upcoming: "Upcoming Event",
    getTickets: "Get Tickets"
  },
  // Other languages use english keys for specific song titles to keep it simple for now
  hi: { name: "ऐश्वर्या महेश", about: "परिचय", music: "संगीत", events: "कार्यक्रम", contact: "संपर्क", listen: "अभी सुनें", type: "कर्नाटक शास्त्रीय संगीत", raga: "राग", quote: "संगीत केवल प्रदर्शन नहीं है...", sadhana: "साधना", training: "वर्षों का प्रशिक्षण", concerts: "कॉन्सर्ट", works: "चयनित कृतियां", viewAll: "सभी देखें", performances: "प्रस्तुतियां", details: "विवरण देखें", explore: "खोजें", connect: "जुड़ें", desc: "प्रामाणिक कर्नाटक संगीत को आत्मा तक पहुँचाना।", artistAbout: "मैं कर्नाटक संगीत की छात्रा हूँ...", tagline: "2010 से सही श्रुति खोजने का प्रयास।", droneOn: "तानपूरा चालु", droneOff: "तानपूरा बंद", menu: "मेन्यू", liveAt: "चेन्नई में लाइव", watchHighlights: "झलकियाँ देखें", designedBy: "राग और लय के साथ निर्मित", t1_title: "VVS फाउंडेशन के लिए कॉन्सर्ट", t1_sub: "लाइव", t2_title: "बीती ना बिताई रैना", t2_sub: "कवर", t3_title: "सुस्वरा कॉन्सर्ट", t3_sub: "फेसबुक लाइव", t4_title: "तत्वलोका", t4_sub: "पूर्ण कॉन्सर्ट", e1_venue: "महान शॉवर सिम्फनी", e1_loc: "स्नानघर", e2_venue: "पड़ोसी की बिल्ली", e2_loc: "छत", e3_venue: "मध्यरात्रि नाश्ता", e3_loc: "रसोई", upcoming: "आगामी कार्यक्रम", getTickets: "टिकट प्राप्त करें" },
  kn: { name: "ಐಶ್ವರ್ಯ ಮಹೇಶ್", about: "ಪರಿಚಯ", music: "ಸಂಗೀತ", events: "ಕಾರ್ಯಕ್ರಮಗಳು", contact: "ಸಂಪರ್ಕ", listen: "ಕೇಳಿ", type: "ಕರ್ನಾಟಿಕ್ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ", raga: "ರಾಗ", quote: "ಸಂಗೀತ ಕೇವಲ ಪ್ರದರ್ಶನವಲ್ಲ...", sadhana: "ಸಾಧನಾ", training: "ವರ್ಷಗಳ ತರಬೇತಿ", concerts: "ಕಚೇರಿಗಳು", works: "ಆಯ್ದ ಕೃತಿಗಳು", viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ", performances: "ಪ್ರದರ್ಶನಗಳು", details: "ವಿವರಗಳು", explore: "ಅನ್ವೇಷಿಸಿ", connect: "ಸಂಪರ್ಕಿಸಿ", desc: "ಅಪ್ಪಟ ಕರ್ನಾಟಕ ಸಂಗೀತ...", artistAbout: "ನಾನು ಕರ್ನಾಟಕ ಸಂಗೀತದ ವಿದ್ಯಾರ್ಥಿನಿ...", tagline: "2010 ರಿಂದ ಸರಿಯಾದ ಶ್ರುತಿಗಾಗಿ ಹುಡುಕಾಟ.", droneOn: "ಶ್ರುತಿ ಆನ್", droneOff: "ಶ್ರುತಿ ಆಫ್", menu: "ಮೆನು", liveAt: "ಚೆನ್ನೈನಲ್ಲಿ ಲೈವ್", watchHighlights: "ಮುಖ್ಯಾಂಶಗಳು", designedBy: "ರಾಗ ಮತ್ತು ಲಯ", t1_title: "VVS ಫೌಂಡೇಶನ್ ಕಚೇರಿ", t1_sub: "ಲೈವ್", t2_title: "ಬೀತಿ ನಾ ಬಿತಾಯಿ ರೈನಾ", t2_sub: "ಕವರ್", t3_title: "ಸುಸ್ವರ ಕಚೇರಿ", t3_sub: "ಫೇಸ್‌ಬುಕ್ ಲೈವ್", t4_title: "ತತ್ವಾಲೋಕ", t4_sub: "ಪೂರ್ಣ ಕಚೇರಿ", e1_venue: "ಶವರ್ ಕಚೇರಿ", e1_loc: "ಸ್ನಾನಗೃಹ", e2_venue: "ಬೆಕ್ಕಿಗಾಗಿ ಸಂಗೀತ", e2_loc: "ಮಿದ್ದು", e3_venue: "ಮಧ್ಯರಾತ್ರಿ ರಾಗ", e3_loc: "ಅಡುಗೆಮನೆ", upcoming: "ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮ", getTickets: "ಟಿಕೆಟ್ ಪಡೆಯಿರಿ" },
  ta: { name: "ஐஸ்வர்யா மகேஷ்", about: "அறிமுகம்", music: "இசை", events: "நிகழ்வுகள்", contact: "தொடர்பு", listen: "கேளுங்கள்", type: "கர்நாடக இசை", raga: "ராகம்", quote: "இசை என்பது வெறும் நிகழ்ச்சியல்ல...", sadhana: "சாதனா", training: "ஆண்டுகள் பயிற்சி", concerts: "கச்சேரிகள்", works: "படைப்புகள்", viewAll: "அனைத்தும்", performances: "நிகழ்ச்சிகள்", details: "விவரங்கள்", explore: "ஆராயுங்கள்", connect: "இணைக்கவும்", desc: "உண்மையான கர்நாடக இசை...", artistAbout: "நான் கர்நாடக இசையின் மாணவி...", tagline: "2010 முதல் சரியான ஸ்ருதியைத் தேடும் முயற்சி.", droneOn: "ஸ்ருதி ஆன்", droneOff: "ஸ்ருதி ஆஃப்", menu: "மெனு", liveAt: "சென்னையில் நேரலை", watchHighlights: "சிறப்பம்சங்கள்", designedBy: "ராகம் தாளம்", t1_title: "VVS அறக்கட்டளை கச்சேரி", t1_sub: "நேரலை", t2_title: "பீதி நா பிதாய் ரைனா", t2_sub: "கவர்", t3_title: "சுஸ்வரா கச்சேரி", t3_sub: "பேஸ்புக் நேரலை", t4_title: "தத்வாலோகா", t4_sub: "முழு கச்சேரி", e1_venue: "குளியலறை கச்சேரி", e1_loc: "குளியலறை", e2_venue: "பூனைக்கு பாட்டு", e2_loc: "மாடி", e3_venue: "நள்ளிரவு சிற்றுண்டி", e3_loc: "சமையலறை", upcoming: "வரவிருக்கும் நிகழ்வு", getTickets: "டிக்கெட் பெறுங்கள்" },
  te: { name: "ఐశ్వర్య మహేష్", about: "పరిచయం", music: "సంగీతం", events: "కార్యక్రమాలు", contact: "సంప్రదించండి", listen: "వినండి", type: "కర్ణాటక సంగీతం", raga: "రాగం", quote: "సంగీతం కేవలం ప్రదర్శన కాదు...", sadhana: "సాధన", training: "ఏళ్ళ శిక్షణ", concerts: "కచేరీలు", works: "కృతులు", viewAll: "అన్నీ చూడండి", performances: "ప్రదర్శనలు", details: "వివరాలు", explore: "అన్వేషించండి", connect: "కనెక్ట్", desc: "స్వచ్ఛమైన కర్ణాటక సంగీతాన్ని ఆత్మకు చేరవేయడం.", artistAbout: "నేను కర్ణాటక సంగీత విద్యార్థిని...", tagline: "2010 నుండి సరైన శ్రుతి కోసం ప్రయత్నం.", droneOn: "శ్రుతి ఆన్", droneOff: "శ్రుతి ఆఫ్", menu: "మెనూ", liveAt: "చెన్నైలో లైవ్", watchHighlights: "ముఖ్యాంశాలు", designedBy: "రాగం తాళం", t1_title: "VVS ఫౌండేషన్ కచేరీ", t1_sub: "లైవ్", t2_title: "బీతీ నా బితాయీ రైనా", t2_sub: "కవర్", t3_title: "సుస్వర కచేరీ", t3_sub: "ఫేస్‌బుక్ లైవ్", t4_title: "తత్వాలోక", t4_sub: "పూర్తి కచేరీ", e1_venue: "షవర్ సింఫనీ", e1_loc: "బాత్రూమ్", e2_venue: "పిల్లి పాట", e2_loc: "పైకప్పు", e3_venue: "స్నాక్ రాగాలు", e3_loc: "వంటగది", upcoming: "రాబోయే కార్యక్రమం", getTickets: "టిక్కెట్లు పొందండి" }
};

// --- SOUND ENGINE ---
const useTanpura = () => {
  const audioContext = useRef(null);
  const oscillators = useRef([]);
  const gainNode = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
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
    if (gainNode.current && audioContext.current) {
      gainNode.current.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 1);
    }
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
        ctx.resume().then(() => {
          if (isPlaying && oscillators.current.length === 0) {
            startDrone();
          }
        });
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };

    if (isPlaying) {
        try { startDrone(); } catch (e) { console.log("Autoplay blocked"); }
    }

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('scroll', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
      if(gainNode.current) stopDrone();
    };
  }, []);

  const toggle = () => {
    if (isPlaying) { setIsPlaying(false); stopDrone(); }
    else { setIsPlaying(true); startDrone(); }
  };

  return { isPlaying, toggle };
};

// --- CUSTOM CURSOR ---
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

// --- LAYERED MANDALA (Intricate & Subtle) ---
const MandalaBg = ({ isNightMode }) => (
  <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none transition-opacity duration-1000">
    <svg className={`w-[140vh] h-[140vh] animate-[spin_120s_linear_infinite] ${isNightMode ? 'text-white' : 'text-[#78350F]'}`} viewBox="0 0 200 200">
       <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.2" fill="none" strokeDasharray="4 4" />
       <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.3" fill="none" />
       {[...Array(8)].map((_, i) => (
         <g key={i} transform={`rotate(${i * 45} 100 100)`}>
            <path d="M100 30 Q 115 60 100 90 Q 85 60 100 30" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <path d="M100 45 Q 105 60 100 75 Q 95 60 100 45" stroke="currentColor" strokeWidth="0.3" fill="none" />
            <circle cx="100" cy="25" r="1" fill="currentColor" />
         </g>
       ))}
       <path d="M100 50 L 135 85 L 100 120 L 65 85 Z" stroke="currentColor" strokeWidth="0.2" fill="none" />
       <circle cx="100" cy="100" r="10" stroke="currentColor" strokeWidth="0.5" fill="none" />
       {[...Array(12)].map((_, i) => (
         <path key={i} d={`M100 100 L ${100 + 10 * Math.cos(i * Math.PI / 6)} ${100 + 10 * Math.sin(i * Math.PI / 6)}`} stroke="currentColor" strokeWidth="0.2" />
       ))}
    </svg>
  </div>
);

// --- TASSEL BORDER (Hero Only) ---
const TasselBorder = ({ isNightMode, scrolled }) => {
  const color = isNightMode ? '#D97706' : '#D97706'; 
  
  // Fade out completely when scrolled
  const visibility = scrolled ? "opacity-0 pointer-events-none" : "opacity-100";

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none hidden md:flex justify-between transition-opacity duration-1000 ${visibility}`}>
       {/* Left Tassel Strip */}
       <div className="h-full w-12 relative">
          <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className="text-[#D97706] opacity-30 block h-full absolute left-0">
             <path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-around py-8">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="w-0.5 h-16 bg-[#D97706]/40 ml-2 tassel-swing origin-top relative">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D97706]"></div>
                </div>
             ))}
          </div>
       </div>

       {/* Right Tassel Strip */}
       <div className="h-full w-12 relative transform scale-x-[-1]">
          <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className="text-[#D97706] opacity-30 block h-full absolute left-0">
             <path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-around py-8">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="w-0.5 h-16 bg-[#D97706]/40 ml-2 tassel-swing origin-top relative" style={{animationDelay: '0.5s'}}>
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D97706]"></div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showEventToast, setShowEventToast] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [portraitImage, setPortraitImage] = useState(''); // Empty by default
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
      time: "10:15",
      image: "https://img.youtube.com/vi/gLA-b8uMlp4/mqdefault.jpg", 
      link: "https://www.youtube.com/watch?v=gLA-b8uMlp4"
    },
    { 
      id: 2, 
      title: t.t2_title, 
      subtitle: t.t2_sub, 
      time: "01:24",
      image: "https://img.youtube.com/vi/H1qMF8eXB3s/mqdefault.jpg", 
      link: "https://www.youtube.com/watch?v=H1qMF8eXB3s"
    },
    { 
      id: 3, 
      title: t.t3_title, 
      subtitle: t.t3_sub, 
      time: "25:30",
      image: "https://img.youtube.com/vi/SLSd1YjTWiI/mqdefault.jpg", 
      link: "https://www.youtube.com/watch?v=SLSd1YjTWiI"
    },
    { 
      id: 4, 
      title: t.t4_title, 
      subtitle: t.t4_sub, 
      time: "15:45",
      image: "https://img.youtube.com/vi/FoBtiycK-nY/mqdefault.jpg", 
      link: "https://www.youtube.com/watch?v=FoBtiycK-nY"
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
    setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
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

  return (
    <div className={`min-h-screen font-base-${lang} transition-colors duration-1000 overflow-x-hidden relative ${isNightMode ? 'bg-[#0B1221] text-[#E0E7FF] selection:bg-[#F59E0B] selection:text-black' : 'bg-[#FDFBF7] text-[#422006] selection:bg-[#D97706] selection:text-white'}`}>
      <GlobalStyles />
      
      {/* Background Texture */}
      <div className={`fixed inset-0 opacity-[0.08] pointer-events-none z-0 bg-pattern ${isNightMode ? 'invert opacity-[0.05]' : ''}`}></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.05)_100%)]"></div>

      <CustomCursor isDark={isNightMode} />

      {/* DYNAMIC TASSEL BORDER (Hero Only) */}
      <TasselBorder isNightMode={isNightMode} scrolled={scrolled} />

      {/* Pop-up Toast - Colors Matched to Menu Screen */}
      {showEventToast && (
        <div className={`fixed bottom-8 right-8 z-[60] p-6 max-w-xs shadow-2xl border-l-4 border-[#D97706] animate-slide-up hidden md:block transition-all duration-500 ${isNightMode ? 'bg-[#0B1221] text-[#E0E7FF]' : 'bg-[#451a03] text-[#FEF3C7]'}`}>
          <button onClick={() => setShowEventToast(false)} className="absolute top-2 right-2 opacity-50 hover:opacity-100"><X size={14} /></button>
          <div className="text-xs tracking-[0.2em] uppercase text-[#D97706] mb-2">{t.upcoming}</div>
          <h4 className={`text-xl font-base-${lang} mb-1 font-bold`}>{events[0].venue}</h4>
          <p className={`text-sm mb-4 opacity-70`}>{events[0].date} • {events[0].loc}</p>
          <a href={events[0].link} target="_blank" rel="noreferrer" className={`w-full py-2 transition-colors text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${isNightMode ? 'bg-[#D97706] text-black hover:bg-[#D97706]/90' : 'bg-[#D97706] text-white hover:bg-[#b45309]'}`}>
            <Ticket size={14} /> {t.getTickets}
          </a>
        </div>
      )}

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

      {/* CURTAIN MENU (Cloud Edge + Tassels) */}
      <div className={`fixed inset-0 z-40 pointer-events-none flex ${isMenuOpen ? 'pointer-events-auto' : ''}`}>
        {/* Left Curtain */}
        <div className={`relative w-1/2 h-full transition-transform duration-1000 ease-in-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isNightMode ? 'bg-[#0B1221]' : 'bg-[#451a03]'} flex items-center justify-end`}>
           <div className="absolute right-0 h-full transform translate-x-full z-10">
              <svg height="100%" width="20" preserveAspectRatio="none" viewBox="0 0 20 100" className={`block ${isNightMode ? 'text-[#0B1221]' : 'text-[#451a03]'}`}>
                 <path d="M0 0 Q 20 5 0 10 Q 20 15 0 20 Q 20 25 0 30 Q 20 35 0 40 Q 20 45 0 50 Q 20 55 0 60 Q 20 65 0 70 Q 20 75 0 80 Q 20 85 0 90 Q 20 95 0 100" fill="currentColor" />
              </svg>
              {/* Tassels attached to scalloped edge */}
              <div className="absolute top-0 left-0 h-full w-4 flex flex-col justify-around">
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
              {/* Tassels */}
              <div className="absolute top-0 left-0 h-full w-4 flex flex-col justify-around">
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
           <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 p-2 hover:rotate-90 transition-transform duration-300 text-[#D97706] z-50"><X size={32} /></button>
           
           <div className="text-center space-y-6 mb-8">
            {['about', 'music', 'events', 'contact'].map((item) => (
              <button key={item} onClick={() => scrollTo(item)} className="block text-4xl md:text-7xl font-base-${lang} text-[#FEF3C7] hover:text-[#D97706] transition-colors capitalize">
                {t[item]}
              </button>
            ))}
          </div>

          {/* Mobile Menu Extras (Drone & Socials) */}
          <div className="flex flex-col items-center gap-6 mt-4">
             <button 
              onClick={(e) => { e.stopPropagation(); toggleDrone(); }}
              className={`flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase hover:text-[#D97706] transition-colors border px-6 py-3 rounded-full text-[#FEF3C7] border-[#FEF3C7] hover:border-[#D97706]`}
            >
              {isDronePlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{isDronePlaying ? t.droneOn : t.droneOff}</span>
            </button>

            <div className="flex gap-8 text-[#FEF3C7]">
              <a href={placeholderLink} target="_blank" rel="noreferrer" className="hover:text-[#D97706] transition-colors"><Instagram size={24} /></a>
              <a href={placeholderLink} target="_blank" rel="noreferrer" className="hover:text-[#D97706] transition-colors"><Youtube size={24} /></a>
            </div>
          </div>
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

        {/* Updated Mandala (More "Indiany") */}
        <MandalaBg isNightMode={isNightMode} />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <button onClick={handleGharanaClick} className={`tracking-[0.4em] text-xs font-bold uppercase mb-6 animate-fade-in-up hover:text-[#D97706] transition-colors ${isNightMode ? 'text-orange-300' : 'text-[#92400e]'}`}>
            {t.type}
          </button>
          
          <h1 className={`text-5xl md:text-8xl font-indian-style font-medium mb-6 transition-colors duration-1000 tracking-tight ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#451a03]'}`}>
            {t.name}
          </h1>
          
          <p className={`text-xl md:text-2xl font-light italic opacity-80 mb-8 text-base-${lang} ${isNightMode ? 'text-indigo-200' : 'text-[#78350F]'}`}>
             {t.tagline}
          </p>

          <a href="#music" className={`inline-flex items-center gap-3 px-8 py-3 rounded-full transition-all hover:scale-105 border ${isNightMode ? 'bg-[#D97706] text-black hover:bg-[#D97706]/90' : 'bg-[#D97706] text-white hover:bg-[#b45309]'}`}>
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
            <div className={`relative z-10 aspect-[3/4] overflow-hidden rounded-t-full rounded-b-2xl transition-all duration-700 shadow-2xl bg-[#FFFBEB] flex items-center justify-center ${isNightMode ? 'bg-[#1E293B]' : 'bg-[#FFFBEB]'}`}>
               {/* PLACEHOLDER for image */}
               {portraitImage ? (
                   <img src={portraitImage} alt="Portrait" className="w-full h-full object-cover" /> 
               ) : (
                   <div className="text-center p-8 opacity-30">
                       <div className={`text-6xl mb-4 font-base-${lang} ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#78350F]'}`}>A</div>
                       <p className={`uppercase tracking-widest text-xs ${isNightMode ? 'text-[#E0E7FF]' : 'text-[#78350F]'}`}>Portrait</p>
                   </div>
               )}
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
          
          {/* Added Credit Link */}
          <div className="flex flex-col items-center md:items-end">
              <p className="mt-4 md:mt-0 opacity-50">{t.designedBy}</p>
              <a href="#" className="mt-1 opacity-30 hover:opacity-100 transition-opacity text-[10px]">Website by: Name</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;