import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function Team() {
  const teamMembers = [
    {
      name: 'Shahid Ali',
      role: 'Founder & CEO',
      description: 'Growing up surrounded by the profound historical tapestries and the rich textile heritage of India, Shahid developed an early and unyielding fascination with the intricate art of carpet weaving. He spent his formative years observing the mesmerizing rhythmic dance of generational artisans at their wooden looms, where threads were transformed into magnificent story-telling canvases. Deeply moved by their unwavering dedication, his profound respect for these master craftsmen became the catalyst for an ambitious dream. Shahid’s visionary approach sought to seamlessly bridge the gap between age-old traditional techniques and modern luxury aesthetics. Driven by this passion, he laid the foundation for Jannat Rugs Co. As the creative soul of the brand, he meticulously guides the design narrative, ensuring that every collection not only meets the pinnacle of luxury but also honors the soulful, time-tested heritage woven into every single knot.',
      image: '/uploads/team/sahana.jpg'
    },
    {
      name: 'Sazid Ali',
      role: 'Co-Founder & COO',
      description: 'With an uncompromising eye for absolute perfection and a profound understanding of structural craftsmanship, Sazid is the driving force that transforms creative visions into tangible, world-class masterpieces. Coming from a background rooted in meticulous quality control and operational excellence, Sazid ensures that the journey of a rug—from the initial sourcing of the finest raw silk and wool to the final rigorous inspection—is nothing short of flawless. He believes that true luxury lies in durability and the finer details that often go unnoticed by the untrained eye. Through his relentless dedication to operational precision and curation, Sazid guarantees that every single piece delivered by Jannat Rugs Co. stands as a timeless symbol of elegance, capable of becoming a treasured heirloom for generations to come.',
      image: '/uploads/team/saif.jpg'
    }
  ];

  return (
    <>
      <Helmet><title>Our Team | Jannat Rugs Co.</title></Helmet>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 text-center border-b border-amber-900/20 relative overflow-hidden flex flex-col items-center justify-center min-h-[50vh]" style={{ background: '#050505' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Extra spacer to push content strictly below the header */}
        <div className="h-24 md:h-32 w-full"></div>

        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-luxury text-5xl md:text-7xl lg:text-8xl text-white tracking-widest uppercase leading-snug"
          >
            The Visionary <br className="md:hidden" />
            <span className="text-amber-400">Team</span>
          </motion.h1>
        </div>
      </section>

      {/* Team Members (Carpet Couture 50-50 Split Style) */}
      <section className="flex flex-col w-full" style={{ background: '#0D0D0D' }}>
        {teamMembers.map((member, index) => (
          <div 
            key={member.name}
            className={`flex flex-col lg:flex-row w-full border-b border-amber-900/20 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
          >
            {/* Text Side (50%) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-32 bg-[#0A0A0A]">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-xl text-center lg:text-left"
              >
                <p className="text-amber-400 font-medium tracking-[0.4em] text-xs uppercase mb-4">Meet The</p>
                <h3 className="font-luxury text-5xl md:text-6xl text-white mb-4 uppercase tracking-widest">{member.name}</h3>
                <p className="text-amber-100/50 font-medium tracking-[0.2em] text-sm uppercase mb-10">{member.role}</p>
                <p className="text-amber-100/70 text-lg leading-loose font-light text-justify lg:text-left">
                  {member.description}
                </p>
              </motion.div>
            </div>
            
            {/* Image Side (50%) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative">
              <div className="absolute inset-0 bg-[#0D0D0D] opacity-50 pointer-events-none" />
              <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-tl-[80px] rounded-br-[80px] overflow-hidden border border-amber-900/30 shadow-2xl group z-10">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 hidden flex-col items-center justify-center text-amber-100/30 font-luxury text-2xl bg-amber-900/10 p-8 text-center border border-amber-900/20">
                  <span className="text-5xl mb-4 opacity-50">📷</span>
                  <span>Upload Image</span>
                  <span className="text-sm opacity-60 mt-2 font-sans tracking-widest">{member.image}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* The Story Section */}
      <section className="pt-24 pb-40 px-4 relative flex flex-col justify-center items-center" style={{ background: '#0D0D0D' }}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600166898405-da9535204843?w=1600&q=80')] opacity-5 bg-cover bg-center mix-blend-overlay pointer-events-none" />
        
        {/* Extra massive spacer to force the box down */}
        <div className="w-full h-40 md:h-64"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl w-full mx-auto relative z-10 text-center bg-[#050505] border border-amber-900/40 p-10 md:p-20 rounded-[40px] shadow-[0_0_60px_rgba(201,168,76,0.07)]"
        >
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent"></div>
          
          <h2 className="font-luxury text-4xl md:text-5xl text-amber-400 mb-8 tracking-wide">
            How It All Began
          </h2>
          
          <div className="w-16 h-px bg-amber-500/30 mx-auto mb-10"></div>
          
          <div className="space-y-6 text-amber-100/70 text-lg md:text-xl leading-relaxed font-light">
            <p className="text-center">
              The journey of <span className="text-amber-400 font-medium">Jannat Rugs Co.</span> began deep within the historic weaving heartlands of India. Driven by a passion to protect the fading magic of authentic, handmade carpets, Shahid Ali and Sazid Ali recognized that true luxury lies in the skilled hands of generational artisans. 
            </p>
            <p className="text-center">
              They traveled across remote villages, removing commercial middlemen to forge direct, empowering relationships with master weavers. By personally sourcing the finest premium wool and pure silk, they flawlessly fused ancient traditional motifs with sophisticated modern elegance. 
            </p>
            <p className="text-center">
              What started as a small, deeply passionate dream has now blossomed into a globally cherished luxury brand, delivering bespoke masterpieces that breathe unparalleled warmth and timeless art into your home.
            </p>
          </div>
        </motion.div>
      </section>

    </>
  );
}
