import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiSettings, FiTag, FiGift, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAuthStore } from '../../store';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: FiGrid },
  { label: 'Products', path: '/admin/products', icon: FiPackage },
  { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
  { label: 'Users', path: '/admin/users', icon: FiUsers },
  { label: 'Categories', path: '/admin/categories', icon: FiTag },
  { label: 'Offers', path: '/admin/offers', icon: FiGift },
  { label: 'Settings', path: '/admin/settings', icon: FiSettings },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0a' }}>
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: '#111', borderRight: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="p-6 border-b border-amber-900/20">
          <Link to="/" className="block">
            <div className="font-luxury text-gold-gradient text-2xl font-bold tracking-wider">JANNAT</div>
            <div className="text-xs tracking-[0.3em] text-amber-200/30 font-light">ADMIN PANEL</div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${pathname === path ? 'bg-amber-500/15 text-amber-400 border-l-2 border-amber-500' : 'text-amber-100/50 hover:text-amber-400 hover:bg-amber-500/5'}`}>
              <Icon size={17} />{label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-amber-900/20">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              {user?.name?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-amber-100 text-sm truncate">{user?.name}</p>
              <p className="text-amber-100/30 text-xs">Administrator</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400/70 hover:text-red-400 hover:bg-red-900/10 rounded-lg text-sm transition-colors">
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-amber-100/50 hover:text-amber-400 p-2">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <h1 className="text-amber-100/70 text-sm hidden lg:block">{navItems.find(n => n.path === pathname)?.label || 'Admin'}</h1>
          <Link to="/" target="_blank" className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors">← View Website</Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setOpen(false)} />}
    </div>
  );
}
