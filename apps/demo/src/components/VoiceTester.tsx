"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AgentEventsEnum,
  SessionState,
  VoiceChatConfig,
} from "@heygen/liveavatar-web-sdk";
import { LiveAvatarContextProvider, useSession } from "../liveavatar";
import { useLiveAvatarContext } from "../liveavatar/context";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LanguageCode,
  isLanguageCode,
} from "../liveavatar/languages";
import {
  DEFAULT_SPEECH_SPEED,
  SPEECH_SPEEDS,
  SpeechSpeed,
  isSpeechSpeed,
} from "../liveavatar/speechSpeed";

type CatalogAvatar = {
  id: string;
  name: string;
  previewUrl: string;
  defaultVoiceId: string | null;
};
type CatalogVoice = { id: string; name: string; gender: string };
type Catalog = {
  defaults: { avatarId: string; voiceId: string };
  avatars: CatalogAvatar[];
  voices: CatalogVoice[];
};

type HistoryItem = {
  avatarId: string;
  voiceId: string;
  language: LanguageCode;
  speed?: SpeechSpeed;
  liked: boolean;
  at: number;
};

const SAMPLE_TEXT: Record<LanguageCode, string> = {
  id: "Halo, selamat datang. Hari ini kita akan belajar dasar analisis data, mulai dari memahami jenis data sampai menyampaikan insight yang bisa ditindaklanjuti.",
  en: "Hello and welcome. Today we will learn the basics of data analysis, from understanding data types to sharing insights people can act on.",
};

const HISTORY_KEY = "voice-tester-history";
// Kalau salam pembuka context tidak mulai dalam waktu ini, langsung ucapkan teks uji.
const OPENING_FALLBACK_MS = 8000;
// Mic tidak dipakai di tester; dimute supaya avatar tidak menjawab suara sekitar.
const MUTED_VOICE_CHAT: VoiceChatConfig = { defaultMuted: true };

const loadHistory = (): HistoryItem[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveHistory = (items: HistoryItem[]) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch {
    /* localStorage tidak tersedia, riwayat hanya di memori */
  }
};

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-white/5 text-white text-sm border border-white/10 focus:outline-none focus:border-white/30";
const buttonClass =
  "px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const VoiceTester = () => {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [text, setText] = useState(SAMPLE_TEXT[DEFAULT_LANGUAGE]);
  const [speed, setSpeed] = useState<SpeechSpeed>(DEFAULT_SPEECH_SPEED);
  const [token, setToken] = useState("");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Baca ?avatar=&voice=&lang=&text= dari link galeri, lalu muat katalog.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    if (isLanguageCode(lang)) {
      setLanguage(lang);
      setText(SAMPLE_TEXT[lang]);
    }
    if (params.get("text")) setText(params.get("text")!);
    setHistory(loadHistory());

    fetch("/api/tester-catalog")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal memuat katalog");
        return data as Catalog;
      })
      .then((data) => {
        setCatalog(data);
        setAvatarId(params.get("avatar") || data.defaults.avatarId);
        setVoiceId(params.get("voice") || data.defaults.voiceId);
      })
      .catch((e: Error) => setCatalogError(e.message));
  }, []);

  const avatar = useMemo(
    () => catalog?.avatars.find((a) => a.id === avatarId),
    [catalog, avatarId],
  );
  const voiceName = useCallback(
    (id: string) => catalog?.voices.find((v) => v.id === id)?.name ?? id,
    [catalog],
  );
  const avatarName = useCallback(
    (id: string) => catalog?.avatars.find((a) => a.id === id)?.name ?? id,
    [catalog],
  );

  const changeLanguage = (lang: LanguageCode) => {
    // Ganti teks contoh hanya kalau user belum mengubahnya.
    if (text === SAMPLE_TEXT[language]) setText(SAMPLE_TEXT[lang]);
    setLanguage(lang);
  };

  const startTest = async () => {
    setStarting(true);
    setError(null);
    try {
      const res = await fetch("/api/start-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, avatarId, voiceId, speed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memulai sesi");
      setToken(data.session_token);
      const item: HistoryItem = {
        avatarId,
        voiceId,
        language,
        speed,
        liked: false,
        at: Date.now(),
      };
      setHistory((prev) => {
        const next = [
          item,
          ...prev.filter(
            (h) =>
              !(
                h.avatarId === avatarId &&
                h.voiceId === voiceId &&
                h.language === language &&
                (h.speed ?? DEFAULT_SPEECH_SPEED) === speed
              ),
          ),
        ].slice(0, 30);
        saveHistory(next);
        return next;
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setStarting(false);
    }
  };

  const toggleLike = (at: number) => {
    setHistory((prev) => {
      const next = prev.map((h) =>
        h.at === at ? { ...h, liked: !h.liked } : h,
      );
      saveHistory(next);
      return next;
    });
  };

  const loadFromHistory = (h: HistoryItem) => {
    setAvatarId(h.avatarId);
    setVoiceId(h.voiceId);
    changeLanguage(h.language);
    setSpeed(isSpeechSpeed(h.speed) ? h.speed : DEFAULT_SPEECH_SPEED);
  };

  const onDone = useCallback(() => setToken(""), []);
  const testing = !!token;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 text-white">
      <div>
        <h1 className="text-2xl font-semibold">Tes avatar &amp; voice</h1>
        <p className="text-sm text-gray-400 mt-1">
          Pilih avatar, voice, dan bahasa, lalu dengarkan avatar mengucapkan
          kalimat uji. Setiap tes memulai satu sesi singkat yang berhenti
          otomatis setelah kalimatnya selesai.
        </p>
      </div>

      {catalogError && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Katalog gagal dimuat: {catalogError}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* Form */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex flex-col gap-1">
            <label htmlFor="t-avatar" className="text-xs text-gray-400">
              Avatar
            </label>
            <select
              id="t-avatar"
              className={inputClass}
              value={avatarId}
              onChange={(e) => setAvatarId(e.target.value)}
              disabled={!catalog || testing}
            >
              {avatar === undefined && avatarId && (
                <option value={avatarId}>{avatarId}</option>
              )}
              {catalog?.avatars.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="t-voice" className="text-xs text-gray-400">
              Voice
            </label>
            <select
              id="t-voice"
              className={inputClass}
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              disabled={!catalog || testing}
            >
              {catalog && !catalog.voices.some((v) => v.id === voiceId) && (
                <option value={voiceId}>{voiceId}</option>
              )}
              {catalog?.voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.gender === "female" ? "P" : "L"})
                  {v.id === avatar?.defaultVoiceId ? " · bawaan avatar" : ""}
                </option>
              ))}
            </select>
            {avatar?.defaultVoiceId && avatar.defaultVoiceId !== voiceId && (
              <button
                className="self-start text-xs text-gray-400 underline hover:text-white"
                onClick={() => setVoiceId(avatar.defaultVoiceId!)}
                disabled={testing}
              >
                Pakai voice bawaan avatar ({voiceName(avatar.defaultVoiceId)})
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="t-lang" className="text-xs text-gray-400">
              Bahasa
            </label>
            <select
              id="t-lang"
              className={inputClass}
              value={language}
              onChange={(e) => changeLanguage(e.target.value as LanguageCode)}
              disabled={testing}
            >
              {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
                <option key={code} value={code}>
                  {LANGUAGES[code]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="t-speed" className="text-xs text-gray-400">
              Kecepatan bicara
            </label>
            <select
              id="t-speed"
              className={inputClass}
              value={speed}
              onChange={(e) => setSpeed(e.target.value as SpeechSpeed)}
              disabled={testing}
            >
              {(Object.keys(SPEECH_SPEEDS) as SpeechSpeed[]).map((s) => (
                <option key={s} value={s}>
                  {SPEECH_SPEEDS[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="t-text" className="text-xs text-gray-400">
              Kalimat uji
            </label>
            <textarea
              id="t-text"
              className={`${inputClass} min-h-[96px]`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={testing}
            />
            <p className="text-xs text-gray-500">
              Sebelum kalimat ini, avatar lebih dulu mengucapkan salam pembuka
              dari context bahasa yang dipilih.
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            className={buttonClass}
            onClick={startTest}
            disabled={!catalog || testing || starting || !text.trim()}
          >
            {starting ? "Memulai sesi…" : testing ? "Sedang dites…" : "Tes"}
          </button>
        </div>

        {/* Stage */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
            {testing ? (
              <LiveAvatarContextProvider
                sessionAccessToken={token}
                voiceChatConfig={MUTED_VOICE_CHAT}
              >
                <TesterRun text={text} onDone={onDone} />
              </LiveAvatarContextProvider>
            ) : avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar.previewUrl}
                alt={avatar.name}
                className="h-full object-contain opacity-60"
              />
            ) : (
              <span className="text-sm text-white/50">
                {catalog ? "Pilih avatar" : "Memuat katalog…"}
              </span>
            )}
          </div>

          {history.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xs text-gray-400 uppercase tracking-wider">
                Riwayat tes
              </h2>
              <ul className="flex flex-col gap-1">
                {history.map((h) => (
                  <li
                    key={h.at}
                    className="flex items-center gap-2 text-sm bg-white/5 rounded-lg px-3 py-2"
                  >
                    <button
                      className={h.liked ? "text-yellow-300" : "text-white/30"}
                      onClick={() => toggleLike(h.at)}
                      aria-label={
                        h.liked ? "Hapus tanda cocok" : "Tandai cocok"
                      }
                      title="Tandai cocok"
                    >
                      ★
                    </button>
                    <span className="flex-1 min-w-0 truncate">
                      {avatarName(h.avatarId)} · {voiceName(h.voiceId)} ·{" "}
                      {h.language.toUpperCase()} ·{" "}
                      {SPEECH_SPEEDS[h.speed ?? DEFAULT_SPEECH_SPEED]}
                    </span>
                    <button
                      className="text-xs text-gray-400 underline hover:text-white disabled:opacity-50"
                      onClick={() => loadFromHistory(h)}
                      disabled={testing}
                    >
                      Pilih lagi
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {avatar && (
        <pre className="text-xs bg-white/5 border border-white/10 rounded-lg p-3 overflow-x-auto">
          {`export const AVATAR_ID = "${avatarId}"; // ${avatar.name}\nexport const VOICE_ID = "${voiceId}"; // ${voiceName(voiceId)}`}
        </pre>
      )}
    </div>
  );
};

type Phase = "connecting" | "opening" | "speaking" | "stopping";

const PHASE_LABEL: Record<Phase, string> = {
  connecting: "Menghubungkan…",
  opening: "Salam pembuka…",
  speaking: "Mengucapkan kalimat uji…",
  stopping: "Selesai, menutup sesi…",
};

/** Satu sesi tes: salam pembuka → kalimat uji → stop otomatis. */
const TesterRun = ({ text, onDone }: { text: string; onDone: () => void }) => {
  const { sessionRef } = useLiveAvatarContext();
  const {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    attachElement,
  } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("connecting");
  const phaseRef = useRef<Phase>("connecting");
  const openingStartedRef = useRef(false);

  const go = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const speak = useCallback(() => {
    if (phaseRef.current !== "opening") return;
    go("speaking");
    try {
      sessionRef.current.repeat(text);
    } catch (e) {
      console.error("Gagal mengirim kalimat uji:", e);
      go("stopping");
      stopSession().catch(console.warn);
    }
  }, [go, sessionRef, stopSession, text]);

  useEffect(() => {
    if (sessionState === SessionState.INACTIVE)
      startSession().catch(console.error);
    if (sessionState === SessionState.DISCONNECTED) onDone();
  }, [sessionState, startSession, onDone]);

  useEffect(() => {
    if (!isStreamReady || !videoRef.current) return;
    attachElement(videoRef.current);
    if (phaseRef.current === "connecting") go("opening");
  }, [isStreamReady, attachElement, go]);

  useEffect(() => {
    const session = sessionRef.current;
    const onStart = () => {
      if (phaseRef.current === "opening") openingStartedRef.current = true;
    };
    const onEnd = () => {
      if (phaseRef.current === "opening") speak();
      else if (phaseRef.current === "speaking") {
        go("stopping");
        stopSession().catch(console.warn);
      }
    };
    session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, onStart);
    session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, onEnd);
    return () => {
      session.off(AgentEventsEnum.AVATAR_SPEAK_STARTED, onStart);
      session.off(AgentEventsEnum.AVATAR_SPEAK_ENDED, onEnd);
    };
  }, [sessionRef, speak, go, stopSession]);

  // Cadangan kalau salam pembuka tidak terdengar.
  useEffect(() => {
    if (phase !== "opening") return;
    const t = setTimeout(() => {
      if (!openingStartedRef.current) speak();
    }, OPENING_FALLBACK_MS);
    return () => clearTimeout(t);
  }, [phase, speak]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
      />
      <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 text-xs text-white/80">
        {PHASE_LABEL[phase]}
      </div>
      <button
        className="absolute bottom-3 right-3 px-4 py-2 text-sm font-medium rounded-lg bg-red-500/80 text-white hover:bg-red-500"
        onClick={() => {
          go("stopping");
          stopSession().catch(() => onDone());
        }}
      >
        Stop
      </button>
    </>
  );
};
