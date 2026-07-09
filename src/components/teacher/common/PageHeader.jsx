export default function PageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="mb-6">
      {breadcrumb && <p className="text-sm text-forest-400 mb-1">{breadcrumb}</p>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}