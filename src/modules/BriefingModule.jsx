import { useEffect } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel, statusConfig, formatTime } from "../lib/constants";
import { EVENTS, EMAILS } from "../lib/mockData";
import useProjects from "../stores/useProjects";
import useAgentJobs from "../stores/useAgentJobs";
import StatCard from "../components/ui/StatCard";
import Pill from "../components/ui/Pill";
import Dot from "../components/ui/Dot";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";

export default function BriefingModule() {
  const C = useTheme();
  const sc = statusConfig(C);
  const { projects, fetch: fetchProjects } = useProjects();
  const { jobs, fetch: fetchJobs } = useAgentJobs();

  useEffect(() => {
    fetchProjects();
    fetchJobs();
  }, []);

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const stalledProjects = projects.filter((p) => p.status === "stalled").length;
  const unreadEmails = EMAILS.filter((e) => e.unread).length;
  const activeAgentJobs = jobs.filter((j) => j.status === "building" || j.status === "reviewing");
  const stalled = projects.filter((p) => p.status === "stalled");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{greeting}, Andrew</div>
        <div style={{ fontSize: 13, color: C.text3, marginTop: 4 }}>
          Here's your daily briefing for {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        <StatCard label="Active Projects" value={activeProjects} color={C.green} />
        <StatCard label="Stalled" value={stalledProjects} color={C.red} />
        <StatCard label="Unread Emails" value={unreadEmails} color={C.amber} />
        <StatCard label="Agents Working" value={activeAgentJobs.length} color={C.blue} />
      </div>

      {/* Today's Schedule */}
      <Section title="Today's Schedule" count={EVENTS.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {EVENTS.map((ev) => (
            <Row key={ev.id} hover>
              <div
                style={{
                  width: 3,
                  height: 32,
                  borderRadius: 2,
                  background: companyColor(ev.company, C),
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{ev.title}</div>
                <div style={{ fontSize: 11, color: C.text3 }}>
                  {ev.time} — {ev.end}
                </div>
              </div>
              <Pill color={companyColor(ev.company, C)} small>
                {companyLabel(ev.company)}
              </Pill>
            </Row>
          ))}
        </div>
      </Section>

      {/* Agents Working */}
      <Section title="Agents Working" count={activeAgentJobs.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {activeAgentJobs.map((job) => (
            <Row key={job.id} hover>
              <Dot color={sc[job.status].c} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{job.title}</div>
                <div style={{ fontSize: 11, color: C.text3 }}>
                  {job.target} — Pass {job.agent_pass}/{job.total_passes} — {formatTime(job.elapsed)}
                </div>
              </div>
              <Pill color={sc[job.status].c} small>
                {sc[job.status].l}
              </Pill>
            </Row>
          ))}
        </div>
      </Section>

      {/* Stalled Projects */}
      {stalled.length > 0 && (
        <Section title="Stalled Projects" count={stalled.length}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {stalled.map((p) => (
              <Row key={p.id} hover>
                <Dot color={C.red} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.text3 }}>
                    {p.done}/{p.tasks} tasks — Due {p.due} — {p.assignee}
                  </div>
                </div>
                <Pill color={companyColor(p.company, C)} small>
                  {companyLabel(p.company)}
                </Pill>
              </Row>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
