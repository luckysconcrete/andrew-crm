import { useState, useEffect, useRef } from "react";
import { useTheme } from "../lib/theme";
import { companyColor, companyLabel, priorityConfig } from "../lib/constants";
import useVoiceMemos from "../stores/useVoiceMemos";
import Pill from "../components/ui/Pill";
import Dot from "../components/ui/Dot";
import Section from "../components/ui/Section";

export default function VoiceModule() {
  const C = useTheme();
  const pc = priorityConfig(C);
  const { memos, uploading, fetch: fetchMemos, create, remove } = useVoiceMemos();
  const fileRef = useRef(null);

  useEffect(() => { fetchMemos(); }, []);

  // Submission form state
  const [transcript, setTranscript] = useState("");
  const [company, setCompany] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  // Track approval status per parsed task
  const [approvals, setApprovals] = useState(() => {
    const init = {};
    memos.forEach((m) => {
      m.parsed.forEach((p, i) => {
        init[`${m.id}-${i}`] = p.status;
      });
    });
    return init;
  });

  const toggleApproval = (memoId, taskIdx) => {
    const key = `${memoId}-${taskIdx}`;
    setApprovals((prev) => ({
      ...prev,
      [key]: prev[key] === "approved" ? "pending" : "approved",
    }));
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    await create({ transcript, company: company || null, audioFile });
    setTranscript("");
    setCompany("");
    setAudioFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAudioFile(file);
  };

  const pending = memos.flatMap((m) => m.parsed).filter((t) => t.status === "pending").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          background: `${C.purple}08`,
          borderRadius: "var(--radius-lg)",
          border: `1px solid ${C.purple}18`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🎙️</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.purple }}>Voice Inbox</div>
            <div style={{ fontSize: 11, color: C.text3 }}>
              <strong style={{ color: C.amber }}>{pending} tasks</strong> pending
            </div>
          </div>
        </div>
      </div>

      {/* Submit form — paste transcript + optional audio upload */}
      <div
        style={{
          background: C.card,
          borderRadius: "var(--radius-md)",
          border: `1px solid ${C.border}`,
          boxShadow: C.shadow,
          padding: "14px 16px",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 8 }}>
          New Voice Memo
        </div>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste or type your voice memo transcript..."
          rows={4}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "var(--radius-sm)",
            border: `1px solid ${C.border}`,
            background: C.inputBg,
            color: C.text,
            fontSize: 13,
            fontFamily: "var(--font-body)",
            resize: "vertical",
            outline: "none",
            lineHeight: 1.5,
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${C.border}`,
              background: C.inputBg,
              color: C.text,
              fontSize: 12,
              fontFamily: "var(--font-body)",
              outline: "none",
              minWidth: 100,
            }}
          >
            <option value="">Company (optional)</option>
            <option value="luckys">Lucky's</option>
            <option value="zas">ZAS</option>
            <option value="yrtx">YRTX</option>
            <option value="personal">Personal</option>
          </select>

          {/* Audio file upload */}
          <label
            style={{
              padding: "7px 14px",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${C.border}`,
              background: C.raised,
              color: C.text2,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            📎 {audioFile ? audioFile.name : "Attach audio"}
            <input
              ref={fileRef}
              type="file"
              accept="audio/*,.m4a,.mp3,.wav,.ogg,.aac,.mp4"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          <div style={{ flex: 1 }} />

          <button
            onClick={handleSubmit}
            disabled={!transcript.trim() || uploading}
            style={{
              padding: "8px 20px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              background: transcript.trim() && !uploading ? C.purple : C.border,
              color: transcript.trim() && !uploading ? "#fff" : C.text4,
              fontSize: 12,
              fontWeight: 700,
              cursor: transcript.trim() && !uploading ? "pointer" : "default",
              fontFamily: "var(--font-body)",
              transition: "all 0.12s",
            }}
          >
            {uploading ? "Submitting..." : "Submit"}
          </button>
        </div>
        {audioFile && (
          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: C.text3,
            }}
          >
            <span>📎 {audioFile.name}</span>
            <span>({(audioFile.size / 1024).toFixed(0)} KB)</span>
            <button
              onClick={() => {
                setAudioFile(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              style={{
                background: "none",
                border: "none",
                color: C.red,
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      {/* Memo list */}
      <Section title="Voice Memos" count={memos.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {memos.map((memo) => (
            <div
              key={memo.id}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: "var(--radius-md)",
                boxShadow: C.shadow,
                overflow: "hidden",
              }}
            >
              {/* Memo header */}
              <div style={{ padding: "12px 14px", borderBottom: `1px solid ${C.border}` }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        color: C.text3,
                      }}
                    >
                      {memo.time} · {memo.duration}
                    </span>
                    <Pill color={C.purple} small>
                      VOICE MEMO
                    </Pill>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Delete this memo?")) remove(memo.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: C.text4,
                      fontSize: 13,
                      cursor: "pointer",
                      padding: "2px 4px",
                    }}
                  >
                    ×
                  </button>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.text2,
                    lineHeight: 1.5,
                    fontStyle: "italic",
                  }}
                >
                  "{memo.transcript}"
                </div>
                {memo.audio_url && (
                  <audio
                    controls
                    src={memo.audio_url}
                    style={{ marginTop: 8, width: "100%", height: 32 }}
                  />
                )}
              </div>

              {/* Parsed tasks */}
              {memo.parsed.length > 0 && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: C.raised,
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {memo.parsed.map((task, idx) => {
                      const key = `${memo.id}-${idx}`;
                      const status = approvals[key] || task.status;
                      const co = companyColor(task.company, C);
                      const pri = pc[task.priority] || pc.medium;
                      const isApproved = status === "approved";

                      return (
                        <div
                          key={key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 10px",
                            background: C.card,
                            borderRadius: "var(--radius-sm)",
                            border: `1px solid ${C.border}`,
                          }}
                        >
                          <Dot color={co} />
                          <span style={{ flex: 1, fontSize: 12, color: C.text }}>
                            {task.text}
                          </span>
                          {isApproved ? (
                            <Pill color={C.green} small>
                              APPROVED
                            </Pill>
                          ) : (
                            <button
                              onClick={() => toggleApproval(memo.id, idx)}
                              style={{
                                padding: "3px 10px",
                                borderRadius: "var(--radius-sm)",
                                border: `1px solid ${C.green}40`,
                                background: `${C.green}10`,
                                color: C.green,
                                fontSize: 10,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "var(--font-body)",
                              }}
                            >
                              Approve ✓
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
