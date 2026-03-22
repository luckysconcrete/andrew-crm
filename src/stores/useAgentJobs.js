import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { AGENT_JOBS } from "../lib/mockData";

const useAgentJobs = create((set, get) => ({
  jobs: AGENT_JOBS,
  loading: false,
  error: null,

  fetch: async () => {
    if (!supabase) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("agent_jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    const mapped = data.map((j) => ({
      id: j.id,
      title: j.title,
      type: j.type,
      target: j.target,
      company: j.company,
      status: j.status,
      agent_pass: j.agent_passes || 0,
      total_passes: j.stages ? JSON.parse(typeof j.stages === "string" ? j.stages : JSON.stringify(j.stages)).length || 3 : 3,
      elapsed: j.elapsed_seconds || 0,
      result: j.result_summary,
      pr_url: j.github_pr_url,
      started: j.started_at ? new Date(j.started_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : null,
    }));
    set({ jobs: mapped.length > 0 ? mapped : AGENT_JOBS, loading: false });
  },

  subscribe: () => {
    if (!supabase) return () => {};
    const channel = supabase
      .channel("agent_jobs_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "agent_jobs" }, () => {
        get().fetch();
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  },
}));

export default useAgentJobs;
