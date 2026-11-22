"use client";

import React from "react";
import type { Slide } from "../liveavatar/lessonSlides";

const Arrow = () => (
  <svg
    viewBox="0 0 24 24"
    className="hidden h-5 w-5 shrink-0 text-teal-600/50 md:block"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 12h14m-5-5 5 5-5 5" />
  </svg>
);

const SlideBody: React.FC<{ slide: Slide }> = ({ slide }) => {
  switch (slide.kind) {
    case "cover":
      return (
        <div className="flex h-full flex-col justify-center">
          <span className="w-fit rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
            {slide.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {slide.title}
          </h2>
          <p className="mt-3 text-base text-slate-500">{slide.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {slide.meta.map((m) => (
              <span
                key={m}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      );

    case "agenda":
      return (
        <div className="flex h-full flex-col justify-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {slide.title}
          </h2>
          <ol className="mt-6 flex flex-col gap-2.5">
            {slide.items.map((item, i) => {
              const active = i === slide.active;
              return (
                <li
                  key={item}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition ${
                    active
                      ? "bg-teal-700 font-semibold text-white shadow-lg shadow-teal-900/20"
                      : "bg-slate-50 text-slate-500"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-white text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {item}
                  {active && (
                    <span className="ml-auto rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-950">
                      Hari ini
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      );

    case "flow":
      return (
        <div className="flex h-full flex-col justify-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {slide.title}
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-500">
            {slide.lead}
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {slide.steps.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="flex-1 rounded-2xl border border-teal-700/15 bg-gradient-to-b from-white to-teal-50 p-4">
                  <span className="text-xs font-bold text-teal-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 font-bold text-slate-900">{s.label}</p>
                  <p className="mt-1 text-sm leading-snug text-slate-500">
                    {s.desc}
                  </p>
                </div>
                {i < slide.steps.length - 1 && <Arrow />}
              </React.Fragment>
            ))}
          </div>
        </div>
      );

    case "qa":
      return (
        <div className="flex h-full flex-col justify-center">
          <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            {slide.badge}
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {slide.title}
          </h2>
          <p className="mt-3 text-base text-slate-500">{slide.lead}</p>
          <ul className="mt-6 flex flex-col gap-2.5">
            {slide.prompts.map((p) => (
              <li
                key={p}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-700"
              >
                “{p}”
              </li>
            ))}
          </ul>
        </div>
      );

    case "summary":
      return (
        <div className="flex h-full flex-col justify-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {slide.title}
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {slide.points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-700"
              >
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    aria-hidden
                  >
                    <path d="m5 12 4.5 4.5L19 7" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-8 w-fit rounded-xl bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-800">
            {slide.next}
          </p>
        </div>
      );
  }
};

/**
 * Panel materi: slide yang berganti mengikuti narasi avatar, plus bilah
 * status/kontrol materi di bawahnya (children).
 */
export const LessonSlidePanel: React.FC<{
  slide: Slide;
  slideKey: string;
  courseTitle: string;
  children?: React.ReactNode;
}> = ({ slide, slideKey, courseTitle, children }) => (
  <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="relative flex-1 bg-gradient-to-br from-white via-white to-teal-50/70 p-6 sm:p-10">
      <p className="absolute left-6 top-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400 sm:left-10">
        {courseTitle}
      </p>
      <div key={slideKey} className="h-full animate-slide-in pt-4">
        <SlideBody slide={slide} />
      </div>
    </div>
    {children && (
      <div className="flex min-h-[52px] flex-wrap items-center gap-x-3 gap-y-2 border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-600">
        {children}
      </div>
    )}
  </div>
);
