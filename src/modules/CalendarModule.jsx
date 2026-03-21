import { useState } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel } from "../lib/constants";
import { EVENTS } from "../lib/mockData";
import Pill from "../components/ui/Pill";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";

export default function CalendarModule() {
  const C = useTheme();
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Build 10-day strip starting from today
  const days = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      date: d.getDate(),
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      month: d.toLocaleDateString("en-US", { month: "short" }),
      isToday: i === 0,
      full: d,
    };
  });

  return (
    <div>
      {/* 10-Day Strip */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 20,
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {days.map((d) => {
          const isSelected = d.date === selectedDay;
          return (
            <button
              key={d.date}
              onClick={() => setSelectedDay(d.date)}
              style={{
                flex: "0 0 auto",
                width: 52,
                padding: "8px 4px",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${isSelected ? C.amber : C.border}`,
                background: isSelected ? `${C.amber}15` : C.card,
                boxShadow: isSelected ? `0 0 0 1px ${C.amber}40` : C.shadow,
                cursor: "pointer",
                textAlign: "center",
                fontFamily: "var(--font-body)",
                transition: "all 0.12s",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 600, color: C.text3, textTransform: "uppercase" }}>
                {d.day}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: isSelected ? C.amber : C.text,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {d.date}
              </div>
              <div style={{ fontSize: 9, color: C.text3 }}>{d.month}</div>
              {d.isToday && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: C.amber,
                    margin: "3px auto 0",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Today's Events */}
      <Section title={selectedDay === today.getDate() ? "Today's Events" : `Events`} count={selectedDay === today.getDate() ? EVENTS.length : 0}>
        {selectedDay === today.getDate() ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {EVENTS.map((ev) => {
              const co = companyColor(ev.company, C);
              return (
                <Row key={ev.id} hover>
                  <div
                    style={{
                      width: 3,
                      height: 36,
                      borderRadius: 2,
                      background: co,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: C.text3 }}>
                      {ev.time} — {ev.end}
                    </div>
                  </div>
                  <Pill color={co} small>
                    {companyLabel(ev.company)}
                  </Pill>
                </Row>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: 30,
              fontSize: 13,
              color: C.text3,
              background: C.card,
              borderRadius: "var(--radius-md)",
              border: `1px solid ${C.border}`,
            }}
          >
            No events scheduled
          </div>
        )}
      </Section>
    </div>
  );
}
