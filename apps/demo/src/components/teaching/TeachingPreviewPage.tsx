"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { GuruShell } from "../GuruShell";
import {
  TeachingVideoPlayer,
  type TeachingPlayerHandle,
} from "./TeachingVideoPlayer";
import { TeachingTranscript } from "./TeachingTranscript";
import { TeachingChat } from "./TeachingChat";
import { buildTimeline, checkPacing } from "../../teaching/timeline";
import type { TeachingLesson } from "../../teaching/types";
import { DATA_ANALYSIS_M1 } from "../../teaching/lessons/dataAnalysisM1";
import { findTutor } from "../../liveavatar/tutors";

const LEVEL_STYLE = {
  error: "bg-red-100 text-red-800",
  warn: "bg-amber-100 text-amber-900",
  info: "bg-sky-100 text-sky-900",
} as const;
const LEVEL_LABEL = { error: "Error", warn: "Ritme", info: "Saran" } as const;

/**
 * Mode Mengajar: papan materi + transkrip di kiri, avatar + chat di kanan.
 * Tambahkan `?penyusun=1` di URL untuk alat penyusun materi (cek ritme dan
 * salin naskah HeyGen); murid tidak melihatnya.
 */
export const TeachingPreviewPage = () => {
  const lesson = DATA_ANALYSIS_M1;
  const tutor = findTutor(lesson.tutorKey);
  const tutorName = tutor?.name ?? "Guru AI";
  const playerRef = useRef<TeachingPlayerHandle>(null);
  const [t, setT] = useState(0);
  const [duration, setDuration] = useState(lesson.duration);
  const [playing, setPlaying] = useState(false);
  const [author, setAuthor] = useState(false);

  useEffect(() => {
    setAuthor(
      new URLSearchParams(window.location.search).get("penyusun") === "1",
    );
  }, []);

  return (
    <GuruShell
      wide
      headerCenter={
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">
            {lesson.title}
          </p>
          <p className="truncate text-xs text-slate-500">
            Mode Mengajar · {lesson.subtitle}
          </p>
        </div>
      }
      headerRight={
        <Link
          href="/kelas"
          className="text-sm font-semibold text-teal-700 hover:text-teal-900"
        >
          Ke kelas →
        </Link>
      }
    >
      <div className="flex w-full flex-col gap-6 px-4 pb-10 sm:px-8">
        <TeachingVideoPlayer
          ref={playerRef}
          lesson={lesson}
          tutorImage={tutor?.image}
          tutorName={tutorName}
          onTick={(now, d) => {
            setT(now);
            if (d !== duration) setDuration(d);
          }}
          onPlayingChange={setPlaying}
          belowBoard={
            <TeachingTranscript
              script={lesson.script}
              t={t}
              onSeek={(s) => playerRef.current?.seek(s)}
            />
          }
          belowAvatar={
            <TeachingChat
              lesson={lesson}
              tutorName={tutorName}
              t={t}
              playing={playing}
              onAsk={() => playerRef.current?.pause()}
              onResume={() => playerRef.current?.play()}
            />
          }
        />

        {author && (
          <AuthorTools
            lesson={lesson}
            duration={duration}
            onSeek={(s) => playerRef.current?.seek(s)}
          />
        )}
      </div>
    </GuruShell>
  );
};

/** Alat penyusun materi: cek ritme (aturan playbook) + salin naskah HeyGen. */
const AuthorTools = ({
  lesson,
  duration,
  onSeek,
}: {
  lesson: TeachingLesson;
  duration: number;
  onSeek: (s: number) => void;
}) => {
  const [copied, setCopied] = useState(false);
  const timeline = useMemo(() => buildTimeline(lesson), [lesson]);
  const issues = useMemo(
    () => checkPacing(timeline, duration),
    [timeline, duration],
  );

  const copyScript = async () => {
    const text = lesson.script.map((s) => `[${s.id}] ${s.text}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-white">
          Alat penyusun
        </span>
        <span className="text-xs text-slate-500">
          {timeline.items.length} overlay · {timeline.chapters.length} bab ·
          tidak terlihat oleh murid
        </span>
        <button
          onClick={copyScript}
          className="ml-auto rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-teal-600 hover:text-teal-800"
        >
          {copied ? "Tersalin ✓" : "Salin naskah untuk HeyGen"}
        </button>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        <span className="font-semibold text-slate-700">Cek ritme:</span> 30
        detik pertama ada visual baru tiap ≤5 detik, setelahnya papan tidak
        berubah ≤12 detik, bab baru tiap ≤5 menit. Naskah HeyGen: satu scene per
        paragraf, avatar di tengah frame, tanpa caption bawaan. Setelah render,
        isi detik mulai tiap paragraf di{" "}
        <code className="rounded bg-white px-1">dataAnalysisM1.ts</code>.
      </p>

      {issues.length === 0 ? (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          ✓ Semua aturan ritme terpenuhi.
        </p>
      ) : (
        <ul className="mt-3 flex max-h-56 flex-col gap-1.5 overflow-y-auto">
          {issues.map((issue, i) => (
            <li key={i}>
              <button
                disabled={issue.at === undefined}
                onClick={() => issue.at !== undefined && onSeek(issue.at)}
                className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-white disabled:hover:bg-transparent"
              >
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 font-semibold ${LEVEL_STYLE[issue.level]}`}
                >
                  {LEVEL_LABEL[issue.level]}
                </span>
                <span className="text-slate-600">{issue.msg}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
