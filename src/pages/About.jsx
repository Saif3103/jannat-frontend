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
        <div className="relative h-96 flex items-center justify-center overflow-hidden" style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80" alt="Our Story"
            className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="relative text-center z-10 px-4">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-4">Our Heritage</p>
            <h1 className="font-luxury text-5xl md:text-7xl text-white mb-4">About Jannat Rugs</h1>
            <div className="divider-gold mx-auto" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-24 space-y-32">
          {/* Story (Perfectly Centered) */}
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full">
              <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-4">Our Story</p>
              <h2 className="font-luxury text-4xl md:text-5xl text-white mb-10">A Legacy Woven In Gold</h2>
              
              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-12 shadow-2xl border border-amber-900/20">
                <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80" alt="Carpet Craftsmanship" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-6 text-amber-100/60 leading-relaxed max-w-3xl mx-auto text-lg">
                <p>Jannat Rugs Co. was born from a deep reverence for the ancient art of carpet weaving. We believe that every home deserves the touch of genuine craftsmanship — rugs that carry the warmth of human hands and the wisdom of centuries.</p>
                <p>Our artisans draw from rich traditions of Persian, Turkish, and Mughal carpet-making, blending heritage techniques with contemporary design sensibilities to create pieces that are truly timeless.</p>
                <p>Each carpet tells a story. From the selection of the finest wool and silk to the intricate hand-knotting process that can take months, we ensure that every step honors the tradition of luxury.</p>
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <div className="text-center">
            <p className="text-amber-400 text-xs tracking-[0.4em] uppercase mb-3">What We Stand For</p>
            <h2 className="font-luxury text-4xl md:text-5xl text-white mb-12">Our Values</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { emoji: '🏺', title: 'Authentic Craft', desc: 'Every piece handmade by certified master weavers with decades of experience.' },
                { emoji: '✨', title: 'Premium Quality', desc: 'Only the finest materials — pure wool, silk, and cotton — sourced responsibly.' },
                { emoji: '🤝', title: 'Customer First', desc: 'Your satisfaction is our mission. From discovery to delivery and beyond.' },
              ].map((v, i) => (
                <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  className="glass-card p-10 text-center w-full sm:w-[300px] border border-amber-900/10 hover:border-amber-500/30 transition-colors">
                  <div className="text-5xl mb-6">{v.emoji}</div>
                  <h3 className="font-luxury text-2xl text-amber-400 mb-4">{v.title}</h3>
                  <p className="text-amber-100/50 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 sm:gap-20 py-16 border-y border-amber-900/20" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.02) 50%, transparent 100%)' }}>
            {[
              { number: '500+', label: 'Unique Designs' },
              { number: '10K+', label: 'Happy Customers' },
              { number: '25+', label: 'Years of Craft' },
              { number: '100%', label: 'Handmade' },
            ].map(s => (
              <div key={s.label} className="text-center min-w-[120px]">
                <div className="font-luxury text-5xl text-gold-gradient mb-2">{s.number}</div>
                <div className="text-amber-100/50 text-xs tracking-widest uppercase">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center pb-10">
            <h2 className="font-luxury text-4xl text-white mb-6">Ready to Find Your Perfect Carpet?</h2>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2 px-12 py-4 text-sm tracking-wider uppercase">
              Explore Collection <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
