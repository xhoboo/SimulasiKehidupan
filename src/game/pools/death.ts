import { GameState, LifeEvent } from "../types";
import { makeRng } from "../engine";
import { e, karirOf } from "./_helpers";

// Pool kematian: dipicu hanya ketika state.flags.dying === true.
// Setiap event punya satu pilihan akhir. Outcome MENG-flag "dead" + causeOfDeath.
// Pemilihan event prioritas berdasar requireFlag/requireMemoryTag agar terhubung
// dengan pilihan-pilihan hidup pemain.

const dyingReq = { requireFlag: "dying" } as const;

// Helper untuk kematian usia muda (sekolah 13–18 & kuliah/gap year 19–24).
// Tiap band memilih antara dua narasi:
//   - "teman": berlatar sebaya/sekolah/kuliah/gap year (tidak menyebut orang tua)
//   - "ortu" : duka orang tua yang kehilangan anak, menyesuaikan siapa yang masih
//              hidup (flags ibu_meninggal / ayah_meninggal)
// Aturan: bila KEDUA orang tua sudah wafat lebih dulu → "teman" 100% (tidak ada
// orang tua yang berduka). Selain itu → 40% "teman", 60% "ortu".
// Keputusan deterministik per-kehidupan (lifeSeed) agar title/prompt/choices
// konsisten dalam satu render (bukan undian ctx.rand yang bisa berbeda tiap panggil).
function ortuStatus(s: GameState) {
  const ibu = !s.flags.ibu_meninggal;
  const ayah = !s.flags.ayah_meninggal;
  return { ibu, ayah, keduanya: ibu && ayah, ada: ibu || ayah };
}
function narasiMuda(s: GameState, salt: number): "teman" | "ortu" {
  if (!ortuStatus(s).ada) return "teman"; // kedua orang tua wafat → 100% teman
  return makeRng(s.lifeSeed + s.age * 131 + salt)() < 0.6 ? "ortu" : "teman";
}
// Subjek orang tua yang berduka, sesuai yang masih hidup.
function subjekOrtu(s: GameState): string {
  const { ibu, ayah, keduanya } = ortuStatus(s);
  if (keduanya) return "Ibu dan ayahmu";
  if (ibu) return "Ibumu";
  if (ayah) return "Ayahmu";
  return "Orang tuamu";
}
// Klausa tambahan kalau salah satu orang tua sudah lebih dulu pergi.
function dukaSendiriClause(s: GameState): string {
  const { ibu, ayah } = ortuStatus(s);
  if (ibu && !ayah) return "Ayahmu sudah lebih dulu pergi, jadi ibumu menerima kabar ini sendirian.";
  if (ayah && !ibu) return "Ibumu sudah lebih dulu pergi, jadi ayahmu menerima kabar ini sendirian.";
  return "";
}
// Apakah pemain sedang menempuh kuliah (punya flag jurusan apa pun). Dipakai di
// death_kuliah untuk membedakan narasi jalur kuliah vs jalur gap year/mencari arah.
function jalurKuliah(s: GameState): boolean {
  const f = s.flags;
  return !!(f.jurusan_kedokteran || f.jurusan_seni || f.jurusan_teknik ||
            f.jurusan_filsafat || f.jurusan_psikologi);
}

export const DEATH_POOL: LifeEvent[] = [
  e({
    id: "death_muda", category: "tragedi", pool: "trauma", rarity: "uncommon",
    ageMin: 0, ageMax: 12, mood: "tragic", weight: 8,
    ...dyingReq,
    title: "Tidak Ada Peringatan",
    prompt: "Tidak ada peringatan. Tidak ada kalimat terakhir yang dipersiapkan. Hanya hening yang dalam.",
    choices: [
      { id: "pergi", label: "...", outcomes: [
        { weight: 8, text: "Hidupmu hanya selesai di bab pertama.",
          flag: "dead", mood: "tragic" },
      ]},
    ],
  }),

  e({
    id: "death_langit", category: "eksistensial", pool: "rare", rarity: "uncommon",
    ageMin: 0, ageMax: 120, mood: "hope", weight: 8,
    ...dyingReq, requireMemoryTag: "langit",
    title: "Bintang yang Sama",
    prompt: "Kamu melihat langit-langit kamarmu, tapi ia tidak seperti langit-langit lagi. Kamu ingat malam saat listrik mati, malam di mana kamu melihat bintang sebanyak itu untuk pertama kalinya. Kamu kembali ke malam itu. Atau tidak pernah meninggalkannya?",
    choices: [
      { id: "pergi", label: "Biarkan diri menatap", outcomes: [
        { weight: 8, text: "Sesuatu yang besar menyambutmu, lebih lembut dari yang kamu takutkan.",
          flag: "dead", mood: "hope" },
      ]},
    ],
  }),

  e({
    id: "death_anak_jauh_kembali", category: "keluarga", pool: "quiet", rarity: "uncommon",
    ageMin: 0, ageMax: 120, mood: "melancholy", weight: 8,
    ...dyingReq, requireFlag: "anak_jauh", forbidFlag: "anak_meninggal",
    title: "Akhirnya Datang",
    prompt: "Anakmu datang. Kamu tidak tahu apakah dia datang karena cinta atau karena kewajiban. Tapi dia ada di sini. Kamu memilih untuk tidak bertanya.",
    choices: [
      { id: "terima", label: "Biarkan dia duduk di sebelahmu.", outcomes: [
        { weight: 8, text: "Tidak semua hal bisa diperbaiki. Tapi sebagian bisa. Cukup.",
          flag: "dead", mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "death_teman_khayalan", category: "eksistensial", pool: "rare", rarity: "uncommon",
    ageMin: 0, ageMax: 120, mood: "melancholy", weight: 8,
    ...dyingReq, requireFlag: "teman_khayalan_selesai",
    forceCallbackTag: "teman_khayalan",
    title: "Yang Pertama Kamu Ciptakan, yang Terakhir Menjemput",
    prompt: "Di ruang yang mulai mengabur, ada sosok yang sudah lama sekali tidak kamu pikirkan. Teman yang dulu hanya kamu yang bisa melihatnya, yang kursinya pernah kamu siapkan. Dia tidak terlihat tua sedikit pun.",
    choices: [
      { id: "ikut", label: "Ulurkan tangan, seperti dulu", outcomes: [
        { weight: 8, text: "Ternyata dia menunggu di tempat yang sama, untuk mengantarmu kali ini. Hal pertama yang kamu ciptakan, menjadi hal terakhir yang menemanimu. Ada simetri yang aneh dan menenangkan di situ.",
          flag: "dead", mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "death_sekolah", category: "tragedi", pool: "trauma", rarity: "uncommon",
    ageMin: 13, ageMax: 18, mood: "tragic", weight: 8,
    ...dyingReq,
    title: (ctx) => narasiMuda(ctx.state, 11) === "ortu"
      ? "Kabar yang Tidak Pernah Siap Diterima"
      : "Bangku yang Besok Kosong",
    prompt: (ctx) => {
      const s = ctx.state;
      if (narasiMuda(s, 11) === "teman") {
        return "Besok ada ulangan yang tidak akan kamu kerjakan. Ada bangku di barisan tengah yang besok pagi akan ditatap teman-temanmu dengan cara yang belum mereka mengerti.";
      }
      return `${subjekOrtu(s)} akan mengingat hal-hal kecil yang tak masuk akal untuk dikenang. Caramu pura-pura tertidur di sofa supaya digendong, suaramu memanggil dari kamar, bekas tinggi badan di kusen pintu yang berhenti bertambah. Tidak ada orang tua yang pernah menyiapkan diri untuk mengucapkan selamat tinggal pada anak yang seharusnya hidup lebih lama dari mereka.`.replace(/\s+/g, " ").trim();
    },
    choices: (ctx) => {
      if (narasiMuda(ctx.state, 11) === "teman") {
        return [{ id: "pergi", label: "Tutup mata di tengah hari yang biasa", outcomes: [
          { weight: 8, text: "Beberapa dari mereka akan mengingatmu seumur hidup. Sebagian akan lupa pelan-pelan. Dua-duanya tidak apa-apa, kamu hanya tidak sempat tahu, siapa akan jadi yang mana.",
            flag: "dead", mood: "tragic" },
        ]}];
      }
      return [{ id: "titip", label: "Titipkan maaf untuk yang kamu tinggalkan", outcomes: [
        { weight: 8, text: "Yang paling berat dari pergi terlalu cepat bukan kamu, tapi untuk mereka yang harus belajar hidup di rumah yang salah satu suaranya tiba-tiba hilang. Kamu berharap, dari tempat mana pun nanti, mereka bisa merasa kamu masih menjaga.",
          flag: "dead", mood: "tragic" },
      ]}];
    },
  }),

  e({
    id: "death_kuliah", category: "tragedi", pool: "trauma", rarity: "uncommon",
    ageMin: 19, ageMax: 24, mood: "tragic", weight: 8,
    ...dyingReq,
    title: (ctx) => {
      const s = ctx.state;
      if (narasiMuda(s, 23) === "ortu") return "Kabar yang Tidak Pernah Siap Diterima";
      return jalurKuliah(s) ? "Semester yang Tidak Akan Selesai" : "Belum Jadi Siapa-Siapa";
    },
    prompt: (ctx) => {
      const s = ctx.state;
      if (narasiMuda(s, 23) === "ortu") {
        return `${subjekOrtu(s)} masih menyimpan kebiasaan menunggumu. Menyisakan lampu teras, menanyakan kabar lewat pesan yang jarang kamu balas cepat, membayangkanmu pulang membawa cerita. Yang sampai justru kabar yang tidak pernah telinga mereka siapkan untuk dengar.`.replace(/\s+/g, " ").trim();
      }
      if (jalurKuliah(s)) {
        return "Di kamar kos yang berantakan, ada tugas yang belum selesai, draf yang baru setengah jalan, dan janji-janji 'minggu depan' pada diri sendiri. Kamu kira semester ini akan seperti semester lain. Capek, lalu lewat. Ternyata ini yang tidak akan pernah kamu selesaikan.";
      }
      return "Kamu masih di usia mencari arah. Pindah-pindah rencana, kerja serabutan, mencoba beberapa versi diri sambil belum yakin yang mana. Belum ada yang menyebutmu 'sudah jadi'. Justru di tengah pencarian itulah semuanya berhenti.";
    },
    choices: (ctx) => {
      const s = ctx.state;
      if (narasiMuda(s, 23) === "ortu") {
        return [{ id: "balas", label: "Maafkan diri atas yang belum sempat dibalas", outcomes: [
          { weight: 8, text: "Kamu pergi sebelum sempat membalas apa pun dari yang mereka tanam, dan itu, di usia ini, terasa seperti hutang yang tidak akan pernah lunas.",
            flag: "dead", mood: "tragic" },
        ]}];
      }
      if (jalurKuliah(s)) {
        return [{ id: "tutup", label: "Tutup laptop yang tugasnya tak akan selesai", outcomes: [
          { weight: 8, text: "Draf itu akan ditemukan seseorang, separuh jadi, dengan kursor berhenti di tengah kalimat. Begitu juga hidupmu, berhenti tepat saat kamu mengira masih punya banyak waktu untuk merapikannya nanti.",
            flag: "dead", mood: "tragic" },
        ]}];
      }
      return [{ id: "lepas", label: "Pergi sebelum tahu akan jadi siapa", outcomes: [
        { weight: 8, text: "Kamu tidak pernah tahu kamu akan jadi apa. Mungkin tidak ada yang tahu, seperti semua orang. Hanya saja, kebanyakan orang diberi waktu lebih lama untuk berpura-pura tahu.",
          flag: "dead", mood: "melancholy" },
      ]}];
    },
  }),

  e({
    id: "death_paruh_baya", category: "tragedi", pool: "trauma", rarity: "uncommon",
    ageMin: 25, ageMax: 54, mood: "tragic", weight: 8,
    ...dyingReq,
    title: "Di Tengah Kalimat",
    prompt: "Ini bukan usia untuk pamit. Masih ada janji di kalender, pesan yang belum dibalas, hal-hal yang kamu kira punya waktu nanti. Tubuhmu memutuskan lain, lebih cepat dari semua rencana itu.",
    choices: [
      { id: "lepas", label: "Lepaskan yang belum selesai", outcomes: [
        { weight: 8, text: "Tidak semua kalimat sempat ditutup. Hidupmu berhenti di tengah, dan dunia melanjutkannya tanpa mengetahui apa-apa tentangmu.",
          flag: "dead", mood: "tragic" },
      ]},
    ],
  }),

  e({
    id: "death_paruh_mendadak", category: "tragedi", pool: "trauma", rarity: "uncommon",
    ageMin: 25, ageMax: 54, mood: "tragic", weight: 8,
    ...dyingReq,
    title: "Tanpa Sempat Pamit",
    prompt: "Tidak ada sakit berkepanjangan, tidak ada perpisahan. Pagi tadi kamu masih membalas pesan, masih berencana makan malam. Lalu selesai. Orang-orang akan tahu lewat telepon yang tidak kamu angkat, lalu telepon kedua, lalu seseorang yang datang mengetuk.",
    choices: [
      { id: "pergi", label: "Pergi di tengah hari yang biasa", outcomes: [
        { weight: 8, text: "Ponselmu masih akan berdering beberapa kali. Notifikasi masih masuk ke akun yang pemiliknya sudah tidak ada. Butuh cukup waktu sebelum dunia menyadari bahwa salah satu detiknya sudah berhenti berdetak.",
          flag: "dead", mood: "tragic" },
      ]},
    ],
  }),

  e({
    id: "death_paruh_lelah", category: "kehilangan", pool: "quiet", rarity: "common",
    ageMin: 25, ageMax: 54, mood: "melancholy", weight: 8,
    ...dyingReq,
    title: "Mesin yang Aus Sebelum Waktunya",
    prompt: "Bukan satu hal besar yang membunuhmu, tapi penjumlahan dari banyak hal kecil. Tidur yang kurang, makan yang asal, cemas yang tak pernah reda, tahun-tahun yang kamu pinjam dari tubuhmu dan lupa kamu kembalikan. Tubuhmu mengirim tagihan terakhirnya lebih cepat dari yang seharusnya.",
    choices: [
      { id: "lepas", label: "Berhenti, akhirnya", outcomes: [
        { weight: 8, text: "Untuk pertama kalinya dalam waktu yang lama, tidak ada yang harus kamu kejar besok pagi. Lelah yang kamu tunda bertahun-tahun akhirnya kamu izinkan datang sepenuhnya, dan ternyata ia berbentuk seperti istirahat.",
          flag: "dead", mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "death_paruh_sempat", category: "kehilangan", pool: "quiet", rarity: "common",
    ageMin: 25, ageMax: 54, mood: "hope", weight: 8,
    ...dyingReq,
    title: "Singkat, Tapi Sempat",
    prompt: "Hidupmu tidak panjang. Tapi saat kamu menghitungnya, kamu sadar kamu sempat mencintai seseorang, tertawa sampai sakit perut, melihat beberapa tempat, menjadi penting bagi setidaknya satu orang. Tidak semua yang singkat berarti belum selesai.",
    choices: [
      { id: "syukur", label: "Selesai. Hitung yang sempat, bukan yang tidak", outcomes: [
        { weight: 8, text: "Ada orang yang hidup lebih lama tapi tidak sempat sebanyak ini. Kamu pergi tanpa daftar panjang soal penyesalan. Hanya rasa terima kasih yang aneh, datang justru di saat paling tidak terduga.",
          flag: "dead", mood: "hope" },
      ]},
    ],
  }),

  e({
    id: "death_terapi", category: "eksistensial", pool: "quiet", rarity: "uncommon",
    ageMin: 30, ageMax: 120, mood: "warm", weight: 8,
    ...dyingReq, requireFlag: "terapi",
    title: "Berdamai Sebelum Selesai",
    prompt: "Ada masa di mana kamu mengira tidak akan pernah berdamai dengan kepalamu sendiri. Lalu kamu mencobanya, pelan, canggung, kadang mundur. Sampai suara dalam dirimu yang dulu kejam itu belajar berbicara lebih lembut. Sekarang, suara itu tidak menyalahkanmu lagi. Untuk pertama kalinya, kamu menutup mata tanpa daftar tuduhan.",
    choices: [
      { id: "tenang", label: "Tutup mata tanpa menghakimi diri", outcomes: [
        { weight: 8, text: "Kamu pergi sebagai orang yang sudah kamu maafkan. Itu pekerjaan yang tidak terlihat dari luar, tidak ada pialanya, tapi mungkin yang paling berat yang pernah kamu menangkan.",
          flag: "dead", mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "death_ibu_regret", category: "kehilangan", pool: "trauma", rarity: "common",
    ageMin: 35, ageMax: 120, mood: "tragic", weight: 8,
    ...dyingReq, requireFlag: "regret_ibu_telepon",
    title: "Sebelum Menutup Mata",
    prompt: "Napasmu mulai pendek. Yang terakhir muncul di kepalamu bukan pencapaianmu, tapi telepon ibu yang tidak kamu jawab.",
    choices: [
      { id: "maaf", label: "Bisikkan 'maaf, bu.'", outcomes: [
        { weight: 8, text: "Tidak ada yang mendengarmu, kecuali bagian dari dirimu yang sudah lama menunggu kalimat itu. Kamu pergi dengan luka yang tidak sembuh, tapi setidaknya kamu mengakuinya.",
          flag: "dead", mood: "tragic" },
      ]},
    ],
  }),

  e({
    id: "death_bersama_pasangan", category: "keluarga", pool: "quiet", rarity: "common",
    ageMin: 35, ageMax: 120, mood: "warm", weight: 8,
    ...dyingReq, requireFlag: "menikah",
    title: (ctx) => {
      const hidup = ctx.state.relationships.find((r) => r.id === "pasangan")?.alive;
      return hidup === false ? "Menyusul ke Sisi yang Sama" : "Sisi Ranjang yang Sama";
    },
    prompt: (ctx) => {
      const hidup = ctx.state.relationships.find((r) => r.id === "pasangan")?.alive;
      if (hidup === false) {
        return "Sisi ranjang sebelah yang sudah lama kosong. Kamu membayangkan wajahnya di sisi itu, dan anehnya kamu tidak takut.";
      }
      return "Ada tangan yang sudah puluhan tahun kamu kenal lekuknya, sekarang menggenggammu dengan cara yang sama seperti dulu. Tidak ada yang perlu diucapkan. Semua kalimat, penting dan tidak, sudah pernah kalian katakan.";
    },
    choices: (ctx) => {
      const hidup = ctx.state.relationships.find((r) => r.id === "pasangan")?.alive;
      return hidup === false
        ? [{ id: "menyusul", label: "Pergi ke arah yang sudah dia tunjukkan", outcomes: [
            { weight: 8, text: "Kamu pergi ke arah yang sudah pernah ditunjukkan mereka yang berjalan lebih dulu. Kalau ada yang menunggu di sana, kamu tahu persis siapa dia.",
              flag: "dead", mood: "warm" },
          ]}]
        : [{ id: "genggam", label: "Genggam tangan itu sekali lagi", outcomes: [
            { weight: 8, text: "Genggaman itu adalah kalimat terakhir, dan kalian berdua paham artinya. Sebagian cinta memang baru terasa utuh justru di titik perpisahannya.",
              flag: "dead", mood: "warm" },
          ]}];
    },
  }),

  e({
    id: "death_sahabat_regret", category: "kehilangan", pool: "trauma", rarity: "common",
    ageMin: 40, ageMax: 120, mood: "tragic", weight: 8,
    ...dyingReq, requireFlag: "regret_sahabat",
    forceCallbackTag: "sahabat",
    title: "Kamu yang Akhirnya Menyusul",
    prompt: "Saat napasmu menipis, kamu berpikir tentang pemakaman yang tidak kamu hadiri. Kamu membayangkan dia menunggumu di tempat kalian biasa bertemu, marah, lalu memaafkan, lalu memelukmu sambil bilang 'lama amat sih'.",
    choices: [
      { id: "datang", label: "Menyusulnya dengan sedikit cemas", outcomes: [
        { weight: 8, text: "Ternyata, kalian tidak perlu ngomong apa-apa. Hanya tersenyum dan semuanya saling mengerti.", flag: "dead", mood: "tragic" },
      ]},
    ],
  }),

  e({
    id: "death_seniman", category: "sukses_kosong", pool: "rare", rarity: "uncommon",
    ageMin: 40, ageMax: 120, mood: "hope", weight: 8,
    ...dyingReq, requireAnyFlag: ["jurusan_seni", "seniman_naik"],
    title: "Yang Tertinggal Setelah Tanganmu Berhenti",
    prompt: "Tanganmu tidak akan membuat apa pun lagi. Tapi yang sudah terlanjur kamu buat akan tetap ada, jauh setelah kamu tidak ada. Seseorang, suatu hari, mungkin berhenti di depan salah satu karyamu dan merasakan hal yang tidak bisa dia jelaskan.",
    choices: [
      { id: "lepas", label: "Lepaskan, biarkan karyamu melanjutkan dirinya sendiri", outcomes: [
        { weight: 8, text: "Itu sebentuk hidup yang lebih panjang dari tubuh. Bukan kamu yang bertahan, tapi yang sempat kamu pindahkan dari dalam kepala ke luar sana. Tidak semua orang sempat meninggalkan jejak yang bisa disentuh orang asing.",
          flag: "dead", mood: "hope" },
      ]},
    ],
  }),

  e({
    id: "death_loyal_pegawai", category: "pekerjaan", pool: "regret", rarity: "common",
    ageMin: 55, ageMax: 120, mood: "melancholy", weight: 8,
    ...dyingReq, requireFlag: "loyal_pegawai",
    title: "Hafalan Sepihak",
    prompt: (ctx) => {
      const dokter = karirOf(ctx.state) === "dokter";
      const tempat = dokter ? "Bangsal" : "Kantor";
      const detail = dokter ? "nama tiap perawat, letak tiap alat" : "nada dering tiap telepon, isi tiap laci";
      return `Puluhan tahun kamu hafal tempat itu di luar kepala, ${detail}, semuanya. ${tempat} itu tidak pernah menghafal apa pun tentangmu. Penggantimu akan belajar semuanya dalam seminggu.`;
    },
    choices: [
      { id: "lepas", label: "Tutup mata. Ikhlaskan.", outcomes: [
        { weight: 8, text: "Tidak ada serah-terima, tidak ada laporan terakhir. Untuk pertama kalinya, tidak ada yang menunggu kabar darimu.",
          flag: "dead", mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "death_kaya_sepi", category: "sukses_kosong", pool: "regret", rarity: "common",
    ageMin: 55, ageMax: 120, mood: "melancholy", weight: 8,
    ...dyingReq, requireFlag: "rumah_besar",
    title: "Kamar yang Terlalu Besar",
    prompt: "Kamu meninggal di kamar yang lebih besar dari rumah masa kecilmu. Tidak ada yang memegang tanganmu. Perawat mengisi formulir di bawah. Lukisan mahal di dinding tidak menatap balik.",
    choices: [
      { id: "tutup", label: "Tutup mata", outcomes: [
        { weight: 8, text: "Yang kamu sesali bukan apa yang kamu beli, tapi apa yang kamu tukar untuk membelinya.",
          flag: "dead", mood: "tragic" },
      ]},
    ],
  }),

  e({
    id: "death_biasa", category: "kehilangan", pool: "quiet", rarity: "common",
    ageMin: 55, ageMax: 120, mood: "melancholy", weight: 8,
    ...dyingReq,
    title: "Pagi yang Biasa",
    prompt: "Pagi yang biasa. Suara jalanan yang itu-itu lagi dari balik jendela. Kamu duduk sebentar, niatnya hanya memejamkan mata sejenak. Tubuhmu terasa ringan, seperti ada beban yang akhirnya telah dilepaskan. Ruangan begitu sunyi sampai kamu bisa mendengar napasmu sendiri, melambat.",
    choices: [
      { id: "lepas", label: "Lepas", outcomes: [
        { weight: 8, text: "Tidak ada suara, tidak ada yang terburu-buru. Hanya keheningan yang pelan-pelan memenuhi ruangan, dan kamu membiarkannya. Di luar, dunia terus berjalan tanpa tahu apa-apa. Dan mungkin memang seharusnya begitu.",
          flag: "dead", mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "death_senja", category: "kehilangan", pool: "quiet", rarity: "common",
    ageMin: 55, ageMax: 120, mood: "melancholy", weight: 8,
    ...dyingReq,
    title: "Cahaya yang Berkurang Pelan",
    prompt: "Sore datang seperti sore-sore lain, hanya lebih lambat. Cahaya di dinding berkurang sedikit demi sedikit. Kamu tidak merasa sakit, hanya lelah yang dalam dan tenang. Jenis lelah yang tidak meminta apa-apa selain dibiarkan. Tidak ada lagi yang perlu kamu selesaikan.",
    choices: [
      { id: "biar", label: "Biarkan cahaya itu pergi", outcomes: [
        { weight: 8, text: "Ruangan menjadi sunyi dengan cara yang tidak menakutkan. Kamu sempat berpikir betapa anehnya seluruh hidup yang ramai itu, berakhir sepelan ini. Lalu bahkan pikiranmu pun ikut reda.",
          flag: "dead", mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "death_bersama_anak", category: "keluarga", pool: "quiet", rarity: "common",
    ageMin: 55, ageMax: 120, mood: "warm", weight: 8,
    ...dyingReq, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    title: "Tangan yang Kamu Kenal",
    prompt: "Ada tangan yang menggenggammu. Hangat, familiar. Kamu tidak perlu membuka mata untuk tahu itu anakmu. Kamu berharap dia tahu betapa besar hidupnya untukmu.",
    choices: [
      { id: "genggam", label: "Genggam lebih erat.", outcomes: [
        { weight: 8, text: "Dia mengerti. Genggaman itu lebih mudah dipahami dibanding kata-kata.",
          flag: "dead", mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "death_abai", category: "penyakit", pool: "trauma", rarity: "common",
    ageMin: 60, ageMax: 120, mood: "melancholy", weight: 8,
    ...dyingReq, requireFlag: "abai_kesehatan",
    title: "Map Kuning di Laci",
    prompt: "Hasil lab dengan angka kuning yang dulu kamu masukkan ke laci, akhirnya menepati janjinya. Bertahun-tahun ia menunggu dengan sabar.",
    choices: [
      { id: "akui", label: "Akui, dengan tenang", outcomes: [
        { weight: 8, text: "Tubuhmu memberi tahu sejak awal. Kamu hanya tidak siap mendengarkan.",
          flag: "dead", mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "death_tenang_kenangan", category: "kehilangan", pool: "quiet", rarity: "common",
    ageMin: 65, ageMax: 120, mood: "warm", weight: 8,
    ...dyingReq,
    title: "Kenangan yang Pulang Bersama",
    prompt: (ctx) => ctx.state.flags.punya_anak
      ? "Kamu berbaring di kasur yang familiar. Wajah-wajah berdatangan, tidak berurutan. Orang tuamu saat muda, sahabat yang pertama, anakmu ketika bayi, tetangga yang tertawa di balik dinding. Mereka tidak bicara, hanya hadir."
      : "Kamu berbaring di kasur yang familiar. Wajah-wajah berdatangan, tidak berurutan. Orang tuamu saat muda, sahabat yang pertama, guru yang dulu percaya padamu, tetangga yang tertawa di balik dinding. Mereka tidak bicara, hanya hadir.",
    choices: [
      { id: "terima", label: "Tersenyum tipis. Pamit.", outcomes: [
        { weight: 8, text: "Kamu pergi sambil masih merasa hangat. Tidak semua orang dapat keberuntungan ini.",
          flag: "dead", mood: "warm" },
      ]},
    ],
  }),
];
