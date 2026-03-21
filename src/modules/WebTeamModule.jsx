import { useState } from "react";
import { useTheme } from "../lib/theme";
import { priorityConfig } from "../lib/constants";
import { WEB_TASKS } from "../lib/mockData";
import Pill from "../components/ui/Pill";
import Tabs from "../components/ui/Tabs";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";
import StatCard from "../components/ui/StatCard";

const TAB_LIST = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "backlog", label: "Backlog" },
  { id: "all", label: "All" },
];

export default function WebTeamModule() {
  const C = useTheme();
  const [tab, setTab] = useState("all");
  const pc = priorityConfig(C);

  const filtered = WEB_TASKS.filter((t) => {
    if (tab === "all") return true;
    return t.status === tab;
  });

  const todo = WEB_TASKS.filter((t) => t.status === "todo").length;
  const inProgress = WEB_TASKS.filter((t) => t.status === "in_progress").length;
  const backlog = WEB_TASKS.filter((t) => t.status === "backlog").length;

  return (
    <div>
      {/* Summary Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
        <StatCard label="To Do" value={todo} color={C.amber} />
        <StatCard label="In Progress" value={inProgress} color={C.blue} />
        <StatCard label="Backlog" value={backlog} color={C.text3} />
      </div>

      {/* Tabs */}
      <Tabs tabs={TAB_LIST} active={tab} onChange={setTab} />

      {/* Task Rows */}
      <Section title="Tasks" count={filtered.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((t) => {
            const pri = pc[t.priority] || pc.medium;
            return (
              <Row key={t.id} hover>
                {/* Priority bar */}
                <div
                  style={{
                    width: 3,
                    height: 36,
                    borderRadius: 2,
                    background: pri.c,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{t.task}</span>
                    <Pill color={pri.c} small>
                      {pri.l}
                    </Pill>
                  </div>
                  <div style={{ fontSize: 11, color: C.text3 }}>
                    {t.site} — {t.assignee} — Due {t.due}
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
