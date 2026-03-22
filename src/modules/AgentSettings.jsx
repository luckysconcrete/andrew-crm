import { useEffect } from "react";
import { useTheme } from "../lib/theme";
import useSettings from "../stores/useSettings";

export default function AgentSettings({ onBack }) {
  const C = useTheme();
  const { settings, fetch: fetchSettings, update, save } = useSettings();

  useEffect(() => { fetchSettings(); }, []);

  const SETTING_DEFS = [
    { key: "code_auto_deploy", label: "Auto-deploy on all passes complete", description: "Automatically deploy when all agent passes finish successfully" },
    { key: "code_review", label: "Require PR review before deploy", description: "Create a pull request and wait for review instead of auto-merging" },
    { key: "code_tests", label: "Run tests before deploy", description: "Run automated test suite before allowing deployment" },
    { key: "code_rollback", label: "Auto-rollback on failure", description: "Automatically rollback if deployment health checks fail" },
    { key: "notif_complete", label: "Notify on job complete", description: "Send notification when an agent job finishes successfully" },
    { key: "notif_failure", label: "Notify on job failure", description: "Send notification when an agent job fails" },
    { key: "budget_enabled", label: "Cost limit alerts", description: "Alert when agent API costs exceed daily threshold" },
  ];

  const handleSave = async () => {
    await save();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 12px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${C.border}`,
              background: C.card,
              color: C.text2,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
            }}
          >
            Back
          </button>
        )}
        <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Agent Settings</div>
      </div>

      {/* Toggle Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SETTING_DEFS.map((s) => {
          const enabled = !!settings[s.key];
          return (
            <div
              key={s.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: "var(--radius-md)",
                boxShadow: C.shadow,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.label}</div>
                <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{s.description}</div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => update(s.key, !enabled)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  border: "none",
                  background: enabled ? C.green : C.border,
                  cursor: "pointer",
                  position: "relative",
                  flexShrink: 0,
                  transition: "background 0.15s",
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute",
                    top: 3,
                    left: enabled ? 21 : 3,
                    transition: "left 0.15s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          style={{
            padding: "10px 28px",
            borderRadius: "var(--radius-sm)",
            border: "none",
            background: C.amber,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
