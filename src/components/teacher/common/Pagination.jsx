import { ChevronRight, ChevronLeft } from 'lucide-react';
export default function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      <button onClick={() => onChange(current-1)} disabled={current===1} className="p-2 rounded-xl hover:bg-forest-50 disabled:opacity-40"><ChevronRight size={18}/></button>
      {Array.from({length:total},(_,i)=>i+1).map(p=>(
        <button key={p} onClick={()=>onChange(p)} className={`w-9 h-9 rounded-xl text-sm font-semibold ${p===current?'bg-forest-600 text-white':'hover:bg-forest-50 text-forest-600'}`}>{p}</button>
      ))}
      <button onClick={() => onChange(current+1)} disabled={current===total} className="p-2 rounded-xl hover:bg-forest-50 disabled:opacity-40"><ChevronLeft size={18}/></button>
    </div>
  );
}