import { useCallback, useEffect, useRef, useState } from "react";
import {
  AgentEventsEnum,
  SessionState,
  VoiceChatState,
} from "@heygen/liveavatar-web-sdk";
import { useLiveAvatarContext } from "./context";
import { useAvatarActions } from "./useAvatarActions";
import type { LanguageCode } from "./languages";
import {
  CLASS_DURATION_MINUTES,
  CLOSING_SCRIPTS,
  ClosingReason,
  IDLE_CLOSE_MINUTES,
  TIME_UP_LEAD_SECONDS,
} from "./classClosing";

export type ClosingStatus = "open" | "closing" | "closed";

// Kalau event selesai bicara tidak datang, sesi tetap dihentikan setelah ini.
const CLOSING_FALLBACK_MS = 30000;

/**
 * Menutup kelas dengan kalimat penutup dosen, lalu menghentikan sesi:
 * - "time_up": menjelang durasi kelas / batas sesi habis,
 * - "idle": sesi tanya jawab sepi selama IDLE_CLOSE_MINUTES,
 * - "finished": dipanggil manual lewat close("finished").
 * `onBeforeClose` dipakai untuk menghentikan pemutar materi lebih dulu.
 */
export const useClassClosing = (
  mode: "FULL" | "LITE",
  {
    language,
    qaActive,
    onBeforeClose,
  }: {
    language: LanguageCode;
    /** true saat materi sudah selesai dan kelas masuk sesi tanya jawab. */
    qaActive: boolean;
    onBeforeClose?: () => void;
  },
) => {
  const { sessionRef, sessionState, isStreamReady } = useLiveAvatarContext();
  const { repeat, interrupt } = useAvatarActions(mode);

  const [status, setStatus] = useState<ClosingStatus>("open");
  const [reason, setReason] = useState<ClosingReason | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  // true kalau batas sesi LiveAvatar (mis. 60 detik di sandbox) lebih pendek
  // dari durasi kelas, sehingga kelas ditutup lebih cepat dari rencana.
  const [limitedBySession, setLimitedBySession] = useState(false);
  const statusRef = useRef<ClosingStatus>("open");
  const closingSpeechStartedRef = useRef(false);
  const lastActivityRef = useRef(Date.now());
  const onBeforeCloseRef = useRef(onBeforeClose);
  onBeforeCloseRef.current = onBeforeClose;

  const connected = isStreamReady && sessionState === SessionState.CONNECTED;

  const stop = useCallback(() => {
    statusRef.current = "closed";
    setStatus("closed");
    sessionRef.current?.stop().catch(console.warn);
  }, [sessionRef]);

  const close = useCallback(
    async (why: ClosingReason) => {
      if (statusRef.current !== "open") return;
      statusRef.current = "closing";
      setStatus("closing");
      setReason(why);
      closingSpeechStartedRef.current = false;

      onBeforeCloseRef.current?.();
      const voiceChat = sessionRef.current?.voiceChat;
      if (voiceChat?.state === VoiceChatState.ACTIVE && !voiceChat.isMuted) {
        await voiceChat.mute().catch(console.warn);
      }
      try {
        interrupt();
      } catch {
        /* tidak ada yang sedang diucapkan */
      }
      try {
        await repeat(CLOSING_SCRIPTS[language][why]);
      } catch (e) {
        console.error("Gagal mengirim kalimat penutup:", e);
        stop();
      }
    },
    [sessionRef, interrupt, repeat, language, stop],
  );

  // Hentikan sesi setelah kalimat penutup selesai diucapkan; catat aktivitas
  // bicara untuk deteksi kelas sepi.
  useEffect(() => {
    const session = sessionRef.current;
    if (!session) return;
    const markActive = () => {
      lastActivityRef.current = Date.now();
    };
    const onAvatarStart = () => {
      markActive();
      if (statusRef.current === "closing") {
        closingSpeechStartedRef.current = true;
      }
    };
    const onAvatarEnd = () => {
      markActive();
      // Abaikan "selesai bicara" dari ucapan yang dipotong sebelum penutup.
      if (statusRef.current === "closing" && closingSpeechStartedRef.current) {
        stop();
      }
    };
    session.on(AgentEventsEnum.USER_SPEAK_STARTED, markActive);
    session.on(AgentEventsEnum.USER_SPEAK_ENDED, markActive);
    session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, onAvatarStart);
    session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, onAvatarEnd);
    return () => {
      session.off(AgentEventsEnum.USER_SPEAK_STARTED, markActive);
      session.off(AgentEventsEnum.USER_SPEAK_ENDED, markActive);
      session.off(AgentEventsEnum.AVATAR_SPEAK_STARTED, onAvatarStart);
      session.off(AgentEventsEnum.AVATAR_SPEAK_ENDED, onAvatarEnd);
    };
  }, [sessionRef, stop]);

  // Cadangan: tetap hentikan sesi kalau penutup macet.
  useEffect(() => {
    if (status !== "closing") return;
    const t = setTimeout(stop, CLOSING_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [status, stop]);

  // Hitung mundur durasi kelas sejak sesi tersambung.
  useEffect(() => {
    if (!connected) return;
    const startedAt = Date.now();
    const limits: number[] = [];
    if (CLASS_DURATION_MINUTES) limits.push(CLASS_DURATION_MINUTES * 60);
    const max = sessionRef.current?.maxSessionDuration;
    if (max && max > 0) limits.push(max);
    if (limits.length === 0) return;
    const totalSeconds = Math.min(...limits);
    setLimitedBySession(
      !!max &&
        max > 0 &&
        (!CLASS_DURATION_MINUTES || max < CLASS_DURATION_MINUTES * 60),
    );
    lastActivityRef.current = startedAt;
    // Sesi pendek (mis. sandbox 60 detik) jangan dipotong 30 detik untuk
    // penutup, supaya masih ada waktu tanya jawab: 15% durasi, minimal 8 detik.
    const lead = Math.min(
      TIME_UP_LEAD_SECONDS,
      Math.max(8, Math.round(totalSeconds * 0.15)),
    );

    const tick = () => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const remaining = Math.max(0, Math.round(totalSeconds - elapsed));
      setRemainingSeconds(remaining);
      if (remaining <= lead) close("time_up");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [connected, sessionRef, close]);

  // Tutup kelas kalau sesi tanya jawab sepi terlalu lama.
  useEffect(() => {
    if (!connected || !qaActive || !IDLE_CLOSE_MINUTES) return;
    lastActivityRef.current = Date.now();
    const limitMs = IDLE_CLOSE_MINUTES * 60 * 1000;
    const id = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= limitMs) close("idle");
    }, 5000);
    return () => clearInterval(id);
  }, [connected, qaActive, close]);

  return { status, reason, remainingSeconds, limitedBySession, close };
};
