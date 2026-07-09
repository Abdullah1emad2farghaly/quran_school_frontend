import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const Icon = icons[toast.type] || CheckCircle;
  const colors = {
    success: 'bg-forest-800',
    error: 'bg-red-700',
    info: 'bg-blue-700',
  };
  return (
    <div className={`toast ${colors[toast.type] || colors.success}`}>
      <Icon size={18} />
      <span>{toast.message}</span>
    </div>
  );
}
