import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { SITES } from "../lib/mockData";

const mapRow = (s) => ({
  id: s.id,
  domain: s.domain,
  dr: s.dr,
  keywords: s.keywords,
  traffic: s.traffic,
  trend: s.trend || "flat",
  company: s.company,
  status: s.status,
});

const useSites = create((set, get) => ({
  sites: SITES,
  loading: false,
  error: null,

  fetch: async () => {
    if (!supabase) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("sites")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    const mapped = data.map(mapRow);
    set({ sites: mapped.length > 0 ? mapped : SITES, loading: false });
  },

  create: async (site) => {
    if (!supabase) return;
    const row = {
      domain: site.domain,
      company: site.company || "zas",
      dr: site.dr || 0,
      keywords: site.keywords || 0,
      traffic: site.traffic || 0,
      trend: site.trend || "flat",
      status: site.status || "new",
    };
    const { error } = await supabase.from("sites").insert(row);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },

  update: async (id, updates) => {
    if (!supabase) return;
    const row = {};
    if (updates.domain !== undefined) row.domain = updates.domain;
    if (updates.company !== undefined) row.company = updates.company;
    if (updates.dr !== undefined) row.dr = updates.dr;
    if (updates.keywords !== undefined) row.keywords = updates.keywords;
    if (updates.traffic !== undefined) row.traffic = updates.traffic;
    if (updates.trend !== undefined) row.trend = updates.trend;
    if (updates.status !== undefined) row.status = updates.status;
    const { error } = await supabase.from("sites").update(row).eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },

  remove: async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from("sites").delete().eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },
}));

export default useSites;
