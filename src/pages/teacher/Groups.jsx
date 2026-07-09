import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersRound, Users, ClipboardCheck, BookOpen, ChevronLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Badge from '../../components/teacher/ui/Badge';
import { getMyGroups } from '../../api/services/teachersService';

export default function Groups() {
  const { teacher, groups, students } = useApp();
  const navigate = useNavigate();
  const [myGroups, setMyGroups] = useState([]);
  // const myGroups = groups.filter(g => teacher.groups.includes(g.id));
  useEffect(()=>{
    const myGroups = async ()=> {
      try{
        const res = await getMyGroups();
        console.log(res)
        setMyGroups(res);
      }catch(error){
        console.log(error);
      }
    }
    myGroups();
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-forest-900">حلقاتي</h1>
        <p className="text-sm text-forest-500 mt-1">إدارة الحلقات والطلاب المسندة إليك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {myGroups.map(group => {
          const groupStudents = students.filter(s => s.groupId === group.id);
          const avgProgress = groupStudents.length > 0
            ? Math.round(groupStudents.reduce((sum, s) => sum + (s.memorizedJuz / s.totalJuz) * 100, 0) / groupStudents.length)
            : 0;

          return (
            <div
              key={group.id}
              onClick={() => navigate(`/teacher/groups/${group.id}`)}
              className="card hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-transparent hover:border-forest-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-forest-700 rounded-2xl flex items-center justify-center shadow-md">
                    <UsersRound size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest-900">{group.groupName}</h3>
                    <Badge variant={group.color === 'gold' ? 'gold' : 'green'}>{group.currentSurah}</Badge>
                  </div>
                </div>
                <ChevronLeft size={18} className="text-forest-400 group-hover:text-forest-700 transition-colors" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-forest-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-forest-900">{group.studentsCount}</p>
                  <p className="text-xs text-forest-500">الطلاب</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-yellow-700">{group.maxStudents}</p>
                  <p className="text-xs text-yellow-600">الحد الأقصى</p>
                </div>
              </div>

              {/* Schedule */}
              <div className="text-xs text-forest-400 border-t border-forest-50 pt-3">
                {
                  group.schedules.map((schedule, index) => (
                    <p key={index}>
                      {schedule.day} {schedule.startTime} - {schedule.endTime}
                      {index < group.schedules.length - 1 && ', '}
                    </p>
                  ))
                }
              </div>

              {/* Quick links */}
              <div className="flex gap-2 mt-3">
                {[
                  { icon: Users, label: 'الطلاب' },
                  { icon: ClipboardCheck, label: 'الحضور' },
                  { icon: BookOpen, label: 'التسميع' },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1 text-xs bg-forest-50 text-forest-600 px-2 py-1 rounded-lg"
                  >
                    <Icon size={12} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
