export type Stat =
  | "intelligence" | "happiness" | "health" | "wealth"
  | "social" | "mental" | "discipline" | "luck";

export type Trait =
  | "introvert" | "extrovert" | "ambitious" | "lazy"
  | "empathetic" | "aggressive" | "curious" | "creative"
  | "nihilistic" | "optimistic" | "manipulative" | "romantic";

export type Mood = "warm" | "cold" | "melancholy" | "hope" | "tragic" | "neutral";

export type Rarity =
  | "common" | "uncommon" | "rare"
  | "veryRare" | "legendary" | "existential";

export type Pool =
  | "age" | "emotion" | "relationship" | "economic"
  | "trauma" | "rare" | "satirical" | "quiet"
  | "callback" | "regret" | "filler" | "death";

export type Stats = Record<Stat, number>;

export interface Memory {
  age: number;
  text: string;
  tag: string;
  mood: Mood;
}

export interface Relationship {
  id: string;
  name: string;
  role: "parent" | "friend" | "lover" | "child" | "rival" | "mentor" | "sibling";
  closeness: number; // -100..100
  alive: boolean;
  meta?: Record<string, unknown>;
}

export interface Choice {
  id: string;
  label: string;
  // Probability outcomes: array of weighted outcomes
  outcomes: Outcome[];
}

export interface Outcome {
  weight: number;
  text: string; // narrative result
  effects?: Partial<Stats>;
  addTrait?: Trait;
  removeTrait?: Trait;
  memory?: { text: string; tag: string; mood?: Mood };
  flag?: string; // sets a flag to true (or use flagValue for custom value)
  flagValue?: boolean | number | string; // value to assign to flag (default: true)
  setAgeFlag?: string; // sets flags[setAgeFlag] = current state.age
  extraFlags?: string[]; // additional flags to set to true
  killsRelationship?: string;
  // Menandai relasi sebagai sudah tidak hadir (alive: false → tercoret di UI)
  // TANPA memicu flags.ada_kehilangan. Dipakai untuk orang yang "hadir lalu
  // memudar" (teman khayalan, teman masa kecil yang pindah, rekan yang hilang
  // kontak) — pudar, bukan mati, jadi tidak boleh memicu event duka/penyesalan.
  endsRelationship?: string;
  addsRelationship?: Omit<Relationship, "id"> & { id?: string };
  mood?: Mood;
  achievement?: string;
}

export interface LifeEvent {
  id: string;
  category:
    | "keluarga" | "sekolah" | "pertemanan" | "cinta" | "pekerjaan"
    | "internet" | "eksistensial" | "absurd" | "tragedi" | "nostalgia"
    | "penyakit" | "kehilangan" | "mimpi" | "sukses_kosong" | "random"
    | "quiet" | "regret";
  pool?: Pool;
  rarity?: Rarity;
  ageMin: number;
  ageMax: number;
  weight?: number;
  // Conditions
  requireFlag?: string;
  // Semua flag ini harus aktif (AND). Dipakai untuk syarat majemuk yang tidak bisa
  // diungkapkan satu requireFlag — mis. yatim-piatu penuh butuh ibu_meninggal DAN
  // ayah_meninggal sekaligus (lihat menjadi_yatim_piatu di parent_loss.ts).
  requireAllFlags?: string[];
  // Minimal salah satu flag ini aktif (OR). Dipakai untuk syarat yang secara konsep
  // adalah disjungsi — mis. "pemain sudah tidak serumah dengan orang tua" benar kalau
  // ia punya rumah sendiri (punya_rumah) ATAU ngekos (tinggal_kos) ATAU sudah menikah
  // (menikah). Tidak ada satu flag "sudah pindah" tunggal, jadi butuh OR (lihat
  // robot_kembali di callback.ts).
  requireAnyFlag?: string[];
  forbidFlag?: string;
  // Event tidak boleh muncul kalau SALAH SATU flag ini aktif (NOT-OR). Versi jamak
  // dari forbidFlag, untuk menutup satu beat dari beberapa cabang sekaligus — mis.
  // "Hari Pertama Kerja" kantoran tidak relevan bagi yang sudah punya jalur sendiri
  // (dokter / barista / pedagang) atau yang punya beat kuliah sendiri (filsafat /
  // psikologi). Lihat kerja_pertama di age.ts.
  forbidAnyFlag?: string[];
  requireTrait?: Trait;
  forbidTrait?: Trait;
  requireMemoryTag?: string;
  requireRelationship?: string;
  requireWealthMin?: number;
  requireWealthMax?: number;
  requireMentalMax?: number;
  requireChildAgeMin?: number; // child's age = state.age - flags.child_birth_age
  requireChildAgeMax?: number;
  // Tindak lanjut yang harus terjadi TEPAT sekian tahun setelah sebuah momen.
  // `flag` adalah flag-umur yang disimpan lewat `setAgeFlag` di outcome pemicunya;
  // selisihnya (state.age - flags[flag]) harus berada di [min, max]. Untuk "tepat N
  // tahun kemudian", pasang min == max == N (mis. kembali ke terapi 2 tahun setelah
  // berbohong — lihat br_terapi_kembali). Biasanya dipadukan dengan guaranteed: true
  // supaya event benar-benar mengambil slot di tahun yang tepat itu, bukan kalah undi.
  requireFlagAge?: { flag: string; min?: number; max?: number };
  // Anggaran peluang sekali-seumur-hidup (0..1). Berbeda dari hazard per-tahun:
  // diputuskan SEKALI di awal hidup (deterministik dari GameState.lifeSeed + id
  // event), bukan diundi ulang tiap tahun. Kalau roll-nya >= lifetimeChance, event
  // ini tidak pernah jadi kandidat sepanjang hidup itu. Dipakai untuk event yang
  // jendelanya lebar tapi harus tetap LANGKA secara agregat — tanpa ini, peluang
  // per-tahun kecil pun menumpuk jadi nyaris pasti memicu (lihat kehilangan ortu
  // dini di parent_loss.ts). Independen per-event (pakai id sebagai kunci undian).
  lifetimeChance?: number;
  // Milestone "sabar": kalau true, di tiap tahun dalam jendelanya event ini
  // BISA ditunda (probabilitas seragam atas sisa tahun) supaya umur
  // kemunculannya menyebar antar-kehidupan, bukan selalu jatuh di tahun pertama.
  // Tahun yang ditunda diisi event lain / filler. Tahun terakhir jendela pasti
  // dipertimbangkan (tidak hilang). JANGAN pakai untuk momen inti
  // (kelahiran/kematian/kehilangan orang tua) yang harus pasti muncul tepat.
  deferrable?: boolean;
  // Milestone "pasti": kalau true, event ini mengambil slot primer tahun ini
  // lebih dulu, melewati pembobotan acak — dipakai untuk momen yang HARUS muncul
  // tepat di umurnya (mis. pilih jurusan di tahun kelulusan). Sebaiknya berjendela
  // sempit (ageMin == ageMax). Kalau ada lebih dari satu yang
  // guaranteed di umur yang sama, dipilih berbobot biasa di antara mereka.
  guaranteed?: boolean;
  // Companion: event lain yang dipicu di TAHUN YANG SAMA setelah event ini selesai,
  // sebagai event sekunder, dengan peluang `chance` (0..1). Dipakai untuk memasangkan
  // dua momen yang tematiknya satu tahun (mis. malam terakhir sekolah menyertai
  // pilih jurusan di umur kelulusan). Event companion tetap harus lolos syaratnya
  // sendiri (umur, sudah-dilihat, flag).
  companionEvent?: { id: string; chance: number };
  // Companion-only: kalau true, event ini TIDAK pernah dipilih sebagai event primer
  // (pickEvent) — ia hanya bisa muncul sebagai companion event lain. Dipakai untuk
  // tindak lanjut yang teksnya mengikat ke tahun pemicunya (mis. "Tiga bulan setelah
  // PHK"), supaya tidak bocor muncul bertahun kemudian. Tetap lolos eventCandidates
  // agar bisa dipasang sebagai companion.
  companionOnly?: boolean;
  // Callback naratif yang DISENGAJA: kalau diisi, kotak "Sebuah kenangan kembali"
  // PASTI menampilkan kenangan bertag ini saat event muncul — melewati undian 18%
  // dan syarat "kenangan lama" (selisih ≥ 8 tahun) di maybeMemoryCallback. Dipakai
  // untuk event yang naskahnya secara eksplisit menyambung sebuah momen lampau (mis.
  // perpisahan teman khayalan menyambung kenangan saat ia pertama hadir), supaya
  // pemain tidak kebingungan dengan rujukan yang implisit. Kalau pemain kebetulan
  // tidak punya kenangan bertag itu, kotaknya diam (tidak menampilkan apa-apa).
  forceCallbackTag?: string;
  // Content.
  // Tiap field bisa ditulis sebagai NILAI LANGSUNG (teks/array) untuk event statis
  // — cara paling mudah diedit manual dari VS Code:
  //     prompt: "Kamu duduk di depan jendela...",
  //     choices: [ { id: "x", label: "...", outcomes: [...] } ],
  // ATAU sebagai FUNGSI `(ctx) => ...` kalau isinya perlu bergantung pada keadaan
  // pemain (karir, gender, variasi acak lewat ctx.rand):
  //     prompt: (ctx) => karirOf(ctx.state) === "dokter" ? "..." : "...",
  // Pakai resolver evPrompt/evTitle/evChoices (engine.ts) untuk membaca keduanya.
  prompt: Dynamic<string>;
  title?: Dynamic<string>;
  choices: Dynamic<Choice[]>;
  mood?: Mood;
}

export interface GameState {
  age: number;
  alive: boolean;
  pendingDeath?: boolean;
  causeOfDeath?: string;
  name: string;
  stats: Stats;
  traits: Trait[];
  memories: Memory[];
  flags: Record<string, boolean | number | string>;
  relationships: Relationship[];
  history: { age: number; eventId: string; choiceId?: string; text: string; mood: Mood }[];
  achievements: string[];
  seenEvents: string[];
  rngSeed: number;
  // Seed tetap per-kehidupan, di-set sekali di newGame dan TIDAK berubah saat
  // tickYear (berbeda dari rngSeed yang bertambah tiap tahun). Dipakai untuk
  // keputusan "sekali-seumur-hidup" yang harus stabil sepanjang hidup, mis.
  // gating lifetimeChance (lihat LifeEvent.lifetimeChance).
  lifeSeed: number;
}

export interface Ctx {
  state: GameState;
  rand: () => number;
}

// Sebuah field konten yang boleh ditulis sebagai nilai langsung (T) ATAU sebagai
// fungsi yang menghitungnya dari konteks pemain ((ctx) => T). Lihat LifeEvent.
export type Dynamic<T> = T | ((ctx: Ctx) => T);
