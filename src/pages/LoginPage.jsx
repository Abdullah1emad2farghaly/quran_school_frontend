import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandPanel from "../components/brand/BrandPanel";
import LoginForm from "../components/auth/LoginForm";
import Alert from "../components/ui/Alert";

export default function LoginPage() {
  const navigate = useNavigate();
  // const { login, isLoading, error } = useAuth();
  const [successRole, setSuccessRole] = useState(null);

  const isLoading = false;
  const error = ""

  return (
    <main className="min-h-screen bg-paperr-100 lg:grid lg:grid-cols-2">
      {/* Branding side — first on the page for an RTL reading order, hidden on small screens to keep the form front and center */}
      <div className="hidden lg:block">
        <BrandPanel />
      </div>
      

      {/* Form side */}
      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10 sm:px-8">
        {/* Compact brand header shown only on mobile/tablet, where the full panel is hidden */}
        <div className="mb-8 flex flex-col items-center text-center lg:hidden">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-800 text-gold-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
              <path
                d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M20 5.5c0-.83-.67-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </span>
          <h1 className="font-amiri text-2xl text-forest-900">روضة القرآن</h1>
          <p className="mt-1 text-sm text-forest-500">نظام إدارة حلقات تحفيظ القرآن الكريم</p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-forest-100 bg-white p-6 shadow-card sm:p-9">
          <div className="mb-7 text-center sm:text-start">
            <h2 className="text-xl font-bold text-forest-900 sm:text-2xl">مرحبًا بعودتك</h2>
            <p className="mt-1.5 text-sm text-forest-500">
              سجّل دخولك للمتابعة إلى لوحة التحكم الخاصة بك
            </p>
          </div>
          <LoginForm
            isLoading={isLoading}
            errorMessage={error}
          />
        </div>

        <p className="mt-6 text-xs text-forest-400">
          جميع الحقوق محفوظة © {new Date().getFullYear()} روضة القرآن
        </p>
      </div>
    </main>
  );
}
