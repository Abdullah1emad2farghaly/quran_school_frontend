export default function Badge({ children, color = 'green' }) {
  const map = { green:'badge-green', red:'badge-red', yellow:'badge-yellow', blue:'badge-blue', gold:'badge-gold' };
  return <span className={map[color]||map.green}>{children}</span>;
}
export function StatusBadge({ status }) {
  const map = { 'نشط':'green', 'غائب متكرر':'red', 'حاضر':'green', 'غائب':'red', 'متأخر':'yellow', 'قادم':'blue', 'منتهي':'gold', 'مفتوح التسجيل':'green', 'قادمة':'blue' };
  return <Badge color={map[status]||'blue'}>{status}</Badge>;
}