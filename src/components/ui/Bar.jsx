import { useTheme } from "../../lib/theme";

export default function Bar({ value, color, h = 4 }) {
  const C = useTheme();
  return (
    <div
      className="flex-1 overflow-hidden rounded-sm"
      style={{ height: h, background: C.border }}
    >
      <div
        className="rounded-sm transition-[width] duration-400"
        style={{
          width: `${Math.min(value, 100)}%`,
          height: "100%",
          background: color || C.amber,
        }}
      />
    </div>
  );
}
