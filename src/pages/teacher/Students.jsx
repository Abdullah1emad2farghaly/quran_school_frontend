import { useState } from 'react';
import { Search, UserPlus, Trash2, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/teacher/ui/Badge';
import Modal from '../../components/teacher/ui/Modal';
import ConfirmDialog from '../../components/teacher/ui/ConfirmDialog';
import Pagination from '../../components/teacher/ui/Pagination';
import EmptyState from '../../components/teacher/ui/EmptyState';
import calculateAge from '../../utils/CalculateAge';

const PAGE_SIZE = 8;

function Avatar({ name }) {
  const colors = ['bg-forest-600', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-9 h-9 ${color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
      {name.charAt(0)}
    </div>
  );
}

export default function Students({ groupId, embedded, students }) {
  const { teacher, setStudents, availableStudents, groups, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const allowedGroupIds = groupId ? [groupId] : teacher.groups;
  const filtered = students
    .filter(s => s.studentName.includes(search));

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = (student) => {
    const targetGroupId = groupId || teacher.groups[0];
    setStudents(prev => [...prev, { ...student, groupId: targetGroupId }]);
    showToast(`تمت إضافة ${student.name} بنجاح`);
    setAddModal(false);
  };

  const handleRemove = (studentId) => {
    const student = students.find(s => s.id === studentId);
    setStudents(prev => prev.filter(s => s.id !== studentId));
    showToast(`تمت إزالة ${student?.name} من الحلقة`, 'info');
  };

  const getGroupName = (gId) => groups.find(g => g.id === gId)?.name || '';

  return (
    <div className={embedded ? '' : 'space-y-6'}>
      {!embedded && (
        <div>
          <h1 className="text-xl font-bold text-forest-900">الطلاب</h1>
          <p className="text-sm text-forest-500 mt-1">إدارة طلاب حلقاتك</p>
        </div>
      )}

      <div className="card space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-forest-50 rounded-xl px-3 py-2.5 flex-1">
            <Search size={16} className="text-forest-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو اسم ولي الأمر..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-forest-700 placeholder-forest-400 outline-none flex-1"
            />
          </div>
          {/* <button onClick={() => setAddModal(true)} className="btn-primary whitespace-nowrap">
            <UserPlus size={16} /> إضافة طالب
          </button> */}
        </div>

        {/* Table */}
        {paginated.length === 0 ? (
          <EmptyState title="لا يوجد طلاب" desc="جرّب تغيير كلمة البحث أو أضف طالباً جديداً" icon={Users} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-right px-4 py-3 rounded-r-xl">الطالب</th>
                  <th className="text-right px-4 py-3">العمر</th>
                  {!embedded && <th className="text-right px-4 py-3">الحلقة</th>}
                  <th className="text-right px-4 py-3">ولي الأمر</th>
                  <th className="text-right px-4 py-3">التقدم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50">
                {paginated.map(student => {
                  const progress = Math.round((student.memorizedJuz / student.totalJuz) * 100);
                  return (
                    <tr key={student.id} className="table-row">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={student.studentName} />
                          <div>
                            <p className="font-semibold text-forest-900">{student.studentName}</p>
                            <p className="text-xs text-forest-400">{student?.studentCreatedAt?.split("T")[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-forest-600">{calculateAge(student.birthDate)} سنة</td>
                      <td className="px-4 py-3 text-forest-600">{student.parentPhone}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-forest-100 rounded-full h-1.5">
                            <div
                              className="bg-forest-600 h-1.5 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-forest-700">{student.memorizedJuz}/{student.totalJuz}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
      </div>

      {/* Add Modal */}
      {/* <Modal open={addModal} onClose={() => setAddModal(false)} title="إضافة طالب إلى الحلقة">
        <div className="space-y-3">
          <p className="text-sm text-forest-500 mb-4">اختر طالباً من القائمة المتاحة</p>
          {availableStudents.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-forest-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Avatar name={s.name} />
                <div>
                  <p className="font-semibold text-forest-900 text-sm">{s.name}</p>
                  <p className="text-xs text-forest-500">ولي الأمر: {s.parentName} • العمر: {s.age}</p>
                </div>
              </div>
              <button onClick={() => handleAdd(s)} className="btn-primary text-xs px-3 py-1.5">إضافة</button>
            </div>
          ))}
          {availableStudents.length === 0 && (
            <p className="text-center text-forest-400 text-sm py-4">لا يوجد طلاب متاحون</p>
          )}
        </div>
      </Modal> */}

      
    </div>
  );
}
