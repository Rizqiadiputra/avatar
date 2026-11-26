/**
 * Format materi Mode Mengajar: video HeyGen polos (di kartu avatar) + daftar
 * "packaging" yang digambar aplikasi di papan materi, sinkron ke waktu putar.
 * Ide dan aturan ritmenya diadaptasi dari packaging playbook
 * digital-human-koubo (MIT): sesuatu yang baru tiap 3–5 detik di awal,
 * papan tanpa perubahan paling lama ~12 detik, kartu bab tiap 2–5 menit.
 *
 * Waktu (`Time`) boleh ditulis:
 * - angka detik: `42.5`
 * - jangkar ke paragraf naskah: `"p3"` (awal paragraf p3) atau `"p3+2.5"`.
 * Pakai jangkar supaya setelah video dirender di HeyGen, cukup isi ulang
 * `at` tiap paragraf naskah dan semua overlay ikut bergeser.
 */
export type Time = number | string;

export type ScriptSegment = {
  id: string;
  /** Detik mulai paragraf ini di video hasil render. */
  at: number;
  /** Naskah yang dibacakan avatar (tempel ke HeyGen). */
  text: string;
};

export type Chapter = {
  at: Time;
  title: string;
  /** Kartu bab layar penuh saat bab dimulai. Default true (kecuali bab pertama). */
  card?: boolean;
};

type Span = { at: Time; until?: Time };

export type PackItem =
  /** Kata kunci besar di papan, muncul saat diucapkan. */
  | ({ use: "Keyword"; text: string; sub?: string } & Span)
  /** Angka yang menghitung naik lalu berhenti tepat di nilai akhir. */
  | ({
      use: "Counter";
      to: number;
      from?: number;
      prefix?: string;
      suffix?: string;
      decimals?: number;
      label: string;
    } & Span)
  /** Rumus yang tumbuh suku demi suku. `at` per bagian opsional. */
  | ({
      use: "Formula";
      parts: { text: string; at?: Time; newline?: boolean }[];
      caption?: string;
    } & Span)
  /**
   * Kartu daftar (contoh, definisi, perbandingan singkat). Butir berupa teks
   * muncul beruntun; butir `{ text, at }` muncul tepat saat diucapkan.
   */
  | ({
      use: "Card";
      title: string;
      items: (string | { text: string; at: Time })[];
    } & Span)
  /** Pil peringatan / catatan penting ("Perhatikan!"). */
  | ({ use: "Callout"; text: string; tone?: "info" | "warn" } & Span)
  /** Sumber data kecil di kiri bawah. */
  | ({ use: "SourceTag"; text: string } & Span)
  /** Nama + peran guru di kartu avatar, di awal video. */
  | ({ use: "LowerThird"; name: string; role: string } & Span)
  /** Papan rangkuman memenuhi papan materi. */
  | ({ use: "Recap"; title: string; items: string[] } & Span)
  /** Kuis cek pemahaman: video berhenti sampai peserta menjawab. */
  | {
      use: "Quiz";
      at: Time;
      question: string;
      options: string[];
      answer: number;
      explain: string;
    };

export type TeachingLesson = {
  id: string;
  title: string;
  subtitle: string;
  /** Path video HeyGen (mis. di public/materi). Kosong / gagal → mode pratinjau. */
  video?: string;
  /** Durasi perkiraan untuk mode pratinjau; diganti durasi video asli bila ada. */
  duration: number;
  tutorKey: string;
  script: ScriptSegment[];
  chapters: Chapter[];
  pack: PackItem[];
};
