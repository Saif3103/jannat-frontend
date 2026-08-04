import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome, FiTag, FiShoppingBag, FiUsers, FiGrid, FiSpeaker,
  FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiFileText, FiExternalLink, FiMessageSquare
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import api from '../../api/axios';
import {
  connectSupportSocket,
} from '../../utils/supportSocket';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: FiHome },
  { label: 'Listings', path: '/admin/products', icon: FiTag },
  { label: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
  { label: 'Invoices', path: '/admin/invoices', icon: FiFileText },
  { label: 'Customers', path: '/admin/users', icon: FiUsers },
  { label: 'Categories', path: '/admin/categories', icon: FiGrid },
  { label: 'Marketing', path: '/admin/offers', icon: FiSpeaker },
  { label: 'Support', path: '/admin/support', icon: FiMessageSquare },
  { label: 'Settings', path: '/admin/settings', icon: FiSettings },
];

function getPageTitle(pathname) {
  if (pathname === '/admin') return 'Dashboard';
  const item = navItems.find((n) => n.path !== '/admin' && pathname.startsWith(n.path));
  return item?.label || 'Admin';
}

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [supportUnread, setSupportUnread] = useState(0);
  const { logout, user, token } = useAuthStore();
  const navigate = useNavigate();
  const title = getPageTitle(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    let mounted = true;
    const loadUnread = async () => {
      try {
        const { data } = await api.get('/support/admin/unread');
        if (mounted) setSupportUnread(data.unreadTotal || 0);
      } catch {
        /* ignore */
      }
    };
    loadUnread();
    const socket = connectSupportSocket({ token, isAdmin: true });
    socket.emit('join:admin');
    const onMessage = (payload) => {
      if (payload?.message?.sender === 'customer') loadUnread();
    };
    const onNotify = () => loadUnread();
    socket.on('message:new', onMessage);
    socket.on('conversation:new', onNotify);
    socket.on('notification:new', onNotify);
    const interval = setInterval(loadUnread, 60000);
    return () => {
      mounted = false;
      socket.off('message:new', onMessage);
      socket.off('conversation:new', onNotify);
      socket.off('notification:new', onNotify);
      clearInterval(interval);
    };
  }, [token]);

  const NavLink = ({ label, path, icon: Icon }) => {
    const isActive = pathname === path || (path !== '/admin' && pathname.startsWith(path));
    const showBadge = path === '/admin/support' && supportUnread > 0;
    return (
      <Link
        to={path}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[14px] transition-colors ${
          isActive
            ? 'bg-[#1A1A1A] text-white font-semibold shadow-sm'
            : 'text-gray-600 hover:bg-gray-100 hover:text-[#1A1A1A] font-medium'
        }`}
      >
        <Icon size={18} className={isActive ? 'text-[#C9A84C]' : 'text-gray-400'} />
        <span className="flex-1">{label}</span>
        {showBadge && (
          <span className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
            isActive ? 'bg-[#C9A84C] text-[#1A1A1A]' : 'bg-red-500 text-white'
          }`}>
            {supportUnread > 9 ? '9+' : supportUnread}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="admin-panel min-h-screen flex bg-[#F4F4F5] text-[#1A1A1A] font-sans text-left">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col bg-white border-r border-gray-200 sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link to="/admin" className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="w-9 h-9 rounded-full object-cover border border-[#C9A84C]/30" />
            <div>
              <p className="text-[15px] font-bold leading-tight">Jannat Rugs</p>
              <p className="text-[11px] text-gray-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.path} {...item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A] transition-colors"
          >
            <FiExternalLink size={15} />
            View storefront
          </Link>
          <div className="flex items-center justify-between gap-2 bg-[#FAF7F2] rounded-xl px-3 py-3 border border-[#C9A84C]/15">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-bold text-sm shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold truncate">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-gray-500">Owner</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { logout(); navigate('/login'); }}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-white transition-colors cursor-pointer"
              title="Logout"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-[300px] bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <p className="text-sm font-bold">Jannat Rugs</p>
              <p className="text-[10px] text-gray-400">Admin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 cursor-pointer"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.path} {...item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-gray-50 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-[#1A1A1A] cursor-pointer shrink-0"
                aria-label="Open menu"
              >
                <FiMenu size={20} />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-[#1A1A1A] truncate">{title}</h1>
                <p className="text-[11px] sm:text-xs text-gray-400 truncate">
                  Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <FiExternalLink size={13} />
                Store
              </Link>
              <div className="relative">
                <Link
                  to="/admin/support"
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#C9A84C] relative"
                  aria-label="Support notifications"
                >
                  <FiBell size={18} />
                  {supportUnread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {supportUnread > 9 ? '9+' : supportUnread}
                    </span>
                  )}
                </Link>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center text-[#1A1A1A] text-sm font-bold lg:hidden">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile bottom nav — quick access */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 safe-bottom">
          <div className="grid grid-cols-5 h-16">
            {[
              navItems[0],
              navItems[1],
              navItems[2],
              navItems.find((n) => n.path === '/admin/support'),
              navItems.find((n) => n.path === '/admin/settings'),
            ].filter(Boolean).map(({ label, path, icon: Icon }) => {
              const isActive = pathname === path || (path !== '/admin' && pathname.startsWith(path));
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
                    isActive ? 'text-[#1A1A1A]' : 'text-gray-400'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#C9A84C]' : ''} />
                  <span className="truncate max-w-[64px]">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
