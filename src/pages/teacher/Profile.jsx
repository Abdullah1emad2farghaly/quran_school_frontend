import { useState } from 'react';
import { Phone, Mail, User, Lock, UsersRound, Building, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/teacher/ui/Modal';
import Badge from '../../components/teacher/ui/Badge';

export default function Profile() {
  const { teacher, groups } = useApp();
  const [pwModal, setPwModal] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);

  const myGroups = groups.filter(g => teacher.groups.includes(g.id));

  const handleSavePw = () => {
    if (!pw.current || !pw.next || !pw.confirm) return;
    if (pw.next !== pw.confirm) return;
    setPwSaved(true);
    setTimeout(() => { setPwSaved(false); setPwModal(false); setPw({ current: '', next: '', confirm: '' }); }, 1500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-forest-900">الملف الشخصي</h1>
        <p className="text-sm text-forest-500 mt-1">معلوماتك الشخصية</p>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-forest-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
            {teacher.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-forest-900">{teacher.name}</h2>
            <p className="text-forest-500 text-sm mt-0.5">{teacher.specialization}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="green">معلم تحفيظ</Badge>
              <Badge variant="gold">خبرة {teacher.experience}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="card space-y-4">
        <h3 className="font-bold text-forest-900 text-sm mb-2">المعلومات الشخصية</h3>
        {[
          { icon: User, label: 'الاسم الكامل', value: teacher.name },
          { icon: Phone, label: 'رقم الهاتف', value: teacher.phone },
          { icon: Mail, label: 'البريد الإلكتروني', value: teacher.email },
          { icon: User, label: 'اسم المستخدم', value: teacher.username },
          { icon: Building, label: 'تاريخ الانضمام', value: teacher.joinDate },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 py-2 border-b border-forest-50 last:border-0">
            <div className="w-9 h-9 bg-forest-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon size={16} className="text-forest-500" />
            </div>
            <div>
              <p className="text-xs text-forest-400">{label}</p>
              <p className="text-sm font-semibold text-forest-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Groups */}
      <div className="card">
        <h3 className="font-bold text-forest-900 text-sm mb-4">الحلقات المسندة</h3>
        <div className="space-y-3">
          {myGroups.map(g => (
            <div key={g.id} className="flex items-center gap-3 p-3 bg-forest-50 rounded-xl">
              <div className="w-9 h-9 bg-forest-700 rounded-lg flex items-center justify-center">
                <UsersRound size={16} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-forest-900 text-sm">{g.name}</p>
                <p className="text-xs text-forest-400">{g.schedule}</p>
              </div>
              <Badge variant={g.color === 'gold' ? 'gold' : 'green'} className="mr-auto">{g.level}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Password */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-forest-900 text-sm">كلمة المرور</h3>
            <p className="text-xs text-forest-400 mt-0.5">يمكنك تغيير كلمة المرور هنا</p>
          </div>
          <button onClick={() => setPwModal(true)} className="btn-secondary text-xs">
            <Lock size={14} /> تغيير كلمة المرور
          </button>
        </div>
      </div>

      {/* Password Modal */}
      <Modal open={pwModal} onClose={() => setPwModal(false)} title="تغيير كلمة المرور" size="sm">
        <div className="space-y-4">
          {[
            { label: 'كلمة المرور الحالية', key: 'current' },
            { label: 'كلمة المرور الجديدة', key: 'next' },
            { label: 'تأكيد كلمة المرور', key: 'confirm' },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-forest-600 block mb-1.5">{label}</label>
              <input
                type="password"
                value={pw[key]}
                onChange={e => setPw(p => ({ ...p, [key]: e.target.value }))}
                className="input-field"
                placeholder="••••••••"
              />
            </div>
          ))}
          {pw.next && pw.confirm && pw.next !== pw.confirm && (
            <p className="text-xs text-red-500">كلمتا المرور غير متطابقتين</p>
          )}
          <div className="flex gap-3 mt-2">
            <button onClick={() => setPwModal(false)} className="btn-secondary flex-1 justify-center">إلغاء</button>
            <button onClick={handleSavePw} className={`btn-primary flex-1 justify-center ${pwSaved ? 'bg-emerald-600' : ''}`}>
              {pwSaved ? 'تم التغيير ✓' : 'حفظ'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
