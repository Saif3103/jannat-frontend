import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const REVIEWS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    initial: 'PS',
    comment:
      'Absolutely stunning carpet! The quality is exceptional and it transformed my living room into a palatial space. The colors are even more vibrant in person. Will definitely order again.',
  },
  {
    name: 'Rahul Gupta',
    location: 'Delhi',
    rating: 5,
    initial: 'RG',
    comment:
      'Jannat Rugs Co. delivers true luxury. My Persian rug arrived beautifully packaged and exceeded all expectations. The craftsmanship is world-class — every detail is perfect.',
  },
  {
    name: 'Ayesha Khan',
    location: 'Hyderabad',
    rating: 5,
    initial: 'AK',
    comment:
      'The craftsmanship is unparalleled. Every thread tells a story of generations of artisan mastery. Customer service was also impeccable from start to finish.',
  },
  {
    name: 'Vikram Mehta',
    location: 'Bangalore',
    rating: 5,
    initial: 'VM',
    comment:
      'Ordered a custom silk carpet with specific dimensions. The artisans are true masters of their craft. My home feels like a five-star hotel now! Highly recommended.',
  },
  {
    name: 'Anita Desai',
    location: 'Pune',
    rating: 5,
    initial: 'AD',
    comment:
      'The heritage collection took my breath away. Each piece is a work of art. As an interior designer, I now recommend Jannat Rugs to all my premium clients.',
  },
  {
    name: 'Rajesh Kapoor',
    location: 'Jaipur',
    rating: 5,
    initial: 'RK',
    comment:
      'Used Jannat Rugs for a luxury villa project. The bespoke service was extraordinary — custom colors, sizes, and patterns delivered perfectly on time. Exceptional quality.',
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <FiStar
          key={i}
          size={14}
          className={i < rating ? 'text-[#C9A96E]' : 'text-white/15'}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative py-20 sm:py-32 px-4 overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-[#C9A96E]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#C9A96E]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 sm:mb-20"
        >
          <p className="text-[#C9A96E] text-[10px] sm:text-xs font-bold tracking-[0.5em] uppercase mb-5 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-[#C9A96E]/50" />
            Client Stories
            <span className="w-8 h-px bg-[#C9A96E]/50" />
          </p>
          <h2 className="font-luxury text-4xl sm:text-5xl md:text-6xl text-white mb-6 leading-[1.1]">
            What Our Customers{' '}
            <span className="text-[#C9A96E] italic">Say</span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Real stories from homeowners and designers who transformed their spaces with Jannat Rugs.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet testimonial-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active testimonial-bullet-active',
            }}
            loop
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
            }}
            className="pb-14"
          >
            {REVIEWS.map((review, i) => (
              <SwiperSlide key={review.name}>
                <div className="group h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-[#C9A96E]/15 hover:border-[#C9A96E]/40 transition-all duration-500 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(201,169,110,0.08)] flex flex-col">
                  {/* Quote Mark */}
                  <div className="text-[#C9A96E]/20 text-5xl sm:text-6xl font-luxury leading-none mb-2 select-none">
                    &ldquo;
                  </div>

                  {/* Review Text */}
                  <p className="text-white/60 text-sm sm:text-[15px] leading-relaxed font-medium italic flex-1 mb-6">
                    {review.comment}
                  </p>

                  {/* Stars */}
                  <div className="mb-5">
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-[#C9A96E]/10 mb-5" />

                  {/* Customer Info */}
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#C9A96E] to-[#8A6D25] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(201,169,110,0.2)]">
                      <span className="text-white text-xs sm:text-sm font-bold tracking-wider">
                        {review.initial}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold tracking-wide">
                        {review.name}
                      </p>
                      <p className="text-white/30 text-[10px] sm:text-xs font-medium tracking-widest uppercase">
                        {review.location}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
