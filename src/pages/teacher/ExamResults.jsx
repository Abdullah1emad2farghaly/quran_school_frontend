import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Award, Star } from 'lucide-react';
import PageHeader from '../../components/teacher/common/PageHeader';
import Modal from '../../components/teacher/common/Modal';
import EmptyState from '../../components/teacher/common/EmptyState';

function gradeColor(grade) {
  if (!grade) return 'badge-blue';
  if (grade.startsWith('A')) return 'badge-green';
  if (grade.startsWith('B')) return 'badge-blue';
  if (grade.startsWith('C')) return 'badge-yellow';
  return 'badge-red';
}

function ResultForm({ result, exams, students, onSave, onClose }) {
  const [form, setForm] = useState(result || { examId: '', studentId: '', score: '', grade: 'A', notes: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];
  const finishedExams = exams.filter(e => e.status === 'منتهي');
  const examStudents = form.examId ? students : students;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="lbl">الاختبار</label>
          <select value={form.examId} onChange={e => set('examId', e.target.value)} className="inp">
            <option value="">اختر الاختبار</option>
            {finishedExams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        <div>
          <label className="lbl">الطالب</label>
          <select value={form.studentId} onChange={e => set('studentId', e.target.value)} className="inp">
            <option value="">اختر الطالب</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="lbl">الدرجة</label>
          <input type="number" min="0" max="100" value={form.score} onChange={e => set('score', e.target.value)} className="inp" placeholder="0 - 100"/>
        </div>
        <div>
          <label className="lbl">التقدير</label>
          <select value={form.grade} onChange={e => set('grade', e.target.value)} className="inp">
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="lbl">ملاحظات</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="inp resize-none"/>
      </div>
      <div className="flex gap-3">
        <button onClick={() => onSave({ ...form, id: result?.id || Date.now() })} className="btn-primary flex-1">حفظ النتيجة</button>
        <button onClick={onClose} className="btn-secondary">إلغاء</button>
      </div>
    </div>
  );
}

export default function ExamResults() {
  const { examResults, setExamResults, exams, students, groups, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterExam, setFilterExam] = useState('');

  const finishedExams = exams.filter(e => e.status === 'منتهي');
  const filtered = examResults.filter(r => !filterExam || r.examId === parseInt(filterExam));

  const handleSave = (result) => {
    if (editing) {
      setExamResults(prev => prev.map(r => r.id === result.id ? result : r));
      showToast('تم تعديل النتيجة');
    } else {
      setExamResults(prev => [...prev, result]);
      showToast('تم إدخال النتيجة بنجاح');
    }
    setShowModal(false); setEditing(null);
  };

  return (
    <div>
      <PageHeader title="نتائج الاختبارات" subtitle={`${examResults.length} نتيجة مسجلة`}
        actions={
          <>
            <select value={filterExam} onChange={e => setFilterExam(e.target.value)} className="inp w-48">
              <option value="">كل الاختبارات</option>
              {finishedExams.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
            <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary">
              <Plus size={16}/> إدخال نتيجة
            </button>
          </>
        }
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-forest-100">
                <th className="tbl-header">الطالب</th>
                <th className="tbl-header">الاختبار</th>
                <th className="tbl-header">الدرجة</th>
                <th className="tbl-header">التقدير</th>
                <th className="tbl-header">ملاحظات</th>
                <th className="tbl-header">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const student = students.find(s => s.id === r.studentId);
                const exam = exams.find(e => e.id === r.examId);
                return (
                  <tr key={r.id} className="tbl-row">
                    <td className="tbl-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{student?.name.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium">{student?.name}</span>
                      </div>
                    </td>
                    <td className="tbl-cell text-sm text-gray-600">{exam?.title}</td>
                    <td className="tbl-cell">
                      <div className="flex items-center gap-1">
                        <Star size={13} className="text-gold-400 fill-gold-400"/>
                        <span className="font-bold text-forest-700 text-lg">{r.score}</span>
                        <span className="text-xs text-gray-400">/ {exam?.totalScore || 100}</span>
                      </div>
                    </td>
                    <td className="tbl-cell">
                      <span className={gradeColor(r.grade) + ' text-base font-bold'}>{r.grade}</span>
                    </td>
                    <td className="tbl-cell text-sm text-gray-500">{r.notes}</td>
                    <td className="tbl-cell">
                      <button onClick={() => { setEditing(r); setShowModal(true); }}
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors">
                        <Edit2 size={14}/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState title="لا توجد نتائج" message="ابدأ بإدخال نتائج الاختبارات المنتهية"/>}
        </div>
      </div>

      {showModal && (
        <Modal title={editing ? 'تعديل النتيجة' : 'إدخال نتيجة'} onClose={() => { setShowModal(false); setEditing(null); }}>
          <ResultForm result={editing} exams={exams} students={students} onSave={handleSave} onClose={() => setShowModal(false)}/>
        </Modal>
      )}
    </div>
  );
}