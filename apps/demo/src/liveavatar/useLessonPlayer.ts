import { useCallback, useEffect, useRef, useState } from "react";
import {
  AgentEventsEnum,
  SessionState,
  VoiceChatState,
} from "@heygen/liveavatar-web-sdk";
import { useLiveAvatarContext } from "./context";
import { useAvatarActions } from "./useAvatarActions";
import { LESSON_SCRIPTS } from "./lessonScript";
import type { LanguageCode } from "./languages";

export type LessonStatus = "idle" | "playing" | "paused" | "done";

const OPENING_FALLBACK_MS = 8000;

/**
 * Membawakan skrip materi (sesuai bahasa) paragraf demi paragraf: paragraf
 * berikutnya dikirim setelah avatar selesai bicara (AVATAR_SPEAK_ENDED).
 * Materi otomatis dimulai setelah salam pembuka dari context selesai, supaya
 * tidak bertabrakan. Mikrofon dimute selama materi agar suara peserta tidak
 * memotong, lalu dibuka lagi untuk tanya jawab.
 */
export const useLessonPlayer = (
  mode: "FULL" | "LITE",
  {
    autoStart = true,
    language,
  }: { autoStart?: boolean; language: LanguageCode },
) => {
  const script = LESSON_SCRIPTS[language];
  const { sessionRef, sessionState, isStreamReady, voiceChatState } =
    useLiveAvatarContext();
  const { repeat, interrupt } = useAvatarActions(mode);

  const [status, setStatus] = useState<LessonStatus>("idle");
  const [index, setIndex] = useState(0);
  const statusRef = useRef<LessonStatus>("idle");
  const indexRef = useRef(0);
  const mutedByLessonRef = useRef(false);
  const openingStartedRef = useRef(false);
  // Salam pembuka bisa selesai sebelum sesi berstatus CONNECTED. Kalau begitu,
  // materi ditunda sampai sesi siap (lihat efek di bawah).
  const [openingEndedEarly, setOpeningEndedEarly] = useState(false);

  const updateStatus = (s: LessonStatus) => {
    statusRef.current = s;
    setStatus(s);
  };

  const restoreMic = useCallback(async () => {
    const voiceChat = sessionRef.current?.voiceChat;
    if (
      mutedByLessonRef.current &&
      voiceChat?.state === VoiceChatState.ACTIVE
    ) {
      await voiceChat.unmute().catch(console.warn);
    }
    mutedByLessonRef.current = false;
  }, [sessionRef]);

  const finish = useCallback(() => {
    updateStatus("done");
    restoreMic();
  }, [restoreMic]);

  const playNext = useCallback(async () => {
    // Sesi bisa sudah berakhir (mis. batas durasi trial) saat event
    // AVATAR_SPEAK_ENDED terakhir datang. Hentikan materi tanpa error.
    if (sessionRef.current?.state !== SessionState.CONNECTED) {
      updateStatus("done");
      mutedByLessonRef.current = false;
      return;
    }
    const i = indexRef.current;
    const paragraph = script[i];
    if (paragraph === undefined) {
      finish();
      return;
    }
    indexRef.current = i + 1;
    setIndex(i + 1);
    try {
      await repeat(paragraph);
    } catch (e) {
      console.error("Gagal mengirim paragraf materi:", e);
      finish();
    }
  }, [sessionRef, script, repeat, finish]);

  const start = useCallback(async () => {
    const voiceChat = sessionRef.current?.voiceChat;
    if (voiceChat?.state === VoiceChatState.ACTIVE && !voiceChat.isMuted) {
      await voiceChat.mute().catch(console.warn);
      mutedByLessonRef.current = true;
    }
    indexRef.current = 0;
    setIndex(0);
    updateStatus("playing");
    playNext();
  }, [sessionRef, playNext]);

  // Interrupt saat materi berjalan: hentikan ucapan avatar dan jeda materi.
  // Status "paused" membuat AVATAR_SPEAK_ENDED dari interrupt tidak memicu
  // paragraf berikutnya. Mikrofon tetap dimute sampai materi selesai.
  const pause = useCallback(() => {
    if (statusRef.current !== "playing") return;
    updateStatus("paused");
    interrupt();
  }, [interrupt]);

  // Lanjutkan dari paragraf yang tadi terpotong.
  const resume = useCallback(() => {
    if (statusRef.current !== "paused") return;
    const i = Math.max(0, indexRef.current - 1);
    indexRef.current = i;
    setIndex(i);
    updateStatus("playing");
    playNext();
  }, [playNext]);

  const skip = useCallback(() => {
    if (statusRef.current !== "playing" && statusRef.current !== "paused")
      return;
    indexRef.current = script.length;
    setIndex(script.length);
    interrupt();
    finish();
  }, [script, interrupt, finish]);

  const ready =
    isStreamReady &&
    sessionState === SessionState.CONNECTED &&
    voiceChatState !== VoiceChatState.STARTING;

  // Hentikan materi tanpa membuka mic lagi (dipakai saat kelas ditutup).
  const halt = useCallback(() => {
    indexRef.current = script.length;
    setIndex(script.length);
    mutedByLessonRef.current = false;
    updateStatus("done");
  }, [script]);

  // Lanjut ke paragraf berikutnya setiap kali avatar selesai bicara. Ucapan
  // pertama yang selesai saat masih idle adalah salam pembuka context, jadi
  // materi dimulai tepat setelahnya.
  useEffect(() => {
    const session = sessionRef.current;
    if (!session) return;
    const onSpeakStarted = () => {
      if (statusRef.current === "idle") openingStartedRef.current = true;
    };
    const onSpeakEnded = () => {
      if (statusRef.current === "playing") {
        playNext(); // playNext sendiri berhenti dengan aman kalau sesi putus
      } else if (autoStart && statusRef.current === "idle") {
        if (session.state === SessionState.CONNECTED) start();
        else setOpeningEndedEarly(true);
      }
    };
    session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, onSpeakStarted);
    session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, onSpeakEnded);
    return () => {
      session.off(AgentEventsEnum.AVATAR_SPEAK_STARTED, onSpeakStarted);
      session.off(AgentEventsEnum.AVATAR_SPEAK_ENDED, onSpeakEnded);
    };
  }, [sessionRef, playNext, autoStart, start]);

  // Salam pembuka sudah selesai sebelum sesi siap: mulai materi begitu siap.
  useEffect(() => {
    if (openingEndedEarly && ready && statusRef.current === "idle") start();
  }, [openingEndedEarly, ready, start]);

  // Cadangan: kalau salam pembuka belum mulai terdengar beberapa detik setelah
  // sesi siap, mulai materi tanpa menunggu.
  useEffect(() => {
    if (!autoStart || !ready || statusRef.current !== "idle") return;
    const t = setTimeout(() => {
      if (statusRef.current === "idle" && !openingStartedRef.current) start();
    }, OPENING_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [autoStart, ready, start]);

  return {
    status,
    current: index,
    total: script.length,
    start,
    pause,
    resume,
    skip,
    halt,
  };
};
