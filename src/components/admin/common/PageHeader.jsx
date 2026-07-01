import React from "react";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
      <div>
        <h1 className="text-[22px] font-extrabold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-faint mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
    </div>
  );
}
