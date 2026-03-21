import { useState } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel } from "../lib/constants";
import { SITES } from "../lib/mockData";
import Pill from "../components/ui/Pill";
import Dot from "../components/ui/Dot";
import Tabs from "../components/ui/Tabs";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";

const SORT_TABS = [
  { id: "status", label: "By Status" },
  { id: "traffic", label: "Traffic" },
  { id: "dr", label: "DR" },
];

const statusMeta = (C) => ({
  healthy: { c: C.green, l: "Healthy" },
  attention: { c: C.amber, l: "Attention" },
  needs_work: { c: C.red, l: "Needs Work" },
  new: { c: C.blue, l: "New" },
});

const trendIcon = (t) => (t === "up" ? "\u2191" : t === "down" ? "\u2193" : "\u2192");
const trendColor = (t, C) => (t === "up" ? C.green : t === "down" ? C.red : C.text3);

export default function SitesModule() {
  const C = useTheme();
  const [sort, setSort] = useState("status");
  const sm = statusMeta(C);

  const sorted = [...SITES].sort((a, b) => {
    if (sort === "traffic") return b.traffic - a.traffic;
    if (sort === "dr") return b.dr - a.dr;
    // by status: needs_work, attention, new, healthy
    const order = { needs_work: 0, attention: 1, new: 2, healthy: 3 };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  });

  return (
    <div>
      {/* Sort Tabs */}
      <Tabs tabs={SORT_TABS} active={sort} onChange={setSort} />

      {/* Site Rows */}
      <Section title="Sites" count={SITES.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sorted.map((s) => {
            const co = companyColor(s.company, C);
            const st = sm[s.status] || sm.healthy;
            return (
              <Row key={s.domain} hover>
                <Dot color={st.c} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.domain}</span>
                    <Pill color={st.c} small>{st.l}</Pill>
                    <Pill color={co} small>{companyLabel(s.company)}</Pill>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.text3 }}>
                    <span>
                      <span style={{ fontWeight: 700, color: C.text2, fontFamily: "var(--font-mono)" }}>DR {s.dr}</span>
                    </span>
                    <span>
                      <span style={{ fontWeight: 700, color: C.text2, fontFamily: "var(--font-mono)" }}>{s.keywords}</span> KW
                    </span>
                    <span>
                      <span style={{ fontWeight: 700, color: C.text2, fontFamily: "var(--font-mono)" }}>{s.traffic.toLocaleString()}</span> traffic
                    </span>
                    <span style={{ color: trendColor(s.trend, C), fontWeight: 700 }}>
                      {trendIcon(s.trend)} {s.trend}
                    </span>
                  </div>
                </div>
              </Row>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
