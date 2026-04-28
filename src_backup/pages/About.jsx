import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Jannat Rugs Co.</title>
        <meta name="description" content="Learn about Jannat Rugs Co., our heritage of handmade carpet craftsmanship, and our commitment to luxury quality." />
      </Helmet>
      <div className="pt-20 min-h-screen">
        {/* Hero */}
        <div className="relative h-72 flex items-center justify-center overflow-hidden" style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80" alt="Our Story"
            className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="relative text-center">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-2">Our Heritage</p>
            <h1 className="font-luxury text-5xl md:text-6xl text-white">About Jannat Rugs</h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
          {/* Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">Our Story</p>
              <h2 className="font-luxury text-4xl text-white mb-6">A Legacy Woven In Gold</h2>
              <div className="space-y-4 text-amber-100/60 leading-relaxed">
                <p>Jannat Rugs Co. was born from a deep reverence for the ancient art of carpet weaving. We believe that every home deserves the touch of genuine craftsmanship — rugs that carry the warmth of human hands and the wisdom of centuries.</p>
                <p>Our artisans draw from rich traditions of Persian, Turkish, and Mughal carpet-making, blending heritage techniques with contemporary design sensibilities to create pieces that are truly timeless.</p>
                <p>Each carpet tells a story. From the selection of the finest wool and silk to the intricate hand-knotting process that can take months, we ensure that every step honors the tradition of luxury.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl overflow-hidden" style={{ height: '400px' }}>
              <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80" alt="Carpet Craftsmanship" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Values */}
          <div className="text-center">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">What We Stand For</p>
            <h2 className="font-luxury text-4xl text-white mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { emoji: '🏺', title: 'Authentic Craftsmanship', desc: 'Every piece handmade by certified master weavers with decades of experience.' },
                { emoji: '✨', title: 'Premium Quality', desc: 'Only the finest materials — pure wool, silk, and cotton — sourced responsibly.' },
                { emoji: '🤝', title: 'Customer First', desc: 'Your satisfaction is our mission. From discovery to delivery and beyond.' },
              ].map(v => (
                <motion.div key={v.title} whileHover={{ y: -6 }} className="glass-card p-8 text-center">
                  <div className="text-5xl mb-4">{v.emoji}</div>
                  <h3 className="font-luxury text-xl text-amber-400 mb-3">{v.title}</h3>
                  <p className="text-amber-100/50 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-amber-900/20">
            {[
              { number: '500+', label: 'Unique Designs' },
              { number: '10K+', label: 'Happy Customers' },
              { number: '25+', label: 'Years of Craft' },
              { number: '100%', label: 'Handmade' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-luxury text-4xl text-gold-gradient mb-1">{s.number}</div>
                <div className="text-amber-100/50 text-sm tracking-wider uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="font-luxury text-3xl text-white mb-4">Ready to Find Your Perfect Carpet?</h2>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2 px-10 py-4">
              Explore Collection <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
