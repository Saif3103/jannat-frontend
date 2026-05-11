import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiTag, FiShoppingBag, FiUsers, FiGrid, FiSpeaker, FiSettings, FiLogOut, FiMenu, FiX, FiSearch, FiBell } from 'react-icons/fi';
import { useState } from 'react';
import { useAuthStore } from '../../store';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: FiHome },
  { label: 'Listings', path: '/admin/products', icon: FiTag },
  { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
  { label: 'Customers', path: '/admin/users', icon: FiUsers },
  { label: 'Categories', path: '/admin/categories', icon: FiGrid },
  { label: 'Marketing', path: '/admin/offers', icon: FiSpeaker },
  { label: 'Settings', path: '/admin/settings', icon: FiSettings },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="admin-panel min-h-screen flex bg-[#0D0D0D] text-white font-sans selection:bg-[#C9A84C]/30">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 bg-[#0D0D0D] border-r border-white/5 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-6 py-7">
          <Link to="/admin" className="font-semibold text-xl text-white tracking-tight flex items-center gap-2">
            Shop Manager
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
            <FiMenu size={22} />
          </button>
          <button className="hidden lg:block text-[#C9A84C]">
            <FiMenu size={22} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 mb-8">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#C9A84C] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#151515] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40 transition-all"
            />
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path || (path !== '/admin' && pathname.startsWith(path));
            return (
              <Link key={label} to={path} onClick={() => setOpen(false)}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C9A84C]/5 text-[#C9A84C] border border-[#C9A84C]/20 shadow-[0_0_20px_rgba(201,168,76,0.05)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <Icon size={20} className={isActive ? 'text-[#C9A84C]' : ''} />
                {label}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto p-6 space-y-8">
          <div>
            <p className="text-[10px] font-bold text-[#C9A84C] mb-5 uppercase tracking-[0.25em] opacity-80">Sales channels</p>
            <div className="flex items-center gap-3 px-1 group cursor-pointer">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shadow-lg transition-transform group-hover:scale-110">
                <img src="/logo.png" alt="" className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=J&background=C9A84C&color=000' }} />
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">JannatRugsCo</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#151515]/50 backdrop-blur-sm p-4 rounded-2xl border border-white/5 shadow-xl group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C9A84C] flex items-center justify-center text-black font-bold text-sm shadow-lg group-hover:rotate-12 transition-transform">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate max-w-[110px] leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">Shop Owner</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-gray-500 hover:text-red-400 transition-colors p-2" title="Logout">
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-xl px-6 lg:px-10 py-6 flex items-center justify-between border-b border-white/[0.02]">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="lg:hidden text-white p-2 -ml-2">
              <FiMenu size={24} />
            </button>
            <div className="space-y-0.5">
              <h1 className="font-luxury text-3xl text-white tracking-tight font-medium">Dashboard</h1>
              <p className="text-gray-500 text-sm hidden sm:block font-medium">Welcome back, Admin! Here's what's happening.</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-[#151515] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#C9A84C] group-hover:border-[#C9A84C]/20 transition-all shadow-lg">
                <FiBell size={22} />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A84C] text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0D0D0D] shadow-xl">5</span>
            </div>
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/5 hover:border-[#C9A84C]/50 transition-all cursor-pointer shadow-xl">
              <img src="/logo.png" alt="" className="w-full h-full object-cover" 
                 onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Admin&background=C9A84C&color=000' }} />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 lg:px-10 py-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-all duration-500" onClick={() => setOpen(false)} />}
    </div>
  );
}
