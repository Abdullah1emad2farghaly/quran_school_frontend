import { Menu, Bell, Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';

export default function Navbar({ onMenuClick }) {
  const { teacher, unreadCount } = useApp();

  return (
    <header className="bg-white border-b border-forest-100 h-16 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-forest-50 rounded-xl transition-colors"
        >
          <Menu size={20} className="text-forest-700" />
        </button>
        <div className="hidden md:flex items-center gap-2 bg-forest-50 rounded-xl px-3 py-2 w-64">
          <Search size={16} className="text-forest-400" />
          <input
            type="text"
            placeholder="بحث..."
            className="bg-transparent text-sm text-forest-700 placeholder-forest-400 outline-none flex-1"
          />
        </div>
      </div>

      {/* Left side */}
      <div className="flex items-center gap-2">
        <Link to="/notifications" className="relative p-2 hover:bg-forest-50 rounded-xl transition-colors">
          <Bell size={20} className="text-forest-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </Link>

        <Link to="/profile" className="flex items-center gap-2 hover:bg-forest-50 rounded-xl px-3 py-2 transition-colors">
          <div className="w-8 h-8 bg-forest-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {teacher.name.charAt(0)}
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-forest-900 leading-tight">{teacher.name}</p>
            <p className="text-xs text-forest-400">معلم</p>
          </div>
          <ChevronDown size={14} className="text-forest-400 hidden md:block" />
        </Link>
      </div>
    </header>
  );
}
