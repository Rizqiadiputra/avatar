"use client";

import { useEffect, useRef, useState } from "react";
import type { TeachingLesson } from "../../teaching/types";
import { fmt } from "../../teaching/timeline";

type Message = { from: "user" | "tutor"; text: string; at: number };

const SUGGESTIONS = [
  "Bisa dijelaskan lebih sederhana?",
  "Boleh kasih contoh lain?",
];

/** Jawaban dibatasi ke materi: naskah lengkap + paragraf yang sedang dibahas. */
const buildSystemPrompt = (
  lesson: TeachingLesson,
  tutorName: string,
  t: number,
) => {
  const current = [...lesson.script].reverse().find((s) => t >= s.at);
  const script = lesson.script.map((s) => `- ${s.text}`).join("\n");
  return [
    `Kamu adalah ${tutorName}, pengajar kelas "${lesson.subtitle}", materi "${lesson.title}".`,
    `Peserta sedang menonton video materi dan menjeda di ${fmt(t)} untuk bertanya lewat chat.`,
    current ? `Bagian yang sedang dibahas saat dijeda: "${current.text}"` : "",
    `Naskah lengkap materi:\n${script}`,
    "Jawab dalam Bahasa Indonesia yang ramah, singkat (maksimal 4 kalimat), dan kaitkan dengan bagian yang sedang dibahas.",
    "Kalau pertanyaan di luar materi, jawab sangat singkat lalu arahkan kembali ke materi.",
    "Jangan mengarang angka, data, atau sumber. Angka di naskah yang disebut contoh tetap disebut sebagai contoh.",
  ]
    .filter(Boolean)
    .join("\n\n");
};

/**
 * Chat "Tanya guru" selama video: video dijeda saat murid bertanya, lalu
 * dijawab LLM teks (murah dan cepat) dengan konteks paragraf yang sedang
 * dibahas. Sesi LiveAvatar realtime baru dipakai untuk tanya jawab di akhir.
 */
export const TeachingChat = ({
  lesson,
  tutorName,
  t,
  playing,
  onAsk,
  onResume,
}: {
  lesson: TeachingLesson;
  tutorName: string;
  t: number;
  playing: boolean;
  /** Dipanggil saat murid mengirim pertanyaan (menjeda video). */
  onAsk: () => void;
  onResume: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || loading) return;
    onAsk();
    setInput("");
    const asked: Message = { from: "user", text: question, at: t };
    const history = messages.slice(-6);
    setMessages((m) => [...m, asked]);
    setLoading(true);

    const transcript = history
      .map((m) => `${m.from === "user" ? "Peserta" : tutorName}: ${m.text}`)
      .join("\n");
    const message = transcript
      ? `Percakapan sebelumnya:\n${transcript}\n\nPertanyaan baru dari peserta: ${question}`
      : question;

    try {
      const res = await fetch("/api/openai-chat-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          system_prompt: buildSystemPrompt(lesson, tutorName, t),
        }),
      });
      const data = (await res.json()) as { response?: string; error?: string };
      if (!res.ok || !data.response)
        throw new Error(data.error ?? `HTTP ${res.status}`);
      setMessages((m) => [
        ...m,
        { from: "tutor", text: data.response!, at: t },
      ]);
    } catch (e) {
      console.error("Gagal menjawab pertanyaan:", e);
      const notConfigured = String(e).includes("not configured");
      setMessages((m) => [
        ...m,
        {
          from: "tutor",
          text: notConfigured
            ? "Chat belum aktif: OPENAI_API_KEY belum diisi di server."
            : "Maaf, jawabannya gagal dimuat. Coba kirim lagi sebentar lagi.",
          at: t,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const waitingToResume = !playing && messages.length > 0 && !loading;

  return (
    <section className="flex min-h-[340px] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-bold text-slate-900">Tanya {tutorName}</p>
        <p className="text-xs text-slate-400">
          Video berhenti sebentar saat kamu bertanya.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {messages.length === 0 && (
          <div className="mt-6 flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-slate-400">
              Ada yang belum jelas? Tanyakan kapan saja.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-800"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => {
          const mine = m.from === "user";
          return (
            <div
              key={i}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                  mine
                    ? "rounded-br-sm bg-teal-700 text-white"
                    : "rounded-bl-sm bg-slate-100 text-slate-700"
                }`}
              >
                <span
                  className={`mb-0.5 block text-[11px] font-semibold ${
                    mine ? "text-teal-100" : "text-slate-400"
                  }`}
                >
                  {mine ? `Kamu · ${fmt(m.at)}` : tutorName}
                </span>
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <span className="flex gap-1 rounded-2xl rounded-bl-sm bg-slate-100 px-3.5 py-3">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {waitingToResume && (
        <button
          onClick={onResume}
          className="mx-3 mb-2 shrink-0 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
        >
          ▶ Lanjutkan video dari {fmt(t)}
        </button>
      )}

      <form
        className="flex shrink-0 gap-2 border-t border-slate-100 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Tulis pertanyaan untuk ${tutorName}…`}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          Kirim
        </button>
      </form>
    </section>
  );
};
