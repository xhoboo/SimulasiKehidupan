# Menulis & Mengedit Event — Panduan Pools

Semua narasi game hidup di folder ini (`src/game/pools/*.ts`). Tiap file adalah satu
"pool" tema. Kamu bisa mengedit teks langsung dari VS Code — strukturnya sengaja dibuat
seminim mungkin boilerplate.

## Bentuk satu event

Tiap event adalah objek `LifeEvent`, dibungkus `e({ ... })` (cuma penanda tipe — tidak
mengubah apa pun). Bentuk paling umum (statis):

```ts
e({
  id: "quiet_hujan",                 // WAJIB unik di seluruh game
  category: "quiet", pool: "quiet",  // lihat daftar di bawah
  rarity: "common",
  ageMin: 16, ageMax: 32,            // jendela umur event bisa muncul
  mood: "melancholy",                // default: sekali per hidup (tak perlu flag)

  title: "Hujan yang Terlalu Lama",  // judul (boleh dihilangkan)
  prompt: "Hujan turun lebih lama dari yang seharusnya. Kamu duduk di depan jendela.",

  choices: [
    { id: "kopi", label: "Seduh sesuatu yang hangat", outcomes: [
      // Tiap outcome punya `weight`. Saat pilihan diambil, satu outcome diundi
      // sesuai bobotnya (makin besar weight makin sering keluar).
      { weight: 6, text: "Uapnya menempel di kaca. Kamu menggambar wajah, lalu menghapusnya.",
        effects: { mental: 4, happiness: 3 }, mood: "warm",
        memory: { text: "Wajah yang kamu gambar di jendela berkabut.", tag: "hujan", mood: "warm" } },
      { weight: 5, text: "Air mendidih, tapi kamu lupa menuangnya. Kopinya dingin saat kamu ingat.",
        effects: { mental: 4, happiness: 2 }, mood: "melancholy" },
    ]},
  ],
})
```

**Untuk mengedit narasi: cukup ubah teks di dalam tanda kutip `"..."`.** Tidak perlu
menyentuh kode lain.

### Bentuk dinamis (kalau teks perlu bergantung keadaan pemain)

`title`, `prompt`, dan `choices` boleh ditulis sebagai **nilai langsung** (di atas) ATAU
sebagai **fungsi `(ctx) => ...`** kalau isinya harus berubah sesuai karir/gender/keacakan:

```ts
prompt: (ctx) => karirOf(ctx.state) === "dokter"
  ? "Rapat pagi di rumah sakit soal 'efisiensi'."
  : "Pesan WhatsApp pagi dari grup kantor.",
```

- `ctx.state` — seluruh keadaan pemain (`flags`, `stats`, `relationships`, `age`, dst).
- `ctx.rand()` — angka acak 0..1 (deterministik per event/tahun), untuk variasi kalimat.
- Helper `karirOf(state)` / `kerjaCtx(state)` (dari `_helpers.ts`) menjaga latar tempat
  kerja konsisten: dokter→rumah sakit, seni→studio, lainnya→kantor. **Selalu** pakai ini
  untuk prompt/outcome berbau pekerjaan.

Pakai bentuk fungsi **hanya** kalau benar-benar perlu — 94% event cukup pakai string.

## Field event (LifeEvent)

| Field | Arti |
|---|---|
| `id` | Pengenal unik. Jangan ganti id event lama (memutus continuity/seenEvents). |
| `category` | `keluarga` `sekolah` `pertemanan` `cinta` `pekerjaan` `internet` `eksistensial` `absurd` `tragedi` `nostalgia` `penyakit` `kehilangan` `mimpi` `sukses_kosong` `random` `quiet` `regret`. Mewarnai pengelompokan; tidak lagi dipakai untuk mencocokkan kenangan callback. |
| `pool` | `age` `emotion` `relationship` `economic` `trauma` `rare` `satirical` `quiet` `callback` `regret` `filler` `death`. Hanya `quiet`/`filler` yang bisa jadi event sekunder (beat kedua di tahun yang sama). |
| `forceCallbackTag` | Tampilkan kotak "Sebuah Kenangan Kembali" berisi kenangan **terbaru** bertag ini saat event muncul. Satu-satunya cara memunculkan kotak itu. Pakai pada event callback yang naskahnya secara eksplisit menyambung momen lampau; pastikan ada event lebih awal yang dijamin menulis kenangan bertag sama (kalau tidak ada, kotaknya diam). |
| `rarity` | `common` `uncommon` `rare` `veryRare` `legendary` `existential` — makin langka makin jarang muncul. |
| `ageMin` / `ageMax` | Jendela umur. **Wajib sesuai usia narasinya** (jangan narasi dewasa di umur anak). |
| `weight` | Bobot dasar (default 1). |
| `mood` | `warm` `cold` `melancholy` `hope` `tragic` `neutral` — mewarnai latar UI. |

### Syarat kemunculan (gating / percabangan)

| Field | Event muncul hanya jika... |
|---|---|
| `requireFlag` | flag ini sudah ter-set. |
| `forbidFlag` | flag ini BELUM ter-set. |
| `requireTrait` / `forbidTrait` | pemain punya / tidak punya sifat. |
| `requireMemoryTag` | ada kenangan dengan tag tsb. |
| `requireRelationship` | ada relasi dengan id tsb. |
| `requireWealthMin` / `requireWealthMax` | rentang kekayaan. |
| `requireMentalMax` | mental di bawah ambang. |
| `requireChildAgeMin` / `requireChildAgeMax` | umur anak (= `age - flags.child_birth_age`). **Wajib** dipasang kalau narasi menyebut umur anak tertentu. |

### Pengulangan

**Setiap event muncul sekali seumur hidup** — begitu pernah muncul, ia tak pernah jadi kandidat lagi. Ini perilaku tetap, tidak ada flag untuk menonaktifkannya (tidak ada `oncePerLife`, `repeatable`, maupun `cooldown`).

| Field | Arti |
|---|---|
| `deferrable: true` | milestone "sabar": tiap tahun dalam jendelanya BISA ditunda (peluang aktif tetap `DEFER_KEEP`=0.4 di `runtime.ts`), jadi umur kemunculannya **menyebar** antar-kehidupan, bukan selalu jatuh di tahun pertama. Tahun yang ditunda diisi event/filler lain. Tahun terakhir jendela tidak pernah ditunda. **Pakai** untuk milestone lunak/quiet/filler/nostalgia agar replay tidak mengulang narasi yang sama di umur yang sama. **JANGAN** pakai untuk momen inti yang harus muncul tepat (kelahiran, kematian, kehilangan orang tua, momen menikah/punya anak). Lebih efektif kalau jendela (`ageMin`–`ageMax`) cukup lebar (≥4 tahun). |

## Field outcome

| Field | Arti |
|---|---|
| `weight` | Bobot undian (relatif terhadap outcome lain di pilihan yang sama). |
| `text` | Narasi hasil. |
| `effects` | Perubahan stat, mis. `{ mental: 4, happiness: -3 }` (di-clamp 0..100). |
| `mood` | Mood khusus outcome ini (kalau beda dari event). |
| `memory` | `{ text, tag, mood }` — menulis kenangan. Kenangan baru jadi callback kalau ada event lain yang menyebut `tag`-nya lewat `forceCallbackTag` (lihat tabel field event). |
| `flag` | Set flag jadi `true` (atau `flagValue` untuk nilai lain). `flag: "dead"` mengakhiri hidup. |
| `setAgeFlag` | Simpan umur saat ini ke sebuah flag (mis. `child_birth_age`). |
| `extraFlags` | Daftar flag tambahan untuk di-set `true`. |
| `addTrait` / `removeTrait` | Ubah sifat. |
| `addsRelationship` | Tambah relasi `{ name, role, closeness, alive, id? }`. |
| `endsRelationship` | Tandai relasi `alive:false` **tanpa** memicu duka — untuk orang yang "hadir lalu memudar". |
| `killsRelationship` | Tandai relasi mati **dan** set `ada_kehilangan` — hanya untuk kematian sungguhan (memicu event duka/penyesalan). |
| `achievement` | Tambah pencapaian. |

⚠️ **`endsRelationship` vs `killsRelationship`** — jangan tertukar. Teman yang sekadar
pindah/hilang kontak pakai `endsRelationship`. `killsRelationship` memicu rantai event
duka yang mengharapkan kematian nyata.

## Cara menambah satu percabangan baru

1. Di outcome sebuah pilihan, set penanda: `flag: "ikut_mlm"`.
2. Buat event lanjutan yang `requireFlag: "ikut_mlm"`.
3. Jalankan `npx tsx sim/branchcheck.ts` — memastikan tiap `requireFlag`/`requireRelationship`/
   `requireMemoryTag` punya penghasil, dan tiap tag kenangan bisa di-callback. Cabang
   harus 100% sound.

## Verifikasi setelah mengedit

```bash
npx tsc --noEmit -p tsconfig.app.json   # tipe & sintaks
npx tsx sim/branchcheck.ts              # integritas percabangan (statis)
npx tsx sim/run.ts                      # 15 hidup headless → sim/transcripts.json
npx tsx sim/lencheck.ts                 # menandai prompt/outcome kepanjangan (butuh run.ts dulu)
```

`sim/run.ts` memutar 15 persona berbeda dengan loop yang identik dengan `Game.tsx`
(termasuk event sekunder & seed RNG), jadi transkripnya mencerminkan permainan asli.
`analyze.ts` / `analyze2.ts` menyaring repetisi & ketidakcocokan umur dari transkrip.

## Bar kualitas naratif (ringkas)

- **Tanpa repetisi antar pool** — hindari mengulang frasa, struktur, atau angka khas
  ("nomor mati di deringan ke-N", "lebih lama dari yang kamu kira", "80%/20%").
- **Sesuai umur** — tidak ada narasi/pilihan rasa-dewasa di event anak/remaja.
- **Suara melankolis tetap utuh** — saat memperbaiki, ubah/parafrase, jangan hapus makna.
- **Deadpan** — prompt & outcome idealnya ≤3 kalimat pendek (kecuali momen kematian /
  kehilangan inti yang sengaja dibuat panjang).
