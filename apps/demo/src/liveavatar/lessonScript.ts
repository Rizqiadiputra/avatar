import type { LanguageCode } from "./languages";

// Skrip materi yang dibawakan avatar di awal sesi, satu paragraf per giliran bicara.
// Salam pembuka ADA di sini (paragraf pertama), bukan di opening_text context:
// opening_text diucapkan server sebelum audio di browser tersambung sehingga
// tidak terdengar. Skrip baru dikirim setelah sesi siap, jadi salamnya terdengar.
// Karena itu opening_text context di LiveAvatar sengaja dikosongkan.
// Setelah paragraf terakhir, avatar masuk ke sesi tanya jawab (dijawab oleh LLM
// sesuai context bahasa yang dipilih).
// Kelas: Data Analysis Fundamentals, Modul 1 (Introduction to Data Analysis).
// Sengaja sangat singkat: sesi sandbox hanya ~60 detik, jadi harus masih ada
// waktu untuk tanya jawab. Contoh dan detail lain ada di context (prompt) dan
// dipakai pengajar saat menjawab pertanyaan.
export const LESSON_SCRIPTS: Record<LanguageCode, string[]> = {
  id: [
    "Halo, selamat datang! Saya pengajar kelas Data Analysis Fundamentals. Hari ini kita masuk ke Modul 1, Introduction to Data Analysis.",
    "Analisis data berarti mengolah data untuk menjawab pertanyaan bisnis: dari pertanyaan, data, olah, sampai insight.",
    "Silakan ajukan pertanyaan.",
  ],
  en: [
    "Hello, and welcome! I'm your instructor for Data Analysis Fundamentals. Today we're starting Module 1, Introduction to Data Analysis.",
    "Data analysis means turning data into answers to business questions: question, data, process, insight.",
    "Feel free to ask a question.",
  ],
};
