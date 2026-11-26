"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PackItem, TeachingLesson } from "../../teaching/types";
import {
  CHAPTER_CARD_SECONDS,
  buildTimeline,
  fmt,
  isActive,
  type Resolved,
} from "../../teaching/timeline";
import {
  BOARD_MAIN,
  ChapterCard,
  ChapterTracker,
  IdleBoard,
  LowerThird,
  Overlay,
} from "./TeachingOverlays";

export type TeachingPlayerHandle = {
  seek: (seconds: number) => void;
  play: () => void;
  pause: () => void;
};

type QuizItem = Resolved<Extract<PackItem, { use: "Quiz" }>>;

/**
 * Pemutar Mode Mengajar: video HeyGen polos tampil di kartu avatar, packaging
 * digambar di papan materi terpisah, sinkron ke waktu putar video. Bila file
 * video belum ada / gagal dimuat, pemutar jalan di mode pratinjau (jam
 * simulasi, foto guru di kartu avatar) supaya timing tetap bisa dicek.
 */
export const TeachingVideoPlayer = ({
  lesson,
  tutorImage,
  tutorName,
  belowBoard,
  belowAvatar,
  onTick,
  onPlayingChange,
  onEnded,
  ref,
}: {
  lesson: TeachingLesson;
  tutorImage?: string;
  tutorName?: string;
  /** Di bawah kontrol, kolom materi (mis. transkrip). */
  belowBoard?: React.ReactNode;
  /** Di bawah kartu avatar, kolom guru (mis. chat). */
  belowAvatar?: React.ReactNode;
  onTick?: (t: number, duration: number) => void;
  onPlayingChange?: (playing: boolean) => void;
  onEnded?: () => void;
  ref?: React.Ref<TeachingPlayerHandle>;
}) => {
  const timeline = useMemo(() => buildTimeline(lesson), [lesson]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"video" | "preview">(
    lesson.video ? "video" : "preview",
  );
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(lesson.duration);
  const [quiz, setQuiz] = useState<QuizItem | null>(null);
  const [choice, setChoice] = useState<number | null>(null);

  const tRef = useRef(0);
  const answeredRef = useRef(new Set<number>());
  const modeRef = useRef(mode);
  const onTickRef = useRef(onTick);
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    modeRef.current = mode;
    onTickRef.current = onTick;
    onEndedRef.current = onEnded;
  });

  const quizzes = useMemo(
    () => timeline.items.filter((i): i is QuizItem => i.use === "Quiz"),
    [timeline],
  );

  const setTime = useCallback(
    (next: number) => {
      tRef.current = next;
      setT(next);
      onTickRef.current?.(next, duration);
    },
    [duration],
  );

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setPlaying(false);
  }, []);

  // Selama kuis tampil, tombol putar dinonaktifkan dan klik panggung
  // ditahan kartu kuis; closeQuiz yang melanjutkan.
  const play = useCallback(() => {
    if (tRef.current >= duration - 0.05) setTime(0);
    if (modeRef.current === "video" && videoRef.current) {
      videoRef.current.play().catch((e) => {
        console.warn("Video tidak bisa diputar:", e);
        setPlaying(false);
      });
    }
    setPlaying(true);
  }, [duration, setTime]);

  const seek = useCallback(
    (s: number) => {
      const next = Math.min(Math.max(0, s), duration);
      if (modeRef.current === "video" && videoRef.current)
        videoRef.current.currentTime = next;
      // Kuis setelah titik seek boleh muncul lagi.
      for (const q of quizzes)
        if (q.start >= next) answeredRef.current.delete(q.index);
      setQuiz(null);
      setChoice(null);
      setTime(next);
    },
    [duration, quizzes, setTime],
  );

  useImperativeHandle(ref, () => ({ seek, play, pause }), [seek, play, pause]);

  const onPlayingChangeRef = useRef(onPlayingChange);
  useEffect(() => {
    onPlayingChangeRef.current = onPlayingChange;
  });
  useEffect(() => {
    onPlayingChangeRef.current?.(playing);
  }, [playing]);

  const applyDuration = useCallback((d: number) => {
    if (!Number.isFinite(d) || d <= 0) return;
    setDuration(d);
    onTickRef.current?.(tRef.current, d);
  }, []);

  const fallBackToPreview = useCallback(() => {
    setPlaying(false);
    modeRef.current = "preview";
    setMode("preview");
  }, []);

  // Metadata / error bisa sudah terjadi sebelum React terpasang (video ada di
  // HTML hasil render server), sehingga event-nya terlewat. Cek sekali di sini.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.error) fallBackToPreview();
    else if (v.readyState >= 1) applyDuration(v.duration);
  }, [applyDuration, fallBackToPreview]);

  // Jam: baca currentTime video, atau majukan jam simulasi di mode pratinjau.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const prev = tRef.current;
      let next =
        modeRef.current === "video" && videoRef.current
          ? videoRef.current.currentTime
          : prev + (now - last) / 1000;
      last = now;

      // Kuis: berhenti tepat di titiknya sampai dijawab.
      const hit = quizzes.find(
        (q) =>
          !answeredRef.current.has(q.index) &&
          prev < q.start &&
          next >= q.start,
      );
      if (hit) {
        next = hit.start;
        if (modeRef.current === "video" && videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = hit.start;
        }
        setTime(next);
        setPlaying(false);
        setQuiz(hit);
        return;
      }

      if (next >= duration) {
        setTime(duration);
        setPlaying(false);
        onEndedRef.current?.();
        return;
      }
      setTime(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, quizzes, setTime]);

  const closeQuiz = () => {
    if (quiz) answeredRef.current.add(quiz.index);
    setQuiz(null);
    setChoice(null);
    play();
  };

  const chapterCard = timeline.chapters.find(
    (c) => c.card && t >= c.start && t < c.start + CHAPTER_CARD_SECONDS,
  );
  const visible = timeline.items.filter(
    (i) => i.use !== "Quiz" && i.use !== "LowerThird" && isActive(i, t),
  );
  const lowerThirds = timeline.items.filter(
    (i): i is Resolved<Extract<PackItem, { use: "LowerThird" }>> =>
      i.use === "LowerThird" && isActive(i, t),
  );
  const boardBusy = visible.some((i) => BOARD_MAIN.has(i.use));
  const currentChapter = [...timeline.chapters]
    .reverse()
    .find((c) => t >= c.start);

  return (
    // Kiri: materi (papan → kontrol → transkrip). Kanan: guru (avatar → chat).
    // Grid 2 baris supaya kartu avatar setinggi papan dan chat setinggi
    // kontrol + transkrip.
    <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
      {/* Papan materi */}
      <div
        className="relative aspect-video w-full cursor-pointer select-none overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-emerald-50 shadow-sm [container-type:inline-size]"
        onClick={() => (playing ? pause() : play())}
      >
        {!boardBusy && (
          <IdleBoard chapter={currentChapter} lessonTitle={lesson.title} />
        )}
        <ChapterTracker chapters={timeline.chapters} t={t} />
        {visible.map((item) => (
          <Overlay
            key={item.index}
            item={item}
            t={t}
            resolve={timeline.resolve}
          />
        ))}
        {chapterCard && <ChapterCard chapter={chapterCard} t={t} />}

        {!playing && !quiz && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-700 text-2xl text-white shadow-lg">
              ▶
            </span>
          </div>
        )}

        {quiz && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-lg rounded-2xl bg-white p-5 text-slate-800 shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Cek pemahaman
              </p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                {quiz.question}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {quiz.options.map((opt, k) => {
                  const picked = choice !== null;
                  const correct = k === quiz.answer;
                  return (
                    <button
                      key={k}
                      disabled={picked}
                      onClick={() => setChoice(k)}
                      className={`rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition ${
                        !picked
                          ? "border-slate-200 hover:border-teal-600 hover:bg-teal-50"
                          : correct
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                            : k === choice
                              ? "border-red-300 bg-red-50 text-red-800"
                              : "border-slate-200 text-slate-400"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {choice !== null && (
                <div className="mt-4 flex items-end gap-3">
                  <p className="flex-1 text-sm leading-relaxed text-slate-600">
                    <span className="font-semibold">
                      {choice === quiz.answer ? "Tepat! " : "Belum tepat. "}
                    </span>
                    {quiz.explain}
                  </p>
                  <button
                    onClick={closeQuiz}
                    className="shrink-0 rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                  >
                    Lanjutkan ▶
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Kartu avatar: video HeyGen polos */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-sm lg:aspect-auto lg:h-full">
        {mode === "video" ? (
          <video
            ref={videoRef}
            src={lesson.video}
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            onLoadedMetadata={(e) => applyDuration(e.currentTarget.duration)}
            onError={fallBackToPreview}
          />
        ) : (
          <>
            {tutorImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tutorImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
              />
            )}
            <span className="absolute right-2 top-2 rounded-full bg-amber-400/90 px-2 py-0.5 text-[11px] font-semibold text-amber-950">
              Pratinjau tanpa video
            </span>
          </>
        )}
        {lowerThirds.map((item) => (
          <LowerThird key={item.index} item={item} t={t} />
        ))}
        {lowerThirds.length === 0 && tutorName && (
          <span
            className={`absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm transition ${
              playing
                ? "bg-teal-600/90 text-white"
                : "bg-black/45 text-white/80"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${playing ? "animate-pulse bg-white" : "bg-white/40"}`}
            />
            {playing ? `${tutorName} sedang mengajar` : tutorName}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        {/* Kontrol */}
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <button
            onClick={() => (playing ? pause() : play())}
            disabled={!!quiz}
            className="w-24 rounded-lg bg-teal-700 px-3 py-1.5 font-semibold text-white transition hover:bg-teal-800 disabled:bg-slate-300"
          >
            {playing ? "❚❚ Jeda" : "▶ Putar"}
          </button>
          <span className="w-24 shrink-0 tabular-nums">
            {fmt(t)} / {fmt(duration)}
          </span>
          <div
            className="relative h-2 flex-1 cursor-pointer rounded-full bg-slate-200"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              seek(((e.clientX - r.left) / r.width) * duration);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-teal-600"
              style={{ width: `${(t / duration) * 100}%` }}
            />
            {timeline.chapters.map((c, i) => (
              <span
                key={i}
                title={c.title}
                className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 bg-slate-500"
                style={{ left: `${(c.start / duration) * 100}%` }}
              />
            ))}
            {quizzes.map((q) => (
              <span
                key={q.index}
                title="Kuis"
                className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500"
                style={{ left: `${(q.start / duration) * 100}%` }}
              />
            ))}
          </div>
          <span className="hidden w-28 truncate text-right font-medium text-slate-700 sm:block">
            {currentChapter?.title}
          </span>
        </div>

        {belowBoard}
      </div>

      <div className="flex min-w-0 flex-col">{belowAvatar}</div>
    </div>
  );
};
