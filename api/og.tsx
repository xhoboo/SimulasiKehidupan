import { ImageResponse } from "@vercel/og";
import { memoriamCard, type CardPayload } from "./_card";

// Edge runtime: @vercel/og (Satori + resvg) berjalan paling andal di edge dan
// bisa mengembalikan Response gambar secara native.
export const config = { runtime: "edge" };

// base64url → JSON UTF-8. Diduplikasi dari src/lib/memoriam-share karena fungsi
// serverless dibundel terpisah dari src.
function decode(s: string): CardPayload | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    const obj = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof obj?.n === "string" && typeof obj?.a === "number") return obj as CardPayload;
    return null;
  } catch {
    return null;
  }
}

// Aset font ditelusuri & disertakan Vercel lewat pola new URL(..., import.meta.url).
// PENTING: path harus literal statis (tanpa `${var}`) agar penelusur file Vercel
// dapat mendeteksi & menyertakan aset ke bundel edge. Path dinamis membuat tak ada
// font yang ikut ter-deploy → fetch gagal → fungsi crash 500 (gambar OG kosong).
async function loadFont(url: URL): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Gagal memuat font: ${url} (${res.status})`);
  return res.arrayBuffer();
}

export default async function handler(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const payload = decode(searchParams.get("d") ?? "");

  const data: CardPayload = payload ?? {
    n: "Simulasi Kehidupan",
    a: 0,
    c: "Setiap pilihan menulis kisah hidupmu.",
    t: "Tulis kisah hidupmu sendiri",
    e: "Sebuah game simulasi kehidupan naratif.",
  };

  const [inter400, inter600, fraunces600, frauncesItalic] = await Promise.all([
    loadFont(new URL("./_fonts/inter-400.woff", import.meta.url)),
    loadFont(new URL("./_fonts/inter-600.woff", import.meta.url)),
    loadFont(new URL("./_fonts/fraunces-600.woff", import.meta.url)),
    loadFont(new URL("./_fonts/fraunces-400-italic.woff", import.meta.url)),
  ]);

  return new ImageResponse(memoriamCard(data), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: inter400, weight: 400, style: "normal" },
      { name: "Inter", data: inter600, weight: 600, style: "normal" },
      { name: "Fraunces", data: fraunces600, weight: 600, style: "normal" },
      { name: "Fraunces", data: frauncesItalic, weight: 400, style: "italic" },
    ],
    headers: {
      // Cache di CDN; preview tidak berubah untuk URL yang sama.
      "cache-control": "public, immutable, no-transform, max-age=31536000",
    },
  });
}
