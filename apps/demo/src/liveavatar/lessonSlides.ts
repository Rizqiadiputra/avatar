import type { LanguageCode } from "./languages";
import type { LessonStatus } from "./useLessonPlayer";
import { LESSON_SCRIPTS } from "./lessonScript";

/**
 * Slide panel materi. `paragraphs[i]` tampil saat avatar membawakan
 * LESSON_SCRIPTS[bahasa][i], jadi panjang keduanya harus sama.
 */
export type Slide =
  | {
      kind: "cover";
      eyebrow: string;
      title: string;
      subtitle: string;
      meta: string[];
    }
  | { kind: "agenda"; title: string; items: string[]; active: number }
  | {
      kind: "flow";
      title: string;
      lead: string;
      steps: { label: string; desc: string }[];
    }
  | { kind: "qa"; title: string; lead: string; prompts: string[] }
  | { kind: "summary"; title: string; points: string[]; next: string };

export type LessonSlides = {
  cover: Slide;
  paragraphs: Slide[];
  summary: Slide;
};

const MODULES = [
  "Introduction to Data Analysis",
  "Understanding Data Types",
  "Data Cleaning Fundamentals",
  "Introduction to SQL",
  "Basic Data Visualization",
];

export const LESSON_SLIDES: Record<LanguageCode, LessonSlides> = {
  id: {
    cover: {
      kind: "cover",
      eyebrow: "Modul 1 dari 5",
      title: "Introduction to Data Analysis",
      subtitle: "Data Analysis Fundamentals · From Data to Insight",
      meta: ["Pengajar AI", "Kelas live", "Tanya jawab suara & chat"],
    },
    paragraphs: [
      {
        kind: "agenda",
        title: "Peta kelas",
        items: MODULES,
        active: 0,
      },
      {
        kind: "flow",
        title: "Apa itu analisis data?",
        lead: "Proses mengolah data untuk menjawab pertanyaan bisnis dan mendukung keputusan.",
        steps: [
          { label: "Pertanyaan", desc: "Apa yang ingin diketahui?" },
          { label: "Data", desc: "Kumpulkan data yang relevan" },
          { label: "Olah", desc: "Bersihkan dan analisis" },
          { label: "Insight", desc: "Temuan yang bisa ditindaklanjuti" },
        ],
      },
      {
        kind: "qa",
        title: "Sesi tanya jawab",
        lead: "Tanyakan lewat mikrofon atau chat. Contoh pertanyaan:",
        prompts: [
          "Apa bedanya data dan informasi?",
          "Kenapa analisis harus dimulai dari pertanyaan?",
          "Contoh analisis data untuk tim HR?",
        ],
      },
    ],
    summary: {
      kind: "summary",
      title: "Ringkasan Modul 1",
      points: [
        "Analisis data mengubah data menjadi jawaban atas pertanyaan bisnis.",
        "Alurnya: pertanyaan → data → olah → insight.",
        "Insight yang baik bisa langsung ditindaklanjuti.",
      ],
      next: "Berikutnya: Modul 2 · Understanding Data Types",
    },
  },
  en: {
    cover: {
      kind: "cover",
      eyebrow: "Module 1 of 5",
      title: "Introduction to Data Analysis",
      subtitle: "Data Analysis Fundamentals · From Data to Insight",
      meta: ["AI lecturer", "Live class", "Voice & chat Q&A"],
    },
    paragraphs: [
      {
        kind: "agenda",
        title: "Course map",
        items: MODULES,
        active: 0,
      },
      {
        kind: "flow",
        title: "What is data analysis?",
        lead: "Turning data into answers to business questions and better decisions.",
        steps: [
          { label: "Question", desc: "What do we want to know?" },
          { label: "Data", desc: "Gather relevant data" },
          { label: "Process", desc: "Clean and analyze" },
          { label: "Insight", desc: "Findings people can act on" },
        ],
      },
      {
        kind: "qa",
        title: "Q&A session",
        lead: "Ask by voice or chat. For example:",
        prompts: [
          "What is the difference between data and information?",
          "Why should analysis start with a question?",
          "What does data analysis look like for an HR team?",
        ],
      },
    ],
    summary: {
      kind: "summary",
      title: "Module 1 summary",
      points: [
        "Data analysis turns data into answers to business questions.",
        "The flow: question → data → process → insight.",
        "Good insights are ones people can act on.",
      ],
      next: "Next: Module 2 · Understanding Data Types",
    },
  },
};

// Jaga-jaga saat skrip diubah tanpa menyesuaikan slide.
{
  for (const lang of Object.keys(LESSON_SLIDES) as LanguageCode[]) {
    if (LESSON_SLIDES[lang].paragraphs.length !== LESSON_SCRIPTS[lang].length) {
      console.warn(
        `[lessonSlides] Jumlah slide (${lang}) tidak sama dengan jumlah paragraf skrip.`,
      );
    }
  }
}

/**
 * Slide yang sedang tampil, mengikuti status pemutar materi.
 * `sent` = jumlah paragraf yang sudah dikirim ke avatar (lesson.current).
 */
export const pickSlide = (
  slides: LessonSlides,
  status: LessonStatus,
  sent: number,
  closing: boolean,
): { slide: Slide; key: string } => {
  if (closing) return { slide: slides.summary, key: "summary" };
  if (status === "idle" || sent === 0)
    return { slide: slides.cover, key: "cover" };
  if (status === "done") {
    const last = slides.paragraphs.length - 1;
    return { slide: slides.paragraphs[last] ?? slides.cover, key: `p${last}` };
  }
  const i = Math.min(sent - 1, slides.paragraphs.length - 1);
  return { slide: slides.paragraphs[i] ?? slides.cover, key: `p${i}` };
};
