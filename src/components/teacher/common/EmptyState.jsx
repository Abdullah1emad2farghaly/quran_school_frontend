import { BookOpen } from 'lucide-react';
export default function EmptyState({ icon: Icon = BookOpen, title = 'لا توجد بيانات', message = 'لا توجد عناصر للعرض', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-2xl bg-forest-50 flex items-center justify-center mb-4">
        <Icon size={36} className="text-forest-300"/>
      </div>
      <h3 className="text-lg font-bold text-forest-700 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-xs">{message}</p>
      {action}
    </div>
  );
}