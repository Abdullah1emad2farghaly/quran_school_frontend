import React from "react";

export function Field({ label, required, error, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-[13px] font-semibold text-ink-soft mb-1.5">
          {label}
          {required && <span className="text-rose ms-0.5">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="block text-xs text-ink-faint mt-1">{hint}</span>}
      {error && <span className="block text-xs text-rose mt-1">{error}</span>}
    </label>
  );
}

const baseInputClass =
  "w-full h-10 px-3 rounded-lg border border-line bg-white text-sm text-ink placeholder:text-ink-faint transition focus:border-primary disabled:bg-line-soft disabled:text-ink-faint";

export function TextInput({ className = "", error, ...rest }) {
  return <input value='' className={`${baseInputClass} ${error ? "border-rose" : ""} ${className}`} {...rest} />;
}

export function TextArea({ className = "", error, rows = 3, ...rest }) {
  return (
    <textarea
      rows={rows}
      className={`${baseInputClass} h-auto py-2.5 resize-none ${error ? "border-rose" : ""} ${className}`}
      {...rest}
    />
  );
}

export function Select({ className = "", error, children, ...rest }) {
  return (
    <select
      className={`${baseInputClass} appearance-none bg-no-repeat pe-9 cursor-pointer bg-[position:right_0.65rem_center] rtl:bg-[position:left_0.65rem_center] ${error ? "border-rose" : ""} ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237c857f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
        backgroundSize: "16px",
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
