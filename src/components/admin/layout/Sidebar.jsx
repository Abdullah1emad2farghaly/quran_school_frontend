import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, UserCheck, GraduationCap, FolderKanban,
  ClipboardCheck, BookOpenCheck, Trophy, Wallet, Banknote, ShieldCheck,
  Settings, X,
} from "lucide-react";
import { useI18n } from "../../../i18n/I18nContext";

const NAV_ITEMS = [
  { key: "dashboard", to: "", icon: LayoutDashboard, end: true },
  { key: "students", to: "students", icon: Users },
  { key: "parents", to: "parents", icon: UserCheck },
  { key: "teachers", to: "teachers", icon: GraduationCap },
  { key: "groups", to: "groups", icon: FolderKanban },
  // { key: "attendance", to: "attendance", icon: ClipboardCheck },
  // { key: "memorization", to: "memorization", icon: BookOpenCheck },
  { key: "competitions", to: "competitions", icon: Trophy },
  // { key: "subscriptions", to: "subscriptions", icon: Wallet },
  // { key: "collectors", to: "collectors", icon: Banknote },
  // { key: "usersRoles", to: "users", icon: ShieldCheck },
  // { key: "settings", to: "settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { t } = useI18n();

  return (
    <>
      {/* Mobile/tablet overlay */}
      {open && <div className="fixed inset-0 bg-ink/40 z-40 xl:hidden" onClick={onClose} />}

      <aside
        className={`fixed xl:sticky top-0 inset-y-0 start-0 z-50 xl:z-0 w-64 shrink-0 bg-primary-darker text-paper flex flex-col h-screen transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full xl:translate-x-0 rtl:translate-x-full rtl:xl:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gold/90 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary-darker" fill="currentColor">
                <path d="M12 2.5c-3 0-5.5 2.4-5.5 5.7 0 4.1 3.6 7.1 5.5 9.3 1.9-2.2 5.5-5.2 5.5-9.3 0-3.3-2.5-5.7-5.5-5.7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight">{t.appName}</p>
              <p className="text-[11px] text-paper/55 leading-tight">{t.appNameSub}</p>
            </div>
          </div>
          <button onClick={onClose} className="xl:hidden text-paper/70 hover:text-paper" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? "bg-paper text-primary-darker shadow-sm" : "text-paper/70 hover:bg-white/10 hover:text-paper"
                }`
              }
            >
              <item.icon size={18} strokeWidth={2} className="shrink-0" />
              <span className="truncate">{t.nav[item.key]}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10 shrink-0">
          <p className="text-[11px] text-paper/45 leading-relaxed">
            {t.appName} {t.appNameSub} © {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  );
}
