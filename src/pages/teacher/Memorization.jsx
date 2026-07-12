import { useCallback, useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/teacher/ui/Modal';
import ConfirmDialog from '../../components/teacher/ui/ConfirmDialog';
import Badge from '../../components/teacher/ui/Badge';
import EmptyState from '../../components/teacher/ui/EmptyState';
import { createMemorizationAssignment, createMemorizationRecord, createRevisionAssignment } from '../../api/services/memorizationService';
import { memorizationRecords } from '../../data';
import { useToast } from '../../context/ToastContext';

const scoreOptions = ['ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف'];
const scoreVariant = { 'ممتاز': 'green', 'جيد جداً': 'blue', 'جيد': 'gold', 'مقبول': 'orange', 'ضعيف': 'red' };

function RecordForm({ record, surahs, onChange, setType }) {
  return (
    <div className="space-y-4">

      <div>
        {/* create select that has two types memorization and revision */}
        <select onChange={(e) => setType(e)} className="input-field">
          <option value="memorization">الحفظ</option>
          <option value="revision">المراجعه</option>
          
          
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">الحفظ</label>
        <select value={record.surahName} onChange={e => onChange({ ...record, surahName: e.target.value })} className="input-field">
          <option value="">اختر السورة</option>
          {surahs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-forest-600 block mb-1.5">من الآية</label>
          <input type="number" min={1} value={record?.fromAyah} onChange={e => onChange({ ...record, fromAyah: Number(e.target.value) })} className="input-field" />
        </div>
        <div>
          <label className="text-xs font-semibold text-forest-600 block mb-1.5">إلى الآية</label>
          <input type="number" min={1} value={record.toAyah} onChange={e => onChange({ ...record, toAyah: Number(e.target.value) })} className="input-field" />
        </div>
      </div>
    </div>
  );
}

function RecordForm2({ setEvaluation, evaluation }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-forest-600 block mb-1.5">الحفظ</label>
          <input type="number" min={1} max={10} onChange={(e)=> setEvaluation({...evaluation, memorizationScore: e.target.value})}  className="input-field" />
        </div>
        <div>
          <label className="text-xs font-semibold text-forest-600 block mb-1.5">المراجعة</label>
          <input type="number" min={1} max={10} onChange={(e)=> setEvaluation({...evaluation, revision: e.target.value})} className="input-field" />
        </div>
      </div>

      {/* <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">التقييم</label>
        <select value={record.score} onChange={e => onChange({ ...record, score: e.target.value })} className="input-field">
          {scoreOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div> */}

      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">ملاحظات المعلم</label>
        <textarea value={evaluation.notes} onChange={(e)=> setEvaluation({...evaluation, notes: e.target.value})} rows={3} className="input-field resize-none" placeholder="أضف ملاحظاتك هنا..." />
      </div>
    </div>
  );
}

const emptyRecord = { surahName: null, fromAyah: null, toAyah: null };

export default function Memorization({ groupId, students, embedded }) {
  console.log(students);
  const { showToast, surahs } = useApp();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [memorization, setMemorization] = useState(emptyRecord);
  const [editForm, setEditForm] = useState(null);
  const [type, setType] = useState('memorization');
  const [evaluation, setEvaluation] = useState({
    memorizationScore: null,
    revision: null,
    notes: '',
  })
  

  const handleChangeType = useCallback((e)=>{
    setType(e.target.value)
  }, []);

  const handleSubmit = async (groupId, data) => {
    // make validation checks here
    try{
      if(type === "memorization") {
        await createMemorizationAssignment(groupId, data);
      }else {
        await createRevisionAssignment(groupId, data)
      }
      showToast('تم إضافة السجل بنجاح');
      setAddModal(false);
      setMemorization(emptyRecord);
    }catch (err) {
      if (Array.isArray(err.msg)) {
        err?.msg?.forEach((error) => {
          // console.log(error.msg['ar'])
          toast.error(error?.msg?.[window.localStorage.getItem('academy_lang')])
        })
      } else {
        toast.error(err?.msg?.[window.localStorage.getItem('academy_lang')])
      }
    }
  };

  const handleEdit = async (editForm, groupId, evaluation) => {
    try {
      await createMemorizationRecord(editForm.id, groupId, evaluation)
      showToast("تم حفظ التقييم بنجاح");
    }catch (err) {
      if (Array.isArray(err.msg)) {
        err.msg.forEach((error) => {
          toast.error(error.msg[window.localStorage.getItem('academy_lang')])
        })
      } else {
        toast.error(err.msg[window.localStorage.getItem('academy_lang')])
      }
    }
  };

  return (
    <div className={embedded ? '' : 'space-y-6'}>
      {!embedded && (
        <div>
          <h1 className="text-xl font-bold text-forest-900">سجلات التسميع</h1>
          <p className="text-sm text-forest-500 mt-1">تسجيل ومتابعة تسميع الطلاب</p>
        </div>
      )}

      <div className="card space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-forest-50 rounded-xl px-3 py-2.5 flex-1">
            <Search size={16} className="text-forest-400" />
            <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none flex-1 text-forest-700 placeholder-forest-400" />
          </div>
          <button onClick={() => setAddModal(true)} className="btn-primary whitespace-nowrap">
            <Plus size={16} /> إضافة تسميع
          </button>
        </div>

        {students.length === 0 ? (
          <EmptyState title="لا توجد سجلات تسميع" icon={BookOpen} />
        ) : ( 
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-right px-4 py-3 rounded-r-xl">الطالب</th>
                  <th className="text-right px-4 py-3">السورة</th>
                  <th className="text-right px-4 py-3">الآيات</th>
                  <th className="text-right px-4 py-3">التقييم</th>
                  <th className="text-right px-4 py-3">التاريخ</th>
                  <th className="text-right px-4 py-3 rounded-l-xl">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50">
                {students.map(r => (
                  <tr key={r.id} className="table-row">
                    <td className="px-4 py-3 font-semibold text-forest-900">{r.studentName}</td>
                    <td className="px-4 py-3 text-forest-700">{r?.lastSession?.memorization?.surahName || '---'}</td>
                    <td className="px-4 py-3 text-forest-600">{r?.lastSession?.memorization?.fromAyah} - {r?.lastSession?.memorization?.toAyah || '---'}</td>
                    <td className="px-4 py-3"><Badge variant={scoreVariant[r?.lastSession?.memorization?.memorizationScore] || '--'}>{r?.lastSession?.memorizationScore || '---'}</Badge></td>
                    <td className="px-4 py-3 text-forest-400 text-xs">{new Date().toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditForm({...r}); setEditModal(true); }} className="p-1.5 hover:bg-forest-500 rounded-lg border px-4 border-forest-500 text-forest-500 hover:text-white transition-colors">
                          تقييم
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="إضافة سجل تسميع">
        <RecordForm record={memorization} setType={handleChangeType} surahs={surahs} onChange={setMemorization} />
        <div className="flex gap-3 mt-6">
          <button onClick={() => setAddModal(false)} className="btn-secondary flex-1 justify-center">إلغاء</button>
          <button onClick={() => handleSubmit(groupId, memorization)} className="btn-primary flex-1 justify-center">حفظ</button>
        </div>
      </Modal>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="تقييم الطالب">
        {editForm && <RecordForm2 evaluation={evaluation} setEvaluation={setEvaluation} />}
        <div className="flex gap-3 mt-6">
          <button onClick={() => setEditModal(null)} className="btn-secondary flex-1 justify-center">إلغاء</button>
          <button onClick={()=> handleEdit(editForm, groupId, evaluation)} className="btn-primary flex-1 justify-center">حفظ التقييم</button>
        </div>
      </Modal>

    </div>
  );
}
