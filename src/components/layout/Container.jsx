/**
 * Shared page container — consistent horizontal alignment site-wide.
 * Mobile 94% · Tablet 90% · Desktop max 1280px · XL max 1400px
 */
export default function Container({ children, className = '', as: Tag = 'div', narrow = false }) {
  return (
    <Tag
      className={[
        narrow ? 'site-container-narrow' : 'site-container',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
