import { NextRequest, NextResponse } from "next/server";

// Proteksi sederhana (HTTP Basic Auth) supaya link deploy tidak bisa dipakai
// sembarang orang untuk menghabiskan kredit LiveAvatar. Aktif hanya kalau env
// DEMO_PASSWORD diisi; username bebas (atau isi DEMO_USER untuk mewajibkannya).
export function middleware(request: NextRequest) {
  const password = process.env.DEMO_PASSWORD;
  if (!password) return NextResponse.next();

  const header = request.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const sep = decoded.indexOf(":");
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      const expectedUser = process.env.DEMO_USER;
      if (pass === password && (!expectedUser || user === expectedUser)) {
        return NextResponse.next();
      }
    } catch {
      // header rusak: jatuh ke 401 di bawah
    }
  }

  return new NextResponse("Butuh password", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Guru AI Demo"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
