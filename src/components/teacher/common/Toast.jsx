import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
export default function Toast() {
  const { toast, showToast } = useApp();
  if (!toast) return null;
  const colors = { success: 'bg-forest-600', error: 'bg-red-500', info: 'bg-blue-500' };
  const icons = { success: <CheckCircle size={18}/>, error: <XCircle size={18}/>, info: <Info size={18}/> };
  return (
    <div className={`toast ${colors[toast.type] || colors.success}`}>
      {icons[toast.type] || icons.success}
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => showToast(null)} className="opacity-70 hover:opacity-100"><X size={16}/></button>
    </div>
  );
}