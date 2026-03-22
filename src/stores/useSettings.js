import { create } from "zustand";
import { supabase } from "../lib/supabase";

const DEFAULTS = {
  code_auto_deploy: false,
  code_review: true,
  code_tests: true,
  code_rollback: true,
  design_approval: true,
  design_mockup: true,
  design_screenshots: true,
  content_auto_publish: false,
  content_drafts: true,
  content_review: true,
  content_meta: true,
  content_links: true,
  seo_daily_rank: true,
  seo_weekly_traffic: true,
  seo_flag_drops: true,
  seo_auto_fix: false,
  seo_auto_schema: false,
  bulk_approval: true,
  bulk_preview: true,
  bulk_nap: true,
  bulk_ssl: true,
  ops_briefing: true,
  ops_weekly: true,
  notif_start: false,
  notif_progress: false,
  notif_complete: true,
  notif_failure: true,
  budget_enabled: true,
};

const useSettings = create((set, get) => ({
  settings: { ...DEFAULTS },
  loading: false,
  error: null,

  fetch: async () => {
    if (!supabase) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("agent_settings")
      .select("key, value");
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    const mapped = { ...DEFAULTS };
    data.forEach((row) => {
      const val = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
      mapped[row.key] = val === "true";
    });
    set({ settings: mapped, loading: false });
  },

  update: (key, value) => {
    set({ settings: { ...get().settings, [key]: value } });
  },

  save: async () => {
    if (!supabase) return;
    const { settings } = get();
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase
        .from("agent_settings")
        .update({ value: JSON.stringify(value), updated_at: new Date().toISOString() })
        .eq("key", key)
    );
    await Promise.all(updates);
  },
}));

export default useSettings;
