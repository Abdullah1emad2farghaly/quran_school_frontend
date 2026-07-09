export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-forest-100 text-forest-700',
    gold: 'bg-yellow-100 text-yellow-700',
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`badge ${variants[variant] || variants.default}`}>{children}</span>
  );
}
