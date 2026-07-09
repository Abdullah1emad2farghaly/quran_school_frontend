import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <p className="text-forest-600 text-sm">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">إلغاء</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 justify-center bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2">
            تأكيد الحذف
          </button>
        </div>
      </div>
    </Modal>
  );
}
