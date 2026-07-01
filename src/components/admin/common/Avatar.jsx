import React from "react";

const PALETTE = [
  { bg: "#e3f1ec", fg: "#0a5448" },
  { bg: "#f6eed9", fg: "#96732d" },
  { bg: "#e6eef7", fg: "#2a5d8f" },
  { bg: "#fbe9e7", fg: "#b5483f" },
  { bg: "#fbeed9", fg: "#a86b16" },
];

function initials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function hashSeed(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 997;
  return h;
}

const SIZES = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-[13px]",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

export default function Avatar({ name, size = "md", className = "" }) {
  const palette = PALETTE[hashSeed(name) % PALETTE.length];
  return (
    <div
      className={`shrink-0 rounded-full flex items-center justify-center font-bold ${SIZES[size]} ${className}`}
      style={{ backgroundColor: palette.bg, color: palette.fg }}
    >
      {initials(name)}
    </div>
  );
}
