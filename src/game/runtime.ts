import { EVENTS } from "./events";
import { DEATH_EVENTS } from "./pools";
import { applyEffects, ageOfDeathRoll, makeRng, rollWeighted } from "./engine";
import { Choice, GameState, LifeEvent, Outcome } from "./types";
import { RARITY_WEIGHT } from "./pools/_helpers";
import { syntheticFiller, texturedSyntheticVariant } from "./pools/filler_synthetic";
import { computeEnding } from "./pools/ending";

// "Garis" relasi kekasih (pacar): kekasih, kekasih2, kekasih3, ... Dipakai untuk
// (a) menaikkan kekasih jadi Pasangan saat menikah dan (b) menomori kekasih baru
// setelah putus. Cinta pertama (cinta1) dan Pasangan (pasangan) sengaja TIDAK
// termasuk: cinta pertama adalah kenangan tersendiri, pasangan adalah status
// setelah menikah. Group 1 menangkap nomornya ("" untuk kekasih pertama).
const KEKASIH_ID = /^kekasih(\d*)$/;

// Undian deterministik [0,1) dari seed kehidupan + kunci event. Hasilnya tetap
// sama sepanjang satu hidup (lifeSeed tidak berubah) tapi tersebar antar-kehidupan.
// Dipakai untuk gating lifetimeChance — keputusan "sekali seumur hidup", bukan
// hazard per-tahun yang menumpuk. (FNV-1a + final mix.)
function lifetimeRoll(seed: number, key: string): number {
  let h = (seed >>> 0) ^ 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 0x01000193) >>> 0;
  }
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d) >>> 0; h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

// Apakah tahun ini "dijadwalkan" mendapat filler_synthetic terjamin? Pada usia
// 6-59, filler_synthetic dipastikan muncul minimal sekali tiap 4 tahun, tapi
// tahun persisnya acak: jadwalnya berjangkar pada kemunculan terakhir lalu
// melangkah maju 3-4 tahun (acak per-hidup lewat lifeSeed). Jeda minimal 3 tahun
// ini disengaja agar synthetic tak pernah muncul di tahun yang berdekatan
// (mengurangi "event beruntun" — permintaan pemain). Contoh: jangkar virtual di
// usia 4 → kemunculan pertama acak di 7-8; kalau jatuh di 8 → berikutnya acak di
// 11-12; dst., sampai 59. Di luar 6-59 tidak pernah terjadwal. Deterministik per
// hidup: dua hidup berbeda mendapat jadwal berbeda, satu hidup selalu konsisten.
// Catatan: penundaan (lihat resolveScheduledSynthetic) hanya bisa MENGGESER
// kemunculan lebih lambat, jadi jarak aktual nyaris selalu ≥3 tahun.
function isSyntheticFillerYear(age: number, lifeSeed: number): boolean {
  if (age < 6 || age > 59) return false;
  let y = 4; // jangkar virtual; kemunculan pertama jatuh di 7-8
  for (let k = 0; ; k++) {
    const gap = 3 + Math.floor(lifetimeRoll(lifeSeed, `synth_gap_${k}`) * 2); // 3 atau 4
    y += gap;
    if (y === age) return true;
    if (y > age) return false; // jadwal monoton naik, sudah melewati usia ini
  }
}

function eventCandidates(state: GameState, source: LifeEvent[]): LifeEvent[] {
  const seenSet = new Set(state.seenEvents);
  const memoryTags = new Set(state.memories.map((m) => m.tag));
  const relIds = new Set(state.relationships.map((r) => r.id));

  const childBirthAge = typeof state.flags.child_birth_age === "number"
    ? (state.flags.child_birth_age as number)
    : null;

  return source.filter((ev) => {
    if (state.age < ev.ageMin || state.age > ev.ageMax) return false;
    if (ev.requireFlag && !state.flags[ev.requireFlag]) return false;
    if (ev.requireAllFlags && ev.requireAllFlags.some((f) => !state.flags[f])) return false;
    if (ev.requireAnyFlag && !ev.requireAnyFlag.some((f) => state.flags[f])) return false;
    if (ev.forbidFlag && state.flags[ev.forbidFlag]) return false;
    if (ev.forbidAnyFlag && ev.forbidAnyFlag.some((f) => state.flags[f])) return false;
    if (ev.requireTrait && !state.traits.includes(ev.requireTrait)) return false;
    if (ev.forbidTrait && state.traits.includes(ev.forbidTrait)) return false;
    if (ev.requireMemoryTag && !memoryTags.has(ev.requireMemoryTag)) return false;
    if (ev.requireRelationship && !relIds.has(ev.requireRelationship)) return false;
    if (ev.requireWealthMin !== undefined && state.stats.wealth < ev.requireWealthMin) return false;
    if (ev.requireWealthMax !== undefined && state.stats.wealth > ev.requireWealthMax) return false;
    if (ev.requireMentalMax !== undefined && state.stats.mental > ev.requireMentalMax) return false;
    // Anggaran sekali-seumur-hidup: kalau life ini "tidak terpilih" untuk event
    // langka berjendela-lebar ini, ia tak pernah jadi kandidat (lihat lifetimeChance).
    if (ev.lifetimeChance !== undefined && lifetimeRoll(state.lifeSeed, ev.id) >= ev.lifetimeChance) return false;

    // Child age conditions
    if (ev.requireChildAgeMin !== undefined || ev.requireChildAgeMax !== undefined) {
      if (childBirthAge === null) return false;
      const childAge = state.age - childBirthAge;
      if (ev.requireChildAgeMin !== undefined && childAge < ev.requireChildAgeMin) return false;
      if (ev.requireChildAgeMax !== undefined && childAge > ev.requireChildAgeMax) return false;
    }

    // "Tepat N tahun setelah" — selisih umur sejak flag-umur yang disimpan via
    // setAgeFlag (lihat LifeEvent.requireFlagAge). Kalau flag-nya belum ada / bukan
    // angka, event ini belum boleh muncul.
    if (ev.requireFlagAge) {
      const base = state.flags[ev.requireFlagAge.flag];
      if (typeof base !== "number") return false;
      const diff = state.age - base;
      if (ev.requireFlagAge.min !== undefined && diff < ev.requireFlagAge.min) return false;
      if (ev.requireFlagAge.max !== undefined && diff > ev.requireFlagAge.max) return false;
    }

    // Setiap event sekali-seumur-hidup: begitu sudah pernah muncul, tak pernah lagi.
    if (seenSet.has(ev.id)) return false;
    return true;
  });
}

// Peluang sebuah milestone `deferrable` AKTIF (dipertimbangkan) di tahun ini.
// 0.4 → rata-rata muncul ~1-2 tahun setelah memenuhi syarat, tersebar ~4 umur,
// kemunculan tetap tinggi (~90% dalam 5 tahun pertama jendela).
const DEFER_KEEP = 0.4;

export function pickEvent(state: GameState, rand: () => number): LifeEvent | null {
  // Event companionOnly tidak boleh jadi primer — hanya muncul lewat pickCompanionEvent.
  const candidates = eventCandidates(state, EVENTS).filter((c) => !c.companionOnly);
  if (candidates.length === 0) return null;

  // Milestone "pasti" (guaranteed): kalau ada event yang ditandai guaranteed dan
  // memenuhi syarat tahun ini, ia mengambil slot primer lebih dulu — melewati
  // deferral dan pembobotan acak. Dipakai untuk momen yang harus muncul tepat di
  // umurnya (mis. pilih jurusan di tahun kelulusan). Kalau kebetulan ada >1,
  // dipilih berbobot biasa di antara mereka.
  const forced = candidates.filter((c) => c.guaranteed);
  if (forced.length > 0) {
    const weighted = forced.map((c) => ({ ev: c, weight: c.weight ?? 1 }));
    return rollWeighted(weighted, rand).ev;
  }

  // Milestone "sabar" (deferrable): tahan sebagian milestone tahun ini supaya
  // umur kemunculannya menyebar, bukan selalu jatuh di tahun pertama jendela.
  // Tiap tahun event aktif dengan peluang tetap DEFER_KEEP; kalau tidak, ia
  // ditunda ke tahun berikutnya (dan tahun ini diisi event lain / filler). Pakai
  // peluang TETAP, bukan seragam-atas-jendela: banyak event tua berjendela
  // sangat lebar (mis. 68-92) padahal umur mati ~73, jadi model seragam membuat
  // event nyaris tak pernah muncul. Dengan peluang tetap, event muncul ~1-2 thn
  // setelah memenuhi syarat, tersebar ~4 umur, dengan kemunculan tetap tinggi.
  // Tahun terakhir jendela tidak pernah ditunda (yearsLeft <= 0).
  let pool = candidates;
  if (candidates.some((c) => c.deferrable)) {
    const active = candidates.filter((c) => {
      if (!c.deferrable) return true;
      const yearsLeft = c.ageMax - state.age;
      if (yearsLeft <= 0) return true;
      return rand() < DEFER_KEEP;
    });
    if (active.length === 0) return null; // semua tertunda → syntheticFiller
    pool = active;
  }

  const weighted = pool.map((c) => {
    const base = c.weight ?? 1;
    const rarityMul = c.rarity ? RARITY_WEIGHT[c.rarity] : 1;
    let personalityMul = 1;
    if (state.traits.includes("introvert") && c.pool === "satirical") personalityMul *= 0.7;
    if (state.traits.includes("nihilistic") && c.pool === "quiet") personalityMul *= 0.6;
    if (state.traits.includes("optimistic") && c.pool === "trauma") personalityMul *= 0.85;
    const isBranch =
      (c.requireFlag && c.requireFlag !== "dying") ||
      !!c.requireMemoryTag ||
      !!c.requireRelationship ||
      c.requireChildAgeMin !== undefined ||
      c.requireChildAgeMax !== undefined;
    const branchMul = isBranch ? 6 : 1;
    return { ev: c, weight: Math.max(0.001, base * rarityMul * personalityMul * branchMul) };
  });
  return rollWeighted(weighted, rand).ev;
}

// Pilih event kematian dengan prioritas event terhubung ke pilihan hidup pemain.
export function pickDeathEvent(state: GameState, rand: () => number): LifeEvent {
  const augmented: GameState = { ...state, flags: { ...state.flags, dying: true } };
  const candidates = eventCandidates(augmented, DEATH_EVENTS);
  const weighted = candidates.map((c) => {
    const specific = (c.requireFlag && c.requireFlag !== "dying") ||
                     (c.requireAnyFlag?.length ?? 0) > 0 ||
                     (c.requireAllFlags?.length ?? 0) > 0 ||
                     !!c.requireMemoryTag ||
                     c.requireWealthMin !== undefined ||
                     c.requireWealthMax !== undefined;
    const base = c.weight ?? 1;
    return { ev: c, weight: specific ? base * 8 : base };
  });
  if (weighted.length === 0) {
    return DEATH_EVENTS[DEATH_EVENTS.length - 1];
  }
  return rollWeighted(weighted, rand).ev;
}

export function applyOutcome(
  state: GameState,
  ev: LifeEvent,
  choice: Choice,
  outcome: Outcome,
  rand: () => number,
): GameState {
  const next: GameState = {
    ...state,
    stats: applyEffects(state.stats, outcome.effects),
    traits: [...state.traits],
    memories: [...state.memories],
    flags: { ...state.flags },
    relationships: state.relationships.map((r) => ({ ...r })),
    history: [...state.history, { age: state.age, eventId: ev.id, choiceId: choice.id, text: outcome.text, mood: outcome.mood ?? ev.mood ?? "neutral" }],
    achievements: [...state.achievements],
    seenEvents: state.seenEvents.includes(ev.id) ? state.seenEvents : [...state.seenEvents, ev.id],
  };

  if (outcome.addTrait && !next.traits.includes(outcome.addTrait)) next.traits.push(outcome.addTrait);
  if (outcome.removeTrait) next.traits = next.traits.filter((t) => t !== outcome.removeTrait);

  if (outcome.flag) {
    if (outcome.flag === "dead") {
      next.alive = false;
      next.pendingDeath = false;
      // causeOfDeath di-set setelah semua flag/relasi diproses (lihat akhir fungsi),
      // lewat computeEnding agar menyambung dengan epitaf di layar kematian.
    } else {
      next.flags[outcome.flag] = outcome.flagValue ?? true;
    }
  }

  // setAgeFlag: stores current age as a numeric flag (e.g. for child birth year)
  if (outcome.setAgeFlag) {
    next.flags[outcome.setAgeFlag] = state.age;
  }

  // extraFlags: additional boolean flags to set alongside the primary flag
  if (outcome.extraFlags) {
    for (const f of outcome.extraFlags) {
      next.flags[f] = true;
    }
  }

  if (outcome.memory) next.memories.push({ age: state.age, text: outcome.memory.text, tag: outcome.memory.tag, mood: outcome.memory.mood ?? "neutral" });

  if (outcome.killsRelationship) {
    next.relationships = next.relationships.map((r) => r.id === outcome.killsRelationship ? { ...r, alive: false } : r);
    // Auto-set generic loss flag used by regret events
    next.flags.ada_kehilangan = true;
  }

  // Pudar (bukan mati): coret dari daftar relasi tanpa memicu ada_kehilangan.
  if (outcome.endsRelationship) {
    next.relationships = next.relationships.map((r) => r.id === outcome.endsRelationship ? { ...r, alive: false } : r);
  }

  if (outcome.addsRelationship) {
    const add = outcome.addsRelationship;

    // Menikah: Kekasih yang masih hadir "naik status" jadi Pasangan, bukan
    // ditambah sebagai orang kedua. Jadi kekasih yang masih hidup dihapus dari
    // daftar — secara naratif ia DIGANTIKAN oleh entri Pasangan yang baru
    // ditambahkan. Mantan yang sudah dicoret (alive: false dari putus dulu)
    // dibiarkan tetap tercoret sebagai riwayat. Kalau pemain menikahi orang yang
    // baru dikenal (tanpa kekasih aktif), tidak ada yang dihapus.
    const isSpouse = add.id === "pasangan" || (add.role === "lover" && outcome.flag === "menikah");
    if (isSpouse) {
      next.relationships = next.relationships.filter(
        (r) => !(r.role === "lover" && r.alive && KEKASIH_ID.test(r.id)),
      );
    }

    let id = add.id ?? `rel_${rand().toString(36).slice(2, 8)}`;
    let name = add.name;

    // Penomoran kekasih: kalau sudah pernah ada kekasih (yang sekarang dicoret
    // karena putus), kekasih berikutnya tidak menimpa entri lama — ia diberi id
    // dan nama bernomor: Kekasih 2, Kekasih 3, dst. Tanpa ini, addsRelationship
    // dengan id "kekasih" yang sama akan ditolak diam-diam karena id sudah dipakai
    // oleh mantan yang masih tercatat.
    if (!isSpouse && add.role === "lover" && add.id && KEKASIH_ID.test(add.id)) {
      const existing = next.relationships.filter((r) => KEKASIH_ID.test(r.id));
      if (existing.length > 0) {
        const maxN = existing.reduce((m, r) => {
          const n = parseInt(r.id.match(KEKASIH_ID)![1] || "1", 10);
          return Math.max(m, n);
        }, 0);
        const nextN = maxN + 1;
        id = `kekasih${nextN}`;
        name = `Kekasih ${nextN}`;
      }
    }

    if (!next.relationships.find((r) => r.id === id)) {
      next.relationships.push({ ...add, id, name });
    }
  }

  if (outcome.achievement && !next.achievements.includes(outcome.achievement)) {
    next.achievements.push(outcome.achievement);
  }

  // Kematian: turunkan sebab dari epilog (pools/ending) setelah seluruh keadaan
  // akhir terbentuk, supaya causeOfDeath konsisten dengan title/epitaf nisan.
  if (!next.alive) {
    next.causeOfDeath = computeEnding(next).causeOfDeath;
  }

  return next;
}

// Kompresi sebaran bobot supaya outcome alternatif lebih sering muncul.
// Bobot mentah seperti 9 vs 4 (≈69/31) terasa terlalu didominasi satu hasil;
// memangkasnya dengan pangkat <1 mendekatkan peluangnya (≈62/38) tanpa harus
// menyetel ulang ratusan angka per-event. Outcome langka (mis. bobot 1 vs 9)
// tetap langka, hanya sedikit lebih mungkin muncul.
const OUTCOME_WEIGHT_EXP = 0.65;

export function rollOutcome(choice: Choice, state: GameState, rand: () => number): Outcome {
  const items = choice.outcomes.map((o) => {
    const statSum = o.effects
      ? (Object.values(o.effects) as number[]).reduce((s, v) => s + (v ?? 0), 0)
      : 0;
    const luckMod = ((state.stats.luck - 50) / 100) * (statSum >= 0 ? 1 : -1) * 0.5;
    const compressed = Math.pow(Math.max(0.0001, o.weight), OUTCOME_WEIGHT_EXP);
    return { ...o, weight: Math.max(0.05, compressed * (1 + luckMod)) };
  });
  return rollWeighted(items, rand);
}

// Naikkan umur 1 tahun. Tandai pendingDeath agar event kematian tampil lebih dulu.
export function tickYear(state: GameState): GameState {
  const next: GameState = { ...state, age: state.age + 1, rngSeed: state.rngSeed + 7919 };
  const rand = makeRng(next.rngSeed);
  if (next.age > 0 && ageOfDeathRoll(next, rand)) {
    next.pendingDeath = true;
  }
  return next;
}

// Event companion: dipasangkan oleh `primary.companionEvent` untuk muncul di tahun
// yang sama sebagai event sekunder, dengan peluang tetap (mis. malam terakhir
// sekolah menyertai pilih jurusan di umur kelulusan). Tidak dibatasi pool quiet/
// filler seperti pickSecondaryEvent, tapi tetap harus lolos syaratnya sendiri
// (umur, sudah-dilihat, flag). Mengembalikan null kalau tidak ada companion, peluang
// gagal, atau companion-nya tidak memenuhi syarat tahun ini.
export function pickCompanionEvent(
  state: GameState,
  primary: LifeEvent,
  rand: () => number,
): LifeEvent | null {
  const comp = primary.companionEvent;
  if (!comp) return null;
  if (rand() >= comp.chance) return null;
  const candidates = eventCandidates(state, EVENTS);
  return candidates.find((c) => c.id === comp.id) ?? null;
}

// Pilih event sekunder "ringan" untuk memperkaya satu tahun dengan beat tambahan.
// Peluang 30% per tahun, berlaku untuk SEMUA usia — termasuk 60+, supaya usia tua
// tetap sesekali punya teman beat (permintaan pemain: "occasional light secondary
// at 60+, whether synthetic or not"). Sumbernya pool "quiet"/"filler"; khusus 60+,
// separuh peluangnya boleh diisi varian filler_synthetic bertekstur.
//
// Catatan: filler_synthetic terjadwal di usia 6-59 TIDAK lewat sini — itu jalur
// terpisah lewat resolveScheduledSynthetic. Satu tahun dibatasi maks 2 event
// narasi: kalau sekunder ini sudah terisi di tahun terjadwal, synthetic-nya
// ditunda ke tahun berikutnya alih-alih jadi beat ketiga.
export function pickSecondaryEvent(
  state: GameState,
  primaryEventId: string,
  rand: () => number,
): LifeEvent | null {
  if (rand() > 0.30) return null;

  // 60+: separuh dari peluang itu boleh berupa filler_synthetic bertekstur.
  // (Di usia muda-paruh, synthetic sudah dijamin lewat jadwal terpisah, jadi
  //  sekunder acak di sini tetap dari quiet/filler saja agar tidak berlebihan.)
  if (state.age >= 60 && rand() < 0.5) {
    const synth = texturedSyntheticVariant(state, rand, [primaryEventId]);
    if (synth) return synth;
    // tidak ada varian bertekstur tersisa → lanjut ambil quiet/filler di bawah.
  }

  const secondaryPools = new Set<string>(["quiet", "filler"]);
  const candidates = eventCandidates(state, EVENTS).filter(
    (c) => secondaryPools.has(c.pool ?? "") && c.id !== primaryEventId,
  );
  if (candidates.length === 0) return null;
  const weighted = candidates.map((c) => ({ ev: c, weight: (c.weight ?? 0.7) }));
  return rollWeighted(weighted, rand).ev;
}

// Flag boolean di GameState yang menandai "ada filler_synthetic terjadwal yang
// tertunda" — diset saat tahun terjadwal kebetulan sudah penuh (primary + sekunder)
// sehingga synthetic-nya digeser ke tahun berikutnya.
export const SYNTH_PENDING_FLAG = "synth_pending";

// Resolusi filler_synthetic TERJADWAL untuk usia 6-59 dengan plafon maks 2 event
// per tahun + penundaan. Sebuah synthetic "jatuh tempo" tahun ini kalau usia ini
// memang terjadwal (isSyntheticFillerYear) ATAU ada synthetic tertunda dari tahun
// sebelumnya. Aturannya:
//  - Kalau tahun ini sudah punya sekunder (artinya primary + sekunder = 2 event),
//    synthetic DITUNDA ke tahun depan (pending=true), supaya satu tahun tetap maks
//    2 event narasi.
//  - Kalau belum ada sekunder, synthetic muncul sebagai event kedua (varian
//    dipilih ulang sesuai usia SAAT muncul), dan penundaan dilunasi (pending=false).
//  - Kalau tak ada varian cocok (langka di 6-59), tetap pending agar dicoba lagi.
// Mengembalikan event yang harus ditampilkan tahun ini (atau null) plus status flag
// pending yang baru untuk disimpan ke GameState.
export function resolveScheduledSynthetic(
  state: GameState,
  rand: () => number,
  hasSecondary: boolean,
  excludeIds: string[] = [],
): { event: LifeEvent | null; pending: boolean } {
  const due = isSyntheticFillerYear(state.age, state.lifeSeed)
    || state.flags[SYNTH_PENDING_FLAG] === true;
  if (!due) return { event: null, pending: false };
  if (hasSecondary) return { event: null, pending: true }; // tahun penuh → tunda
  const event = texturedSyntheticVariant(state, rand, excludeIds);
  return event ? { event, pending: false } : { event: null, pending: true };
}

// Kotak "Sebuah Kenangan Kembali" SELALU disengaja oleh event: hanya muncul
// kalau event men-set forceCallbackTag, lalu menampilkan kenangan terbaru bertag
// itu. Tidak ada lagi undian acak — dulu ada peluang 18% memunculkan kenangan lama
// (≥8 tahun) yang tematiknya cocok dengan kategori event, tapi itu membuat kotaknya
// terasa sembarangan dan sering menyandingkan kenangan yang cuma "setema" dengan
// narasi di bawahnya, bukan yang benar-benar nyambung. Sekarang tiap kotak adalah
// panggilan balik yang dikurasi: event secara eksplisit menyebut momen lampau yang
// ingin disambungnya. Kalau cabang yang dipilih pemain tidak pernah menyimpan
// kenangan bertag itu, kotaknya diam saja (return null).
export function maybeMemoryCallback(
  state: GameState,
  _rand: () => number,
  ev?: LifeEvent | null,
): string | null {
  if (!ev?.forceCallbackTag) return null;
  const tagged = state.memories.filter((m) => m.tag === ev.forceCallbackTag);
  return tagged.length > 0 ? tagged[tagged.length - 1].text : null;
}

export { syntheticFiller };
