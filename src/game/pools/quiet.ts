import { LifeEvent, GameState } from "../types";
import { e } from "./_helpers";

// Kalimat penutup prompt quiet_parkiran, disesuaikan dengan tempat tinggal pemain:
// ngekos (tinggal_kos), rumah sendiri (punya_rumah), masih di rumah orang tua, atau
// sudah menikah (ada pasangan yang menunggu). Untuk yang rumahnya justru TIDAK kosong
// (ada pasangan / orang tua), kalimat "tidak ada yang menunggumu" diganti agar tidak
// bertentangan dengan keadaan sebenarnya.
function parkiranPulang(state: GameState): string {
  const f = state.flags;
  const pasanganHidup = state.relationships.some((r) => r.id === "pasangan" && r.alive);
  const ibuHidup = state.relationships.some((r) => r.id === "ibu" && r.alive);
  const ayahHidup = state.relationships.some((r) => r.id === "ayah" && r.alive);

  // Ada pasangan yang menunggu — rumah tidak kosong, justru itu yang berat.
  if (f.menikah && pasanganHidup) {
    return "Di rumah ada yang menunggumu, dan anehnya justru itu yang membuatmu belum siap masuk. Kamu belum tahu wajah apa yang harus kamu pasang malam ini.";
  }
  // Ngekos — kamar sewa yang sunyi.
  if (f.tinggal_kos && !f.punya_rumah) {
    return "Tidak ada yang menunggumu di kamar kos, dan untuk saat ini kamu belum siap pulang ke kekosongan itu.";
  }
  // Rumah sendiri — milik sendiri, tapi tetap kosong.
  if (f.punya_rumah) {
    return "Tidak ada yang menunggumu di rumah, dan untuk saat ini kamu belum siap pulang ke kekosongan itu.";
  }
  // Masih di rumah orang tua, dan orang tua masih ada — rumah justru tidak kosong.
  if (ibuHidup || ayahHidup) {
    return "Di rumah, orang tuamu mungkin sudah tertidur, dan kamu belum siap menyelinap masuk seperti yang kamu lakukan sejak remaja, lalu berpura-pura harimu baik-baik saja.";
  }
  // Rumah orang tua, tapi keduanya sudah tiada — rumah keluarga yang kini sepi.
  return "Tidak ada yang menunggumu di rumah, dan untuk saat ini kamu belum siap pulang ke kekosongan itu.";
}

// Pool momen tenang — setiap beat punya pilihan unik dan muncul sekali per hidup (default).
export const QUIET_POOL: LifeEvent[] = [
  e({
    id: "quiet_sinetron", category: "quiet", pool: "quiet", rarity: "common",
    ageMin: 6, ageMax: 9, deferrable: true, mood: "warm",
    title: "Sofa dan Sinetron",
    prompt: "Kamu setengah tertidur di sofa. Suara sinetron di TV menjadi suara yang menemanimu, walau kamu tidak mengerti adegannya.",
    choices: [
      { id: "tidur", label: "Pejamkan mata, ikut hanyut", outcomes: [
        { weight: 2, text: "Bantal sofa terlalu besar untuk badanmu. Ingatan ini akan kembali 30 tahun lagi, tanpa peringatan.", effects: { mental: 3, happiness: 2 }, mood: "warm",
          memory: { text: "Sore dengan suara sinetron dari TV.", tag: "sofa_sore", mood: "warm" } },
        { weight: 8, text: "Kamu tertidur betulan, dan seseorang memindahkanmu ke kamar tanpa kamu sadar. Bertahun kemudian kamu paham, dipindahkan saat tidur adalah salah satu bentuk cinta paling sunyi.", effects: { mental: 3, happiness: 3 }, mood: "warm",
          memory: { text: "Dipindahkan ke kamar dalam tidur, tanpa pernah tahu kapan.", tag: "sofa_sore", mood: "warm" } },
        { weight: 8, text: "Suara sinetron berbaur dengan dengkur halus ayah di kursi sebelah. Kamu tidak tahu kapan tertidur, hanya tahu saat bangun selimut sudah ada di tubuhmu, entah dari mana.", effects: { mental: 3, happiness: 2 }, mood: "warm",
          memory: { text: "Selimut yang muncul entah dari mana, sore di depan TV.", tag: "sofa_sore", mood: "warm" } },
        { weight: 6, text: "Iklan, lagu pembuka, dialog yang diulang-ulang, semuanya jadi semacam nyanyian pengantar tidur. Bertahun kemudian, suara sinetron asing dari rumah tetangga masih bisa membuatmu mengantuk seketika.", effects: { mental: 3, happiness: 2 }, mood: "warm",
          memory: { text: "Suara sinetron yang selamanya jadi pengantar tidurmu.", tag: "sofa_sore", mood: "warm" } },
      ]},
      { id: "lihat", label: "Mencoba mengerti adegannya", outcomes: [
        { weight: 8, text: "Kamu menyimpulkan orang dewasa selalu marah-marah, tapi juga selalu menangis. Kesimpulan yang ternyata cukup akurat.", effects: { intelligence: 2 } },
      ]},
      { id: "matikan", label: "Matikan TV, dengar suara rumah", outcomes: [
        { weight: 8, text: "Suara kulkas. Suara ibu di dapur. Suara hujan ringan. Rumahmu punya soundtrack-nya sendiri.", effects: { mental: 4 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "quiet_hujan", category: "quiet", pool: "quiet", rarity: "common",
    ageMin: 16, ageMax: 32, deferrable: true, mood: "melancholy",
    title: "Hujan yang Terlalu Lama",
    prompt: "Hujan turun lebih lama dari yang seharusnya. Kamu duduk di depan jendela tanpa alasan jelas.",
    choices: [
      { id: "kopi", label: "Seduh sesuatu yang hangat", outcomes: [
        { weight: 8, text: "Uapnya menempel di kaca. Kamu menggambar wajah dengan jari di sana, lalu menghapusnya.", effects: { mental: 4, happiness: 3 }, mood: "warm",
          memory: { text: "Wajah yang kamu gambar di jendela berkabut.", tag: "hujan", mood: "warm" } },
        { weight: 8, text: "Air mendidih, tapi kamu lupa menuangnya. Kopinya dingin saat kamu ingat. Kamu minum juga. Ada hari yang memang lebih cocok dibiarkan setengah jadi.", effects: { mental: 4, happiness: 2 }, mood: "melancholy" },
      ]},
      { id: "keluar", label: "Keluar, basah-basahan", outcomes: [
        { weight: 8, text: "Kamu berdiri di bawah rinai, bukan karena suka hujan, hanya karena tubuhmu memutuskan lebih dulu dari pikiranmu. Tanpa alasan, tanpa penonton.", effects: { mental: 5, health: -3 } },
        { weight: 8, text: "Kamu demam dua hari. Tapi entah kenapa tidak menyesal.", effects: { health: -8, happiness: 2 } },
      ]},
      { id: "telp", label: "Telepon seseorang, jadikan hujan alasannya", outcomes: [
        { weight: 8, text: "Dia menjawab. Hujan memang alasan yang cukup baik untuk apa pun.", effects: { social: 5, happiness: 4 } },
        { weight: 8, text: "Dia tidak menjawab. Kamu menaruh ponsel, dan ternyata tidak apa-apa. Kadang yang kamu butuhkan cuma keberanian untuk menelepon, bukan jawabannya.", effects: { mental: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "quiet_lampu", category: "quiet", pool: "quiet", rarity: "common",
    ageMin: 18, ageMax: 30, requireFlag: "tinggal_kos", forbidFlag: "punya_rumah", deferrable: true, mood: "melancholy",
    title: "Lampu Kos yang Berkedip",
    prompt: "Lampu kamar kosmu berkedip pelan, tapi tidak putus. Sudah dua minggu seperti ini. Kamu sudah begitu terbiasa sampai baru sadar lagi malam ini, saat suasana terlalu sunyi untuk diabaikan.",
    choices: [
      { id: "ganti", label: "Bangun, ganti bohlam", outcomes: [
        { weight: 8, text: "Kamar terang lagi. Hening yang berbeda dari sebelumnya. Sebuah tindakan kecil yang membuatmu merasa cukup dewasa malam itu.", effects: { discipline: 3, mental: 3 } },
        { weight: 8, text: "Kamu ganti bohlamnya, dan baru sadar kamar itu sudah lama remang tanpa kamu keberatan. Besoknya kamu terbiasa lagi. Begitulah hampir semua perubahan kecil.", effects: { discipline: 2, mental: 2 } },
      ]},
      { id: "tatap", label: "Dengarkan kedipannya, jadikan irama", outcomes: [
        { weight: 8, text: "Ada pola di sana. Kamu mulai menghitung intervalnya seperti orang yang tidak ada kerjaan. Kamu tertidur sebelum sampai dua puluh.", effects: { mental: -1 }, mood: "melancholy",
          memory: { text: "Lampu kos yang berkedip, kamu menghitung intervalnya sampai ketiduran.", tag: "kos", mood: "melancholy" } },
      ]},
      { id: "video", label: "Rekam, kirim ke teman dengan caption horor", outcomes: [
        { weight: 8, text: "Dia membalas 'ganti woi, ada jinnya.' Kalian ngobrol sampai jam dua soal hal-hal yang tidak penting tapi terasa penting. Lampunya tetap berkedip.", effects: { social: 4, happiness: 3 } },
      ]},
    ],
  }),

  e({
    id: "quiet_tetangga", category: "quiet", pool: "quiet", rarity: "common",
    ageMin: 22, ageMax: 38, deferrable: true,
    title: "Tawa dari Balik Dinding",
    prompt: "Kamu dengar tetangga tertawa terbahak-bahak dari balik dinding. Kamu tidak tahu leluconnya apa, tapi tubuhmu ikut tersenyum.",
    choices: [
      { id: "ikut", label: "Lanjutkan kerja", outcomes: [
        { weight: 8, text: "Sebuah perasaan yang tidak ada namanya, ditemani oleh orang asing tanpa pernah bertemu.", effects: { mental: 4, happiness: 3 }, mood: "warm" },
        { weight: 8, text: "Kamu ikut tersenyum, lalu mendapati dirimu menunggu tawa berikutnya. Hidup orang lain jadi radio latar yang menenangkan. Kamu tidak perlu tahu ceritanya untuk merasa ditemani.", effects: { mental: 3, happiness: 3 }, mood: "warm" },
      ]},
      { id: "iri", label: "Tiba-tiba merasa kesepian", outcomes: [
        { weight: 8, text: "Tawanya seperti mengingatkanmu akan hal yang tidak bisa kamu sebutkan.", effects: { mental: -4, happiness: -3 }, mood: "melancholy",
          memory: { text: "Tawa tetangga yang membuatmu kesepian.", tag: "kesepian", mood: "melancholy" } },
        { weight: 8, text: "Tawa itu meresap ke ruang sepi di kamarmu dan berubah jadi sesuatu yang dingin. Kamu menyalakan musik untuk menutupinya, lebih keras dari yang diperlukan. Malam ini sunyimu terlalu nyaring.", effects: { mental: -4, happiness: -2 }, mood: "melancholy",
          memory: { text: "Malam saat tawa dari balik dinding terasa terlalu jauh untuk dijangkau.", tag: "kesepian", mood: "melancholy" } },
      ]},
      { id: "ketuk", label: "Ketuk pintu, kenalan", outcomes: [
        { weight: 8, text: "Mereka menyambut canggung. Tapi tiga bulan kemudian kamu diundang arisan.", effects: { social: 6, happiness: 4 }, addsRelationship: { name: "Tetangga", role: "friend", closeness: 30, alive: true } },
        { weight: 8, text: "Mereka menatapmu seperti orang aneh. Kamu mundur sambil menggumamkan maaf.", effects: { social: -2, mental: -2 } },
      ]},
    ],
  }),

  e({
    id: "quiet_makan", category: "quiet", pool: "quiet", rarity: "common",
    ageMin: 23, ageMax: 42, mood: "melancholy",
    title: "Video Lama Saat Makan",
    prompt: "Kamu makan sendirian sambil memutar video lama yang kata-katanya sudah kamu hafal. Lebih nyaman daripada hening.",
    choices: [
      { id: "nikmati", label: "Mengunyah pelan, dengarkan", outcomes: [
        { weight: 8, text: "Kebiasaan ini sudah dan akan bertahan puluhan tahun, dan tidak apa-apa.", effects: { mental: 3, happiness: 2 } },
      ]},
      { id: "cari_baru", label: "Cari video baru yang belum pernah ditonton", outcomes: [
        { weight: 8, text: "Algoritma menyodorkan sesuatu yang aneh. Kamu suka. Begitulah kamu menambah satu video lagi untuk dihafalkan.", effects: { happiness: 3 } },
      ]},
      { id: "matikan", label: "Matikan layar, makan dalam hening", outcomes: [
        { weight: 8, text: "Suara sendok di piring terdengar lebih keras. Kamu mendengarkan tubuhmu untuk pertama kalinya hari itu.", effects: { mental: 5 }, mood: "warm" },
        { weight: 8, text: "Hening itu canggung dulu, lalu jujur. Kamu mulai mengecap rasa makananmu sendiri, dan menyadari kamu sudah lama makan tanpa benar-benar mengecap apa pun.", effects: { mental: 4, happiness: 2 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "quiet_parkiran", category: "quiet", pool: "quiet", rarity: "uncommon",
    ageMin: 24, ageMax: 36, mood: "melancholy",
    title: "Roti Dingin di Parkiran",
    prompt: (ctx) =>
      `Kamu duduk di parkiran minimarket sambil makan roti dingin. Lampu jalan berkedip. ${parkiranPulang(ctx.state)}`,
    choices: [
      { id: "habiskan", label: "Habiskan rotimu pelan-pelan, nikmati kesunyian", outcomes: [
        { weight: 8, text: "Kamu menghitung lampu yang berkedip. Empat. Lalu lima. Lalu pulang.", effects: { mental: -3 }, mood: "melancholy",
          memory: { text: "Roti dingin di parkiran minimarket, larut malam.", tag: "kesepian", mood: "melancholy" } },
        { weight: 8, text: "Rotinya habis sebelum kamu siap pulang. Kamu menonton minimarket itu seperti akuarium kecil yang terang. Kamu pulang enam menit kemudian.", effects: { mental: -3, happiness: 1 }, mood: "melancholy",
          memory: { text: "Minimarket terang yang kamu tonton seperti akuarium, larut malam.", tag: "kesepian", mood: "melancholy" } },
      ]},
      { id: "obrolan", label: "Ajak ngobrol kasir yang sedang istirahat di parkiran", outcomes: [
        { weight: 8, text: "Dia bercerita soal anaknya yang baru masuk SD. Kamu mendengarkan lebih serius dari yang kamu rencanakan. Dunia tidak sebesar yang kamu kira malam ini.", effects: { social: 3, mental: 4, happiness: 3 } },
      ]},
      { id: "jalan", label: "Buang bungkusnya, berjalan kaki tanpa tujuan", outcomes: [
        { weight: 8, text: "Tiga puluh menit, dua jalan, satu taman kecil. Tidak ada yang berubah. Tapi kakimu lebih ringan dari sebelumnya.", effects: { mental: 4, health: 2 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "quiet_kipas", category: "quiet", pool: "quiet", rarity: "common",
    ageMin: 25, ageMax: 40, title: "Kipas Angin Tua",
    prompt: "Kipas angin di kamarmu berbunyi 'tek-tek' setiap putaran. Sudah bertahun-tahun. Kamu tidak ingat kapan mulainya.",
    choices: [
      { id: "perbaiki", label: "Buka, coba perbaiki sendiri", outcomes: [
        { weight: 8, text: "Bunyinya hilang. Kamu duduk memandanginya selama lima menit, hampir kecewa.", effects: { intelligence: 3, mental: -1 } },
        { weight: 8, text: "Sekrupnya hilang satu. Kipas itu tidak pernah sama lagi.", effects: { intelligence: 1 } },
      ]},
      { id: "biarkan", label: "Biarkan. Bunyinya sudah jadi bagian rumah.", outcomes: [
        { weight: 8, text: "Suatu hari, kipas itu mati. Kamu tidur tidak nyenyak. Bukan karena panas, tapi karena hening.", effects: { mental: 2 }, mood: "melancholy",
          memory: { text: "Bunyi tek-tek kipas tua di kamar.", tag: "kipas_tua", mood: "warm" } },
        { weight: 8, text: "Suatu hari kamu pindah, dan kipas itu tidak ikut. 'Terlalu tua.' Kata yang bantu angkut. Kamu mengangguk setuju, lalu diam-diam menyesalinya. Bunyi tek-tek itu tidak pernah kamu dengar lagi.", effects: { mental: 1 }, mood: "melancholy",
          memory: { text: "Bunyi tek-tek kipas tua yang kamu tinggalkan saat pindah.", tag: "kipas_tua", mood: "melancholy" } },
      ]},
      { id: "ganti", label: "Beli kipas baru", outcomes: [
        { weight: 8, text: "Kipas baru lebih sunyi, lebih efisien. Tapi kamu menyimpan yang lama di gudang, entah untuk apa.", effects: { wealth: -1, mental: 1 } },
      ]},
    ],
  }),

  e({
    id: "quiet_kopi", category: "quiet", pool: "quiet", rarity: "common",
    ageMin: 26, ageMax: 48, deferrable: true, mood: "warm",
    title: "Pagi, Sebelum Notifikasi",
    prompt: "Kopi pagi mengepul. Belum ada notifikasi. Untuk satu menit, hari belum dimulai dan belum dirusak.",
    choices: [
      { id: "duduk", label: "Duduk diam, jangan buka apapun", outcomes: [
        { weight: 8, text: "Satu menit jadi sepuluh. Itu hari paling tenang sepanjang minggu, dan kamu tidak menulisnya di mana-mana.", effects: { mental: 6, happiness: 4 }, mood: "warm",
          memory: { text: "Sepuluh menit hening sebelum dunia bangun.", tag: "pagi", mood: "warm" } },
        { weight: 8, text: "Kamu duduk diam, dan untuk sekali ini pikiranmu ikut diam. Bukan kosong, tapi tenang. Kamu membawanya seperti bekal di sepanjang hari yang berat.", effects: { mental: 6, happiness: 4 }, mood: "warm",
          memory: { text: "Satu menit tenang yang kamu bawa seperti bekal seharian.", tag: "pagi", mood: "warm" } },
      ]},
      { id: "buka_hp", label: "Buka HP, cek email", outcomes: [
        { weight: 8, text: "Hari dimulai 53 menit lebih cepat dari yang seharusnya.", effects: { mental: -3 } },
        { weight: 8, text: "Satu email berubah jadi dua belas sebelum kopimu sempat dingin. Saat kamu mengangkat kepala, menit tenang itu sudah lewat tanpa pamit.", effects: { mental: -4 }, mood: "melancholy" },
      ]},
      { id: "jurnal", label: "Tulis satu paragraf di buku catatan", outcomes: [
        { weight: 8, text: "Tulisanmu jelek. Tapi kamu menyimpannya. Kebiasaan kecil yang akan jadi tumpukan tebal di umur 60.", effects: { discipline: 4, mental: 4 } },
      ]},
    ],
  }),

  e({
    id: "quiet_lagu_lama", category: "quiet", pool: "quiet", rarity: "common",
    ageMin: 30, ageMax: 55, deferrable: true, mood: "melancholy",
    title: "Lagu Lama di Radio",
    prompt: "Sebuah lagu lama muncul di radio. Kamu tidak ingat lirik bait keduanya, tapi tubuhmu ingat semua jeda.",
    choices: [
      { id: "nyanyi", label: "Bernyanyi keras, lewati bait yang lupa", outcomes: [
        { weight: 8, text: "Mulutmu mengarang lirik baru. Tidak ada yang melihat. Itu hadiah kecil dari hari Selasa.", effects: { happiness: 5, mental: 3 }, mood: "warm" },
        { weight: 8, text: "Di lampu merah, orang di mobil sebelah ikut menyanyi lagu yang sama. Kalian tidak saling kenal, tapi untuk satu lampu merah ini kalian satu band. Lalu lampu hijau, dan masing-masing kembali ke hidupnya.", effects: { happiness: 5, mental: 3, social: 1 }, mood: "warm" },
      ]},
      { id: "nostalgia", label: "Diam. Biarkan ingatan datang.", outcomes: [
        { weight: 8, text: "Wajah seseorang dari masa lalu muncul. Kamu tidak tahu apakah dia masih hidup.", effects: { mental: -3 }, mood: "melancholy",
          memory: { text: "Lagu yang membuatmu memikirkan seseorang yang hilang.", tag: "lagu_lama", mood: "melancholy" } },
      ]},
      { id: "ganti", label: "Ganti channel cepat-cepat", outcomes: [
        { weight: 8, text: "Ada lagu yang terasa lebih utuh kalau dipotong sebelum bait terakhir.", effects: { mental: 1 } },
      ]},
    ],
  }),

  e({
    id: "quiet_foto_laci", category: "nostalgia", pool: "quiet", rarity: "uncommon",
    ageMin: 60, ageMax: 85, deferrable: true, mood: "melancholy",
    title: "Album di Laci Bawah",
    prompt: "Kamu menemukan album foto lama yang tidak pernah kamu buka. Orang-orang di sana tampak sangat muda, sangat yakin, sangat tidak tahu apa yang menanti.",
    choices: (ctx) => [
      { id: "buka_semua", label: "Lihat satu per satu, sampai selesai", outcomes: [
        { weight: 8, text: "Dua jam berlalu. Beberapa wajah tidak kamu kenali lagi, mungkin termasuk dirimu sendiri. Ada yang menekan pelan di dadamu.", effects: { mental: -4, happiness: 3 }, mood: "melancholy",
          memory: { text: "Foto-foto lama dengan wajah yang tidak lagi kamu kenali.", tag: "waktu", mood: "melancholy" } },
        { weight: 8, text: "Di halaman terakhir, foto yang tidak kamu ingat. Kamu, muda, tertawa pada sesuatu di luar bingkai. Kamu coba mengingat apa yang begitu lucu, tidak berhasil. Tapi senyum itu menular melintasi puluhan tahun.", effects: { mental: -2, happiness: 4 }, mood: "melancholy",
          memory: { text: "Foto dirimu muda, tertawa pada sesuatu di luar bingkai yang tak lagi kamu ingat.", tag: "waktu", mood: "melancholy" } },
      ]},
      { id: "tutup_lagi", label: "Tutup, simpan kembali ke laci", outcomes: [
        { weight: 8, text: "Tidak semua ingatan minta dibuka. Sebagian cukup tahu ia masih di sana.", effects: { mental: 1 } },
      ]},
      ctx.state.flags.punya_anak
        ? { id: "scan", label: "Foto, kirim ke cucu", outcomes: [
            { weight: 8, text: "Dia menelepon dua hari kemudian, penuh pertanyaan. Kalian bicara lebih lama dari setahun terakhir.", effects: { social: 5, happiness: 6, mental: 5 }, mood: "warm" },
            { weight: 8, text: "Cucumu membalas dengan stiker, lalu sepi. Anak muda sibuk. Tapi sebulan kemudian dia datang berkunjung, minta diceritakan tiap foto satu per satu.", effects: { social: 4, happiness: 5, mental: 4 }, mood: "warm" },
          ]}
        : { id: "tunjuk", label: "Tunjukkan ke satu teman lama", outcomes: [
            { weight: 8, text: "Kalian habiskan sore menebak nama orang-orang di foto. Sebagian benar, sebagian dikarang. Tertawa untuk wajah yang sama-sama kalian lupa.", effects: { social: 5, happiness: 5, mental: 4 }, mood: "warm" },
            { weight: 8, text: "Temanmu menunjuk satu foto, 'ini aku, kan?' Yang sebenarnya bukan, tapi kamu biarkan dia percaya. Sebagian kenangan lebih baik dibagi daripada diluruskan.", effects: { social: 4, happiness: 4, mental: 4 }, mood: "warm" },
          ]},
    ],
  }),

  e({
    id: "quiet_pagi_tua", category: "quiet", pool: "quiet", rarity: "common",
    ageMin: 62, ageMax: 90, deferrable: true, mood: "warm",
    title: "Pagi yang Tidak Terburu-buru",
    prompt: "Pagi datang tanpa alarm, tanpa daftar yang harus dikejar. Dulu kamu berebut satu menit tenang di hari yang menuntut. Sekarang seluruh pagi ini milikmu, dan kamu masih belajar caranya tidak merasa bersalah karena memilikinya.",
    choices: [
      { id: "nikmati", label: "Biarkan pagi memanjang sesukanya", outcomes: [
        { weight: 8, text: "Kopinya habis, kamu seduh lagi, tanpa alasan selain bisa. Waktu yang dulu terasa kurang sekarang berlimpah.", effects: { mental: 6, happiness: 5 }, mood: "warm",
          memory: { text: "Pagi tua yang dibiarkan memanjang sesukanya, kopi diseduh dua kali tanpa alasan.", tag: "pagi_tua", mood: "warm" } },
        { weight: 8, text: "Kamu biarkan pagi memanjang, lalu menyadari kamu tidak lagi tahu harus mengisinya dengan apa. Kebebasan yang dulu kamu impikan ternyata juga sejenis ujian.", effects: { mental: 4, happiness: 3 }, mood: "melancholy" },
      ]},
      { id: "telepon", label: "Telepon seseorang yang lama tidak dihubungi", outcomes: [
        { weight: 8, text: "Dia mengangkat segera. Suaranya lebih berat dari yang kamu ingat. Kalian bicara lama, tentang omong kosong dan tentang segalanya.", effects: { social: 4, happiness: 5, mental: 4 }, mood: "warm" },
        { weight: 8, text: "Yang mengangkat orang lain. 'Beliau sudah pergi tahun lalu,' katanya pelan. Kamu menyeduh satu gelas kopi lagi.", effects: { mental: -3 }, mood: "melancholy" },
      ]},
      { id: "keluar", label: "Duduk di teras, lihat orang lewat", outcomes: [
        { weight: 8, text: "Anak tetangga yang dulu masih merangkak, sekarang berangkat kerja lewat depan rumahmu. Waktu terus berputar, tapi kamu masih di sini.", effects: { mental: 5, happiness: 3 }, mood: "warm" },
        { weight: 8, text: "Tidak banyak yang lewat sepagi ini. Seekor kucing, tukang sayur, satu mobil. Dunia masih bersedia menyapamu balik, dan itu sudah cukup untuk satu pagi.", effects: { mental: 4, happiness: 3, social: 2 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "kawan_jalan_pagi", category: "pertemanan", pool: "quiet", rarity: "uncommon",
    ageMin: 63, ageMax: 86, deferrable: true, mood: "melancholy",
    title: "Teman Jalan Pagi",
    prompt: "Di taman tiap pagi, ada satu orang seusiamu yang selalu lewat di jam yang sama. Kalian mulai mengangguk, lalu menyapa, lalu berjalan beriringan tanpa pernah benar-benar berkenalan. Kalian hafal rutinitas masing-masing, bukan nama masing-masing.",
    choices: [
      { id: "jalan", label: "Nikmati persahabatan tanpa nama ini", outcomes: [
        { weight: 8, text: "Beberapa bulan, jalan pagi jadi bagian terbaik dari harimu. Lalu satu pagi dia tidak datang. Kamu tetap berjalan sendiri, di jam yang sama, tanpa pernah tahu namanya.", effects: { social: 3, mental: -3, health: 2 }, mood: "melancholy",
          addsRelationship: { id: "kawan_pagi", name: "Teman Jalan Pagi", role: "friend", closeness: 35, alive: false },
          memory: { text: "Teman jalan pagi yang tidak pernah kamu tahu namanya, lalu tidak datang lagi.", tag: "tua", mood: "melancholy" } },
        { weight: 8, text: "Suatu pagi dia datang dengan tongkat, lalu kursi roda, lalu tidak datang lagi. Kamu menyaksikan satu hidup memudar dari samping, tanpa pernah tahu namanya. Kamu tetap berjalan di jam yang sama, membawanya dalam langkahmu.", effects: { social: 3, mental: -4, health: 2 }, mood: "melancholy",
          addsRelationship: { id: "kawan_pagi", name: "Teman Jalan Pagi", role: "friend", closeness: 35, alive: false },
          memory: { text: "Teman jalan pagi yang kamu saksikan memudar dari samping, tanpa nama.", tag: "tua", mood: "melancholy" } },
      ]},
      { id: "kenalan", label: "Akhirnya tanyakan namanya", outcomes: [
        { weight: 8, text: "Dia menyebut namanya, kamu menyebut namamu. Anehnya, sesuatu yang tadinya ringan jadi punya bobot setelah itu. Tapi kalian jadi benar-benar berteman, dan itu sepadan.", effects: { social: 5, happiness: 4 },
          addsRelationship: { id: "kawan_pagi", name: "Teman Jalan Pagi", role: "friend", closeness: 50, alive: true } },
        { weight: 8, text: "Kamu tanyakan namanya, dan dia tersenyum: 'Sudah lima bulan jalan bareng, baru sekarang nanya.' Kalian tertawa, lalu saling tahu kabar, saling cemas kalau satu tidak muncul. Persahabatan tua yang datang justru saat kamu kira sudah terlalu tua untuk kawan baru.", effects: { social: 6, happiness: 5 },
          addsRelationship: { id: "kawan_pagi", name: "Teman Jalan Pagi", role: "friend", closeness: 52, alive: true } },
      ]},
    ],
  }),

  e({
    id: "tua_daftar_orang", category: "nostalgia", pool: "quiet", rarity: "uncommon",
    ageMin: 63, ageMax: 92, deferrable: true, mood: "melancholy",
    title: "Orang-orang yang Pernah Singgah",
    prompt: "Malam panjang, kamu mendapati dirimu menghitung orang-orang yang pernah singgah di hidupmu. Teman sebangku yang namanya hilang, tetangga masa kecil, orang di meja sebelah, seseorang di satu perjalanan. Sebagian besar kamu tidak tahu lagi ada di mana.",
    choices: [
      { id: "syukuri", label: "Syukuri bahwa mereka pernah ada", outcomes: [
        { weight: 8, text: "Kamu tidak sedih kehilangan kontak. Kamu hanya kagum betapa banyak orang dibutuhkan untuk membentuk satu orang, kamu. Masing-masing meninggalkan sesuatu yang kecil dan tidak bisa diambil kembali.", effects: { mental: 6, happiness: 4 }, mood: "warm",
          memory: { text: "Malam kamu menghitung semua orang yang pernah singgah.", tag: "waktu", mood: "melancholy" } },
        { weight: 8, text: "Kamu coba hitung mereka semua dan kehilangan hitungan di suatu tempat sekitar masa mudamu. Anehnya, itu tidak membuatmu merasa kecil, malah merasa pernah benar-benar hidup.", effects: { mental: 5, happiness: 3 }, mood: "melancholy",
          memory: { text: "Mencoba menghitung semua orang, dan kehilangan hitungan di masa muda.", tag: "waktu", mood: "melancholy" } },
      ]},
      { id: "cari", label: "Coba cari kabar satu-dua nama", outcomes: [
        { weight: 8, text: "Beberapa sudah pergi mendahului. Satu masih hidup, membalas pesanmu dengan tanda tanya, tidak ingat siapa kamu. Kamu tertawa pelan. Tidak apa-apa diingat oleh hanya satu pihak.", effects: { mental: -2, social: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "tua_lagu_kembali", category: "nostalgia", pool: "quiet", rarity: "rare",
    ageMin: 64, ageMax: 90, requireMemoryTag: "lagu_lama", deferrable: true, mood: "melancholy",
    title: "Lagu Itu, Sekali Lagi",
    prompt: "Tanpa sengaja, lagu itu terdengar lagi. Entah dari radio, entah dari pengeras suara sebuah toko. Lagu yang dulu kamu klaim jadi milikmu sendiri. Tubuhmu masih ingat setiap jeda, meski sebagian besar hal lain sudah lama kamu lepaskan.",
    choices: [
      { id: "diam", label: "Berhenti, dengarkan sampai habis", outcomes: [
        { weight: 8, text: "Untuk tiga menit, kamu kembali jadi remaja di kamar dengan earphone butut, percaya lagu bisa menyelamatkan orang. Mungkin memang bisa. Lihat, kamu masih di sini.", effects: { mental: 6, happiness: 5 }, mood: "warm",
          memory: { text: "Lagu masa remajamu, terdengar lagi di usia tua.", tag: "lagu_lama", mood: "warm" } },
        { weight: 8, text: "Kamu berhenti di tengah jalan, beberapa orang melewatimu dengan heran. Lagu itu memutar ulang seluruh dirimu dalam tiga menit. Syukur sebagian darimu masih bisa dipanggil pulang oleh sebuah melodi.", effects: { mental: 6, happiness: 5 }, mood: "warm",
          memory: { text: "Berhenti di tengah jalan demi lagu yang memanggil pulang dirimu yang dulu.", tag: "lagu_lama", mood: "warm" } },
      ]},
      { id: "ikut", label: "Ikut bersenandung pelan", outcomes: [
        { weight: 8, text: "Suaramu serak sekarang, jauh dari yang dulu. Tidak ada yang memperhatikan orang tua bersenandung di pinggir jalan, dan itu justru membuatmu bebas menyanyikannya sampai bait terakhir.", effects: { happiness: 4, mental: 3 }, mood: "warm" },
        { weight: 8, text: "Kamu bersenandung, dan lupa lirik di tempat yang sama persis seperti dulu, bait kedua. Lima puluh tahun, dan kamu masih tersandung di kata yang sama. Itu membuatmu tertawa pelan, sendirian, di pinggir jalan.", effects: { happiness: 4, mental: 3 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "tua_langit_langit", category: "nostalgia", pool: "quiet", rarity: "uncommon",
    ageMin: 64, ageMax: 92, deferrable: true, mood: "melancholy",
    title: "Setiap Langit-langit yang Pernah Kamu Tatap",
    prompt: "Berbaring memandang langit-langit, kamu teringat semua langit-langit yang pernah kamu tatap dengan cara yang sama. Kamar masa kecil, kamar sempit pertama yang kamu sewa, kamar-kamar di tahun-tahun yang sibuk. Tubuh yang sama, mata yang sama, hanya plafon yang berganti.",
    choices: [
      { id: "telusuri", label: "Telusuri satu per satu dalam ingatan", outcomes: [
        { weight: 8, text: "Kamu hampir bisa mencium bau tiap kamar. Aneh, yang paling lekat justru yang paling sederhana, bukan yang termahal.", effects: { mental: 5, happiness: 3 }, mood: "melancholy",
          memory: { text: "Semua langit-langit yang pernah kamu tatap, dari satu kamar ke kamar lain.", tag: "waktu", mood: "melancholy" } },
        { weight: 8, text: "Satu kamar paling lekat, langit-langitnya bocor, kamu tampung dengan ember, menghitung tetesnya sampai tertidur. Kamu tidak punya apa-apa waktu itu, dan anehnya itu yang paling ingin kamu kunjungi lagi.", effects: { mental: 4, happiness: 3 }, mood: "melancholy",
          memory: { text: "Langit-langit bocor dan ember yang kamu hitung tetesnya sampai tidur.", tag: "waktu", mood: "melancholy" } },
      ]},
      { id: "sekarang", label: "Kembali ke langit-langit yang sekarang", outcomes: [
        { weight: 8, text: "Yang ini pun akan jadi kenangan bagi seseorang, suatu hari. Pikiran itu tidak menakutkanmu lagi seperti dulu. Kamu cukup lelah, dengan cara yang nyaman.", effects: { mental: 4 }, mood: "warm" },
      ]},
    ],
  }),
];
