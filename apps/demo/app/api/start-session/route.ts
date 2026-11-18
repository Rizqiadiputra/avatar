import { NextRequest } from "next/server";
import {
  API_KEY,
  API_URL,
  AVATAR_ID,
  VOICE_ID,
  IS_SANDBOX,
  CONTEXT_IDS,
} from "../secrets";
import {
  DEFAULT_LANGUAGE,
  isLanguageCode,
} from "../../../src/liveavatar/languages";
import {
  SPEED_VALUES,
  SpeechSpeed,
  isSpeechSpeed,
  isTtsProvider,
} from "../../../src/liveavatar/speechSpeed";

interface StartFullModeSessionRequestBody {
  pushToTalk?: boolean;
  language?: string;
  // Opsional, dipakai halaman /tester untuk mencoba avatar/voice lain.
  avatarId?: string;
  voiceId?: string;
  speed?: string;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const uuidOr = (value: unknown, fallback: string) =>
  typeof value === "string" && UUID_RE.test(value) ? value : fallback;

// voice_settings harus menyebut engine TTS-nya, dan rentang speed berbeda per
// engine. Kita pakai engine pertama yang terdaftar untuk voice tersebut.
//
// Semua voice publik LiveAvatar berbahasa asli Inggris, jadi untuk kelas
// Bahasa Indonesia kita paksa model ElevenLabs multilingual (pelafalan
// non-Inggris lebih baik daripada flash) dan sedikit turunkan similarity_boost
// supaya aksen Inggris dari voice aslinya tidak terlalu terbawa.
const ID_ELEVENLABS_SETTINGS = {
  model: "eleven_multilingual_v2",
  similarity_boost: 0.6,
};

const buildVoiceSettings = async (
  voiceId: string,
  speed: SpeechSpeed,
  language: string,
) => {
  const tuneForIndonesian = language === "id";
  if (speed === "normal" && !tuneForIndonesian) return undefined;
  const res = await fetch(`${API_URL}/v1/voices/${voiceId}`, {
    headers: { "X-API-KEY": API_KEY },
  });
  if (!res.ok) {
    throw new Error(`Gagal membaca engine voice (HTTP ${res.status})`);
  }
  const engines: unknown[] = (await res.json()).data?.voice_engines ?? [];
  const provider = engines.find(isTtsProvider);
  if (!provider) {
    if (speed === "normal") return undefined;
    throw new Error("Voice ini tidak mendukung pengaturan kecepatan");
  }
  return {
    provider,
    ...(speed !== "normal" && { speed: SPEED_VALUES[provider][speed] }),
    ...(tuneForIndonesian &&
      provider === "elevenLabs" &&
      ID_ELEVENLABS_SETTINGS),
  };
};

export async function POST(request: NextRequest) {
  let session_token = "";
  let session_id = "";
  try {
    const body: StartFullModeSessionRequestBody = await request
      .json()
      .catch(() => ({}));
    const pushToTalk = body.pushToTalk === true;
    const language = isLanguageCode(body.language)
      ? body.language
      : DEFAULT_LANGUAGE;
    const voiceId = uuidOr(body.voiceId, VOICE_ID);
    const speed = isSpeechSpeed(body.speed) ? body.speed : "normal";
    const voiceSettings = await buildVoiceSettings(voiceId, speed, language);
    const res = await fetch(`${API_URL}/v1/sessions/token`, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "FULL",
        avatar_id: uuidOr(body.avatarId, AVATAR_ID),
        avatar_persona: {
          voice_id: voiceId,
          ...(voiceSettings && { voice_settings: voiceSettings }),
          context_id: CONTEXT_IDS[language],
          language,
        },
        ...(pushToTalk && { interactivity_type: "PUSH_TO_TALK" }),
        is_sandbox: IS_SANDBOX,
      }),
    });

    if (!res.ok) {
      // Check if response is JSON before parsing
      const contentType = res.headers.get("content-type");
      let errorMessage = "Failed to retrieve session token";

      if (contentType && contentType.includes("application/json")) {
        try {
          const resp = await res.json();
          if (resp.data && resp.data.length > 0) {
            errorMessage = resp.data[0].message;
          } else if (resp.error) {
            errorMessage = resp.error;
          } else if (resp.message) {
            errorMessage = resp.message;
          }
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
      } else {
        // If it's not JSON, try to get the text
        const text = await res.text();
        console.log("Error response (text):", text);
        errorMessage = text || errorMessage;
      }

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: res.status,
      });
    }

    const data = await res.json();

    session_token = data.data.session_token;
    session_id = data.data.session_id;
  } catch (error) {
    console.error("Error retrieving session token:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }

  if (!session_token) {
    return new Response("Failed to retrieve session token", {
      status: 500,
    });
  }
  return new Response(JSON.stringify({ session_token, session_id }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
