import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiTag, FiShoppingBag, FiUsers, FiGrid, FiSpeaker, FiSettings, FiLogOut, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useAuthStore } from '../../store';

const navItems = [
  { label: 'Search', path: '#', icon: FiSearch, isAction: true },
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
    <div className="min-h-screen flex bg-white text-[#222222] font-sans">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 bg-white border-r border-[#E0E0E0] ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#E0E0E0]">
          <Link to="/admin" className="font-bold text-[17px] tracking-tight">
            Shop Manager
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-500 p-1">
            <FiMenu size={20} />
          </button>
          <button className="hidden lg:block text-gray-500 p-1">
            <FiMenu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon, isAction }) => (
            <Link key={label} to={path} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-[14px] transition-colors ${
                pathname === path || (path !== '#' && pathname.startsWith(path) && path !== '/admin')
                  ? 'bg-gray-100 font-semibold text-[#222]' 
                  : 'text-[#595959] hover:bg-gray-50'
              }`}>
              <Icon size={18} className={pathname === path ? 'text-[#222]' : 'text-[#595959]'} />
              {label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-[#E0E0E0]">
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Sales channels</p>
            <div className="flex items-center gap-2 px-2 text-sm text-[#222]">
              <div className="w-5 h-5 bg-[#F4511E] text-white flex items-center justify-center rounded font-serif font-bold text-xs">E</div>
              <span className="font-medium">JannatRugsCo</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                {user?.name?.[0]}
              </div>
              <p className="text-sm text-gray-700 truncate max-w-[100px]">{user?.name}</p>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-gray-400 hover:text-red-500" title="Logout">
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden bg-[#F8F9FA]">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-[#E0E0E0]">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="text-gray-600">
              <FiMenu size={22} />
            </button>
            <span className="font-bold text-[17px]">Shop Manager</span>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}
