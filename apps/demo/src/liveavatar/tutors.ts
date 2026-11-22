import type { LanguageCode } from "./languages";
import type { TrackKey } from "./learnerProfile";

// Guru per jalur. Wajah dan suara diambil dari avatar publik LiveAvatar;
// nama tampilan dilokalkan dan gaya mengajar melekat pada gurunya.
// Foto disimpan di public/gurus supaya tidak bergantung pada CDN LiveAvatar.
export type Tutor = {
  key: string;
  track: TrackKey;
  name: string;
  style: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  image: string;
  /** Avatar publik LiveAvatar. */
  avatarId: string;
  /** Voice bawaan avatar tersebut. */
  voiceId: string;
};

export const TUTORS: Tutor[] = [
  {
    key: "arya",
    track: "profesional",
    name: "Pak Arya",
    style: { id: "Tegas & ringkas", en: "Direct & concise" },
    description: {
      id: "Langsung ke inti, tanpa basa-basi. Cocok kalau waktumu sempit.",
      en: "Straight to the point, no fluff. Great when you're short on time.",
    },
    image: "/gurus/arya.jpg",
    avatarId: "472494ca-9ca7-4ed3-abc2-4bb7f5bd3d45", // Daniel (Serious)
    voiceId: "4033082c-4549-459b-bde4-df8caceadbd6", // Daniel
  },
  {
    key: "sari",
    track: "profesional",
    name: "Bu Sari",
    style: { id: "Ramah & suportif", en: "Warm & supportive" },
    description: {
      id: "Sabar dan menyemangati. Cocok kalau kamu baru mulai.",
      en: "Patient and encouraging. Great if you're just starting out.",
    },
    image: "/gurus/sari.jpg",
    avatarId: "e1cfad6b-da74-47b8-a477-09261d3e3cc2", // Emily (Friendly)
    voiceId: "5eb4d957-d822-476f-b542-1c536e836b06", // Emily
  },
];

export const tutorsFor = (track: TrackKey | undefined) =>
  TUTORS.filter((t) => t.track === track);

export const findTutor = (key: string | undefined) =>
  TUTORS.find((t) => t.key === key);
