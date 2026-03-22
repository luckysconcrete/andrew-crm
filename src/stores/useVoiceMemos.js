import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { VOICE_MEMOS } from "../lib/mockData";

const useVoiceMemos = create((set) => ({
  memos: VOICE_MEMOS,
  loading: false,
  error: null,

  fetch: async () => {
    if (!supabase) return;
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from("voice_memos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      set({ loading: false, error: error.message });
      return;
    }
    const mapped = data.map((m) => ({
      id: m.id,
      transcript: m.transcript,
      time: m.recorded_at
        ? new Date(m.recorded_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
        : "Unknown",
      duration: m.duration_seconds
        ? `${Math.floor(m.duration_seconds / 60)}:${String(m.duration_seconds % 60).padStart(2, "0")}`
        : "0:00",
      parsed: m.extracted_tasks || [],
    }));
    set({ memos: mapped.length > 0 ? mapped : VOICE_MEMOS, loading: false });
  },
}));

export default useVoiceMemos;
