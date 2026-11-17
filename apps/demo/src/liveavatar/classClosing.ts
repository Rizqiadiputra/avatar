import type { LanguageCode } from "./languages";

// Pengaturan penutupan kelas oleh avatar dosen.

/**
 * Durasi kelas yang direncanakan, dalam menit. Kelas ditutup otomatis
 * menjelang waktu ini. Kalau batas sesi LiveAvatar lebih pendek (misalnya di
 * sandbox), batas sesi itulah yang dipakai. `null` = hanya ikut batas sesi.
 */
export const CLASS_DURATION_MINUTES: number | null = 45;

/** Berapa detik sebelum waktu habis dosen mulai mengucapkan penutup. */
export const TIME_UP_LEAD_SECONDS = 30;

/**
 * Kalau sesi tanya jawab sepi (tidak ada yang bicara) selama ini, dosen
 * menutup kelas. `null` = tidak pernah menutup karena sepi.
 */
export const IDLE_CLOSE_MINUTES: number | null = 3;

export type ClosingReason = "time_up" | "finished" | "idle";

export const CLOSING_SCRIPTS: Record<
  LanguageCode,
  Record<ClosingReason, string>
> = {
  id: {
    time_up:
      "Baik, waktu kita untuk sesi hari ini sudah habis. Terima kasih atas partisipasi dan pertanyaannya. Pembahasan yang belum selesai akan kita lanjutkan minggu depan. Sampai jumpa!",
    finished:
      "Baik, materi dan sesi tanya jawab kita hari ini sudah selesai. Ingat, komunikasi efektif butuh kejelasan, kemampuan mendengarkan, dan pemahaman terhadap lawan bicara. Terima kasih sudah mengikuti, sampai jumpa di materi berikutnya!",
    idle: "Sepertinya sudah tidak ada pertanyaan lagi. Kalau begitu, kita cukupkan sesi hari ini. Silakan pelajari kembali materinya, dan sampai jumpa di materi berikutnya!",
  },
  en: {
    time_up:
      "Alright, we have run out of time for today's session. Thank you for your participation and questions. We will continue where we left off next week. See you then!",
    finished:
      "Alright, that wraps up today's material and Q&A. Remember, effective communication takes clarity, good listening, and understanding the person you are talking to. Thank you for joining, and see you in the next lesson!",
    idle: "It looks like there are no more questions. In that case, let's wrap up today's session. Please review the material, and see you in the next lesson!",
  },
};
