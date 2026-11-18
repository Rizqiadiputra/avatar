import type { LanguageCode } from "./languages";

// Skrip materi yang dibawakan avatar di awal sesi, satu paragraf per giliran bicara.
// Salam pembuka TIDAK ada di sini: avatar mengucapkannya sendiri lewat
// opening_text context bahasa tersebut (lihat CONTEXT_IDS di app/api/secrets.ts),
// dan materi baru dimulai setelah salam itu selesai.
// Setelah paragraf terakhir, avatar masuk ke sesi tanya jawab (dijawab oleh LLM
// sesuai context bahasa yang dipilih).
// Kelas: Data Analysis Fundamentals, Modul 1 (Introduction to Data Analysis).
// Sengaja sangat singkat: sesi sandbox hanya ~60 detik, jadi harus masih ada
// waktu untuk tanya jawab. Contoh dan detail lain ada di context (prompt) dan
// dipakai pengajar saat menjawab pertanyaan.
export const LESSON_SCRIPTS: Record<LanguageCode, string[]> = {
  id: [
    "Hari ini kita masuk ke Modul 1, Introduction to Data Analysis.",
    "Analisis data adalah proses mengolah data untuk menjawab pertanyaan bisnis, mulai dari pertanyaan yang jelas sampai insight yang bisa ditindaklanjuti.",
    "Silakan ajukan pertanyaan seputar analisis data.",
  ],
  en: [
    "Today we are starting Module 1, Introduction to Data Analysis.",
    "Data analysis is the process of turning data into answers to business questions, from a clear question all the way to insights people can act on.",
    "Feel free to ask any questions about data analysis.",
  ],
};
