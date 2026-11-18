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
    "Di Modul 1, analisis data berarti mengolah data untuk menjawab pertanyaan bisnis: dari pertanyaan, data, olah, sampai insight.",
    "Silakan ajukan pertanyaan.",
  ],
  en: [
    "In Module 1, data analysis means turning data into answers to business questions: question, data, process, insight.",
    "Feel free to ask a question.",
  ],
};
