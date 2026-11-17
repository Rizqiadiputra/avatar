import { ElevenLabsClient, ElevenLabsError } from "@elevenlabs/elevenlabs-js";
import { ELEVENLABS_API_KEY } from "../secrets";

// The SDK reads ELEVENLABS_API_KEY from the environment (apps/demo/.env.local).
const elevenlabs = new ElevenLabsClient();

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Default: Sarah (premade voice, works on the ElevenLabs free plan).
    // TODO: switch to Nilasari "NPDHDOOQCSyifTJZOe6J" (native Indonesian female)
    // after upgrading — library voices require a paid plan via the API.
    // Note: ElevenLabs premade voices expire on 2026-12-31.
    const { text, voice_id = "EXAVITQu4vr4xnSDxMaL" } = body;

    if (!text) {
      return json({ error: "text is required" }, 400);
    }

    if (!ELEVENLABS_API_KEY) {
      return json({ error: "ElevenLabs API key not configured" }, 500);
    }

    const data = await elevenlabs.textToSpeech.convertWithTimestamps(voice_id, {
      text,
      // Model multilingual agar pelafalan Bahasa Indonesia benar
      modelId: "eleven_multilingual_v2",
      languageCode: "id",
      outputFormat: "pcm_24000",
      // Calm delivery: steady (high stability), no added style, 10% slower.
      voiceSettings: {
        stability: 0.75,
        similarityBoost: 0.75,
        style: 0,
        speed: 0.9,
        useSpeakerBoost: true,
      },
    });

    return json({ audio: data.audioBase64 }, 200);
  } catch (error) {
    if (error instanceof ElevenLabsError) {
      console.error("ElevenLabs API error:", error.statusCode, error.body);
      return json(
        {
          error: "Failed to generate speech",
          details:
            typeof error.body === "string"
              ? error.body
              : JSON.stringify(error.body),
        },
        error.statusCode ?? 500,
      );
    }
    console.error("Error generating speech:", error);
    return json({ error: "Failed to generate speech" }, 500);
  }
}
