import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal-box w-full ${sizes[size]}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-100">
          <h3 className="text-base font-bold text-forest-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-forest-50 rounded-lg transition-colors">
            <X size={18} className="text-forest-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
