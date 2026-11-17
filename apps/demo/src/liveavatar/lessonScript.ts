import type { LanguageCode } from "./languages";

// Skrip materi yang dibawakan avatar di awal sesi, satu paragraf per giliran bicara.
// Salam pembuka TIDAK ada di sini: avatar mengucapkannya sendiri lewat
// opening_text context bahasa tersebut (lihat CONTEXT_IDS di app/api/secrets.ts),
// dan materi baru dimulai setelah salam itu selesai.
// Setelah paragraf terakhir, avatar masuk ke sesi tanya jawab (dijawab oleh LLM
// sesuai context bahasa yang dipilih).
export const LESSON_SCRIPTS: Record<LanguageCode, string[]> = {
  id: [
    "Hari ini, kita akan mempelajari komunikasi efektif di lingkungan kerja.",
    "Sekarang, mari kita lanjutkan ke sesi tanya jawab. Silakan ajukan pertanyaan terkait materi yang telah kita pelajari.",
  ],
  en: [
    "Today, we will learn about effective communication in the workplace.",
    "Effective communication is not only about sharing information. It also means making sure the message is clearly understood, listening actively, and understanding what the other person needs.",
    "At work, this skill helps teams collaborate, solve problems, and build good relationships with customers.",
    "For example, before offering a solution to a customer, we need to understand the challenges they face, so the solution actually fits.",
    "In short, effective communication takes clarity, good listening, and understanding the person you are talking to.",
    "Now, let's move on to questions and answers. Feel free to ask anything about what we have covered.",
  ],
};
