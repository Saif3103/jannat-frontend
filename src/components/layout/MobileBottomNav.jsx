import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiGrid, FiHome, FiPhone, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../store';

const LEFT = [
  { label: 'Shop', path: '/shop', icon: FiShoppingBag, match: (p) => p.startsWith('/shop') || p.startsWith('/product') },
  { label: 'Category', path: '/categories', icon: FiGrid, match: (p) => p.startsWith('/categories') },
];

const RIGHT = [
  { label: 'Contact', path: '/contact', icon: FiPhone, match: (p) => p.startsWith('/contact') },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  const profilePath = user ? '/dashboard' : '/login';
  const profileActive =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/wishlist') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  const homeActive = pathname === '/';

  const NavItem = ({ label, path, icon: Icon, active }) => (
    <Link
      to={path}
      className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full pt-1 transition-colors ${
        active ? 'text-[#1A1A1A]' : 'text-gray-400'
      }`}
    >
      <Icon size={20} strokeWidth={active ? 2.25 : 1.75} className={active ? 'text-[#C9A84C]' : ''} />
      <span className={`text-[10px] font-medium truncate max-w-full ${active ? 'font-semibold' : ''}`}>
        {label}
      </span>
    </Link>
  );

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[900] pointer-events-none"
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto relative mx-auto max-w-lg">
        {/* Bar */}
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] safe-bottom-nav">
          <div className="grid grid-cols-5 h-[64px] items-end px-1">
            {LEFT.map((item) => (
              <NavItem
                key={item.path}
                {...item}
                active={item.match(pathname)}
              />
            ))}

            {/* Home — center elevated */}
            <div className="relative flex flex-col items-center justify-end h-full pb-1.5">
              <Link
                to="/"
                className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center"
                aria-label="Home"
              >
                <span
                  className={`w-[52px] h-[52px] rounded-full flex items-center justify-center border-4 border-[#F7F5F2] shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all ${
                    homeActive
                      ? 'bg-[#1A1A1A] text-[#C9A84C]'
                      : 'bg-[#1A1A1A] text-white'
                  }`}
                >
                  <FiHome size={22} strokeWidth={2.25} />
                </span>
                <span
                  className={`mt-1 text-[10px] font-semibold ${
                    homeActive ? 'text-[#1A1A1A]' : 'text-gray-400'
                  }`}
                >
                  Home
                </span>
              </Link>
              {/* spacer so grid cell keeps height */}
              <span className="opacity-0 text-[10px] select-none">Home</span>
            </div>

            {RIGHT.map((item) => (
              <NavItem
                key={item.path}
                {...item}
                active={item.match(pathname)}
              />
            ))}

            <NavItem
              label={user ? 'Profile' : 'Login'}
              path={profilePath}
              icon={FiUser}
              active={profileActive}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
