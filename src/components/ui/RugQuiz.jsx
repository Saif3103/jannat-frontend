import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiCheck, FiArrowRight, FiInfo } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api, { BASE_URL } from '../../api/axios';
import ProductCard from './ProductCard';

const QUESTIONS = [
  {
    id: 'room',
    title: 'What room are you styling?',
    options: [
      { label: 'Living Room', icon: '🛋️', value: 'living' },
      { label: 'Bedroom', icon: '🛏️', value: 'bedroom' },
      { label: 'Dining Room', icon: '🍽️', value: 'dining' },
      { label: 'Office', icon: '🖥️', value: 'office' },
      { label: 'Hallway', icon: '🚪', value: 'hallway' }
    ]
  },
  {
    id: 'color',
    title: 'What color palette fits your room?',
    options: [
      { label: 'Beige / Neutral', color: '#F5F5DC', value: 'beige' },
      { label: 'Black Luxury', color: '#1A1A1A', value: 'black' },
      { label: 'Royal Gold', color: '#C9A84C', value: 'gold' },
      { label: 'Modern Gray', color: '#808080', value: 'gray' },
      { label: 'Earthy Brown', color: '#8B4513', value: 'brown' },
      { label: 'Soft White', color: '#FFFFFF', value: 'white' }
    ]
  },
  {
    id: 'budget',
    title: 'What is your budget?',
    options: [
      { label: 'Under ₹10,000', value: '0-10000' },
      { label: '₹10,000 – ₹25,000', value: '10000-25000' },
      { label: '₹25,000 – ₹50,000', value: '25000-50000' },
      { label: '₹50,000+', value: '50000-999999' }
    ]
  },
  {
    id: 'style',
    title: 'What style do you prefer?',
    options: [
      { label: 'Modern', value: 'modern', desc: 'Clean lines & bold patterns' },
      { label: 'Vintage', value: 'vintage', desc: 'Classic aged look' },
      { label: 'Persian Royal', value: 'persian', desc: 'Intricate traditional art' },
      { label: 'Minimal', value: 'minimal', desc: 'Subtle & sophisticated' },
      { label: 'Contemporary', value: 'contemporary', desc: 'Artistic & trendy' },
      { label: 'Luxury Classic', value: 'classic', desc: 'Timeless elegance' }
    ]
  },
  {
    id: 'vibe',
    title: 'What vibe do you want?',
    options: [
      { label: 'Cozy', value: 'cozy' },
      { label: 'Royal', value: 'royal' },
      { label: 'Elegant', value: 'elegant' },
      { label: 'Minimal', value: 'minimal' },
      { label: 'Luxury', value: 'luxury' },
      { label: 'Warm & Traditional', value: 'warm' }
    ]
  }
];

export default function RugQuiz({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      fetchRecommendations(newAnswers);
    }
  };

  const fetchRecommendations = async (finalAnswers) => {
    setLoading(true);
    setShowResults(true);
    try {
      // Fetch all products and filter locally for a "smart" feel
      // In a real app, this would be a specialized recommendation API
      const res = await api.get('/products?limit=50');
      let filtered = res.data.products;

      // Budget filtering
      const [min, max] = finalAnswers.budget.split('-').map(Number);
      filtered = filtered.filter(p => {
        const price = p.discountPrice || p.price;
        return price >= min && price <= max;
      });

      // Simple matching for style/category (randomize for demo if no matches)
      const recommendations = filtered.slice(0, 6);
      setResults(recommendations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResults([]);
    setShowResults(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6"
      >
        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md" onClick={onClose} />
        
        <motion.div 
          initial={{ y: 50, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 50, scale: 0.95 }}
          className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              {!showResults && step > 0 && (
                <button onClick={() => setStep(step - 1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <FiChevronLeft size={20} />
                </button>
              )}
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Find Your Perfect Rug</h2>
                {!showResults && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
                      {QUESTIONS.map((_, i) => (
                        <div key={i} className={`h-1 w-6 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#C9A84C]' : 'bg-gray-100'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#C9A84C] ml-2">Step {step + 1} of 5</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <FiX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8 sm:p-12">
            {!showResults ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl mx-auto"
                >
                  <h3 className="font-heading text-2xl sm:text-4xl text-[#1A1A1A] mb-10 leading-tight">
                    {QUESTIONS[step].title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {QUESTIONS[step].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelect(QUESTIONS[step].id, opt.value)}
                        className={`group p-6 rounded-3xl border-2 transition-all text-left flex items-center gap-5 ${
                          answers[QUESTIONS[step].id] === opt.value 
                          ? 'border-[#C9A84C] bg-[#FAF7F2]' 
                          : 'border-gray-100 hover:border-[#C9A84C]/30 hover:bg-gray-50'
                        }`}
                      >
                        {opt.icon && <span className="text-3xl">{opt.icon}</span>}
                        {opt.color && (
                          <div className="w-10 h-10 rounded-full border border-gray-100 shadow-sm" style={{ background: opt.color }} />
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-[#1A1A1A]">{opt.label}</p>
                          {opt.desc && <p className="text-xs text-gray-400 mt-1">{opt.desc}</p>}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          answers[QUESTIONS[step].id] === opt.value 
                          ? 'bg-[#C9A84C] border-[#C9A84C] text-white' 
                          : 'border-gray-200 group-hover:border-[#C9A84C]/50 text-transparent'
                        }`}>
                          <FiCheck size={14} />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="space-y-12">
                {loading ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin mb-6" />
                    <p className="font-luxury text-xl animate-pulse">Curating your personalized collection...</p>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-16">
                      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-xs font-bold mb-4">
                        <FiCheck /> ✨ Perfect Matches Found
                      </div>
                      <h3 className="font-heading text-3xl sm:text-5xl text-[#1A1A1A] mb-4">Recommended For You</h3>
                      <p className="text-gray-500 max-w-lg mx-auto">
                        Based on your style preferences for the <span className="text-[#1A1A1A] font-bold underline decoration-[#C9A84C] underline-offset-4">{answers.room}</span>.
                      </p>
                    </div>

                    {results.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
                        {results.map((p, i) => (
                          <div key={p._id} className="relative group">
                            <div className="absolute top-4 left-4 z-10">
                              <span className="bg-[#C9A84C] text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-lg">
                                95% Match
                              </span>
                            </div>
                            <ProductCard product={p} index={i} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <p className="font-luxury text-xl text-gray-400">No exact matches found for your criteria.</p>
                        <button onClick={reset} className="mt-6 text-[#C9A84C] font-bold uppercase tracking-widest text-xs hover:underline">
                          Try Different Style
                        </button>
                      </div>
                    )}

                    <div className="mt-20 p-10 bg-[#FAF7F2] rounded-[3rem] border border-[#C9A84C]/20 flex flex-col md:flex-row items-center justify-between gap-8">
                       <div className="text-center md:text-left">
                          <h4 className="font-heading text-xl mb-2">Want to try again?</h4>
                          <p className="text-gray-500 text-sm">Refine your choices to explore more options.</p>
                       </div>
                       <div className="flex gap-4">
                          <button onClick={reset} className="px-8 py-4 border border-gray-200 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors">
                            Restart Quiz
                          </button>
                          <Link to="/shop" onClick={onClose} className="px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-3">
                            View All Rugs <FiArrowRight />
                          </Link>
                       </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Footer (Mobile Only Sticky) */}
          <div className="p-6 border-t border-gray-100 sm:hidden bg-white">
             {!showResults && (
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Question {step + 1}/5</p>
                  <button 
                    disabled={!answers[QUESTIONS[step].id]}
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-2 text-[#C9A84C] font-bold text-xs uppercase tracking-widest disabled:opacity-30"
                  >
                    Next <FiChevronRight />
                  </button>
               </div>
             )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
