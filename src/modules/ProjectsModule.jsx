import { useState } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel } from "../lib/constants";
import { PROJECTS } from "../lib/mockData";
import StatCard from "../components/ui/StatCard";
import Pill from "../components/ui/Pill";
import Bar from "../components/ui/Bar";
import Tabs from "../components/ui/Tabs";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "stalled", label: "Stalled" },
  { id: "luckys", label: "Lucky's" },
  { id: "zas", label: "ZAS" },
  { id: "yrtx", label: "YRTX" },
];

export default function ProjectsModule() {
  const C = useTheme();
  const [filter, setFilter] = useState("all");

  const filtered = PROJECTS.filter((p) => {
    if (filter === "all") return true;
    if (filter === "stalled") return p.status === "stalled";
    return p.company === filter;
  });

  const active = PROJECTS.filter((p) => p.status === "active").length;
  const stalled = PROJECTS.filter((p) => p.status === "stalled").length;
  const totalTasks = PROJECTS.reduce((s, p) => s + p.tasks, 0);
  const totalDone = PROJECTS.reduce((s, p) => s + p.done, 0);

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        <StatCard label="Total" value={PROJECTS.length} color={C.text} />
        <StatCard label="Active" value={active} color={C.green} />
        <StatCard label="Stalled" value={stalled} color={C.red} />
        <StatCard label="Tasks Done" value={`${totalDone}/${totalTasks}`} color={C.amber} />
      </div>

      {/* Filter Tabs */}
      <Tabs tabs={FILTER_TABS} active={filter} onChange={setFilter} />

      {/* Project Cards */}
      <Section title="Projects" count={filtered.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((p) => {
            const co = companyColor(p.company, C);
            const statusColor =
              p.status === "active" ? C.green : p.status === "stalled" ? C.red : C.text3;

            return (
              <Row key={p.id} hover>
                <div
                  style={{
                    width: 3,
                    height: 40,
                    borderRadius: 2,
                    background: co,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</span>
                    <Pill color={statusColor} small>
                      {p.status.toUpperCase()}
                    </Pill>
                    <Pill color={co} small>
                      {companyLabel(p.company)}
                    </Pill>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <Bar value={p.progress} color={co} />
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
    </div>
  );
}
