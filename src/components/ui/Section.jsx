export default function Section({ title, count, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[13px] font-bold">{title}</span>
        {count != null && (
          <span className="text-[11px] text-[#888]">({count})</span>
        )}
      </div>
      {children}
    </div>
  );
}
