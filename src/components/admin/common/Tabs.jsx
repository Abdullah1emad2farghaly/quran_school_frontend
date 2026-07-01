import React from "react";

export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center overflow-hidden gap-1 border-b border-line overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
            active === tab.key ? "text-primary" : "text-ink-faint hover:text-ink"
          }`}
        >
          {tab.label}
          {active === tab.key && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary rounded-full" />}
        </button>
      ))}
    </div>
  );
}
