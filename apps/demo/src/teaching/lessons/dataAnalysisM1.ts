import type { TeachingLesson } from "../types";

/**
 * Contoh materi Mode Mengajar: Data Analysis Fundamentals, Modul 1.
 *
 * Cara pakai dengan HeyGen:
 * 1. Tempel `script` (p1…p11, satu scene per paragraf) ke HeyGen Avatar IV.
 *    Framing avatar biasa (16:9, latar polos). Kartu/rumus tampil di papan
 *    materi terpisah, jadi jangan aktifkan caption/teks bawaan HeyGen.
 * 2. Simpan hasil render ke public/materi/data-analysis-m1.mp4.
 * 3. Putar di /materi, catat detik mulai tiap paragraf, isi ke `at` di bawah.
 *    Semua overlay memakai jangkar "pN+detik", jadi otomatis ikut bergeser.
 *
 * `at` paragraf saat ini masih perkiraan (±2,3 kata/detik).
 */
export const DATA_ANALYSIS_M1: TeachingLesson = {
  id: "data-analysis-m1",
  title: "Introduction to Data Analysis",
  subtitle: "Data Analysis Fundamentals · Modul 1",
  video: "/materi/data-analysis-m1.mp4",
  duration: 119,
  tutorKey: "sari",
  script: [
    {
      id: "p1",
      at: 0.3,
      text: "Setiap hari perusahaan menghasilkan data dalam jumlah besar, tapi sebagian besar tidak pernah dipakai untuk mengambil keputusan. Di kelas ini, kita belajar mengubah data itu menjadi jawaban.",
    },
    {
      id: "p2",
      at: 12.5,
      text: "Halo, saya Bu Sari, pengajar kelas Data Analysis Fundamentals. Ini Modul 1, Introduction to Data Analysis.",
    },
    {
      id: "p3",
      at: 20,
      text: "Jadi, apa itu analisis data? Analisis data adalah proses mengolah data untuk menjawab pertanyaan bisnis dan mendukung keputusan. Kata kuncinya: menjawab pertanyaan. Tanpa pertanyaan yang jelas, data hanya tumpukan angka.",
    },
    {
      id: "p4",
      at: 33.5,
      text: "Alurnya ada empat langkah. Pertama, pertanyaan: apa yang ingin kita ketahui? Kedua, data: kumpulkan data yang relevan. Ketiga, olah: bersihkan dan analisis. Keempat, insight: temuan yang bisa langsung ditindaklanjuti.",
    },
    {
      id: "p5",
      at: 46.6,
      text: "Contohnya di tim HR. Pertanyaannya: kenapa banyak karyawan baru keluar dalam tiga bulan pertama? Datanya: tanggal masuk, tanggal keluar, divisi, dan hasil wawancara keluar.",
    },
    {
      id: "p6",
      at: 57.6,
      text: "Setelah diolah, ternyata enam puluh persen yang keluar berasal dari dua divisi dengan proses onboarding paling singkat. Itu insight: tim HR bisa langsung memperbaiki onboarding di dua divisi tersebut.",
    },
    {
      id: "p7",
      at: 70.7,
      text: "Satu hal yang sering terlewat: membersihkan data. Data ganda, kosong, atau salah ketik bisa membuat kesimpulan keliru. Banyak analis menghabiskan sebagian besar waktunya di langkah ini.",
    },
    {
      id: "p8",
      at: 82.5,
      text: "Sebelum lanjut, coba cek pemahamanmu dulu.",
    },
    {
      id: "p9",
      at: 85.6,
      text: "Ukuran paling sederhana dalam analisis adalah rata-rata: jumlahkan semua nilai, lalu bagi dengan banyaknya data. Misalnya lama kerja lima karyawan: dua, empat, empat, enam, dan sembilan bulan. Jumlahnya dua puluh lima, dibagi lima, rata-ratanya lima bulan.",
    },
    {
      id: "p10",
      at: 101.8,
      text: "Kita rangkum. Analisis data mengubah data menjadi jawaban. Alurnya: pertanyaan, data, olah, insight. Dan data harus dibersihkan sebelum diolah.",
    },
    {
      id: "p11",
      at: 110.5,
      text: "Di modul berikutnya kita bahas jenis-jenis data. Sekarang, kalau ada yang ingin ditanyakan, silakan tanya langsung ke saya.",
    },
  ],
  chapters: [
    { at: 0, title: "Pembuka" },
    { at: "p3", title: "Definisi" },
    { at: "p4", title: "Alur", card: false },
    { at: "p5", title: "Contoh HR" },
    { at: "p7", title: "Bersihkan", card: false },
    { at: "p9", title: "Rata-rata" },
    { at: "p10", title: "Rangkuman", card: false },
  ],
  pack: [
    // Pembuka: inti dulu, salam belakangan (playbook: 3 detik pertama).
    {
      use: "Keyword",
      at: "p1+0.3",
      until: "p1+4",
      text: "Data menumpuk",
    },
    {
      use: "Keyword",
      at: "p1+4",
      until: "p1+7.5",
      text: "…tapi jarang dipakai",
      sub: "untuk mengambil keputusan",
    },
    {
      use: "Keyword",
      at: "p1+7.5",
      until: "p2",
      text: "Data → Jawaban",
    },
    {
      use: "LowerThird",
      at: "p2",
      until: "p2+6",
      name: "Bu Sari",
      role: "Pengajar · Data Analysis Fundamentals",
    },
    {
      use: "Keyword",
      at: "p2+3.5",
      until: "p2+7.5",
      text: "Modul 1",
      sub: "Introduction to Data Analysis",
    },

    // Definisi
    {
      use: "Card",
      at: "p3+2.6",
      until: "p3+7",
      title: "Analisis data",
      items: [
        "Mengolah data",
        "Menjawab pertanyaan bisnis",
        "Mendukung keputusan",
      ],
    },
    {
      use: "Keyword",
      at: "p3+7",
      until: "p3+13",
      text: "Mulai dari pertanyaan",
    },
    {
      use: "Callout",
      at: "p3+10.5",
      until: "p3+13.5",
      tone: "info",
      text: "Tanpa pertanyaan, data hanya tumpukan angka",
    },

    // Alur 4 langkah
    {
      use: "Card",
      at: "p4",
      until: "p4+13",
      title: "Alur analisis data",
      items: [
        { text: "1 · Pertanyaan: apa yang ingin diketahui?", at: "p4+2" },
        { text: "2 · Data: kumpulkan yang relevan", at: "p4+5.5" },
        { text: "3 · Olah: bersihkan & analisis", at: "p4+8.5" },
        {
          text: "4 · Insight: temuan yang bisa ditindaklanjuti",
          at: "p4+10.5",
        },
      ],
    },

    // Contoh HR
    {
      use: "Card",
      at: "p5+2.6",
      until: "p5+10.5",
      title: "Contoh: tim HR",
      items: [
        "Pertanyaan: kenapa karyawan baru keluar < 3 bulan?",
        "Data: tanggal masuk & keluar, divisi, wawancara keluar",
      ],
    },
    {
      use: "Counter",
      at: "p6+3",
      until: "p6+8",
      to: 60,
      suffix: "%",
      label: "yang keluar berasal dari 2 divisi",
    },
    {
      use: "SourceTag",
      at: "p6+3",
      until: "p6+8",
      text: "Data contoh untuk ilustrasi",
    },
    {
      use: "Keyword",
      at: "p6+8",
      until: "p6+13",
      text: "Insight",
      sub: "Perbaiki onboarding di 2 divisi itu",
    },

    // Bersihkan data
    {
      use: "Callout",
      at: "p7+1",
      until: "p7+5",
      tone: "warn",
      text: "Perhatikan: bersihkan data sebelum diolah",
    },
    {
      use: "Card",
      at: "p7+3",
      until: "p7+11",
      title: "Masalah data yang umum",
      items: ["Data ganda", "Data kosong", "Salah ketik"],
    },

    // Kuis
    {
      use: "Quiz",
      at: "p8+2.8",
      question: "Langkah pertama dalam analisis data adalah…",
      options: [
        "Mengumpulkan data sebanyak-banyaknya",
        "Menentukan pertanyaan yang ingin dijawab",
        "Membuat grafik",
      ],
      answer: 1,
      explain:
        "Analisis dimulai dari pertanyaan. Pertanyaan menentukan data apa yang perlu dikumpulkan dan diolah.",
    },

    // Rata-rata: rumus tumbuh sesuai ucapan
    {
      use: "Formula",
      at: "p9+2.6",
      until: "p9+16.5",
      caption: "Rata-rata (mean)",
      parts: [
        { text: "x̄ =" },
        { text: "Σx", at: "p9+5" },
        { text: "÷ n", at: "p9+7.5" },
        { text: "(2 + 4 + 4 + 6 + 9) ÷ 5", at: "p9+10", newline: true },
        { text: "= 25 ÷ 5", at: "p9+13", newline: true },
        { text: "= 5 bulan", at: "p9+15" },
      ],
    },

    // Rangkuman + menuju tanya jawab
    {
      use: "Recap",
      at: "p10",
      until: "p11",
      title: "Ringkasan Modul 1",
      items: [
        "Analisis data mengubah data menjadi jawaban",
        "Alur: pertanyaan → data → olah → insight",
        "Bersihkan data sebelum diolah",
      ],
    },
    {
      use: "Keyword",
      at: "p11",
      until: "p11+4.5",
      text: "Berikutnya",
      sub: "Modul 2 · Jenis-jenis data",
    },
    {
      use: "Callout",
      at: "p11+4.5",
      until: "p11+9",
      tone: "info",
      text: "Setelah video: tanya jawab lewat suara atau chat",
    },
  ],
};
