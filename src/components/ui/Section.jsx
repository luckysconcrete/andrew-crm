export default function Section({ title, count, action, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[13px] font-bold">{title}</span>
        {count != null && (
          <span className="text-[11px] text-[#888]">({count})</span>
        )}
        {action && <div style={{ marginLeft: "auto" }}>{action}</div>}
      </div>
      {children}
    </div>
  );
}
