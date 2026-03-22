import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { VOICE_MEMOS } from "../lib/mockData";

const useVoiceMemos = create((set, get) => ({
  memos: VOICE_MEMOS,
  loading: false,
  uploading: false,
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
        : new Date(m.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      duration: m.duration_seconds
        ? `${Math.floor(m.duration_seconds / 60)}:${String(m.duration_seconds % 60).padStart(2, "0")}`
        : "0:00",
      parsed: m.extracted_tasks || [],
      audio_url: m.audio_url,
    }));
    set({ memos: mapped.length > 0 ? mapped : VOICE_MEMOS, loading: false });
  },

  create: async ({ transcript, company, audioFile }) => {
    if (!supabase) return;
    set({ uploading: true, error: null });

    let audio_url = null;

    // Upload audio file to Supabase Storage if provided
    if (audioFile) {
      const ext = audioFile.name.split(".").pop() || "m4a";
      const fileName = `${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("voice-memos")
        .upload(fileName, audioFile, {
          contentType: audioFile.type || "audio/mp4",
          upsert: false,
        });

      if (uploadError) {
        // Storage bucket may not exist yet — continue without audio
        console.warn("Audio upload failed:", uploadError.message);
      } else {
        const { data: urlData } = supabase.storage
          .from("voice-memos")
          .getPublicUrl(uploadData.path);
        audio_url = urlData?.publicUrl || null;
      }
    }

    const row = {
      transcript: transcript.trim(),
      company: company || null,
      recorded_at: new Date().toISOString(),
      audio_url,
      status: "new",
      extracted_tasks: [],
      tasks_generated: false,
    };

    const { error } = await supabase.from("voice_memos").insert(row);
    if (error) {
      set({ uploading: false, error: error.message });
      return;
    }
    set({ uploading: false });
    await get().fetch();
  },

  remove: async (id) => {
    if (!supabase) return;
    const { error } = await supabase.from("voice_memos").delete().eq("id", id);
    if (error) {
      set({ error: error.message });
      return;
    }
    await get().fetch();
  },
}));

export default useVoiceMemos;
