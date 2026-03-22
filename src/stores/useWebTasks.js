import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { WEB_TASKS } from "../lib/mockData";

const mapRow = (t) => ({
  id: t.id,
  task: t.task,
  site: t.site,
  priority: t.priority,
  status: t.status,
  assignee: t.assignee || "Unassigned",
  due: t.due_date || "TBD",
});

const useWebTasks = create((set, get) => ({
  tasks: WEB_TASKS,
  loading: false,
  error: null,

  fetch: async () => {
    if (!supabase) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("web_tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    const mapped = data.map(mapRow);
    set({ tasks: mapped.length > 0 ? mapped : WEB_TASKS, loading: false });
  },

  create: async (task) => {
    if (!supabase) return;
    const row = {
      task: task.task,
      site: task.site || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
      assignee: task.assignee || "Unassigned",
      due_date: task.due || null,
    };
    const { error } = await supabase.from("web_tasks").insert(row);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },

  update: async (id, updates) => {
    if (!supabase) return;
    const row = {};
    if (updates.task !== undefined) row.task = updates.task;
    if (updates.site !== undefined) row.site = updates.site;
    if (updates.priority !== undefined) row.priority = updates.priority;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.assignee !== undefined) row.assignee = updates.assignee;
    if (updates.due !== undefined) row.due_date = updates.due;
    const { error } = await supabase.from("web_tasks").update(row).eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },

  remove: async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from("web_tasks").delete().eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },
}));

export default useWebTasks;
