import type { PackItem, TeachingLesson, Time } from "./types";

/** Lama tampil bawaan (detik) bila `until` tidak diisi. */
const DEFAULT_SPAN: Record<string, number> = {
  Keyword: 3.5,
  Counter: 4,
  Formula: 8,
  Card: 7,
  Callout: 3.5,
  SourceTag: 4,
  LowerThird: 4.5,
  Recap: 10,
};
export const CHAPTER_CARD_SECONDS = 2.4;

/** Bagian frame yang dipakai overlay, untuk mendeteksi tumpang tindih. */
const SLOT: Partial<Record<PackItem["use"], string>> = {
  Keyword: "tengah papan",
  Counter: "tengah papan",
  Formula: "tengah papan",
  Card: "tengah papan",
  Callout: "atas",
  SourceTag: "kiri bawah",
  LowerThird: "kartu avatar",
  Recap: "layar",
};

export type Resolved<T extends PackItem = PackItem> = T & {
  start: number;
  end: number;
  /** Urutan di `pack`, untuk key React dan tautan dari daftar. */
  index: number;
};

export type ResolvedChapter = {
  start: number;
  title: string;
  card: boolean;
  n: number;
};

export type Timeline = {
  items: Resolved[];
  chapters: ResolvedChapter[];
  resolve: (t: Time) => number;
};

const ANCHOR = /^([A-Za-z0-9_-]+)\s*(?:([+-])\s*(\d+(?:\.\d+)?))?$/;

export const buildTimeline = (lesson: TeachingLesson): Timeline => {
  const anchors = new Map(lesson.script.map((s) => [s.id, s.at]));
  const resolve = (t: Time): number => {
    if (typeof t === "number") return t;
    const m = ANCHOR.exec(t.trim());
    const base = m ? anchors.get(m[1]!) : undefined;
    if (!m || base === undefined) return Number.NaN;
    const offset = m[3] ? Number(m[3]) : 0;
    return m[2] === "-" ? base - offset : base + offset;
  };

  const items = lesson.pack
    .map((item, index): Resolved => {
      const start = resolve(item.at);
      const until = "until" in item ? item.until : undefined;
      const end =
        until !== undefined
          ? resolve(until)
          : start + (DEFAULT_SPAN[item.use] ?? 0);
      return { ...item, start, end, index };
    })
    .sort((a, b) => a.start - b.start);

  const chapters = lesson.chapters
    .map((c, i) => ({
      start: resolve(c.at),
      title: c.title,
      card: c.card ?? i > 0,
      n: i + 1,
    }))
    .sort((a, b) => a.start - b.start);

  return { items, chapters, resolve };
};

export const isActive = (item: { start: number; end: number }, t: number) =>
  t >= item.start && t < item.end;

export type PacingIssue = {
  level: "error" | "warn" | "info";
  at?: number;
  msg: string;
};

/**
 * Cek ritme dan kesalahan data materi, mengikuti aturan packaging playbook:
 * - 30 detik pertama: ada perubahan visual paling lambat tiap 5 detik.
 * - Setelahnya: papan tanpa perubahan paling lama ~12 detik.
 * - Kartu bab paling jarang tiap 5 menit.
 */
export const checkPacing = (
  timeline: Timeline,
  duration: number,
): PacingIssue[] => {
  const issues: PacingIssue[] = [];
  const { items, chapters } = timeline;

  for (const item of items) {
    const label = `#${item.index + 1} ${item.use}`;
    if (Number.isNaN(item.start) || Number.isNaN(item.end)) {
      issues.push({
        level: "error",
        msg: `${label}: waktu tidak dikenali (${String(item.at)}). Pakai detik atau jangkar seperti "p2+1.5".`,
      });
      continue;
    }
    if (item.use !== "Quiz" && item.end <= item.start)
      issues.push({
        level: "error",
        at: item.start,
        msg: `${label}: "until" harus setelah "at".`,
      });
    if (item.start >= duration)
      issues.push({
        level: "warn",
        at: item.start,
        msg: `${label} mulai setelah video selesai (${fmt(duration)}).`,
      });
    if (
      item.use === "Quiz" &&
      (item.answer < 0 || item.answer >= item.options.length)
    )
      issues.push({
        level: "error",
        at: item.start,
        msg: `${label}: "answer" di luar daftar pilihan.`,
      });
  }
  for (const c of chapters)
    if (Number.isNaN(c.start))
      issues.push({
        level: "error",
        msg: `Bab "${c.title}": waktu tidak dikenali.`,
      });

  // Tumpang tindih di bagian frame yang sama.
  const valid = items.filter(
    (i) => !Number.isNaN(i.start) && !Number.isNaN(i.end),
  );
  for (let a = 0; a < valid.length; a++) {
    const A = valid[a]!;
    const slot = SLOT[A.use];
    if (!slot) continue;
    for (let b = a + 1; b < valid.length; b++) {
      const B = valid[b]!;
      if (B.start >= A.end) break;
      if (SLOT[B.use] === slot)
        issues.push({
          level: "warn",
          at: B.start,
          msg: `#${A.index + 1} ${A.use} dan #${B.index + 1} ${B.use} bertumpuk di ${slot} (${fmt(B.start)}).`,
        });
    }
  }

  // Ritme: kapan saja ada "kejadian visual" baru.
  const events = [
    ...valid.map((i) => i.start),
    ...valid.flatMap((i) =>
      i.use === "Formula"
        ? i.parts
            .filter((p) => p.at !== undefined)
            .map((p) => timeline.resolve(p.at!))
        : i.use === "Card"
          ? i.items.flatMap((it) =>
              typeof it === "string" ? [] : [timeline.resolve(it.at)],
            )
          : [],
    ),
    ...chapters.filter((c) => !Number.isNaN(c.start)).map((c) => c.start),
  ]
    .filter((t) => t >= 0 && t < duration)
    .sort((a, b) => a - b);

  if (!events.some((t) => t < 3))
    issues.push({
      level: "info",
      at: 0,
      msg: "3 detik pertama belum ada visual. Playbook: buka langsung dengan inti/angka, salam belakangan.",
    });

  let prev = 0;
  for (const t of [...events, duration]) {
    const gap = t - prev;
    const limit = prev < 30 ? 5 : 12;
    if (gap > limit + 0.01)
      issues.push({
        level: "warn",
        at: prev,
        msg: `${fmt(prev)}–${fmt(t)}: ${Math.round(gap)} detik tanpa perubahan visual (batas ${limit} detik ${prev < 30 ? "di 30 detik pertama" : "setelah pembuka"}). Tambah Keyword, Card, atau Callout.`,
      });
    prev = Math.max(prev, t);
  }

  // Kartu bab.
  const starts = [0, ...chapters.map((c) => c.start), duration];
  for (let i = 1; i < starts.length; i++) {
    if (starts[i]! - starts[i - 1]! > 300)
      issues.push({
        level: "warn",
        at: starts[i - 1],
        msg: `Lebih dari 5 menit tanpa bab baru sejak ${fmt(starts[i - 1]!)}.`,
      });
  }

  if (!valid.some((i) => i.use === "Recap") && duration > 120)
    issues.push({
      level: "info",
      msg: "Belum ada Recap. Playbook: tutup video panjang dengan papan rangkuman.",
    });

  return issues.sort((a, b) => (a.at ?? -1) - (b.at ?? -1));
};

export const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "–:––";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
};
