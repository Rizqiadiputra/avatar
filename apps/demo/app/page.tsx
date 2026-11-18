import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const CTA_HREF = "/kelas";
const EXPLORE_HREF = "#jelajahi-kelas";

/* ------------------------------------------------------------------ */
/* Ikon (inline SVG, stroke mengikuti currentColor)                    */
/* ------------------------------------------------------------------ */
type IconName =
  | "avatar"
  | "book"
  | "mic"
  | "target"
  | "globe"
  | "clock"
  | "users"
  | "check"
  | "play"
  | "spark"
  | "shield"
  | "chart"
  | "briefcase"
  | "building"
  | "arrow";

const PATHS: Record<IconName, string> = {
  avatar:
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0M3 3h4M3 3v4M21 3h-4M21 3v4",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 14a2 2 0 0 1 2-2h13M8 7h7M8 11h5",
  mic: "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Zm-7 8a7 7 0 0 0 14 0M12 18v3",
  target:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5a6 6 0 0 1 3 5.5",
  check: "m5 12 4.5 4.5L19 7",
  play: "M8 5.5v13l10-6.5-10-6.5Z",
  spark:
    "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  shield:
    "M12 3 4.5 6v5.5c0 4.5 3.2 8.2 7.5 9.5 4.3-1.3 7.5-5 7.5-9.5V6L12 3Zm-3.5 9 2.5 2.5 4.5-5",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  briefcase:
    "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M4 7h16a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1Zm-1 6h18",
  building:
    "M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h3a1 1 0 0 1 1 1v11M2 21h20M8 7h4M8 11h4M8 15h4",
  arrow: "M5 12h14m-5-5 5 5-5 5",
};

const Icon = ({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d={PATHS[name]} />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Konten                                                              */
/* ------------------------------------------------------------------ */
const NAV = [
  { href: "#untuk-siapa", label: "Untuk siapa" },
  { href: "#kurikulum", label: "Kurikulum" },
  { href: "#jelajahi-kelas", label: "Kelas" },
  { href: "#pilihan-kelas", label: "Paket" },
  { href: "#faq", label: "FAQ" },
];

const HERO_POINTS = [
  "Untuk profesional dan karyawan",
  "Kurikulum AI-generated, human-validated",
  "Tanya jawab langsung lewat suara dan chat",
  "Latihan, studi kasus, dan evaluasi",
];

const AUDIENCES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "briefcase",
    title: "Profesional",
    body: "Menambah keahlian yang dibutuhkan untuk naik peran, pindah karier, atau menangani tanggung jawab baru.",
  },
  {
    icon: "users",
    title: "Karyawan dan fresh graduate",
    body: "Membangun kompetensi kerja inti dengan materi terstruktur yang bisa diikuti di sela jam kerja.",
  },
  {
    icon: "building",
    title: "Tim dan perusahaan",
    body: "Mendukung program pengembangan karyawan dengan kelas yang konsisten dan mudah diikuti banyak peserta.",
  },
];

/** Katalog kelas. Hanya kelas berstatus "available" yang bisa dicoba di demo. */
const CATALOG: {
  title: string;
  level: string;
  body: string;
  available: boolean;
}[] = [
  {
    title: "Data Analysis Fundamentals",
    level: "Pemula",
    body: "Dari jenis data, data cleaning, dan SQL dasar hingga visualisasi untuk mengambil keputusan.",
    available: true,
  },
  {
    title: "Komunikasi Efektif di Tempat Kerja",
    level: "Pemula",
    body: "Menyampaikan ide dengan jelas, memberi umpan balik, dan berkomunikasi lintas tim.",
    available: false,
  },
  {
    title: "Excel untuk Analisis Bisnis",
    level: "Pemula–Menengah",
    body: "Formula, pivot table, dan dashboard sederhana untuk laporan kerja sehari-hari.",
    available: false,
  },
  {
    title: "Project Management Fundamentals",
    level: "Pemula",
    body: "Merencanakan lingkup, jadwal, risiko, dan koordinasi tim dalam proyek.",
    available: false,
  },
];

/** Contoh kelas yang ditampilkan di landing page. */
const SAMPLE_COURSE = {
  title: "Data Analysis Fundamentals",
  subtitle: "From Data to Insight",
  modules: [
    "Introduction to Data Analysis",
    "Understanding Data Types",
    "Data Cleaning Fundamentals",
    "Introduction to SQL",
    "Basic Data Visualization",
  ],
};

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "book",
    title: "Kurikulum Berbasis Kompetensi",
    body: "Setiap kelas disusun dari learning objectives yang jelas dan relevan dengan kebutuhan kerja, lalu divalidasi oleh praktisi.",
  },
  {
    icon: "avatar",
    title: "Kelas Live yang Dipandu",
    body: "Pengajar AI membawakan materi secara bertahap, lengkap dengan slide yang tersinkron, seperti mengikuti kelas sungguhan.",
  },
  {
    icon: "mic",
    title: "Tanya Jawab Langsung",
    body: "Tidak hanya menonton materi. Anda dapat bertanya menggunakan suara atau chat dan mendapatkan penjelasan langsung dari pengajar AI.",
  },
  {
    icon: "target",
    title: "Pembelajaran Berbasis Praktik",
    body: "Pelajari konsep sekaligus penerapannya melalui latihan, studi kasus, dan evaluasi untuk mengukur pemahaman.",
  },
  {
    icon: "globe",
    title: "Bahasa Indonesia dan Inggris",
    body: "Pilih bahasa pembelajaran sesuai kebutuhan, dengan penjelasan dan contoh yang relevan.",
  },
  {
    icon: "clock",
    title: "Sesuai Ritme Kerja",
    body: "Pilih jadwal kelas grup atau atur sesi privat sendiri, menyesuaikan kesibukan profesional Anda.",
  },
];

const FLOW = [
  {
    title: "Pilih Kelas",
    body: "Pilih program dan mata kuliah sesuai kompetensi yang ingin Anda kembangkan.",
  },
  {
    title: "Ikuti Pembelajaran",
    body: "Pengajar AI membawakan materi secara bertahap menggunakan avatar dan suara.",
  },
  {
    title: "Diskusi dan Bertanya",
    body: "Ajukan pertanyaan melalui mikrofon atau chat. Pengajar AI memberikan penjelasan dan contoh tambahan.",
  },
  {
    title: "Evaluasi Pemahaman",
    body: "Selesaikan latihan dan evaluasi untuk mengetahui sejauh mana materi telah dipahami.",
  },
];

/** Alur penyusunan kurikulum: AI-generated, human-validated. */
const CURRICULUM_STEPS: {
  icon: IconName;
  tag: string;
  title: string;
  body: string;
}[] = [
  {
    icon: "target",
    tag: "Desain",
    title: "Learning objectives ditetapkan",
    body: "Kompetensi yang ingin dicapai dirumuskan lebih dulu, lalu dipecah menjadi modul.",
  },
  {
    icon: "spark",
    tag: "AI-generated",
    title: "AI menyusun draf materi",
    body: "AI membuat naskah, slide, contoh, latihan, dan bank soal berdasarkan objectives tersebut.",
  },
  {
    icon: "shield",
    tag: "Human-validated",
    title: "Praktisi meninjau dan memvalidasi",
    body: "Akademisi atau praktisi di bidangnya memeriksa akurasi, relevansi, dan contoh kasus sebelum materi dipakai.",
  },
  {
    icon: "chart",
    tag: "Perbaikan",
    title: "Diperbarui secara berkala",
    body: "Materi direvisi berdasarkan hasil evaluasi dan masukan peserta.",
  },
];

const PACKAGES: {
  name: string;
  icon: IconName;
  desc: string;
  mechanics: [string, string][];
  points: string[];
  cta: string;
  highlight: boolean;
}[] = [
  {
    name: "Kelas Grup",
    icon: "users",
    desc: "Belajar bersama peserta lain dalam satu sesi pembelajaran dengan jadwal yang telah ditentukan.",
    mechanics: [
      ["Jadwal", "Sesi live terjadwal, daftar lalu masuk di jam kelas"],
      ["Peserta", "Beberapa peserta dalam satu ruang kelas"],
      ["Bertanya", "Angkat tangan, lalu pengajar memberi giliran"],
      ["Chat", "Chat kelas dibagikan ke semua peserta"],
    ],
    points: [
      "Interaksi bersama peserta lain",
      "Tanya jawab langsung dengan pengajar AI",
      "Kurikulum dan materi terstruktur",
      "Lebih efisien dari sisi biaya",
    ],
    cta: "Coba Kelas Grup",
    highlight: true,
  },
  {
    name: "Kelas Privat 1:1",
    icon: "avatar",
    desc: "Pengalaman belajar personal dengan pengajar AI yang mengikuti kebutuhan dan tempo belajar Anda.",
    mechanics: [
      ["Jadwal", "Mulai kapan saja sesuai waktu Anda"],
      ["Peserta", "Hanya Anda dan pengajar AI"],
      ["Bertanya", "Bisa menyela dan bertanya kapan saja"],
      ["Tempo", "Penjelasan menyesuaikan pemahaman Anda"],
    ],
    points: [
      "Pembelajaran personal",
      "Fokus pada kebutuhan kompetensi",
      "Fleksibilitas waktu belajar",
      "Interaksi dan diskusi lebih intensif",
    ],
    cta: "Coba Kelas Privat",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Apa itu Guru AI?",
    a: "Guru AI adalah platform professional learning untuk meningkatkan kompetensi kerja. Kelasnya berlangsung live, dipandu pengajar AI yang menyampaikan materi tervalidasi dan menjawab pertanyaan peserta secara langsung.",
  },
  {
    q: "Apa bedanya dengan chatbot AI?",
    a: "Chatbot umumnya merespons ketika pengguna bertanya. Guru AI dirancang untuk memimpin proses pembelajaran, mulai dari membuka kelas, menjelaskan materi secara terstruktur, memberikan contoh, hingga mengadakan sesi tanya jawab.",
  },
  {
    q: "Siapa yang menyusun materi pembelajaran?",
    a: "Materi dan kurikulum dikembangkan menggunakan AI, kemudian ditinjau dan divalidasi oleh akademisi atau praktisi sesuai bidang keahliannya.",
  },
  {
    q: "Apakah saya bisa bertanya langsung kepada pengajar?",
    a: "Ya. Anda dapat mengajukan pertanyaan melalui mikrofon atau chat selama sesi pembelajaran.",
  },
  {
    q: "Siapa yang cocok menggunakan Guru AI?",
    a: "Guru AI ditujukan bagi profesional dan karyawan yang ingin meningkatkan kompetensi kerja, termasuk fresh graduate dan tim perusahaan yang menjalankan program pengembangan karyawan.",
  },
  {
    q: "Kelas apa yang bisa saya coba sekarang?",
    a: "Saat ini kelas demo yang tersedia adalah Data Analysis Fundamentals. Kelas lain di katalog sedang disiapkan dan akan dibuka bertahap.",
  },
  {
    q: "Apa yang dibutuhkan untuk mengikuti kelas?",
    a: "Laptop atau smartphone, browser yang kompatibel, koneksi internet stabil, dan mikrofon jika ingin berinteraksi melalui suara.",
  },
];

/* ------------------------------------------------------------------ */
/* Komponen kecil                                                      */
/* ------------------------------------------------------------------ */
const PrimaryButton = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    href={CTA_HREF}
    className={`inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 ${className}`}
  >
    {children}
  </Link>
);

const SecondaryButton = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <a
    href={EXPLORE_HREF}
    className={`inline-flex items-center justify-center gap-2 rounded-xl border border-teal-700/25 bg-white px-6 py-3.5 text-[15px] font-semibold text-teal-800 transition hover:-translate-y-0.5 hover:border-teal-700/50 hover:bg-teal-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 ${className}`}
  >
    {children}
  </a>
);

const SectionHeading = ({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) => (
  <div className="mx-auto max-w-2xl text-center">
    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600">
      {eyebrow}
    </p>
    <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
      {title}
    </h2>
    <div className="mt-5 flex items-center justify-center" aria-hidden>
      <span className="h-0.5 w-16 rounded-full bg-teal-700" />
      <span className="h-2 w-2 rounded-full bg-teal-700" />
      <span className="h-0.5 w-16 rounded-full bg-teal-700" />
    </div>
  </div>
);

const Logo = () => (
  <Link href="/" className="flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
      <Icon name="spark" className="h-[18px] w-[18px]" />
    </span>
    <span className="leading-none">
      <span className="block text-lg font-extrabold tracking-tight text-slate-900">
        Guru<span className="text-teal-700"> AI</span>
      </span>
      <span className="hidden text-[11px] font-medium text-slate-400 sm:block">
        Professional Learning, Powered by AI
      </span>
    </span>
  </Link>
);

/** Mockup ruang kelas: video avatar + panel chat, mirip aplikasi aslinya. */
const ClassroomMockup = () => (
  <div className="relative">
    <div
      className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-200/60 via-emerald-100/60 to-white blur-2xl"
      aria-hidden
    />
    <div className="relative rounded-3xl border border-teal-900/10 bg-white p-3 shadow-2xl shadow-teal-900/10">
      <div className="flex items-center gap-1.5 px-2 pb-3 pt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 truncate text-xs font-medium text-slate-400">
          {SAMPLE_COURSE.title}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900">
          <Image
            src="/guru-avatar.webp"
            alt="Pengajar AI sedang membawakan materi"
            width={1280}
            height={720}
            priority
            className="aspect-video h-full w-full object-cover"
          />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            Live
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-teal-800 backdrop-blur">
            <Icon name="mic" className="h-3.5 w-3.5" />
            Pengajar sedang berbicara
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 text-[12px] leading-snug">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Chat kelas
          </p>
          <div className="rounded-xl rounded-tl-sm bg-white p-2.5 text-slate-700 shadow-sm">
            <span className="mb-0.5 block text-[10px] font-semibold text-teal-700">
              Pengajar
            </span>
            Sekarang kita bahas jenis-jenis data.
          </div>
          <div className="ml-4 rounded-xl rounded-tr-sm bg-teal-700 p-2.5 text-white shadow-sm">
            <span className="mb-0.5 block text-[10px] font-semibold text-teal-100">
              Anda
            </span>
            Apa beda data kategorik dan numerik?
          </div>
          <div className="rounded-xl rounded-tl-sm bg-white p-2.5 text-slate-700 shadow-sm">
            <span className="mb-0.5 block text-[10px] font-semibold text-teal-700">
              Pengajar
            </span>
            Data kategorik berupa label, misalnya nama divisi…
          </div>
        </div>
      </div>
    </div>

    <div className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl border border-teal-900/5 bg-white px-4 py-3 shadow-xl shadow-teal-900/10 sm:flex">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon name="chart" />
      </span>
      <div>
        <p className="text-sm font-bold text-slate-900">Modul 2 dari 5</p>
        <p className="text-xs text-slate-500">{SAMPLE_COURSE.modules[1]}</p>
      </div>
    </div>
  </div>
);

/** Kartu silabus contoh kelas. */
const CourseCard = () => (
  <div className="relative overflow-hidden rounded-3xl border border-teal-900/10 bg-white p-3 shadow-xl shadow-teal-900/5">
    <div className="relative overflow-hidden rounded-2xl">
      <Image
        src="/guru-avatar.webp"
        alt="Pengajar AI kelas Data Analysis Fundamentals"
        width={1280}
        height={720}
        className="aspect-[16/8] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-teal-950/85 via-teal-950/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
          Contoh kelas
        </p>
        <h3 className="mt-1 text-xl font-bold text-white">
          {SAMPLE_COURSE.title}
        </h3>
        <p className="text-sm text-teal-100">{SAMPLE_COURSE.subtitle}</p>
      </div>
    </div>
    <ol className="mt-3 flex flex-col">
      {SAMPLE_COURSE.modules.map((m, i) => (
        <li
          key={m}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-slate-700 odd:bg-teal-50/50"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white">
            {i + 1}
          </span>
          {m}
        </li>
      ))}
    </ol>
  </div>
);

/* ------------------------------------------------------------------ */
/* Halaman                                                             */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  return (
    <div
      className={`${font.className} min-h-screen w-full self-stretch bg-white text-slate-700 antialiased`}
    >
      {/* Navigasi */}
      <header className="sticky top-0 z-30 border-b border-teal-900/5 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="transition hover:text-teal-700"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <Link
            href={CTA_HREF}
            className="shrink-0 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Coba Kelas Demo
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/80 via-emerald-50/40 to-white">
          <div
            className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-teal-200/40 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:pt-20">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-700/15 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Professional learning untuk karyawan dan profesional
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
                Tingkatkan kompetensi kerja Anda,{" "}
                <span className="text-teal-700">selangkah demi selangkah</span>.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500">
                Kelas live dengan kurikulum berbasis kompetensi yang disusun AI
                dan divalidasi praktisi. Pengajar AI memandu materi, menjawab
                pertanyaan Anda secara langsung, dan mengukur pemahaman lewat
                latihan.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton>
                  <Icon name="play" className="h-4 w-4" />
                  Coba Kelas Demo
                </PrimaryButton>
                <SecondaryButton>
                  Jelajahi Kelas
                  <Icon name="arrow" className="h-4 w-4" />
                </SecondaryButton>
              </div>
              <ul className="mt-8 grid gap-x-6 gap-y-2.5 text-sm text-slate-600 sm:grid-cols-2">
                {HERO_POINTS.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Icon name="check" className="h-3 w-3" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <ClassroomMockup />
          </div>
        </section>

        {/* Untuk siapa */}
        <section id="untuk-siapa" className="scroll-mt-16 pt-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Untuk siapa"
              title="Dirancang untuk profesional yang ingin terus berkembang"
            />
            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {AUDIENCES.map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-teal-50/60 p-6"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
                    <Icon name={a.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fitur */}
        <section id="fitur" className="scroll-mt-16 py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Fitur unggulan"
              title="Belajar terarah, bukan sekadar menonton video"
            />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-teal-700/20 hover:shadow-xl hover:shadow-teal-900/5"
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1.5 bg-teal-700"
                    aria-hidden
                  />
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                    <Icon name={f.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-500">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cara kerja */}
        <section
          id="cara-kerja"
          className="scroll-mt-16 bg-gradient-to-b from-emerald-50/70 to-teal-50/40 py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Cara kerja"
              title="Pengalaman belajar yang interaktif dalam satu sesi"
            />
            <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
              <CourseCard />
              <ol className="relative flex flex-col gap-2 border-l-2 border-teal-700/15 pl-6">
                {FLOW.map((s, i) => (
                  <li
                    key={s.title}
                    className={`relative rounded-2xl p-5 transition ${
                      i === 0
                        ? "bg-white shadow-lg shadow-teal-900/5"
                        : "hover:bg-white/70"
                    }`}
                  >
                    <span
                      className={`absolute -left-[33px] top-6 flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                        i === 0
                          ? "border-teal-700 bg-teal-700"
                          : "border-teal-700/30 bg-white"
                      }`}
                      aria-hidden
                    />
                    <p className="font-mono text-xs font-bold tracking-wider text-emerald-600">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate-500">
                      {s.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Kurikulum: AI-generated, human-validated */}
        <section id="kurikulum" className="scroll-mt-16 py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div className="border-l-4 border-teal-700 pl-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Kurikulum
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                AI-generated, human-validated.
              </h2>
              <div className="mt-6 flex flex-col gap-4 text-[17px] leading-relaxed text-slate-500">
                <p>
                  AI membantu kami menyusun materi dengan cepat dan konsisten.
                  Namun tidak ada materi yang sampai ke kelas sebelum diperiksa
                  manusia.
                </p>
                <p>
                  Setiap modul ditinjau oleh akademisi atau praktisi yang
                  kompeten di bidangnya, untuk memastikan isinya akurat, relevan
                  dengan kebutuhan kerja, dan memakai contoh yang tepat.
                </p>
                <p>
                  Saat tanya jawab, pengajar AI menjawab dengan berpegang pada
                  materi yang sudah divalidasi tersebut.
                </p>
              </div>
            </div>
            <ol className="flex flex-col gap-4">
              {CURRICULUM_STEPS.map((c, i) => (
                <li
                  key={c.title}
                  className={`flex items-start gap-4 rounded-2xl border p-5 ${
                    c.tag === "Human-validated"
                      ? "border-teal-700/30 bg-teal-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {String(i + 1).padStart(2, "0")} · {c.tag}
                    </p>
                    <h3 className="mt-0.5 font-bold text-slate-900">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate-500">
                      {c.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Jelajahi kelas */}
        <section
          id="jelajahi-kelas"
          className="scroll-mt-16 bg-gradient-to-b from-emerald-50/70 to-teal-50/40 py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Jelajahi kelas"
              title="Kelas untuk kompetensi kerja yang paling dibutuhkan"
            />
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {CATALOG.map((c) => (
                <div
                  key={c.title}
                  className={`flex flex-col rounded-2xl border bg-white p-6 ${
                    c.available
                      ? "border-teal-700/30 shadow-xl shadow-teal-900/5"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span
                      className={`rounded-full px-2.5 py-1 ${
                        c.available
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c.available ? "Demo tersedia" : "Segera hadir"}
                    </span>
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-teal-800">
                      {c.level}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    {c.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-500">
                    {c.body}
                  </p>
                  {c.available ? (
                    <Link
                      href={CTA_HREF}
                      className="mt-5 inline-flex items-center gap-2 self-start rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                      <Icon name="play" className="h-4 w-4" />
                      Coba Kelas Demo
                    </Link>
                  ) : (
                    <span className="mt-5 text-sm font-medium text-slate-400">
                      Sedang disiapkan
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pilihan kelas */}
        <section
          id="pilihan-kelas"
          className="scroll-mt-16 bg-gradient-to-b from-teal-50/50 to-white py-24"
        >
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Pilihan kelas"
              title="Pilih cara belajar yang sesuai kebutuhan Anda"
            />
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {PACKAGES.map((p) => (
                <div
                  key={p.name}
                  className={`flex flex-col rounded-3xl p-8 ${
                    p.highlight
                      ? "bg-teal-800 text-white shadow-2xl shadow-teal-900/25"
                      : "border border-slate-200 bg-white"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      p.highlight
                        ? "bg-white/15 text-white"
                        : "bg-teal-50 text-teal-700"
                    }`}
                  >
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <h3
                    className={`mt-6 text-2xl font-bold ${p.highlight ? "text-white" : "text-slate-900"}`}
                  >
                    {p.name}
                  </h3>
                  <p
                    className={`mt-2 text-[15px] leading-relaxed ${p.highlight ? "text-teal-100" : "text-slate-500"}`}
                  >
                    {p.desc}
                  </p>
                  <dl
                    className={`mt-6 grid gap-2.5 rounded-2xl p-4 text-sm ${
                      p.highlight ? "bg-white/10" : "bg-teal-50/60"
                    }`}
                  >
                    {p.mechanics.map(([k, v]) => (
                      <div
                        key={k}
                        className="grid grid-cols-[5.5rem_1fr] gap-2"
                      >
                        <dt
                          className={`font-semibold ${p.highlight ? "text-emerald-300" : "text-teal-800"}`}
                        >
                          {k}
                        </dt>
                        <dd
                          className={
                            p.highlight ? "text-teal-50" : "text-slate-600"
                          }
                        >
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <ul className="mt-6 flex flex-1 flex-col gap-3 text-[15px]">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            p.highlight
                              ? "bg-emerald-400 text-teal-950"
                              : "bg-teal-100 text-teal-800"
                          }`}
                        >
                          <Icon name="check" className="h-3 w-3" />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={CTA_HREF}
                    className={`mt-8 rounded-xl px-6 py-3.5 text-center text-[15px] font-semibold transition ${
                      p.highlight
                        ? "bg-white text-teal-800 hover:bg-teal-50"
                        : "bg-teal-700 text-white hover:bg-teal-800"
                    }`}
                  >
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Alur setiap sesi
              </p>
              <ol className="mt-4 grid gap-3 text-[15px] text-slate-600 sm:grid-cols-4">
                {[
                  "Pembukaan dan tujuan sesi",
                  "Materi dengan slide tersinkron",
                  "Tanya jawab lewat suara atau chat",
                  "Kuis singkat dan ringkasan",
                ].map((t, i) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-16 py-24">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="FAQ"
              title="Pertanyaan yang sering diajukan"
            />
            <div className="mt-12 flex flex-col gap-3">
              {FAQS.map((f, i) => (
                <details
                  key={f.q}
                  open={i === 0}
                  className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 open:border-teal-700/25 open:bg-teal-50/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-lg leading-none text-teal-700 transition group-open:rotate-45 group-open:bg-teal-700 group-open:text-white">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA penutup */}
        <section className="px-4 pb-24 sm:px-6">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 px-6 py-16 text-center sm:px-12">
            <div
              className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl"
              aria-hidden
            />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Siap meningkatkan kompetensi kerja Anda?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-teal-100">
              Rasakan langsung kelas Data Analysis Fundamentals, atau lihat
              kelas lain yang sedang kami siapkan.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={CTA_HREF}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-[15px] font-bold text-teal-800 shadow-xl transition hover:-translate-y-0.5 hover:bg-teal-50"
              >
                <Icon name="play" className="h-4 w-4" />
                Coba Kelas Demo
              </Link>
              <a
                href={EXPLORE_HREF}
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-7 py-4 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Jelajahi Kelas
                <Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:px-6">
          <span className="font-bold text-slate-700">
            Guru<span className="text-teal-700"> AI</span>
            <span className="ml-2 font-medium italic text-slate-400">
              Learn More. Grow Further.
            </span>
          </span>
          <span>© {new Date().getFullYear()} Guru AI</span>
        </div>
      </footer>
    </div>
  );
}
