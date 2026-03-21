import { useState } from "react";
import { useTheme } from "../../lib/theme";

export default function Row({ children, style, onClick, hover }) {
  const C = useTheme();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-[--radius-md]"
      style={{
        padding: "11px 14px",
        background: hovered && hover ? C.raised : C.card,
        border: `1px solid ${C.border}`,
        boxShadow: C.shadow,
        cursor: onClick ? "pointer" : "default",
        transition: "background 0.12s",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
