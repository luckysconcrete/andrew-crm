import { useState } from "react";
import { useTheme } from "../lib/theme";

const DEFAULT_SETTINGS = [
  { key: "auto_deploy", label: "Auto-deploy on all passes complete", description: "Automatically deploy when all agent passes finish successfully", enabled: true },
  { key: "pr_review", label: "Require PR review before deploy", description: "Create a pull request and wait for review instead of auto-merging", enabled: true },
  { key: "slack_notify", label: "Slack notifications", description: "Send notifications to Slack when jobs start, complete, or fail", enabled: true },
  { key: "parallel_jobs", label: "Allow parallel jobs", description: "Run multiple agent jobs simultaneously instead of sequentially", enabled: false },
  { key: "auto_retry", label: "Auto-retry failed jobs", description: "Automatically retry jobs that fail up to 2 times", enabled: false },
  { key: "cost_limit", label: "Cost limit alerts", description: "Alert when agent API costs exceed daily threshold", enabled: true },
];

export default function AgentSettings({ onBack }) {
  const C = useTheme();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const toggleSetting = (key) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s))
    );
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
        {settings.map((s) => (
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
              onClick={() => toggleSetting(s.key)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 11,
                border: "none",
                background: s.enabled ? C.green : C.border,
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
                  left: s.enabled ? 21 : 3,
                  transition: "left 0.15s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
        <button
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
