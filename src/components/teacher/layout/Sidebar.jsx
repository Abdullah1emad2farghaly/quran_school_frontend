import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardCheck, BookOpen,
  FileText, Trophy, Bell, User, UsersRound, Star, X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const navItems = [
  { path: '/teacher', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/teacher/groups', label: 'حلقاتي', icon: UsersRound },
  { path: '/teacher/competitions', label: 'المسابقات', icon: Trophy },
  { path: '/teacher/notifications', label: 'الإشعارات', icon: Bell },
  { path: '/teacher/profile', label: 'الملف الشخصي', icon: User },
];

export default function Sidebar({ open, onClose }) {
  const { unreadCount } = useApp();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-64 bg-white border-l border-forest-100 z-40
        flex flex-col shadow-xl transition-transform duration-300
        ${open ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:z-auto
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-forest-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white text-lg font-brand">ن</span>
            </div>
            <div>
              <p className="font-brand text-forest-900 text-base font-bold leading-tight">نور الهدى</p>
              <p className="text-xs text-forest-400">بوابة المعلم</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-forest-50 rounded-lg">
            <X size={18} className="text-forest-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/teacher'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {path === '/notifications' && unreadCount > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4 border-t border-forest-100">
          <div className="bg-forest-50 rounded-xl p-3 star-bg">
            <p className="text-xs text-forest-600 font-semibold mb-1">بسم الله الرحمن الرحيم</p>
            <p className="text-xs text-forest-500">مدرسة نور الهدى لتحفيظ القرآن</p>
          </div>
        </div>
      </aside>
    </>
  );
}
