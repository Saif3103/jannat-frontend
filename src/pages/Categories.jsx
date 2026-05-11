import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const fallback = [
    { name: 'Persian Rugs', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
    { name: 'Turkish Kilims', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80' },
    { name: 'Handwoven Wool', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&q=80' },
    { name: 'Silk Carpets', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
    { name: 'Modern Rugs', image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&q=80' },
    { name: 'Luxury Collections', image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80' },
  ];

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  const display = categories.length > 0 ? categories : fallback;

  return (
    <>
      <Helmet>
        <title>Carpet Categories | Jannat Rugs Co.</title>
        <meta name="description" content="Browse our curated carpet categories including Persian, Turkish, Silk, and handwoven wool rugs." />
      </Helmet>
      <div className="pt-20 min-h-screen bg-[#0D0D0D]">
        <div className="py-20 px-4 text-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 100%)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Find Your Style</p>
          <h1 className="font-luxury text-5xl md:text-6xl text-white mb-4">All Categories</h1>
          <div className="divider-gold mx-auto mb-4" />
          <p className="text-amber-100/50 max-w-lg mx-auto text-sm leading-relaxed">
            Explore our curated collections of luxury handmade carpets, crafted to transform any space into a masterpiece.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex flex-wrap justify-center gap-8">
            {display.map((cat, i) => (
              <motion.div key={cat._id || cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
                className="category-card rounded-2xl overflow-hidden cursor-pointer w-full sm:w-[350px]" style={{ height: '350px' }}>
                <Link to={`/shop?category=${cat._id || ''}`} className="block h-full relative group">
                  <img src={cat.image || fallback[i % fallback.length]?.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                  
                  {/* Content perfectly centered inside the card */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 transition-transform duration-500 group-hover:-translate-y-2">
                    <h2 className="font-luxury text-white text-3xl mb-2">{cat.name}</h2>
                    <div className="w-12 h-px bg-amber-400/50 mb-3" />
                    {cat.description && <p className="text-amber-100/60 text-sm mb-4 line-clamp-2 max-w-[250px]">{cat.description}</p>}
                    <span className="text-amber-400 text-xs tracking-widest uppercase flex items-center gap-2 group-hover:text-amber-300 transition-colors">
                      Browse Collection <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
