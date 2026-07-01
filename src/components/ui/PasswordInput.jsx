import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({setUserData, userData, error}) => {
  const [visible, setVisible] = useState(false);
  // console.log(error)
  return (
    <div className="space-y-1.5">

      <label htmlFor="password" >كلمة المرور</label>
      <div className="relative">
        <input
          id="password"
          onChange={(e)=> setUserData({...userData, password: e.target.value})}
          placeholder="••••••••"
          type={visible ? "text" : "password"}
          className={`w-full rounded-xl border bg-white px-4 py-3 pe-11 text-forest-900 placeholder:text-forest-300
            transition-colors duration-150
            ${error ? "border-red-400 focus:border-red-500" : "border-forest-200 focus:border-gold-500"}
            focus:outline-none focus:ring-2 ${error ? "focus:ring-red-100" : "focus:ring-gold-100"}`}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          aria-pressed={visible}
          className="absolute inset-y-0 end-3 flex items-center text-forest-400 hover:text-forest-700 transition-colors"
        >
          {visible ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
        </button>
      </div>

      {error && (
        <p  role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
