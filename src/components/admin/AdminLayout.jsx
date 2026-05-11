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
    <div className="admin-panel min-h-screen flex bg-[#F8F9FA] text-[#222222] font-sans">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 bg-white border-r border-gray-200 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-6 py-7 border-b border-gray-100">
          <Link to="/admin" className="font-bold text-xl text-[#222] tracking-tight">
            Shop Manager
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-500">
            <FiMenu size={22} />
          </button>
          <button className="hidden lg:block text-gray-400">
            <FiMenu size={22} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-6">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C9A84C] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm text-[#222] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]/40 transition-all"
            />
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path || (path !== '/admin' && pathname.startsWith(path));
            return (
              <Link key={label} to={path} onClick={() => setOpen(false)}
                className={`flex items-center gap-4 px-5 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-100 text-[#222] font-bold border border-gray-200' 
                    : 'text-gray-500 hover:text-[#222] hover:bg-gray-50'
                }`}>
                <Icon size={19} className={isActive ? 'text-[#C9A84C]' : ''} />
                {label}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto p-6 space-y-6 border-t border-gray-100">
          <div>
            <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-[0.2em]">Sales channels</p>
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 p-1">
                <img src="/logo.png" alt="" className="w-full h-full object-contain" 
                  onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=J&background=C9A84C&color=FFF' }} />
              </div>
              <span className="text-sm font-semibold text-gray-600">JannatRugsCo</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C9A84C] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-[#222] truncate max-w-[110px]">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-gray-400 font-medium">Owner</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-gray-400 hover:text-red-500 transition-colors p-2" title="Logout">
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-6 lg:px-10 py-5 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="lg:hidden text-[#222]">
              <FiMenu size={24} />
            </button>
            <div className="space-y-0.5">
              <h1 className="font-bold text-2xl text-[#222]">Dashboard</h1>
              <p className="text-gray-400 text-xs hidden sm:block">Welcome back, Admin!</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#C9A84C] transition-all">
                <FiBell size={20} />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A84C] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">5</span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <img src="/logo.png" alt="" className="w-full h-full object-contain" 
                 onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Admin&background=C9A84C&color=FFF' }} />
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 lg:px-10 py-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}
