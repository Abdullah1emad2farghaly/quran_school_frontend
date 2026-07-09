export default function PageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              <span className={i === breadcrumb.length - 1 ? 'text-forest-700 font-medium' : ''}>{b}</span>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-forest-900">{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}
