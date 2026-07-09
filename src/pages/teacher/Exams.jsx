import { useState } from 'react';
import { Plus, Edit2, Trash2, FileText, CalendarDays } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/teacher/ui/Modal';
import ConfirmDialog from '../../components/teacher/ui/ConfirmDialog';
import Badge from '../../components/teacher/ui/Badge';
import EmptyState from '../../components/teacher/ui/EmptyState';

const empty = { title: '', groupId: '', date: '', range: '', description: '', totalScore: 100 };

function ExamForm({ form, groups, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">عنوان الاختبار</label>
        <input type="text" value={form.title} onChange={e => onChange({ ...form, title: e.target.value })} placeholder="مثال: اختبار الربع الأول" className="input-field" />
      </div>
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">الحلقة</label>
        <select value={form.groupId} onChange={e => {
          const g = groups.find(g => g.id === Number(e.target.value));
          onChange({ ...form, groupId: Number(e.target.value), groupName: g?.name || '' });
        }} className="input-field">
          <option value="">اختر الحلقة</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">التاريخ</label>
        <input type="date" value={form.date} onChange={e => onChange({ ...form, date: e.target.value })} className="input-field" />
      </div>
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">نطاق الحفظ</label>
        <input type="text" value={form.range} onChange={e => onChange({ ...form, range: e.target.value })} placeholder="مثال: سورة البقرة ١-١٠٠" className="input-field" />
      </div>
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">الدرجة الكلية</label>
        <input type="number" min={10} max={200} value={form.totalScore} onChange={e => onChange({ ...form, totalScore: Number(e.target.value) })} className="input-field" />
      </div>
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">الوصف</label>
        <textarea value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} rows={3} className="input-field resize-none" placeholder="وصف الاختبار..." />
      </div>
    </div>
  );
}

export default function Exams() {
  const { teacher, groups, exams, setExams, showToast } = useApp();
  const [addModal, setAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(empty);
  const [editForm, setEditForm] = useState(null);

  const myGroups = groups.filter(g => teacher.groups.includes(g.id));
  const upcoming = exams.filter(e => e.status === 'قادم' && teacher.groups.includes(e.groupId));
  const past = exams.filter(e => e.status === 'منتهي' && teacher.groups.includes(e.groupId));

  const handleAdd = () => {
    if (!form.title || !form.groupId) { showToast('يرجى ملء جميع الحقول المطلوبة', 'error'); return; }
    const g = myGroups.find(g => g.id === form.groupId);
    setExams(prev => [...prev, { ...form, id: Date.now(), status: 'قادم', groupName: g?.name || '' }]);
    showToast('تم إنشاء الاختبار بنجاح');
    setAddModal(false);
    setForm(empty);
  };

  const handleEdit = () => {
    setExams(prev => prev.map(e => e.id === editForm.id ? editForm : e));
    showToast('تم تعديل الاختبار بنجاح');
    setEditTarget(null);
  };

  const handleDelete = (id) => {
    setExams(prev => prev.filter(e => e.id !== id));
    showToast('تم حذف الاختبار', 'info');
  };

  const ExamCard = ({ exam }) => (
    <div className="card flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${exam.status === 'قادم' ? 'bg-forest-100' : 'bg-gray-100'}`}>
        <CalendarDays size={22} className={exam.status === 'قادم' ? 'text-forest-600' : 'text-gray-400'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <h3 className="font-bold text-forest-900 text-sm">{exam.title}</h3>
          <Badge variant={exam.status === 'قادم' ? 'green' : 'default'}>{exam.status}</Badge>
        </div>
        <p className="text-xs text-forest-500 mt-1">{exam.groupName} • {exam.date}</p>
        <p className="text-xs text-forest-400 mt-0.5">{exam.range}</p>
        {exam.description && <p className="text-xs text-forest-400 mt-0.5">{exam.description}</p>}
        <p className="text-xs font-semibold text-forest-600 mt-1">الدرجة الكلية: {exam.totalScore}</p>
      </div>
      <div className="flex gap-1">
        <button onClick={() => { setEditForm({...exam}); setEditTarget(true); }} className="p-2 hover:bg-forest-50 rounded-lg text-forest-500 hover:text-forest-700 transition-colors">
          <Edit2 size={15} />
        </button>
        <button onClick={() => setDeleteTarget(exam.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-forest-900">الاختبارات</h1>
          <p className="text-sm text-forest-500 mt-1">إدارة اختبارات حلقاتك</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary">
          <Plus size={16} /> إنشاء اختبار
        </button>
      </div>

      <div>
        <h2 className="font-bold text-forest-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-5 bg-forest-600 rounded-full" />
          الاختبارات القادمة ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <EmptyState title="لا توجد اختبارات قادمة" icon={FileText} />
        ) : (
          <div className="space-y-3">{upcoming.map(e => <ExamCard key={e.id} exam={e} />)}</div>
        )}
      </div>

      <div>
        <h2 className="font-bold text-forest-800 mb-3 flex items-center gap-2">
          <span className="w-2 h-5 bg-gray-400 rounded-full" />
          الاختبارات المنتهية ({past.length})
        </h2>
        {past.length === 0 ? (
          <EmptyState title="لا توجد اختبارات سابقة" icon={FileText} />
        ) : (
          <div className="space-y-3">{past.map(e => <ExamCard key={e.id} exam={e} />)}</div>
        )}
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="إنشاء اختبار جديد">
        <ExamForm form={form} groups={myGroups} onChange={setForm} />
        <div className="flex gap-3 mt-6">
          <button onClick={() => setAddModal(false)} className="btn-secondary flex-1 justify-center">إلغاء</button>
          <button onClick={handleAdd} className="btn-primary flex-1 justify-center">إنشاء الاختبار</button>
        </div>
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="تعديل الاختبار">
        {editForm && <ExamForm form={editForm} groups={myGroups} onChange={setEditForm} />}
        <div className="flex gap-3 mt-6">
          <button onClick={() => setEditTarget(null)} className="btn-secondary flex-1 justify-center">إلغاء</button>
          <button onClick={handleEdit} className="btn-primary flex-1 justify-center">حفظ التعديلات</button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget)} title="حذف الاختبار" message="هل تريد حذف هذا الاختبار نهائياً؟" />
    </div>
  );
}
