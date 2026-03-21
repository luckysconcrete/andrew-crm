import { useTheme } from "../../lib/theme";

export default function Tabs({ tabs, active, onChange }) {
  const C = useTheme();
  return (
    <div
      className="flex gap-[3px] rounded-[--radius-sm] p-[3px] mb-3.5"
      style={{ background: C.raised }}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex-1 font-semibold whitespace-nowrap cursor-pointer font-[family-name:var(--font-body)] border-none"
          style={{
            padding: "7px 4px",
            borderRadius: "var(--radius-sm)",
            fontSize: 11,
            background: active === t.id ? C.card : "transparent",
            color: active === t.id ? C.amber : C.text3,
            boxShadow: active === t.id ? C.shadow : "none",
            transition: "all 0.12s",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
