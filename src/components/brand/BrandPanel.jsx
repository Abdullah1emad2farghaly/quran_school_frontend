import React from "react";
import { BookOpenText } from "lucide-react";

function StarWatermark({ className }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
      <rect
        x="40"
        y="40"
        width="120"
        height="120"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(0 100 100)"
      />
      <rect
        x="40"
        y="40"
        width="120"
        height="120"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(45 100 100)"
      />
    </svg>
  );
}

export default function BrandPanel() {
  const roleEntries = ['مدير', 'معلم', 'ولي أمر', 'محصل'];

  return (
    <div className="relative isolate flex flex-col justify-between overflow-hidden bg-forest-900 px-8 py-10 text-paperr-50 sm:px-12 sm:py-14 lg:h-full lg:px-14">
      {/* Subtle repeating star texture across the whole panel */}
      <div className="absolute inset-0 bg-star-pattern opacity-40" aria-hidden="true" />

      {/* Large watermark star anchored behind the content */}
      <StarWatermark className="pointer-events-none absolute -end-16 -top-16 h-72 w-72 text-gold-500/10 sm:h-96 sm:w-96" />

      {/* Top: emblem + name */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/40 bg-forest-800/60 text-gold-400 shadow-inner">
            <BookOpenText size={26} strokeWidth={1.75} />
          </span>
          <div>
            <h1 className="font-amiri text-3xl leading-none text-gold-200 sm:text-4xl">روضة القرآن</h1>
            <p className="mt-1 text-xs tracking-wide text-forest-200 sm:text-sm">
              نظام إدارة حلقات تحفيظ القرآن الكريم
            </p>
          </div>
        </div>
      </div>

      {/* Middle: welcome message */}
      <div className="relative z-10 mt-10 max-w-sm lg:mt-0">
        <p className="text-lg font-semibold leading-relaxed text-paperr-50 sm:text-xl">
          منصّة واحدة تجمع الإدارة والمعلمين وأولياء الأمور
        </p>
        <p className="mt-3 text-sm leading-loose text-forest-200">
          تابع حفظ الطلاب، الحضور، والمستحقات المالية بسهولة وأمان — في مكان واحد موثوق.
        </p>
      </div>

      {/* Bottom: the four entry points — a real, finite set, so labeling each is informative */}
      <div className="relative z-10 mt-10 lg:mt-0">
        <p className="mb-3 text-xs font-medium text-forest-300">بوابة دخول مخصّصة لكل دور في المدرسة</p>
        <ul className="flex flex-wrap gap-2">
          {roleEntries.map((label) => (
            <li
              key={label}
              className="rounded-full border border-gold-500/30 bg-forest-800/50 px-3.5 py-1.5 text-xs font-medium text-gold-100"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
