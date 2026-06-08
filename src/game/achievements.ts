// Katalog seluruh pencapaian yang bisa diraih sepanjang berbagai kehidupan, dan
// penyimpanan pencapaian yang sudah terbuka. Tidak seperti GameState.achievements
// (yang hanya berlaku untuk satu kehidupan dan ikut hilang saat memulai ulang),
// daftar terbuka di sini terkumpul lintas SELURUH kehidupan dan persisten di
// localStorage, sehingga bisa ditampilkan dari beranda.
//
import { GameState } from "./types";

// PENTING: field `name` harus sama persis dengan string `achievement` pada outcome
// di src/game/pools/* (untuk pencapaian event biasa) atau dengan nama yang dipakai
// di evaluateLifeEndAchievements (untuk pencapaian tersembunyi). Bila menambah
// pencapaian baru, tambahkan juga di sini.

export type Achievement = {
  name: string;
  hint: string;
  // Pencapaian tersembunyi: namanya tidak ditampilkan sampai diraih (muncul
  // sebagai "???" di daftar). Diberikan berdasarkan kondisi meta/akhir hidup,
  // bukan dari outcome event tertentu (lihat evaluateLifeEndAchievements).
  hidden?: boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  // — Pencapaian event (diraih dari pilihan tertentu di src/game/pools/*) —
  { name: "Lulus", hint: "Tutup satu babak pendidikan sampai selesai." },
  { name: "Pertama Kali Dibayar", hint: "Seseorang akhirnya membayar untuk karyamu." },
  { name: "Bintang 30 Hari", hint: "Terkenal sekejap, lalu dilupakan." },
  { name: "Crypto Pantun", hint: "Untung dari ide yang seharusnya tidak laku." },
  { name: "Pernah Melihat Langit", hint: "Saat semua padam, kamu menengadah." },
  { name: "Pahlawan RT", hint: "Mengurus orang banyak dengan mengorbankan tidurmu." },
  { name: "Equity Bermakna", hint: "Kaya mendadak, tapi sulit tidur." },
  { name: "Diam-diam Murah Hati", hint: "Memberi tanpa nama, tanpa plakat." },
  { name: "Cukup Berani Bertanya", hint: "Berani meminta pertolongan yang kamu butuhkan." },
  { name: "Bertahan Lebih dari yang Kamu Kira", hint: "Melewati masa paling lelah dalam hidupmu." },
  { name: "Pulang ke Diri Sendiri", hint: "Mulai duduk di kursi yang dulu kamu takuti." },
  { name: "Kembali ke Kursi Itu", hint: "Datang lagi, meski terlambat dua tahun." },
  { name: "Kembali Pulang ke Diri Sendiri", hint: "Bagian dirimu yang tertidur akhirnya dipanggil lagi." },
  { name: "Diberikan pada Bangsal", hint: "Loyalitas panjang yang akhirnya punya nama di pintu." },
  { name: "Dokter Kampung", hint: "Tempat orang datang bukan cuma untuk diperiksa." },
  { name: "Estafet Tanpa Nama", hint: "Sebuah lingkaran kecil yang menutup di generasi berikutnya." },

  // — Pencapaian tersembunyi (kondisi meta/akhir hidup) —
  { name: "Sepuluh Nyawa", hint: "Menamatkan 10 kehidupan, dari lahir sampai mati.", hidden: true },
  { name: "Lilin yang Padam Dini", hint: "Mati muda — di usia 40 tahun atau kurang.", hidden: true },
  { name: "Penghuni Abadi", hint: "Bertahan sampai usia sangat tua — 90 tahun ke atas.", hidden: true },
  { name: "Brankas yang Penuh", hint: "Mati dalam keadaan sangat kaya (kekayaan ≥ 80).", hidden: true },
  { name: "Tak Membawa Apa-apa", hint: "Mati dalam keadaan bangkrut (kekayaan ≤ 5).", hidden: true },
  { name: "Pergi dengan Senyum", hint: "Mati bahagia (kebahagiaan ≥ 95) dengan orang-orang masih di sisimu.", hidden: true },
  { name: "Pikiran yang Hancur", hint: "Mati dengan mental yang rapuh (mental ≤ 55).", hidden: true },
  { name: "Pergi Sendirian", hint: "Mati tanpa satu pun orang yang masih hadir di sisimu.", hidden: true },
  { name: "Dikelilingi Cinta", hint: "Mati dengan 4 orang atau lebih yang masih hidup di sekitarmu.", hidden: true },
  { name: "Hidup yang Sunyi", hint: "Menamatkan satu kehidupan tanpa satu pun pencapaian.", hidden: true },
];

const UNLOCKED_KEY = "jalan_hidup_achievements_v1";
const LIVES_KEY = "jalan_hidup_lives_completed_v1";

// Jumlah kehidupan yang sudah ditamatkan (dari lahir sampai mati), persisten
// lintas sesi. Dipakai untuk pencapaian berbasis jumlah hidup (mis. Sepuluh Nyawa).
export function getLivesCompleted(): number {
  try {
    const raw = localStorage.getItem(LIVES_KEY);
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

// Tambah satu kehidupan tamat dan kembalikan jumlah terbaru.
export function incrementLivesCompleted(): number {
  const next = getLivesCompleted() + 1;
  try {
    localStorage.setItem(LIVES_KEY, String(next));
  } catch {
    /* abaikan */
  }
  return next;
}

// Pencapaian yang sudah pernah diraih di kehidupan mana pun. Disaring agar hanya
// berisi nama yang masih dikenali katalog (membuang entri usang bila ada).
export function loadUnlockedAchievements(): string[] {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    const known = new Set(ACHIEVEMENTS.map((a) => a.name));
    return list.filter((n): n is string => typeof n === "string" && known.has(n));
  } catch {
    return [];
  }
}

// Gabungkan pencapaian baru ke daftar terbuka dan simpan. Mengembalikan daftar
// terbuka terbaru (gabungan), serta hanya menulis ke localStorage bila ada
// perubahan agar tidak menyentuh storage tanpa perlu.
export function recordAchievements(names: string[]): string[] {
  const current = loadUnlockedAchievements();
  const set = new Set(current);
  let changed = false;
  for (const n of names) {
    if (!set.has(n)) {
      set.add(n);
      changed = true;
    }
  }
  if (!changed) return current;
  const merged = [...set];
  try {
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(merged));
  } catch {
    /* abaikan: storage penuh / tidak tersedia */
  }
  return merged;
}

// Evaluasi pencapaian tersembunyi saat sebuah kehidupan tamat. Dipanggil tepat
// di momen kematian dengan keadaan akhir (post-mortem) dan jumlah kehidupan yang
// sudah ditamatkan (termasuk yang ini). Mengembalikan nama pencapaian yang diraih
// — caller-lah yang menyetorkannya lewat recordAchievements.
export function evaluateLifeEndAchievements(
  final: GameState,
  livesCompleted: number,
): string[] {
  const earned: string[] = [];
  const s = final.stats;
  const aliveRel = final.relationships.filter((r) => r.alive).length;

  // Ambang dikalibrasi lewat Monte Carlo "pemain buta" (pilihan acak) agar tiap
  // kondisi punya peluang ≥15% diraih minimal sekali dalam 10 hidup — rentang main
  // yang memang harus dijalani untuk "Sepuluh Nyawa". Game ini condong "feel-good"
  // (mental/kebahagiaan biasanya berakhir tinggi), jadi kondisi negatif sengaja
  // dilonggarkan dan "Pergi dengan Senyum" diperketat agar tak jadi otomatis.
  if (livesCompleted >= 10) earned.push("Sepuluh Nyawa");
  if (final.age <= 40) earned.push("Lilin yang Padam Dini");
  if (final.age >= 90) earned.push("Penghuni Abadi");
  if (s.wealth >= 80) earned.push("Brankas yang Penuh");
  if (s.wealth <= 5) earned.push("Tak Membawa Apa-apa");
  if (s.happiness >= 95 && aliveRel >= 2) earned.push("Pergi dengan Senyum");
  if (s.mental <= 55) earned.push("Pikiran yang Hancur");
  if (aliveRel === 0) earned.push("Pergi Sendirian");
  if (aliveRel >= 4) earned.push("Dikelilingi Cinta");
  if (final.achievements.length === 0) earned.push("Hidup yang Sunyi");

  return earned;
}
