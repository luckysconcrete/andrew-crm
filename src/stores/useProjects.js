import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { PROJECTS } from "../lib/mockData";

const useProjects = create((set) => ({
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
    // Map DB columns to frontend shape
    const mapped = data.map((p) => ({
      id: p.id,
      name: p.name,
      company: p.company,
      status: p.status,
      progress: p.progress,
      tasks: p.total_tasks,
      done: p.completed_tasks,
      due: p.due_date || "TBD",
      assignee: p.assignee || "Unassigned",
    }));
    set({ projects: mapped.length > 0 ? mapped : PROJECTS, loading: false });
  },
}));

export default useProjects;
