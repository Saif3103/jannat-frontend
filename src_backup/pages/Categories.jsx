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
      <div className="pt-20 min-h-screen">
        <div className="py-16 text-center" style={{ background: 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, transparent 100%)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-2">Find Your Style</p>
          <h1 className="font-luxury text-5xl text-white mb-3">All Categories</h1>
          <div className="divider-gold" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {display.map((cat, i) => (
              <motion.div key={cat._id || cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
                className="category-card rounded-2xl overflow-hidden cursor-pointer" style={{ height: '280px' }}>
                <Link to={`/shop?category=${cat._id || ''}`} className="block h-full relative">
                  <img src={cat.image || fallback[i % fallback.length]?.image} alt={cat.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <h2 className="font-luxury text-white text-2xl mb-1">{cat.name}</h2>
                    {cat.description && <p className="text-amber-100/50 text-sm mb-2 line-clamp-1">{cat.description}</p>}
                    <span className="text-amber-400 text-xs flex items-center gap-1">Browse <FiArrowRight size={12} /></span>
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
