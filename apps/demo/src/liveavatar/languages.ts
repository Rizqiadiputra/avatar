// Bahasa yang bisa dipilih sebelum sesi dimulai. Aman diimpor dari client:
// context ID per bahasa disimpan server-side di app/api/secrets.ts.
export const LANGUAGES = {
  id: "Bahasa Indonesia",
  en: "English",
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

export const DEFAULT_LANGUAGE: LanguageCode = "id";

export const isLanguageCode = (value: unknown): value is LanguageCode =>
  typeof value === "string" && value in LANGUAGES;
