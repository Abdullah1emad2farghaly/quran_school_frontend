export default function StatCard({ label, value, icon: Icon, sub, color = 'forest' }) {
  const colors = {
    forest: { bg: 'bg-forest-700', light: 'bg-forest-50', text: 'text-forest-700' },
    gold: { bg: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-700' },
    blue: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700' },
    purple: { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-700' },
  };
  const c = colors[color] || colors.forest;
  return (
    <div className="card flex items-center gap-4">
      <div className={`${c.light} p-3 rounded-xl`}>
        {Icon && <Icon size={24} className={c.text} />}
      </div>
      <div>
        <p className="text-2xl font-bold text-forest-900">{value}</p>
        <p className="text-sm text-forest-500">{label}</p>
        {sub && <p className="text-xs text-forest-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
