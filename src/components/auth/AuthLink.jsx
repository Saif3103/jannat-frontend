import { Link } from 'react-router-dom';

/**
 * Text link with gold hover and underline slide.
 */
export default function AuthLink({ to, children, className = '', onClick, as = 'link' }) {
  const classes = [
    'auth-link relative inline-flex items-center text-sm text-[#A0A0A0]',
    'transition-colors duration-300 hover:text-[#E7C78A]',
    'focus-visible:outline-none focus-visible:text-[#E7C78A]',
    "after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left",
    'after:scale-x-0 after:bg-[#C9A96E] after:transition-transform after:duration-300',
    'hover:after:scale-x-100 focus-visible:after:scale-x-100',
    className,
  ].join(' ');

  if (as === 'button' || onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${classes} bg-transparent border-0 p-0 cursor-pointer`}
      >
        {children}
      </button>
    );
  }

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
}
