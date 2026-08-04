import { Link } from 'react-router-dom';

/**
 * Centered footer links under the auth form.
 */
export default function AuthFooter({ children }) {
  return (
    <div className="mt-5 flex flex-col items-center gap-5 text-center">
      {children}
    </div>
  );
}

export function AuthFooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm text-[#A5A5A5] transition-colors duration-300 hover:text-[#C9A96E] focus-visible:outline-none focus-visible:text-[#C9A96E]"
    >
      {children}
    </Link>
  );
}

export function AuthFooterText({ children }) {
  return <p className="text-sm text-[#A5A5A5]">{children}</p>;
}

export function AuthInlineLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-[#C9A96E] transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:underline"
    >
      {children}
    </Link>
  );
}
