// Halaman "jembatan" share. Crawler (Facebook, WhatsApp, Twitter, dst.) membaca
// tag Open Graph dari HTML ini dan menampilkan preview In Memoriam personal
// (gambar dirender oleh /api/og). Pengunjung manusia dialihkan ke aplikasi lewat
// script JS — sengaja TANPA <meta http-equiv="refresh"> karena sebagian crawler
// mengikuti refresh dan mendarat di "/" (kehilangan tag OG personal). Crawler tak
// menjalankan JS, jadi mereka tetap membaca tag di sini; SPA tak bisa melakukannya.
export const config = { runtime: "edge" };

interface Payload {
  n: string;
  a: number;
  c: string;
  t: string;
  e: string;
  tr?: string[];
}

function decode(s: string): Payload | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    const obj = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof obj?.n === "string" && typeof obj?.a === "number") return obj as Payload;
    return null;
  } catch {
    return null;
  }
}

// Escape untuk konteks atribut/teks HTML agar nama/judul pemain tak merusak markup.
function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function handler(req: Request): Response {
  const url = new URL(req.url);
  const d = url.searchParams.get("d") ?? "";
  const p = decode(d);
  const origin = url.origin;

  const title = p ? `In Memoriam: ${p.n} — “${p.t}”` : "Simulasi Kehidupan";
  const description = p
    ? `${p.n}, ${p.a} tahun · ${p.c} ${p.e}`.slice(0, 200)
    : "Game simulasi kehidupan naratif di mana setiap pilihan menulis kisah hidupmu.";
  // Bila d valid, gambar OG personal; jika tidak, gambar brand statis.
  const image = p ? `${origin}/api/og?d=${encodeURIComponent(d)}` : `${origin}/og-image.png`;
  const shareUrl = `${origin}/api/m${d ? `?d=${encodeURIComponent(d)}` : ""}`;

  const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Simulasi Kehidupan" />
<meta property="og:locale" content="id_ID" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(shareUrl)}" />
<meta property="og:image" content="${esc(image)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${esc(title)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${esc(image)}" />
<link rel="canonical" href="${esc(origin)}/" />
</head>
<body style="margin:0;background:#0e0e11;color:#F1EDE5;font-family:system-ui,sans-serif">
<noscript><p style="padding:24px"><a href="/" style="color:#E8BB7D">Buka Simulasi Kehidupan</a></p></noscript>
<p style="padding:24px">Mengalihkan ke Simulasi Kehidupan… <a href="/" style="color:#E8BB7D">Klik di sini bila tidak otomatis.</a></p>
<script>location.replace("/");</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=86400",
    },
  });
}
