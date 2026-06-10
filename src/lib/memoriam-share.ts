// Payload ringkas In Memoriam yang dibawa di URL share (`/api/m?d=...`).
// Hanya field yang dirender kartu OG sisi server — sengaja kecil agar URL pendek.
// Decode-nya diduplikasi di api/og dan api/m (lihat decodeMemoriam di bawah)
// karena fungsi serverless dibundel terpisah dari src oleh Vercel.
export interface MemoriamPayload {
  /** Nama pemain */
  n: string;
  /** Umur saat meninggal */
  a: number;
  /** Sebab/keadaan kematian (causeOfDeath) */
  c: string;
  /** Judul batu nisan (ending.title) */
  t: string;
  /** Epitaf */
  e: string;
  /** Label sifat (maks beberapa) */
  tr?: string[];
}

// base64url dari JSON UTF-8. Memakai TextEncoder/btoa yang tersedia di browser,
// edge runtime, maupun Node 18+ — jadi format encode & decode konsisten lintas
// lingkungan tanpa escape/unescape yang usang.
export function encodeMemoriam(p: MemoriamPayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(p));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeMemoriam(s: string): MemoriamPayload | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const obj = JSON.parse(json);
    if (typeof obj?.n === "string" && typeof obj?.a === "number") return obj as MemoriamPayload;
    return null;
  } catch {
    return null;
  }
}
