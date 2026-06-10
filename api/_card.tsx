import React from "react";

// Payload kartu In Memoriam (cermin dari MemoriamPayload di src/lib/memoriam-share).
export interface CardPayload {
  n: string;
  a: number;
  c: string;
  t: string;
  e: string;
  tr?: string[];
}

// Warna tema (selaras src/index.css): latar gelap, krem, aksen emas, muted.
const BG = "#0e0e11";
const CREAM = "#F1EDE5";
const GOLD = "#E8BB7D";
const MUTED = "#A59B8F";

// Potong teks agar muat di kanvas 1200×630 tanpa meluber.
function clamp(s: string, max: number): string {
  const t = (s ?? "").trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

// Pohon elemen kartu — murni, tanpa pemuatan font/IO, supaya bisa dirender oleh
// endpoint edge (api/og.tsx) maupun skrip uji lokal. Satori mensyaratkan setiap
// div dengan >1 anak menyetel display:flex.
export function memoriamCard(p: CardPayload) {
  const name = clamp(p.n || "Seseorang", 42);
  const cause = clamp(p.c || "", 90);
  const title = clamp(p.t || "", 70);
  const epitaph = clamp(p.e || "", 200);
  const traits = (p.tr ?? []).filter(Boolean).slice(0, 4);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: BG,
        padding: "64px 80px",
        fontFamily: "Inter",
      }}
    >
      {/* Eyebrow */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 26 }}>
        <div style={{ width: 46, height: 2, backgroundColor: GOLD }} />
        <div
          style={{
            fontSize: 20,
            letterSpacing: 8,
            color: GOLD,
            fontWeight: 600,
            marginLeft: 18,
          }}
        >
          IN MEMORIAM
        </div>
      </div>

      {/* Nama */}
      <div
        style={{
          fontSize: 74,
          fontFamily: "Fraunces",
          fontWeight: 600,
          color: CREAM,
          lineHeight: 1.04,
        }}
      >
        {name}
      </div>

      {/* Umur · sebab */}
      <div style={{ fontSize: 26, color: MUTED, marginTop: 16 }}>{`${p.a} tahun · ${cause}`}</div>

      {/* Judul batu nisan */}
      <div
        style={{
          fontSize: 38,
          fontFamily: "Fraunces",
          fontStyle: "italic",
          color: GOLD,
          marginTop: 34,
          lineHeight: 1.2,
        }}
      >
        {`“${title}”`}
      </div>

      {/* Epitaf */}
      <div
        style={{
          fontSize: 25,
          color: "rgba(241,237,229,0.82)",
          marginTop: 18,
          lineHeight: 1.5,
        }}
      >
        {epitaph}
      </div>

      {/* Sifat (opsional) */}
      {traits.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 26 }}>
          {traits.map((t) => (
            <div
              key={t}
              style={{
                fontSize: 18,
                color: MUTED,
                border: "1px solid rgba(165,155,143,0.35)",
                borderRadius: 6,
                padding: "4px 12px",
                marginRight: 10,
                marginBottom: 8,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: 28,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ fontSize: 22, fontFamily: "Fraunces", fontWeight: 600, color: CREAM }}>
          Simulasi Kehidupan
        </div>
        <div style={{ fontSize: 19, color: MUTED }}>Tulis kisah hidupmu sendiri</div>
      </div>
    </div>
  );
}
