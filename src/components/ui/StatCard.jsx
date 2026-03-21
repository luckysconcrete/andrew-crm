import { useTheme } from "../../lib/theme";

export default function StatCard({ label, value, color }) {
  const C = useTheme();
  return (
    <div
      className="rounded-[--radius-md] text-center"
      style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        boxShadow: C.shadow,
        padding: "10px 12px",
      }}
    >
      <div
        className="font-[800] font-mono"
        style={{ fontSize: 18, color: color || C.text }}
      >
        {value}
      </div>
      <div
        className="font-bold uppercase tracking-wide"
        style={{ fontSize: 9, color: C.text3, letterSpacing: "0.06em" }}
      >
        {label}
      </div>
    </div>
  );
}
