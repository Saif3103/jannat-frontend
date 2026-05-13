import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiHeart, FiCheckCircle, FiGlobe, FiShield, FiTruck, 
  FiRefreshCw, FiHeadphones, FiUsers, FiStar 
} from 'react-icons/fi';
import { GiBigDiamondRing, GiIndianPalace } from 'react-icons/gi';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Jannat Rugs Co.</title>
        <meta name="description" content="Learn about Jannat Rugs Co., our heritage of handmade carpet craftsmanship, and our commitment to luxury quality." />
      </Helmet>
      
      <div className="min-h-screen pt-20 sm:pt-32 pb-16 sm:pb-20 font-sans">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-8 sm:mb-12">
            <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-300">About Us</span>
          </nav>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center mb-20 sm:mb-32">
            {/* Left Column */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <p className="text-[#1A1A1A] text-[9px] sm:text-[11px] font-bold tracking-[0.4em] uppercase mb-4 sm:mb-6">About Us</p>
              <h1 className="font-luxury text-4xl sm:text-7xl lg:text-8xl leading-[1.2] sm:leading-[1.1] mb-6 sm:mb-8 text-[#1A1A1A]">
                Rooted In Tradition, <br />
                Crafted For <span className="text-gold-gradient italic">Generations.</span>
              </h1>
              <div className="w-16 sm:w-20 h-1 bg-[#C9A84C] mb-6 sm:mb-8 mx-auto lg:ml-0" />
              <p className="text-black/50 text-sm sm:text-lg leading-relaxed mb-8 sm:mb-12 max-w-xl mx-auto lg:ml-0">
                At Jannat Rugs Co., we believe a rug is more than just a decor piece—it's a story, a legacy, and a work of art. 
                From timeless hand-knotted masterpieces to modern designs, every rug we create reflects our passion for 
                preserving India's rich weaving heritage.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-md lg:max-w-none mx-auto">
                {[
                  { icon: FiHeart, label: "Handcrafted Care" },
                  { icon: FiCheckCircle, label: "Eco Materials" },
                  { icon: FiStar, label: "Premium Quality" },
                  { icon: GiIndianPalace, label: "Made in India" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-start gap-3 group">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-amber-900/10 flex items-center justify-center text-[#1A1A1A] group-hover:bg-[#C9A84C] group-hover:text-black transition-all duration-500">
                      <item.icon size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest leading-tight text-black/40">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column (Image) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-square sm:aspect-[4/3] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-amber-900/20 shadow-[0_0_80px_rgba(201,168,76,0.1)]"
            >
              <img src="/about-hero.png" alt="Luxury Rug Showroom" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 py-8 sm:py-16 px-6 sm:px-12 rounded-[1.5rem] sm:rounded-[2.5rem] bg-white border border-amber-900/10 mb-20 sm:mb-32 shadow-xl"
          >
            {[
              { icon: FiUsers, value: "10K+", label: "Happy Customers" },
              { icon: GiBigDiamondRing, value: "500+", label: "Unique Designs" },
              { icon: FiStar, value: "25+", label: "Years of Excellence" },
              { icon: FiGlobe, value: "20+", label: "Countries Served" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-6 group text-center sm:text-left">
                <div className="text-[#1A1A1A] group-hover:scale-110 transition-transform duration-500">
                  <stat.icon size={28} className="sm:w-9 sm:h-9" />
                </div>
                <div>
                  <p className="text-2xl sm:text-4xl font-luxury text-[#1A1A1A] font-bold">{stat.value}</p>
                  <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-black/40 font-bold">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Our Promise Section */}
          <div className="text-center mb-16 sm:mb-32">
            <p className="text-[#1A1A1A] text-[9px] sm:text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Our Promise</p>
            <h2 className="font-luxury text-4xl sm:text-6xl text-[#1A1A1A] mb-6 sm:mb-8">Quality You Can Trust</h2>
            <p className="text-black/50 text-sm sm:text-lg max-w-2xl mx-auto mb-10 sm:mb-16 leading-relaxed">
              We are committed to providing authentic, high-quality rugs that bring elegance and warmth to your space.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {[
                { icon: FiShield, title: "Secure Payments", desc: "100% Protected" },
                { icon: FiTruck, title: "Free Shipping", desc: "On all orders" },
                { icon: FiRefreshCw, title: "7-Day Returns", desc: "Hassle-free" },
                { icon: FiHeadphones, title: "Dedicated Support", desc: "Expert guidance" },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-amber-900/10 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] hover:border-amber-500/30 transition-all duration-500 group text-left shadow-sm">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="text-[#1A1A1A] group-hover:rotate-[360deg] transition-transform duration-700">
                      <item.icon size={24} className="sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <p className="text-[#1A1A1A] font-bold text-xs sm:text-sm tracking-wide mb-0.5 sm:mb-1 uppercase">{item.title}</p>
                      <p className="text-black/40 text-[8px] sm:text-[10px] font-medium tracking-wider uppercase">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
