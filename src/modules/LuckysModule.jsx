import { useEffect } from "react";
import { useTheme } from "../lib/theme";
import useProjects from "../stores/useProjects";
import Pill from "../components/ui/Pill";
import Bar from "../components/ui/Bar";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";

export default function LuckysModule() {
  const C = useTheme();
  const { projects, fetch: fetchProjects } = useProjects();

  useEffect(() => { fetchProjects(); }, []);

  const luckysProjects = projects.filter((p) => p.company === "luckys");

  return (
    <div>
      {/* Lucky's Branding Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.luckys}18, ${C.luckys}08)`,
          border: `1px solid ${C.luckys}30`,
          borderRadius: "var(--radius-md)",
          padding: "16px 20px",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: C.luckys }}>Lucky's Concrete</div>
        <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>
          Operations platform, city sites, and construction projects
        </div>
      </div>

      {/* Project Cards */}
      <Section title="Lucky's Projects" count={luckysProjects.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {luckysProjects.map((p) => {
            const statusColor =
              p.status === "active" ? C.green : p.status === "stalled" ? C.red : C.text3;

            return (
              <Row key={p.id} hover>
                <div
                  style={{
                    width: 3,
                    height: 40,
                    borderRadius: 2,
                    background: C.luckys,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</span>
                    <Pill color={statusColor} small>
                      {p.status.toUpperCase()}
                    </Pill>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <Bar value={p.progress} color={C.luckys} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.text2, fontFamily: "var(--font-mono)", minWidth: 32, textAlign: "right" }}>
                      {p.progress}%
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>
                    {p.done}/{p.tasks} tasks — Due {p.due} — {p.assignee}
                  </div>
                </div>
              </Row>
            );
          })}
        </div>
      </Section>

      {/* Open Full Platform Button */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <a
          href="https://luckys-ops.up.railway.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            borderRadius: "var(--radius-sm)",
            background: C.luckys,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            boxShadow: C.shadow,
            transition: "opacity 0.12s",
          }}
        >
          Open Full Platform
        </a>
      </div>
    </div>
  );
}
