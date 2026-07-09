import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, Users, ClipboardCheck, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Students from './Students';
import Attendance from './Attendance';
import Memorization from './Memorization';
import { getGroupStudents } from '../../api/services/teachersService';
import { set } from 'react-hook-form';
import formatTime from '../../utils/FormatTime';

const tabs = [
  { id: 'students', label: 'الطلاب', icon: Users },
  { id: 'attendance', label: 'الحضور', icon: ClipboardCheck },
  { id: 'memorization', label: 'التسميع', icon: BookOpen },
];

export default function GroupDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('students');
  const [groupStudents, setGroupStudents] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);


  useEffect(() => {
    const groupStudents = async () => {
      try {
        const result = await getGroupStudents(id);
        setGroupStudents(result.students);
        setGroupInfo(result.groupInfo);
      } catch (error) {
        console.log(error)
      }
    }
    groupStudents();
  }, [id])

  const groupedSchedules = groupInfo?.schedules?.reduce((acc, schedule) => {
    const key = `${schedule.startTime}-${schedule.endTime}`;

    if (!acc[key]) {
      acc[key] = {
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        days: [],
      };
    }

    acc[key].days.push(schedule.day);

    return acc;
  }, {});


  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/groups" className="text-forest-500 hover:text-forest-700 flex items-center gap-1">
          <ArrowRight size={16} /> حلقاتي
        </Link>
        <span className="text-forest-300">/</span>
        <span className="text-forest-900 font-semibold">{groupInfo?.groupName}</span>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-forest-900">{groupInfo?.groupName}</h1>
            {
              groupedSchedules && (
                <p className="text-sm text-forest-500 mt-1">
                  {Object.values(groupedSchedules).map((group, index) => (
                    <span key={index}>
                      {group.days.join(", ")} {formatTime(group.startTime)} - {formatTime(group.endTime)}
                      {index !== Object.values(groupedSchedules).length - 1 && " | "}
                    </span>
                  ))}
                </p>
              )
            }
          </div>
          <div className="text-left">
            <p className="text-2xl font-bold text-forest-900">{groupStudents?.length}<span className="text-base font-normal text-forest-400">/{groupInfo?.maxStudents}</span></p>
            <p className="text-xs text-forest-500">طالب</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-forest-100">
        {tabs.map(({ id: tid, label, icon: Icon }) => (
          <button
            key={tid}
            onClick={() => setActiveTab(tid)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tid
              ? 'bg-forest-700 text-white shadow-sm'
              : 'text-forest-600 hover:bg-forest-50'
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'students' && <Students groupId={groupInfo?.id} students={groupStudents} embedded />}
      {activeTab === 'attendance' && <Attendance groupId={groupInfo?.id} students={groupStudents} embedded />}
      {activeTab === 'memorization' && <Memorization groupId={groupInfo?.id} students={groupStudents} embedded />}
    </div>
  );
}
