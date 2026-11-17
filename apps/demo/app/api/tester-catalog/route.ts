import { API_KEY, API_URL, AVATAR_ID, VOICE_ID } from "../secrets";

// Daftar avatar & voice publik untuk halaman /tester. Diambil server-side
// supaya API key tidak sampai ke browser, lalu di-cache sejam.
export const revalidate = 3600;

type Avatar = {
  id: string;
  name: string;
  preview_url: string;
  default_voice?: { id: string; name: string } | null;
};
type Voice = { id: string; name: string; gender: string };

const fetchAll = async <T>(path: string): Promise<T[]> => {
  const results: T[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(`${API_URL}${path}page=${page}&page_size=100`, {
      headers: { "X-API-KEY": API_KEY },
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`${path} gagal: HTTP ${res.status}`);
    const json = await res.json();
    const data = json.data;
    if (!data?.results?.length) break;
    results.push(...data.results);
    if (!data.next) break;
  }
  return results;
};

export async function GET() {
  try {
    const [avatars, voices] = await Promise.all([
      fetchAll<Avatar>("/v1/avatars/public?"),
      fetchAll<Voice>("/v1/voices?voice_type=public&"),
    ]);
    return Response.json({
      defaults: { avatarId: AVATAR_ID, voiceId: VOICE_ID },
      avatars: avatars
        .map((a) => ({
          id: a.id,
          name: a.name,
          previewUrl: a.preview_url,
          defaultVoiceId: a.default_voice?.id ?? null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      voices: voices
        .map((v) => ({ id: v.id, name: v.name, gender: v.gender }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
