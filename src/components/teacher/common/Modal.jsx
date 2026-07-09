import { X } from 'lucide-react';
export default function Modal({ title, onClose, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal-box ${sizes[size]}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-forest-100">
          <h2 className="text-lg font-bold text-forest-800">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-forest-50 text-forest-500"><X size={20}/></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}