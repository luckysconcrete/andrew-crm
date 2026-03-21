import { useState } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel, typeConfig, statusConfig, formatTime } from "../lib/constants";
import { AGENT_JOBS } from "../lib/mockData";
import Pill from "../components/ui/Pill";
import Dot from "../components/ui/Dot";
import Bar from "../components/ui/Bar";
import Tabs from "../components/ui/Tabs";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";
import StatCard from "../components/ui/StatCard";

const VIEW_TABS = [
  { id: "active", label: "Active" },
  { id: "queued", label: "Queue" },
  { id: "complete", label: "Done" },
  { id: "all", label: "All" },
];

export default function AgentsModule({ onSettings }) {
  const C = useTheme();
  const [view, setView] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [newJob, setNewJob] = useState("");

  const tc = typeConfig(C);
  const sc = statusConfig(C);

  const activeStatuses = ["building", "reviewing", "testing", "deploying"];

  const filtered = AGENT_JOBS.filter((j) => {
    if (view === "active") return activeStatuses.includes(j.status);
    if (view === "queued") return j.status === "queued";
    if (view === "complete") return j.status === "complete";
    return true;
  });

  const activeCount = AGENT_JOBS.filter((j) => activeStatuses.includes(j.status)).length;
  const queuedCount = AGENT_JOBS.filter((j) => j.status === "queued").length;
  const doneCount = AGENT_JOBS.filter((j) => j.status === "complete").length;

  return (
    <div>
      {/* Header with settings */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Agent Monitor
          </div>
        </div>
        {onSettings && (
          <button
            onClick={onSettings}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "5px 14px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.text2,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Settings
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
        <StatCard label="Active" value={activeCount} color={C.blue} />
        <StatCard label="Queued" value={queuedCount} color={C.amber} />
        <StatCard label="Done" value={doneCount} color={C.green} />
      </div>

      {/* View Tabs */}
      <Tabs tabs={VIEW_TABS} active={view} onChange={setView} />

      {/* Job Cards */}
      <Section title="Jobs" count={filtered.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((job) => {
            const co = companyColor(job.company, C);
            const st = sc[job.status] || sc.queued;
            const tp = tc[job.type] || tc.code;
            const isOpen = expanded === job.id;
            const progress = job.total_passes > 0 ? Math.round((job.agent_pass / job.total_passes) * 100) : 0;

            return (
              <div key={job.id}>
                <Row
                  hover
                  onClick={() => setExpanded(isOpen ? null : job.id)}
                  style={{ cursor: "pointer" }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{tp.i}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{job.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Pill color={st.c} small>{st.l}</Pill>
                      <Pill color={co} small>{companyLabel(job.company)}</Pill>
                      <span style={{ fontSize: 11, color: C.text3 }}>{job.target}</span>
                    </div>
                    {job.status !== "queued" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <Bar value={progress} color={st.c} />
                        </div>
                        <span style={{ fontSize: 10, color: C.text3, fontFamily: "var(--font-mono)" }}>
                          {job.agent_pass}/{job.total_passes}
                        </span>
                        <span style={{ fontSize: 10, color: C.text3, fontFamily: "var(--font-mono)" }}>
                          {formatTime(job.elapsed)}
                        </span>
                      </div>
                    )}
                  </div>
                </Row>

                {/* Expanded Log */}
                {isOpen && (
                  <div
                    style={{
                      padding: "10px 14px",
                      background: C.raised,
                      borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                      border: `1px solid ${C.border}`,
                      borderTop: "none",
                      marginTop: -1,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: C.text3, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Details
                      </span>
                    </div>
                    <div style={{ color: C.text2, lineHeight: 1.6 }}>
                      <div>Type: <span style={{ fontWeight: 600 }}>{job.type}</span></div>
                      <div>Target: <span style={{ fontWeight: 600 }}>{job.target}</span></div>
                      <div>Started: <span style={{ fontWeight: 600 }}>{job.started || "—"}</span></div>
                      <div>Pass: <span style={{ fontWeight: 600 }}>{job.agent_pass}/{job.total_passes}</span></div>
                      <div>Elapsed: <span style={{ fontWeight: 600 }}>{formatTime(job.elapsed)}</span></div>
                      {job.result && (
                        <div style={{ marginTop: 6, padding: "6px 10px", background: `${C.green}10`, borderRadius: "var(--radius-sm)", border: `1px solid ${C.green}20`, color: C.green, fontWeight: 600 }}>
                          Result: {job.result}
                        </div>
                      )}
                      {job.pr_url && (
                        <div style={{ marginTop: 4 }}>
                          <a href={job.pr_url} style={{ color: C.blue, fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
                            View PR
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* New Job Submission */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
          Submit New Job
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Describe the task for an agent..."
            value={newJob}
            onChange={(e) => setNewJob(e.target.value)}
            style={{
              flex: 1,
              padding: "9px 12px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${C.border}`,
              background: C.inputBg,
              color: C.text,
              fontSize: 13,
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
          />
          <button
            style={{
              padding: "9px 20px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: C.amber,
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Queue
          </button>
        </div>
      </div>
    </div>
  );
}
