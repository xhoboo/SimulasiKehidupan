// Verifikasi lokal: render kartu In Memoriam ke PNG memakai mesin yang sama
// dengan produksi (@vercel/og → Satori + resvg). Jalankan: npx tsx scripts/test-og.mts
import { ImageResponse } from "@vercel/og";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { memoriamCard } from "../api/_card.tsx";

const font = (n: string) => readFileSync(fileURLToPath(new URL(`../api/_fonts/${n}`, import.meta.url)));

const sample = {
  n: "Raka Pratama",
  a: 74,
  c: "Dalam genggaman tangan yang puluhan tahun kamu kenal.",
  t: "Sisi Ranjang yang Sama",
  e: "Tidak ada kalimat terakhir yang perlu diucapkan — semuanya, yang penting dan yang tidak, sudah pernah kalian katakan.",
  tr: ["Empatik", "Setia", "Pekerja Keras"],
};

const img = new ImageResponse(memoriamCard(sample), {
  width: 1200,
  height: 630,
  fonts: [
    { name: "Inter", data: font("inter-400.woff"), weight: 400, style: "normal" },
    { name: "Inter", data: font("inter-600.woff"), weight: 600, style: "normal" },
    { name: "Fraunces", data: font("fraunces-600.woff"), weight: 600, style: "normal" },
    { name: "Fraunces", data: font("fraunces-400-italic.woff"), weight: 400, style: "italic" },
  ],
});

const buf = Buffer.from(await img.arrayBuffer());
const out = fileURLToPath(new URL("../og-preview-test.png", import.meta.url));
writeFileSync(out, buf);
console.log(`OK: ${out} (${buf.length} bytes)`);
