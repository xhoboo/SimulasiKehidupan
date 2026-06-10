import { LifeEvent } from "../types";
import { e } from "./_helpers";

// KEHILANGAN ORANG TUA DI USIA BERAPA PUN
//
// Kehilangan orang tua bisa terjadi kapan saja — termasuk saat pemain belum
// dewasa — dan narasinya menyesuaikan usia (balita/SD vs SMP/SMA vs dewasa muda).
// Timing "normal" (orang tua menua wajar) tetap ada di trauma.ts:
//   ortu_sakit (ibu, 35-55) & ayah_pergi (ayah, 42-68).
// Event di sini mengisi usia muda yang dulu kosong, dan dibuat LANGKA supaya
// sebagian besar kehidupan tetap kehilangan orang tua di waktu yang wajar.
//
// PENTING: rarity saja TIDAK cukup membuatnya langka. Jendelanya lebar (4-34),
// jadi peluang per-tahun yang kecil pun menumpuk jadi nyaris pasti memicu — dan
// karena forbidFlag mengunci jalur wafat-wajar (35-68) begitu salah satu memicu,
// dulu ~83% kehidupan kehilangan ortu sebelum 35 (dan keduanya jadi berdekatan).
// Karena itu tiap event diberi `lifetimeChance` (anggaran sekali-seumur-hidup,
// lihat runtime.ts): hanya sebagian kecil kehidupan yang "terpilih" mengalaminya.
//
// Setelah salah satu orang tua wafat (flag ibu_meninggal / ayah_meninggal),
// event mana pun yang menampilkan orang tua sebagai sosok hidup dipagari dengan
// forbidFlag flag tsb — jadi orang tua yang sudah pergi hanya muncul sebagai
// kenangan (memory), bukan sebagai sosok nyata. (Lihat juga gating di age.ts,
// branch.ts, trauma.ts, dan forbidFlag di filler_synthetic.ts.)
export const PARENT_LOSS_POOL: LifeEvent[] = [
  e({
    id: "kehilangan_ibu_dini", category: "kehilangan", pool: "trauma", rarity: "rare",
    ageMin: 4, ageMax: 17, forbidFlag: "ibu_meninggal", mood: "tragic",
    lifetimeChance: 0.06,
    title: "Kursi Ibu yang Kosong",
    prompt: (ctx) => {
      const a = ctx.state.age;
      if (a <= 7)
        return "Rumah penuh orang berbaju gelap, dan kamu terlalu kecil untuk paham kenapa. Yang kamu tahu hanya, ibu tidak ada, dan semua orang menangis kalau kamu menanyakannya. Kamu berhenti bertanya, tapi tetap menunggunya pulang untuk waktu yang lama.";
      if (a <= 12)
        return "Mereka menjelaskannya dengan kata-kata yang lembut dan berputar-putar, tapi kamu sudah cukup besar untuk mengerti, ibu tidak akan pulang. Kamu yang biasa dijemput, hari itu pulang sendiri, dengan tas yang terasa terlalu berat.";
      return "Di usia yang seharusnya kamu mulai melawan ibu, kamu malah harus melepasnya. Teman-temanmu mengeluh dimarahi ibu mereka, dan kamu diam. Menyimpan iri yang tidak bisa kamu ucapkan pada siapa pun.";
    },
    choices: [
      { id: "simpan", label: "Simpan satu hal miliknya", outcomes: [
        { weight: 8, text: "Sehelai kain, botol minyak kayu putih, sisir. Kamu menyimpannya di tempat yang hanya kamu yang tahu. Bertahun-tahun ia jadi satu-satunya cara memanggil wajah yang pelan-pelan memudar.", effects: { mental: -8, happiness: -6 }, mood: "tragic",
          flag: "ibu_meninggal", killsRelationship: "ibu",
          memory: { text: "Barang ibu yang kamu simpan, satu-satunya cara memanggil wajahnya.", tag: "ibu", mood: "tragic" } },
        { weight: 8, text: "Kamu memilih barang yang masih menyimpan harumnya, dan menyimpannya rapat-rapat. Suatu hari harumnya hilang, dan terasa seperti kehilangan untuk kedua kalinya.", effects: { mental: -9, happiness: -6 }, mood: "tragic",
          flag: "ibu_meninggal", killsRelationship: "ibu",
          memory: { text: "Bau ibu di kain yang akhirnya menghilang juga.", tag: "ibu", mood: "tragic" } },
      ]},
      { id: "kuat", label: "Belajar tidak menangis di depan orang", outcomes: [
        { weight: 8, text: "Kamu jadi dewasa lebih cepat. Orang memuji betapa kuatnya kamu, tidak tahu bahwa 'kuat' di usia itu hanya nama lain untuk tidak punya pilihan.", effects: { mental: -7, discipline: 4, happiness: -5 }, mood: "tragic",
          flag: "ibu_meninggal", killsRelationship: "ibu", addTrait: "introvert",
          memory: { text: "Usia saat kamu belajar menangis tanpa suara.", tag: "ibu", mood: "tragic" } },
      ]},
    ],
  }),

  e({
    id: "kehilangan_ayah_dini", category: "kehilangan", pool: "trauma", rarity: "rare",
    ageMin: 4, ageMax: 17, forbidFlag: "ayah_meninggal", mood: "tragic",
    lifetimeChance: 0.06,
    title: "Bahu yang Tidak Ada Lagi",
    prompt: (ctx) => {
      const a = ctx.state.age;
      if (a <= 7)
        return "Ayah yang biasa menggendongmu di bahunya, hari itu tidak ada, dan tidak ada lagi seterusnya. Kamu masih menunggu suara motornya tiap sore untuk waktu yang lama, sampai pelan-pelan lupa caranya menunggu.";
      if (a <= 12)
        return "Kamu cukup besar untuk tahu ayah tidak akan pulang, tapi belum cukup besar untuk menanggungnya. Hal-hal kecil yang biasa kamu tanyakan padanya kini tidak ada yang menjawab, dan kamu belajar sendiri walau sering salah.";
      return "Di usia saat kamu mulai diam-diam ingin seperti ayahmu, atau bersumpah tidak akan seperti dia, dia pergi, meninggalkan kalimat-kalimat yang tidak akan pernah selesai kalian ucapkan.";
    },
    choices: (ctx) => {
      const ibuHidup = ctx.state.relationships.some((r) => r.id === "ibu" && r.alive);
      return [
        { id: "warisi", label: "Pakai sesuatu peninggalannya", outcomes: [
          { weight: 8, text: "Jam tangannya, kemejanya yang kebesaran, caranya menyeduh kopi. Kamu mewarisi serpihan-serpihan kecil, menyusunnya jadi versi ayah yang kamu simpan sendiri.", effects: { mental: -8, happiness: -6 }, mood: "tragic" as const,
            flag: "ayah_meninggal", killsRelationship: "ayah",
            memory: { text: "Jam tangan ayah yang kamu pakai jauh sebelum muat di pergelanganmu.", tag: "ayah", mood: "tragic" as const } },
        ]},
        { id: "gantikan", label: "Diam-diam mencoba menggantikan perannya", outcomes: [
          { weight: 8, text: ibuHidup
              ? "Kamu jadi terlalu cepat bertanggung jawab. Atas ibu, atas adik, atas hal-hal yang bukan beban anak seusiamu. Tidak ada yang menyuruh, tapi kamu merasa harus. Itu menempa dan melukai sekaligus."
              : "Kamu jadi terlalu cepat bertanggung jawab. Atas adik, atas rumah yang kini tanpa keduanya, atas hal-hal yang bukan beban anak seusiamu. Tidak ada yang menyuruh, tapi kamu merasa harus. Itu menempa dan melukai sekaligus.", effects: { mental: -7, discipline: 5, happiness: -5 }, mood: "tragic" as const,
            flag: "ayah_meninggal", killsRelationship: "ayah", addTrait: "ambitious",
            memory: { text: "Usia saat kamu memutuskan harus jadi yang kuat di rumah.", tag: "ayah", mood: "tragic" as const } },
        ]},
      ];
    },
  }),

  e({
    id: "menjadi_yatim_piatu", category: "kehilangan", pool: "trauma", rarity: "rare",
    ageMin: 5, ageMax: 80, guaranteed: true,
    requireAllFlags: ["ibu_meninggal", "ayah_meninggal"], mood: "melancholy",
    title: "Tidak Ada Lagi di Atasmu",
    prompt: (ctx) => {
      const a = ctx.state.age;
      if (a <= 12)
        return "Sekarang kamu tinggal di rumah keluarga lain. Mereka baik, tapi kamu hafal bedanya 'disayang karena kamu anaknya', dan 'disayang karena kasihan'. Tidak ada lagi pintu yang benar-benar pintumu.";
      if (a <= 25)
        return "Libur panjang datang, dan untuk pertama kalinya kamu sadar tidak ada lagi tempat yang otomatis menampungmu. Teman-temanmu mengeluh harus mudik. Kamu diam, karena 'pulang' baru saja kehilangan alamatnya.";
      return "Suatu pagi yang biasa, kamu sadar tidak ada lagi nomor yang bisa kamu telepon hanya untuk mendengar suara yang menanyakan kabarmu tanpa alasan. Kamu yang paling tua sekarang di garis keluargamu, tidak ada lagi siapa pun di atasmu untuk menahan langit.";
    },
    choices: [
      { id: "satu_kotak", label: "Simpan satu benda dari masing-masing", outcomes: [
        { weight: 8, text: "Satu benda dari ibu, satu dari ayah, kamu simpan dalam satu kotak. Dua orang yang dulu mungkin tidak selalu akur, akhirnya berbagi tempat yang sama, di tanganmu.", effects: { mental: -5, happiness: -3 }, mood: "melancholy",
          memory: { text: "Satu kotak tempat peninggalan ibu dan ayah akhirnya berbagi tempat.", tag: "yatim_piatu", mood: "melancholy" } },
      ]},
      { id: "bawa", label: "Bawa keduanya dalam diam, lanjutkan hidup", outcomes: [
        { weight: 8, text: "Kamu belajar membawa keduanya seperti orang membawa bekal. Tidak setiap saat dibuka, tapi selalu ada. Sebagian dari mereka kini hidup lewat caramu menyetir, memasak, memaafkan.", effects: { mental: -3, happiness: -2, discipline: 2 }, mood: "melancholy",
          memory: { text: "Cara orang tuamu yang diam-diam hidup lewat kebiasaan kecilmu.", tag: "yatim_piatu", mood: "melancholy" } },
      ]},
      { id: "sendiri", label: "Akui bahwa kini tidak ada lagi yang di atasmu", outcomes: [
        { weight: 8, text: "Tidak ada lagi yang mengingatmu ketika bayi, tidak ada yang menyimpan versi paling awal dirimu. Kamu jadi satu-satunya penjaga kenanganmu sendiri, dan itu sunyi dengan cara yang sulit kamu jelaskan ke siapa pun.", effects: { mental: -8, happiness: -4 }, mood: "tragic",
          memory: { text: "Sadar kamu kini satu-satunya yang menyimpan versi paling awal dirimu.", tag: "yatim_piatu", mood: "tragic" } },
      ]},
    ],
  }),

  e({
    id: "kehilangan_ibu_muda", category: "kehilangan", pool: "trauma", rarity: "uncommon",
    ageMin: 18, ageMax: 34, forbidFlag: "ibu_meninggal", mood: "tragic",
    lifetimeChance: 0.08,
    title: "Sebelum Sempat Membalas",
    prompt: "Kepergiannya datang sebelum kamu sempat menjadi orang yang bisa membalas semuanya. Belum sempat membelikan apa pun yang berarti, belum sempat berkata cukup. Telepon yang dulu kamu anggap mengganggu sekarang menjadi hal yang paling kamu rindukan.",
    choices: [
      { id: "pulang", label: "Pulang, mencoba kuat", outcomes: [
        { weight: 8, text: "Kamu yang mengurus semua, kuat di depan kerabat, hancur di kamar mandi. Di rumah yang masih berbau masakannya, kamu mengerti untuk pertama kali bahwa dewasa artinya kehilangan dan tetap harus berdiri.", effects: { mental: -9, happiness: -8, discipline: 3 }, mood: "tragic",
          flag: "ibu_meninggal", killsRelationship: "ibu",
          memory: { text: "Rumah yang masih berbau masakan ibu, setelah semuanya selesai.", tag: "ibu", mood: "tragic" } },
      ]},
      { id: "menyesal", label: "Terjebak pada penyesalan", outcomes: [
        { weight: 8, text: "Yang paling menyiksa bukan kehilangannya, tapi kalimat 'nanti aku telepon balik' yang tidak pernah kamu tepati. Penyesalan itu menetap, dan kamu belajar hidup di sebelahnya.", effects: { mental: -11, happiness: -7 }, mood: "tragic",
          flag: "ibu_meninggal", killsRelationship: "ibu", extraFlags: ["regret_ibu", "regret_ibu_telepon"],
          memory: { text: "'Nanti aku telepon balik' yang tidak pernah sempat.", tag: "ibu", mood: "tragic" } },
      ]},
    ],
  }),

  e({
    id: "kehilangan_ayah_muda", category: "kehilangan", pool: "trauma", rarity: "uncommon",
    ageMin: 18, ageMax: 34, forbidFlag: "ayah_meninggal", mood: "tragic",
    lifetimeChance: 0.08,
    title: "Percakapan yang Tertunda Selamanya",
    prompt: "Kalian dari jenis yang sama, tidak pandai bicara. Selalu menunda percakapan penting. Waktunya tidak pernah datang. Dia pergi membawa setengah dari percakapan yang belum sempat kalian mulai.",
    choices: (ctx) => {
      const ibuHidup = ctx.state.relationships.some((r) => r.id === "ibu" && r.alive);
      return [
        { id: "pulang", label: "Pulang, jadi tiang untuk yang tersisa", outcomes: [
          { weight: 8, text: ibuHidup
              ? "Kamu yang menyalami tamu, yang memastikan ibu tidak roboh. Malamnya, sendirian, baru kamu izinkan diri jadi anak yang kehilangan ayah."
              : "Kamu yang menyalami tamu, yang menahan rumah agar tidak ikut roboh. Malamnya, sendirian, baru kamu izinkan diri jadi anak yang kehilangan orang tua terakhirnya.", effects: { mental: -9, happiness: -8, discipline: 3 }, mood: "tragic" as const,
            flag: "ayah_meninggal", killsRelationship: "ayah",
            memory: { text: "Malam setelah pemakaman, saat kamu akhirnya boleh jadi anak yang berduka.", tag: "ayah", mood: "tragic" as const } },
        ]},
        { id: "diam", label: "Bicara pada kursinya yang kosong", outcomes: [
          { weight: 8, text: "Kamu mengucapkan semua yang tidak sempat, ke ruangan kosong, ke kursi yang masih cekung bekas dirinya. Tidak ada jawaban. Tapi kamu butuh mengucapkannya, untuk dirimu sendiri.", effects: { mental: -10, happiness: -7 }, mood: "tragic" as const,
            flag: "ayah_meninggal", killsRelationship: "ayah",
            memory: { text: "Hal-hal yang akhirnya kamu ucapkan pada kursi ayah yang kosong.", tag: "ayah", mood: "tragic" as const } },
        ]},
      ];
    },
  }),
];
