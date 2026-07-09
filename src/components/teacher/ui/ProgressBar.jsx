export default function ProgressBar({ value, color = 'green', showLabel = true }) {
  const barColors = {
    green: 'bg-forest-500',
    gold: 'bg-gold-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
  };
  const getColor = (v) => {
    if (v >= 80) return 'green';
    if (v >= 60) return 'gold';
    return 'red';
  };
  const c = color === 'auto' ? getColor(value) : color;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${barColors[c]}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-semibold text-gray-600 w-9 text-left">{value}%</span>}
    </div>
  );
}
