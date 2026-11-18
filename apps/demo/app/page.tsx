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
  | "chat"
  | "globe"
  | "clock"
  | "wallet"
  | "users"
  | "check"
  | "play"
  | "spark";

const PATHS: Record<IconName, string> = {
  avatar:
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0M3 3h4M3 3v4M21 3h-4M21 3v4",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 14a2 2 0 0 1 2-2h13M8 7h7M8 11h5",
  mic: "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Zm-7 8a7 7 0 0 0 14 0M12 18v3",
  chat: "M4 5h16v11H8l-4 4V5Zm4 5h8M8 13h5",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
  wallet:
    "M3 7a2 2 0 0 1 2-2h13v4M3 7v10a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Zm13 7h1",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5a6 6 0 0 1 3 5.5",
  check: "m5 12 4.5 4.5L19 7",
  play: "M8 5.5v13l10-6.5-10-6.5Z",
  spark:
    "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
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
  { href: "#paket", label: "Paket" },
  { href: "#faq", label: "FAQ" },
];

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "avatar",
    title: "Guru avatar realistis",
    body: "Wajah, suara, dan gaya mengajar yang konsisten, terasa seperti diajar guru sungguhan.",
  },
  {
    icon: "book",
    title: "Kurikulum terstruktur",
    body: "Materi disusun per bab dan dicek manusia. Jawaban guru berpegang pada materi.",
  },
  {
    icon: "mic",
    title: "Tanya lewat suara",
    body: "Cukup bicara. Guru mendengar dan menjawab pertanyaanmu saat itu juga.",
  },
  {
    icon: "chat",
    title: "Chat di kelas",
    body: "Lebih nyaman mengetik? Kirim pertanyaan lewat chat, semua tercatat rapi.",
  },
  {
    icon: "globe",
    title: "Indonesia & Inggris",
    body: "Pilih bahasa kelas sesuai kebutuhan, termasuk istilah dan contoh lokal.",
  },
  {
    icon: "clock",
    title: "Jadwal fleksibel",
    body: "Kelas bisa dibuka pagi, malam, atau akhir pekan. Tidak terikat jam kerja.",
  },
];

const FLOW = [
  {
    title: "Guru membuka kelas",
    body: "Avatar menyapa peserta dan memperkenalkan topik yang akan dibahas hari itu.",
  },
  {
    title: "Materi dibawakan bertahap",
    body: "Penjelasan disampaikan paragraf demi paragraf, dengan tempo yang bisa diatur.",
  },
  {
    title: "Sesi tanya jawab",
    body: "Setelah materi, mikrofon dibuka. Tanyakan apa saja lewat suara atau chat.",
  },
  {
    title: "Kelas ditutup dengan rangkuman",
    body: "Guru menutup sesi dengan poin penting untuk diingat dan dipelajari ulang.",
  },
];

const STATS = [
  {
    value: "2 dari 3",
    label: "orang usia 19–23 tahun di Indonesia tidak kuliah",
    source: "APK PT 32,89% · BPS, Susenas 2025",
  },
  {
    value: "2–4×",
    label: "harga bootcamp dibanding gaji bulanan lulusan S1",
    source: "Rp 10–21 jt vs Rp 4,77 jt · BPS Feb 2026",
  },
  {
    value: "24/7",
    label: "guru AI siap mengajar, tanpa gedung dan tanpa jam kerja",
    source: "Kelas Grup & Privat 1:1",
  },
];

const PACKAGES = [
  {
    name: "Kelas Grup",
    tag: "Paling hemat",
    desc: "Belajar bersama peserta lain dengan jadwal tetap. Biaya AI dibagi ke seluruh kelas.",
    points: [
      "Jadwal pagi, malam, dan akhir pekan",
      "Tanya jawab langsung dengan guru AI",
      "Kurikulum terstruktur per bab",
      "Harga per siswa paling rendah",
    ],
    highlight: true,
  },
  {
    name: "Privat 1:1",
    tag: "Paling fleksibel",
    desc: "Satu guru, satu siswa. Mulai kapan saja dan atur tempo belajarmu sendiri.",
    points: [
      "Mulai kapan saja sesuai waktumu",
      "Pertanyaan sepenuhnya milikmu",
      "Kurikulum yang sama, perhatian penuh",
      "Cocok untuk persiapan khusus",
    ],
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Apa itu Guru AI?",
    a: "Guru AI adalah kelas live yang diajar oleh avatar guru AI. Materinya terstruktur seperti kelas sungguhan, dan kamu bisa bertanya langsung lewat suara atau chat.",
  },
  {
    q: "Apa bedanya dengan chatbot biasa?",
    a: "Chatbot menunggu kamu bertanya. Guru AI memimpin kelas: membuka, membawakan materi sesuai kurikulum, lalu membuka sesi tanya jawab. Jawabannya berpegang pada materi yang sudah dicek manusia.",
  },
  {
    q: "Apa yang saya butuhkan untuk mencoba?",
    a: "Laptop atau HP dengan browser Chrome, koneksi internet yang stabil, dan mikrofon. Izinkan akses mikrofon saat diminta agar bisa bertanya lewat suara.",
  },
  {
    q: "Berapa lama kelas demonya?",
    a: "Kelas demo berlangsung singkat, sekitar satu sampai dua menit, cukup untuk merasakan pembukaan, materi, dan tanya jawab.",
  },
  {
    q: "Bahasa apa saja yang didukung?",
    a: "Saat ini Bahasa Indonesia dan Bahasa Inggris. Bahasa kelas bisa dipilih di pengaturan.",
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
  center = true,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
}) => (
  <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
    <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-600">
      {eyebrow}
    </p>
    <h2 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
      {title}
    </h2>
    <div
      className={`mt-5 flex items-center gap-0 ${center ? "justify-center" : ""}`}
      aria-hidden
    >
      <span className="h-0.5 w-16 rounded-full bg-teal-700" />
      <span className="h-2 w-2 rounded-full bg-teal-700" />
      <span className="h-0.5 w-16 rounded-full bg-teal-700" />
    </div>
  </div>
);

/** Mockup ruang kelas: video avatar + panel chat, mirip aplikasi aslinya. */
const ClassroomMockup = () => (
  <div className="relative">
    <div
      className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-200/60 via-emerald-100/60 to-white blur-2xl"
      aria-hidden
    />
    <div className="relative rounded-3xl border border-teal-900/10 bg-white p-3 shadow-2xl shadow-teal-900/10">
      {/* bar jendela */}
      <div className="flex items-center gap-1.5 px-2 pb-3 pt-1">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 truncate text-xs font-medium text-slate-400">
          Kelas Komunikasi Efektif
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900">
          <Image
            src="/guru-avatar.webp"
            alt="Guru avatar AI sedang mengajar"
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
            Guru sedang berbicara
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 text-[12px] leading-snug">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Chat kelas
          </p>
          <div className="rounded-xl rounded-tl-sm bg-white p-2.5 text-slate-700 shadow-sm">
            <span className="mb-0.5 block text-[10px] font-semibold text-teal-700">
              Guru
            </span>
            Hari ini kita belajar komunikasi efektif di tempat kerja.
          </div>
          <div className="ml-4 rounded-xl rounded-tr-sm bg-teal-700 p-2.5 text-white shadow-sm">
            <span className="mb-0.5 block text-[10px] font-semibold text-teal-100">
              Kamu
            </span>
            Bagaimana cara memberi masukan ke atasan?
          </div>
          <div className="rounded-xl rounded-tl-sm bg-white p-2.5 text-slate-700 shadow-sm">
            <span className="mb-0.5 block text-[10px] font-semibold text-teal-700">
              Guru
            </span>
            Mulai dari fakta, lalu tawarkan solusi…
          </div>
        </div>
      </div>
    </div>

    {/* kartu melayang */}
    <div className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl border border-teal-900/5 bg-white px-4 py-3 shadow-xl shadow-teal-900/10 sm:flex">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon name="check" />
      </span>
      <div>
        <p className="text-sm font-bold text-slate-900">
          Materi sedang berjalan
        </p>
        <p className="text-xs text-slate-500">Komunikasi efektif</p>
      </div>
    </div>
    <div className="absolute -right-3 -top-5 hidden items-center gap-2 rounded-2xl border border-teal-900/5 bg-white px-3.5 py-2.5 shadow-xl shadow-teal-900/10 sm:flex">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
        <Icon name="users" className="h-4 w-4" />
      </span>
      <p className="text-xs font-semibold text-slate-700">
        24 peserta
        <br />
        <span className="font-normal text-slate-500">Kelas Grup</span>
      </p>
    </div>
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
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white">
              <Icon name="spark" className="h-[18px] w-[18px]" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              Guru<span className="text-teal-700"> AI</span>
            </span>
          </Link>
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
            className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Coba gratis
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
                Kelas live dengan guru avatar AI
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
                Kelas sungguhan,
                <br />
                diajar <span className="text-teal-700">guru AI</span>,
                <br />
                dari rumah.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500">
                Kelas live yang terstruktur dan interaktif. Guru avatar
                membawakan materi lalu menjawab pertanyaanmu secara langsung,
                dengan biaya dan waktu yang lebih terjangkau.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PrimaryButton>
                  <Icon name="play" className="h-4 w-4" />
                  Coba kelas demo
                </PrimaryButton>
                <a
                  href="#cara-kerja"
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-[15px] font-semibold text-slate-700 transition hover:border-teal-700/30 hover:text-teal-800"
                >
                  Lihat cara kerjanya
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                {[
                  "Gratis dicoba",
                  "Tanpa instalasi",
                  "Bisa bertanya lewat suara",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Icon name="check" className="h-4 w-4 text-emerald-600" />
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
              title="Semua yang dibutuhkan untuk kelas yang hidup"
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
              title="Satu sesi, seperti kelas sungguhan"
            />
            <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
              <div className="relative overflow-hidden rounded-3xl border border-teal-900/10 bg-white p-3 shadow-xl shadow-teal-900/5">
                <Image
                  src="/guru-avatar.webp"
                  alt="Guru avatar di ruang kelas"
                  width={1280}
                  height={720}
                  className="aspect-video w-full rounded-2xl object-cover"
                />
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  {[
                    ["Per bab", "materi terstruktur"],
                    ["2", "bahasa"],
                    ["Live", "tanya jawab"],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-xl bg-teal-50/70 py-3">
                      <p className="text-lg font-extrabold text-teal-800">
                        {v}
                      </p>
                      <p className="text-xs text-slate-500">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
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
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Langkah {i + 1}
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

        {/* Kenapa Guru AI */}
        <section className="py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div className="border-l-4 border-teal-700 pl-6">
              <p className="text-sm font-semibold text-slate-500">
                Terjangkau, fleksibel, dan terarah
              </p>
              <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Kenapa Guru AI?
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-slate-500">
                Belajar berkualitas masih mahal dan terikat tempat. Guru AI
                menghadirkan kelas live yang terstruktur tanpa biaya gedung,
                transportasi, atau tempat tinggal, dengan jadwal yang mengikuti
                kamu.
              </p>
              <PrimaryButton className="mt-8">Coba sekarang</PrimaryButton>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {STATS.map((s) => (
                <div
                  key={s.value}
                  className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-teal-50/60 p-6"
                >
                  <p className="text-3xl font-extrabold tracking-tight text-teal-700">
                    {s.value}
                  </p>
                  <p className="mt-2 text-[15px] font-medium leading-snug text-slate-700">
                    {s.label}
                  </p>
                  <p className="mt-3 text-xs text-slate-400">{s.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Paket */}
        <section
          id="paket"
          className="scroll-mt-16 bg-gradient-to-b from-teal-50/50 to-white py-24"
        >
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Paket belajar"
              title="Pilih cara belajarmu"
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
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        p.highlight
                          ? "bg-white/15 text-white"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      <Icon
                        name={p.highlight ? "users" : "avatar"}
                        className="h-5 w-5"
                      />
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.highlight
                          ? "bg-emerald-400 text-teal-950"
                          : "bg-teal-50 text-teal-800"
                      }`}
                    >
                      {p.tag}
                    </span>
                  </div>
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
                    Coba kelas demo
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
            <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Rasakan sendiri kelasnya
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-teal-100">
              Masuk ke kelas demo Komunikasi Efektif dan ajukan pertanyaan
              langsung ke guru AI.
            </p>
            <Link
              href={CTA_HREF}
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-[15px] font-bold text-teal-800 shadow-xl transition hover:-translate-y-0.5 hover:bg-teal-50"
            >
              <Icon name="play" className="h-4 w-4" />
              Mulai kelas demo
            </Link>
            <p className="relative mt-4 text-xs text-teal-200">
              Paling lancar di Chrome · izinkan akses mikrofon
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:px-6">
          <span className="font-bold text-slate-700">
            Guru<span className="text-teal-700"> AI</span>
          </span>
          <span>
            © {new Date().getFullYear()} Guru AI. Belajar dari mana saja.
          </span>
        </div>
      </footer>
    </div>
  );
}
