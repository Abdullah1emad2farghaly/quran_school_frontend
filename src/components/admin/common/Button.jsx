import React from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-dark active:bg-primary-darker shadow-sm",
  secondary: "bg-white text-ink border border-line hover:bg-line-soft active:bg-line",
  ghost: "bg-transparent text-ink-soft hover:bg-line-soft hover:text-ink",
  danger: "bg-rose text-white hover:bg-rose/90",
  dangerGhost: "bg-transparent text-rose hover:bg-rose-soft",
  gold: "bg-gold text-white hover:bg-gold-dark shadow-sm",
};

const SIZES = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}
