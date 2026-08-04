import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { useAuthStore, useCartStore, useSettingsStore, useUIStore } from '../../store';
import api from '../../api/axios';
import Container from './Container';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { settings } = useSettingsStore();
  const { isDarkMode, toggleDarkMode, isMobileMenuOpen, setMobileMenuOpen, isSearchOpen, setSearchOpen } = useUIStore();

  const cartCount = (items || []).reduce((a, i) => a + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) { setSuggestions([]); return; }
      try {
        const { data } = await api.get(`/products/suggestions?q=${searchQuery}`);
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } catch {}
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'Offers', path: '/offers' },
    { label: 'About', path: '/about' },
    { label: 'Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ];

  // Scroll Lock for Mobile Menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'header-blur py-2' 
          : (isHome ? 'bg-transparent py-4' : 'header-blur py-4')
      }`}
    >
      <Container className="flex items-center justify-between h-16 md:h-20">
        
        {/* LEFT: Logo & Brand */}
        <div className="flex-1 flex items-center justify-start gap-3 md:gap-4 min-w-0">
           {/* Mobile Menu Button (Left aligned on mobile) */}
           <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} id="mobile-menu-btn"
            className="lg:hidden p-2 -ml-2 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors z-[110] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40 rounded-lg">
            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          <Link to="/" className="flex items-center gap-3 md:gap-4 group min-w-0">
            <img
              src="/logo.png"
              alt="Jannat Rugs Co."
              className="h-9 w-9 md:h-11 md:w-11 aspect-square rounded-full object-cover border border-[#C9A84C]/20 shadow-md group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-luxury text-sm md:text-xl text-gold-gradient tracking-[0.1em] font-bold leading-tight truncate">JANNAT RUGS CO.</span>
              <span className="text-[7px] md:text-[9px] text-black/60 tracking-[0.35em] uppercase font-bold hidden xs:block sm:block">Handmade Luxury Rugs</span>
            </div>
          </Link>
        </div>

        {/* CENTER: Navigation Links (Desktop Only) */}
        <nav className="hidden lg:flex items-center justify-center gap-7 xl:gap-9">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[11px] tracking-[0.18em] uppercase font-bold transition-all duration-300 whitespace-nowrap ${
                location.pathname === link.path ? 'text-[#1A1A1A]' : 'text-black/80 hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT: Action Icons */}
        <div className="flex-1 flex items-center justify-end gap-1 sm:gap-2 md:gap-3">
          {/* Search */}
          <button onClick={() => setSearchOpen(!isSearchOpen)} id="search-toggle"
            className="p-2 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40 rounded-lg">
            <FiSearch size={20} />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" id="wishlist-btn" className="p-2 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors hidden md:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40 rounded-lg">
            <FiHeart size={20} />
          </Link>

          {/* Cart */}
          <Link to="/cart" id="cart-btn" className="p-2 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40 rounded-lg">
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#C9A84C] text-black text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="w-px h-5 bg-amber-500/10 mx-0.5 hidden sm:block"></div>

          {/* User Profile */}
          <div className="relative">
            {user ? (
              <button onClick={() => setShowUserMenu(!showUserMenu)} id="user-menu-btn"
                className="flex items-center gap-2 p-1 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors border border-amber-900/20 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-[#1A1A1A] text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
            ) : (
              <Link to="/login" className="p-2 text-black/70 hover:text-[#1A1A1A] transition-colors border border-amber-900/10 rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40">
                <FiUser size={20} />
              </Link>
            )}

            <AnimatePresence>
              {showUserMenu && user && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  className="absolute right-0 top-full mt-4 w-72 bg-white rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-50 p-2"
                >
                  <div className="px-5 py-4 border-b border-gray-100 mb-1">
                    <p className="text-gray-900 font-bold text-base font-sans tracking-wide leading-tight">{user.name}</p>
                    <p className="text-gray-400 text-xs font-mono mt-1 break-all">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setShowUserMenu(false)} 
                        className="flex items-center gap-4 px-5 py-3.5 text-gray-800 hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] text-sm font-bold tracking-wider uppercase transition-all duration-200 rounded-xl"
                      >
                        <FiSettings size={18} /> Admin Panel
                      </Link>
                    )}
                    <Link 
                      to="/dashboard" 
                      onClick={() => setShowUserMenu(false)} 
                      className="flex items-center gap-4 px-5 py-3.5 text-gray-700 hover:bg-gray-50 text-sm font-bold tracking-wider uppercase transition-all duration-200 rounded-xl"
                    >
                      <FiUser size={18} /> My Profile
                    </Link>
                    <button 
                      onClick={() => { logout(); setShowUserMenu(false); }} 
                      className="flex items-center gap-4 px-5 py-3.5 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm font-bold tracking-wider uppercase transition-all duration-200 rounded-xl w-full text-left"
                    >
                      <FiLogOut size={18} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-amber-900/10 bg-[#FAF7F2]/95 backdrop-blur-xl"
          >
            <div className="max-w-2xl mx-auto px-4 py-4" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search luxury carpets & rugs..."
                  className="input-luxury pr-12"
                  autoFocus
                  id="search-input"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]">
                  <FiSearch size={20} />
                </button>
              </form>
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-4 right-4 glass-card-dark mt-2 rounded-xl overflow-hidden z-50"
                  >
                    {suggestions.map(s => (
                      <Link
                        key={s._id}
                        to={`/product/${s._id}`}
                        onClick={() => { setShowSuggestions(false); setSearchOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-amber-500/10 transition-colors"
                      >
                        <img src={s.images?.[0] || '/placeholder.jpg'} alt={s.name}
                          className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="text-[#1A1A1A] text-sm">{s.name}</p>
                          <p className="text-[#1A1A1A] text-xs">₹{(s.discountPrice || s.price).toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[90] lg:hidden bg-[#FAF7F2] backdrop-blur-3xl flex flex-col pt-28"
          >
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors py-3 border-b border-amber-900/10 font-luxury tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-gold text-center py-4">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-outline-gold text-center py-4">Register</Link>
                </div>
              ) : (
                <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="mt-4 text-red-400 text-left text-sm flex items-center gap-2 py-4">
                  <FiLogOut /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
