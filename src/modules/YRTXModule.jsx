import { useTheme } from "../lib/theme";
import { YRTX_KEYWORDS } from "../lib/mockData";

export default function YRTXModule() {
  const C = useTheme();

  const kdColor = (kd) => {
    if (kd <= 15) return C.green;
    if (kd <= 30) return C.amber;
    return C.red;
  };

  return (
    <div>
      {/* YRTX Branding Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.red}18, ${C.red}08)`,
          border: `1px solid ${C.red}30`,
          borderRadius: "var(--radius-md)",
          padding: "16px 20px",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: C.red }}>YRTX</div>
        <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>
          Young Republicans of Texas — SEO + Google Ads Campaign
        </div>
      </div>

      {/* Keyword Table */}
      <div
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: "var(--radius-md)",
          boxShadow: C.shadow,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 70px 60px 50px 50px",
            padding: "10px 14px",
            borderBottom: `1px solid ${C.border}`,
            fontSize: 10,
            fontWeight: 700,
            color: C.text3,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          <span>Keyword</span>
          <span style={{ textAlign: "right" }}>Vol</span>
          <span style={{ textAlign: "right" }}>Pos</span>
          <span style={{ textAlign: "center" }}>{"\u0394"}</span>
          <span style={{ textAlign: "right" }}>KD</span>
        </div>

        {/* Rows */}
        {YRTX_KEYWORDS.map((kw, i) => (
          <div
            key={kw.keyword}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 70px 60px 50px 50px",
              padding: "10px 14px",
              borderBottom: i < YRTX_KEYWORDS.length - 1 ? `1px solid ${C.border}` : "none",
              fontSize: 13,
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 600, color: C.text }}>{kw.keyword}</span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: C.text2 }}>
              {kw.volume.toLocaleString()}
            </span>
            <span style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: kw.position ? C.text : C.text4 }}>
              {kw.position ?? "—"}
            </span>
            <span
              style={{
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                color: kw.change > 0 ? C.green : kw.change < 0 ? C.red : C.text3,
              }}
            >
              {kw.change > 0 ? `+${kw.change}` : kw.change === 0 ? "—" : kw.change}
            </span>
            <span
              style={{
                textAlign: "right",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                color: kdColor(kw.difficulty),
              }}
            >
              {kw.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
