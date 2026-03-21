import { useState } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel } from "../lib/constants";
import { EMAILS } from "../lib/mockData";
import Pill from "../components/ui/Pill";
import Dot from "../components/ui/Dot";
import Tabs from "../components/ui/Tabs";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "actionable", label: "Actionable" },
];

export default function EmailModule() {
  const C = useTheme();
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const filtered = EMAILS.filter((e) => {
    if (filter === "unread") return e.unread;
    if (filter === "actionable") return e.actionable;
    return true;
  });

  return (
    <div>
      {/* Filter Tabs */}
      <Tabs tabs={FILTER_TABS} active={filter} onChange={setFilter} />

      {/* Email List */}
      <Section title="Inbox" count={filtered.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.map((e) => {
            const co = companyColor(e.company, C);
            const isOpen = expanded === e.id;
            return (
              <div key={e.id}>
                <Row
                  hover
                  onClick={() => setExpanded(isOpen ? null : e.id)}
                  style={{ cursor: "pointer" }}
                >
                  {e.unread && <Dot color={C.amber} size={8} />}
                  {!e.unread && <Dot color={C.text4} size={8} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: e.unread ? 700 : 500,
                          color: C.text,
                        }}
                      >
                        {e.from}
                      </span>
                      <Pill color={co} small>
                        {companyLabel(e.company)}
                      </Pill>
                      {e.actionable && (
                        <Pill color={C.amber} small>
                          ACTION
                        </Pill>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: C.text2 }}>{e.subject}</div>
                  </div>
                  <span style={{ fontSize: 11, color: C.text3, flexShrink: 0 }}>{e.time}</span>
                </Row>

                {/* Expanded Actions */}
                {isOpen && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "10px 14px",
                      background: C.raised,
                      borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                      border: `1px solid ${C.border}`,
                      borderTop: "none",
                      marginTop: -1,
                    }}
                  >
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "5px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: `1px solid ${C.border}`,
                        background: C.card,
                        color: C.text,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Reply
                    </button>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "5px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: `1px solid ${C.border}`,
                        background: C.card,
                        color: C.text,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Forward
                    </button>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "5px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: `1px solid ${C.amber}40`,
                        background: `${C.amber}12`,
                        color: C.amber,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Create Task
                    </button>
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "5px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: `1px solid ${C.border}`,
                        background: C.card,
                        color: C.text3,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Archive
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
