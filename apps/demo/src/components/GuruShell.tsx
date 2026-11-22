"use client";

import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

// Font, logo, dan palet (teal/emerald di atas putih) disamakan dengan landing
// page. Dipakai halaman setup kelas dan ruang kelas.
const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const GuruLogo = () => (
  <Link href="/" className="flex items-center gap-2.5">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
        aria-hidden
      >
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
      </svg>
    </span>
    <span className="text-lg font-extrabold tracking-tight text-slate-900">
      Guru<span className="text-teal-700"> AI</span>
    </span>
  </Link>
);

export const GuruShell = ({
  children,
  headerCenter,
  headerRight,
  wide = false,
}: {
  children: React.ReactNode;
  headerCenter?: React.ReactNode;
  headerRight?: React.ReactNode;
  /** Lebar penuh (ruang kelas) alih-alih max-w-5xl (halaman setup). */
  wide?: boolean;
}) => {
  const width = wide ? "max-w-[1400px]" : "max-w-5xl";
  return (
    <div
      className={`${font.className} min-h-screen w-full self-stretch bg-white bg-gradient-to-b from-emerald-50 via-white to-white text-slate-700 antialiased`}
    >
      <header
        className={`mx-auto flex ${width} flex-wrap items-center gap-x-6 gap-y-2 px-4 py-4 sm:px-8`}
      >
        <GuruLogo />
        {headerCenter && <div className="min-w-0 flex-1">{headerCenter}</div>}
        {headerRight && (
          <div className="ml-auto flex items-center gap-3">{headerRight}</div>
        )}
      </header>
      <main className={`mx-auto flex ${width} justify-center`}>{children}</main>
    </div>
  );
};
