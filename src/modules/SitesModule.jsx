import { useState, useEffect } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel } from "../lib/constants";
import useSites from "../stores/useSites";
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

const EMPTY_FORM = { domain: "", company: "zas", dr: 0, keywords: 0, traffic: 0, status: "new" };

const inputStyle = (C) => ({
  padding: "8px 12px",
  borderRadius: "var(--radius-sm)",
  border: `1px solid ${C.border}`,
  background: C.inputBg,
  color: C.text,
  fontSize: 13,
  fontFamily: "var(--font-body)",
  width: "100%",
  outline: "none",
});

const selectStyle = (C) => ({
  ...inputStyle(C),
  cursor: "pointer",
});

const btnStyle = (C, color) => ({
  fontSize: 11,
  fontWeight: 700,
  padding: "5px 14px",
  borderRadius: "var(--radius-sm)",
  border: `1px solid ${color}40`,
  background: `${color}12`,
  color,
  cursor: "pointer",
  fontFamily: "var(--font-body)",
});

export default function SitesModule() {
  const C = useTheme();
  const { sites, fetch: fetchSites, create, update, remove } = useSites();
  const [sort, setSort] = useState("status");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const sm = statusMeta(C);

  useEffect(() => { fetchSites(); }, []);

  const sorted = [...sites].sort((a, b) => {
    if (sort === "traffic") return b.traffic - a.traffic;
    if (sort === "dr") return b.dr - a.dr;
    const order = { needs_work: 0, attention: 1, new: 2, healthy: 3 };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  });

  const handleCreate = async () => {
    if (!formData.domain.trim()) return;
    await create(formData);
    setFormData({ ...EMPTY_FORM });
    setShowForm(false);
  };

  const handleUpdate = async (id) => {
    await update(id, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this site?")) return;
    await remove(id);
  };

  const startEdit = (s) => {
    setEditingId(s.id || s.domain);
    setEditData({ domain: s.domain, company: s.company, dr: s.dr, keywords: s.keywords, traffic: s.traffic, status: s.status });
  };

  return (
    <div>
      {/* Sort Tabs */}
      <Tabs tabs={SORT_TABS} active={sort} onChange={setSort} />

      {/* Site Rows */}
      <Section
        title="Sites"
        count={sites.length}
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            style={btnStyle(C, C.amber)}
          >
            {showForm ? "Cancel" : "+ Add"}
          </button>
        }
      >
        {/* Inline Create Form */}
        {showForm && (
          <div style={{
            padding: 14,
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: "var(--radius-md)",
            marginBottom: 8,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <input
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="Domain (e.g. example.com)"
              style={inputStyle(C)}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <select
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                style={selectStyle(C)}
              >
                <option value="luckys">Lucky's</option>
                <option value="zas">ZAS</option>
                <option value="yrtx">YRTX</option>
                <option value="personal">Personal</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={selectStyle(C)}
              >
                <option value="healthy">Healthy</option>
                <option value="attention">Attention</option>
                <option value="needs_work">Needs Work</option>
                <option value="new">New</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                value={formData.dr}
                onChange={(e) => setFormData({ ...formData, dr: Number(e.target.value) })}
                placeholder="DR"
                style={inputStyle(C)}
              />
              <input
                type="number"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: Number(e.target.value) })}
                placeholder="Keywords"
                style={inputStyle(C)}
              />
              <input
                type="number"
                value={formData.traffic}
                onChange={(e) => setFormData({ ...formData, traffic: Number(e.target.value) })}
                placeholder="Traffic"
                style={inputStyle(C)}
              />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowForm(false)} style={btnStyle(C, C.text3)}>Cancel</button>
              <button onClick={handleCreate} style={btnStyle(C, C.green)}>Save</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sorted.map((s) => {
            const co = companyColor(s.company, C);
            const st = sm[s.status] || sm.healthy;
            const siteKey = s.id || s.domain;
            const isEditing = editingId === siteKey;

            if (isEditing) {
              return (
                <div
                  key={siteKey}
                  style={{
                    padding: 14,
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <input
                    value={editData.domain}
                    onChange={(e) => setEditData({ ...editData, domain: e.target.value })}
                    placeholder="Domain"
                    style={inputStyle(C)}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={editData.company}
                      onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                      style={selectStyle(C)}
                    >
                      <option value="luckys">Lucky's</option>
                      <option value="zas">ZAS</option>
                      <option value="yrtx">YRTX</option>
                      <option value="personal">Personal</option>
                    </select>
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      style={selectStyle(C)}
                    >
                      <option value="healthy">Healthy</option>
                      <option value="attention">Attention</option>
                      <option value="needs_work">Needs Work</option>
                      <option value="new">New</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="number"
                      value={editData.dr}
                      onChange={(e) => setEditData({ ...editData, dr: Number(e.target.value) })}
                      placeholder="DR"
                      style={inputStyle(C)}
                    />
                    <input
                      type="number"
                      value={editData.keywords}
                      onChange={(e) => setEditData({ ...editData, keywords: Number(e.target.value) })}
                      placeholder="Keywords"
                      style={inputStyle(C)}
                    />
                    <input
                      type="number"
                      value={editData.traffic}
                      onChange={(e) => setEditData({ ...editData, traffic: Number(e.target.value) })}
                      placeholder="Traffic"
                      style={inputStyle(C)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => setEditingId(null)} style={btnStyle(C, C.text3)}>Cancel</button>
                    <button onClick={() => handleUpdate(s.id)} style={btnStyle(C, C.green)}>Save</button>
                  </div>
                </div>
              );
            }

            return (
              <Row key={siteKey} hover>
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
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => startEdit(s)} style={btnStyle(C, C.blue)} title="Edit">
                    &#9998;
                  </button>
                  <button onClick={() => handleDelete(s.id)} style={btnStyle(C, C.red)} title="Delete">
                    &times;
                  </button>
                </div>
              </Row>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
