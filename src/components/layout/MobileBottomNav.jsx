import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiGrid, FiHome, FiUser } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuthStore } from '../../store';

const WA_LINK =
  'https://wa.me/919235508422?text=Hello%20Jannat%20Rugs%20Co.%2C%20I%27m%20interested%20in%20your%20carpets!';

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuthStore();

  const profilePath = user ? '/dashboard' : '/login';
  const profileActive =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/wishlist') ||
    pathname === '/login' ||
    pathname === '/register';

  const homeActive = pathname === '/';

  const sideItems = [
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
      id: 'whatsapp',
      label: 'WhatsApp',
      href: WA_LINK,
      icon: FaWhatsapp,
      external: true,
    },
    {
      id: 'profile',
      label: user ? 'Profile' : 'Login',
      path: profilePath,
      icon: FiUser,
      active: profileActive,
    },
  ];

  const left = sideItems.slice(0, 2);
  const right = sideItems.slice(2);

  const renderSide = (item) => {
    const Icon = item.icon;
    const active = !!item.active;
    const className = `flex flex-col items-center justify-center gap-0.5 min-w-0 h-full transition-colors ${
      active ? 'text-[#1A1A1A]' : 'text-gray-400'
    }`;

    const content = (
      <>
        <Icon
          size={item.external ? 23 : 22}
          strokeWidth={active ? 2.3 : 1.9}
          className={
            item.external ? 'text-[#25D366]' : active ? 'text-[#C9A84C]' : ''
          }
        />
        <span
          className={`text-[10px] leading-none truncate max-w-full ${
            active ? 'font-bold text-[#1A1A1A]' : 'font-medium'
          }`}
        >
          {item.label}
        </span>
      </>
    );

    if (item.external) {
      return (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className={className}
          aria-label="WhatsApp"
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path}
        aria-current={active ? 'page' : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[900]"
      aria-label="Main navigation"
    >
      <div className="relative bg-white/95 backdrop-blur-xl border-t border-black/[0.06] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom,0px)]">
        {/* Raised 3D home — centered above bar */}
        <Link
          to="/"
          aria-label="Home"
          aria-current={homeActive ? 'page' : undefined}
          className="absolute left-1/2 -translate-x-1/2 -top-6 z-10 flex flex-col items-center"
        >
          <span
            className={`w-[54px] h-[54px] rounded-full flex items-center justify-center border-[3px] border-white transition-transform ${
              homeActive ? 'scale-105' : ''
            }`}
            style={{
              background:
                'linear-gradient(145deg, #E8D5A3 0%, #C9A84C 45%, #B69640 70%, #8A6D25 100%)',
              boxShadow:
                '0 8px 20px rgba(182, 150, 64, 0.45), 0 2px 4px rgba(0,0,0,0.12), inset 0 2px 3px rgba(255,255,255,0.55), inset 0 -3px 6px rgba(138,109,37,0.35)',
            }}
          >
            <FiHome
              size={24}
              strokeWidth={2.4}
              className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
            />
          </span>
        </Link>

        <div className="grid grid-cols-5 h-[64px] max-w-lg mx-auto px-1 items-center">
          {left.map(renderSide)}
          {/* Center spacer for home button + label */}
          <div className="flex flex-col items-center justify-end h-full pb-2 min-w-0 pointer-events-none">
            <span
              className={`text-[10px] leading-none ${
                homeActive ? 'font-bold text-[#1A1A1A]' : 'font-medium text-gray-400'
              }`}
            >
              Home
            </span>
          </div>
          {right.map(renderSide)}
        </div>
      </div>
    </nav>
  );
}
