import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return { text: "Good Morning", icon: "☀️" };
  if (hour >= 11 && hour < 17) return { text: "Good Afternoon", icon: "✨" };
  if (hour >= 17 && hour < 20) return { text: "Good Evening", icon: "🌅" };
  return { text: "Good Night", icon: "🌙" };
};

export default function SmartHero({ videoUrl, logo }) {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const timer = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

    <div className="flex flex-col w-full bg-[#FAF7F2]">
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            key={videoUrl}
            className="w-full h-full object-cover"
          >
            <source src={videoUrl || "https://cdn.shopify.com/videos/c/o/v/e4f8cd624bcb4347b9970e005d0bb736.mp4"} type="video/mp4" />
          </video>
          {/* High Definition Overlays */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        <div className="relative z-10 px-4 max-w-7xl mx-auto flex flex-col items-center justify-center text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center"
          >
            {/* Dynamic Time-Based Greeting */}
            <AnimatePresence mode="wait">
              <motion.div
                key={greeting.text}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center"
              >
                 <p className="text-amber-500 font-black tracking-[0.6em] uppercase text-[10px] sm:text-xs mb-6 flex items-center gap-4">
                   <span className="w-8 h-px bg-amber-500/30" />
                   {greeting.icon} {greeting.text}
                   <span className="w-8 h-px bg-amber-500/30" />
                 </p>
              </motion.div>
            </AnimatePresence>

            {/* Brand Logo */}
            {logo && (
               <motion.img 
                 src={logo} 
                 alt="Jannat Rugs Logo" 
                 className="w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full object-cover mb-12 border-2 border-amber-500/20 shadow-[0_0_50px_rgba(201,168,76,0.2)]"
                 initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                 animate={{ opacity: 1, scale: 1, rotate: 0 }}
                 whileHover={{ scale: 1.05 }}
                 transition={{ 
                   duration: 1.5, 
                   ease: "easeOut",
                   scale: { type: "spring", stiffness: 100 }
                 }}
               />
            )}

            <h1 className="font-luxury text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] text-gold-gradient font-bold tracking-widest leading-none mb-4" style={{ filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))' }}>
              JANNAT
            </h1>
            <h2 className="font-luxury text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-gold-gradient font-bold tracking-[0.3em] leading-none mb-12" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))' }}>
              RUGS CO.
            </h2>

            <Link to="/shop" className="btn-gold flex items-center justify-center gap-3 px-10 sm:px-14 py-4 sm:py-6 text-sm sm:text-xl shadow-[0_20px_50px_rgba(201,168,76,0.3)] group">
              Explore Collection <FiArrowRight className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block">
          <motion.div 
            animate={{ y: [0, 15, 0] }} 
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold">Explore</span>
            <div className="w-px h-20 bg-gradient-to-b from-amber-400 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Mirzapur Red Scrolling Text Ticker - Just below Hero Section */}
      <div className="w-full overflow-hidden whitespace-nowrap py-5 bg-[#FAF7F2] border-b border-[#E8DFC8]/50 shadow-sm select-none z-10">
        <div className="inline-block animate-ticker text-red-600 font-luxury text-2xl sm:text-4xl md:text-5xl tracking-[0.3em] uppercase font-bold opacity-90">
          Mirzapur &nbsp;&nbsp;&bull;&nbsp;&nbsp; Handcrafted Heritage &nbsp;&nbsp;&bull;&nbsp;&nbsp; Mirzapur &nbsp;&nbsp;&bull;&nbsp;&nbsp; Handcrafted Heritage &nbsp;&nbsp;&bull;&nbsp;&nbsp; Mirzapur &nbsp;&nbsp;&bull;&nbsp;&nbsp; Handcrafted Heritage &nbsp;&nbsp;&bull;&nbsp;&nbsp;
        </div>
      </div>
    </div>
  );
}
