"use client";

import { useEffect, useState } from "react";
import { GuruShell } from "./GuruShell";
import { LANGUAGES, LanguageCode } from "../liveavatar/languages";
import { SPEECH_SPEEDS, SpeechSpeed } from "../liveavatar/speechSpeed";
import type { ClassSettings } from "../liveavatar/classSettings";
import {
  CLASSES,
  FIELDS,
  GOALS,
  LearnerProfile,
  NAME_MAX_LENGTH,
  TRACKS,
  isCompleteProfile,
  labelOf,
  loadLearnerProfile,
  saveLearnerProfile,
} from "../liveavatar/learnerProfile";
import { findTutor, tutorsFor } from "../liveavatar/tutors";

/** Guru tetap kalau cocok dengan jalurnya; kalau tidak, guru pertama jalur itu. */
const withValidTutor = (p: Partial<LearnerProfile>) => {
  if (findTutor(p.tutorKey)?.track === p.track) return p;
  const first = tutorsFor(p.track)[0];
  const next = { ...p };
  if (first) next.tutorKey = first.key;
  else delete next.tutorKey;
  return next;
};

type Step = "language" | "track" | "setup";

const SPEED_LABELS_EN: Record<SpeechSpeed, string> = {
  very_slow: "Much slower",
  slow: "A bit slower",
  normal: "Default",
  fast: "A bit faster",
  very_fast: "Much faster",
};

const T = {
  id: {
    back: "Kembali",
    soon: "Segera hadir",
    trackTitle: "Kamu belajar untuk apa?",
    setupTitle: "Siapkan kelasmu",
    setupLead: "Gurumu memakai ini supaya materi dan contohnya pas untukmu.",
    s1: "Pilih kelas",
    s2: "Kenalan dulu",
    s2Lead: "Contoh di kelas diambil dari bidang pekerjaanmu.",
    name: "Nama panggilan",
    namePlaceholder: "mis. Putra",
    field: "Bidang pekerjaan",
    example: "Contoh pertanyaan di kelas",
    s3: "Tujuanmu",
    targetField: "Bidang yang dituju",
    s4: "Pilih guru",
    s4Lead: "Tiap guru punya wajah, suara, dan gaya mengajar sendiri.",
    more: "Opsi lainnya",
    moreHint: "kecepatan suara, push to talk",
    speed: "Kecepatan bicara guru",
    ptt: "Push to talk (tahan tombol saat bicara)",
    summaryEyebrow: "Kelasmu",
    sumName: "Nama",
    sumField: "Bidang",
    sumGoal: "Tujuan",
    sumTutor: "Guru",
    start: "Mulai Kelas",
    starting: "Memulai kelas…",
    missing: (items: string[]) => `Lengkapi dulu: ${items.join(", ")}.`,
    readyHint:
      "Guru membuka kelas, membawakan materi, lalu membuka sesi tanya jawab.",
    changeLanguage: "Ganti bahasa",
    changeTrack: "Ganti jalur",
  },
  en: {
    back: "Back",
    soon: "Coming soon",
    trackTitle: "What are you learning for?",
    setupTitle: "Set up your class",
    setupLead: "Your tutor uses this to fit the lesson and examples to you.",
    s1: "Choose a class",
    s2: "About you",
    s2Lead: "Class examples come from your field of work.",
    name: "What should we call you?",
    namePlaceholder: "e.g. Putra",
    field: "Your field of work",
    example: "Example question in class",
    s3: "Your goal",
    targetField: "Field you're moving to",
    s4: "Choose your tutor",
    s4Lead: "Each tutor has their own face, voice, and teaching style.",
    more: "More options",
    moreHint: "speaking speed, push to talk",
    speed: "Tutor speaking speed",
    ptt: "Push to talk (hold a button while speaking)",
    summaryEyebrow: "Your class",
    sumName: "Name",
    sumField: "Field",
    sumGoal: "Goal",
    sumTutor: "Tutor",
    start: "Start Class",
    starting: "Starting class…",
    missing: (items: string[]) => `Still needed: ${items.join(", ")}.`,
    readyHint:
      "Your tutor opens the class, teaches the material, then opens a Q&A session.",
    changeLanguage: "Change language",
    changeTrack: "Change track",
  },
} as const;

// Bahasa dilewati kalau sudah pernah dipilih; jalur selalu ditanyakan dulu
// (pilihan terakhir sudah tertandai) supaya peserta sadar sedang di jalur mana.
const firstStep = (p: Partial<LearnerProfile>): Step =>
  p.language ? "track" : "language";

const cardClass = (selected: boolean, disabled = false) =>
  [
    "text-left rounded-xl border transition",
    disabled
      ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
      : selected
        ? "border-teal-700 bg-teal-50/60 text-slate-900 ring-1 ring-teal-700"
        : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-teal-700/50 hover:bg-teal-50/40",
  ].join(" ");

const chipClass = (selected: boolean) =>
  [
    "px-3.5 py-2 rounded-full border text-sm transition-colors",
    selected
      ? "border-teal-700 bg-teal-700 text-white font-medium shadow-sm shadow-teal-700/20"
      : "border-slate-200 bg-white text-slate-700 hover:border-teal-700/50 hover:bg-teal-50",
  ].join(" ");

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-100";

const primaryClass =
  "w-full px-6 py-3.5 rounded-xl bg-teal-700 text-white font-semibold text-[15px] shadow-lg shadow-teal-700/20 transition hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed";

const Section = ({
  n,
  title,
  lead,
  children,
}: {
  n: number;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-3 py-6 border-b border-slate-100 last:border-b-0">
    <div>
      <h2 className="flex items-center gap-3 text-lg font-bold text-slate-900">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
          {n}
        </span>
        {title}
      </h2>
      {lead && <p className="mt-1 ml-9 text-sm text-slate-500">{lead}</p>}
    </div>
    <div className="ml-9 flex flex-col gap-3">{children}</div>
  </section>
);

const Example = ({ children }: { children: React.ReactNode }) => (
  <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm italic text-teal-900">
    {children}
  </p>
);

/**
 * Layar masuk kelas: bahasa pengantar → jalur → halaman setup (kelas, profil,
 * guru, opsi) dengan panel ringkasan dan tombol Mulai Kelas. Profil disimpan
 * di browser; kunjungan berikutnya langsung ke halaman setup yang sudah terisi.
 */
export const Onboarding = (props: OnboardingProps) => (
  <GuruShell>
    <OnboardingSteps {...props} />
  </GuruShell>
);

type OnboardingProps = {
  onStart: (profile: LearnerProfile) => void;
  loading: boolean;
  error: string | null;
  settings: ClassSettings | null;
  onSettingsChange: (settings: ClassSettings) => void;
};

const OnboardingSteps = ({
  onStart,
  loading,
  error,
  settings,
  onSettingsChange,
}: OnboardingProps) => {
  const [profile, setProfile] = useState<Partial<LearnerProfile> | null>(null);
  const [step, setStep] = useState<Step>("language");
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const saved = loadLearnerProfile();
    // Demo baru punya satu kelas; pilih otomatis supaya tidak perlu diklik.
    if (!saved.classKey) saved.classKey = "data-analysis";
    const initial = withValidTutor(saved);
    setProfile(initial);
    setStep(firstStep(initial));
  }, []);

  if (!profile) return null;

  const lang: LanguageCode = profile.language ?? "id";
  const t = T[lang];

  const update = (patch: Partial<LearnerProfile>) => {
    const next = withValidTutor({ ...profile, ...patch });
    if (next.goal !== "career_switch" || next.targetField === next.field)
      delete next.targetField;
    setProfile(next);
    saveLearnerProfile(next);
  };

  const backButton = (to: Step) => (
    <button
      onClick={() => setStep(to)}
      className="self-start text-sm text-slate-500 hover:text-teal-700"
    >
      ← {t.back}
    </button>
  );

  if (step === "language") {
    return (
      <div className="w-full max-w-md flex flex-col gap-5 px-4 py-10 sm:py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            In which language should Guru AI talk to you?
          </h1>
          <p className="text-sm text-slate-500">
            Explanations, translations, and your tutor will use this language.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
            <button
              key={code}
              onClick={() => {
                update({ language: code });
                setStep("track");
              }}
              className={`${cardClass(profile.language === code)} px-4 py-3`}
            >
              <span className="font-medium">{LANGUAGES[code]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "track") {
    return (
      <div className="w-full max-w-md flex flex-col gap-5 px-4 py-10 sm:py-16">
        {backButton("language")}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {t.trackTitle}
        </h1>
        <div className="flex flex-col gap-3">
          {TRACKS.map((track) => (
            <button
              key={track.key}
              disabled={!track.available}
              onClick={() => {
                update({ track: track.key });
                setStep("setup");
              }}
              className={`${cardClass(profile.track === track.key, !track.available)} px-4 py-3`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium">
                  <span aria-hidden="true">{track.icon} </span>
                  {track.label[lang]}
                </span>
                {!track.available && (
                  <span className="text-xs text-slate-400">{t.soon}</span>
                )}
              </span>
              <span
                className={`block mt-1 text-sm ${track.available ? "text-slate-500" : "text-slate-400"}`}
              >
                {track.description[lang]}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // step === "setup"
  const complete = isCompleteProfile(profile);
  const missing: string[] = (
    [
      !profile.classKey && t.s1,
      !profile.name?.trim() && t.sumName,
      !profile.field && t.sumField,
      !profile.goal && t.sumGoal,
      profile.goal === "career_switch" && !profile.targetField && t.targetField,
      !profile.tutorKey && t.sumTutor,
    ] as (string | false)[]
  ).filter((x): x is string => !!x);

  const selectedClass = CLASSES.find((c) => c.key === profile.classKey);
  const selectedField = FIELDS.find((f) => f.key === profile.field);
  const selectedGoal = GOALS.find((g) => g.key === profile.goal);
  const selectedTarget = FIELDS.find((f) => f.key === profile.targetField);
  const selectedTutor = findTutor(profile.tutorKey);

  const goalSummary =
    profile.goal === "career_switch" && profile.targetField
      ? `${labelOf(GOALS, profile.goal, lang)} → ${labelOf(FIELDS, profile.targetField, lang)}`
      : profile.goal
        ? labelOf(GOALS, profile.goal, lang)
        : "—";

  const summaryRows: [string, string][] = [
    [t.sumName, profile.name?.trim() || "—"],
    [t.sumField, profile.field ? labelOf(FIELDS, profile.field, lang) : "—"],
    [t.sumGoal, goalSummary],
    [
      t.sumTutor,
      selectedTutor
        ? `${selectedTutor.name} · ${selectedTutor.style[lang]}`
        : "—",
    ],
  ];

  const startButton = (
    <button
      onClick={() => complete && onStart(profile as LearnerProfile)}
      disabled={!complete || loading}
      className={primaryClass}
    >
      {loading ? t.starting : t.start}
    </button>
  );

  return (
    <div className="w-full max-w-5xl px-4 pt-4 pb-28 sm:px-8 lg:pb-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.setupTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t.setupLead}</p>
        </div>
        <p className="text-xs text-slate-400">
          <button
            onClick={() => setStep("track")}
            className="underline hover:text-teal-700"
          >
            {t.changeTrack}
          </button>
          {" · "}
          <button
            onClick={() => setStep("language")}
            className="underline hover:text-teal-700"
          >
            {t.changeLanguage}
          </button>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm px-5 sm:px-6">
          <Section n={1} title={t.s1}>
            <div className="grid gap-2 sm:grid-cols-2">
              {CLASSES.map((c) => (
                <button
                  key={c.key}
                  disabled={!c.available}
                  onClick={() => update({ classKey: c.key })}
                  className={`${cardClass(profile.classKey === c.key, !c.available)} px-3.5 py-3`}
                >
                  <span className="block text-sm font-medium">
                    {c.label[lang]}
                  </span>
                  <span className="block mt-0.5 text-xs text-slate-400">
                    {"description" in c ? c.description[lang] : t.soon}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          <Section n={2} title={t.s2} lead={t.s2Lead}>
            <label htmlFor="name" className="flex flex-col gap-1.5 text-sm">
              <span className="text-slate-700">{t.name}</span>
              <input
                id="name"
                value={profile.name ?? ""}
                maxLength={NAME_MAX_LENGTH}
                placeholder={t.namePlaceholder}
                autoComplete="given-name"
                onChange={(e) => update({ name: e.target.value })}
                onBlur={() => update({ name: profile.name?.trim() })}
                className={`${inputClass} sm:max-w-xs`}
              />
            </label>
            <div className="flex flex-col gap-2 text-sm">
              <span className="text-slate-700">{t.field}</span>
              <div className="flex flex-wrap gap-2">
                {FIELDS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => update({ field: f.key })}
                    className={chipClass(profile.field === f.key)}
                  >
                    {f.label[lang]}
                  </button>
                ))}
              </div>
              {selectedField && (
                <Example>
                  {t.example}: “{selectedField.description[lang]}”
                </Example>
              )}
            </div>
          </Section>

          <Section n={3} title={t.s3}>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <button
                  key={g.key}
                  onClick={() => update({ goal: g.key })}
                  className={chipClass(profile.goal === g.key)}
                >
                  {g.label[lang]}
                </button>
              ))}
            </div>
            {selectedGoal && (
              <Example>{selectedGoal.description[lang]}</Example>
            )}
            {profile.goal === "career_switch" && (
              <div className="flex flex-col gap-2 text-sm">
                <span className="text-slate-700">{t.targetField}</span>
                <div className="flex flex-wrap gap-2">
                  {FIELDS.filter((f) => f.key !== profile.field).map((f) => (
                    <button
                      key={f.key}
                      onClick={() => update({ targetField: f.key })}
                      className={chipClass(profile.targetField === f.key)}
                    >
                      {f.label[lang]}
                    </button>
                  ))}
                </div>
                {selectedTarget && (
                  <Example>
                    {t.example}: “{selectedTarget.description[lang]}”
                  </Example>
                )}
              </div>
            )}
          </Section>

          <Section n={4} title={t.s4} lead={t.s4Lead}>
            <div className="grid gap-3 sm:grid-cols-2">
              {tutorsFor(profile.track).map((tutor) => {
                const selected = profile.tutorKey === tutor.key;
                return (
                  <button
                    key={tutor.key}
                    onClick={() => update({ tutorKey: tutor.key })}
                    aria-pressed={selected}
                    className={`${cardClass(selected)} relative overflow-hidden`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tutor.image}
                      alt=""
                      className="aspect-[16/9] w-full object-cover"
                    />
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
                        ✓
                      </span>
                    )}
                    <span className="block px-3.5 pt-3 font-medium">
                      {tutor.name}
                    </span>
                    <span className="block px-3.5 text-sm text-slate-700">
                      {tutor.style[lang]}
                    </span>
                    <span className="block px-3.5 pb-3 pt-1 text-xs text-slate-400">
                      {tutor.description[lang]}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>

          <div className="py-4">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              aria-expanded={moreOpen}
              className="flex w-full items-center justify-between text-sm text-slate-700 hover:text-teal-700"
            >
              <span>
                <span className="font-medium">{t.more}</span>
                <span className="text-slate-400">: {t.moreHint}</span>
              </span>
              <span aria-hidden="true">{moreOpen ? "▴" : "▾"}</span>
            </button>
            {moreOpen && settings && (
              <div className="mt-4 flex flex-col gap-4 text-sm">
                <label htmlFor="speed" className="flex flex-col gap-1.5">
                  <span className="text-slate-700">{t.speed}</span>
                  <select
                    id="speed"
                    value={settings.speed}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        speed: e.target.value as SpeechSpeed,
                      })
                    }
                    className={`${inputClass} sm:max-w-xs`}
                  >
                    {(Object.keys(SPEECH_SPEEDS) as SpeechSpeed[]).map((s) => (
                      <option key={s} value={s}>
                        {lang === "id" ? SPEECH_SPEEDS[s] : SPEED_LABELS_EN[s]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2.5 text-slate-700">
                  <input
                    type="checkbox"
                    checked={settings.pushToTalk}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        pushToTalk: e.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-teal-700"
                  />
                  {t.ptt}
                </label>
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 lg:sticky lg:top-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">
            {t.summaryEyebrow}
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {selectedClass ? selectedClass.label[lang] : "—"}
          </h2>
          <dl className="mt-4 flex flex-col divide-y divide-slate-100 text-sm">
            {summaryRows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>

          {error && (
            <div className="mt-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-5 hidden lg:block">{startButton}</div>
          <p className="mt-3 text-center text-xs text-slate-400">
            {complete ? t.readyHint : t.missing(missing)}
          </p>
        </aside>
      </div>

      {/* Di layar kecil tombol Mulai Kelas menempel di bawah layar. */}
      <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-4 backdrop-blur lg:hidden">
        {startButton}
      </div>
    </div>
  );
};
