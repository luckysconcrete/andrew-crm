import { useState, useEffect } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel } from "../lib/constants";
import useProjects from "../stores/useProjects";
import StatCard from "../components/ui/StatCard";
import Pill from "../components/ui/Pill";
import Bar from "../components/ui/Bar";
import Tabs from "../components/ui/Tabs";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "stalled", label: "Stalled" },
  { id: "luckys", label: "Lucky's" },
  { id: "zas", label: "ZAS" },
  { id: "yrtx", label: "YRTX" },
];

const EMPTY_FORM = { name: "", company: "zas", status: "active", assignee: "", due: "" };

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

export default function ProjectsModule() {
  const C = useTheme();
  const { projects, fetch: fetchProjects, create, update, remove } = useProjects();
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter((p) => {
    if (filter === "all") return true;
    if (filter === "stalled") return p.status === "stalled";
    return p.company === filter;
  });

  const active = projects.filter((p) => p.status === "active").length;
  const stalled = projects.filter((p) => p.status === "stalled").length;
  const totalTasks = projects.reduce((s, p) => s + p.tasks, 0);
  const totalDone = projects.reduce((s, p) => s + p.done, 0);

  const handleCreate = async () => {
    if (!formData.name.trim()) return;
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
    if (!window.confirm("Delete this project?")) return;
    await remove(id);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditData({ name: p.name, company: p.company, status: p.status, assignee: p.assignee, due: p.due });
  };

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
        <StatCard label="Total" value={projects.length} color={C.text} />
        <StatCard label="Active" value={active} color={C.green} />
        <StatCard label="Stalled" value={stalled} color={C.red} />
        <StatCard label="Tasks Done" value={`${totalDone}/${totalTasks}`} color={C.amber} />
      </div>

      {/* Filter Tabs */}
      <Tabs tabs={FILTER_TABS} active={filter} onChange={setFilter} />

      {/* Project Cards */}
      <Section
        title="Projects"
        count={filtered.length}
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Project name"
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
                <option value="active">Active</option>
                <option value="stalled">Stalled</option>
                <option value="backlog">Backlog</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                placeholder="Assignee"
                style={inputStyle(C)}
              />
              <input
                value={formData.due}
                onChange={(e) => setFormData({ ...formData, due: e.target.value })}
                placeholder="Due date"
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
          {filtered.map((p) => {
            const co = companyColor(p.company, C);
            const statusColor =
              p.status === "active" ? C.green : p.status === "stalled" ? C.red : C.text3;
            const isEditing = editingId === p.id;

            if (isEditing) {
              return (
                <div
                  key={p.id}
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
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Project name"
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
                      <option value="active">Active</option>
                      <option value="stalled">Stalled</option>
                      <option value="backlog">Backlog</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={editData.assignee}
                      onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
                      placeholder="Assignee"
                      style={inputStyle(C)}
                    />
                    <input
                      value={editData.due}
                      onChange={(e) => setEditData({ ...editData, due: e.target.value })}
                      placeholder="Due date"
                      style={inputStyle(C)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => setEditingId(null)} style={btnStyle(C, C.text3)}>Cancel</button>
                    <button onClick={() => handleUpdate(p.id)} style={btnStyle(C, C.green)}>Save</button>
                  </div>
                </div>
              );
            }

            return (
              <Row key={p.id} hover>
                <div
                  style={{
                    width: 3,
                    height: 40,
                    borderRadius: 2,
                    background: co,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</span>
                    <Pill color={statusColor} small>
                      {p.status.toUpperCase()}
                    </Pill>
                    <Pill color={co} small>
                      {companyLabel(p.company)}
                    </Pill>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <Bar value={p.progress} color={co} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.text2, fontFamily: "var(--font-mono)", minWidth: 32, textAlign: "right" }}>
                      {p.progress}%
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>
                    {p.done}/{p.tasks} tasks — Due {p.due} — {p.assignee}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => startEdit(p)} style={btnStyle(C, C.blue)} title="Edit">
                    &#9998;
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={btnStyle(C, C.red)} title="Delete">
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
