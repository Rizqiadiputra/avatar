"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiveAvatarSession } from "./LiveAvatarSession";
import {
  SessionInteractivityMode,
  VoiceChatConfig,
} from "@heygen/liveavatar-web-sdk";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LanguageCode,
} from "../liveavatar/languages";
import {
  DEFAULT_SPEECH_SPEED,
  SPEECH_SPEEDS,
  SpeechSpeed,
} from "../liveavatar/speechSpeed";
import {
  loadClassSettings,
  requestFullSessionToken,
  saveClassSettings,
} from "../liveavatar/classSettings";

export type SessionMode = "FULL" | "FULL_PTT" | "LITE";

export const LiveAvatarDemo = () => {
  const router = useRouter();
  const [sessionToken, setSessionToken] = useState("");
  const [mode, setMode] = useState<SessionMode>("FULL");
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [speed, setSpeed] = useState<SpeechSpeed>(DEFAULT_SPEECH_SPEED);
  const [pushToTalk, setPushToTalk] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastSavedRef = useRef<string | null>(null);

  // Muat pengaturan tersimpan, lalu simpan setiap kali berubah.
  useEffect(() => {
    const s = loadClassSettings();
    setLanguage(s.language);
    setSpeed(s.speed);
    setPushToTalk(s.pushToTalk);
    lastSavedRef.current = JSON.stringify(s);
  }, []);
  useEffect(() => {
    const next = { language, speed, pushToTalk };
    const json = JSON.stringify(next);
    // Lewati render awal dan nilai yang baru saja dimuat.
    if (lastSavedRef.current === null || lastSavedRef.current === json) return;
    lastSavedRef.current = json;
    saveClassSettings(next);
    setSaved(true);
    const t = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(t);
  }, [language, speed, pushToTalk]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [manualMode, setManualMode] = useState<SessionMode>("FULL");

  const handleStartFullSession = async (pushToTalk: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      setSessionToken(
        await requestFullSessionToken({ pushToTalk, language, speed }),
      );
      setMode(pushToTalk ? "FULL_PTT" : "FULL");
    } catch (error: unknown) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLiteSession = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/start-lite-session", {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        setError(error.error);
        return;
      }
      const { session_token } = await res.json();
      setSessionToken(session_token);
      setMode("LITE");
    } catch (error: unknown) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartWithToken = () => {
    const trimmed = manualToken.trim();
    if (!trimmed) {
      setError("Please enter a session token.");
      return;
    }
    setSessionToken(trimmed);
    setMode(manualMode);
  };

  const onSessionStopped = () => {
    setSessionToken("");
    setManualToken("");
  };

  const voiceChatConfig = useMemo<VoiceChatConfig>(() => {
    if (mode === "FULL_PTT") {
      return {
        mode: SessionInteractivityMode.PUSH_TO_TALK,
      };
    }
    return {};
  }, [mode]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {!sessionToken ? (
        <div className="w-full max-w-lg flex flex-col items-center gap-6 p-8">
          <div className="w-full flex items-center justify-between">
            <Link
              href="/kelas"
              className="text-sm text-gray-400 underline hover:text-white"
            >
              ← Kembali ke kelas
            </Link>
            <span
              className={`text-xs text-green-400 transition-opacity ${saved ? "opacity-100" : "opacity-0"}`}
              aria-live="polite"
            >
              Tersimpan
            </span>
          </div>
          <div className="text-center mb-2">
            <h1 className="text-2xl font-semibold text-white mb-1">
              Pengaturan
            </h1>
            <p className="text-sm text-gray-400">
              Bahasa, kecepatan, dan cara bicara di bawah dipakai halaman utama.
              Tombol mode di bawahnya untuk mencoba mode lain.
            </p>
          </div>

          {error && (
            <div className="w-full px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="session-language"
              className="text-xs text-gray-400 uppercase tracking-wider"
            >
              Bahasa avatar
            </label>
            <select
              id="session-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white text-sm border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
            >
              {(Object.keys(LANGUAGES) as LanguageCode[]).map((code) => (
                <option key={code} value={code}>
                  {LANGUAGES[code]}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Berlaku untuk Full Mode: salam pembuka, materi, dan jawaban avatar
              langsung memakai bahasa ini.
            </p>
            <label
              htmlFor="session-speed"
              className="text-xs text-gray-400 uppercase tracking-wider"
            >
              Kecepatan bicara
            </label>
            <select
              id="session-speed"
              value={speed}
              onChange={(e) => setSpeed(e.target.value as SpeechSpeed)}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white text-sm border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
            >
              {(Object.keys(SPEECH_SPEEDS) as SpeechSpeed[]).map((s) => (
                <option key={s} value={s}>
                  {SPEECH_SPEEDS[s]}
                </option>
              ))}
            </select>
            <label
              htmlFor="session-ptt"
              className="text-xs text-gray-400 uppercase tracking-wider"
            >
              Cara bicara di halaman utama
            </label>
            <select
              id="session-ptt"
              value={pushToTalk ? "ptt" : "free"}
              onChange={(e) => setPushToTalk(e.target.value === "ptt")}
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white text-sm border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="free">Bicara bebas (Full Mode)</option>
              <option value="ptt">Tekan untuk bicara (Push to Talk)</option>
            </select>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => handleStartFullSession(false)}
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-lg bg-white/10 text-white font-medium text-base border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Starting..." : "Full Mode"}
            </button>
            <button
              onClick={() => handleStartFullSession(true)}
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-lg bg-white/10 text-white font-medium text-base border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Starting..." : "Full Mode (Push to Talk)"}
            </button>
            <button
              onClick={handleStartLiteSession}
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-lg bg-white/10 text-white font-medium text-base border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Starting..." : "Lite Mode"}
            </button>
            <button
              onClick={() => {
                setError(null);
                router.push("/elevenlabs-agent");
              }}
              disabled={loading}
              className="w-full px-6 py-2.5 rounded-lg bg-white/10 text-white font-medium text-base border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ElevenLabs Agent Connector →
            </button>
          </div>

          <div className="w-full flex flex-col items-center gap-3 pt-6 border-t border-white/10">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Or use an existing token
            </span>
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Paste session token"
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white text-sm border border-white/10 focus:outline-none focus:border-white/30 placeholder-gray-500 transition-colors"
            />
            <select
              value={manualMode}
              onChange={(e) => setManualMode(e.target.value as SessionMode)}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 text-white text-sm border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="FULL">Full Mode</option>
              <option value="FULL_PTT">Full Mode (Push To Talk)</option>
              <option value="LITE">Lite Mode</option>
            </select>
            <button
              onClick={handleStartWithToken}
              className="w-full px-6 py-2.5 rounded-lg bg-white/10 text-white font-medium text-base border border-white/20 hover:bg-white/20 transition-colors"
            >
              Connect
            </button>
          </div>
        </div>
      ) : (
        <LiveAvatarSession
          mode={mode}
          language={language}
          sessionAccessToken={sessionToken}
          voiceChatConfig={voiceChatConfig}
          onSessionStopped={onSessionStopped}
        />
      )}
    </div>
  );
};
