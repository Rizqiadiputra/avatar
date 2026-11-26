"use client";

import React from "react";
import type { PackItem, Time } from "../../teaching/types";
import {
  CHAPTER_CARD_SECONDS,
  type Resolved,
  type ResolvedChapter,
} from "../../teaching/timeline";

// Semua animasi dihitung dari waktu video (bukan CSS animation), jadi
// konsisten saat di-seek, dijeda, atau diputar ulang. Ukuran memakai cqw
// (lebar papan) supaya isi papan ikut skala seperti slide.

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

/** 0 → 1 saat masuk, 1 → 0 saat keluar. */
const presence = (t: number, start: number, end: number, d = 0.35) =>
  Math.min(easeOut((t - start) / d), easeOut((end - t) / 0.3));

/** Posisi utama di tengah papan (Keyword, Counter, Card, Formula). */
const center = (p: number, width = "70cqw"): React.CSSProperties => ({
  position: "absolute",
  left: "50%",
  top: "54%",
  width,
  opacity: p,
  transform: `translate(-50%, calc(-50% + ${(1 - p) * 2}cqw))`,
});

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p
    className="font-bold uppercase tracking-wider text-teal-700"
    style={{ fontSize: "1.5cqw" }}
  >
    {children}
  </p>
);

const Keyword = ({
  item,
  t,
}: {
  item: Resolved<Extract<PackItem, { use: "Keyword" }>>;
  t: number;
}) => {
  const p = presence(t, item.start, item.end, 0.25);
  const pop = 0.88 + 0.12 * easeOut((t - item.start) / 0.25);
  return (
    <div
      style={{
        ...center(p),
        transform: `translate(-50%, -50%) scale(${pop})`,
      }}
      className="text-center"
    >
      <p
        className="font-extrabold leading-[1.05] tracking-tight text-slate-900"
        style={{ fontSize: "7cqw" }}
      >
        {item.text}
      </p>
      {item.sub && (
        <p
          className="mt-[1.4cqw] inline-block rounded-full bg-teal-600 font-semibold text-white"
          style={{ fontSize: "2.2cqw", padding: "0.5cqw 1.8cqw" }}
        >
          {item.sub}
        </p>
      )}
    </div>
  );
};

const Counter = ({
  item,
  t,
}: {
  item: Resolved<Extract<PackItem, { use: "Counter" }>>;
  t: number;
}) => {
  const p = presence(t, item.start, item.end);
  const k = easeOutExpo((t - item.start) / 1.2);
  const from = item.from ?? 0;
  // Ease expo tidak pernah tepat 1: pasang nilai akhir persis di ujung.
  const value = k >= 0.999 ? item.to : from + (item.to - from) * k;
  return (
    <div style={center(p)} className="text-center">
      <p
        className="font-extrabold tabular-nums leading-none text-slate-900"
        style={{ fontSize: "15cqw" }}
      >
        {item.prefix}
        {value.toFixed(item.decimals ?? 0)}
        <span className="text-teal-600">{item.suffix}</span>
      </p>
      <p
        className="font-semibold text-slate-600"
        style={{ fontSize: "2.5cqw", marginTop: "1cqw" }}
      >
        {item.label}
      </p>
    </div>
  );
};

const Panel = ({ p, children }: { p: number; children: React.ReactNode }) => (
  <div
    style={{
      ...center(p, "62cqw"),
      padding: "3cqw 3.4cqw",
      borderRadius: "1.8cqw",
    }}
    className="border border-slate-200 bg-white text-slate-800 shadow-xl shadow-teal-900/5"
  >
    {children}
  </div>
);

const Card = ({
  item,
  t,
  resolve,
}: {
  item: Resolved<Extract<PackItem, { use: "Card" }>>;
  t: number;
  resolve: (t: Time) => number;
}) => (
  <Panel p={presence(t, item.start, item.end)}>
    <Eyebrow>{item.title}</Eyebrow>
    <ul
      className="flex flex-col"
      style={{ marginTop: "1.8cqw", gap: "1.3cqw" }}
    >
      {item.items.map((it, k) => {
        const text = typeof it === "string" ? it : it.text;
        const at =
          typeof it === "string" ? item.start + 0.3 + k * 0.35 : resolve(it.at);
        const q = easeOut((t - at) / 0.3);
        return (
          <li
            key={k}
            className="flex items-start font-semibold leading-snug text-slate-800"
            style={{
              fontSize: "2.4cqw",
              gap: "1.2cqw",
              opacity: q,
              transform: `translateY(${(1 - q) * 0.8}cqw)`,
            }}
          >
            <span
              className="shrink-0 rounded-full bg-teal-600"
              style={{ width: "0.9cqw", height: "0.9cqw", marginTop: "1cqw" }}
            />
            {text}
          </li>
        );
      })}
    </ul>
  </Panel>
);

const Formula = ({
  item,
  t,
  resolve,
}: {
  item: Resolved<Extract<PackItem, { use: "Formula" }>>;
  t: number;
  resolve: (t: Time) => number;
}) => {
  // Kelompokkan bagian per baris (`newline` memulai baris baru).
  const lines: { text: string; at: number }[][] = [];
  for (const part of item.parts) {
    const at = part.at === undefined ? item.start : resolve(part.at);
    if (part.newline || lines.length === 0) lines.push([]);
    lines[lines.length - 1]!.push({ text: part.text, at });
  }
  return (
    <Panel p={presence(t, item.start, item.end)}>
      {item.caption && <Eyebrow>{item.caption}</Eyebrow>}
      <div
        className="flex flex-col font-serif text-slate-900"
        style={{ marginTop: "1.4cqw", gap: "0.8cqw" }}
      >
        {lines.map((line, li) => (
          <p
            key={li}
            className="flex flex-wrap items-baseline"
            style={{ fontSize: li === 0 ? "5cqw" : "3.4cqw", gap: "1.2cqw" }}
          >
            {line.map((part, pi) => {
              const q = easeOut((t - part.at) / 0.3);
              const fresh = t - part.at < 1.2;
              return (
                <span
                  key={pi}
                  className={fresh ? "text-teal-700" : undefined}
                  style={{
                    opacity: q,
                    transform: `translateY(${(1 - q) * 1}cqw)`,
                    transition: "color .4s",
                  }}
                >
                  {part.text}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    </Panel>
  );
};

const Callout = ({
  item,
  t,
}: {
  item: Resolved<Extract<PackItem, { use: "Callout" }>>;
  t: number;
}) => {
  const p = presence(t, item.start, item.end, 0.25);
  const warn = item.tone === "warn";
  return (
    <div
      className="absolute inset-x-0 flex justify-center"
      style={{
        top: "8cqw",
        opacity: p,
        transform: `translateY(${(1 - p) * -2}cqw)`,
      }}
    >
      <p
        className={`flex items-center rounded-full font-bold shadow-lg ${
          warn ? "bg-amber-400 text-amber-950" : "bg-slate-900 text-white"
        }`}
        style={{ fontSize: "1.9cqw", padding: "0.8cqw 2.2cqw", gap: "0.8cqw" }}
      >
        <span aria-hidden>{warn ? "⚠" : "💬"}</span>
        {item.text}
      </p>
    </div>
  );
};

const SourceTag = ({
  item,
  t,
}: {
  item: Resolved<Extract<PackItem, { use: "SourceTag" }>>;
  t: number;
}) => (
  <p
    className="absolute flex items-center font-medium text-slate-500"
    style={{
      left: "2.6cqw",
      bottom: "2.4cqw",
      fontSize: "1.35cqw",
      gap: "0.6cqw",
      opacity: presence(t, item.start, item.end),
    }}
  >
    <span
      className="rounded-full bg-red-500"
      style={{ width: "0.7cqw", height: "0.7cqw" }}
    />
    {item.text}
  </p>
);

/** Nama guru di kartu avatar (bukan di papan). */
export const LowerThird = ({
  item,
  t,
}: {
  item: Resolved<Extract<PackItem, { use: "LowerThird" }>>;
  t: number;
}) => {
  const p = presence(t, item.start, item.end, 0.4);
  return (
    <div className="absolute bottom-3 left-3 overflow-hidden rounded-lg">
      <div style={{ transform: `translateX(${(1 - p) * -105}%)` }}>
        <p className="bg-teal-700 px-3 py-1 text-sm font-extrabold text-white">
          {item.name}
        </p>
        <p className="bg-white px-3 py-0.5 text-xs font-semibold text-slate-700">
          {item.role}
        </p>
      </div>
    </div>
  );
};

const Recap = ({
  item,
  t,
}: {
  item: Resolved<Extract<PackItem, { use: "Recap" }>>;
  t: number;
}) => {
  const p = presence(t, item.start, item.end, 0.5);
  return (
    <div
      className="absolute inset-0 flex flex-col justify-center bg-white"
      style={{
        padding: "0 8cqw",
        opacity: p,
      }}
    >
      <Eyebrow>Rangkuman</Eyebrow>
      <p
        className="font-extrabold tracking-tight text-slate-900"
        style={{ fontSize: "4.4cqw", marginTop: "0.6cqw" }}
      >
        {item.title}
      </p>
      <ol className="flex flex-col" style={{ marginTop: "3cqw", gap: "2cqw" }}>
        {item.items.map((text, k) => {
          const q = easeOut((t - item.start - 0.6 - k * 0.6) / 0.35);
          return (
            <li
              key={k}
              className="flex items-center font-semibold text-slate-800"
              style={{
                fontSize: "2.8cqw",
                gap: "1.6cqw",
                opacity: q,
                transform: `translateX(${(1 - q) * 1.5}cqw)`,
              }}
            >
              <span
                className="flex shrink-0 items-center justify-center rounded-full bg-teal-700 font-bold text-white"
                style={{ width: "4.2cqw", height: "4.2cqw", fontSize: "2cqw" }}
              >
                {k + 1}
              </span>
              {text}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export const ChapterCard = ({
  chapter,
  t,
}: {
  chapter: ResolvedChapter;
  t: number;
}) => {
  const end = chapter.start + CHAPTER_CARD_SECONDS;
  const p = presence(t, chapter.start, end, 0.3);
  return (
    <div
      className="absolute inset-0 flex flex-col justify-center bg-teal-700 text-white"
      style={{
        padding: "0 8cqw",
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      }}
    >
      <p
        className="font-bold uppercase tracking-[0.2em] text-teal-200"
        style={{ fontSize: "1.8cqw" }}
      >
        Bagian {chapter.n}
      </p>
      <p
        className="font-extrabold tracking-tight"
        style={{
          fontSize: "7cqw",
          marginTop: "0.6cqw",
          transform: `translateX(${(1 - easeOut((t - chapter.start - 0.15) / 0.5)) * 4}cqw)`,
        }}
      >
        {chapter.title}
      </p>
    </div>
  );
};

/** Isi papan saat tidak ada overlay utama: bab yang sedang berjalan. */
export const IdleBoard = ({
  chapter,
  lessonTitle,
}: {
  chapter?: ResolvedChapter;
  lessonTitle: string;
}) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
    <p
      className="font-bold uppercase tracking-[0.2em] text-teal-700/60"
      style={{ fontSize: "1.6cqw" }}
    >
      {chapter ? `Bagian ${chapter.n}` : "Mode Mengajar"}
    </p>
    <p
      className="font-extrabold tracking-tight text-slate-300"
      style={{ fontSize: "5cqw", marginTop: "0.6cqw" }}
    >
      {chapter?.title ?? lessonTitle}
    </p>
  </div>
);

/** Bilah bab di atas papan (ProgressTracker). */
export const ChapterTracker = ({
  chapters,
  t,
}: {
  chapters: ResolvedChapter[];
  t: number;
}) => {
  let active = 0;
  chapters.forEach((c, i) => {
    if (t >= c.start) active = i;
  });
  return (
    <div
      className="absolute flex flex-wrap"
      style={{ left: "2.6cqw", top: "2.4cqw", gap: "0.6cqw" }}
    >
      {chapters.map((c, i) => (
        <span
          key={i}
          className={`rounded-full font-semibold transition-colors ${
            i === active
              ? "bg-teal-700 text-white"
              : i < active
                ? "bg-teal-50 text-teal-800"
                : "bg-slate-100 text-slate-400"
          }`}
          style={{ fontSize: "1.25cqw", padding: "0.4cqw 1.1cqw" }}
        >
          {i < active ? "✓ " : ""}
          {c.title}
        </span>
      ))}
    </div>
  );
};

/** Overlay yang digambar di papan (LowerThird ada di kartu avatar). */
export const BOARD_MAIN = new Set<PackItem["use"]>([
  "Keyword",
  "Counter",
  "Card",
  "Formula",
  "Recap",
]);

export const Overlay = ({
  item,
  t,
  resolve,
}: {
  item: Resolved;
  t: number;
  resolve: (t: Time) => number;
}) => {
  switch (item.use) {
    case "Keyword":
      return <Keyword item={item} t={t} />;
    case "Counter":
      return <Counter item={item} t={t} />;
    case "Card":
      return <Card item={item} t={t} resolve={resolve} />;
    case "Formula":
      return <Formula item={item} t={t} resolve={resolve} />;
    case "Callout":
      return <Callout item={item} t={t} />;
    case "SourceTag":
      return <SourceTag item={item} t={t} />;
    case "Recap":
      return <Recap item={item} t={t} />;
    default:
      return null;
  }
};
