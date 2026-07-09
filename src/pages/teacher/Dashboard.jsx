import { Users, UsersRound, ClipboardCheck, BookOpen, FileText, Trophy, ChevronLeft, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/teacher/ui/StatCard';
import Badge from '../../components/teacher/ui/Badge';

export default function Dashboard() {
  const { teacher, groups, students, exams, recentActivities, competitions } = useApp();
  const myGroups = groups.filter(g => teacher.groups.includes(g.id));
  const myStudents = students.filter(s => teacher.groups.includes(s.groupId));
  const upcomingExams = exams.filter(e => e.status === 'قادم');
  const todayPresent = Math.floor(myStudents.length * 0.85);

  const quickActions = [
    { label: 'تسجيل الحضور', to: '/attendance', icon: ClipboardCheck, color: 'bg-forest-700' },
    { label: 'إضافة تسميع', to: '/memorization', icon: BookOpen, color: 'bg-yellow-500' },
    { label: 'إنشاء اختبار', to: '/exams', icon: FileText, color: 'bg-blue-600' },
    { label: 'المسابقات', to: '/competitions', icon: Trophy, color: 'bg-purple-600' },
  ];

  const activityIcons = {
    attendance: <ClipboardCheck size={16} className="text-forest-600" />,
    memorization: <BookOpen size={16} className="text-yellow-600" />,
    exam: <FileText size={16} className="text-blue-600" />,
    results: <Trophy size={16} className="text-purple-600" />,
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-l from-forest-700 to-forest-900 rounded-2xl p-6 text-white relative overflow-hidden star-bg">
        <div className="relative z-10">
          <p className="text-forest-200 text-sm mb-1">مرحباً بك في بوابة المعلم</p>
          <h1 className="text-2xl font-bold mb-1">{teacher.name}</h1>
          <p className="text-forest-300 text-sm">{teacher.specialization} • خبرة {teacher.experience}</p>
          <div className="flex gap-6 mt-4">
            <div>
              <p className="text-2xl font-bold text-gold-300">{myGroups.length}</p>
              <p className="text-forest-300 text-xs">حلقات</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gold-300">{myStudents.length}</p>
              <p className="text-forest-300 text-xs">طالب</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gold-300">{upcomingExams.length}</p>
              <p className="text-forest-300 text-xs">اختبارات قادمة</p>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 w-32 h-32 bg-white/5 rounded-full -translate-x-12 -translate-y-8" />
        <div className="absolute left-16 bottom-0 w-20 h-20 bg-white/5 rounded-full translate-y-6" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="حلقاتي" value={myGroups.length} icon={UsersRound} color="forest" />
        <StatCard label="الطلاب" value={myStudents.length} icon={Users} color="gold" />
        <StatCard label="حضور اليوم" value={todayPresent} icon={ClipboardCheck} color="blue" sub={`من ${myStudents.length} طالب`} />
        <StatCard label="اختبارات قادمة" value={upcomingExams.length} icon={FileText} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card">
          <h2 className="font-bold text-forest-900 mb-4 text-sm">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ label, to, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-forest-50 hover:bg-forest-100 transition-colors group"
              >
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-forest-700 text-center">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-forest-900 text-sm">الاختبارات القادمة</h2>
            <Link to="/exams" className="text-xs text-forest-500 hover:text-forest-700 flex items-center gap-1">
              عرض الكل <ChevronLeft size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingExams.slice(0, 3).map(exam => (
              <div key={exam.id} className="flex items-start gap-3 p-3 bg-forest-50 rounded-xl">
                <div className="w-9 h-9 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CalendarDays size={16} className="text-forest-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-forest-900 truncate">{exam.title}</p>
                  <p className="text-xs text-forest-500">{exam.groupName}</p>
                  <p className="text-xs text-forest-400 mt-0.5">{exam.date}</p>
                </div>
              </div>
            ))}
            {upcomingExams.length === 0 && (
              <p className="text-sm text-forest-400 text-center py-4">لا توجد اختبارات قادمة</p>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h2 className="font-bold text-forest-900 mb-4 text-sm">النشاطات الأخيرة</h2>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-forest-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  {activityIcons[activity.type] || <ClipboardCheck size={16} className="text-forest-400" />}
                </div>
                <div>
                  <p className="text-sm text-forest-800">{activity.text}</p>
                  <p className="text-xs text-forest-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Groups */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-forest-900">حلقاتي</h2>
          <Link to="/groups" className="text-sm text-forest-500 hover:text-forest-700 flex items-center gap-1">
            عرض الكل <ChevronLeft size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myGroups.map(group => {
            const groupStudents = students.filter(s => s.groupId === group.id);
            return (
              <Link key={group.id} to={`/groups/${group.id}`} className="card hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-forest-700 rounded-xl flex items-center justify-center shadow-sm">
                    <UsersRound size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-forest-900 text-sm">{group.name}</p>
                    <Badge variant={group.color === 'gold' ? 'gold' : 'green'}>{group.level}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-forest-500">الطلاب</span>
                  <span className="font-bold text-forest-900">{groupStudents.length} / {group.maxStudents}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-forest-100 rounded-full h-1.5 mb-3">
                  <div
                    className="bg-forest-600 h-1.5 rounded-full"
                    style={{ width: `${(groupStudents.length / group.maxStudents) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-forest-400">{group.schedule}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Competitions */}
      <div>
        <h2 className="font-bold text-forest-900 mb-4">المسابقات القادمة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitions.map(comp => (
            <div key={comp.id} className="card flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trophy size={24} className="text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-forest-900 text-sm">{comp.title}</p>
                  <Badge variant={comp.status === 'مفتوح للتسجيل' ? 'green' : 'gold'}>{comp.status}</Badge>
                </div>
                <p className="text-xs text-forest-500 mt-1">{comp.location} • {comp.date}</p>
                <p className="text-xs text-forest-400 mt-1">
                  {comp.registeredStudents.length} طالب مسجل
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
