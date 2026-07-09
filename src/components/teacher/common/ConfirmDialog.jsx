import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
export default function ConfirmDialog({ title, message, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500"/>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn-secondary">الغاء</button>
          <button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2">تاكيد</button>
        </div>
      </div>
    </Modal>
  );
}