import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const HERO_STATES = {
  morning: {
    heading: "Refresh Your Space",
    subheading: "Start your day with timeless comfort and luxury.",
    bg: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=2400&q=100", 
    cta: "Explore Collection",
    accent: "from-amber-100/20 to-transparent",
    mood: "☀️ Good Morning",
    overlay: "bg-black/30"
  },
  afternoon: {
    heading: "Luxury Crafted For Everyday Living",
    subheading: "Discover premium rugs designed to elevate your home.",
    bg: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=2400&q=100", 
    cta: "Shop Luxury Rugs",
    accent: "from-white/10 to-transparent",
    mood: "✨ Good Afternoon",
    overlay: "bg-black/40"
  },
  evening: {
    heading: "Comfort Meets Luxury",
    subheading: "Transform your evenings into a space of warmth.",
    bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2400&q=100", 
    cta: "Explore Cozy Styles",
    accent: "from-orange-500/10 to-transparent",
    mood: "🌅 Good Evening",
    overlay: "bg-black/50"
  },
  night: {
    heading: "Luxury That Feels Like Home",
    subheading: "Timeless rugs crafted for beautiful nights.",
    bg: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=2400&q=100", 
    cta: "Discover Luxury",
    accent: "from-indigo-900/20 to-transparent",
    mood: "🌙 Good Night",
    overlay: "bg-black/60"
  }
};

const getHeroState = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
};

export default function SmartHero({ logo }) {
  const [stateKey, setStateKey] = useState(getHeroState());
  const state = HERO_STATES[stateKey];

  useEffect(() => {
    const timer = setInterval(() => {
      setStateKey(getHeroState());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[750px] flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stateKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            src={state.bg}
            alt="Luxury Interior"
            className="w-full h-full object-cover"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear" }}
          />
          <div className={`absolute inset-0 ${state.overlay} transition-colors duration-1000`} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
          <div className={`absolute inset-0 bg-gradient-to-tr ${state.accent} pointer-events-none transition-all duration-1000`} />
        </motion.div>
      </AnimatePresence>

      {/* Luxury Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0
            }}
            animate={{ 
              y: ["100%", "-10%"],
              opacity: [0, 0.7, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: 15 + Math.random() * 25, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center w-full mt-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="flex flex-col items-center"
        >
          {/* Subtle Greeting */}
          <motion.div 
            key={`greeting-${stateKey}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6 mb-12"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/50" />
            <p className="text-[#C9A84C] font-black tracking-[0.5em] uppercase text-[10px] sm:text-xs">
              {state.mood}
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/50" />
          </motion.div>

          {/* Logo Integration */}
          {logo && (
             <motion.img 
               src={logo} 
               alt="Brand Logo" 
               className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover mb-12 border border-[#C9A84C]/30 shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-1 bg-[#1A1A1A]"
               whileHover={{ scale: 1.05 }}
             />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${stateKey}`}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-white font-medium leading-[0.95] tracking-tight max-w-6xl">
                {state.heading}
              </h1>
              
              <p className="text-white/70 text-lg sm:text-2xl md:text-3xl font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
                {state.subheading}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row items-center gap-8 mt-16">
            <Link to="/shop" className="group bg-white text-black px-12 py-6 rounded-2xl font-black text-sm tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-6 active:scale-95">
              {state.cta} <FiArrowRight className="group-hover:translate-x-3 transition-transform" strokeWidth={3} />
            </Link>
            <Link to="/shop?category=Handmade" className="px-12 py-6 rounded-2xl font-black text-sm tracking-[0.3em] uppercase text-white border border-white/20 hover:bg-white/5 transition-all active:scale-95">
              Discover Artisans
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-8">
        <span className="text-[10px] text-white/30 uppercase tracking-[0.6em] font-black rotate-90 origin-left translate-x-3">Scroll To Explore</span>
        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-px h-24 bg-gradient-to-b from-amber-400 via-amber-400/20 to-transparent" 
        />
      </div>
    </section>
  );
}
