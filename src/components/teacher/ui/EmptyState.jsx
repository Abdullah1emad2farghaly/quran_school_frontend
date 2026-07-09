import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'لا توجد بيانات', desc = '', icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
      <div className="w-16 h-16 bg-forest-50 rounded-2xl flex items-center justify-center">
        <Icon size={32} className="text-forest-300" />
      </div>
      <div>
        <p className="font-semibold text-forest-700">{title}</p>
        {desc && <p className="text-sm text-forest-400 mt-1">{desc}</p>}
      </div>
      {action && action}
    </div>
  );
}
