"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  SessionInteractivityMode,
  VoiceChatConfig,
} from "@heygen/liveavatar-web-sdk";
import { LiveAvatarSession } from "./LiveAvatarSession";
import { LANGUAGES } from "../liveavatar/languages";
import { SPEECH_SPEEDS } from "../liveavatar/speechSpeed";
import {
  ClassSettings,
  loadClassSettings,
  requestFullSessionToken,
} from "../liveavatar/classSettings";

/**
 * Halaman utama: langsung masuk kelas Full Mode dengan pengaturan dari
 * /settings. Butuh satu klik karena browser hanya mengizinkan suara avatar
 * diputar setelah ada interaksi pengguna.
 */
export const ClassroomPage = () => {
  const [settings, setSettings] = useState<ClassSettings | null>(null);
  const [sessionToken, setSessionToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSettings(loadClassSettings());
  }, []);

  const voiceChatConfig = useMemo<VoiceChatConfig>(
    () =>
      settings?.pushToTalk
        ? { mode: SessionInteractivityMode.PUSH_TO_TALK }
        : {},
    [settings?.pushToTalk],
  );

  const startClass = async () => {
    if (!settings) return;
    setLoading(true);
    setError(null);
    try {
      setSessionToken(await requestFullSessionToken(settings));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (sessionToken && settings) {
    return (
      <LiveAvatarSession
        mode={settings.pushToTalk ? "FULL_PTT" : "FULL"}
        language={settings.language}
        sessionAccessToken={sessionToken}
        voiceChatConfig={voiceChatConfig}
        onSessionStopped={() => setSessionToken("")}
      />
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-6 p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-white mb-1">
          Kelas Komunikasi Efektif
        </h1>
        <p className="text-sm text-gray-400">
          Dosen avatar akan membuka kelas, membawakan materi, lalu membuka sesi
          tanya jawab.
        </p>
      </div>

      {error && (
        <div className="w-full px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-left">
          {error}
        </div>
      )}

      <button
        onClick={startClass}
        disabled={!settings || loading}
        className="w-full px-6 py-3 rounded-lg bg-white text-zinc-900 font-semibold text-base hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Memulai kelas…" : "Mulai kelas"}
      </button>

      {settings && (
        <p className="text-xs text-gray-500">
          {LANGUAGES[settings.language]} · {SPEECH_SPEEDS[settings.speed]} ·{" "}
          {settings.pushToTalk ? "Push to talk" : "Bicara bebas"} ·{" "}
          <Link href="/settings" className="underline hover:text-white">
            Pengaturan
          </Link>
        </p>
      )}
    </div>
  );
};
