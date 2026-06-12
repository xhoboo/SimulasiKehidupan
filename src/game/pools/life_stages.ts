import { LifeEvent } from "../types";
import { e, kerjaCtx } from "./_helpers";

// TULANG PUNGGUNG FASE HIDUP — mengisi rentang yang dulu kurang padat:
//   - lembah kepadatan usia 4 & 12 (transisi masuk SD / SMP)
//   - cinta monyet sesuai usia (akhir SD, SMP) — sebelum cinta_pertama (SMA)
//   - paruh kedua hidup (rumah pertama, puncak karir, generasi sandwich,
//     kehilangan pasangan, tubuh menua) yang dulu hanya tertutup pool tematik
//     tanpa milestone berbasis-usia yang eksplisit.
//
// Catatan: pernikahan & anak SUDAH ada di relationship.ts dengan urutan kausal
// (ada_romansa → menikah → punya_anak), jadi tidak diulang di sini.
export const LIFE_STAGES_POOL: LifeEvent[] = [
  e({
    id: "hari_pertama_sd", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 6, ageMax: 7, deferrable: true, mood: "warm",
    title: "Seragam yang Kebesaran",
    prompt: "Seragam merah-putih yang masih kebesaran, sepatu yang masih kaku, dan tas yang lebih berat dari isinya. Gerbang sekolah itu tampak besar sekali dari tempatmu berdiri.",
    choices: [
      { id: "berani", label: "Lepas pegangan, masuk sendiri", outcomes: [
        { weight: 8, text: "Kamu melangkah masuk tanpa menoleh. Di belakangmu, seseorang menahan diri untuk tidak memanggil. Membiarkanmu pergi adalah bentuk sayang yang paling sulit.", effects: { discipline: 4, social: 3 }, mood: "warm",
          memory: { text: "Hari pertama SD, kamu masuk tanpa menoleh.", tag: "sd_basah", mood: "warm" } },
        { weight: 8, text: "Kamu berani sampai gerbang, lalu ragu. Tapi kamu tetap masuk, dengan dada berdebar. Keberanian pertama yang kamu pilih sendiri, sekecil apa pun.", effects: { discipline: 3, mental: 2 } },
      ]},
      { id: "nangis", label: "Menangis di gerbang", outcomes: [
        { weight: 8, text: "Air matamu reda begitu bel berbunyi dan ada anak lain yang menawarkan tempat duduk. Ketakutan masa kecil memang begitu. Besar sebentar, lalu lupa.", effects: { social: 2, happiness: 3 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "taman_bermain", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 6, ageMax: 8, deferrable: true, mood: "warm",
    title: "Pasir dan Ayunan",
    prompt: "Sore di taman dekat rumah. Ada ayunan yang sudah diisi, perosotan yang mengelupas catnya, dan beberapa anak yang belum kamu kenal namanya.",
    choices: [
      { id: "ajak", label: "Hampiri, ajak main", outcomes: [
        { weight: 8, text: "Dalam lima menit kalian sudah berteman seolah seumur hidup. Begitu mudahnya, di usia ini, sebelum kamu belajar bahwa berkenalan bisa terasa berat.", effects: { social: 4, happiness: 4 }, mood: "warm",
          memory: { text: "Sore di taman, dan teman yang namanya pun kamu lupa.", tag: "teman_kecil", mood: "warm" } },
        { weight: 8, text: "Mereka sudah punya kelompok sendiri. Kamu main di ayunan ujung, sendiri, tapi tidak benar-benar sedih. Pelajaran pertama tentang circle yang sudah terbentuk.", effects: { social: 1, mental: 1 }, mood: "melancholy" },
      ]},
      { id: "sendiri", label: "Main sendiri di kotak pasir", outcomes: [
        { weight: 8, text: "Kamu membangun sesuatu yang hanya kamu mengerti, lalu meratakannya sendiri sebelum pulang. Dunia kecil yang utuh, dibuat dan dihancurkan dalam satu sore.", effects: { intelligence: 3, happiness: 2 } },
      ]},
    ],
  }),

  e({
    id: "naksir_diam_sd", category: "cinta", pool: "age", rarity: "common",
    ageMin: 10, ageMax: 12, deferrable: true, mood: "warm",
    title: "Yang Membuat Pelajaran Jadi Lama",
    prompt: "Ada anak di kelas yang membuat jam pelajaran terasa berbeda. Kamu belum tahu menyebutnya apa, hanya tahu kamu jadi sering melirik ke arah sana, lalu pura-pura sibuk kalau ketahuan.",
    choices: [
      { id: "kasih_kode", label: "Beri kode kecil. Bagi penghapus, pinjamkan pensil", outcomes: [
        { weight: 8, text: "Dia bilang terima kasih, dan kamu mengingat dua kata itu sepanjang hari. Tidak ada yang terjadi setelahnya, tapi tidak perlu. Di usia ini, rasa suka sudah cukup jadi peristiwa.", effects: { happiness: 5, social: 2 }, mood: "warm",
          memory: { text: "Penghapus yang kamu bagi dua, dan dua kata terima kasih.", tag: "cinta_pertama", mood: "warm" } },
        { weight: 8, text: "Temanmu memergoki dan menyoraki. Wajahmu panas, kamu menyangkal mati-matian. Malamnya kamu masih memikirkannya, antara malu dan senang yang aneh.", effects: { happiness: 3, social: -1 }, mood: "melancholy" },
      ]},
      { id: "pendam", label: "Simpan sendiri, cukup dilihat dari jauh", outcomes: [
        { weight: 8, text: "Kamu hafal di mana dia duduk, kapan dia tertawa. Rahasia kecil yang kamu jaga sendiri, dan entah kenapa itu sudah membahagiakan.", effects: { mental: 2, happiness: 3 }, mood: "warm",
          memory: { text: "Rasa suka pertama yang cukup kamu simpan sendiri.", tag: "cinta_pertama", mood: "warm" } },
      ]},
    ],
  }),

  e({
    id: "masuk_smp", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 12, ageMax: 13, deferrable: true, mood: "neutral",
    title: "Seragam Biru, Wajah-wajah Baru",
    prompt: "SMP. Seragam baru, sekolah baru, dan kebanyakan teman SD-mu tersebar ke tempat lain. Hari-hari pertama terasa seperti pindah ke kota yang ramai tapi asing.",
    choices: [
      { id: "geng", label: "Cari kelompok, biar tidak sendirian", outcomes: [
        { weight: 8, text: "Kamu menemukan beberapa orang yang tertawa pada hal yang sama. Untuk tiga tahun ke depan, mereka jadi duniamu. Sebagian akan kamu lupa, satu-dua akan bertahan lebih lama dari dugaanmu.", effects: { social: 5, happiness: 4 },
          memory: { text: "Kelompok pertama yang kamu temukan di sekolah baru.", tag: "waktu", mood: "warm" } },
        { weight: 8, text: "Kamu ikut kelompok yang salah dulu, baru pindah ke yang terasa benar. Sosial ternyata punya kurva belajarnya sendiri.", effects: { social: 3, mental: 1 } },
      ]},
      { id: "nakal", label: "Ikut sedikit kenakalan. bolos jam terakhir, coba-coba melawan", outcomes: [
        { weight: 8, text: "Adrenalin kecil yang terasa besar. Sebagian besar tidak ketahuan, dan kamu belajar batas dengan cara mendorongnya pelan-pelan.", effects: { happiness: 3, discipline: -2, social: 2 } },
        { weight: 8, text: "Ketahuan, dipanggil ke ruang BK. Malunya lebih mengajarimu daripada hukumannya. Kamu menua sedikit hari itu.", effects: { mental: -2, discipline: 2 }, mood: "melancholy" },
      ]},
      { id: "diam", label: "Amati dulu, menyesuaikan pelan-pelan", outcomes: [
        { weight: 8, text: "Kamu butuh waktu lebih lama dari yang lain. Tapi saat akhirnya nyaman, kamu tahu persis siapa yang layak didekati.", effects: { intelligence: 2, mental: 2 } },
      ]},
    ],
  }),

  e({
    id: "cinta_monyet_smp", category: "cinta", pool: "age", rarity: "common",
    ageMin: 12, ageMax: 14, deferrable: true, mood: "warm",
    title: "Ditulis di Belakang Buku",
    prompt: "Rasa suka di usia ini lebih lucu daripada waktu SD. Ada yang ditulis di belakang buku, dihapus, ditulis lagi. Teman-teman mulai saling menjodohkan dengan suara berbisik di kantin.",
    choices: [
      { id: "titip_salam", label: "Titip salam lewat teman", outcomes: [
        { weight: 8, text: "Pesan itu sampai, berputar dari mulut ke mulut, berubah sedikit di tiap singgah. Yang kembali padamu 'aku juga', katanya. Dunia terasa sempurna selama seminggu penuh.", effects: { happiness: 6, social: 3 }, mood: "warm",
          memory: { text: "Salam yang dititipkan lewat teman, dan jawaban yang membuat seminggu sempurna.", tag: "cinta_pertama", mood: "warm" } },
        { weight: 8, text: "Pesannya sampai ke orang yang salah. Kamu menghabiskan sisa minggu menghindari satu lorong tertentu.", effects: { happiness: -3, social: -2, mental: -2 }, mood: "melancholy" },
      ]},
      { id: "jadian", label: "'Jadian' dengan berbicara langsung", outcomes: [
        { weight: 8, text: "Hubungan yang isinya 90% chat malam dan 10% salah tingkah di sekolah. Tiga minggu kemudian bubar tanpa alasan jelas. Tapi untuk tiga minggu itu, kamu merasa jadi tokoh utama.", effects: { happiness: 5, social: 3 }, mood: "warm",
          memory: { text: "Pacar pertama yang isinya chat malam dan salah tingkah.", tag: "cinta_pertama", mood: "melancholy" } },
      ]},
      { id: "fokus", label: "Tahan dulu, malu sendiri", outcomes: [
        { weight: 8, text: "Kamu memilih pura-pura tidak peduli, dan cukup meyakinkan dirimu sendiri untuk tidak peduli. Hampir.", effects: { mental: 1, intelligence: 1 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "rumah_pertama", category: "pekerjaan", pool: "age", rarity: "common",
    ageMin: 28, ageMax: 42, deferrable: true, mood: "neutral",
    title: "Tanda Tangan di Atas Materai",
    prompt: "Setumpuk dokumen, sebuah pulpen, dan angka cicilan yang akan menemanimu belasan tahun ke depan. Rumah pertama. Kecil, agak jauh dari mana-mana, tapi namanya tertulis sebagai milikmu.",
    choices: (ctx) => {
      const adaPasangan = ctx.state.relationships.some((r) => r.id === "pasangan" && r.alive);
      const malamPertama = adaPasangan
        ? "Malam pertama, kalian tidur di lantai karena kasur belum datang. Langit-langit asing itu pelan-pelan jadi milik kalian. Beban dan bangga dalam satu tarikan napas."
        : "Malam pertama, kamu tidur sendiri di lantai karena kasur belum datang. Langit-langit asing itu pelan-pelan jadi milikmu. Beban dan bangga dalam satu tarikan napas.";
      return [
        { id: "kpr", label: "Ambil KPR, mulai cicilan panjang", outcomes: [
          { weight: 8, text: malamPertama, effects: { wealth: -6, happiness: 6, mental: 2 }, mood: "warm" as const, flag: "punya_rumah",
            memory: { text: "Malam pertama di rumah sendiri, tidur di lantai.", tag: "keluarga", mood: "warm" as const } },
          { weight: 8, text: "Cicilannya menggerogoti tiap akhir bulan selama bertahun-tahun. Kadang kamu bertanya apakah ini investasi atau jebakan. Tapi tiap pulang, kunci yang masuk ke lubang itu terasa seperti jawaban.", effects: { wealth: -8, mental: -2, happiness: 3 }, flag: "punya_rumah" },
        ]},
        { id: "ngontrak", label: "Belum. Mengontrak dulu, menabung pelan", outcomes: [
          { weight: 8, text: "Kamu memilih ringan di kaki daripada terikat. Sebagian orang menyebutnya tidak punya pegangan, kamu menyebutnya kebebasan yang belum siap kamu lepas.", effects: { wealth: 2, mental: 2 } },
          { weight: 8, text: "Harga rumah naik lebih cepat dari tabunganmu. Tiap tahun mimpi itu mundur satu langkah. Kamu belajar menerima bahwa tidak semua orang seangkatanmu finish di garis yang sama.", effects: { mental: -2, happiness: -1 }, mood: "melancholy" as const },
        ]},
      ];
    },
  }),

  e({
    id: "puncak_karir", category: "pekerjaan", pool: "age", rarity: "common",
    ageMin: 45, ageMax: 57, deferrable: true, mood: "neutral",
    title: "Yang Paling Senior di Ruangan",
    prompt: (ctx) => {
      const { diTempat, rekan } = kerjaCtx(ctx.state);
      return `Suatu rapat ${diTempat}, kamu sadar kamulah yang paling tua. ${rekan.charAt(0).toUpperCase() + rekan.slice(1)} memanggilmu dengan nada yang dulu kamu pakai untuk senior-seniormu. Entah kapan persisnya pergantian itu terjadi.`;
    },
    choices: [
      { id: "bimbing", label: "Terima peran, jadi orang yang dulu kamu butuhkan", outcomes: [
        { weight: 8, text: "Kamu mulai meluangkan waktu untuk yang muda. Bukan menggurui, hanya hadir. Ada kepuasan tenang saat menjadi tangga bagi orang lain, jenis yang tidak tercatat di slip gaji.", effects: { social: 5, mental: 5, happiness: 4 }, mood: "warm",
          memory: { text: "Saat kamu jadi senior yang dulu kamu butuhkan.", tag: "kerja", mood: "warm" } },
        { weight: 8, text: "Kamu coba membimbing, tapi zaman sudah bergeser. Istilah, alat, cara kerja, semua berubah. Kamu belajar dari mereka sebanyak mereka belajar darimu, dan itu membuatmu merasa muda lagi sebentar.", effects: { intelligence: 3, social: 4, mental: 3 } },
      ]},
      { id: "lelah", label: "Lelah diam-diam", outcomes: [
        { weight: 8, text: "Posisi yang dulu kamu kejar ternyata terasa lebih dingin dari yang dibayangkan. Kamu sudah sampai, dan menyadari mendaki lebih hidup daripada berdiri di atas.", effects: { wealth: 4, mental: -3, happiness: -2 }, mood: "melancholy" },
        { weight: 8, text: "Kamu mulai menghitung mundur, berapa tahun lagi sebelum boleh berhenti. Bukan karena benci, hanya lelah yang menumpuk pelan selama dua dekade.", effects: { wealth: 4, mental: -2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "generasi_sandwich", category: "keluarga", pool: "age", rarity: "uncommon",
    ageMin: 48, ageMax: 60, requireFlag: "punya_anak", forbidFlag: "anak_meninggal", deferrable: true, mood: "melancholy",
    title: "Terjepit di Tengah",
    prompt: "Anak yang masih butuh biaya di satu sisi, dan tubuhmu sendiri yang mulai mengirim tagihannya di sisi lain. Kamu jadi tiang di tengah, menopang ke atas dan ke bawah sekaligus, tanpa ada yang menopangmu.",
    choices: [
      { id: "pikul", label: "Pikul saja. 'Memang begini', katamu pada diri sendiri", outcomes: [
        { weight: 8, text: "Kamu jadi sangat pandai menyimpan lelah di tempat yang tak terlihat orang. Sesekali, di lampu merah atau di kamar mandi, kamu mengizinkan diri lelah selama tiga puluh detik, lalu lanjut lagi.", effects: { mental: -4, discipline: 4, happiness: -2 }, mood: "melancholy",
          memory: { text: "Tiga puluh detik lelah yang kamu izinkan untuk diri sendiri.", tag: "waktu", mood: "melancholy" } },
      ]},
      { id: "bicara", label: "Bicara jujur ke keluarga soal beratnya", outcomes: [
        { weight: 8, text: "Lebih sulit dari yang kamu kira untuk mengakui kamu tidak sanggup sendiri. Tapi setelahnya, beban itu tidak berkurang, hanya tidak lagi kamu pikul sendirian. Itu sangat membantu.", effects: { social: 5, mental: 4, happiness: 2 }, mood: "warm" },
        { weight: 8, text: "Mereka mendengar, mengangguk, lalu hidup kembali sibuk. Tidak semua orang bisa menolong, dan kamu belajar membedakan tidak-mau dari tidak-mampu.", effects: { mental: -2, social: -1 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "pasangan_pergi", category: "kehilangan", pool: "age", rarity: "uncommon",
    ageMin: 62, ageMax: 86, requireFlag: "menikah", requireRelationship: "pasangan",
    mood: "tragic",
    title: "Sisi Ranjang yang Dingin",
    prompt: "Orang yang sudah puluhan tahun menemanimu di ranjang itu, pagi ini tidak ada. Rumah yang selalu terlalu ramai mendadak terlalu besar. Kamu masih menyeduh dua cangkir, dua bulan berturut-turut, sebelum tubuhmu belajar.",
    choices: [
      { id: "ratapi", label: "Biarkan diri hancur dulu", outcomes: [
        { weight: 8, text: "Kamu menangis dengan cara yang tidak kamu kira masih bisa di usia ini. Tapi tidak apa-apa, sebagian cinta hanya bisa diukur dari seberapa dalam lubang yang ditinggalkannya.", effects: { mental: -10, happiness: -10 }, mood: "tragic", killsRelationship: "pasangan",
          memory: { text: "Dua cangkir kopi, dan tangan yang tidak mau lupa berhenti menyeduh yang kedua.", tag: "kehilangan", mood: "tragic" } },
      ]},
      { id: "rutinitas", label: "Berpegang pada rutinitas supaya tetap berdiri", outcomes: [
        { weight: 8, text: "Kamu merapikan tempat tidur, menyiram tanamannya, menjalani hari seolah dia hanya sedang keluar sebentar. Berpura-pura, sampai pura-pura itu pelan-pelan jadi cara bertahan yang sebenarnya.", effects: { mental: -7, happiness: -8, discipline: 3 }, mood: "melancholy", killsRelationship: "pasangan",
          memory: { text: "Tanaman pasanganmu yang kamu siram tiap pagi, untuknya.", tag: "kehilangan", mood: "melancholy" } },
      ]},
    ],
  }),

  e({
    id: "tubuh_menua", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 70, ageMax: 88, deferrable: true, mood: "melancholy",
    title: "Tubuh yang Mulai Berunding",
    prompt: "Tangga yang dulu kamu naiki dua-dua sekarang minta dihormati. Pagi butuh waktu lebih lama untuk benar-benar jadi pagi. Tubuhmu tidak menyerah, hanya mulai berunding.",
    choices: [
      { id: "terima", label: "Berdamai. Pelan-pelan saja, tidak apa-apa", outcomes: [
        { weight: 8, text: "Kamu belajar menghargai hal-hal yang dulu kamu lewati. Matahari pagi di kursi yang sama, secangkir teh yang tidak terburu-buru. Tubuh melambat, tapi dunia jadi lebih terasa.", effects: { mental: 5, happiness: 4, health: -2 }, mood: "warm",
          memory: { text: "Pagi-pagi tua yang akhirnya kamu nikmati pelan-pelan.", tag: "pagi_tua", mood: "warm" } },
      ]},
      { id: "lawan", label: "Tetap bandel. Jalan pagi, lawan sebisanya", outcomes: [
        { weight: 8, text: "Kamu memaksa tubuh tua itu tetap bergerak, dan ia menghargaimu dengan beberapa tahun yang jadi lebih ringan. Bukan menang melawan waktu, hanya tidak menyerah lebih cepat.", effects: { health: 4, discipline: 4, mental: 2 } },
        { weight: 8, text: "Suatu pagi lututmu menolak keras, dan kamu duduk lebih lama dari rencana. Kamu belajar membedakan keras kepala yang sehat dari yang sia-sia. Garis itu tipis, dan kamu baru belajar membacanya.", effects: { health: -2, mental: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "tua_tangan_kancing", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 80, ageMax: 94, deferrable: true, mood: "melancholy",
    title: "Kancing yang Melawan",
    prompt: "Kancing teratas kemejamu butuh tiga kali percobaan pagi ini. Jari-jari yang dulu bisa apa saja, mengikat tali, memotong kuku orang yang kamu sayang, menulis sepanjang malam, sekarang berunding untuk hal sekecil itu. Tidak ada yang melihat, dan itu yang membuatnya terasa sunyi.",
    choices: [
      { id: "minta", label: "Minta tolong yang ada di dekatmu, tidak apa untuk butuh bantuan", outcomes: [
        { weight: 8, text: "Butuh waktu lama untuk belajar bahwa meminta tolong bukan kekalahan. Sepasang tangan yang lebih muda mengancingkannya dalam dua detik, dan kamu mengucapkan terima kasih dengan sungguh-sungguh.", effects: { mental: 4, social: 3, health: -1 }, mood: "warm" },
      ]},
      { id: "telateni", label: "Telateni sendiri, sepelan apa pun", outcomes: [
        { weight: 8, text: "Kamu kerjakan sendiri, kancing demi kancing, sampai selesai. Lebih lambat dari seluruh hidupmu sebelumnya, tapi selesai. Ada martabat kecil yang tidak ingin kamu serahkan dulu.", effects: { discipline: 4, mental: 3, health: -1 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "tua_generasi_terakhir", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 82, ageMax: 95, deferrable: true, mood: "melancholy",
    title: "Yang Terakhir Tersisa",
    prompt: "Hampir semua nama di kepalamu sudah dicoret. Teman sekelas, rekan kerja, tetangga yang dulu lebih tua darimu dan kamu kira akan selalu lebih tua. Kamu yang terakhir tersisa dari satu generasi, sendiri di ruangan yang dulu ramai.",
    choices: [
      { id: "ceritakan", label: "Ceritakan mereka ke siapa pun yang mau mendengar", outcomes: [
        { weight: 8, text: "Kamu jadi satu-satunya yang masih ingat bagaimana suara mereka, lelucon mereka, cara mereka salah mengeja namamu. Selama kamu menceritakannya, mereka belum sepenuhnya pergi.", effects: { mental: 5, social: 3, happiness: 3 }, mood: "warm",
          memory: { text: "Menjadi satu-satunya yang masih mengingat suara mereka.", tag: "tua", mood: "melancholy" } },
      ]},
      { id: "simpan", label: "Simpan mereka diam-diam, untuk dirimu sendiri", outcomes: [
        { weight: 8, text: "Kamu tidak menceritakannya pada siapa-siapa. Mereka jadi negeri pribadi yang kamu kunjungi tiap malam sebelum tidur, tempat semua orang masih muda dan belum ke mana-mana.", effects: { mental: 3, happiness: 2 }, mood: "melancholy",
          memory: { text: "Negeri pribadi tempat semua orang masih muda dan belum ke mana-mana.", tag: "kesepian", mood: "melancholy" } },
      ]},
    ],
  }),

  e({
    id: "tua_membagi_barang", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 82, ageMax: 95, deferrable: true, mood: "melancholy",
    title: "Membagi yang Tersisa",
    prompt: "Kamu mulai memberikan barangmu pelan-pelan. Buku ke yang mau membacanya, jam tangan ke yang dulu diam-diam mengaguminya, foto-foto ke orang yang ada di dalamnya. Bukan karena menyerah, kamu hanya ingin memilih sendiri ke mana semuanya pergi.",
    choices: [
      { id: "sekarang", label: "Beri sekarang, sambil melihat wajah mereka menerimanya", outcomes: [
        { weight: 8, text: "Lebih baik melihat sendiri benda-benda itu menemukan tangan baru daripada menyerahkannya pada surat dan pada nanti. Tiap benda yang keluar membuat rumah lebih lapang, dan dadamu juga.", effects: { mental: 5, happiness: 4, social: 3 }, mood: "warm",
          memory: { text: "Melihat sendiri benda-bendamu menemukan tangan yang baru.", tag: "tua", mood: "warm" } },
      ]},
      { id: "simpan_dulu", label: "Tahan sebagian, belum semua siap dilepas", outcomes: [
        { weight: 8, text: "Ada beberapa yang tidak bisa kamu lepas dulu. Satu foto, satu surat, satu benda kecil yang tidak ada harganya bagi orang lain. Kamu simpan itu di laci paling dekat, untuk ditatap, bukan untuk diberikan.", effects: { mental: 3, happiness: 2 }, mood: "melancholy",
          memory: { text: "Benda-benda kecil tak berharga yang kamu simpan untuk ditatap, bukan diberikan.", tag: "tua", mood: "melancholy" } },
      ]},
    ],
  }),

  e({
    id: "tua_hari_tanpa_nama", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 84, ageMax: 95, deferrable: true, mood: "melancholy",
    title: "Hari yang Kehilangan Namanya",
    prompt: "Senin, Kamis, Minggu. Sudah lama tidak penting. Hari-hari kehilangan namanya dan melebur jadi satu hal yang lembut. Kamu duduk di tempat yang sama saat matahari datang, lalu pindah pelan mengikuti ia berpindah, dan itu sudah cukup jadi seluruh agenda.",
    choices: [
      { id: "lingkaran", label: "Biarkan waktu jadi lingkaran, bukan garis", outcomes: [
        { weight: 8, text: "Kamu berhenti mengejar, mulai berputar pelan bersama hari. Hidup yang dulu terasa seperti panah sekarang terasa seperti napas. Masuk, keluar, masuk, keluar.", effects: { mental: 6, happiness: 4 }, mood: "warm",
          memory: { text: "Saat hidup berhenti terasa seperti panah dan mulai terasa seperti napas.", tag: "tenang", mood: "warm" } },
      ]},
      { id: "tandai", label: "Coba tetap menandai hari di kalender", outcomes: [
        { weight: 8, text: "Kamu lingkari tanggal di kalender supaya tidak hanyut. Sebagian lingkaran ada tanpa kamu ingat kenapa. Kamu memegang erat satu tali di dunia yang melaju.", effects: { mental: 3, discipline: 2 }, mood: "melancholy",
          memory: { text: "Lingkaran-lingkaran di kalender, sebagian sudah lupa kenapa.", tag: "waktu", mood: "melancholy" } },
      ]},
    ],
  }),

  e({
    id: "tua_jendela_sore", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 86, ageMax: 95, deferrable: true, mood: "melancholy",
    title: "Sore di Balik Jendela",
    prompt: "Sebagian besar harimu sekarang dihabiskan di kursi dekat jendela. Dunia bergerak di luar sana. Anak sekolah, motor, daun yang gugur tanpa buru-buru. Kamu menontonnya seperti menonton film tentang tempat yang dulu kamu tinggali.",
    choices: [
      { id: "tonton", label: "Nikmati saja jadi penonton yang tenang", outcomes: [
        { weight: 8, text: "Tidak ada lagi yang harus kamu kejar di luar sana, dan itu bukan kehilangan. Itu istirahat yang sudah lama kamu tunda. Kamu menonton hari berlalu tanpa cemas akan ketinggalan.", effects: { mental: 6, happiness: 4 }, mood: "warm",
          memory: { text: "Sore-sore di kursi dekat jendela, menonton dunia tanpa cemas ketinggalan.", tag: "tenang", mood: "warm" } },
      ]},
      { id: "rindu", label: "Biarkan diri merindu ada di luar sana lagi", outcomes: [
        { weight: 8, text: "Sesekali kamu rindu jadi salah satu yang terburu-buru di trotoar itu, punya tempat yang harus dituju. Lalu kamu ingat betapa lelahnya dulu, dan rindu itu reda sendiri jadi senyum tipis.", effects: { mental: 3, happiness: 2 }, mood: "melancholy",
          memory: { text: "Rindu ikut terburu-buru di trotoar, lalu ingat betapa lelahnya dulu.", tag: "waktu", mood: "melancholy" } },
      ]},
    ],
  }),
];
