"use client";

import { useEffect, useRef } from "react";
import type { ScriptSegment } from "../../teaching/types";
import { fmt } from "../../teaching/timeline";

/**
 * Transkrip untuk murid: paragraf yang sedang dibacakan disorot dan dibawa
 * ke atas daftar. Hanya daftar yang digulir (bukan halaman), dan gulir
 * otomatis berhenti sebentar kalau murid baru saja menggulir sendiri.
 */
export const TeachingTranscript = ({
  script,
  t,
  onSeek,
}: {
  script: ScriptSegment[];
  t: number;
  onSeek: (seconds: number) => void;
}) => {
  const listRef = useRef<HTMLOListElement>(null);
  const userScrolledAt = useRef(0);
  const activeId = [...script].reverse().find((s) => t >= s.at)?.id;

  useEffect(() => {
    const list = listRef.current;
    if (!list || !activeId) return;
    if (Date.now() - userScrolledAt.current < 4000) return;
    const item = list.querySelector<HTMLElement>(`[data-seg="${activeId}"]`);
    if (item) list.scrollTo({ top: item.offsetTop - 4, behavior: "smooth" });
  }, [activeId]);

  const markUserScroll = () => (userScrolledAt.current = Date.now());

  return (
    <section className="flex h-[340px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="shrink-0 border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-bold text-slate-900">Transkrip</p>
        <p className="text-xs text-slate-400">
          Klik paragraf untuk loncat ke bagian itu.
        </p>
      </div>
      <ol
        ref={listRef}
        onWheel={markUserScroll}
        onTouchMove={markUserScroll}
        className="relative flex flex-1 flex-col gap-1 overflow-y-auto p-3"
      >
        {script.map((s) => {
          const active = s.id === activeId;
          return (
            <li key={s.id} data-seg={s.id}>
              <button
                onClick={() => onSeek(s.at)}
                className={`flex w-full gap-3 rounded-lg px-3 py-2 text-left text-sm leading-relaxed transition ${
                  active
                    ? "bg-teal-50 text-slate-800 ring-1 ring-teal-200"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`shrink-0 pt-0.5 text-xs font-semibold tabular-nums ${
                    active ? "text-teal-700" : "text-slate-400"
                  }`}
                >
                  {fmt(s.at)}
                </span>
                <span>{s.text}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
