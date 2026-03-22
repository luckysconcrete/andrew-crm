import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { PROJECTS } from "../lib/mockData";

const mapRow = (p) => ({
  id: p.id,
  name: p.name,
  company: p.company,
  status: p.status,
  progress: p.progress,
  tasks: p.total_tasks,
  done: p.completed_tasks,
  due: p.due_date || "TBD",
  assignee: p.assignee || "Unassigned",
});

const useProjects = create((set, get) => ({
  projects: PROJECTS,
  loading: false,
  error: null,

  fetch: async () => {
    if (!supabase) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    const mapped = data.map(mapRow);
    set({ projects: mapped.length > 0 ? mapped : PROJECTS, loading: false });
  },

  create: async (project) => {
    if (!supabase) return;
    const row = {
      name: project.name,
      company: project.company,
      status: project.status || "active",
      progress: project.progress || 0,
      total_tasks: project.tasks || 0,
      completed_tasks: project.done || 0,
      due_date: project.due || null,
      assignee: project.assignee || "Unassigned",
    };
    const { error } = await supabase.from("projects").insert(row);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },

  update: async (id, updates) => {
    if (!supabase) return;
    const row = {};
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.company !== undefined) row.company = updates.company;
    if (updates.status !== undefined) row.status = updates.status;
    if (updates.progress !== undefined) row.progress = updates.progress;
    if (updates.tasks !== undefined) row.total_tasks = updates.tasks;
    if (updates.done !== undefined) row.completed_tasks = updates.done;
    if (updates.due !== undefined) row.due_date = updates.due;
    if (updates.assignee !== undefined) row.assignee = updates.assignee;
    const { error } = await supabase.from("projects").update(row).eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },

  remove: async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },
}));

export default useProjects;
