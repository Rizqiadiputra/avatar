import { DEFAULT_LANGUAGE, LanguageCode, isLanguageCode } from "./languages";
import {
  DEFAULT_SPEECH_SPEED,
  SpeechSpeed,
  isSpeechSpeed,
} from "./speechSpeed";

// Pengaturan kelas yang dipakai halaman utama (/). Diubah di /settings dan
// disimpan di localStorage browser ini.
export type ClassSettings = {
  language: LanguageCode;
  speed: SpeechSpeed;
  pushToTalk: boolean;
};

export const DEFAULT_CLASS_SETTINGS: ClassSettings = {
  language: DEFAULT_LANGUAGE,
  speed: DEFAULT_SPEECH_SPEED,
  pushToTalk: false,
};

const STORAGE_KEY = "class-settings";

export const loadClassSettings = (): ClassSettings => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      language: isLanguageCode(raw.language)
        ? raw.language
        : DEFAULT_CLASS_SETTINGS.language,
      speed: isSpeechSpeed(raw.speed)
        ? raw.speed
        : DEFAULT_CLASS_SETTINGS.speed,
      pushToTalk:
        typeof raw.pushToTalk === "boolean"
          ? raw.pushToTalk
          : DEFAULT_CLASS_SETTINGS.pushToTalk,
    };
  } catch {
    return DEFAULT_CLASS_SETTINGS;
  }
};

export const saveClassSettings = (settings: ClassSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* localStorage tidak tersedia; pengaturan hanya berlaku di halaman ini */
  }
};

/** Minta session token Full Mode dari server. */
export const requestFullSessionToken = async (
  settings: ClassSettings,
): Promise<string> => {
  const res = await fetch("/api/start-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Gagal memulai sesi");
  }
  return data.session_token;
};
