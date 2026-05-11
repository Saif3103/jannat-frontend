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
    <div className="admin-panel min-h-screen flex bg-[#0D0D0D] text-white font-sans">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 bg-[#0D0D0D] border-r border-white/5 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-6">
          <Link to="/admin" className="font-luxury text-xl text-white tracking-tight">
            Shop Manager
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-500">
            <FiMenu size={22} />
          </button>
          <button className="hidden lg:block text-gray-500">
            <FiMenu size={22} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 mb-6">
          <div className="relative group">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#C9A84C] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#151515] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C9A84C]/50 transition-all"
            />
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path || (path !== '/admin' && pathname.startsWith(path));
            return (
              <Link key={label} to={path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 shadow-[0_0_15px_rgba(201,168,76,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <Icon size={19} />
                {label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-white/5 space-y-6">
          <div>
            <p className="text-[10px] font-bold text-[#C9A84C] mb-4 uppercase tracking-[0.2em]">Sales channels</p>
            <div className="flex items-center gap-3 px-1">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#F4511E] to-[#D84315] p-1 flex items-center justify-center">
                <img src="/logo192.png" alt="" className="w-full h-full object-contain brightness-0 invert" 
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<span class="text-[10px] font-bold">J</span>' }} />
              </div>
              <span className="text-sm font-medium text-gray-300">JannatRugsCo</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#151515] p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold text-sm">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate max-w-[100px]">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Owner</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-gray-500 hover:text-[#C9A84C] transition-colors p-2" title="Logout">
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header (Desktop + Mobile title) */}
        <header className="sticky top-0 z-40 bg-[#0D0D0D]/80 backdrop-blur-md px-6 lg:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="lg:hidden text-white">
              <FiMenu size={24} />
            </button>
            <div>
              <h1 className="font-luxury text-3xl text-white tracking-tight">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1 hidden sm:block">Welcome back, Admin! Here's what's happening.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[#151515] border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-all">
                <FiBell size={20} />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A84C] text-black text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0D0D0D]">5</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#151515] border border-white/5 p-1">
              <img src="/logo192.png" alt="" className="w-full h-full object-contain brightness-0 invert" 
                 onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Admin&background=C9A84C&color=000' }} />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 lg:px-10 pb-10">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}
