import React, { useState, useRef, useEffect } from "react";
import { Menu, Search, Bell, Globe, ChevronDown, LogOut, User, CheckCircle2, AlertTriangle } from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";
import Avatar from "../common/Avatar";

export default function Topbar({ onMenuClick }) {
  const { t, lang, toggleLang } = useI18n();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const notifications = [
    { id: 1, icon: AlertTriangle, tone: "text-rose", text: lang === "ar" ? "3 اشتراكات متأخرة هذا الأسبوع" : "3 subscriptions overdue this week" },
    { id: 2, icon: CheckCircle2, tone: "text-primary", text: lang === "ar" ? "تم تسجيل 5 طلاب جدد" : "5 new students enrolled" },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-paper-raised/95 backdrop-blur border-b border-line flex items-center gap-3 px-4 lg:px-6 shrink-0">
      <button
        onClick={onMenuClick}
        className="xl:hidden w-9 h-9 rounded-lg flex items-center justify-center text-ink-soft hover:bg-line-soft transition shrink-0"
        aria-label="Open menu"
      >
        <Menu size={19} />
      </button>

      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={t.topbar.searchPlaceholder}
          className="w-full h-10 ps-9 pe-3 rounded-lg border border-line bg-line-soft/60 text-sm placeholder:text-ink-faint focus:bg-white focus:border-primary transition"
        />
      </div>

      <div className="ms-auto flex items-center gap-1.5">
        {/* Language switcher */}
        <button
          onClick={toggleLang}
          className="h-9 px-3 rounded-lg flex items-center gap-1.5 text-[13px] font-bold text-ink-soft border border-line hover:bg-line-soft transition"
          aria-label="Switch language"
        >
          <Globe size={15} />
          {lang === "en" ? "العربية" : "English"}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-ink-soft hover:bg-line-soft transition"
            aria-label={t.topbar.notifications}
          >
            <Bell size={18} />
            <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-rose ring-2 ring-paper-raised" />
          </button>
          {notifOpen && (
            <div className="absolute end-0 mt-2 w-80 bg-paper-raised border border-line rounded-xl shadow-raised py-2 z-30 animate-fadeIn">
              <div className="px-4 py-2 border-b border-line">
                <p className="text-sm font-bold text-ink">{t.topbar.notifications}</p>
              </div>
              <div className="py-1 max-h-72 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-line-soft/60 transition">
                    <n.icon size={16} className={`${n.tone} shrink-0 mt-0.5`} />
                    <p className="text-[13px] text-ink-soft leading-snug">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative ms-1" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2 h-9 ps-1 pe-2 rounded-lg hover:bg-line-soft transition"
          >
            <Avatar name="Admin User" size="sm" />
            <div className="hidden md:block text-start">
              <p className="text-[13px] font-bold text-ink leading-tight">Admin User</p>
              <p className="text-[11px] text-ink-faint leading-tight">{t.topbar.admin}</p>
            </div>
            <ChevronDown size={14} className={`text-ink-faint transition-transform hidden md:block ${profileOpen ? "rotate-180" : ""}`} />
          </button>
          {profileOpen && (
            <div className="absolute end-0 mt-2 w-52 bg-paper-raised border border-line rounded-xl shadow-raised py-1.5 z-30 animate-fadeIn">
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-line-soft hover:text-ink transition text-start">
                <User size={15} />
                {t.topbar.profile}
              </button>
              <div className="h-px bg-line my-1" />
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose hover:bg-rose-soft transition text-start">
                <LogOut size={15} />
                {t.topbar.logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
