export default function IslamicStar({ size = 28, color = '#c9973a', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill={color}
    >
      <polygon points="50,5 61,35 95,35 67,57 78,91 50,70 22,91 33,57 5,35 39,35" />
    </svg>
  );
}
