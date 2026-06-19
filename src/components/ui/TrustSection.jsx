import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { FiShield, FiTruck, FiAward, FiUsers, FiHeart, FiStar, FiCheckCircle } from 'react-icons/fi';

const TRUST_CARDS = [
  {
    icon: FiAward,
    title: '10+ Years of Excellence',
    desc: 'Over a decade of preserving India\'s rich weaving heritage with unmatched artistry.',
  },
  {
    icon: FiStar,
    title: 'Handcrafted Premium Rugs',
    desc: 'Every rug is hand-knotted by master artisans using centuries-old techniques.',
  },
  {
    icon: FiTruck,
    title: 'Secure Delivery Across India',
    desc: 'Premium packaging and trusted logistics to ensure your rug arrives in perfect condition.',
  },
  {
    icon: FiShield,
    title: 'Premium Quality Assurance',
    desc: 'Rigorous quality checks at every stage — from raw material to finished masterpiece.',
  },
  {
    icon: FiHeart,
    title: 'Customer Satisfaction',
    desc: 'Hundreds of delighted homeowners trust us for their premium flooring needs.',
  },
  {
    icon: FiUsers,
    title: 'Trusted by Designers',
    desc: 'Interior designers and luxury homeowners across India choose Jannat Rugs.',
  },
];

const STATS = [
  { value: 500, suffix: '+', label: 'Happy Customers' },
  { value: 1000, suffix: '+', label: 'Rugs Delivered' },
  { value: 10, suffix: '+', label: 'Years Experience' },
  { value: 100, suffix: '%', label: 'Handcrafted' },
];

function AnimatedCounter({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.8, 0.25, 1] },
  }),
};

export default function TrustSection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#C9A96E]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C9A96E]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A96E]/[0.02] rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-24"
        >
          <p className="text-[#C9A96E] text-[10px] sm:text-xs font-bold tracking-[0.5em] uppercase mb-5 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#C9A96E]/50" />
            Why Choose Us
            <span className="w-8 h-px bg-[#C9A96E]/50" />
          </p>
          <h2 className="font-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-[1.1]">
            Why India Trusts{' '}
            <span className="text-[#C9A96E] italic">Jannat Rugs</span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            From hand-spun wool to the final knot, every Jannat rug is a testament to generations of artisan mastery and uncompromising quality.
          </p>
        </motion.div>

        {/* Trust Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-20 sm:mb-28">
          {TRUST_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-[#C9A96E]/15 hover:border-[#C9A96E]/40 transition-all duration-500 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(201,169,110,0.08)]"
              >
                {/* Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#C9A96E]/10 flex items-center justify-center mb-5 group-hover:bg-[#C9A96E]/20 transition-colors duration-500">
                  <Icon className="text-[#C9A96E]" size={22} />
                </div>

                {/* Content */}
                <h3 className="text-white text-base sm:text-lg font-semibold mb-2 tracking-wide">
                  {card.title}
                </h3>
                <p className="text-white/35 text-xs sm:text-sm leading-relaxed font-medium">
                  {card.desc}
                </p>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#C9A96E]/5 to-transparent rounded-tr-2xl sm:rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        {/* Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl sm:rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-[#C9A96E]/20 p-8 sm:p-12"
        >
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#C9A96E]/5 via-transparent to-[#C9A96E]/5 pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 relative z-10">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <p className="text-[#C9A96E] font-luxury text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-white/40 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
