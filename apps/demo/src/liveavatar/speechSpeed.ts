// Pilihan kecepatan bicara avatar (Full Mode). Dikirim sebagai
// avatar_persona.voice_settings.speed saat membuat session token.
export const SPEECH_SPEEDS = {
  very_slow: "Jauh lebih lambat",
  slow: "Sedikit lebih lambat",
  normal: "Default",
  fast: "Sedikit lebih cepat",
  very_fast: "Jauh lebih cepat",
} as const;

export type SpeechSpeed = keyof typeof SPEECH_SPEEDS;

export const DEFAULT_SPEECH_SPEED: SpeechSpeed = "normal";

export const isSpeechSpeed = (value: unknown): value is SpeechSpeed =>
  typeof value === "string" && value in SPEECH_SPEEDS;

export type TtsProvider = "elevenLabs" | "cartesia" | "fish";

// Nilai speed per engine TTS. Batas yang diterima API LiveAvatar:
// elevenLabs & fish 0.8–1.2, cartesia 0.6–1.5.
export const SPEED_VALUES: Record<TtsProvider, Record<SpeechSpeed, number>> = {
  elevenLabs: {
    very_slow: 0.8,
    slow: 0.9,
    normal: 1,
    fast: 1.1,
    very_fast: 1.2,
  },
  fish: { very_slow: 0.8, slow: 0.9, normal: 1, fast: 1.1, very_fast: 1.2 },
  cartesia: {
    very_slow: 0.7,
    slow: 0.85,
    normal: 1,
    fast: 1.2,
    very_fast: 1.4,
  },
};

export const isTtsProvider = (value: unknown): value is TtsProvider =>
  typeof value === "string" && value in SPEED_VALUES;
