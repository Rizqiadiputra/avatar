import type { LanguageCode } from "../../src/liveavatar/languages";

// Diisi dari apps/demo/.env.local (server-only, jangan pakai prefix NEXT_PUBLIC_).
export const API_KEY = process.env.LIVEAVATAR_API_KEY ?? "";
export const API_URL = "https://api.liveavatar.com";
export const AVATAR_ID = "65f9e3c9-d48b-4118-b73a-4ae2e3cbb8f0"; // June HR

// When true, we will call everything in Sandbox mode.
// Useful for integration and development.
export const IS_SANDBOX = true;

// FULL MODE Customizations
// Voice: Aida
export const VOICE_ID = "a8cfe15c-5a94-4ae2-9338-8e6ff5eccdee"; // Aida

// Context per bahasa (dibuat lewat POST /v1/contexts) supaya kalimat pembuka
// (opening_text) dan jawaban LLM langsung memakai bahasa yang dipilih.
// Daftar bahasa yang tampil di UI ada di src/liveavatar/languages.ts.
export const CONTEXT_IDS: Record<LanguageCode, string> = {
  id: "1ddc72c8-374d-44f0-a9e8-6eaef0d8fe0c", // Pengajar Data Analysis Fundamentals (ID)
  en: "b04c9d0e-c962-4704-9ee4-7e1544067fb3", // Data Analysis Fundamentals Instructor (EN)
  // Context lama (Komunikasi Efektif) masih ada di akun LiveAvatar:
  // ID 1ad3e706-a5f0-4769-aa76-f1dca0ca24dc, EN 5a9e2b9b-228a-44cc-924d-c3aee1edf2fc
};

// LITE MODE Customizations
export const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY ?? "";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
