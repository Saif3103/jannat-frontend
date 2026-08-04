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
    { id: 'home-spacer', center: true },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: WA_LINK,
      icon: FaWhatsapp,
      external: true,
      active: false,
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
        <div className="relative grid grid-cols-5 h-[58px] max-w-lg mx-auto px-1">
          {/* Center Home — elevated, no label */}
          <Link
            to="/"
            aria-label="Home"
            aria-current={homeActive ? 'page' : undefined}
            className="absolute left-1/2 -translate-x-1/2 -top-5 z-10 flex items-center justify-center"
          >
            <span
              className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] border-white shadow-[0_8px_22px_rgba(26,26,26,0.25)] transition-transform active:scale-95 ${
                homeActive
                  ? 'bg-[#1A1A1A] text-[#C9A84C] ring-2 ring-[#C9A84C]/30'
                  : 'bg-[#1A1A1A] text-white'
              }`}
            >
              <FiHome size={20} strokeWidth={2.2} />
            </span>
          </Link>

          {sideItems.map((item) => {
            if (item.center) {
              return <div key={item.id} className="pointer-events-none" aria-hidden="true" />;
            }

            const Icon = item.icon;
            const className = `flex flex-col items-center justify-center gap-0.5 min-w-0 transition-colors ${
              item.active ? 'text-[#1A1A1A]' : 'text-gray-400'
            }`;

            const content = (
              <>
                <Icon
                  size={item.external ? 21 : 20}
                  strokeWidth={item.active ? 2.3 : 1.8}
                  className={
                    item.external
                      ? 'text-[#25D366]'
                      : item.active
                        ? 'text-[#C9A84C]'
                        : ''
                  }
                />
                <span
                  className={`text-[10px] leading-none truncate max-w-full ${
                    item.active ? 'font-bold' : 'font-medium'
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
                aria-current={item.active ? 'page' : undefined}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
