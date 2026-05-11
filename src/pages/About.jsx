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
      
      <div className="bg-[#0D0D0D] min-h-screen pt-32 pb-20 text-white font-sans">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-12">
            <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-300">About Us</span>
          </nav>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            {/* Left Column */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-amber-500 text-[11px] font-bold tracking-[0.4em] uppercase mb-6">About Us</p>
              <h1 className="font-luxury text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-8 text-white">
                Rooted In Tradition, <br />
                Crafted For <span className="text-gold-gradient italic">Generations.</span>
              </h1>
              <div className="w-20 h-1 bg-amber-500 mb-8" />
              <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-xl">
                At Jannat Rugs Co., we believe a rug is more than just a decor piece—it's a story, a legacy, and a work of art. 
                From timeless hand-knotted masterpieces to modern designs, every rug we create reflects our passion for 
                preserving India's rich weaving heritage. With every thread, we weave trust, quality, and a promise of beauty 
                that lasts for generations.
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {[
                  { icon: FiHeart, label: "Handcrafted with Care" },
                  { icon: FiCheckCircle, label: "Eco-friendly Materials" },
                  { icon: FiStar, label: "Premium Quality Assured" },
                  { icon: GiIndianPalace, label: "Proudly Made in India" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl border border-amber-900/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all duration-500">
                      <item.icon size={22} />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest leading-tight text-gray-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column (Image) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border border-amber-900/20 shadow-[0_0_80px_rgba(201,168,76,0.1)]"
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
            className="grid grid-cols-2 md:grid-cols-4 gap-12 py-16 px-12 rounded-[2.5rem] bg-[#121212] border border-amber-900/10 mb-32 shadow-2xl"
          >
            {[
              { icon: FiUsers, value: "10K+", label: "Happy Customers" },
              { icon: GiBigDiamondRing, value: "500+", label: "Unique Designs" },
              { icon: FiStar, value: "25+", label: "Years of Excellence" },
              { icon: FiGlobe, value: "20+", label: "Countries Served" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="text-amber-500 group-hover:scale-110 transition-transform duration-500">
                  <stat.icon size={36} />
                </div>
                <div>
                  <p className="text-4xl font-luxury text-white font-bold">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Our Promise Section */}
          <div className="text-center mb-32">
            <p className="text-amber-500 text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Our Promise</p>
            <h2 className="font-luxury text-5xl md:text-6xl text-white mb-8">Quality You Can Trust</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
              We are committed to providing authentic, high-quality rugs that bring elegance and warmth to your space. 
              Each piece is crafted with precision, passion, and pride.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: FiShield, title: "Secure Payments", desc: "100% Protected transactions" },
                { icon: FiTruck, title: "Free Shipping", desc: "On all orders nationwide" },
                { icon: FiRefreshCw, title: "7-Day Returns", desc: "Hassle-free return policy" },
                { icon: FiHeadphones, title: "Dedicated Support", desc: "Expert guidance anytime" },
              ].map((item, i) => (
                <div key={i} className="bg-[#121212] border border-amber-900/10 p-8 rounded-[2rem] hover:border-amber-500/30 transition-all duration-500 group text-left">
                  <div className="flex items-center gap-6">
                    <div className="text-amber-500 group-hover:rotate-[360deg] transition-transform duration-700">
                      <item.icon size={28} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm tracking-wide mb-1 uppercase">{item.title}</p>
                      <p className="text-gray-500 text-[10px] font-medium tracking-wider uppercase">{item.desc}</p>
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
