import React from "react";

export function TableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-line-soft">
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-4 py-3.5">
              <div
                className="skeleton-surface animate-shimmer h-3.5 rounded"
                style={{ width: `${50 + ((r + c) % 4) * 12}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function CardSkeleton({ className = "" }) {
  return <div className={`skeleton-surface animate-shimmer rounded-xl ${className}`} />;
}

export function LineSkeleton({ width = "100%", height = "0.875rem", className = "" }) {
  return <div className={`skeleton-surface animate-shimmer rounded ${className}`} style={{ width, height }} />;
}
