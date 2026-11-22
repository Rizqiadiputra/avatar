"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LiveAvatarContextProvider,
  useSession,
  useTextChat,
  useVoiceChat,
  useChatHistory,
  useMicrophoneDevices,
} from "../liveavatar";
import { SessionState, VoiceChatConfig } from "@heygen/liveavatar-web-sdk";
import { useAvatarActions } from "../liveavatar/useAvatarActions";
import { useLessonPlayer } from "../liveavatar/useLessonPlayer";
import type { LanguageCode } from "../liveavatar/languages";
import { useClassClosing } from "../liveavatar/useClassClosing";
import { LESSON_SLIDES, pickSlide } from "../liveavatar/lessonSlides";
import type { Tutor } from "../liveavatar/tutors";
import type { ClassRecord, EndReason } from "../liveavatar/classHistory";
import { LessonSlidePanel } from "./LessonSlidePanel";
import { GuruShell } from "./GuruShell";

// Ruang kelas untuk peserta (/kelas): tema terang seperti landing page dan
// hanya kontrol yang dibutuhkan peserta. Panel developer lengkap tetap ada di
// LiveAvatarSession (/settings).

const T = {
  id: {
    with: (name: string) => `bersama ${name}`,
    leave: "Keluar",
    leaveTitle: "Keluar dari kelas sekarang",
    timeLeft: "Sisa waktu",
    sessionLimit: "Dibatasi durasi maksimum sesi (mode uji: ±60 detik)",
    connecting: (name: string) => `Menyambungkan ke ${name}…`,
    connectFailed: (name: string) =>
      `${name} belum bisa tersambung. Pastikan izin mikrofon sudah diberikan, lalu coba lagi.`,
    backToSetup: "Kembali",
    micPermission:
      "Kalau browser meminta izin mikrofon, klik Izinkan agar kelas bisa dimulai.",
    preparing: "Menyiapkan materi…",
    lessonProgress: (i: number, n: number) => `Materi ${i} dari ${n}`,
    lessonPaused: (i: number, n: number) => `Materi dijeda (${i} dari ${n})`,
    pause: "Jeda",
    pauseTitle: "Hentikan guru sejenak",
    resume: "Lanjutkan",
    skip: "Lewati bagian ini",
    skipTitle: "Langsung ke bagian materi berikutnya",
    qa: "Sesi tanya jawab",
    replay: "Ulangi materi",
    replayTitle: "Guru membawakan materi dari awal lagi",
    finish: "Akhiri kelas",
    finishTitle: "Guru menutup kelas dengan salam penutup",
    closing: {
      time_up: "Waktu habis, guru menutup kelas…",
      finished: "Guru menutup kelas…",
      idle: "Tidak ada pertanyaan, guru menutup kelas…",
    },
    talking: (name: string) => `${name} sedang bicara`,
    you: "Kamu",
    youTalking: "Kamu sedang bicara",
    micTitle: "Mikrofon",
    micOn: "Matikan mikrofon",
    micOff: "Nyalakan mikrofon",
    micStarting: "Menyalakan…",
    micLocked: "Mikrofon dikunci",
    micHintLocked:
      "Mikrofon dikunci selama materi. Kamu bisa bertanya setelah materi selesai.",
    micHintOff: "Mikrofon mati. Nyalakan untuk bertanya dengan suara.",
    micHintOn: "Mikrofon aktif. Langsung bicara untuk bertanya.",
    micHintListening: "Guru sedang mendengarkanmu…",
    micHintInactive: "Mikrofon belum menyala.",
    ptt: "Tahan untuk bicara",
    pttActive: "Lepas untuk selesai",
    pttHint: "Tekan dan tahan tombol selama kamu bicara.",
    micDevice: "Pilih mikrofon",
    chatTitle: "Percakapan",
    chatLead: "Ucapanmu dan jawaban guru tertulis di sini.",
    chatEmpty: "Belum ada percakapan.",
    chatPlaceholder: "Ketik pertanyaan…",
    chatPlaceholderLocked: "Bisa bertanya setelah materi selesai",
    send: "Kirim",
  },
  en: {
    with: (name: string) => `with ${name}`,
    leave: "Leave",
    leaveTitle: "Leave the class now",
    timeLeft: "Time left",
    sessionLimit: "Limited by the maximum session length (test mode: ~60s)",
    connecting: (name: string) => `Connecting to ${name}…`,
    connectFailed: (name: string) =>
      `${name} couldn't connect. Make sure microphone access is allowed, then try again.`,
    backToSetup: "Go back",
    micPermission:
      "If your browser asks for microphone access, click Allow so the class can start.",
    preparing: "Preparing the lesson…",
    lessonProgress: (i: number, n: number) => `Part ${i} of ${n}`,
    lessonPaused: (i: number, n: number) => `Paused (part ${i} of ${n})`,
    pause: "Pause",
    pauseTitle: "Pause the tutor for a moment",
    resume: "Resume",
    skip: "Skip this part",
    skipTitle: "Jump to the next part of the lesson",
    qa: "Q&A session",
    replay: "Replay lesson",
    replayTitle: "Your tutor teaches the lesson again from the start",
    finish: "End class",
    finishTitle: "Your tutor closes the class with a goodbye",
    closing: {
      time_up: "Time's up, your tutor is closing the class…",
      finished: "Your tutor is closing the class…",
      idle: "No more questions, your tutor is closing the class…",
    },
    talking: (name: string) => `${name} is speaking`,
    you: "You",
    youTalking: "You're speaking",
    micTitle: "Microphone",
    micOn: "Turn mic off",
    micOff: "Turn mic on",
    micStarting: "Turning on…",
    micLocked: "Mic locked",
    micHintLocked:
      "Your mic is locked during the lesson. You can ask questions once it ends.",
    micHintOff: "Your mic is off. Turn it on to ask by voice.",
    micHintOn: "Your mic is on. Just speak to ask a question.",
    micHintListening: "Your tutor is listening…",
    micHintInactive: "Your mic isn't on yet.",
    ptt: "Hold to talk",
    pttActive: "Release when done",
    pttHint: "Press and hold the button while you speak.",
    micDevice: "Choose microphone",
    chatTitle: "Conversation",
    chatLead: "What you and your tutor say appears here.",
    chatEmpty: "No conversation yet.",
    chatPlaceholder: "Type a question…",
    chatPlaceholderLocked: "You can ask once the lesson ends",
    send: "Send",
  },
} as const;

export type SessionResult = {
  /** null kalau sesi tidak pernah tersambung. */
  startedAt: number | null;
  endedAt: number;
  endReason: EndReason;
  messages: ClassRecord["messages"];
};

const CONNECT_TIMEOUT_MS = 45000;

const formatClock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const MicIcon = ({ off = false }: { off?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

const linkButton =
  "rounded-lg px-2.5 py-1 font-medium text-teal-700 transition hover:bg-teal-50 hover:text-teal-800";

const ClassroomSessionInner: React.FC<{
  mode: "FULL" | "FULL_PTT";
  language: LanguageCode;
  tutorName: string;
  courseTitle: string;
  onSessionStopped: (result: SessionResult) => void;
}> = ({ mode, language, tutorName, courseTitle, onSessionStopped }) => {
  const t = T[language];
  const [message, setMessage] = useState("");
  const [pttHeld, setPttHeld] = useState(false);
  const {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    attachElement,
  } = useSession();
  const {
    isAvatarTalking,
    isUserTalking,
    isMuted,
    isActive,
    isLoading,
    start,
    mute,
    unmute,
    startPushToTalk,
    stopPushToTalk,
    error: voiceChatError,
  } = useVoiceChat();
  const { devices, selectedDeviceId, selectDevice } = useMicrophoneDevices();
  const { startListening, stopListening } = useAvatarActions("FULL");
  const lesson = useLessonPlayer("FULL", { language });
  const closing = useClassClosing("FULL", {
    language,
    qaActive: lesson.status === "done",
    onBeforeClose: lesson.halt,
  });
  const { sendMessage } = useTextChat("FULL");
  const chatMessages = useChatHistory();
  const videoRef = useRef<HTMLVideoElement>(null);
  // Untuk riwayat kelas: kapan tersambung, isi percakapan, dan cara kelas
  // berakhir (dibaca saat sesi terputus).
  const startedAtRef = useRef<number | null>(null);
  const messagesRef = useRef(chatMessages);
  messagesRef.current = chatMessages;
  const closingReasonRef = useRef(closing.reason);
  closingReasonRef.current = closing.reason;
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionState === SessionState.CONNECTED && !startedAtRef.current)
      startedAtRef.current = Date.now();
    if (sessionState === SessionState.DISCONNECTED)
      onSessionStopped({
        startedAt: startedAtRef.current,
        endedAt: Date.now(),
        endReason: closingReasonRef.current ?? "left",
        messages: messagesRef.current.map((m) => ({
          sender: m.sender === "user" ? "user" : "avatar",
          message: m.message,
        })),
      });
  }, [sessionState, onSessionStopped]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [chatMessages]);

  useEffect(() => {
    if (isStreamReady && videoRef.current) attachElement(videoRef.current);
  }, [attachElement, isStreamReady]);

  useEffect(() => {
    if (sessionState === SessionState.INACTIVE) startSession();
  }, [startSession, sessionState]);

  const connected = sessionState === SessionState.CONNECTED;

  // Keluar juga harus bisa saat masih menyambungkan: stop() di SDK tidak
  // melakukan apa-apa sebelum sesi tersambung, jadi langsung kembali.
  const leave = () => {
    if (connected) {
      stopSession();
      return;
    }
    onSessionStopped({
      startedAt: startedAtRef.current,
      endedAt: Date.now(),
      endReason: "left",
      messages: [],
    });
  };

  // Kalau guru tak kunjung tersambung, tampilkan pesan gagal, jangan
  // biarkan peserta menunggu tanpa kepastian.
  const [connectTimedOut, setConnectTimedOut] = useState(false);
  useEffect(() => {
    if (connected) return;
    const id = setTimeout(() => setConnectTimedOut(true), CONNECT_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [connected]);
  const closingNow = closing.status !== "open";
  // Jalur Profesional: peserta bertanya setelah materi selesai.
  const micLocked = lesson.status === "playing" || closingNow;

  const { slide, key: slideKey } = pickSlide(
    LESSON_SLIDES[language],
    lesson.status,
    lesson.current,
    closingNow,
  );

  const send = () => {
    const text = message.trim();
    if (!text || micLocked || !connected) return;
    sendMessage(text);
    setMessage("");
  };

  const pttDown = () => {
    if (micLocked || pttHeld) return;
    setPttHeld(true);
    startListening();
    startPushToTalk();
  };
  const pttUp = () => {
    if (!pttHeld) return;
    setPttHeld(false);
    stopPushToTalk();
    stopListening();
  };

  let micHint: string;
  if (mode === "FULL_PTT") micHint = micLocked ? t.micHintLocked : t.pttHint;
  else if (!isActive) micHint = t.micHintInactive;
  else if (micLocked) micHint = t.micHintLocked;
  else if (isMuted) micHint = t.micHintOff;
  else if (isUserTalking) micHint = t.micHintListening;
  else micHint = t.micHintOn;

  const timer =
    closing.status === "open" && closing.remainingSeconds !== null ? (
      <span
        title={closing.limitedBySession ? t.sessionLimit : t.timeLeft}
        className={`rounded-full border px-3 py-1 text-sm font-semibold tabular-nums ${
          closing.remainingSeconds <= 120
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        ⏱ {formatClock(closing.remainingSeconds)}
      </span>
    ) : null;

  return (
    <GuruShell
      wide
      headerCenter={
        <div className="leading-tight">
          <p className="truncate font-bold text-slate-900">{courseTitle}</p>
          <p className="text-sm text-slate-500">{t.with(tutorName)}</p>
        </div>
      }
      headerRight={
        <>
          {timer}
          <button
            onClick={leave}
            title={t.leaveTitle}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            {t.leave}
          </button>
        </>
      }
    >
      <div className="grid w-full gap-5 px-4 pb-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Slide materi + kontrol materi */}
        <LessonSlidePanel
          slide={slide}
          slideKey={slideKey}
          courseTitle={courseTitle}
        >
          {!connected ? (
            <span className="text-slate-400">{t.connecting(tutorName)}</span>
          ) : closingNow ? (
            <span>
              {closing.reason ? t.closing[closing.reason] : t.closing.finished}
            </span>
          ) : lesson.status === "playing" ? (
            <>
              <span className="font-medium text-slate-700">
                {t.lessonProgress(lesson.current, lesson.total)}
              </span>
              <span className="ml-auto flex gap-1">
                <button
                  className={linkButton}
                  title={t.pauseTitle}
                  onClick={lesson.pause}
                >
                  ⏸ {t.pause}
                </button>
                <button
                  className={linkButton}
                  title={t.skipTitle}
                  onClick={lesson.skip}
                >
                  {t.skip} →
                </button>
              </span>
            </>
          ) : lesson.status === "paused" ? (
            <>
              <span className="font-medium text-slate-700">
                {t.lessonPaused(lesson.current, lesson.total)}
              </span>
              <span className="ml-auto flex gap-1">
                <button className={linkButton} onClick={lesson.resume}>
                  ▶ {t.resume}
                </button>
                <button
                  className={linkButton}
                  title={t.skipTitle}
                  onClick={lesson.skip}
                >
                  {t.skip} →
                </button>
              </span>
            </>
          ) : lesson.status === "done" ? (
            <>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                {t.qa}
              </span>
              <span className="ml-auto flex gap-1">
                <button
                  className={linkButton}
                  title={t.replayTitle}
                  onClick={lesson.start}
                >
                  ↺ {t.replay}
                </button>
                <button
                  className="rounded-lg bg-teal-700 px-3 py-1 font-semibold text-white transition hover:bg-teal-800"
                  title={t.finishTitle}
                  onClick={() => closing.close("finished")}
                >
                  {t.finish}
                </button>
              </span>
            </>
          ) : (
            <span className="text-slate-400">{t.preparing}</span>
          )}
        </LessonSlidePanel>

        <div className="flex min-w-0 flex-col gap-4">
          {/* Video guru */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-sm">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={`h-full w-full object-contain transition-opacity ${
                connected ? "opacity-100" : "opacity-0"
              }`}
            />
            {!connected && !connectTimedOut && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-white/80">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {t.connecting(tutorName)}
                <span className="max-w-xs px-6 text-center text-xs text-white/60">
                  {t.micPermission}
                </span>
              </div>
            )}
            {!connected && connectTimedOut && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white/90">
                <p>{t.connectFailed(tutorName)}</p>
                <button
                  onClick={leave}
                  className="rounded-xl bg-white px-4 py-2 font-semibold text-slate-900 transition hover:bg-teal-50"
                >
                  {t.backToSetup}
                </button>
              </div>
            )}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm transition ${
                  isAvatarTalking
                    ? "bg-teal-600/90 text-white"
                    : "bg-black/45 text-white/80"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${isAvatarTalking ? "animate-pulse bg-white" : "bg-white/40"}`}
                />
                {isAvatarTalking ? t.talking(tutorName) : tutorName}
              </span>
              {isUserTalking && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  {t.youTalking}
                </span>
              )}
            </div>
          </div>

          {/* Mikrofon */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              {mode === "FULL_PTT" ? (
                <button
                  onPointerDown={pttDown}
                  onPointerUp={pttUp}
                  onPointerLeave={pttUp}
                  disabled={micLocked || !connected}
                  className={`flex select-none items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
                    pttHeld
                      ? "bg-emerald-600 text-white"
                      : "bg-teal-700 text-white hover:bg-teal-800"
                  }`}
                >
                  <MicIcon />
                  {micLocked ? t.micLocked : pttHeld ? t.pttActive : t.ptt}
                </button>
              ) : !isActive ? (
                <button
                  onClick={() => start()}
                  disabled={isLoading || !connected}
                  className="flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <MicIcon off />
                  {isLoading ? t.micStarting : t.micOff}
                </button>
              ) : (
                <button
                  onClick={() => (isMuted ? unmute() : mute())}
                  disabled={micLocked}
                  aria-pressed={!isMuted}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 ${
                    isMuted
                      ? "bg-teal-700 text-white hover:bg-teal-800"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  }`}
                >
                  <MicIcon off={isMuted || micLocked} />
                  {micLocked ? t.micLocked : isMuted ? t.micOff : t.micOn}
                </button>
              )}
              <p className="min-w-0 flex-1 text-sm leading-snug text-slate-500">
                {micHint}
              </p>
            </div>
            {devices.length > 1 && (
              <label className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                {t.micDevice}
                <select
                  value={selectedDeviceId ?? ""}
                  onChange={(e) => selectDevice(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-teal-700 focus:outline-none"
                >
                  {devices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {voiceChatError && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {voiceChatError}
              </p>
            )}
          </div>

          {/* Percakapan */}
          <div className="flex h-[340px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="shrink-0 border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-bold text-slate-900">{t.chatTitle}</p>
              <p className="text-xs text-slate-400">{t.chatLead}</p>
            </div>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
              {chatMessages.length === 0 && (
                <p className="mt-8 text-center text-xs text-slate-400">
                  {t.chatEmpty}
                </p>
              )}
              {chatMessages.map((msg, i) => {
                const mine = msg.sender === "user";
                return (
                  <div
                    key={i}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                        mine
                          ? "rounded-br-sm bg-teal-700 text-white"
                          : "rounded-bl-sm bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span
                        className={`mb-0.5 block text-[11px] font-semibold ${mine ? "text-teal-100" : "text-slate-400"}`}
                      >
                        {mine ? t.you : tutorName}
                      </span>
                      <p className="leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <form
              className="flex shrink-0 gap-2 border-t border-slate-100 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={micLocked || !connected}
                placeholder={
                  micLocked ? t.chatPlaceholderLocked : t.chatPlaceholder
                }
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100 disabled:bg-slate-50"
              />
              <button
                type="submit"
                disabled={micLocked || !connected || !message.trim()}
                className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {t.send}
              </button>
            </form>
          </div>
        </div>
      </div>
    </GuruShell>
  );
};

export const ClassroomSession: React.FC<{
  pushToTalk: boolean;
  language: LanguageCode;
  tutor?: Tutor;
  courseTitle: string;
  sessionAccessToken: string;
  voiceChatConfig: VoiceChatConfig;
  onSessionStopped: (result: SessionResult) => void;
}> = ({
  pushToTalk,
  language,
  tutor,
  courseTitle,
  sessionAccessToken,
  voiceChatConfig,
  onSessionStopped,
}) => (
  <LiveAvatarContextProvider
    sessionAccessToken={sessionAccessToken}
    voiceChatConfig={voiceChatConfig}
  >
    <ClassroomSessionInner
      mode={pushToTalk ? "FULL_PTT" : "FULL"}
      language={language}
      tutorName={tutor?.name ?? "Guru AI"}
      courseTitle={courseTitle}
      onSessionStopped={onSessionStopped}
    />
  </LiveAvatarContextProvider>
);
