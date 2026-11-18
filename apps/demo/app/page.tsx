import Link from "next/link";

const CTA_HREF = "/kelas";

const PROBLEMS = [
  {
    title: "Belajar berkualitas tidak harus mahal",
    body: "Belajar dari rumah tanpa biaya kos dan transportasi. Biaya AI dibagi ke seluruh peserta Kelas Grup, jadi harga per siswa tetap rendah.",
  },
  {
    title: "Jadwal yang mengikuti kamu",
    body: "Guru AI tidak terikat jam kerja. Kelas bisa dibuka pagi, malam, maupun akhir pekan, dan sesi Privat 1:1 bisa diikuti kapan saja.",
  },
  {
    title: "Terstruktur, bukan belajar sendirian",
    body: "Materi mengikuti kurikulum per bab yang dicek manusia, dibawakan seperti kelas sungguhan, dan kamu bisa langsung bertanya.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Guru membuka kelas",
    body: "Avatar guru menyapa dan memperkenalkan topik hari ini.",
  },
  {
    n: "02",
    title: "Materi dibawakan",
    body: "Penjelasan disampaikan bertahap, paragraf demi paragraf, seperti di ruang kelas.",
  },
  {
    n: "03",
    title: "Tanya jawab langsung",
    body: "Setelah materi, ajukan pertanyaan lewat suara atau chat dan guru menjawab saat itu juga.",
  },
];

const PACKAGES = [
  {
    name: "Kelas Grup",
    tag: "Paling hemat",
    points: [
      "Jadwal tetap, belajar bersama peserta lain",
      "Biaya dibagi ke seluruh peserta",
      "Tanya jawab langsung dengan guru AI",
    ],
  },
  {
    name: "Privat 1:1",
    tag: "Paling fleksibel",
    points: [
      "Mulai kapan saja sesuai waktumu",
      "Tempo dan pertanyaan sepenuhnya milikmu",
      "Kurikulum yang sama, perhatian penuh",
    ],
  },
];

const CtaButton = ({ className = "" }: { className?: string }) => (
  <Link
    href={CTA_HREF}
    className={`inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-zinc-900 transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${className}`}
  >
    Coba kelas demo
    <span aria-hidden>→</span>
  </Link>
);

// Ilustrasi kelas: bingkai video + potongan chat, murni CSS.
const ClassPreview = () => (
  <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-800/60 p-3 shadow-2xl shadow-black/40">
    <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-amber-200/30 via-zinc-700 to-zinc-800">
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
        Live
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full bg-zinc-300/80 sm:h-16 sm:w-16" />
          <div className="mt-1 h-16 w-32 rounded-t-[3rem] bg-zinc-900/90 sm:h-20 sm:w-40" />
        </div>
      </div>
    </div>
    <div className="mt-3 flex flex-col gap-2 text-left text-xs">
      <div className="max-w-[85%] rounded-lg bg-zinc-700/70 px-3 py-2">
        <div className="mb-0.5 text-[10px] uppercase tracking-wider text-gray-400">
          Guru
        </div>
        Hari ini kita akan mempelajari komunikasi efektif di lingkungan kerja.
      </div>
      <div className="ml-auto max-w-[85%] rounded-lg bg-white/90 px-3 py-2 text-zinc-900">
        <div className="mb-0.5 text-[10px] uppercase tracking-wider text-zinc-500">
          Kamu
        </div>
        Bagaimana cara memberi masukan ke atasan?
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="w-full self-stretch">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="text-lg font-semibold tracking-tight">Guru AI</span>
        <Link
          href={CTA_HREF}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
        >
          Coba sekarang
        </Link>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 md:grid-cols-2 md:pt-16">
          <div className="flex flex-col items-start gap-6">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              Kelas live dengan guru avatar AI
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Kelas sungguhan, diajar guru AI, dari rumah.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg">
              Kelas live yang terstruktur dan interaktif. Guru avatar membawakan
              materi, lalu menjawab pertanyaanmu secara langsung, dengan biaya
              dan waktu yang lebih terjangkau.
            </p>
            <div className="flex flex-col items-start gap-3">
              <CtaButton />
              <p className="text-xs text-gray-500">
                Demo singkat ±1 menit · izinkan mikrofon · paling lancar di
                Chrome
              </p>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <ClassPreview />
          </div>
        </section>

        {/* Masalah yang diselesaikan */}
        <section className="border-t border-white/5 bg-zinc-950/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="mb-10 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Belajar yang lebih terjangkau, fleksibel, dan tetap terarah
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {PROBLEMS.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-white/10 bg-zinc-800/40 p-6"
                >
                  <h3 className="mb-2 font-semibold">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alur kelas */}
        <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="mb-10 text-2xl font-semibold tracking-tight sm:text-3xl">
            Seperti apa kelasnya?
          </h2>
          <ol className="grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="flex flex-col gap-2">
                <span className="font-mono text-sm text-gray-500">{s.n}</span>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Paket */}
        <section className="border-t border-white/5 bg-zinc-950/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="mb-10 text-2xl font-semibold tracking-tight sm:text-3xl">
              Dua cara belajar
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {PACKAGES.map((p) => (
                <div
                  key={p.name}
                  className="flex flex-col gap-4 rounded-xl border border-white/10 bg-zinc-800/40 p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-300">
                      {p.tag}
                    </span>
                  </div>
                  <ul className="flex flex-col gap-2 text-sm text-gray-400">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <span aria-hidden className="text-gray-500">
                          –
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA penutup */}
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 py-24 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Rasakan sendiri kelasnya
          </h2>
          <p className="max-w-lg text-gray-400">
            Masuk ke kelas demo Komunikasi Efektif dan ajukan pertanyaan
            langsung ke guru AI.
          </p>
          <CtaButton />
        </section>
      </main>

      <footer className="border-t border-white/5">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-gray-500 sm:px-6">
          © {new Date().getFullYear()} Guru AI
        </div>
      </footer>
    </div>
  );
}
