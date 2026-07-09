import { Bell, Users, Trophy, FileText, ClipboardCheck, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const typeIcon = {
  student: { icon: Users, bg: 'bg-blue-100', color: 'text-blue-600' },
  competition: { icon: Trophy, bg: 'bg-yellow-100', color: 'text-yellow-600' },
  exam: { icon: FileText, bg: 'bg-purple-100', color: 'text-purple-600' },
  attendance: { icon: ClipboardCheck, bg: 'bg-forest-100', color: 'text-forest-600' },
};

export default function Notifications() {
  const { notifications, setNotifications, markAllRead, unreadCount } = useApp();

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-forest-900">الإشعارات</h1>
          <p className="text-sm text-forest-500 mt-1">{unreadCount > 0 ? `${unreadCount} إشعار غير مقروء` : 'جميع الإشعارات مقروءة'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-ghost text-sm">
            <CheckCheck size={16} /> تعيين الكل مقروءاً
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(n => {
          const type = typeIcon[n.type] || typeIcon.student;
          const Icon = type.icon;
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`card cursor-pointer flex items-start gap-4 transition-all hover:shadow-md ${!n.read ? 'border-forest-300 bg-forest-50/50' : ''}`}
            >
              <div className={`w-11 h-11 ${type.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={type.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!n.read ? 'text-forest-900' : 'text-forest-700'}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-forest-600 rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-forest-500 mt-0.5">{n.body}</p>
                <p className="text-xs text-forest-300 mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-16">
          <Bell size={40} className="mx-auto text-forest-200 mb-3" />
          <p className="text-forest-400 font-semibold">لا توجد إشعارات</p>
        </div>
      )}
    </div>
  );
}
