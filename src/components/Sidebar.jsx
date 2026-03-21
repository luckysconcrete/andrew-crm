import { useTheme } from "../lib/theme";
import { MODULES, GROUPS } from "../lib/constants";

export default function Sidebar({ active, onNav, collapsed, onCollapse, mobile, urgentBadges }) {
  const T = useTheme();
  const grouped = {};
  MODULES.forEach((m) => {
    if (!grouped[m.group]) grouped[m.group] = [];
    grouped[m.group].push(m);
  });

  return (
    <nav
      style={{
        width: mobile ? 250 : collapsed ? 56 : 200,
        background: T.navBg,
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        padding: collapsed && !mobile ? "14px 4px" : "14px 8px",
        ...(mobile
          ? { position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }
          : { position: "sticky", top: 0, height: "100vh" }),
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.2s ease, background 0.2s, padding 0.2s",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed && !mobile ? "6px 0 14px" : "6px 10px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: collapsed && !mobile ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: `linear-gradient(135deg, ${T.amber}, ${T.amberDim})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 900,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          A
        </div>
        {(!collapsed || mobile) && (
          <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
              Andrew CRM
            </div>
            <div style={{ fontSize: 9, color: T.text4, fontWeight: 500 }}>CEO Operating System</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      {Object.entries(grouped).map(([gid, mods]) => (
        <div key={gid} style={{ marginBottom: collapsed && !mobile ? 8 : 14 }}>
          {(!collapsed || mobile) && (
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: T.text4,
                padding: "0 10px 5px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {GROUPS[gid]}
            </div>
          )}
          {collapsed && !mobile && gid !== "daily" && (
            <div style={{ height: 1, background: T.border, margin: "4px 8px 6px" }} />
          )}
          {mods.map((m) => {
            const isA = active === m.id;
            const badge = urgentBadges[m.id] || 0;
            return (
              <div key={m.id} className={collapsed && !mobile ? "nav-tt" : undefined}>
                <button
                  onClick={() => onNav(m.id)}
                  title={collapsed && !mobile ? m.label : undefined}
                  style={{
                    width: "100%",
                    padding: collapsed && !mobile ? "8px 0" : "7px 10px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    fontFamily: "var(--font-body)",
                    textAlign: "left",
                    background: isA ? T.navActive : "transparent",
                    color: isA ? T.amber : T.text3,
                    transition: "all 0.1s",
                    justifyContent: collapsed && !mobile ? "center" : "flex-start",
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: 14, width: 20, textAlign: "center", flexShrink: 0 }}>
                    {m.icon}
                  </span>
                  {(!collapsed || mobile) && (
                    <span
                      style={{
                        flex: 1,
                        fontSize: 12,
                        fontWeight: isA ? 700 : 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {m.label}
                    </span>
                  )}
                  {(!collapsed || mobile) && badge > 0 && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "1px 5px",
                        borderRadius: 8,
                        background: m.id === "agents" ? `${T.green}20` : `${T.red}20`,
                        color: m.id === "agents" ? T.green : T.red,
                      }}
                    >
                      {badge}
                    </span>
                  )}
                  {collapsed && !mobile && badge > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 4,
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: m.id === "agents" ? T.green : T.red,
                      }}
                    />
                  )}
                </button>
                {collapsed && !mobile && (
                  <span
                    className="tt"
                    style={{
                      background: T.card,
                      color: T.text,
                      border: `1px solid ${T.border}`,
                      boxShadow: T.shadow,
                    }}
                  >
                    {m.label}
                    {badge > 0 ? ` (${badge})` : ""}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          marginTop: "auto",
          padding: collapsed && !mobile ? "8px 4px" : "10px 10px",
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          flexDirection: collapsed && !mobile ? "column" : "row",
          alignItems: "center",
          justifyContent: collapsed && !mobile ? "center" : "space-between",
          gap: collapsed && !mobile ? 6 : 0,
        }}
      >
        {(!collapsed || mobile) && <span style={{ fontSize: 10, color: T.text4 }}>v3.0</span>}
        <div
          style={{
            display: "flex",
            flexDirection: collapsed && !mobile ? "column" : "row",
            gap: 4,
            alignItems: "center",
          }}
        >
          <slot name="footer-buttons" />
        </div>
      </div>
    </nav>
  );
}
