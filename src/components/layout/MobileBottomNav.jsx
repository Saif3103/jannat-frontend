import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiGrid, FiHome, FiPhone, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../store';

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  const profilePath = user ? '/dashboard' : '/login';
  const profileActive =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/wishlist') ||
    pathname === '/login' ||
    pathname === '/register';

  const items = [
    {
      id: 'shop',
      label: 'Shop',
      path: '/shop',
      icon: FiShoppingBag,
      active: pathname.startsWith('/shop') || pathname.startsWith('/product'),
    },
    {
      id: 'category',
      label: 'Category',
      path: '/categories',
      icon: FiGrid,
      active: pathname.startsWith('/categories'),
    },
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: FiHome,
      active: pathname === '/',
      center: true,
    },
    {
      id: 'contact',
      label: 'Contact',
      path: '/contact',
      icon: FiPhone,
      active: pathname.startsWith('/contact'),
    },
    {
      id: 'profile',
      label: user ? 'Profile' : 'Login',
      path: profilePath,
      icon: FiUser,
      active: profileActive,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[900]"
      aria-label="Main navigation"
    >
      <div className="bg-white/95 backdrop-blur-xl border-t border-black/[0.06] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="grid grid-cols-5 h-[62px] max-w-lg mx-auto px-1">
          {items.map(({ id, label, path, icon: Icon, active, center }) => {
            if (center) {
              return (
                <div key={id} className="relative flex items-end justify-center pb-1.5">
                  <Link
                    to={path}
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center w-[72px]"
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      className={`w-[54px] h-[54px] -mt-7 rounded-full flex items-center justify-center border-[3px] border-[#FAF7F2] shadow-[0_10px_28px_rgba(26,26,26,0.28)] transition-transform active:scale-95 ${
                        active
                          ? 'bg-[#1A1A1A] text-[#C9A84C] ring-2 ring-[#C9A84C]/35'
                          : 'bg-[#1A1A1A] text-white'
                      }`}
                    >
                      <Icon size={22} strokeWidth={2.2} />
                    </span>
                    <span
                      className={`mt-1 text-[10px] leading-none ${
                        active ? 'text-[#1A1A1A] font-bold' : 'text-gray-400 font-medium'
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={id}
                to={path}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-1 min-w-0 transition-colors ${
                  active ? 'text-[#1A1A1A]' : 'text-gray-400'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.3 : 1.8}
                  className={active ? 'text-[#C9A84C]' : ''}
                />
                <span
                  className={`text-[10px] leading-none truncate max-w-full ${
                    active ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
