import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import Button from "../components/admin/common/Button";

export default function NotFoundPage() {
  const { lang } = useI18n();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary-soft text-primary-dark flex items-center justify-center mb-5">
        <Compass size={28} />
      </div>
      <h1 className="text-2xl font-extrabold text-ink mb-2">
        {lang === "ar" ? "الصفحة غير موجودة" : "Page not found"}
      </h1>
      <p className="text-sm text-ink-faint max-w-sm mb-6">
        {lang === "ar"
          ? "الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <Link to="/">
        <Button>{lang === "ar" ? "العودة إلى لوحة التحكم" : "Back to dashboard"}</Button>
      </Link>
    </div>
  );
}
