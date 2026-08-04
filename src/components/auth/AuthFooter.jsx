import { Link } from 'react-router-dom';

export default function AuthFooter({ children }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 text-center">
      {children}
    </div>
  );
}

export function AuthFooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm text-[#1A1A1A]/45 transition-colors duration-300 hover:text-[#B69640] focus-visible:outline-none focus-visible:text-[#B69640]"
    >
      {children}
    </Link>
  );
}

export function AuthFooterText({ children }) {
  return <p className="text-sm text-[#1A1A1A]/50">{children}</p>;
}

export function AuthInlineLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-[#B69640] font-semibold transition-colors duration-300 hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:underline"
    >
      {children}
    </Link>
  );
}
