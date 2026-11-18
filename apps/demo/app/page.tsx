import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const CTA_HREF = "/kelas";

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
  | "chart";

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
  { href: "#fitur", label: "Fitur" },
  { href: "#cara-kerja", label: "Cara kerja" },
  { href: "#pilihan-kelas", label: "Pilihan kelas" },
  { href: "#faq", label: "FAQ" },
];

const HERO_POINTS = [
  "Kelas interaktif",
  "Bisa bertanya melalui suara dan chat",
  "Materi terstruktur dan ditinjau praktisi",
  "Belajar dari mana saja",
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
    icon: "avatar",
    title: "AI Lecturer",
    body: "Belajar bersama pengajar AI dengan avatar, suara, dan metode penyampaian materi yang interaktif. Rasakan pengalaman mengikuti kelas tanpa harus bertemu langsung dengan pengajar.",
  },
  {
    icon: "book",
    title: "Kurikulum Terstruktur",
    body: "Materi pembelajaran dikembangkan dengan bantuan AI, disusun berdasarkan learning objectives, dan ditinjau oleh akademisi atau praktisi yang kompeten di bidangnya.",
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
    title: "Fleksibel",
    body: "Ikuti kelas sesuai jadwal yang tersedia. Belajar dapat disesuaikan dengan aktivitas dan kesibukan profesional Anda.",
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

const PILLARS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "avatar",
    title: "Pengajaran berbasis AI",
    body: "Pengajar AI memimpin kelas, menjelaskan materi, dan menjawab pertanyaan.",
  },
  {
    icon: "book",
    title: "Kurikulum terstruktur",
    body: "Materi disusun berdasarkan learning objectives yang jelas.",
  },
  {
    icon: "shield",
    title: "Divalidasi oleh manusia",
    body: "Ditinjau akademisi atau praktisi yang kompeten di bidangnya.",
  },
];

const PACKAGES = [
  {
    name: "Kelas Grup",
    icon: "users" as IconName,
    desc: "Belajar bersama peserta lain dalam satu sesi pembelajaran dengan jadwal yang telah ditentukan.",
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
    icon: "avatar" as IconName,
    desc: "Pengalaman belajar personal dengan pengajar AI yang mengikuti kebutuhan dan tempo belajar Anda.",
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
    a: "Guru AI adalah platform pembelajaran interaktif yang menggunakan AI sebagai pengajar. Pengajar AI menyampaikan materi melalui avatar dan suara, serta dapat menjawab pertanyaan peserta melalui percakapan langsung.",
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
    a: "Guru AI ditujukan bagi siapa saja yang ingin mengembangkan kompetensi, mempelajari keterampilan baru, atau meningkatkan kemampuan profesional untuk mendukung karier.",
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
            Coba Kelas Gratis
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
                Kelas live bersama pengajar AI
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
                Tingkatkan skill dan kompetensi bersama{" "}
                <span className="whitespace-nowrap">
                  <span className="text-teal-700">pengajar AI</span>.
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500">
                Ikuti kelas interaktif dengan pengajar AI yang membawakan materi
                secara terstruktur, menjawab pertanyaan secara langsung, dan
                membantu Anda memahami keterampilan baru untuk kebutuhan
                profesional.
              </p>
              <div className="mt-8">
                <PrimaryButton>
                  <Icon name="play" className="h-4 w-4" />
                  Coba Kelas Gratis
                </PrimaryButton>
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

        {/* Fitur */}
        <section id="fitur" className="scroll-mt-16 py-24">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Fitur unggulan"
              title="Pengalaman belajar yang lebih interaktif"
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

        {/* Mengapa Guru AI */}
        <section className="py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div className="border-l-4 border-teal-700 pl-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Mengapa Guru AI?
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Belajar lebih fleksibel, tanpa kehilangan pengalaman interaktif.
              </h2>
              <div className="mt-6 flex flex-col gap-4 text-[17px] leading-relaxed text-slate-500">
                <p>
                  Mengembangkan kompetensi baru membutuhkan waktu, akses
                  terhadap materi berkualitas, dan kesempatan untuk bertanya.
                </p>
                <p>
                  Guru AI menghadirkan pengalaman pembelajaran yang
                  menggabungkan pengajaran berbasis AI, kurikulum terstruktur,
                  dan validasi materi oleh manusia yang kompeten.
                </p>
                <p>
                  Anda dapat belajar tanpa harus datang ke ruang kelas atau
                  mengikuti seluruh aktivitas pembelajaran secara tatap muka.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-teal-50/60 p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{p.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate-500">
                      {p.body}
                    </p>
                  </div>
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
              Mulai perjalanan belajar Anda bersama Guru AI.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-teal-100">
              Kembangkan keterampilan baru melalui pengalaman belajar yang
              interaktif, fleksibel, dan terarah.
            </p>
            <Link
              href={CTA_HREF}
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-[15px] font-bold text-teal-800 shadow-xl transition hover:-translate-y-0.5 hover:bg-teal-50"
            >
              <Icon name="play" className="h-4 w-4" />
              Coba Kelas Gratis
            </Link>
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
