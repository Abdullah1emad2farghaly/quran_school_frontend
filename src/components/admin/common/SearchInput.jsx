import React from "react";
import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 ps-9 pe-9 rounded-lg border border-line bg-white text-sm text-ink placeholder:text-ink-faint focus:border-primary transition"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition"
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
