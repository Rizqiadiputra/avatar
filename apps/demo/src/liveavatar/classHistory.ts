import { LanguageCode, isLanguageCode } from "./languages";
import type { ClassKey, TrackKey } from "./learnerProfile";
import type { ClosingReason } from "./classClosing";

// Riwayat kelas yang sudah diikuti peserta, disimpan di localStorage browser
// ini (sesuai keputusan: ingatan di browser dulu, pindah ke server nanti).
// Dipakai halaman ringkasan kelas dan dashboard riwayat belajar.

export type EndReason = ClosingReason | "left";

export type ClassRecord = {
  id: string;
  startedAt: number;
  endedAt: number;
  language: LanguageCode;
  track: TrackKey;
  classKey: ClassKey;
  tutorKey: string;
  learnerName: string;
  endReason: EndReason;
  messages: { sender: "user" | "avatar"; message: string }[];
};

const STORAGE_KEY = "class-history";
const MAX_RECORDS = 30;

const isRecord = (r: unknown): r is ClassRecord => {
  const x = r as Partial<ClassRecord> | null;
  return (
    !!x &&
    typeof x.id === "string" &&
    typeof x.startedAt === "number" &&
    typeof x.endedAt === "number" &&
    isLanguageCode(x.language) &&
    typeof x.classKey === "string" &&
    typeof x.tutorKey === "string" &&
    Array.isArray(x.messages)
  );
};

/** Riwayat, terbaru dulu. */
export const loadClassHistory = (): ClassRecord[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter(isRecord) : [];
  } catch {
    return [];
  }
};

export const saveClassRecord = (record: ClassRecord): ClassRecord[] => {
  const next = [
    record,
    ...loadClassHistory().filter((r) => r.id !== record.id),
  ].slice(0, MAX_RECORDS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* localStorage tidak tersedia; riwayat hanya berlaku di halaman ini */
  }
  return next;
};

/** Durasi dalam menit dan detik untuk ditampilkan. */
export const formatDuration = (record: ClassRecord, language: LanguageCode) => {
  const total = Math.max(
    0,
    Math.round((record.endedAt - record.startedAt) / 1000),
  );
  const min = Math.floor(total / 60);
  const sec = total % 60;
  if (min === 0) return language === "id" ? `${sec} dtk` : `${sec}s`;
  return language === "id" ? `${min} mnt ${sec} dtk` : `${min}m ${sec}s`;
};

export const formatDate = (ms: number, language: LanguageCode) =>
  new Date(ms).toLocaleString(language === "id" ? "id-ID" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
