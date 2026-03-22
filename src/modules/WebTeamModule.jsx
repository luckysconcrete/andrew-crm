import { useState, useEffect } from "react";
import { useTheme } from "../lib/theme";
import { priorityConfig } from "../lib/constants";
import useWebTasks from "../stores/useWebTasks";
import Pill from "../components/ui/Pill";
import Tabs from "../components/ui/Tabs";
import Row from "../components/ui/Row";
import Section from "../components/ui/Section";
import StatCard from "../components/ui/StatCard";

const TAB_LIST = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "backlog", label: "Backlog" },
  { id: "all", label: "All" },
];

const EMPTY_FORM = { task: "", site: "", priority: "medium", assignee: "", due: "" };

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

export default function WebTeamModule() {
  const C = useTheme();
  const { tasks, fetch: fetchTasks, create, update, remove } = useWebTasks();
  const [tab, setTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const pc = priorityConfig(C);

  useEffect(() => { fetchTasks(); }, []);

  const filtered = tasks.filter((t) => {
    if (tab === "all") return true;
    return t.status === tab;
  });

  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const backlog = tasks.filter((t) => t.status === "backlog").length;

  const handleCreate = async () => {
    if (!formData.task.trim()) return;
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
    if (!window.confirm("Delete this task?")) return;
    await remove(id);
  };

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditData({ task: t.task, site: t.site, priority: t.priority, assignee: t.assignee, due: t.due });
  };

  return (
    <div>
      {/* Summary Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
        <StatCard label="To Do" value={todo} color={C.amber} />
        <StatCard label="In Progress" value={inProgress} color={C.blue} />
        <StatCard label="Backlog" value={backlog} color={C.text3} />
      </div>

      {/* Tabs */}
      <Tabs tabs={TAB_LIST} active={tab} onChange={setTab} />

      {/* Task Rows */}
      <Section
        title="Tasks"
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
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              placeholder="Task description"
              style={inputStyle(C)}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={formData.site}
                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                placeholder="Site"
                style={inputStyle(C)}
              />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={selectStyle(C)}
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
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
          {filtered.map((t) => {
            const pri = pc[t.priority] || pc.medium;
            const isEditing = editingId === t.id;

            if (isEditing) {
              return (
                <div
                  key={t.id}
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
                    value={editData.task}
                    onChange={(e) => setEditData({ ...editData, task: e.target.value })}
                    placeholder="Task description"
                    style={inputStyle(C)}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={editData.site}
                      onChange={(e) => setEditData({ ...editData, site: e.target.value })}
                      placeholder="Site"
                      style={inputStyle(C)}
                    />
                    <select
                      value={editData.priority}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                      style={selectStyle(C)}
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
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
                    <button onClick={() => handleUpdate(t.id)} style={btnStyle(C, C.green)}>Save</button>
                  </div>
                </div>
              );
            }

            return (
              <Row key={t.id} hover>
                {/* Priority bar */}
                <div
                  style={{
                    width: 3,
                    height: 36,
                    borderRadius: 2,
                    background: pri.c,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{t.task}</span>
                    <Pill color={pri.c} small>
                      {pri.l}
                    </Pill>
                  </div>
                  <div style={{ fontSize: 11, color: C.text3 }}>
                    {t.site} — {t.assignee} — Due {t.due}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => startEdit(t)} style={btnStyle(C, C.blue)} title="Edit">
                    &#9998;
                  </button>
                  <button onClick={() => handleDelete(t.id)} style={btnStyle(C, C.red)} title="Delete">
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
