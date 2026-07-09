import { useState } from 'react';
import { Save, ClipboardCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { createGroupAttendance } from '../../api/services/teachersService';

const STATUS = ['Present', 'Absent'];

const statusStyle = {
  'Present': 'bg-emerald-100 text-emerald-700 border-emerald-300',
  'Absent': 'bg-red-100 text-red-700 border-red-300',
};

export default function Attendance({ students, embedded }) {
  const { showToast } = useApp();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [saved, setSaved] = useState(false);
  const { id } = useParams();


  const getStatus = (studentId) => students.find(s => s.id === studentId)?.attendanceStatus;
  const setStatus = (studentId, status) => {
    setAttendance(prev => {
      const index = prev.findIndex(a => a.studentId === studentId);

      if (index !== -1) {
        const updated = [...prev];
        updated[index] = {
          studentId,
          status
        };
        return updated;
      }

      return [
        ...prev,
        {
          studentId,
          status
        }
      ];
    });

    setSaved(false);
  };

  let data = {groupId: id, attendances: attendance};
  const handleSave = async (data) => {
    if (attendance.length !== students.length) {
      showToast('يرجى تسجيل الحضور لجميع الطلاب');
      return;
    }

    try {
      const res = await createGroupAttendance(data);
      console.log(res);
      setSaved(true);
      showToast('تم حفظ الحضور بنجاح');
    }catch(error) {
      console.log(error)
      showToast('حدث خطأ أثناء حفظ الحضور');
      return;
    }
  };

  

  const presentCount = students.filter(s => getStatus(s.id) === 'Present').length;
  const absentCount = students.filter(s => getStatus(s.id) === 'Absent').length;

  return (
    <div className={embedded ? '' : 'space-y-6'}>
      {!embedded && (
        <div>
          <h1 className="text-xl font-bold text-forest-900">تسجيل الحضور</h1>
          <p className="text-sm text-forest-500 mt-1">سجّل حضور طلاب حلقاتك</p>
        </div>
      )}

      <div className="card space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!embedded && (
            <div className="flex-1">
              <label className="text-xs font-semibold text-forest-600 mb-1.5 block">الحلقة</label>
              <select
                value={selectedGroup}
                onChange={e => setSelectedGroup(Number(e.target.value))}
                className="input-field"
              >
                {myGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex-1">
            <label className="text-xs font-semibold text-forest-600 mb-1.5 block">التاريخ</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-emerald-700">{presentCount}</p>
            <p className="text-xs text-emerald-600">حاضر</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-red-700">{absentCount}</p>
            <p className="text-xs text-red-600">غائب</p>
          </div>
        </div>

        {/* Table */}
        {students.length === 0 ? (
          <div className="text-center py-10 text-forest-400 text-sm">
            <ClipboardCheck size={32} className="mx-auto mb-2 text-forest-200" />
            لا يوجد طلاب في هذه الحلقة
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-right px-4 py-3 rounded-r-xl">الطالب</th>
                  {STATUS.map(s => (
                    <th key={s} className="text-center px-4 py-3">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50">
                {students.map(student => (
                  <tr key={student.id} className="table-row">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {student.studentName.charAt(0)}
                        </div>
                        <span className="font-medium text-forest-900">{student.studentName}</span>
                      </div>
                    </td>
                    {STATUS.map(status => (
                      <td key={status} className="px-4 py-3 text-center">
                        <button
                          onClick={() => { setStatus(student.id, status); student.attendanceStatus = status; }}
                          className={`w-8 h-8 rounded-full border-2 transition-all mx-auto flex items-center justify-center
                            ${getStatus(student.id) === status
                              ? `${statusStyle[status]} scale-110 shadow-sm`
                              : 'border-forest-200 hover:border-forest-400'
                            }`}
                        >
                          {getStatus(student.id) === status && (
                            <span className="text-xs font-bold">✓</span>
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {students.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => handleSave(data)}
              className={`btn-primary ${saved ? 'bg-emerald-600' : ''}`}
            >
              <Save size={16} />
              {saved ? 'تم الحفظ ✓' : 'حفظ الحضور'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
