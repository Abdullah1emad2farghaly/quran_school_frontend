import React, { forwardRef } from "react";


const Input = ({ userData, setUserData, id, label, Icon, className, error}) => {
    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className="block text-sm font-medium text-forest-900">
          {label}
        </label>

        <div className="relative">
          {Icon && (
            <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-forest-400">
              <Icon size={18} strokeWidth={1.75} />
            </span>
          )}

          <input
            placeholder="01012345678"
            onChange={(e) => setUserData({...userData, phone: e.target.value})}
            className={`w-full rounded-xl border bg-white px-4 py-3 pe-11 text-forest-900 placeholder:text-forest-300
              transition-colors duration-150
              ${error ? "border-red-400 focus:border-red-500" : "border-forest-200 focus:border-gold-500"}
              focus:outline-none focus:ring-2 ${error ? "focus:ring-red-100" : "focus:ring-gold-100"}
              ${className}`}
          />
        </div>

        {error && (
          <p id={`${id}-error`} role="alert" className="flex items-center gap-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  };

Input.displayName = "Input";
export default Input;
