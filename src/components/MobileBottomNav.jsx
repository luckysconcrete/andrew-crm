import { useTheme } from "../lib/theme";
import { MODULES, MOBILE_NAV_TABS } from "../lib/constants";

export default function MobileBottomNav({ active, onNav, urgentBadges }) {
  const T = useTheme();
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: T.navBg,
        borderTop: `1px solid ${T.border}`,
        display: "flex",
        zIndex: 50,
        paddingBottom: "env(safe-area-inset-bottom, 6px)",
        transition: "background 0.2s",
      }}
    >
      {MOBILE_NAV_TABS.map((id) => {
        const m = MODULES.find((mod) => mod.id === id);
        const isA = active === id;
        const badge = urgentBadges[id] || 0;
        return (
          <button
            key={id}
            onClick={() => onNav(id)}
            style={{
              flex: 1,
              padding: "8px 0 4px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              fontFamily: "var(--font-body)",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 16, opacity: isA ? 1 : 0.45 }}>{m.icon}</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: isA ? T.amber : T.text4 }}>
              {m.label}
            </span>
            {badge > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: "calc(50% - 16px)",
                  fontSize: 8,
                  fontWeight: 800,
                  padding: "0 4px",
                  borderRadius: 6,
                  background: id === "agents" ? T.green : T.red,
                  color: "#fff",
                  lineHeight: "14px",
                }}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
