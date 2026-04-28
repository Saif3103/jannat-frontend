import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { useAuthStore, useCartStore, useSettingsStore, useUIStore } from '../../store';
import api from '../../api/axios';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const { settings } = useSettingsStore();
  const { isDarkMode, toggleDarkMode, isMobileMenuOpen, setMobileMenu, isSearchOpen, setSearchOpen } = useUIStore();

  const cartCount = items.reduce((a, i) => a + i.quantity, 0);

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
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'header-blur py-2' : 'bg-transparent py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          {settings?.logo ? (
            <img src={settings.logo} alt="Jannat Rugs Co." className="h-10 object-contain" />
          ) : (
            <div className="text-center">
              <div className="font-luxury text-gold-gradient text-2xl font-bold tracking-wider leading-none">
                JANNAT
              </div>
              <div className="text-xs tracking-[0.3em] text-amber-200/60 font-light leading-none mt-0.5">
                RUGS CO.
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm tracking-wider text-amber-100/80 hover:text-amber-400 transition-colors duration-200 uppercase font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button onClick={() => setSearchOpen(!isSearchOpen)} id="search-toggle"
            className="p-2 text-amber-100/70 hover:text-amber-400 transition-colors">
            <FiSearch size={20} />
          </button>

          {/* Dark/Light mode */}
          <button onClick={toggleDarkMode} id="theme-toggle"
            className="p-2 text-amber-100/70 hover:text-amber-400 transition-colors hidden md:flex">
            {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" id="wishlist-btn" className="p-2 text-amber-100/70 hover:text-amber-400 transition-colors hidden sm:flex">
            <FiHeart size={20} />
          </Link>

          {/* Cart */}
          <Link to="/cart" id="cart-btn" className="p-2 text-amber-100/70 hover:text-amber-400 transition-colors relative">
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} id="user-menu-btn"
                className="flex items-center gap-2 p-2 text-amber-100/70 hover:text-amber-400 transition-colors">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-amber-500/30" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-52 glass-card-dark rounded-xl overflow-hidden shadow-2xl"
                  >
                    <div className="p-3 border-b border-amber-900/30">
                      <p className="text-amber-100 font-medium text-sm">{user.name}</p>
                      <p className="text-amber-100/50 text-xs truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-amber-400 hover:bg-amber-500/10 text-sm transition-colors">
                        <FiSettings size={15} /> Admin Panel
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-amber-100/80 hover:bg-amber-500/10 text-sm transition-colors">
                      <FiUser size={15} /> My Dashboard
                    </Link>
                    <Link to="/dashboard?tab=orders" onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 text-amber-100/80 hover:bg-amber-500/10 text-sm transition-colors">
                      <FiPackage size={15} /> My Orders
                    </Link>
                    <button onClick={() => { logout(); setShowUserMenu(false); }}
                      className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 text-sm transition-colors w-full">
                      <FiLogOut size={15} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" id="login-btn"
              className="hidden sm:flex items-center gap-2 btn-outline-gold text-xs py-2 px-4">
              <FiUser size={14} /> Login
            </Link>
          )}

          {/* Mobile Menu */}
          <button onClick={() => setMobileMenu(!isMobileMenuOpen)} id="mobile-menu-btn"
            className="lg:hidden p-2 text-amber-100/70 hover:text-amber-400 transition-colors">
            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-amber-900/30 bg-black/50 backdrop-blur-xl"
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
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400">
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
                          <p className="text-amber-100 text-sm">{s.name}</p>
                          <p className="text-amber-400 text-xs">₹{(s.discountPrice || s.price).toLocaleString()}</p>
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
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(13,13,13,0.97)', top: '60px' }}
          >
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenu(false)}
                  className="text-lg text-amber-100/80 hover:text-amber-400 transition-colors py-3 border-b border-amber-900/30 font-luxury tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div className="mt-6 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setMobileMenu(false)} className="btn-gold text-center">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenu(false)} className="btn-outline-gold text-center">Register</Link>
                </div>
              ) : (
                <button onClick={() => { logout(); setMobileMenu(false); }}
                  className="mt-4 text-red-400 text-left text-sm flex items-center gap-2">
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
