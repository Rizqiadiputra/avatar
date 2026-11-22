import { LanguageCode, isLanguageCode } from "./languages";
import { findTutor } from "./tutors";

// Profil peserta yang diisi di layar masuk /kelas:
// bahasa pengantar → jalur → kelas → data peserta.
// Disimpan di localStorage browser ini supaya kunjungan berikutnya tidak perlu
// mengisi ulang. Label pilihan tersedia dalam semua bahasa pengantar.

type Labels = Record<LanguageCode, string>;
type Option<K extends string> = {
  key: K;
  icon?: string;
  label: Labels;
  description?: Labels;
  available?: boolean;
};

export const TRACKS = [
  {
    key: "profesional",
    icon: "💼",
    label: { id: "Profesional", en: "Professional" },
    description: {
      id: "Tingkatkan skill kerja atau pindah karier. Guru membawakan materi, kamu bertanya di akhir.",
      en: "Level up your work skills or switch careers. Your tutor teaches, you ask questions at the end.",
    },
    available: true,
  },
  {
    key: "kuliah",
    icon: "🎓",
    label: { id: "Kuliah", en: "University" },
    description: {
      id: "Pahami materi kuliah yang belum jelas. Kamu pilih topiknya, guru menjelaskan ulang.",
      en: "Understand the course material that's still unclear. You pick the topic, your tutor explains it again.",
    },
    available: false,
  },
  {
    key: "les",
    icon: "📚",
    label: { id: "Les Pribadi", en: "Private Tutoring" },
    description: {
      id: "Belajar dan latihan soal sesuai jenjangmu. Bebas bertanya kapan saja, seperti les privat.",
      en: "Learn and practise at your level. Ask anytime, just like a private tutor.",
    },
    available: false,
  },
] as const satisfies readonly Option<string>[];

export type TrackKey = (typeof TRACKS)[number]["key"];

// Katalog kelas jalur Profesional (sama dengan katalog di landing page).
// Hanya Data Analysis yang punya materi di demo ini.
export const CLASSES = [
  {
    key: "data-analysis",
    label: {
      id: "Data Analysis Fundamentals",
      en: "Data Analysis Fundamentals",
    },
    description: {
      id: "Modul 1 · Introduction to Data Analysis",
      en: "Module 1 · Introduction to Data Analysis",
    },
    available: true,
  },
  {
    key: "excel",
    label: {
      id: "Excel untuk Analisis Bisnis",
      en: "Excel for Business Analysis",
    },
    available: false,
  },
  {
    key: "project-management",
    label: {
      id: "Project Management Fundamentals",
      en: "Project Management Fundamentals",
    },
    available: false,
  },
  {
    key: "ai-productivity",
    label: {
      id: "AI untuk Produktivitas Kerja",
      en: "AI for Workplace Productivity",
    },
    available: false,
  },
  {
    key: "communication",
    label: {
      id: "Komunikasi Efektif di Tempat Kerja",
      en: "Effective Workplace Communication",
    },
    available: false,
  },
] as const satisfies readonly Option<string>[];

export type ClassKey = (typeof CLASSES)[number]["key"];

// `description` = contoh pertanyaan bisnis yang dipakai guru untuk bidang ini.
export const FIELDS = [
  {
    key: "hr",
    label: { id: "HR", en: "HR" },
    description: {
      id: "Kenapa banyak karyawan resign tahun ini?",
      en: "Why are so many employees leaving this year?",
    },
  },
  {
    key: "sales_marketing",
    label: { id: "Sales/Marketing", en: "Sales/Marketing" },
    description: {
      id: "Produk mana yang paling laku bulan ini?",
      en: "Which product sold best this month?",
    },
  },
  {
    key: "finance",
    label: { id: "Keuangan", en: "Finance" },
    description: {
      id: "Pos biaya mana yang paling membengkak?",
      en: "Which cost line is growing the fastest?",
    },
  },
  {
    key: "operations",
    label: { id: "Operasional", en: "Operations" },
    description: {
      id: "Di tahap mana pengiriman sering terlambat?",
      en: "Where do deliveries usually get delayed?",
    },
  },
  {
    key: "other",
    label: { id: "Lainnya", en: "Other" },
    description: {
      id: "Apa yang bisa dipelajari dari data sehari-hari di sekitarmu?",
      en: "What can everyday data around you tell you?",
    },
  },
] as const satisfies readonly Option<string>[];

export type FieldKey = (typeof FIELDS)[number]["key"];

// `description` = arah yang diambil guru untuk tujuan ini.
export const GOALS = [
  {
    key: "routine_reports",
    label: { id: "Membuat laporan rutin", en: "Build routine reports" },
    description: {
      id: "Guru fokus ke laporan yang rapi dan bisa diulang tiap bulan.",
      en: "Your tutor focuses on clear reports you can repeat every month.",
    },
  },
  {
    key: "data_decisions",
    label: {
      id: "Mengambil keputusan berbasis data",
      en: "Make data-driven decisions",
    },
    description: {
      id: "Guru fokus ke membaca data untuk memutuskan langkah berikutnya.",
      en: "Your tutor focuses on reading data to decide what to do next.",
    },
  },
  {
    key: "career_switch",
    label: { id: "Pindah karier", en: "Switch careers" },
    description: {
      id: "Guru menjembatani bidangmu sekarang dengan bidang tujuanmu.",
      en: "Your tutor bridges your current field and the one you're moving to.",
    },
  },
  {
    key: "curious",
    label: { id: "Sekadar ingin tahu", en: "Just curious" },
    description: {
      id: "Santai: pengenalan konsep dengan contoh sehari-hari.",
      en: "Relaxed: an intro to the concepts with everyday examples.",
    },
  },
] as const satisfies readonly Option<string>[];

export type GoalKey = (typeof GOALS)[number]["key"];

export type LearnerProfile = {
  language: LanguageCode;
  track: TrackKey;
  classKey: ClassKey;
  name: string;
  field: FieldKey;
  goal: GoalKey;
  /** Hanya diisi kalau goal = "career_switch". */
  targetField?: FieldKey;
  /** Guru yang dipilih (lihat tutors.ts), harus dari jalur yang sama. */
  tutorKey: string;
};

export const NAME_MAX_LENGTH = 40;

const has = <T extends { key: string }>(list: readonly T[], value: unknown) =>
  list.some((o) => o.key === value);

export const labelOf = <K extends string>(
  list: readonly Option<K>[],
  key: K,
  language: LanguageCode,
) => list.find((o) => o.key === key)?.label[language] ?? key;

/** Profil lengkap dan valid, siap dipakai untuk memulai kelas. */
export const isCompleteProfile = (p: Partial<LearnerProfile>) =>
  isLanguageCode(p.language) &&
  has(TRACKS, p.track) &&
  has(CLASSES, p.classKey) &&
  typeof p.name === "string" &&
  p.name.trim().length > 0 &&
  has(FIELDS, p.field) &&
  has(GOALS, p.goal) &&
  (p.goal !== "career_switch" || has(FIELDS, p.targetField)) &&
  findTutor(p.tutorKey)?.track === p.track;

const STORAGE_KEY = "learner-profile";

/** Profil tersimpan; field yang tidak valid dibuang. */
export const loadLearnerProfile = (): Partial<LearnerProfile> => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const p: Partial<LearnerProfile> = {};
    if (isLanguageCode(raw.language)) p.language = raw.language;
    if (has(TRACKS, raw.track)) p.track = raw.track;
    if (has(CLASSES, raw.classKey)) p.classKey = raw.classKey;
    if (typeof raw.name === "string")
      p.name = raw.name.slice(0, NAME_MAX_LENGTH);
    if (has(FIELDS, raw.field)) p.field = raw.field;
    if (has(GOALS, raw.goal)) p.goal = raw.goal;
    if (has(FIELDS, raw.targetField)) p.targetField = raw.targetField;
    if (findTutor(raw.tutorKey)) p.tutorKey = raw.tutorKey;
    return p;
  } catch {
    return {};
  }
};

export const saveLearnerProfile = (profile: Partial<LearnerProfile>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* localStorage tidak tersedia; profil hanya berlaku di halaman ini */
  }
};
