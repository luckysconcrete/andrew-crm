import { useState, useEffect } from "react";
import { ThemeCtx, LIGHT, DARK } from "./lib/theme";
import { MODULES } from "./lib/constants";
import { EMAILS, VOICE_MEMOS, WEB_TASKS, AGENT_JOBS } from "./lib/mockData";
import Sidebar from "./components/Sidebar";
import MobileBottomNav from "./components/MobileBottomNav";
import BriefingModule from "./modules/BriefingModule";
import ProjectsModule from "./modules/ProjectsModule";
import WebTeamModule from "./modules/WebTeamModule";
import SitesModule from "./modules/SitesModule";
import YRTXModule from "./modules/YRTXModule";
import EmailModule from "./modules/EmailModule";
import CalendarModule from "./modules/CalendarModule";
import VoiceModule from "./modules/VoiceModule";
import AgentsModule from "./modules/AgentsModule";
import AgentSettings from "./modules/AgentSettings";
import LuckysModule from "./modules/LuckysModule";

const MOD_MAP = {
  briefing: BriefingModule,
  projects: ProjectsModule,
  webteam: WebTeamModule,
  sites: SitesModule,
  yrtx: YRTXModule,
  email: EmailModule,
  calendar: CalendarModule,
  voice: VoiceModule,
  luckys: LuckysModule,
};

export default function App() {
  const [dark, setDark] = useState(false);
  const [active, setActive] = useState("briefing");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const check = () => {
      const m = window.innerWidth < 768;
      setMobile(m);
      if (m) setMobileOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const T = dark ? DARK : LIGHT;
  const mod = MODULES.find((m) => m.id === active);

  const doNav = (id) => {
    setActive(id);
    setMobileOpen(false);
    setShowSettings(false);
  };

  const urgentBadges = {
    email: EMAILS.filter((e) => e.unread).length,
    voice: VOICE_MEMOS.flatMap((m) => m.parsed).filter((t) => t.status === "pending").length,
    webteam: WEB_TASKS.filter((t) => t.assignee === "Unassigned").length,
    agents: AGENT_JOBS.filter((j) =>
      ["building", "reviewing", "testing", "deploying"].includes(j.status)
    ).length,
  };

  const activeAgentCount = AGENT_JOBS.filter((j) =>
    ["building", "reviewing"].includes(j.status)
  ).length;

  let Content;
  if (active === "agents" && showSettings) {
    Content = () => <AgentSettings onBack={() => setShowSettings(false)} />;
  } else if (active === "agents") {
    Content = () => <AgentsModule onSettings={() => setShowSettings(true)} />;
  } else {
    Content = MOD_MAP[active] || BriefingModule;
  }

  const showNav = mobile ? mobileOpen : true;

  return (
    <ThemeCtx.Provider value={T}>
      <div
        style={{
          fontFamily: "var(--font-body)",
          background: T.bg,
          color: T.text,
          minHeight: "100vh",
          display: "flex",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <style>{`
          body { margin: 0; background: ${T.bg}; transition: background 0.2s; }
          ::-webkit-scrollbar-thumb { background: ${T.border}; }
          .nav-tt { position: relative; }
          .nav-tt .tt {
            display: none; position: absolute;
            left: calc(100% + 8px); top: 50%; transform: translateY(-50%);
            padding: 4px 10px; border-radius: 6px; font-size: 11px;
            font-weight: 600; white-space: nowrap; z-index: 200; pointer-events: none;
          }
          .nav-tt:hover .tt { display: block; }
        `}</style>

        {/* Mobile overlay */}
        {mobile && mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 90,
              transition: "opacity 0.2s",
            }}
          />
        )}

        {/* Sidebar */}
        {showNav && (
          <Sidebar
            active={active}
            onNav={doNav}
            collapsed={collapsed && !mobile}
            onCollapse={() => setCollapsed(!collapsed)}
            mobile={mobile}
            urgentBadges={urgentBadges}
          />
        )}

        {/* Main */}
        <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <header
            style={{
              padding: "10px 18px",
              borderBottom: `1px solid ${T.border}`,
              background: T.headerBg,
              display: "flex",
              alignItems: "center",
              gap: 10,
              position: "sticky",
              top: 0,
              zIndex: 50,
              transition: "background 0.2s",
            }}
          >
            <button
              onClick={() => {
                if (mobile) setMobileOpen(!mobileOpen);
                else setCollapsed(!collapsed);
              }}
              style={{
                background: "none",
                border: "none",
                color: T.text3,
                fontSize: 18,
                cursor: "pointer",
                padding: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              ☰
            </button>
            <span style={{ fontSize: 16 }}>{mod?.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
              {showSettings ? "Agent Settings" : mod?.label}
            </span>
            <div style={{ flex: 1 }} />

            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              title={dark ? "Light mode" : "Dark mode"}
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${T.border}`,
                background: T.card,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                transition: "all 0.15s",
              }}
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {activeAgentCount > 0 && (
              <button
                onClick={() => doNav("agents")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  background: `${T.green}10`,
                  border: `1px solid ${T.green}20`,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: T.green,
                    animation: "pulse-dot 1.5s infinite",
                  }}
                />
                <span style={{ fontSize: 10, color: T.green, fontWeight: 600 }}>
                  {activeAgentCount} agents active
                </span>
              </button>
            )}
          </header>

          <div
            style={{
              padding: mobile ? 14 : 22,
              maxWidth: 780,
              width: "100%",
              margin: "0 auto",
              paddingBottom: mobile ? 80 : 22,
            }}
          >
            <Content />
          </div>
        </main>

        {/* Mobile bottom nav */}
        {mobile && <MobileBottomNav active={active} onNav={doNav} urgentBadges={urgentBadges} />}
      </div>
    </ThemeCtx.Provider>
  );
}
