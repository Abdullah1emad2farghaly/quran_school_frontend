import { Trophy, MapPin, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/teacher/ui/Badge';

export default function Competitions() {
  const { competitions, students } = useApp();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-forest-900">المسابقات</h1>
        <p className="text-sm text-forest-500 mt-1">عرض المسابقات القرآنية المتاحة والطلاب المسجلين</p>
      </div>

      <div className="grid gap-4">
        {competitions.map(comp => {
          const registered = students.filter(s => comp.registeredStudents.includes(s.id));
          const isOpen = expanded === comp.id;

          return (
            <div key={comp.id} className="card">
              <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : comp.id)}
              >
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Trophy size={26} className="text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="font-bold text-forest-900">{comp.title}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={comp.status === 'مفتوح للتسجيل' ? 'green' : 'gold'}>{comp.status}</Badge>
                      {isOpen ? <ChevronUp size={16} className="text-forest-400" /> : <ChevronDown size={16} className="text-forest-400" />}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-forest-500">
                    <span className="flex items-center gap-1"><MapPin size={13} />{comp.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={13} />{comp.date}</span>
                    <span className="flex items-center gap-1"><Users size={13} />{registered.length} طالب مسجل</span>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="mt-5 pt-5 border-t border-forest-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-forest-50 rounded-xl p-4">
                      <p className="text-xs text-forest-500 mb-1">الفئات العمرية</p>
                      <p className="font-bold text-forest-900">{comp.ageFrom} - {comp.ageTo} سنة</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <p className="text-xs text-yellow-600 mb-1">الحفظ المطلوب</p>
                      <p className="font-bold text-yellow-900">{comp.requiredParts}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs text-blue-600 mb-1">المسارات</p>
                      <p className="font-bold text-blue-900 text-xs">{comp.tracks.join(' • ')}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-forest-800 text-sm mb-3">الطلاب المسجلون</p>
                    {registered.length === 0 ? (
                      <p className="text-sm text-forest-400 text-center py-4">لا يوجد طلاب مسجلون بعد</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {registered.map(s => (
                          <div key={s.id} className="flex items-center gap-3 p-3 bg-forest-50 rounded-xl">
                            <div className="w-9 h-9 bg-forest-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-forest-900 text-sm">{s.name}</p>
                              <p className="text-xs text-forest-500">حفظ {s.memorizedJuz} جزء</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
