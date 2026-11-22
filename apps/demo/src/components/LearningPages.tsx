"use client";

import { useState } from "react";
import type { LanguageCode } from "../liveavatar/languages";
import { CLASSES, labelOf } from "../liveavatar/learnerProfile";
import { findTutor } from "../liveavatar/tutors";
import { LESSON_SLIDES } from "../liveavatar/lessonSlides";
import {
  ClassRecord,
  EndReason,
  formatDate,
  formatDuration,
} from "../liveavatar/classHistory";
import { GuruShell } from "./GuruShell";

// Halaman setelah kelas: ringkasan satu kelas dan dashboard riwayat belajar.

const T = {
  id: {
    done: "Kelas selesai 🎉",
    with: (name: string) => `bersama ${name}`,
    endReason: {
      finished: "Diselesaikan",
      time_up: "Waktu habis",
      idle: "Ditutup karena tidak ada pertanyaan",
      left: "Keluar lebih awal",
    } as Record<EndReason, string>,
    learned: "Yang dipelajari",
    questions: (n: number) => `Pertanyaanmu (${n})`,
    noQuestions: "Kamu belum bertanya di kelas ini.",
    transcript: "Lihat percakapan lengkap",
    noTranscript: "Tidak ada percakapan yang tercatat.",
    you: "Kamu",
    next: "Lanjut ke modul berikutnya",
    soon: "Segera hadir",
    toHistory: "Ke riwayat belajar",
    retake: "Ulangi kelas",
    hello: (name: string) => `Halo, ${name} 👋`,
    dashLead: "Ini perjalanan belajarmu sejauh ini.",
    continueTitle: "Lanjutkan belajar",
    newClass: "Mulai kelas",
    statClasses: "Kelas diikuti",
    statTime: "Total waktu belajar",
    statQuestions: "Pertanyaan diajukan",
    historyTitle: "Riwayat belajar",
    historyEmpty: "Belum ada kelas yang diikuti.",
    minutes: (m: number) => `${m} mnt`,
    open: "Lihat",
  },
  en: {
    done: "Class complete 🎉",
    with: (name: string) => `with ${name}`,
    endReason: {
      finished: "Completed",
      time_up: "Time ran out",
      idle: "Closed after no more questions",
      left: "Left early",
    } as Record<EndReason, string>,
    learned: "What you learned",
    questions: (n: number) => `Your questions (${n})`,
    noQuestions: "You didn't ask anything in this class.",
    transcript: "See full conversation",
    noTranscript: "No conversation was recorded.",
    you: "You",
    next: "Continue to the next module",
    soon: "Coming soon",
    toHistory: "Go to learning history",
    retake: "Retake class",
    hello: (name: string) => `Hi, ${name} 👋`,
    dashLead: "Here's your learning journey so far.",
    continueTitle: "Continue learning",
    newClass: "Start a class",
    statClasses: "Classes taken",
    statTime: "Total learning time",
    statQuestions: "Questions asked",
    historyTitle: "Learning history",
    historyEmpty: "No classes yet.",
    minutes: (m: number) => `${m} min`,
    open: "View",
  },
} as const;

const card =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
const primary =
  "inline-flex items-center justify-center rounded-xl bg-teal-700 px-5 py-3 text-[15px] font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300";
const secondary =
  "inline-flex items-center justify-center rounded-xl border border-teal-700/25 bg-white px-5 py-3 text-[15px] font-semibold text-teal-800 transition hover:border-teal-700/50 hover:bg-teal-50";
const disabledBtn =
  "inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-[15px] font-semibold text-slate-400";

const classModule = (record: ClassRecord) =>
  CLASSES.find((c) => c.key === record.classKey);

const learnedPoints = (language: LanguageCode) => {
  const s = LESSON_SLIDES[language].summary;
  return s.kind === "summary" ? { points: s.points, next: s.next } : null;
};

const tutorName = (record: ClassRecord) =>
  findTutor(record.tutorKey)?.name ?? "Guru AI";

const userQuestions = (record: ClassRecord) =>
  record.messages.filter((m) => m.sender === "user");

/** Ringkasan satu kelas, muncul langsung setelah kelas selesai. */
export const ClassSummaryPage = ({
  record,
  onHistory,
  onRetake,
}: {
  record: ClassRecord;
  onHistory: () => void;
  onRetake: () => void;
}) => {
  const lang = record.language;
  const t = T[lang];
  const [showTranscript, setShowTranscript] = useState(false);
  const cls = classModule(record);
  const learned = learnedPoints(lang);
  const questions = userQuestions(record);
  const tutor = tutorName(record);

  return (
    <GuruShell>
      <div className="flex w-full max-w-3xl flex-col gap-5 px-4 pb-16 pt-4 sm:px-8">
        <div className={card}>
          <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            {t.endReason[record.endReason]}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {t.done}
          </h1>
          <p className="mt-2 text-[15px] font-semibold text-slate-700">
            {labelOf(CLASSES, record.classKey, lang)}
            {cls && "description" in cls && (
              <span className="font-normal text-slate-500">
                {" "}
                · {cls.description[lang]}
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {t.with(tutor)} · {formatDate(record.startedAt, lang)} ·{" "}
            {formatDuration(record, lang)}
          </p>
        </div>

        {learned && (
          <div className={card}>
            <h2 className="text-lg font-bold text-slate-900">{t.learned}</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {learned.points.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-700"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-700 text-[11px] font-bold text-white">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={card}>
          <h2 className="text-lg font-bold text-slate-900">
            {t.questions(questions.length)}
          </h2>
          {questions.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">{t.noQuestions}</p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {questions.map((q, i) => (
                <li
                  key={i}
                  className="rounded-xl bg-teal-50 px-4 py-2.5 text-[15px] italic text-teal-900"
                >
                  “{q.message}”
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => setShowTranscript((v) => !v)}
            aria-expanded={showTranscript}
            className="mt-4 text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            {showTranscript ? "▾" : "▸"} {t.transcript}
          </button>
          {showTranscript && (
            <div className="mt-3 flex max-h-96 flex-col gap-2 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
              {record.messages.length === 0 && (
                <p className="text-sm text-slate-400">{t.noTranscript}</p>
              )}
              {record.messages.map((m, i) => {
                const mine = m.sender === "user";
                return (
                  <div
                    key={i}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                        mine
                          ? "rounded-br-sm bg-teal-700 text-white"
                          : "rounded-bl-sm bg-white text-slate-700"
                      }`}
                    >
                      <span
                        className={`mb-0.5 block text-[11px] font-semibold ${mine ? "text-teal-100" : "text-slate-400"}`}
                      >
                        {mine ? t.you : tutor}
                      </span>
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <span className={disabledBtn} title={learned?.next}>
            {t.next}
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-500">
              {t.soon}
            </span>
          </span>
          <button onClick={onHistory} className={primary}>
            {t.toHistory}
          </button>
          <button onClick={onRetake} className={secondary}>
            {t.retake}
          </button>
        </div>
      </div>
    </GuruShell>
  );
};

/** Dashboard riwayat belajar: "rumah" peserta di kunjungan berikutnya. */
export const LearningDashboard = ({
  history,
  learnerName,
  language,
  onOpen,
  onNewClass,
}: {
  history: ClassRecord[];
  learnerName?: string;
  language: LanguageCode;
  onOpen: (record: ClassRecord) => void;
  onNewClass: () => void;
}) => {
  const t = T[language];
  const learned = learnedPoints(language);
  const latest = history[0];
  const totalMinutes = Math.round(
    history.reduce((sum, r) => sum + (r.endedAt - r.startedAt), 0) / 60000,
  );
  const totalQuestions = history.reduce(
    (sum, r) => sum + userQuestions(r).length,
    0,
  );

  const stats: [string, string][] = [
    [t.statClasses, String(history.length)],
    [t.statTime, t.minutes(totalMinutes)],
    [t.statQuestions, String(totalQuestions)],
  ];

  return (
    <GuruShell>
      <div className="flex w-full max-w-3xl flex-col gap-5 px-4 pb-16 pt-4 sm:px-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {learnerName ? t.hello(learnerName) : t.historyTitle}
          </h1>
          <p className="mt-1 text-[15px] text-slate-500">{t.dashLead}</p>
        </div>

        {latest && (
          <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-900 p-6 text-white shadow-xl shadow-teal-900/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-100">
              {t.continueTitle}
            </p>
            <p className="mt-2 text-xl font-bold">
              {labelOf(CLASSES, latest.classKey, language)}
            </p>
            {learned && (
              <p className="mt-1 text-sm text-teal-100">
                {learned.next} · {t.soon}
              </p>
            )}
            <button
              onClick={onNewClass}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-[15px] font-semibold text-teal-800 transition hover:bg-teal-50"
            >
              ▶ {t.newClass}
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className={card}>
          <h2 className="text-lg font-bold text-slate-900">{t.historyTitle}</h2>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">{t.historyEmpty}</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {history.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => onOpen(r)}
                    className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-teal-50/50"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-slate-900">
                        {labelOf(CLASSES, r.classKey, language)}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {formatDate(r.startedAt, language)} · {tutorName(r)} ·{" "}
                        {formatDuration(r, language)} ·{" "}
                        {T[language].endReason[r.endReason]}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-teal-700">
                      {t.open} ›
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </GuruShell>
  );
};
