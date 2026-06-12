import { GameState, LifeEvent, Rarity } from "../types";

// Rarity → base weight multiplier
export const RARITY_WEIGHT: Record<Rarity, number> = {
  common: 1.0,
  uncommon: 0.55,
  rare: 0.22,
  veryRare: 0.08,
  legendary: 0.025,
  existential: 0.012,
};

export const e = (ev: LifeEvent): LifeEvent => ev;

// Karir kontekstual — menjaga latar tempat kerja konsisten dengan
// jurusan/jalur yang dipilih pemain. Dokter → rumah sakit; seniman →
// studio/agensi desain; lainnya → kantor. Flag-flag ini persisten,
// jadi latar tetap sama dari tahun ke tahun (kontinuitas).
export type Karir = "dokter" | "seni" | "teknik" | "umum";

export function karirOf(state: GameState): Karir {
  const f = state.flags;
  if (f.jurusan_kedokteran || f.dokter_jadi) return "dokter";
  if (f.jurusan_seni || f.seniman_naik) return "seni";
  if (f.jurusan_teknik) return "teknik";
  return "umum";
}

// Kosakata tempat kerja sesuai jalur karir, untuk dipakai di prompt/outcome.
export interface KerjaCtx {
  karir: Karir;
  tempat: string;       // "rumah sakit" | "studio" | "kantor"
  diTempat: string;     // frasa lokatif: "di rumah sakit" | "di studio" | "di kantor"
  rekan: string;        // "tim jaga" | "tim kreatif" | "rekan kerja"
  atasan: string;       // "kepala bagian" | "creative director" | "atasan"
}

// Flag-flag jalur "mandiri" (berdiri sendiri, bukan pegawai berstruktur kantor):
// wirausaha, pedagang kaki lima, dokter praktik sendiri, atau freelancer. Dipakai
// untuk menutup event/pilihan yang mengasumsikan ada atasan/HR/rapat kantor
// (mis. promosi dari HR, "minta naik gaji ke bos"). Kalau menambah jalur mandiri
// baru, daftarkan flag-nya di sini agar semua gating ikut konsisten.
export const FLAG_MANDIRI = ["wirausaha", "pedagang_kaki_lima", "praktik_sendiri", "freelancer"] as const;

export function isMandiri(state: GameState): boolean {
  return FLAG_MANDIRI.some((flag) => state.flags[flag]);
}

export function kerjaCtx(state: GameState): KerjaCtx {
  switch (karirOf(state)) {
    case "dokter":
      return { karir: "dokter", tempat: "rumah sakit", diTempat: "di rumah sakit", rekan: "tim jaga", atasan: "kepala bagian" };
    case "seni":
      return { karir: "seni", tempat: "studio", diTempat: "di studio", rekan: "tim kreatif", atasan: "creative director" };
    default:
      return { karir: "umum", tempat: "kantor", diTempat: "di kantor", rekan: "rekan kerja", atasan: "atasan" };
  }
}
