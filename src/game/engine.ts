import { Choice, Ctx, GameState, LifeEvent, Stat, Stats, Trait } from "./types";

// Resolver konten event. Field prompt/title/choices boleh berupa nilai langsung
// (string / Choice[]) atau fungsi (ctx) => .... Helper ini membaca keduanya,
// jadi pemanggil tidak perlu tahu bentuk mana yang dipakai si penulis event.
export function evPrompt(ev: LifeEvent, ctx: Ctx): string {
  return typeof ev.prompt === "function" ? ev.prompt(ctx) : ev.prompt;
}

export function evTitle(ev: LifeEvent, ctx: Ctx): string | null {
  if (ev.title == null) return null;
  return typeof ev.title === "function" ? ev.title(ctx) : ev.title;
}

export function evChoices(ev: LifeEvent, ctx: Ctx): Choice[] {
  return typeof ev.choices === "function" ? ev.choices(ctx) : ev.choices;
}

export const STAT_LABELS: Record<Stat, string> = {
  intelligence: "Kecerdasan",
  happiness: "Kebahagiaan",
  health: "Kesehatan",
  wealth: "Kekayaan",
  social: "Sosial",
  mental: "Mental",
  discipline: "Disiplin",
  luck: "Keberuntungan",
};

export const TRAIT_LABELS: Record<Trait, string> = {
  introvert: "Introvert", extrovert: "Extrovert",
  ambitious: "Ambisius", lazy: "Pemalas",
  empathetic: "Empatik", aggressive: "Agresif",
  curious: "Penasaran", creative: "Kreatif",
  nihilistic: "Nihilis", optimistic: "Optimis",
  manipulative: "Manipulatif", romantic: "Romantis",
};

// Sifat yang ditampilkan di epilogue kematian. BUKAN diambil dari `state.traits`
// (yang hanya dipakai sebagai mekanik gating event sepanjang hidup), melainkan
// DITURUNKAN dari keadaan akhir hidup — stats, relasi — sehingga sifat yang
// tertulis di batu nisan adalah ringkasan siapa orang ini ketika ia mati,
// bukan akibat satu-dua pilihan kecil di masa kecil. Tiap sumbu menghasilkan
// paling banyak satu sifat, dan pasangan yang berlawanan tidak pernah muncul
// bersamaan karena ambangnya saling lepas. Bisa mengembalikan array kosong
// (hidup tanpa sifat yang menonjol) — pemanggil menyembunyikan bagiannya.
export function deriveTraits(s: GameState): Trait[] {
  const { stats, relationships } = s;
  const out: Trait[] = [];

  // Sosial → Introvert / Extrovert
  if (stats.social >= 66) out.push("extrovert");
  else if (stats.social <= 34) out.push("introvert");

  // Disiplin → Ambisius / Pemalas
  if (stats.discipline >= 66) out.push("ambitious");
  else if (stats.discipline <= 30) out.push("lazy");

  // Kebahagiaan + Mental → Optimis / Nihilis
  if (stats.happiness >= 64 && stats.mental >= 56) out.push("optimistic");
  else if (stats.happiness <= 34 || stats.mental <= 30) out.push("nihilistic");

  // Kecerdasan → Penasaran (yang tertib) atau Kreatif (yang lepas)
  if (stats.intelligence >= 62) {
    out.push(stats.discipline >= 55 ? "curious" : "creative");
  }

  // Mental + Sosial → Empatik; lawannya (mental & sosial rendah) → Agresif
  if (stats.mental >= 58 && stats.social >= 52) out.push("empathetic");
  else if (stats.mental <= 34 && stats.social <= 45) out.push("aggressive");

  // Relasi kekasih yang dekat + masih punya kehangatan → Romantis
  const hasLover = relationships.some((r) => r.role === "lover" && r.closeness >= 50);
  if (hasLover && stats.happiness >= 48) out.push("romantic");

  // Kaya tapi dingin dan menyendiri → Manipulatif
  if (stats.wealth >= 68 && stats.mental <= 44 && stats.social <= 50) out.push("manipulative");

  return out;
}

export function clamp(v: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, v));
}

export function applyEffects(stats: Stats, effects?: Partial<Stats>): Stats {
  if (!effects) return stats;
  const next = { ...stats };
  (Object.keys(effects) as Stat[]).forEach((k) => {
    next[k] = clamp(next[k] + (effects[k] ?? 0));
  });
  return next;
}

export function rollWeighted<T extends { weight: number }>(items: T[], rand: () => number): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = rand() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

// Simple seeded RNG (mulberry32)
export function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function newGame(name = "Kamu"): GameState {
  const seed = Math.floor(Math.random() * 2 ** 31);
  return {
    age: 0,
    alive: true,
    name,
    stats: {
      intelligence: 50, happiness: 70, health: 80, wealth: 20,
      social: 50, mental: 70, discipline: 40, luck: 50,
    },
    traits: [],
    memories: [],
    flags: {},
    relationships: [
      { id: "ibu", name: "Ibu", role: "parent", closeness: 80, alive: true },
      { id: "ayah", name: "Ayah", role: "parent", closeness: 70, alive: true },
    ],
    history: [],
    achievements: [],
    seenEvents: [],
    rngSeed: seed,
    lifeSeed: seed,
  };
}

export function ageOfDeathRoll(s: GameState, rand: () => number): boolean {
  if (!s.alive) return false;
  const a = s.age;
  // Mortality scales with age + health/mental. Hard cap at ~95.
  if (a >= 95) return true;
  const baseRisk = a < 40 ? 0.0 : a < 55 ? 0.004 : a < 70 ? 0.018 : a < 85 ? 0.07 : 0.22;
  const healthMod = (100 - s.stats.health) / 200;
  const mentalMod = s.stats.mental < 20 ? 0.04 : 0;
  const risk = baseRisk + healthMod * (a > 45 ? 0.05 : 0.005) + mentalMod;
  return rand() < risk;
}
