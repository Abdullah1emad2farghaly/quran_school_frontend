import { Search } from 'lucide-react';
export default function SearchBar({ value, onChange, placeholder = 'بحث...' }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400"/>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="inp pr-10 w-64"/>
    </div>
  );
}