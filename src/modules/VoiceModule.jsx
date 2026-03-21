import { useState } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel, priorityConfig } from "../lib/constants";
import { VOICE_MEMOS } from "../lib/mockData";
import Pill from "../components/ui/Pill";
import Dot from "../components/ui/Dot";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";

export default function VoiceModule() {
  const C = useTheme();
  const pc = priorityConfig(C);

  // Track approval status per parsed task: key = `${memoId}-${taskIdx}`
  const [approvals, setApprovals] = useState(() => {
    const init = {};
    VOICE_MEMOS.forEach((m) => {
      m.parsed.forEach((p, i) => {
        init[`${m.id}-${i}`] = p.status;
      });
    });
    return init;
  });

  const toggleApproval = (memoId, taskIdx) => {
    const key = `${memoId}-${taskIdx}`;
    setApprovals((prev) => ({
      ...prev,
      [key]: prev[key] === "approved" ? "pending" : "approved",
    }));
  };

  return (
    <div>
      <Section title="Voice Memos" count={VOICE_MEMOS.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {VOICE_MEMOS.map((memo) => (
            <div
              key={memo.id}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: "var(--radius-md)",
                boxShadow: C.shadow,
                overflow: "hidden",
              }}
            >
              {/* Memo header */}
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.amber, fontFamily: "var(--font-mono)" }}>
                    {memo.duration}
                  </span>
                  <span style={{ fontSize: 11, color: C.text3 }}>{memo.time}</span>
                </div>
                <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.5, fontStyle: "italic" }}>
                  "{memo.transcript}"
                </div>
              </div>

              {/* Parsed tasks */}
              <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
                {memo.parsed.map((task, idx) => {
                  const key = `${memo.id}-${idx}`;
                  const status = approvals[key];
                  const co = companyColor(task.company, C);
                  const pri = pc[task.priority] || pc.medium;
                  const isApproved = status === "approved";

                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 10px",
                        borderRadius: "var(--radius-sm)",
                        background: isApproved ? `${C.green}08` : "transparent",
                        border: `1px solid ${isApproved ? `${C.green}25` : C.border}`,
                      }}
                    >
                      <Dot color={pri.c} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{task.text}</div>
                        <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                          <Pill color={co} small>{companyLabel(task.company)}</Pill>
                          <Pill color={pri.c} small>{pri.l}</Pill>
                          {task.due && (
                            <span style={{ fontSize: 10, color: C.text3 }}>Due {task.due}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleApproval(memo.id, idx)}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: `1px solid ${isApproved ? C.green : C.border}`,
                          background: isApproved ? `${C.green}15` : C.raised,
                          color: isApproved ? C.green : C.text3,
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          transition: "all 0.12s",
                        }}
                      >
                        {isApproved ? "Approved" : "Approve"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
