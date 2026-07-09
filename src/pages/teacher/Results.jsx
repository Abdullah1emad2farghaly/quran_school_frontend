import { useState } from 'react';
import { Plus, Edit2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/teacher/ui/Modal';
import Badge from '../../components/teacher/ui/Badge';
import EmptyState from '../../components/teacher/ui/EmptyState';

const grades = ['ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'راسب'];
const gradeVariant = { 'ممتاز': 'green', 'جيد جداً': 'blue', 'جيد': 'gold', 'مقبول': 'orange', 'راسب': 'red' };

const emptyResult = { studentId: '', studentName: '', score: '', grade: 'ممتاز', notes: '' };

export default function Results() {
  const { teacher, exams, examResults, setExamResults, students, showToast } = useApp();
  const [selectedExam, setSelectedExam] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState(emptyResult);
  const [editForm, setEditForm] = useState(null);

  const myExams = exams.filter(e => teacher.groups.includes(e.groupId) && e.status === 'منتهي');
  const currentExam = myExams.find(e => e.id === Number(selectedExam));
  const results = examResults.filter(r => r.examId === Number(selectedExam));
  const examStudents = currentExam
    ? students.filter(s => s.groupId === currentExam.groupId)
    : [];

  const handleAdd = () => {
    if (!form.studentId || !form.score) { showToast('يرجى ملء الحقول المطلوبة', 'error'); return; }
    setExamResults(prev => [...prev, { ...form, id: Date.now(), examId: Number(selectedExam), totalScore: currentExam?.totalScore || 100 }]);
    showToast('تمت إضافة النتيجة بنجاح');
    setAddModal(false);
    setForm(emptyResult);
  };

  const handleEdit = () => {
    setExamResults(prev => prev.map(r => r.id === editForm.id ? editForm : r));
    showToast('تم تعديل النتيجة بنجاح');
    setEditModal(null);
  };

  const scorePercent = (score, total) => Math.round((score / total) * 100);

  const ResultForm = ({ data, onChange, exam }) => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">الطالب</label>
        <select value={data.studentId} onChange={e => {
          const s = examStudents.find(st => st.id === Number(e.target.value));
          onChange({ ...data, studentId: Number(e.target.value), studentName: s?.name || '' });
        }} className="input-field">
          <option value="">اختر الطالب</option>
          {examStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">الدرجة (من {exam?.totalScore})</label>
        <input type="number" min={0} max={exam?.totalScore || 100} value={data.score} onChange={e => onChange({ ...data, score: Number(e.target.value) })} className="input-field" />
      </div>
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">التقدير</label>
        <select value={data.grade} onChange={e => onChange({ ...data, grade: e.target.value })} className="input-field">
          {grades.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold text-forest-600 block mb-1.5">ملاحظات</label>
        <textarea value={data.notes} onChange={e => onChange({ ...data, notes: e.target.value })} rows={3} className="input-field resize-none" placeholder="ملاحظات على أداء الطالب..." />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-forest-900">نتائج الاختبارات</h1>
        <p className="text-sm text-forest-500 mt-1">تسجيل ومتابعة درجات الطلاب</p>
      </div>

      <div className="card space-y-5">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-forest-600 block mb-1.5">اختر الاختبار</label>
            <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)} className="input-field">
              <option value="">— اختر اختباراً —</option>
              {myExams.map(e => (
                <option key={e.id} value={e.id}>{e.title} ({e.groupName})</option>
              ))}
            </select>
          </div>
          {selectedExam && (
            <button onClick={() => setAddModal(true)} className="btn-primary whitespace-nowrap">
              <Plus size={16} /> إضافة نتيجة
            </button>
          )}
        </div>

        {!selectedExam && (
          <EmptyState title="اختر اختباراً لعرض النتائج" icon={Star} />
        )}

        {selectedExam && results.length === 0 && (
          <EmptyState title="لا توجد نتائج لهذا الاختبار بعد" desc="أضف نتائج الطلاب باستخدام الزر أعلاه" icon={Star} />
        )}

        {results.length > 0 && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-forest-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-forest-900">{results.length}</p>
                <p className="text-xs text-forest-500">نتيجة</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-yellow-700">
                  {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0}
                </p>
                <p className="text-xs text-yellow-600">متوسط الدرجات</p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-emerald-700">
                  {results.filter(r => r.grade === 'ممتاز').length}
                </p>
                <p className="text-xs text-emerald-600">ممتاز</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="text-right px-4 py-3 rounded-r-xl">الطالب</th>
                    <th className="text-right px-4 py-3">الدرجة</th>
                    <th className="text-right px-4 py-3">النسبة</th>
                    <th className="text-right px-4 py-3">التقدير</th>
                    <th className="text-right px-4 py-3">الملاحظات</th>
                    <th className="text-right px-4 py-3 rounded-l-xl">تعديل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-50">
                  {results.map(r => (
                    <tr key={r.id} className="table-row">
                      <td className="px-4 py-3 font-semibold text-forest-900">{r.studentName}</td>
                      <td className="px-4 py-3 text-forest-700 font-bold">{r.score} / {r.totalScore}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-forest-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${scorePercent(r.score, r.totalScore) >= 90 ? 'bg-emerald-500' : scorePercent(r.score, r.totalScore) >= 70 ? 'bg-blue-500' : 'bg-orange-500'}`}
                              style={{ width: `${scorePercent(r.score, r.totalScore)}%` }}
                            />
                          </div>
                          <span className="text-xs text-forest-600">{scorePercent(r.score, r.totalScore)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><Badge variant={gradeVariant[r.grade] || 'default'}>{r.grade}</Badge></td>
                      <td className="px-4 py-3 text-forest-500 text-xs max-w-xs truncate">{r.notes || '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setEditForm({...r}); setEditModal(true); }} className="p-1.5 hover:bg-forest-50 rounded-lg text-forest-500 transition-colors">
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="إضافة نتيجة طالب">
        <ResultForm data={form} onChange={setForm} exam={currentExam} />
        <div className="flex gap-3 mt-6">
          <button onClick={() => setAddModal(false)} className="btn-secondary flex-1 justify-center">إلغاء</button>
          <button onClick={handleAdd} className="btn-primary flex-1 justify-center">حفظ النتيجة</button>
        </div>
      </Modal>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="تعديل النتيجة">
        {editForm && <ResultForm data={editForm} onChange={setEditForm} exam={currentExam} />}
        <div className="flex gap-3 mt-6">
          <button onClick={() => setEditModal(null)} className="btn-secondary flex-1 justify-center">إلغاء</button>
          <button onClick={handleEdit} className="btn-primary flex-1 justify-center">حفظ التعديلات</button>
        </div>
      </Modal>
    </div>
  );
}
