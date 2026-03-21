import { useTheme } from "../../lib/theme";

export default function Pill({ children, color, small }) {
  const C = useTheme();
  return (
    <span
      className="font-bold whitespace-nowrap"
      style={{
        fontSize: small ? 9 : 10,
        padding: small ? "1px 5px" : "2px 8px",
        borderRadius: 5,
        background: `${color}${C.mode === "light" ? "15" : "18"}`,
        color,
        letterSpacing: "0.04em",
        lineHeight: 1.5,
      }}
    >
      {children}
    </span>
  );
}
