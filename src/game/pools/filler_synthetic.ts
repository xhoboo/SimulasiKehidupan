import { GameState, LifeEvent, Mood } from "../types";

type Variant = {
  id: string;
  ageMin: number; ageMax: number;
  title: string; prompt: string;
  forbidFlag?: string;
  // Varian tidak muncul kalau SALAH SATU flag ini aktif (NOT-OR). Versi jamak dari
  // forbidFlag, untuk menutup satu beat dari beberapa cabang sekaligus — mis. beat
  // "meeting kantoran" tidak relevan bagi yang bukan pegawai kantor perusahaan
  // (dokter di rumah sakit, seniman di studio, barista/pedagang/freelancer/wirausaha
  // yang punya jalur sendiri). Lihat syn_meeting_kosong.
  forbidAnyFlag?: string[];
  requireFlag?: string; // varian hanya muncul kalau flag ini ada (mis. "punya_anak")
  // Varian hanya muncul kalau MINIMAL SATU flag ini aktif (OR). Dipakai untuk syarat
  // yang secara konsep adalah disjungsi tanpa satu flag tunggal — mis. "sedang
  // menempuh kuliah" benar kalau pemain punya jurusan apa pun (jurusan_kedokteran /
  // _seni / _teknik / _filsafat / _psikologi). Lihat syn_dosen_telat & syn_indomie_pagi.
  requireAnyFlag?: string[];
  // Varian tidak muncul kalau pemain MASIH punya relasi (yang hidup) dengan id ini.
  // Berbeda dari flag: relasi bisa mati (alive:false) tanpa mencabut flag terkait —
  // mis. flag "menikah" tetap menyala setelah pasangan tiada, karena pasangan_pergi
  // (life_stages.ts) hanya killsRelationship "pasangan" tanpa menghapus flag-nya.
  // Dipakai untuk beat yang berasumsi pemain SEDANG SENDIRI: hanya muncul kalau
  // relasi ini tak pernah ada (tak menikah) ATAU sudah tiada (ditinggal pasangan).
  // Lihat syn_kursi_seberang.
  forbidLivingRelationship?: string;
  // Pagari berdasarkan usia anak (= state.age - child_birth_age) supaya narasi
  // tentang anak tetap berkesinambungan dengan usia anak yang sebenarnya.
  requireChildAgeMin?: number;
  requireChildAgeMax?: number;
  // Kelompok tema saling-eksklusif: kalau SATU varian dengan themeGroup yang sama
  // sudah pernah muncul dalam hidup ini, saudara-saudara segrupnya tidak akan muncul
  // lagi — meski id-nya beda dan rentang usianya tidak bertumpuk. Dedup biasa hanya
  // per-id; ini untuk beat yang menggarap "momen yang sama" sekali seumur hidup,
  // mis. menyadari penglihatan menua (syn_kacamata_baca di paruh baya & syn_buku_kacamata
  // di usia lanjut sama-sama soal mata yang melemah). Lihat themeGroupBlocked.
  themeGroup?: string;
  choices: {
    id: string; label: string;
    // Sebuah pilihan boleh berakhir di satu narasi pasti (text+effects), ATAU
    // bercabang ke beberapa hasil berbobot (outcomes) untuk kejadian yang
    // keputusannya ada di tangan orang lain / keberuntungan — mis. peringkat
    // kelas yang ditentukan guru, bukan pemain.
    text?: string; effects?: Record<string, number>; mood?: Mood;
    outcomes?: { weight: number; text: string; effects?: Record<string, number>; mood?: Mood }[];
  }[];
};

// Flag-flag jurusan: pemain dianggap "sedang/pernah menempuh kuliah" kalau punya
// salah satunya. Cocok untuk requireAnyFlag pada beat berlatar kampus (dosen, kelas,
// tugas kelompok) supaya tidak muncul bagi yang gap year / langsung kerja. Sejajar
// helper jalurKuliah di death.ts.
const JURUSAN_FLAGS = [
  "jurusan_kedokteran", "jurusan_seni", "jurusan_teknik",
  "jurusan_filsafat", "jurusan_psikologi",
];

// Pemain dianggap "berdagang / punya usaha sendiri" kalau punya salah satu flag
// ini (pedagang kaki lima dari branch.ts, atau wirausaha — termasuk yang naik
// kelas jadi kios/kedai/toko). Dipakai requireAnyFlag pada beat berlatar dagang
// supaya tidak muncul bagi pegawai/dokter/seniman. Lihat syn_dagang_sepi & syn_pelanggan_lama.
const DAGANG_FLAGS = ["pedagang_kaki_lima", "wirausaha"];

// Pemain dianggap "bekerja sendiri / wiraswasta" — tak punya atasan, tak punya
// jadwal pensiun yang ditentukan orang lain — kalau punya salah satu flag ini:
// pedagang/wirausaha (DAGANG_FLAGS), freelancer, atau seniman yang menjual karyanya
// sendiri. Dipakai forbidAnyFlag pada beat yang berasumsi pekerja bawahan/kantoran.
// Lihat syn_kawan_pensiun, di mana "giliran pensiun" cuma bermakna bagi pegawai.
const WIRASWASTA_FLAGS = [
  ...DAGANG_FLAGS, "freelancer", "freelancer_sukses", "seniman_naik",
];

// Pemain dianggap "yatim/piatu" (kehilangan minimal satu orang tua) kalau punya
// salah satu flag ini. Dipakai requireAnyFlag pada beat yang menyinggung
// kehilangan orang tua supaya hanya muncul untuk hidup yang memang mengalaminya —
// menjaga kontinuitas (tak ada beat duka untuk yang kedua orang tuanya hidup).
// Lihat syn_rumah_lebih_sepi. (Beat spesifik-ibu pakai requireFlag "ibu_meninggal".)
const YATIM_FLAGS = ["ayah_meninggal", "ibu_meninggal"];

export const SYNTH_VARIANTS: Variant[] = [
{ id: "syn_pasir_sd", ageMin: 6, ageMax: 8, title: "Lubang di Halaman",
    prompt: "Kamu menggali lubang di tanah dengan sendok dapur. Tidak ada alasan, hanya ingin tahu seberapa dalam.",
    choices: [
      { id: "lanjut", label: "Gali sampai sendoknya bengkok", text: "Lubangnya sebesar mangkuk. Kamu menimbunnya kembali sebelum ibu tahu. Sebuah rahasia kecil pertama.", effects: { intelligence: 2, mental: 2 } },
      { id: "isi_air", label: "Isi dengan air, jadi 'kolam'", text: "Lumpur sampai paha. Mandimu sore itu butuh dua kali sabun.", effects: { happiness: 3, health: -1 } },
    ],
  },

{ id: "syn_sepeda_jalan", ageMin: 6, ageMax: 9, title: "Sepeda Tanpa Roda Bantu",
    prompt: "Ayah melepas roda bantu sepedamu. 'Coba sendiri,' katanya, sambil memegang jok dari belakang.",
    choices: [
      { id: "kayuh", label: "Kayuh, jangan menoleh", text: "Beberapa meter, lalu sadar ayah sudah lepas sejak tadi. Kamu menjerit antara senang dan marah.", effects: { discipline: 4, happiness: 4 } },
      { id: "berhenti", label: "Berhenti, marah", text: "Ayah tertawa, pasang lagi rodanya. Tahun depan, kamu akan minta dia mencopotnya kembali.", effects: { mental: 1 } },
    ],
  },

{ id: "syn_gigi_tanggal", ageMin: 6, ageMax: 9, title: "Gigi di Bawah Bantal",
    prompt: "Gigi depanmu yang sudah goyang berhari-hari akhirnya lepas. Berdarah sedikit, tapi kamu lebih takjub daripada sakit. Seseorang bilang taruh di bawah bantal.",
    choices: [
      { id: "bantal", label: "Taruh di bawah bantal, tunggu semalaman", text: "Pagi-pagi ada uang receh di sana. Kamu tidak pernah tanya dari mana. Beberapa keajaiban kecil memang lebih baik tidak diselidiki.", effects: { happiness: 4, mental: 2 } },
      { id: "simpan", label: "Simpan di kotak korek api", text: "Gigi kecil itu ada di lacimu bertahun-tahun, sampai suatu hari kamu lupa di mana laci itu. Begitu juga dengan sebagian besar barang yang dulu terasa penting.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_ultah_sepi", ageMin: 6, ageMax: 10, title: "Kue dan Kursi Kosong",
    prompt: "Hari ulang tahunmu. Ada kue, ada balon, ada beberapa kursi yang kamu harap terisi. Tidak semua yang diundang datang.",
    choices: [
      { id: "nikmati", label: "Tetap rayakan dengan yang datang", text: "Yang hadir tertawa cukup keras untuk mengisi kursi-kursi kosong itu. Kamu belajar menghitung yang ada, bukan yang tidak ada.", effects: { happiness: 4, social: 2 } },
      { id: "kecewa", label: "Diam-diam menghitung yang tidak datang", text: "Kamu meniup lilin sambil memikirkan satu nama yang tidak muncul. Ulang tahun pertama yang mengajarkanmu bahwa kehadiran tidak bisa diminta.", effects: { mental: -2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_layangan_putus", ageMin: 6, ageMax: 10, title: "Layangan yang Putus",
    prompt: "Layanganmu putus di langit sore, talinya terkulai pelan ke tanah orang lain. Anak-anak lain sudah berlari mengejar bayangannya.",
    choices: [
      { id: "kejar", label: "Ikut berlari mengejarnya", text: "Kamu berlari bersama yang lain, tertawa, walau tahu yang menangkapnya nanti belum tentu kamu. Mengejar ramai-ramai ternyata lebih seru dari memilikinya.", effects: { happiness: 3, social: 2 } },
      { id: "lepas", label: "Berdiri saja, lihat ia menghilang", text: "Kamu membiarkannya pergi, mengecil jadi titik lalu hilang. Ada rasa kehilangan kecil yang anehnya tidak ingin kamu tukar dengan mengejar.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_upacara_panas", ageMin: 6, ageMax: 11, title: "Upacara Hari Senin",
    prompt: "Barisan upacara. Matahari di ubun-ubun. Pengarah upacara bicara terlalu lama dan kakimu mulai mengirim sinyal protes.",
    choices: [
      { id: "tahan", label: "Tahan, jangan pingsan", text: "Kamu bertahan sampai bubar barisan. Ada kebanggaan aneh dan kecil dalam bertahan untuk sesuatu yang tidak penting.", effects: { discipline: 3 } },
      { id: "pingsan", label: "Duduk, tidak kuat", text: "Kamu dipapah ke UKS, dikipasi teman-teman. Untuk satu pagi, kamu jadi pusat perhatian dengan cara yang tidak kamu rencanakan. Dan sedikit malu.", effects: { social: 2, health: -1 } },
    ],
  },

{ id: "syn_jajan_gerobak", ageMin: 6, ageMax: 11, title: "Lonceng Gerobak Sore",
    prompt: "Lonceng gerobak jajanan terdengar dari ujung gang. Kamu hafal bunyinya sebelum melihat wujudnya. Uang di saku tinggal pas-pasan.",
    choices: [
      { id: "beli", label: "Jajan, habiskan uangnya", text: "Manisnya cuma bertahan sebentar di lidah, tapi sore itu jadi terasa lengkap. Kamu pulang dengan tangan kosong dan hati yang penuh.", effects: { happiness: 3 } },
      { id: "tahan", label: "Tahan, simpan uangnya", text: "Kamu menelan ludah dan membiarkan gerobak itu lewat. Uangnya utuh, tapi sepanjang malam kamu masih membayangkan rasanya.", effects: { discipline: 2, mental: -1 } },
    ],
  },

{ id: "syn_komik_tetangga", ageMin: 7, ageMax: 10, title: "Komik Pinjaman",
    prompt: "Anak tetangga meminjamkan komik. Halamannya kotor bekas minyak gorengan, baunya khas.",
    choices: [
      { id: "baca_habis", label: "Baca sampai habis malam itu", text: "Kamu telat tidur. Bab terakhirnya kamu pikirkan diam-diam selama berhari-hari.", effects: { intelligence: 3, happiness: 3 } },
      { id: "balikin", label: "Kembalikan keesokan harinya", text: "Dia kaget. 'Cepet banget?' Kalian jadi bertukar buku selama dua bulan.", effects: { social: 3 } },
    ],
  },

{ id: "syn_berudu", ageMin: 7, ageMax: 10, title: "Kecebong dalam Toples",
    prompt: "Di selokan belakang ada kecebong hitam berenang-renang. Kamu menciduknya dengan toples bekas, yakin bisa membesarkannya jadi katak.",
    choices: [
      { id: "rawat", label: "Bawa pulang, rawat tiap hari", text: "Tiga hari kemudian airnya keruh dan mereka tidak bergerak lagi. Pelajaran pertama tentang merawat sesuatu yang lebih rapuh dari niatmu.", effects: { mental: -2, intelligence: 2 }, mood: "melancholy" },
      { id: "lepas", label: "Amati sebentar, lalu kembalikan ke selokan", text: "Kamu menumpahkan toplesnya pelan-pelan. Mereka menyebar dan hilang. Tidak memilikinya ternyata terasa lebih ringan.", effects: { mental: 2 } },
    ],
  },

{ id: "syn_warung_es", ageMin: 8, ageMax: 12, title: "Es Lilin Pulang Sekolah",
    prompt: "Pulang sekolah lewat warung Bu Tini. Es lilin warna merah hanya 500 perak. Sisa uang jajan persis cukup.",
    choices: [
      { id: "beli", label: "Beli, makan di jalan", text: "Lidahmu merah sampai di rumah. Ibu pura-pura tidak tahu.", effects: { happiness: 3 } },
      { id: "tabung", label: "Simpan, hari ini puasa jajan", text: "Sebulan kemudian uangmu cukup beli buku tulis cadangan. Kamu merasa pintar tanpa alasan.", effects: { discipline: 3, wealth: 1 } },
    ],
  },

{ id: "syn_peringkat", ageMin: 8, ageMax: 12, title: "Peringkat Dibacakan",
    prompt: "Wali kelas membacakan peringkat dari bawah ke atas. Setiap nama yang disebut, kamu menunggu namamu sendiri.",
    choices: [
      { id: "cemas", label: "Cemas, takut namamu disebut terlalu awal",
        outcomes: [
          { weight: 8, text: "Namamu baru terdengar di urutan paling akhir. Peringkat atas. Senang, tapi juga sadar mulai sekarang kamu harus mempertahankannya. Beban kecil pertama yang menyamar jadi prestasi.", effects: { happiness: 3, discipline: 2 } },
          { weight: 8, text: "Namamu disebut di pertengahan daftar. Jantung yang sempat berdebar itu pelan-pelan turun. Tidak istimewa, tidak buruk, dan kecemasanmu tadi terasa sia-sia.", effects: { mental: 1 } },
          { weight: 8, text: "Namamu disebut lebih awal dari yang kamu harap. Peringkat bawah. Wajahmu panas, dan kamu menghabiskan sisa pembacaan dengan menunduk, berharap tidak ada yang menoleh.", effects: { mental: -2, discipline: 1 }, mood: "melancholy" },
        ],
      },
      { id: "santai", label: "Santai saja, peringkat cuma angka",
        outcomes: [
          { weight: 8, text: "Ternyata namamu di urutan atas. Kamu sendiri yang paling kaget. Pura-pura tenang tadi malah berakhir jadi kejutan yang menyenangkan.", effects: { happiness: 3, intelligence: 1 } },
          { weight: 8, text: "Namamu di tengah, persis seperti yang kamu duga. Kamu duduk di zona yang aman dan samar, dan menemukan ada kenyamanan tersendiri di sana.", effects: { mental: 2 } },
          { weight: 8, text: "Namamu di urutan bawah. Kamu menyangka tidak akan peduli, tapi ada sedikit rasa yang menyelinap, lebih kecil dari kecewa, lebih besar dari tak acuh. Kamu menyimpannya saja.", effects: { mental: 1 }, mood: "melancholy" },
        ],
      },
    ],
  },

{ id: "syn_hujan_pulang", ageMin: 8, ageMax: 13, title: "Hujan di Jalan Pulang",
    prompt: "Bel pulang berbunyi tepat saat hujan turun deras. Kamu tidak bawa payung, dan jemputan belum tentu datang. Teras sekolah pelan-pelan penuh dengan anak yang menunggu langit berbaik hati.",
    choices: [
      { id: "terobos", label: "Nekat terobos, basah-basahan", text: "Kamu basah kuyup sampai rumah, tertawa sepanjang jalan. Dingin yang menyenangkan, dan cerita yang kamu banggakan esoknya di kelas.", effects: { happiness: 3, health: -1 } },
      { id: "tunggu", label: "Tunggu sampai reda", text: "Kamu menunggu sampai teras sepi dan hujan tinggal rintik. Sendirian dengan suara air, kamu belajar bahwa sabar kadang cuma soal tidak ada pilihan lain.", effects: { mental: 1, discipline: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_tukar_bekal", ageMin: 8, ageMax: 13, title: "Tukar Isi Kotak Bekal",
    prompt: "Saat istirahat, temanmu menawarkan menukar lauk. Telur dadarmu ditukar dengan sosisnya. Perdagangan paling adil yang pernah kamu tahu.",
    choices: [
      { id: "tukar", label: "Tukar, sama-sama merasa menang", text: "Kalian bertukar dan keduanya merasa untung. Persahabatan kecil yang dibangun di atas lauk yang ditukar, dan entah kenapa itu yang bertahan lama di ingatan.", effects: { social: 3, happiness: 2 }, mood: "warm" },
      { id: "tolak", label: "Tolak, lebih suka bekal sendiri", text: "Kamu menikmati bekalmu sendiri. Tidak salah, hanya saja kamu memperhatikan mereka yang bertuka lauk tertawa.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_pr_lupa", ageMin: 9, ageMax: 12, title: "PR yang Tertinggal",
    prompt: "Pagi-pagi di gerbang sekolah, kamu sadar PR matematikamu tertinggal di kamar.",
    choices: [
      { id: "bohong", label: "Bilang lupa bawa", text: "Guru menatapmu lama. 'Besok bawa.' Sebuah jeda 24 jam yang terasa seperti seminggu.", effects: { mental: -2 } },
      { id: "nyalin", label: "Salin punya teman saat istirahat", text: "Hasilnya identik, salah tulis yang ikut kamu tiru. Guru tahu, tapi tidak berkomentar.", effects: { intelligence: -1, social: 1 } },
    ],
  },

{ id: "syn_kelompok_belajar", ageMin: 9, ageMax: 13, title: "Tugas Kelompok",
    prompt: "Tugas kelompok. Lima nama di kertas, tapi yang benar-benar mengerjakan terasa seperti hanya kamu. Yang lain 'sibuk'.",
    choices: [
      { id: "kerjakan", label: "Kerjakan semua sendiri biar beres", text: "Nilainya bagus, nama mereka ikut tercantum. Kamu kesal, tapi juga diam-diam suka cara semuanya jadi rapi di tanganmu. Sebuah pola yang akan terus berulang.", effects: { intelligence: 3, discipline: 2, mental: -1 } },
      { id: "tegur", label: "Tegur mereka, minta pembagian adil", text: "Canggung, ada yang ngambek. Tapi dua dari empat itu akhirnya ikut kerja. Pelajaran awal bahwa meminta bagian itu boleh, walau tidak nyaman.", effects: { social: 2, mental: 2 } },
    ],
  },

{ id: "syn_mading_sekolah", ageMin: 10, ageMax: 13, title: "Papan Pengumuman",
    prompt: "Di mading sekolah tertempel daftar lomba, puisi karya siswa, dan satu pengumuman yang ramai dibicarakan. Kamu berdiri di kerumunan kecil, membaca sambil pura-pura tidak terlalu peduli.",
    choices: [
      { id: "ikut", label: "Daftar salah satu lomba yang ditempel", text: "Kamu menulis namamu di formulir. Jantung berdebar. Belum tentu menang, tapi mendaftarkan diri saja sudah terasa seperti keberanian kecil.", effects: { discipline: 2, happiness: 2 } },
      { id: "lihat", label: "Cuma baca, lalu pergi", text: "Kamu hafal semua isi mading tanpa pernah jadi bagian darinya. Membaca dari jauh, tempat yang nyaman sekaligus sepi.", effects: { intelligence: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_piket_kelas", ageMin: 12, ageMax: 15, title: "Kelas yang Pelan-pelan Kosong",
    prompt: "Hari ini giliranmu piket. Teman-teman pulang satu per satu sampai tinggal kamu sendiri, sapu di tangan, kelas mendadak terlalu besar. Matahari sore masuk miring lewat jendela, menyinari debu kapur yang melayang-layang.",
    choices: [
      { id: "rampung", label: "Sapu sampai bersih, hapus papan, baru pulang", text: "Kamu kerjakan sampai tuntas, sendirian. Ada ketenangan ganjil yang tidak kamu duga, seolah ruang itu cuma milikmu sebentar. Kamu pulang paling akhir, dan tidak keberatan.", effects: { discipline: 3, mental: 2 }, mood: "warm" },
      { id: "buru", label: "Asal beres, buru-buru menyusul yang lain", text: "Kamu sapu seadanya dan setengah berlari mengejar teman-teman yang sudah di gerbang. Besok ada bekas kapur yang lupa terhapus, tidak ada yang menegur. Kamu lega, walau sedikit mengganjal.", effects: { social: 2, mental: -1 } },
    ],
  },

{ id: "syn_kantin_utang", ageMin: 12, ageMax: 16, title: "Buku Utang Kantin",
    prompt: "Jajan di kantin tapi uangmu kurang. 'Tulis dulu,' kata penjualnya sambil membuka buku kecil berisi nama-nama yang berutang. Namamu masuk daftar.",
    choices: [
      { id: "lunas", label: "Besok langsung lunasi", text: "Kamu melunasinya keesokan hari sebelum daftarnya makin panjang. Lega yang kecil, tapi mengajarkanmu hal besar tentang menepati.", effects: { discipline: 3 } },
      { id: "lupa", label: "Tunda dulu, masih ada nanti", text: "Utangmu menumpuk diam-diam sampai penjualnya menagih di depan teman-teman. Malu yang seharusnya murah harganya tapi terasa mahal di hari itu.", effects: { mental: -2, social: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_jerawat", ageMin: 13, ageMax: 16, title: "Jerawat Pertama",
    prompt: "Sebuah benjolan merah di dahi. Cermin jadi musuh baru. Kamu menyentuhnya 14 kali sebelum sarapan.",
    choices: [
      { id: "biarkan", label: "Biarkan, jangan dipencet", text: "Tiga hari kemudian hilang sendiri. Pelajaran tentang sabar yang tidak akan kamu ingat lagi saat jerawat berikutnya.", effects: { discipline: 2 } },
      { id: "pencet", label: "Pencet, sembunyikan dengan poni", text: "Bekas merahnya bertahan dua minggu. Poninya bertahan tiga tahun.", effects: { mental: -2 } },
    ],
  },

{ id: "syn_teman_menjauh", ageMin: 13, ageMax: 16, title: "Sahabat yang Berubah Geng",
    prompt: "Sahabat dekatmu mulai duduk dengan kelompok lain. Tidak ada pertengkaran, tidak ada sebab jelas. Hanya kursi di sebelahmu yang pelan-pelan jadi kosong.",
    choices: [
      { id: "bicara", label: "Tanya langsung, walau takut jawabannya", text: "Dia bilang 'nggak ada apa-apa kok' dengan cara yang sebenarnya ada apa-apa. Kalian tetap menyapa, tapi sesuatu sudah bergeser. Perpisahan pertama yang tidak punya nama.", effects: { social: 2, mental: -3 }, mood: "melancholy" },
      { id: "biarkan", label: "Biarkan, cari teman lain", text: "Awalnya sepi, lalu ada wajah-wajah baru. Kamu belajar bahwa lingkar pertemanan itu bernapas. Mengembang, mengempis, berganti orang.", effects: { social: 3, mental: 1 } },
    ],
  },

{ id: "syn_lagu_kaset", ageMin: 13, ageMax: 17, title: "Lagu untuk Seseorang",
    prompt: "Kamu menghabiskan satu sore menyusun daftar lagu untuk seseorang yang bahkan belum tentu akan mendengarkannya. Setiap lagu dipilih seperti kalimat yang tidak berani kamu ucapkan langsung.",
    choices: [
      { id: "beri", label: "Berikan ke dia, walau jantung mau copot", text: "Dia menerimanya, bilang 'makasih ya' dengan senyum yang tidak bisa kamu baca. Kamu tidak pernah tahu apakah lagunya akan didengar. Tapi memberinya saja sudah jadi keberanian terbesarmu tahun itu.", effects: { social: 3, happiness: 3 }, mood: "melancholy" },
      { id: "simpan", label: "Urungkan di detik terakhir", text: "Daftar lagu itu tetap di lacimu. Bertahun kemudian kamu menemukannya dan tidak ingat lagi untuk siapa. Atau pura-pura tidak ingat?", effects: { mental: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_razia_rambut", ageMin: 13, ageMax: 17, title: "Penggaris di Gerbang",
    prompt: "Guru berdiri di gerbang dengan penggaris. Rambut yang kelewat batas dicatat, kuku diperiksa, kaus kaki diukur. Kamu menghitung kemungkinan namamu kena.",
    choices: [
      { id: "aman", label: "Lolos, hari ini selamat", text: "Kamu lolos hari itu. Ada kelegaan aneh dari memenuhi aturan yang kamu sendiri tidak yakin gunanya.", effects: { discipline: 2 } },
      { id: "kena", label: "Kena, digunting di depan barisan", text: "Rambutmu digunting sedikit di depan barisan. Pulang dengan poni miring dan harga diri yang ikut tercukur.", effects: { mental: -2, social: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_surat_kelas", ageMin: 13, ageMax: 17, title: "Surat yang Dilipat Kecil",
    prompt: "Sehelai kertas dilipat kecil-kecil berpindah tangan di belakang punggung guru, menuju kamu. Bisa berisi apa saja. Lelucon, gosip, atau sesuatu yang membuat jantung berdebar.",
    choices: [
      { id: "baca", label: "Buka pelan di balik buku", text: "Isinya biasa saja, tapi proses menerimanya diam-diam itu yang membuat hari sekolah terasa hidup. Kamu menyembunyikan senyum di balik tangan.", effects: { happiness: 2, social: 2 } },
      { id: "simpan", label: "Simpan, baca nanti di rumah", text: "Kamu menyimpannya sampai pulang. Menunda sedikit membuat hal sekecil itu terasa lebih berharga.", effects: { mental: 1 } },
    ],
  },

{ id: "syn_curhat_chat", ageMin: 14, ageMax: 17, title: "Chat Larut Malam",
    prompt: "Lewat tengah malam, seseorang mengirim chat panjang. Curhat. Kamu belum tidur juga.",
    choices: [
      { id: "balas", label: "Balas, dengarkan sampai pagi", text: "Mata sembab di sekolah. Tapi dia memelukmu di kelas tanpa kata. Pelukan itu menjelaskan segalanya.", effects: { social: 4, mental: -1 } },
      { id: "tidur", label: "Read, balas besok pagi", text: "Besoknya dia bilang 'gapapa'. Kalian agak canggung selama dua minggu.", effects: { social: -2, mental: 1 } },
    ],
  },

{ id: "syn_motor_pertama", ageMin: 15, ageMax: 17, title: "Gas Pertama",
    prompt: "Pertama kali memegang gas motor sendiri di gang sepi. Mesin menyala, dan tiba-tiba dunia terasa lebih luas, dan lebih berbahaya.",
    choices: [
      { id: "pelan", label: "Pelan-pelan, rasakan keseimbangannya", text: "Beberapa meter goyah, lalu stabil lagi. Angin di wajah terasa seperti janji bahwa kamu bisa pergi ke mana saja. Kamu mengerti kenapa orang dewasa menyukai ini.", effects: { happiness: 4, discipline: 2 } },
      { id: "ngebut", label: "Tarik gas dalam-dalam", text: "Sebentar terasa hebat, lalu nyaris menabrak pagar. Jantungmu berdebar lama setelah motor berhenti. Kamu menyimpan kejadian ini rapat-rapat dari orangtua.", effects: { happiness: 3, health: -1, mental: -1 } },
    ],
  },

{ id: "syn_ujian_besar", ageMin: 15, ageMax: 17, title: "Malam Sebelum Ujian",
    prompt: "Malam sebelum ujian yang katanya menentukan. Buku terbuka, tapi huruf-hurufnya mulai terbang ke mana-mana. Kamu tidak yakin. Sedang belajar atau hanya menatap?",
    choices: [
      { id: "tidur", label: "Tutup buku, pilih tidur cukup", text: "Pagi harinya kepalamu lebih jernih dari teman-teman yang begadang. Kamu belajar bahwa kadang berhenti adalah strategi, bukan kekalahan. Walaupun hasilnya meleset dari yang diharapkan.", effects: { health: 2, mental: 3, intelligence: 1 } },
      { id: "begadang", label: "Begadang, jejalkan semua sampai subuh", text: "Kamu mengingat setengahnya, lupa setengahnya. Saat ujian, yang muncul justru bagian yang tidak kamu pelajari. Begitulah ujian sering bekerja.", effects: { intelligence: 2, health: -2, mental: -2 } },
    ],
  },

{ id: "syn_jaket_pinjam", ageMin: 15, ageMax: 19, title: "Jaket yang Dipinjamkan",
    prompt: "Seseorang meminjamkan jaketnya saat kamu kedinginan. Baunya asing, lalu pelan-pelan jadi familiar. Kamu lupa, atau pura-pura lupa, untuk mengembalikannya.",
    choices: [
      { id: "kembalikan", label: "Tetap kembalikan, sudah dicuci rapi", text: "Dia bilang 'simpan aja' sambil tersenyum. Kamu menyimpannya sampai bertahun kemudian, jauh setelah kalian tak lagi saling sapa.", effects: { social: 3, happiness: 2 }, mood: "warm" },
      { id: "simpan", label: "Simpan, terlalu canggung dibalikin", text: "Jaket itu tetap di lemarimu, terlalu lama untuk dikembalikan tanpa canggung. Baunya hilang, tapi kamu tidak pernah membuangnya.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_rumah_lebih_sepi", ageMin: 17, ageMax: 34, requireAnyFlag: YATIM_FLAGS, title: "Rumah yang Lebih Sunyi",
    prompt: "Sejak kepergian itu, rumah menyimpan keheningan yang berbeda. Ada satu kursi, satu sudut, satu jam tertentu yang tidak lagi terisi seperti dulu.",
    choices: [
      { id: "isi", label: "Isi sunyinya dengan kesibukan", text: "Kamu menutupinya dengan suara TV, dengan apa saja yang berbunyi. Sebagian berhasil, sebagian hanya menundanya ke malam berikutnya.", effects: { mental: 1 } },
      { id: "diam", label: "Duduk saja, temani keheningannya", text: "Kamu membiarkan sunyi itu ada tanpa buru-buru diisi. Kehilangan tidak selalu butuh ditambal, kadang hanya butuh ditemani.", effects: { mental: -2, happiness: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_simpang_arah", ageMin: 18, ageMax: 19, requireFlag: "gap_year", title: "Persimpangan Tanpa Rambu",
    prompt: "Teman-teman seangkatanmu pelan-pelan mengambil arah masing-masing. ada yang kuliah, ada yang kerja, ada yang menikah cepat. Kamu berdiri di titik yang masih terbuka ke segala arah, dan itu tidak senyaman yang dijanjikan.",
    choices: [
      { id: "pilih", label: "Pilih satu arah, walau ragu", text: "Kamu melangkah ke satu arah. Belum tentu yang terbaik. Berjalan ke arah yang keliru pun mengajarkan lebih banyak daripada diam di persimpangan.", effects: { discipline: 3, mental: 2 } },
      { id: "tunggu", label: "Tunggu sampai arahnya jelas", text: "Kamu menunda memilih, berharap jalannya terang sendiri. Sebagian arah justru menutup diam-diam selama kamu menunggu.", effects: { mental: -2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_buku_sekolah", ageMin: 18, ageMax: 21, title: "Kardus di Pojok Kamar",
    prompt: "Buku dan catatan sekolahmu menumpuk di pojok, tidak lagi terpakai tapi belum tega dibuang. Suatu sore kamu duduk di lantai, memilah mana yang disimpan dan mana yang dilepas.",
    choices: [
      { id: "simpan", label: "Simpan beberapa di dasar lemari", text: "Kamu menyisihkan beberapa ke dasar lemari. Catatan dengan tulisan tangan yang nyaris tidak kamu kenali lagi. Bukan karena berguna, hanya karena membuangnya terasa seperti membuang dirimu yang dulu.", effects: { mental: 2 }, mood: "melancholy" },
      { id: "lepas", label: "Lepas semua", text: "Kamu mengikat semuanya dan menaruhnya di luar. Ada lega yang ringan, lalu sedikit kosong saat pojok itu bersih, seakan ruang itu menunggu diisi sesuatu yang belum kamu punya.", effects: { discipline: 2, mental: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_dosen_telat", ageMin: 18, ageMax: 22, requireAnyFlag: JURUSAN_FLAGS, forbidFlag: "sudah_lulus", title: "Kelas yang Tidak Jadi",
    prompt: "Kamu datang tepat waktu ke kelas. 30 menit kemudian, dosen mengirim WA 'Ibu hari ini ada kondangan ya.'",
    choices: [
      { id: "kantin", label: "Pindah ke kantin, ngobrol seharian", text: "Obrolan kalian bercabang ke topik filsafat dan kabar mantan. Hari yang tidak kamu rencanakan tapi kamu syukuri.", effects: { social: 4, happiness: 3 } },
      { id: "perpus", label: "Ke perpustakaan", text: "Kamu menemukan jurnal random tentang lebah. Aneh, tapi kamu menikmati setiap halamannya.", effects: { intelligence: 3 } },
    ],
  },

{ id: "syn_reuni_papasan", ageMin: 18, ageMax: 24, title: "Berpapasan dengan Masa Lalu",
    prompt: "Di jalan kamu berpapasan dengan teman sekelas dulu. Wajahnya hampir sama, tapi hidupnya sudah melaju ke tempat yang berbeda. Sudah kerja, sudah punya arah.",
    choices: [
      { id: "sapa", label: "Sapa, tukar kabar sebentar", text: "Kalian mengobrol singkat, bertukar kabar yang sebagian dibesar-besarkan. Kamu pulang membawa rasa tertinggal yang kamu coba abaikan sepanjang jalan.", effects: { social: 2, mental: -1 }, mood: "melancholy" },
      { id: "pura", label: "Pura-pura tidak lihat, berbelok", text: "Kamu berbelok sebelum mata kalian bertemu. Lebih mudah daripada menjelaskan di mana persisnya posisimu sekarang.", effects: { mental: -1 } },
    ],
  },

{ id: "syn_ditanya_kapan", ageMin: 18, ageMax: 25, title: "Pertanyaan di Meja Makan",
    prompt: "Di kumpul keluarga, pertanyaannya selalu sama, 'kapan lulus, kapan kerja, kapan nikah.' Diajukan sambil tersenyum, seolah hidup punya jadwal yang kamu lewatkan.",
    choices: [
      { id: "jawab", label: "Jawab seadanya, lalu menyingkir", text: "Kamu menjawab sopan lalu pindah ke sudut yang lebih sepi. Sebagian pertanyaan tidak butuh jawaban, hanya butuh diakhiri.", effects: { social: 1, mental: -1 } },
      { id: "tawa", label: "Tertawakan dengan candaan siap pakai", text: "Kamu membalas dengan candaan yang sudah kamu siapkan. Tameng yang efektif, sampai kamu sendirian lagi nanti malam.", effects: { happiness: 1, mental: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_begadang_masa_depan", ageMin: 18, ageMax: 25, title: "Langit-langit Jam Tiga",
    prompt: "Jam tiga pagi, kamu menatap langit-langit. Pikiran tentang nanti akan jadi apa, akan ada di mana, datang paling keras justru saat tidak ada yang bisa kamu lakukan soal itu.",
    choices: [
      { id: "tulis", label: "Nyalakan lampu, tulis rencana", text: "Kamu menulis rencana di buku. Paginya rencana itu terlihat naif, tapi menuangkannya ke kertas cukup untuk membuatmu tertidur.", effects: { discipline: 2, mental: 1 } },
      { id: "pejam", label: "Paksa tidur, biarkan berputar", text: "Kamu membiarkan pikiran itu berputar sampai lelah sendiri. Pagi datang, dan kekhawatirannya menyusut jadi seukuran hari biasa.", effects: { mental: 1 } },
    ],
  },

{ id: "syn_teman_pindah_kota", ageMin: 18, ageMax: 26, title: "Yang Berangkat Duluan",
    prompt: "Teman dekatmu pindah kota. Kalian berjanji tetap sering kabar-kabaran, dengan keyakinan yang kalian sendiri diam-diam ragukan.",
    choices: [
      { id: "antar", label: "Antar sampai keberangkatan", text: "Pelukan singkat, lalu dia pergi. Kota terasa sedikit lebih asing di perjalanan pulangmu, seakan ikut berangkat sebagian bersamanya.", effects: { social: 3, mental: -2 }, mood: "melancholy" },
      { id: "lepas", label: "Cukup pesan singkat, tak mengantar", text: "Kamu memilih tidak datang ke keberangkatannya, cukup mengirim pesan. Perpisahan yang kamu perkecil supaya tidak terlalu terasa.", effects: { mental: -1 } },
    ],
  },

{ id: "syn_uang_akhir_bulan", ageMin: 18, ageMax: 27, title: "Recehan di Dasar Tas",
    prompt: "Akhir bulan, dompet menipis lebih cepat dari tanggalnya. Kamu mengumpulkan recehan dari dasar tas dan saku jaket, menghitungnya seperti harta.",
    choices: [
      { id: "irit", label: "Bertahan dengan menu seadanya", text: "Kamu menahan diri sampai pemasukan berikutnya. Lapar yang terkendali mengajarkanmu harga dari hal-hal kecil yang dulu kamu remehkan.", effects: { discipline: 3, health: -1 } },
      { id: "pinjam", label: "Pinjam sedikit ke teman", text: "Kamu meminjam, berjanji mengganti, dan memang menggantinya. Tapi ada rasa tidak enak yang ikut kamu catat di kepala.", effects: { social: -1, mental: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_indomie_pagi", ageMin: 19, ageMax: 23, requireFlag: "tinggal_kos", requireAnyFlag: JURUSAN_FLAGS, forbidFlag: "sudah_lulus", title: "Indomie Jam 3 Pagi",
    prompt: "Tugas kelompok belum jadi. Indomie rebus dan telor di kompor kos. Bumbunya tumpah sedikit di meja.",
    choices: [
      { id: "lanjut_kerja", label: "Makan sambil lanjut kerja", text: "Selesai jam 5. Tidur 2 jam. Hari kuliah berikutnya kamu jadi zombie, tapi nilai tugasmu 85.", effects: { discipline: 3, health: -2 } },
      { id: "tidur", label: "Tidur dulu, lanjut subuh", text: "Bangun jam 7. Setengah panik, setengah pasrah. Tugas selesai jam 9 lewat 12, deadlinenya jam 9.", effects: { mental: -2, happiness: 1 } },
    ],
  },

{ id: "syn_kos_jemuran", ageMin: 19, ageMax: 27, requireFlag: "tinggal_kos", title: "Jemuran dan Hujan Mendadak",
    prompt: "Kamu menjemur pakaian pagi tadi sebelum pergi. Siang, hujan turun mendadak, dan tidak ada siapa-siapa di kos yang akan mengangkatnya untukmu.",
    choices: [
      { id: "pasrah", label: "Pasrah, biar basah lagi", text: "Pulang-pulang semuanya basah, lebih bau dari sebelum dicuci. Mandiri ternyata juga berarti tidak ada yang menyelamatkan jemuranmu.", effects: { mental: -1, discipline: 1 }, mood: "melancholy" },
      { id: "titip", label: "Telepon tetangga kos minta tolong", text: "Dia mengangkat jemuranmu sebelum basah betul. Kamu belajar bahwa 'sendiri' tidak harus selalu berarti tanpa siapa-siapa.", effects: { social: 3, happiness: 1 }, mood: "warm" },
    ],
  },

{ id: "syn_kos_lebaran", ageMin: 19, ageMax: 27, requireFlag: "tinggal_kos", title: "Kos di Hari Libur",
    prompt: "Libur panjang, dan kos hampir kosong. Penghuni lain sudah pulang ke rumah masing-masing. Lorong yang biasanya ramai jadi sunyi, dan kamarmu terasa lebih sunyi dari biasanya.",
    choices: [
      { id: "pulang", label: "Ikut pulang", text: "Lelah perjalanan terbayar begitu mencium bau rumah sendiri. Beberapa hari yang singkat, tapi cukup untuk mengisi ulang sesuatu.", effects: { happiness: 4, mental: 2 }, mood: "warm" },
      { id: "tinggal", label: "Tinggal saja", text: "Beberapa hari sendirian di kos yang ditinggalkan semua orang. Kamu belajar betah dengan diri sendiri, walau tidak selalu kamu pilih.", effects: { mental: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_skripsi_buntu", ageMin: 21, ageMax: 23, requireAnyFlag: JURUSAN_FLAGS, forbidFlag: "sudah_lulus", title: "Bab yang Tidak Maju",
    prompt: "Kursor berkedip di halaman yang sama sejak tadi. Satu bab skripsi yang menolak ditulis, sementara dosen menunggu dan temanmu sudah sidang duluan.",
    choices: [
      { id: "paksa", label: "Paksa tulis apa saja, jelek pun jadi", text: "Kamu menulis kalimat-kalimat buruk yang setidaknya bisa direvisi. Halaman kosong ternyata musuh yang lebih besar dari halaman yang salah.", effects: { discipline: 3, intelligence: 1 } },
      { id: "tunda", label: "Tutup laptop, lanjut besok", text: "Besok datang dengan bab yang sama dan rasa bersalah yang lebih menumpuk. Penundaan punya cara mengubah kerikil kecil jadi gunung.", effects: { mental: -2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_wisuda", ageMin: 22, ageMax: 24, requireAnyFlag: JURUSAN_FLAGS, forbidFlag: "sudah_lulus", title: "Toga dan Kursi Penonton",
    prompt: "Hari wisuda. Toga yang gerah, nama yang dipanggil sebentar, dan barisan kursi penonton tempat orang-orang yang menontonmu sampai di titik ini.",
    choices: [
      { id: "nikmati", label: "Nikmati harimu, foto sampai pipi pegal", text: "Selembar ijazah yang harganya jauh lebih mahal dari kertasnya. Untuk satu hari, kelelahan bertahun-tahun terasa terbayar lunas.", effects: { happiness: 5, social: 3 }, mood: "warm" },
      { id: "haru", label: "Cari wajah-wajah tertentu di kursi penonton", text: "Sebagian wajah yang kamu cari ada di sana, sebagian hanya kamu hadirkan dalam kepala. Kamu melambai ke keduanya, sama tulusnya.", effects: { mental: 3, happiness: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_macet_rabu", ageMin: 23, ageMax: 32, title: "Macet Rabu Sore",
    prompt: "Rabu sore, jalanan padat tanpa alasan jelas. Lagu di earphone mengulang lagu yang sudah kamu skip dua kali tadi pagi.",
    choices: [
      { id: "playlist", label: "Ganti ke playlist sendiri", text: "Lagu favoritmu menyala. Macetnya tetap, tapi kamu tidak lagi marah.", effects: { mental: 3 } },
      { id: "hening", label: "Matikan radio, dengarkan suara mesin", text: "Hening dengan suara mesin dan klakson terdengar seperti meditasi murah. Kamu tiba di rumah lebih lega dari biasanya.", effects: { mental: 4 } },
    ],
  },

{ id: "syn_meeting_kosong", ageMin: 24, ageMax: 40,
    forbidAnyFlag: ["jurusan_kedokteran", "dokter_jadi", "jurusan_seni", "seniman_naik", "barista", "pedagang_kaki_lima", "freelancer", "freelancer_sukses", "wirausaha"],
    title: "Meeting yang Bisa Jadi Email",
    prompt: "Satu jam meeting di kantor. Topiknya 'sinkronisasi'. Kamu sudah tahu hasilnya adalah tidak ada hasil.",
    choices: [
      { id: "ikut", label: "Ikut, kamera mati, kerja lain", text: "Kamu menyelesaikan dua tugas selama meeting. Bos memanggil namamu sekali. Kamu menjawab 'setuju'.", effects: { discipline: 2, mental: -1 } },
      { id: "skip", label: "Skip dengan alasan sakit kepala", text: "Tidak ada yang menyadari. Sakit kepalamu jadi nyata setelah 4 jam scroll TikTok.", effects: { mental: -1 } },
    ],
  },

{ id: "syn_undangan_nikah_teman", ageMin: 24, ageMax: 40, forbidFlag: "menikah", title: "Undangan di Meja",
    prompt: "Sebuah undangan pernikahan tergeletak di meja, nama teman yang dulu sama-sama belum punya rencana apa-apa. Sekarang dia yang lebih dulu.",
    choices: [
      { id: "datang", label: "Datang", text: "Kamu hadir, ikut senang dengan tulus, lalu pulang sebelum sesi foto keluarga.", effects: { social: 3, mental: -1 }, mood: "melancholy" },
      { id: "kirim", label: "Kirim hadiah dan ucapan saja", text: "Kamu mengirim hadiah tanpa datang. Lebih mudah merayakan dari jarak yang tidak menuntut penjelasan tentang kabarmu.", effects: { wealth: -2, social: 1 } },
    ],
  },

{ id: "syn_minggu_kosong", ageMin: 24, ageMax: 42, title: "Minggu Tanpa Acara",
    prompt: "Minggu pagi tanpa rencana apa pun. Tidak ada yang menunggumu, tidak ada yang harus dikerjakan. Kebebasan yang sedikit terasa seperti kekosongan.",
    choices: [
      { id: "nikmati", label: "Biarkan hari mengalir tanpa target", text: "Kopi yang panas, waktu yang tidak diburu. Ternyata tidak melakukan apa-apa pun butuh latihan supaya tidak terasa bersalah.", effects: { mental: 4, happiness: 2 }, mood: "warm" },
      { id: "isi", label: "Cari kesibukan biar terasa berguna", text: "Kamu mengisi hari dengan beres-beres. Produktif, tapi kamu lupa kapan terakhir kali benar-benar nyantai.", effects: { discipline: 2, mental: -1 } },
    ],
  },

{ id: "syn_lagu_masa_sma", ageMin: 24, ageMax: 42, title: "Lagu yang Salah Zaman",
    prompt: "Sebuah lagu dari masa sekolahmu mengalun di tempat umum. Liriknya hafal di luar kepala, lengkap dengan siapa yang dulu kamu dengar bersamanya.",
    choices: [
      { id: "dengar", label: "Berhenti sebentar", text: "Kamu membiarkan lagu itu menyeretmu mundur beberapa tahun. Lalu lagunya habis, dan kamu kembali ke antrean kasir tempat kamu berdiri.", effects: { mental: 3, happiness: 2 }, mood: "melancholy" },
      { id: "ganti", label: "Pasang earphone sendiri", text: "Kamu menolak diseret ke belakang oleh tiga menit nostalgia. Hari ini menuntut perhatianmu, dan kamu memberikannya.", effects: { mental: 2 } },
    ],
  },

{ id: "syn_cermin_lelah", ageMin: 24, ageMax: 44, title: "Wajah di Cermin Toilet",
    prompt: "Di cermin toilet, di tengah hari yang biasa, kamu menangkap wajahmu sendiri. Lebih lelah dari yang kamu rasakan, atau mungkin pas seperti yang kamu rasakan.",
    choices: [
      { id: "benahi", label: "Basuh muka, lanjutkan hari", text: "Kamu menarik napas dan keluar seolah tidak terjadi apa-apa. Wajah itu menurut, setidaknya untuk beberapa jam ke depan.", effects: { mental: 2 } },
      { id: "tatap", label: "Tatap beberapa detik lebih lama", text: "Orang di pantulan itu sudah jauh dari yang dulu kamu bayangkan, tapi belum benar-benar asing. Kamu mengangguk padanya, lalu pergi.", effects: { mental: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_nomor_ibu", ageMin: 24, ageMax: 46, requireFlag: "ibu_meninggal", title: "Kontak yang Tak Bisa Dihapus",
    prompt: "Nomor ibu masih tersimpan di ponselmu, di antara kontak yang kamu pakai tiap hari. Kamu tahu tidak akan ada yang mengangkatnya, tapi menghapusnya terasa seperti kehilangan untuk kedua kali.",
    choices: [
      { id: "simpan", label: "Biarkan tetap di sana", text: "Satu nama yang tidak akan pernah kamu hubungi tapi tidak sanggup kamu hilangkan. Sebagian kehadiran ternyata cukup berupa nama di layar.", effects: { mental: -2, happiness: 1 }, mood: "melancholy" },
      { id: "hapus", label: "Hapus pelan-pelan", text: "Jarimu ragu di tombol terakhir, lalu menekannya. Bukan melupakan, hanya berhenti menunggu sesuatu yang tidak akan datang.", effects: { mental: -3 }, mood: "melancholy" },
    ],
  },

{ id: "syn_olahraga_gagal", ageMin: 25, ageMax: 38, title: "Niat Lari Pagi",
    prompt: "Sepatu lari yang baru dibeli sebulan lalu masih di kotaknya. Pagi ini niatmu tinggi.",
    choices: [
      { id: "lari", label: "Pakai, lari 2 km", text: "Pulang dengan paha pegal dan ego yang sembuh. Besoknya, ulangi lagi. Hari ketiga, libur. Hari keempat, lupa.", effects: { health: 3, discipline: 2 } },
      { id: "tunda", label: "Besok aja, hari ini tidur", text: "Sepatunya kembali ke kotak. Tahun depan kamu jual second.", effects: { mental: -1 } },
    ],
  },

{ id: "syn_tidur_lewat_siang", ageMin: 25, ageMax: 42, title: "Bangun Saat Matahari Tinggi",
    prompt: "Akhir pekan, kamu bangun saat matahari sudah tinggi. Setengah lega karena akhirnya cukup tidur, setengah bersalah karena setengah hari sudah hilang.",
    choices: [
      { id: "syukuri", label: "Syukuri istirahatnya, jangan menghukum diri", text: "Tubuh menagih utang tidurnya, dan kamu akhirnya membayar tanpa rasa bersalah. Hari yang lebih pendek tidak selalu hari yang terbuang.", effects: { health: 3, mental: 2 } },
      { id: "kejar", label: "Bangkit, kejar hari yang sudah separuh jalan", text: "Kamu produktif sampai sore, menebus jam-jam yang hilang. Lalu lelah yang sama sudah menunggu di akhir pekan berikutnya.", effects: { discipline: 2, health: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_grup_sd_rame", ageMin: 26, ageMax: 44, title: "Grup yang Tiba-tiba Hidup",
    prompt: "Grup chat teman SD yang bertahun-tahun sunyi mendadak ramai. Ada kabar, ada foto lama yang dibagikan. Nomor-nomor tanpa nama mulai mengaku siapa.",
    choices: [
      { id: "ikut", label: "Ikut ngobrol, tebak-tebak wajah", text: "Kalian menertawakan kenangan yang separuh sudah kabur. Hangat, walau besok grup itu akan sunyi lagi seperti sediakala.", effects: { social: 3, happiness: 2 }, mood: "warm" },
      { id: "baca", label: "Baca semua, tak ikut bicara", text: "Kamu hanya mengamati hidup orang-orang yang dulu dekat dari balik layar. Tempat yang aman.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_belanja_bulanan", ageMin: 26, ageMax: 46, title: "Belanja Bulanan",
    prompt: "Troli, daftar di tangan, lampu supermarket yang sama terangnya kapan pun kamu datang. Ritual dewasa yang tidak pernah diajarkan tapi entah bagaimana kamu kuasai.",
    choices: [
      { id: "rapi", label: "Belanja persis sesuai daftar", text: "Hemat, terkendali, semua tercatat. Ada kepuasan kecil dan agak menyedihkan dari 'menjadi sangat teratur' soal hal sesepele ini.", effects: { discipline: 3, wealth: -2 } },
      { id: "impulsif", label: "Ambil beberapa di luar daftar", text: "Hiburan kecil yang kamu izinkan untuk diri sendiri. Struknya lebih panjang, tapi hari terasa lebih enteng di perjalanan pulang.", effects: { happiness: 2, wealth: -3 } },
    ],
  },

{ id: "syn_tetangga_angguk", ageMin: 28, ageMax: 48, title: "Tetangga yang Tak Dikenal",
    prompt: "Ada tetangga yang setiap hari kamu temui tapi tidak pernah benar-benar kamu kenal. Kalian bertukar anggukan yang sama persis, bertahun-tahun, tanpa pernah naik jadi percakapan.",
    choices: [
      { id: "sapa", label: "Suatu hari sapa lebih dari anggukan", text: "Obrolan canggung lima menit, tapi besoknya anggukan itu terasa sedikit lebih hangat. Kenalan yang terlambat lebih baik daripada tidak.", effects: { social: 2 } },
      { id: "angguk", label: "Biarkan tetap anggukan saja", text: "Kamu membiarkannya tetap di level itu. Ada kenyamanan tersendiri dalam kedekatan yang tidak menuntut apa-apa.", effects: { mental: 1 } },
    ],
  },

{ id: "syn_tagihan", ageMin: 28, ageMax: 50, title: "Tagihan yang Numpuk",
    prompt: "Tiga tagihan datang dalam satu hari. Kamu menatap amplopnya sebelum membukanya, seperti menatap hasil lab.",
    choices: [
      { id: "bayar", label: "Bayar semua sekaligus", text: "Saldonya terkuras. Kamu tidur lebih tenang dengan rekening yang lebih tipis.", effects: { wealth: -5, mental: 4 } },
      { id: "cicil", label: "Cicil, prioritaskan listrik", text: "Lampu tetap nyala. Tagihan lain menunggu giliran, dengan denda kecil.", effects: { wealth: -2, mental: -2 } },
    ],
  },

{ id: "syn_diam_berdua", ageMin: 28, ageMax: 52, requireFlag: "menikah", title: "Diam yang Berdua",
    prompt: "Makan malam bersama pasangan, dan tidak banyak yang dikatakan. Bukan karena marah, hanya diam yang sudah lama kalian tinggali bersama.",
    choices: [
      { id: "nyaman", label: "Nikmati, ini juga bentuk dekat", text: "Bisa diam di dekat seseorang tanpa harus mengisi tiap jeda, itu keintiman yang tidak diiklankan siapa pun. Sunyi yang tidak menakutkan, justru menenangkan.", effects: { mental: 4, happiness: 2 }, mood: "warm" },
      { id: "resah", label: "Cari sesuatu untuk diucapkan", text: "Kamu sedikit takut pada apa arti diam ini. Pasanganmu menyodorkan lauk tanpa bicara, dan entah kenapa itu menjawab sebagian kekhawatiranmu.", effects: { mental: 1, social: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_dagang_sepi", ageMin: 28, ageMax: 52, requireAnyFlag: DAGANG_FLAGS, title: "Hari yang Sepi Pembeli",
    prompt: "Seharian dagangan nyaris tak tersentuh. Kamu duduk memperhatikan orang-orang yang lewat tanpa menoleh, menghitung diam-diam apakah cukup untuk hari ini.",
    choices: [
      { id: "bertahan", label: "Tetap buka sampai sore", text: "Kamu percaya satu-dua pembeli masih mungkin datang. Bertahan di hari sepi adalah bagian dari pekerjaan yang tidak ada di bayanganmu dulu.", effects: { discipline: 3, mental: -1 } },
      { id: "tutup", label: "Tutup lebih awal", text: "Kamu pulang menyimpan sisa tenaga untuk besok. Tidak ada yang menghukummu kalau tutup cepat, dan justru itu yang kadang terasa salah.", effects: { mental: -1, health: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_temen_lama", ageMin: 30, ageMax: 45, title: "Pesan dari Nomor Lama",
    prompt: "Sebuah nama lama muncul di WhatsApp. 'Lagi di kotamu nih, ngopi yuk?'",
    choices: [
      { id: "iya", label: "Iya. Nama tempat dan jam.", text: "Dua jam ngobrol seperti tidak pernah berpisah. Tapi setelah itu, kalian kembali tidak menghubungi selama 5 tahun lagi.", effects: { social: 4, happiness: 3 } },
      { id: "tunda", label: "'Lagi sibuk, kapan-kapan ya'", text: "Kapan-kapan tidak pernah datang. Kalian sama-sama tahu itu.", effects: { social: -2, mental: -2 } },
    ],
  },

{ id: "syn_kebiasaan_pasangan", ageMin: 30, ageMax: 55, requireFlag: "menikah", title: "Kebiasaan yang Hafal",
    prompt: "Kamu hafal kebiasaan kecil pasanganmu. Caranya mengaduk kopi, urutan mematikan lampu, dengkur halus sebelum benar-benar tidur. Hal-hal yang dulu tak kamu sadari, kini jadi penanda rumah.",
    choices: [
      { id: "syukuri", label: "Diam-diam syukuri", text: "Pemandangan yang terlalu biasa untuk difoto tapi terlalu penting untuk dilupakan. Cinta yang sudah berubah jadi keseharian, dan kamu menyukainya begitu saja.", effects: { happiness: 3, mental: 3 }, mood: "warm" },
      { id: "jenuh", label: "Akui kadang terasa berulang", text: "Kebiasaan yang sama bisa terasa seperti putaran tanpa akhir. Kamu menahan keluhan, ingat bahwa kamu pun pasti punya kebiasaan yang membuatnya jenuh.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_pelanggan_lama", ageMin: 30, ageMax: 55, requireAnyFlag: DAGANG_FLAGS, title: "Pelanggan yang Selalu Datang",
    prompt: "Ada satu pelanggan yang sudah datang sejak entah kapan, hafal kebiasaannya, hafal pesanannya. Kalian tidak pernah benar-benar berteman, tapi kehadirannya jadi penanda bahwa usahamu masih berarti.",
    choices: [
      { id: "sapa", label: "Sapa seperti biasa, lebihkan sedikit", text: "Kesetiaan kecil dibalas kesetiaan kecil. Cukup untuk menghangatkan satu hari.", effects: { social: 3, happiness: 2 }, mood: "warm" },
      { id: "renung", label: "Layani sewajarnya", text: "Kamu memilih tetap sebatas penjual dan pembeli, tidak menambah apa-apa. Ketika suatu hari ia berhenti datang tanpa kabar, yang tersisa hanya tempat yang dulu selalu ia tempati, dan kamu tak tahu harus merindukan apa.", effects: { mental: -2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_atap_bocor", ageMin: 30, ageMax: 56, requireFlag: "punya_rumah", title: "Noda di Langit-langit",
    prompt: "Sebuah noda basah melebar di langit-langit rumahmu sejak hujan kemarin. Rumah milik sendiri berarti tidak ada yang bisa kamu telepon selain tukang, dan dompetmu sendiri.",
    choices: [
      { id: "perbaiki", label: "Panggil tukang, perbaiki sekarang", text: "Biaya yang tidak direncanakan keluar begitu saja. Punya rumah ternyata sebagian besar juga memperbaiki rumah, terus-menerus.", effects: { wealth: -3, discipline: 2 } },
      { id: "ember", label: "Taruh ember dulu, tunda nanti", text: "Bunyi tetesan ke ember itu menemani malammu. Pengingat pelan dari satu hal lagi yang kamu tunda 'sampai nanti'.", effects: { mental: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_pagar_ngobrol", ageMin: 30, ageMax: 56, requireFlag: "punya_rumah", title: "Obrolan di Atas Pagar",
    prompt: "Tetangga sebelah menyapamu dari balik pagar saat kamu menyiram tanaman. Obrolan ringan soal cuaca, harga-harga, politik picisan.",
    choices: [
      { id: "ngobrol", label: "Layani, ngobrol lebih lama", text: "Mengakar di satu tempat ternyata punya hadiah kecil. Wajah-wajah yang tahu kamu sudah lama tinggal di sini, yang menandai kepulanganmu tiap sore.", effects: { social: 3, happiness: 2 }, mood: "warm" },
      { id: "singkat", label: "Balas seperlunya, lalu masuk", text: "Ramah secukupnya, menjaga jarak yang kamu rasa nyaman. Di rumah yang kamu pilih sendiri, kamu juga harus memilih sedekat apa pada sekitarmu.", effects: { mental: 1 } },
    ],
  },

{ id: "syn_orangtua_tua", ageMin: 33, ageMax: 45, forbidFlag: "ibu_meninggal", title: "Foto Ibu di HP",
    prompt: "Kamu scroll foto, menemukan satu foto ibu yang kamu ambil diam-diam minggu lalu. Tangannya tampak lebih tua dari yang kamu kira.",
    choices: [
      { id: "telepon", label: "Telepon sekarang juga", text: "Dia kaget, 'Ada apa?' Kalian ngobrol hampir sejam soal hal-hal yang besoknya kamu lupa.", effects: { mental: 5, social: 4 } },
      { id: "simpan", label: "Simpan, jadwalkan pulang akhir bulan", text: "Akhir bulan sibuk. Kamu menunda, lagi.", effects: { mental: -3 } },
    ],
  },

{ id: "syn_foto_galeri", ageMin: 40, ageMax: 52, title: "Foto Lama di Galeri",
    prompt: "Jarimu menggulir terlalu jauh di galeri ponsel, sampai ke foto belasan tahun lalu. Wajah itu kamu, tapi keyakinannya bukan lagi milikmu.",
    choices: [
      { id: "pandang", label: "Pandangi sebentar, lalu tutup", text: "Kamu menatap orang yang dulu begitu yakin akan ke mana hidupnya pergi. Kamu tidak iri padanya, hanya ingin memberitahunya bahwa semuanya akan baik-baik saja. Kurang-lebih.", effects: { mental: 2 }, mood: "melancholy" },
      { id: "kirim", label: "Kirim ke teman yang juga ada di foto itu", text: "Dia balas dengan tawa: 'Astaga, muda banget kita.' Sedetik, jarak belasan tahun itu menutup sendiri.", effects: { social: 3, happiness: 2 }, mood: "warm" },
    ],
  },

{ id: "syn_seusia_ortu", ageMin: 41, ageMax: 52, title: "Seusia Orang Tuamu Dulu",
    prompt: "Kamu sadar umurmu sekarang persis seperti umur orang tuamu di kenangan paling awal tentang mereka. Dulu mereka tampak begitu tahu segalanya.",
    choices: [
      { id: "hitung", label: "Hitung ulang, pastikan tidak salah", text: "Tidak salah. Mereka seusia ini saat kamu mengira mereka raksasa yang tak pernah ragu. Kamu masih menebak-nebak tiap hari, dan membayangkan mungkin mereka dulu juga begitu.", effects: { mental: 3 }, mood: "melancholy" },
      { id: "simpan", label: "Simpan saja kesadaran itu", text: "Kamu tidak melakukan apa-apa dengan pikiran itu. Hanya membawanya seharian, seperti kerikil kecil yang kamu masukkan ke saku.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_teman_baru_terakhir", ageMin: 42, ageMax: 53, title: "Teman Baru Terakhir",
    prompt: "Seseorang bertanya kapan terakhir kali kamu punya teman baru yang benar-benar teman, bukan rekan kerja atau kenalan. Kamu menghitung mundur, dan angkanya mengejutkanmu.",
    choices: [
      { id: "ubah", label: "Akui, lalu iyakan satu ajakan yang biasanya kamu tolak", text: "Canggung, tapi tidak seburuk yang kamu takutkan. Pertemanan ternyata juga butuh dirawat untuk tetap tumbuh.", effects: { social: 3, mental: 2 } },
      { id: "bahu", label: "Angkat bahu, 'orang dewasa memang begitu'", text: "Kamu menormalkannya saja.", effects: { mental: -1, social: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_kacamata_baca", ageMin: 44, ageMax: 56, themeGroup: "penglihatan_menua", title: "Menu yang Menjauh",
    prompt: "Di rumah makan, kamu mendapati dirimu menjauhkan menu dari wajah supaya hurufnya jelas. Pelayan menunggu, dan kamu pura-pura masih memilih.",
    choices: [
      { id: "akui", label: "Akhirnya beli kacamata baca", text: "Dunia jadi tajam lagi dari jarak dekat. Harganya adalah mengakui satu hal kecil yang tidak bisa ditawar lagi.", effects: { intelligence: 2, health: 1 } },
      { id: "tunda", label: "Tahan dulu, andalkan cahaya terang", text: "Kamu menjauhkan tangan dan mencari lampu yang lebih benderang. Menunda mengakui sesuatu yang toh akan menang juga pada akhirnya.", effects: { mental: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_reuni_undangan", ageMin: 45, ageMax: 57, title: "Ajakan Reuni",
    prompt: "Pesan masuk. Ajakan reuni angkatan, lengkap dengan daftar nama yang akan datang. Beberapa nama membuatmu tersenyum, beberapa membuatmu ragu untuk hadir.",
    choices: [
      { id: "datang", label: "Datang, lihat siapa yang masih sama", text: "Sebagian wajah hampir tak dikenali, sebagian persis seperti dulu. Malam itu kamu sempat jadi usia 17 lagi, lalu pulang dengan dada yang penuh.", effects: { social: 4, happiness: 3 }, mood: "warm" },
      { id: "lewat", label: "Tak datang, cukup ikuti dari foto", text: "Kamu mengikuti kabarnya dari foto yang beredar saja. Sebagian kenangan lebih utuh kalau tidak ditimpa versi sekarang dari orang-orangnya.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_punggung_sakit", ageMin: 45, ageMax: 60, title: "Punggung yang Mengingatkan",
    prompt: "Bangun pagi, punggungmu protes pelan. Bukan sakit, hanya mengingatkan, kamu sudah bukan yang dulu.",
    choices: [
      { id: "stretching", label: "Stretching 10 menit", text: "Berkurang. Kebiasaan baru lahir, dan mungkin akan menyelamatkanmu beberapa waktu ke depan.", effects: { health: 4, discipline: 3 } },
      { id: "abaikan", label: "Abaikan. Lanjutkan hari", text: "Sore hari, sakitnya pindah ke leher. Tubuh menagih perhatian dengan caranya.", effects: { health: -3 } },
    ],
  },

{ id: "syn_anak_pergi", ageMin: 48, ageMax: 60, requireFlag: "punya_anak", forbidFlag: "anak_meninggal", requireChildAgeMin: 19, title: "Kamar yang Sepi",
    prompt: "Kamar anakmu kosong sejak dia pindah kota. Kamu masuk ke sana sore ini. Tidak ada yang perlu dikerjakan di sana.",
    choices: [
      { id: "rapi", label: "Rapikan, simpan barangnya di kotak", text: "Kotak itu kamu beri label namanya. Suatu hari dia akan datang dan tertawa melihatnya.", effects: { mental: 3 } },
      { id: "biarkan", label: "Biarkan, tutup pintunya", text: "Kamu menutup pintu pelan. Tidak setiap ruangan harus diisi ulang.", effects: { mental: -2 } },
    ],
  },

{ id: "syn_anak_tetangga_gede", ageMin: 50, ageMax: 63, title: "Anak Tetangga yang Meninggi",
    prompt: "Anak tetangga yang dulu kamu lihat belajar jalan sekarang menjulang melewatimu di gang, menyapa 'om/tante' dengan suara yang sudah berat. Kamu balas seperlunya, lalu berdiri lebih lama dari diperlukan.",
    choices: [
      { id: "balas", label: "Ngobrol sebentar, tanyakan kabarnya", text: "Dia bercerita singkat soal kuliahnya, lalu pamit. Kamu ingat tingginya dulu sebatas lututmu. Waktu lewat secara samar di tubuhmu sendiri, tapi ia lewat dengan jelas di tubuh orang lain.", effects: { mental: 3, social: 1 }, mood: "melancholy" },
      { id: "diam", label: "Cuma mengangguk, lanjut jalan", text: "Kamu tidak banyak bicara. Tapi sepanjang sisa jalan, kamu menghitung diam-diam. Berarti sudah selama itu kamu tinggal di sini.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_cek_kesehatan", ageMin: 50, ageMax: 64, title: "Sebagian Besar Normal",
    prompt: "Hasil cek kesehatan tahunan ada di amplop. Dokter bilang 'sebagian besar normal'. Tiga kata terakhir itu yang menempel di kepalamu.",
    choices: [
      { id: "baca", label: "Baca semua angkanya pelan-pelan", text: "Sebagian besar memang normal. Yang tidak, kamu lingkari untuk ditanyakan. Tubuh mulai mengirim laporan yang harus dibaca lebih serius daripada dulu.", effects: { health: 2, discipline: 3 } },
      { id: "simpan", label: "Simpan, 'sebagian besar' sudah cukup", text: "Kamu memasukkannya kembali ke amplop. Memang, tidak semua yang tak dibaca berarti tidak ada. Tapi untuk hari ini, kamu memilih untuk tenang.", effects: { mental: 2, health: -1 } },
    ],
  },

{ id: "syn_warung_langganan_tutup", ageMin: 50, ageMax: 65, forbidFlag: "barista", title: "Warung yang Akhirnya Digembok",
    prompt: "Warung langganan yang sudah kamu datangi sejak entah kapan akhirnya tutup. Pemiliknya pensiun, katanya. Pintunya dirantai dengan gembok yang masih baru.",
    choices: [
      { id: "kenang", label: "Berdiri sebentar, ingat-ingat", text: "Kamu hafal di mana dulu kursimu, rasa kopi yang belasan tahun tidak berubah. Sekarang cuma etalase kosong. Sebagian rutinitas hilang begitu saja, dan kita baru menyadarinya saat sudah dikunci.", effects: { mental: -2 }, mood: "melancholy" },
      { id: "cari_baru", label: "Cari warung lain, lanjutkan hidup", text: "Ada warung baru dua blok dari situ. Kopinya beda, kursinya beda. Kamu duduk juga akhirnya, karena kamu tetap harus singgah di satu tempat.", effects: { mental: 1 } },
    ],
  },

{ id: "syn_ulang_tahun_bulat", ageMin: 50, ageMax: 68, title: "Angka yang Bulat",
    prompt: "Ulang tahun dengan angka yang bulat, angka yang dulu terdengar seperti milik orang lain, orang yang jauh lebih tua. Sekarang angka itu milikmu.",
    choices: [
      { id: "rayakan", label: "Rayakan kecil-kecilan saja", text: "Kue, beberapa wajah, lilin yang sekarang lebih banyak dari jumlah yang dulu kamu sanggup hitung. Kamu meniupnya tanpa permintaan khusus.", effects: { happiness: 4, mental: 3 } },
      { id: "diam", label: "Lewati diam-diam, seperti hari biasa", text: "Kamu memilih tidak mengumumkannya. Hari berjalan biasa, dan justru itu yang kamu syukuri. Tidak semua angka harus dibuat besar.", effects: { mental: 4 } },
    ],
  },

{ id: "syn_kalender_tak_ditandai", ageMin: 50, ageMax: 72, title: "Kalender yang Tak Lagi Ditandai",
    prompt: "Kalender dinding masih kamu ganti tiap tahun, tapi kamu sadar sudah lama tidak melingkari tanggal apa pun di sana. Dulu ada janji, ada acara, ada hari yang ditunggu, ditandai memakai pulpen merah.",
    choices: [
      { id: "lingkari", label: "Lingkari satu tanggal, apa saja, biar ada yang ditunggu", text: "Kamu lingkari satu hari di minggu depan. Kecil, tapi cukup untuk membuat satu titik di depan terasa seperti tujuan.", effects: { mental: 3, happiness: 2 } },
      { id: "biarkan", label: "Biarkan bersih", text: "Tidak semua hari perlu ditandai untuk tetap dijalani. Tapi pulpen merah itu kamu simpan, untuk berjaga.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_uban_semir", ageMin: 52, ageMax: 62, title: "Botol Semir di Laci",
    prompt: "Ubanmu sekarang lebih banyak dari yang bisa dicabuti satu-satu. Botol semir di laci sudah lama tidak kamu buka.",
    choices: [
      { id: "biarkan", label: "Biarkan saja, sudah waktunya", text: "Kamu menutup laci tanpa mengambilnya. Ada kelegaan kecil dari berhenti menyembunyikan sesuatu yang toh akan menang juga.", effects: { mental: 4, happiness: 2 } },
      { id: "semir", label: "Semir sekali lagi", text: "Hitam lagi untuk beberapa minggu. Tapi di akar rambut, garis putih itu tetap tumbuh, sabar menunggu gilirannya.", effects: { happiness: 2, mental: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_kawan_pensiun", ageMin: 52, ageMax: 64, forbidAnyFlag: WIRASWASTA_FLAGS, title: "Yang Berhenti Duluan",
    prompt: "Seorang kawan seangkatan mengabari. Dia berhenti bekerja mulai bulan depan. 'Capek,' katanya, tapi nada suaranya lebih ke lega. Kamu menghitung diam-diam berapa tahun lagi giliranmu.",
    choices: [
      { id: "ikut_senang", label: "Ucapkan selamat", text: "Kamu ikut senang, dan sedikit iri yang kamu sembunyikan dengan baik. Ada orang yang tahu kapan harus berhenti.", effects: { social: 3, mental: 2 } },
      { id: "renung", label: "Pulang, hitung sisa tahunmu sendiri", text: "Malamnya kamu menghitung berapa tahun lagi, berapa pagi lagi seperti ini. Angkanya tidak terlalu menakutkan, tapi juga tidak membuatmu lega.", effects: { mental: 3 }, mood: "melancholy" },
    ],
  },

{ id: "syn_hitung_pensiun", ageMin: 52, ageMax: 64, forbidAnyFlag: WIRASWASTA_FLAGS, title: "Sisa Tahun Kerja",
    prompt: "Kamu menghitung tabungan dan berapa tahun kerja yang tersisa. Angkanya tidak menakutkan, tapi juga tidak selega yang dulu kamu bayangkan saat masih muda.",
    choices: [
      { id: "rencana", label: "Susun ulang rencananya", text: "Kamu membuat daftar, memotong yang tidak perlu. Merencanakan masa tua ternyata, sebagian besar, adalah berdamai dengan angka.", effects: { discipline: 3, wealth: 1 } },
      { id: "cukupkan", label: "Cukup-cukupkan saja", text: "Kamu menutup buku catatan. Akan ada jalannya, kira-kira begitu. Keyakinan yang setengah doa, setengah lelah.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_pagar_cat_ulang", ageMin: 52, ageMax: 76, title: "Pagar yang Dicat Ulang",
    prompt: "Cat pagar mulai mengelupas lagi. Kamu ingat terakhir mengecatnya, beberapa tahun lalu, atau lebih, kamu tidak yakin. Tahun-tahun belakangan punya kebiasaan menyatu jadi satu warna.",
    choices: [
      { id: "kerjakan", label: "Beli cat, kerjakan sendiri akhir minggu ini", text: "Punggungmu pegal sebelum selesai separuh, jadi kamu lanjutkan besoknya. Dua hari untuk sesuatu yang dulu kamu kebut sesore. Tapi pagar itu kembali rapi, dan kamu menatapnya lebih lama dari yang diperlukan.", effects: { discipline: 3, happiness: 3 } },
      { id: "tunda", label: "Tunda lagi, toh cuma pagar", text: "Kamu menundanya seperti tahun lalu. Pengelupasan itu pelan, sabar, mirip banyak hal lain di usia ini yang kamu biarkan saja berjalan.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_kursi_prioritas", ageMin: 53, ageMax: 66, title: "Kursi yang Ditawarkan",
    prompt: "Di angkutan yang penuh, anak muda berdiri dan menawarkan kursinya padamu. Pertama kali ini terjadi. Kamu tidak yakin harus berterima kasih atau merasa sedikit terluka.",
    choices: [
      { id: "terima", label: "Terima, ucapkan terima kasih", text: "Kamu duduk, berterima kasih dengan tulus. Anak muda itu tidak tahu betapa banyak yang baru saja ia katakan tanpa sengaja. Kamu menatap jendela sepanjang sisa jalan.", effects: { mental: 2, social: 1 }, mood: "melancholy" },
      { id: "tolak", label: "Tolak halus, 'masih kuat kok'", text: "Kamu menolak sambil tersenyum, berdiri sampai tujuan dengan kaki yang sebenarnya protes. Gengsi kecil yang kamu bayar dengan betis pegal. Tidak apa, untuk hari ini.", effects: { happiness: 1, health: -1 } },
    ],
  },

{ id: "syn_takaran_nasi", ageMin: 54, ageMax: 64, title: "Takaran yang Tak Ikut Menyusut",
    prompt: "Tanganmu masih menakar beras dengan ukuran yang sama seperti dulu, waktu meja makan ini lebih ramai. Tiap kali nasi tersisa di periuk, kamu baru ingat bahwa yang makan di sini sekarang lebih sedikit dari yang diukur tanganmu.",
    choices: [
      { id: "kurangi", label: "Kurangi takarannya mulai besok", text: "Kamu menakar separuh dari biasanya. Periuk yang lebih kecil terasa lebih jujur, walau ada sesuatu yang hilang saat berhenti memasak untuk orang yang tidak lagi datang.", effects: { mental: 3, discipline: 1 }, mood: "melancholy" },
      { id: "tetap", label: "Masak seperti biasa, sisanya bisa untuk besok", text: "Kamu tetap menanak sebanyak dulu, lalu memanaskan sisanya esok hari. Seolah, selama takarannya tidak berubah, meja ini belum benar-benar menyusut.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_grup_alumni_duka", ageMin: 54, ageMax: 67, title: "Grup yang Berubah Isi",
    prompt: "Grup alumni yang dulu penuh lelucon dan rencana reuni sekarang lebih sering berisi kabar duka. Kamu tidak ingat kapan persisnya rasionya berbalik.",
    choices: [
      { id: "takziah", label: "Kirim ucapan, ikut berduka", text: "Kamu mengetik belasungkawa untuk nama yang secara samar kamu ingat wajahnya. Jari-jarimu mulai hafal kalimat ini. Itu saja sudah cukup menyedihkan.", effects: { mental: -2, social: 1 }, mood: "melancholy" },
      { id: "japri", label: "Japri satu kawan yang masih ada, ajak ngopi", text: "Daripada menunggu giliran nama itu muncul di sana, kamu mengajaknya ketemu minggu ini. Dia langsung balas 'Ayo, sebelum kita cuma jadi pesan di grup itu.'", effects: { social: 4, mental: 2 }, mood: "warm" },
    ],
  },

{ id: "syn_rumah_besar", ageMin: 55, ageMax: 68, requireFlag: "rumah_besar", title: "Ruang yang Tak Lagi Dimasuki",
    prompt: "Ada ruangan di rumah ini yang sudah berbulan-bulan tidak kamu masuki. Rumah ini terasa lebih besar dari yang kamu butuhkan sekarang.",
    choices: [
      { id: "tutup", label: "Tutup saja pintunya, hemat tenaga", text: "Kamu menutup pintu kamar itu pelan. Tidak semua ruang harus dipakai untuk tetap jadi milikmu.", effects: { mental: 2 }, mood: "melancholy" },
      { id: "fungsikan", label: "Ubah jadi ruangan yang kamu pakai", text: "Kamu memindahkan kursi dan tanaman ke sana, menjadikannya sudut baca. Rumah besar bisa menyusut jadi pas kalau kamu mengaturnya ulang.", effects: { happiness: 3, discipline: 2 } },
    ],
  },

{ id: "syn_cucu_pertama", ageMin: 58, ageMax: 72, requireFlag: "punya_anak", forbidFlag: "anak_meninggal", title: "Tangan Kecil Itu",
    prompt: "Cucu pertamamu menggenggam jarimu. Kamu duduk di sofa rumah anakmu dan tiba-tiba kamu ingat, kamu pernah seukuran ini.",
    choices: [
      { id: "diam", label: "Diam, biarkan waktu berjalan pelan", text: "Tidak ada yang perlu dikatakan. Genggaman itu sudah cukup sebagai kalimat.", effects: { happiness: 8, mental: 7 }, mood: "warm" },
      { id: "cerita", label: "Bisikkan sesuatu padanya", text: "Dia tentu tidak mengerti. Tapi kamu merasa seperti menitipkan sesuatu. Sesuatu yang tidak punya nama.", effects: { mental: 6, happiness: 5 }, mood: "warm" },
    ],
  },

{ id: "syn_telepon_anak_pagi", ageMin: 58, ageMax: 75, requireFlag: "punya_anak", forbidFlag: "anak_meninggal", title: "Suara yang Sibuk",
    prompt: "Kamu menelepon anak pagi-pagi. Diangkat, tapi suaranya terdengar terburu-buru. 'Ada apa, pa/ma?' Kamu tahu dia sedang di tengah sesuatu.",
    choices: [
      { id: "singkat", label: "Singkat saja, bilang hanya salam", text: "Dia berkata 'makasih ya' dan menutup telepon. Satu menit, tapi terasa penuh.", effects: { mental: 3, happiness: 3 } },
      { id: "panjang", label: "Cerita juga, walau dia sibuk", text: "Dia mendengarkan sambil setengah kerja. Kamu tahu, tapi kamu terus bercerita.", effects: { social: 2, mental: -1 } },
    ],
  },

{ id: "syn_musim_penanda", ageMin: 58, ageMax: 90, title: "Tahun yang Diukur dari Musim",
    prompt: "Kamu sadar tidak lagi mengingat tahun dari kejadian besar, tapi dari musim. 'Itu waktu hujan deras yang membocorkan genteng', 'itu kemarau yang panjang sekali'. Peristiwa makin jarang, jadi cuaca yang mengambil alih tugas menandai waktu.",
    choices: [
      { id: "catat", label: "Catat satu hal kecil tahun ini, biar ada penanda", text: "Kamu menulis di balik kalender, tahun ini pohon di depan berbuah lebat. Bukan peristiwa besar, tapi cukup untuk membedakan tahun ini dengan tahun yang lain.", effects: { mental: 3, intelligence: 1 } },
      { id: "serahkan", label: "Biarkan musim yang mencatat", text: "Kamu menyerahkannya pada hujan dan kemarau. Mungkin memang begitu cara waktu bekerja di usia ini. Bukan lewat catatan, tapi lewat langit yang basah lalu kering, bergantian.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_berkebun_tua", ageMin: 60, ageMax: 80, title: "Tanah di Bawah Kuku",
    prompt: "Pagi tadi kamu menanam beberapa bibit di pot depan rumah. Tidak besar, tidak penting, hanya sesuatu yang ingin tumbuh.",
    choices: [
      { id: "siram", label: "Siram, perhatikan setiap hari", text: "Dua minggu kemudian tunas pertama muncul. Kamu memberitahu tetangga seperti mengabarkan berita baik.", effects: { happiness: 5, mental: 5 } },
      { id: "lupa_siram", label: "Sering lupa menyiram", text: "Daunnya menguning. Kamu menanam lagi. Ada sesuatu tentang mulai ulang yang tidak terasa kalah.", effects: { mental: 2 } },
    ],
  },

{ id: "syn_kenangan_kuliner", ageMin: 60, ageMax: 80, forbidFlag: "pedagang_kaki_lima", title: "Aroma yang Salah Tempat",
    prompt: "Di pinggir jalan, kamu mencium aroma masakan yang langsung membawamu ke suatu momen puluhan tahun lalu. Badanmu berhenti berjalan sebelum pikiranmu sadar.",
    choices: [
      { id: "beli", label: "Cari sumbernya, makan di sana", text: "Rasanya tidak persis sama. Tapi itu tidak masalah. Kamu hanya ingin duduk sebentar di tempat yang sama.", effects: { happiness: 5, mental: 4 }, mood: "warm" },
      { id: "lanjut", label: "Berjalan terus, simpan aromanya", text: "Kamu tidak membalik badan. Sebagian kenangan cukup dihirup sekali, tidak perlu dikejar.", effects: { mental: 3 } },
    ],
  },

{ id: "syn_obat_pagi", ageMin: 62, ageMax: 85, title: "Ritual Pagi",
    prompt: "Empat butir obat di telapak tangan dan segelas air. Kamu sudah tidak ingat kapan ini dimulai. Sekarang ia terasa seperti bagian dari pagi, seperti menyeduh kopi.",
    choices: [
      { id: "nikmati", label: "Minum, duduk, tunggu hari dimulai", text: "Ada ketenangan aneh dalam rutinitas yang tidak bisa kamu jelaskan ke orang yang lebih muda.", effects: { health: 3, mental: 3 } },
      { id: "lupa", label: "Lupa satu butir, panik sebentar", text: "Kamu menemukan yang terlewat di bawah meja. Aman, tapi pagi ini jadi tidak tenang.", effects: { health: -1, mental: -2 } },
    ],
  },

{ id: "syn_surat_lama", ageMin: 63, ageMax: 80, title: "Amplop yang Tidak Pernah Dibuka",
    prompt: "Saat membereskan lemari, kamu menemukan amplop dengan tulisan tangan. Kamu tidak ingat dari siapa, dan tidak ingat kenapa tidak pernah dibuka.",
    choices: [
      { id: "buka", label: "Buka sekarang", text: "Surat dari seseorang yang sudah lama pergi. Tidak penting isinya, yang penting adalah tulisan tangannya, yang masih terasa hidup di kertas.", effects: { mental: -3, happiness: 2 }, mood: "melancholy" },
      { id: "simpan_lagi", label: "Simpan kembali di tempat yang lebih baik", text: "Kamu menaruhnya di kotak kecil di atas lemari, dengan sengaja kali ini. Beberapa hal lebih bermakna saat tidak dibuka.", effects: { mental: 3 } },
    ],
  },

{ id: "syn_hp_susah", ageMin: 63, ageMax: 85, title: "Layar yang Tidak Mau Dengar",
    prompt: "Layar HP tidak merespons jarimu seperti dulu. Terlalu sensitif atau kurang sensitif, kamu tidak yakin mana yang benar.",
    choices: [
      { id: "minta_tolong", label: "Minta tolong tetangga yang lebih muda", text: "Dia memperbaikinya dalam 10 detik. 'Tinggal pencet sini, pak/bu.' Kamu tertawa, sedikit malu, tapi tidak sampai malu betulan.", effects: { social: 3, mental: 2 } },
      { id: "coba_sendiri", label: "Coba sendiri, pelan-pelan", text: "Butuh 20 menit. Tapi berhasil. Kamu mencatat langkah-langkahnya di buku kecil.", effects: { intelligence: 3, discipline: 2 } },
    ],
  },

{ id: "syn_lampu_kamar_sebelah", ageMin: 64, ageMax: 90, requireAnyFlag: ["punya_rumah", "rumah_besar"], forbidLivingRelationship: "pasangan", title: "Lampu di Kamar Sebelah",
    prompt: "Malam-malam belakangan kamu membiarkan lampu kamar sebelah menyala, walau tidak ada siapa-siapa di sana. Cahayanya yang menyelinap dari bawah pintu membuat rumah terasa tidak begitu sepi, seolah ada orang lain yang juga belum tidur.",
    choices: [
      { id: "matikan", label: "Matikan, hadapi gelap apa adanya", text: "Kamu mematikannya dan berbaring dalam gelap yang jujur. Sepi itu nyata, tapi kamu sudah cukup lama berkawan dengannya untuk tidak takut.", effects: { mental: 3, discipline: 1 } },
      { id: "biarkan_nyala", label: "Biarkan menyala sampai pagi", text: "Kamu membiarkannya. Listrik sedikit lebih mahal, tapi tidur datang lebih mudah dengan cahaya kecil itu menemani dari balik pintu.", effects: { mental: 2, wealth: -1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_teko_pagi", ageMin: 65, ageMax: 78, title: "Air yang Mendidih Tiap Pagi",
    prompt: "Suara air mendidih di pagi hari sudah jadi penanda yang lebih bisa kamu percaya daripada jam. Teko yang sama, gelas yang sama, meja yang sama. Kamu tak ingat sejak kapan urutannya jadi sehafal ini.",
    choices: [
      { id: "pelan", label: "Seduh pelan, nikmati uap yang naik", text: "Kamu menunggu sampai uapnya menipis sebelum menyeruput. Ada kemewahan kecil dalam tidak diburu oleh siapa pun.", effects: { mental: 4, happiness: 2 }, mood: "warm" },
      { id: "cepat", label: "Seduh cepat, hari sudah menunggu", text: "Kamu menuang tergesa, seolah masih ada yang mengejar. Padahal yang menunggu hari ini cuma hari itu sendiri.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_sepatu_pintu", ageMin: 65, ageMax: 80, title: "Sepatu di Dekat Pintu",
    prompt: "Sepatu di rak dekat pintu makin jarang kamu pakai. Yang itu untuk kondangan, yang itu dulu untuk kerja, yang itu sudah lama tak ada acaranya. Sandalmu yang paling sering keluar, itu pun cuma sampai ujung gang.",
    choices: [
      { id: "pakai", label: "Pakai sepatu yang bagus, jalan agak jauh hari ini", text: "Kamu mengikat talinya, berjalan sampai ke pasar yang biasanya kamu lewati naik kendaraan. Kakimu protes, tapi ada rasa hidup yang kembali sebentar.", effects: { health: 2, mental: 3 } },
      { id: "sandal", label: "Biarkan di rak, sandal sudah cukup", text: "Kamu memilih sandal seperti biasa. Dunia yang kamu butuhkan sekarang memang seukuran ujung gang, dan itu tidak apa-apa.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_kabar_duka_tua", ageMin: 65, ageMax: 85, title: "Nama di Koran",
    prompt: "Kamu membaca nama yang kamu kenal di halaman obituari. Bukan kerabat dekat, hanya teman lama. Kamu terpaku di halaman itu, lupa waktu sejenak.",
    choices: [
      { id: "kenang", label: "Duduk sebentar, ingat-ingat wajahnya", text: "Kamu berhasil mengingat tawanya tapi bukan suaranya. Atau sebaliknya.", effects: { mental: -3 }, mood: "melancholy" },
      { id: "telp_kawan", label: "Hubungi kawan yang mungkin juga mengenalnya", text: "Dia mengangkat. 'Iya, aku juga baru baca.' Kalian berbicara tentang kenangan, bukan duka, selama dua jam.", effects: { social: 4, mental: 2 } },
    ],
  },

{ id: "syn_telepon_jarang", ageMin: 65, ageMax: 88, title: "Telepon yang Jarang Berbunyi",
    prompt: "Teleponmu makin jarang berbunyi. Dulu berdering untuk urusan kerja, undangan, kabar. Sekarang kalau berbunyi, separuhnya penawaran pinjaman, separuhnya salah sambung. Yang benar-benar meneleponmu bisa dihitung.",
    choices: [
      { id: "hubungi", label: "Hubungi satu orang, jangan menunggu", text: "Kamu menelepon kawan lama tanpa alasan khusus. Dia kaget, lalu senang. Ternyata menunggu dihubungi adalah kebiasaan yang bisa kamu lawan sendiri.", effects: { social: 4, mental: 2 }, mood: "warm" },
      { id: "diamkan", label: "Biarkan saja", text: "Sepi dering itu kamu terima seperti menerima cuaca, bukan sesuatu yang bisa kamu minta untuk berubah.", effects: { mental: -2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_tidur_siang", ageMin: 65, ageMax: 90, title: "Tidur Siang yang Tidak Direncanakan",
    prompt: "Kamu duduk di kursi sambil menonton TV. Mata terasa berat. Kamu berniat untuk memejamkan mata sebentar.",
    choices: [
      { id: "bangun_sendiri", label: "Terbangun dua jam kemudian", text: "Langit sudah sore. Kamu tidak ingat pernah bermimpi, tapi badanmu terasa ringan. Puas tanpa alasan jelas.", effects: { health: 3, mental: 4 }, mood: "warm" },
      { id: "dibangunkan", label: "Dibangunkan oleh suara tetangga", text: "'Sudah tidur dari tadi.' Kamu menyangkal sebentar, lalu menyerah. Tidak ada yang lebih manusiawi dari ini.", effects: { mental: 2 } },
    ],
  },

{ id: "syn_lupa_nama", ageMin: 65, ageMax: 90, title: "Nama yang Hilang Sesaat",
    prompt: "Kamu mau menyebut nama tetangga, dan mendadak kosong. Lima detik. Tapi lima detik yang menakutkan.",
    choices: [
      { id: "tertawa", label: "Tertawakan diri sendiri", text: "Kamu berkata 'kacau, makin tua makin lupa'. Dia tertawa juga. Hari berlanjut.", effects: { mental: 2 } },
      { id: "khawatir", label: "Pulang, catat semua nama yang masih kamu ingat", text: "Daftarmu panjang. Tapi yang membuat dadamu sesak adalah satu nama yang ragu-ragu kamu tulis.", effects: { mental: -4 } },
    ],
  },

{ id: "syn_kunci_tak_dikenal", ageMin: 66, ageMax: 90, title: "Kunci yang Tak Tahu Membuka Apa",
    prompt: "Di laci ada segenggam kunci yang sudah tidak kamu kenali. Kunci gembok yang entah di mana, kunci lemari yang sudah dibuang, kunci pintu rumah yang bukan rumah ini lagi. Kamu memegangnya satu-satu, mencoba mengingat.",
    choices: [
      { id: "simpan", label: "Simpan saja semua, siapa tahu", text: "Kamu memasukkannya kembali. Membuang kunci terasa seperti menutup pintu yang kamu sendiri lupa di mana. Lebih mudah menyimpannya daripada memastikan ia benar-benar tidak berguna.", effects: { mental: 2 }, mood: "melancholy" },
      { id: "buang", label: "Buang yang sudah pasti tak berguna", text: "Kamu menyisihkan dua yang kamu ingat sudah tak ada gunanya, lalu membuangnya. Laci jadi sedikit lebih ringan, dan begitu juga sesuatu di dadamu.", effects: { mental: 3, discipline: 2 } },
    ],
  },

{ id: "syn_tangga_lambat", ageMin: 70, ageMax: 82, title: "Tangga yang Memanjang",
    prompt: "Tangga ke lantai atas terasa lebih panjang dari dulu. Kamu berhenti di tengah, pura-pura mengecek sesuatu di tanganmu.",
    choices: [
      { id: "naik", label: "Lanjut naik pelan-pelan", text: "Satu anak tangga satu tarikan napas. Akhirnya kamu sampai juga di atas. Lebih lambat, tapi sampai. Itu yang dihitung sekarang.", effects: { health: 2, discipline: 2 } },
      { id: "pindah", label: "Pindahkan yang sering dipakai ke bawah", text: "Kamu menata ulang rumah supaya jarang naik. Bukan menyerah pada tangga, hanya berhenti menantangnya tiap hari.", effects: { mental: 2, discipline: 1 } },
    ],
  },

{ id: "syn_jalan_lama", ageMin: 70, ageMax: 82,
    requireAnyFlag: ["punya_rumah", "tinggal_kos", "menikah"], title: "Belokan yang Masih Sama",
    prompt: "Kamu lewat jalan yang dulu menuju rumah masa kecilmu. Bangunannya sudah berganti, tapi belokannya masih persis seperti dalam ingatan.",
    choices: [
      { id: "singgah", label: "Singgah sebentar, berdiri di depannya", text: "Yang berdiri di sana sekarang rumah lain. Tapi kakimu masih tahu persis di mana pagarnya dulu. Tubuh menyimpan peta yang tidak bisa dibongkar siapa pun.", effects: { mental: 3, happiness: 2 }, mood: "melancholy" },
      { id: "lewat", label: "Lewat saja, tak perlu berhenti", text: "Kamu terus berjalan. Beberapa tempat lebih utuh kalau dibiarkan tinggal di kepala, bukan diperiksa ulang.", effects: { mental: 2 } },
    ],
  },

{ id: "syn_album_pudar", ageMin: 70, ageMax: 84, title: "Album yang Sampulnya Lepas",
    prompt: "Album foto tua, sampulnya mulai terlepas. Wajah-wajah di dalamnya separuh sudah tidak ada lagi, separuh tidak kamu ingat namanya.",
    choices: [
      { id: "telusuri", label: "Telusuri halaman demi halaman", text: "Beberapa wajah menyala kembali begitu kamu lihat, lengkap dengan nama dan suaranya. Kamu menutup album dengan dada yang penuh dan sedikit perih.", effects: { mental: 3 }, mood: "melancholy" },
      { id: "tutup", label: "Tutup, simpan untuk lain hari", text: "Kamu menaruhnya kembali di rak. Beberapa hal lebih ringan kalau dibuka sedikit-sedikit, bukan sekaligus.", effects: { mental: 2 } },
    ],
  },

{ id: "syn_cucu_tanya", ageMin: 70, ageMax: 90, requireFlag: "punya_anak", forbidFlag: "anak_meninggal", title: "Pertanyaan dari Cucu",
    prompt: "Cucumu bertanya: 'Waktu dulu, dunianya seperti apa?' Matanya serius, bukan basa-basi.",
    choices: [
      { id: "cerita", label: "Ceritakan dengan detail, biarkan dia membayangkan", text: "Kamu cerita lebih panjang dari yang kamu rencanakan. Dia tidak mengalihkan pandangan sekalipun. Ada sesuatu yang luar biasa, didengarkan oleh seseorang yang benar-benar ingin tahu.", effects: { happiness: 8, social: 5, mental: 5 }, mood: "warm" },
      { id: "singkat", label: "Ringkas saja, dia mungkin tidak butuh detail", text: "Tiga kalimat. Dia mengangguk. Lalu bertanya lagi 'Terus?' Kamu lanjut cerita sampai maghrib.", effects: { happiness: 6, social: 4 } },
    ],
  },

{ id: "syn_daftar_belanja_pendek", ageMin: 70, ageMax: 92, forbidLivingRelationship: "pasangan", title: "Daftar Belanja yang Memendek",
    prompt: "Daftar belanjamu makin pendek tiap tahun. Bukan karena berhemat, tapi karena kebutuhanmu memang menyusut. Porsi masak untuk satu, obat lebih banyak dari camilan, dan barang-barang yang dulu penting kini terasa berlebihan.",
    choices: [
      { id: "manjakan", label: "Tambahkan satu hal yang kamu suka, bukan yang kamu butuh", text: "Kamu menulis 'kue lapis' di bawah daftar obat. Kecil, tidak perlu, dan justru karena itu terasa seperti memanjakan diri yang sudah lama tak kamu lakukan.", effects: { happiness: 4, mental: 2 }, mood: "warm" },
      { id: "seperlunya", label: "Beli seperlunya, seperti biasa", text: "Kamu mencoret yang sudah masuk keranjang lalu pulang. Hidup yang menyusut jadi seukuran daftar pendek ini ternyata tidak menyakitkan, hanya sunyi saja.", effects: { mental: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_taman_tua", ageMin: 71, ageMax: 85, title: "Pagi di Taman",
    prompt: "Pagi di taman kota. Embun masih ada di rumput. Beberapa orang seusiamu jalan kaki perlahan.",
    choices: [
      { id: "jalan", label: "Jalan kaki bersama mereka", text: "Tidak banyak bicara. Kalian hanya jalan, lalu pulang. Ritual baru yang sebetulnya tidak butuh nama, walaupun kamu tahu itu namanya 'Jalan Pagi'.", effects: { health: 4, social: 3, mental: 4 } },
      { id: "duduk", label: "Duduk, baca koran", text: "Halaman olahraga, lalu opini, lalu obituari. Selalu obituari yang paling lama dibaca.", effects: { mental: -1 } },
    ],
  },

{ id: "syn_volume_tv", ageMin: 72, ageMax: 84, title: "Satu Strip Lagi",
    prompt: "Kamu menaikkan volume TV satu strip lagi. Dunia tidak makin pelan, kamu yang makin sulit mendengarnya.",
    choices: [
      { id: "periksa", label: "Periksakan pendengaranmu", text: "Alat bantu dengar terasa asing seminggu pertama, lalu kamu terus memakainya. Suara-suara kecil kembali. Jam, hujan, napas sendiri.", effects: { health: 2, discipline: 2 } },
      { id: "abaikan", label: "Biarkan, toh tak semua perlu didengar", text: "Kamu mengecilkannya lagi malam itu. Ada juga rasa damai dalam dunia yang sedikit lebih teredam.", effects: { mental: 2, happiness: 1 }, mood: "melancholy" },
    ],
  },

{ id: "syn_selimut_berat", ageMin: 74, ageMax: 95, title: "Selimut yang Lebih Berat",
    prompt: "Akhir-akhir ini selimut terasa lebih berat saat pagi, dan ranjang lebih sulit ditinggalkan. Bukan kantuk, lebih ke tubuh yang minta beberapa menit lagi sebelum menghadapi dingin lantai dan panjangnya hari.",
    choices: [
      { id: "bangun", label: "Bangun juga, gerakkan badan biar hangat", text: "Kamu memaksa kaki menyentuh lantai, meregang pelan sampai darah mengalir. Beberapa menit kemudian tubuh lebih ramah. Kemenangan kecil yang kamu rayakan diam-diam tiap pagi.", effects: { health: 3, discipline: 2 } },
      { id: "rebah", label: "Berbaring beberapa menit lagi", text: "Kamu menarik selimut sampai dagu, membiarkan pagi menunggu. Tidak ada lagi yang menagih kehadiranmu di jam tertentu, dan kebebasan itu terasa seperti selimut kedua.", effects: { mental: 3, happiness: 1 }, mood: "warm" },
    ],
  },

{ id: "syn_resep_lupa", ageMin: 75, ageMax: 90, title: "Resep yang Tersisa di Kepala",
    prompt: "Kamu memasak sesuatu dari ingatan. Tidak ada resep tertulis, hanya tangan yang masih tahu urutannya meski kepala sudah mulai lupa.",
    choices: [
      { id: "masak", label: "Masak selesai, lihat hasilnya", text: "Tanganmu lebih ingat daripada kepalamu. Takaran garam, kapan api dikecilkan, kapan diangkat. Kamu makan pelan, heran pada tubuh yang masih menyimpan hal-hal yang sudah lama tidak kamu pikirkan.", effects: { happiness: 5, mental: 4 }, mood: "warm" },
      { id: "tulis", label: "Sambil masak, tulis resepnya supaya tidak hilang", text: "Dua lembar kertas. Tulisanmu agak gemetar tapi masih bisa dibaca. Suatu hari, ini akan jadi warisan kecil yang tidak kamu sengajakan.", effects: { mental: 6, happiness: 3 }, mood: "warm" },
    ],
  },

{ id: "syn_teknologi_baru", ageMin: 78, ageMax: 93, requireFlag: "punya_anak", forbidFlag: "anak_meninggal", title: "Aplikasi Baru di HP",
    prompt: "Cucumu memasang aplikasi baru di HP-mu. 'Ini berguna, nek/kek.' Layarnya penuh ikon yang tidak familiar.",
    choices: [
      { id: "coba", label: "Coba sendiri, pelan-pelan", text: "Setengah jam kemudian kamu tidak sengaja video call seseorang yang tidak dikenal. Kamu menutup telepon dan berpura-pura tidak terjadi apa-apa.", effects: { intelligence: 2, happiness: 3 } },
      { id: "minta_tolong", label: "Minta diajarkan langsung", text: "Mereka mengajar dengan sabar. Lebih sabar dari caramu mengajari mereka berjalan dulu. Giliran yang berputar.", effects: { social: 4, happiness: 3 }, mood: "warm" },
    ],
  },

{ id: "syn_buku_kacamata", ageMin: 78, ageMax: 93, themeGroup: "penglihatan_menua", title: "Kacamata yang Tidak Ada",
    prompt: "Kamu sudah membuka laci yang sama tiga kali mencari kacamata. Lalu ketemu, di atas kepalamu.",
    choices: [
      { id: "tertawa", label: "Tertawa sendiri", text: "Kamu menceritakan ini ke siapapun yang pertama kamu temui. Mereka tertawa bersama, bukan menertawakanmu. Ada keintiman dalam cerita konyol seperti ini.", effects: { happiness: 5, social: 3 } },
      { id: "gengsi", label: "Pura-pura tidak terjadi apa-apa", text: "Kamu langsung membuka buku seolah tidak ada yang perlu diproses. Tapi kamu tersenyum tipis sendirian.", effects: { happiness: 3, mental: 2 } },
    ],
  },

{ id: "syn_cermin_tua", ageMin: 78, ageMax: 95, title: "Cermin Pagi",
    prompt: "Kamu berdiri di depan cermin lebih lama dari biasanya. Wajah yang ada di sana familiar tapi asing, seperti foto lama yang diambil seseorang yang tidak kamu kenal.",
    choices: [
      { id: "senyum", label: "Tersenyum pada pantulanmu sendiri", text: "Dia tersenyum balik. Dua orang yang sudah lama saling kenal, akhirnya berdamai.", effects: { mental: 5, happiness: 4 }, mood: "warm" },
      { id: "pergi", label: "Pergi, tidak perlu berlama-lama", text: "Ada hal-hal yang lebih baik tidak terlalu dicermati. Terutama di pagi hari, sebelum kopi.", effects: { mental: 2 } },
    ],
  },

{ id: "syn_hujan_tua", ageMin: 78, ageMax: 95, title: "Hujan dari Teras",
    prompt: "Hujan turun sore ini. Kamu duduk di teras, tidak ke mana-mana. Beberapa dekade lalu kamu berlari di bawah hujan ini tanpa payung.",
    choices: [
      { id: "amati", label: "Amati hujan, biarkan pikiran berkelana", text: "Kamu melewati banyak hujan dalam ingatanmu. Hujan di hari ulang tahun, hujan di perjalanan panjang, hujan di satu malam yang tidak bisa kamu lupakan. Semuanya sama tapi berbeda.", effects: { mental: 6, happiness: 3 }, mood: "melancholy" },
      { id: "masuk", label: "Masuk, cuaca bisa berbahaya", text: "Kamu menutup pintu tapi menyisakan celah kecil. Suara hujannya masih masuk. Itu sudah cukup.", effects: { mental: 3 } },
    ],
  },

{ id: "syn_kenangan_mendadak", ageMin: 78, ageMax: 95, title: "Kenangan yang Datang Sendiri",
    prompt: "Tidak ada pemicunya. Kamu sedang melakukan hal biasa, lalu tiba-tiba kenangan itu datang seperti tamu tanpa janji. Jelas, lengkap, dan seolah baru kemarin.",
    choices: [
      { id: "biarkan", label: "Biarkan kenangan itu ada, nikmati sebentar", text: "Kamu tinggal di sana beberapa menit. Otak yang sudah menua ternyata masih menyimpan ini dengan sangat baik. Detail yang tanpa sadar kamu hafalkan.", effects: { mental: 5, happiness: 4 }, mood: "warm" },
      { id: "catat", label: "Catat sebelum hilang lagi", text: "Kamu mencari buku dan pena. Tulisanmu lambat, tapi kamu menulis semua yang kamu ingat. Halaman itu kemudian menjadi salah satu yang paling sering kamu buka kembali.", effects: { mental: 6, happiness: 5, discipline: 2 }, mood: "warm" },
    ],
  },

{ id: "syn_teh_dingin", ageMin: 78, ageMax: 95, title: "Teh yang Keburu Dingin",
    prompt: "Kamu menyeduh teh, lalu duduk memandang ke luar jendela. Saat kamu ingat lagi pada gelas itu, tehnya sudah dingin. Belakangan ini sering begitu, pikiranmu pergi jauh, dan waktu terlewat begitu saja.",
    choices: [
      { id: "seduh_baru", label: "Hangatkan lagi, atau seduh yang baru", text: "Kamu menyeduh yang baru dan kali ini meminumnya selagi panas, sengaja memperhatikan rasanya. Hadir sepenuhnya pada satu gelas teh ternyata latihan yang tidak mudah.", effects: { mental: 3 } },
      { id: "minum_dingin", label: "Minum saja yang dingin, tak apa", text: "Kamu menghabiskannya dingin-dingin. Ke mana tadi pikiranmu pergi, kamu sudah lupa. Tapi tempat itu pasti lebih hangat dari teh ini.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_kartupos_telat", ageMin: 78, ageMax: 95, title: "Kartu yang Datang Telat",
    prompt: "Sebuah kartu ucapan tiba di depan pintu, terlambat beberapa minggu dari hari yang dimaksud. Tulisan tangannya gemetar, sama seperti tanganmu kalau menulis sekarang. Pengirimnya seseorang seusiamu yang masih bertahan dengan kebiasaan lama ini.",
    choices: [
      { id: "balas", label: "Balas, tulis tangan juga walau pelan", text: "Kamu mencari kartu kosong, menulis balasan dengan huruf yang butuh waktu. Dua orang tua saling berkirim tulisan gemetar. Mungkin konyol, tapi sangat berharga untukmu.", effects: { social: 3, happiness: 3, mental: 2 }, mood: "warm" },
      { id: "simpan_kartu", label: "Simpan saja", text: "Kamu menaruhnya di laci dengan niat membalas nanti. Kalian berdua tahu 'nanti' di usia ini adalah kata yang harus dipakai hati-hati. Tapi kartunya tetap kamu simpan.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_pengakuan_kecil", ageMin: 79, ageMax: 95, title: "Mengakui pada Diri Sendiri",
    prompt: "Di usia ini, kamu mulai bisa jujur pada diri sendiri tentang beberapa hal yang dulu selalu kamu elak. Tidak ada yang memaksamu, hanya waktu yang terlalu banyak dan dinding yang terlalu sunyi.",
    choices: [
      { id: "akui", label: "Akui satu hal yang belum pernah diakui", text: "Tidak harus diucapkan keras-keras. Tidak harus didengar siapapun. Tapi mengakuinya di dalam kepala sendiri. Itu terasa seperti menutup jendela yang sudah lama dibiarkan terbuka.", effects: { mental: 8, happiness: 3 }, mood: "warm" },
      { id: "nanti", label: "Urungkan. Belum waktunya.", text: "Tidak mengakuinya pun tak apa. Tidak ada yang memaksamu harus berani.", effects: { mental: 1 } },
    ],
  },

{ id: "syn_kursi_favorit", ageMin: 80, ageMax: 95, title: "Kursi yang Mengenalmu",
    prompt: "Kursi di pojok itu mengenalmu. Lekukan terbentuk selama bertahun-tahun, persis di mana kamu duduk. Kamu tidak ingat kapan ia mulai berbentuk seperti itu.",
    choices: [
      { id: "duduk", label: "Duduk, biarkan kursi itu merangkulmu", text: "Ada kenyamanan yang tidak bisa dibeli dengan uang. Kamu duduk di sana sampai sore meredup, dan tidak ada yang mempermasalahkan itu.", effects: { mental: 5, happiness: 4 }, mood: "warm" },
      { id: "ganti", label: "Pertimbangkan beli kursi baru", text: "Kamu melihat katalog selama sepuluh menit, lalu menutupnya. Kursi lama lebih masuk akal.", effects: { mental: 3 } },
    ],
  },

{ id: "syn_filosofi_sendok", ageMin: 80, ageMax: 95, title: "Pertanyaan Saat Sarapan",
    prompt: "Sambil menyuap sarapan, pikiranmu tiba-tiba bertanya, 'kenapa sendok berbentuk cekung?' Sudah berapa ribu kali kamu memegang benda ini tanpa pernah bertanya.",
    choices: [
      { id: "lanjutkan", label: "Lanjutkan sarapan, tidak perlu dijawab", text: "Beberapa pertanyaan lebih nikmat kalau dibiarkan mengambang. Seperti sarapannya.", effects: { mental: 3, happiness: 2 } },
      { id: "googling", label: "Cari jawabannya di internet", text: "Kamu membaca tentang evolusi peralatan makan selama satu jam. Sarapan sudah dingin. Tapi kamu punya pengetahuan baru yang tidak berguna dan entah kenapa menyenangkan.", effects: { intelligence: 3 } },
    ],
  },

{ id: "syn_surat_kabar_lama", ageMin: 80, ageMax: 95, title: "Koran Lama di Laci",
    prompt: "Di laci meja, kamu menemukan koran bertanggal puluhan tahun lalu. Berita-beritanya sudah terasa seperti fiksi sejarah, tapi kamu ingat membacanya dulu dengan sungguh-sungguh.",
    choices: [
      { id: "baca", label: "Baca ulang pelan-pelan", text: "Betapa banyak hal yang terasa 'paling penting' dulu, dan sekarang tidak ada yang ingat. Kamu meletakkannya kembali dengan hati-hati, karena ia adalah bukti bahwa kamu pernah hidup di waktu itu.", effects: { mental: 5 }, mood: "melancholy" },
      { id: "simpan", label: "Simpan baik-baik, mungkin berguna suatu hari", text: "Tidak akan berguna. Tapi kamu tetap menyimpannya di kotak khusus, diantara beberapa benda lain yang tidak berguna tapi tidak bisa dibuang.", effects: { mental: 3, happiness: 2 } },
    ],
  },

{ id: "syn_suara_rumah", ageMin: 80, ageMax: 95, title: "Suara Rumah di Malam Hari",
    prompt: "Tengah malam, rumah mengeluarkan bunyi-bunyinya sendiri. Kayu yang bergerak, pipa yang berdesing, angin di celah jendela. Kamu sudah hafal semua suara ini sejak lama.",
    choices: [
      { id: "dengarkan", label: "Dengarkan, seperti mendengar rumahmu bernapas", text: "Setiap bunyi itu familiar seperti suara teman lama. Rumah ini sudah menemanimu lebih lama dari siapapun. Kamu hampir mengucapkan terima kasih pelan-pelan.", effects: { mental: 6, happiness: 4 }, mood: "warm" },
      { id: "tidur", label: "Pasang earphone, tidur", text: "Beberapa hal lebih baik didengar tanpa sadar. Kamu tidur lebih cepat dari biasanya.", effects: { health: 3, mental: 2 } },
    ],
  },

{ id: "syn_warisan_kecil", ageMin: 82, ageMax: 95, title: "Memilah Barang",
    prompt: "Kamu mulai memilah barang-barang lama, bukan karena ada yang minta, hanya karena rasanya sudah waktunya.",
    choices: [
      { id: "beri", label: "Tandai mana yang mau diberikan ke siapa", text: "Kamu menulis nama-nama di sticky note kecil, menempelkannya di benda-benda tertentu. Cara yang tenang untuk berkata 'ini milikmu sekarang'.", effects: { mental: 7, happiness: 5 }, mood: "warm" },
      { id: "tunda", label: "Terlalu berat untuk sekarang, lanjut lain waktu", text: "Kamu menutup lagi kotaknya. Tapi kamu sudah mulai, walaupun cuma meniatkannya.", effects: { mental: 3 } },
    ],
  },

{ id: "syn_tangan_sendiri", ageMin: 84, ageMax: 95, title: "Tangan di Pangkuan",
    prompt: "Kamu memandangi tanganmu sendiri di pangkuan. Kulit setipis kertas, urat yang menonjol, bercak-bercak yang entah datang kapan. Tangan ini sudah mengerjakan banyak sekali hal.",
    choices: [
      { id: "genggam", label: "Kepalkan dan buka pelan-pelan", text: "Masih menurut, walau lebih lambat. Kamu berterima kasih dalam hati pada sepasang tangan yang tak pernah kamu ucapi seumur hidup.", effects: { mental: 5, happiness: 3 }, mood: "warm" },
      { id: "biarkan", label: "Biarkan, diam saja", text: "Kamu hanya menatapnya. Seluruh hidupmu lewat di sana. Yang digendong, yang dilepas, yang ditahan. Semua tersimpan di garis-garis itu.", effects: { mental: 4 }, mood: "melancholy" },
    ],
  },

{ id: "syn_jam_dinding", ageMin: 84, ageMax: 95, title: "Jam yang Harus Diputar",
    prompt: "Jam dinding tua itu masih berdetak, satu-satunya suara yang pasti di rumah ini. Jarumnya sering melenceng sendiri. Kamu memutarnya tiap minggu, ritual yang menemanimu lebih lama dari kebanyakan orang.",
    choices: [
      { id: "putar", label: "Putar lagi minggu ini", text: "Dua belas putaran, seperti biasa. Rumah ini terasa tidak sunyi selama dia berdetak.", effects: { mental: 4, happiness: 2 }, mood: "warm" },
      { id: "biarkan", label: "Biarkan saja kali ini", text: "Pagi berikutnya, jarumnya sudah melenceng lagi. Kamu merasakan gatal yang entah ada di mana, lalu memutarnya lagi sebelum tengah hari.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_radio_lama", ageMin: 84, ageMax: 95, title: "Lagu dari Masa Itu",
    prompt: "Radio memutar lagu dari masa mudamu. Liriknya hafal di luar kepala, padahal nama-nama lain sudah lama kabur. Lagu ternyata lebih setia di ingatan.",
    choices: [
      { id: "dengar", label: "Dengarkan sampai habis", text: "Kakimu mengetuk pelan tanpa kamu suruh. Sesaat kamu berumur belasan lagi, di tempat yang sudah tidak ada. Lalu lagunya selesai, dan kamu kembali.", effects: { mental: 5, happiness: 4 }, mood: "warm" },
      { id: "matikan", label: "Matikan, terlalu banyak yang ikut datang", text: "Kamu mematikannya di tengah lagu. Beberapa pintu lebih baik tidak dibuka lebar-lebar di pagi hari.", effects: { mental: 2 }, mood: "melancholy" },
    ],
  },

{ id: "syn_bangun_subuh", ageMin: 85, ageMax: 95, title: "Bangun Sebelum Subuh",
    prompt: "Lagi-lagi kamu terbangun jauh sebelum subuh, dan tidak bisa tidur lagi. Tidur jadi tamu yang makin singkat berkunjung.",
    choices: [
      { id: "bangun", label: "Bangun, seduh sesuatu yang hangat", text: "Kamu duduk menunggu langit berubah warna. Pagi-pagi seperti ini, yang sepi dan milik sendiri, ternyata punya ketenangan yang tidak kamu duga.", effects: { mental: 4, happiness: 2 }, mood: "warm" },
      { id: "berbaring", label: "Tetap berbaring, dengar pagi datang", text: "Kamu mendengar burung pertama, lalu motor pertama, lalu rumah yang pelan-pelan terjaga. Kamu menghitung semuanya.", effects: { mental: 3 } },
    ],
  },

{ id: "syn_pohon_tua", ageMin: 85, ageMax: 95, title: "Pohon yang Dulu Sebatang Lidi",
    prompt: "Pohon yang dulu kamu tanam sebesar lidi sekarang meneduhi separuh halaman. Kamu menanamnya tanpa pernah berpikir akan menungguinya selama ini.",
    choices: [
      { id: "duduk", label: "Duduk di bawah naungannya", text: "Daunnya bergesek pelan di atas kepalamu. Sesuatu yang kamu mulai puluhan tahun lalu, dengan tangan sendiri, tumbuh jauh melampaui rencanamu. Itu bukan hal kecil.", effects: { mental: 6, happiness: 4 }, mood: "warm" },
      { id: "pandang", label: "Pandangi dari jendela saja", text: "Dari balik kaca kamu mengamatinya berayun. Kamu mungkin tidak melihatnya berbunga lagi tahun depan, tapi seseorang akan. Itu pun terasa cukup.", effects: { mental: 4 }, mood: "melancholy" },
    ],
  },

{ id: "syn_langkah_pendek", ageMin: 85, ageMax: 95, title: "Sejauh Ujung Gang",
    prompt: "Dulu kamu bisa pergi ke mana saja. Sekarang duniamu seukuran jarak yang sanggup kamu jalani, sampai ujung gang dan kembali.",
    choices: [
      { id: "ujung", label: "Jalan pelan sampai ujung, lalu pulang", text: "Kamu menyapa dua orang, melihat satu pohon berbunga, dan itu sudah jadi perjalanan utuh. Dunia yang menyusut ternyata bisa diisi sepenuh yang dulu luas.", effects: { health: 2, mental: 4, happiness: 2 }, mood: "warm" },
      { id: "pagar", label: "Cukup sampai pagar saja hari ini", text: "Kamu berdiri di pagar, menghirup udara, lalu masuk lagi. Tidak semua hari menuntut jarak yang sama.", effects: { mental: 2 } },
    ],
  },

{ id: "syn_kursi_seberang", ageMin: 86, ageMax: 95, forbidLivingRelationship: "pasangan", title: "Kursi di Seberang Meja",
    prompt: "Di meja makan, kursi di seberangmu tetap kosong. Kamu sudah lama terbiasa, tapi 'terbiasa' tidak sama dengan 'tidak merasakan'.",
    choices: [
      { id: "temani", label: "Makan pelan, temani diri sendiri", text: "Kamu makan tanpa terburu, sesekali berbicara dalam hati pada kursi itu. Kebiasaan yang ganjil, tapi membuat ruang makan tidak sepenuhnya kosong.", effects: { mental: 3 }, mood: "melancholy" },
      { id: "radio", label: "Nyalakan radio biar ada suara lain", text: "Suara penyiar mengisi ruangan yang terlalu hening. Bukan teman, tapi cukup untuk membuat sendok dan piring tidak terdengar begitu nyaring.", effects: { mental: 2, happiness: 1 } },
    ],
  },

{ id: "syn_cucu_pulang", ageMin: 86, ageMax: 95, requireFlag: "punya_anak", forbidFlag: "anak_meninggal", title: "Sepi Setelah Akhir Pekan",
    prompt: "Rumah penuh tawa sepanjang akhir pekan. Sekarang mereka sudah pulang, dan keheningan yang tertinggal terasa lebih nyaring dari sebelum mereka datang.",
    choices: [
      { id: "nikmati", label: "Duduk, simpan hangatnya dulu", text: "Kamu membiarkan rumah tetap berantakan sebentar. Gelas-gelas, bantal yang berpindah, bukti bahwa tadi penuh. Kamu menatapnya lama sebelum membereskan.", effects: { mental: 4, happiness: 3 }, mood: "melancholy" },
      { id: "bereskan", label: "Langsung bereskan, jangan berlama-lama", text: "Kamu mencuci semuanya sampai rumah rapi seperti semula. Rapi, sepi, dan kamu memilih sibuk supaya tidak terlalu mendengar sepinya.", effects: { mental: 2, discipline: 2 } },
    ],
  },
];

// Filter dasar varian: usia + flag (tanpa cek "sudah pernah"). Dipakai bersama oleh
// syntheticFiller (fallback per-tahun) dan texturedSyntheticVariant (synthetic
// terjadwal/terjamin), supaya satu aturan kecocokan tidak terduplikasi.
function variantMatches(state: GameState, v: Variant): boolean {
  if (state.age < v.ageMin || state.age > v.ageMax) return false;
  if (v.forbidFlag && state.flags[v.forbidFlag]) return false;
  if (v.forbidAnyFlag && v.forbidAnyFlag.some((f) => state.flags[f])) return false;
  if (v.requireFlag && !state.flags[v.requireFlag]) return false;
  if (v.requireAnyFlag && !v.requireAnyFlag.some((f) => state.flags[f])) return false;
  if (v.forbidLivingRelationship &&
      state.relationships.some((r) => r.id === v.forbidLivingRelationship && r.alive)) return false;
  if (v.requireChildAgeMin !== undefined || v.requireChildAgeMax !== undefined) {
    const childBirthAge = typeof state.flags.child_birth_age === "number"
      ? (state.flags.child_birth_age as number)
      : null;
    if (childBirthAge === null) return false;
    const childAge = state.age - childBirthAge;
    if (v.requireChildAgeMin !== undefined && childAge < v.requireChildAgeMin) return false;
    if (v.requireChildAgeMax !== undefined && childAge > v.requireChildAgeMax) return false;
  }
  return true;
}

// True kalau varian punya themeGroup dan SAUDARA SEGRUPNYA (id lain, themeGroup sama)
// sudah pernah muncul dalam hidup ini. Dipakai berdampingan dengan cek seen-by-id di
// kedua pemilih synthetic untuk menjamin satu beat tematik (mis. "penglihatan menua")
// maksimal sekali seumur hidup, walau ditulis sebagai beberapa varian beda usia.
function themeGroupBlocked(state: GameState, v: Variant): boolean {
  if (!v.themeGroup) return false;
  return SYNTH_VARIANTS.some(
    (other) => other.id !== v.id
      && other.themeGroup === v.themeGroup
      && state.seenEvents.includes(other.id),
  );
}

// Kembalikan satu LifeEvent dari varian filler_synthetic BERTEKSTUR yang cocok
// dengan usia & flag saat ini — tidak pernah teks "tahun kosong" generik. HANYA
// memilih varian yang BELUM pernah muncul dalam hidup ini: satu varian synthetic
// dijamin maksimal 1× per hidup, tidak pernah diulang. Kalau semua varian yang
// cocok sudah pernah lewat (atau memang tak ada yang cocok untuk usia/flag ini),
// mengembalikan null — pemanggil yang memutuskan fallback (sekunder biasa /
// pending / tahun-kosong). Stok varian per band sengaja dibuat berlebih (lihat
// SYNTH_VARIANTS, terutama band lansia) supaya null ini langka. Dipakai untuk
// synthetic terjadwal (tiap ≤3 tahun di usia 6-59) dan sekunder 60+.
export function texturedSyntheticVariant(
  state: GameState,
  rand: () => number,
  excludeIds: string[] = [],
): LifeEvent | null {
  const fresh = SYNTH_VARIANTS.filter(
    (v) => variantMatches(state, v)
      && !excludeIds.includes(v.id)
      && !state.seenEvents.includes(v.id)
      && !themeGroupBlocked(state, v),
  );
  if (fresh.length === 0) return null;
  return variantToEvent(fresh[Math.floor(rand() * fresh.length)]);
}

export function syntheticFiller(state: GameState, rand: () => number): LifeEvent {
  const candidates = SYNTH_VARIANTS.filter(
    (v) => variantMatches(state, v) && !state.seenEvents.includes(v.id)
      && !themeGroupBlocked(state, v),
  );

  if (candidates.length > 0) {
    return variantToEvent(candidates[Math.floor(rand() * candidates.length)]);
  }

  // Jaring pengaman: semua varian usia-tepat yang BELUM pernah muncul sudah habis.
  // Dulu di sini ada teks "tahun kosong" generik yang dirotasi per fase usia; itu
  // dihapus karena kualitasnya di bawah varian bertekstur dan—setelah batch varian
  // "tahun tenang" universal ditambahkan (lihat akhir SYNTH_VARIANTS)—jalur ini
  // tidak pernah lagi terpicu di simulasi (sim/synth_deficit.ts: 0× / 50rb hidup).
  // Sebagai pertahanan terakhir terhadap kasus mustahil (semua varian usia-tepat
  // sudah terlihat), ulangi satu varian usia-tepat alih-alih mengembalikan undefined
  // (yang akan meng-crash pemanggil di Game.tsx). Pengulangan ini melanggar jaminan
  // sekali-seumur-hidup, tapi hanya pada kasus yang—secara empiris—tidak terjadi;
  // syntheticFiller hanya dipanggil di usia 58+ tempat puluhan varian selalu cocok,
  // sehingga anyMatch tak pernah kosong dan crash tak mungkin terjadi.
  const anyMatch = SYNTH_VARIANTS.filter((v) => variantMatches(state, v));
  return variantToEvent(anyMatch[Math.floor(rand() * anyMatch.length)]);
}

// Ubah satu Variant menjadi LifeEvent siap-pakai untuk syntheticFiller.
function variantToEvent(v: Variant): LifeEvent {
  return {
    id: v.id,
    category: "random",
    pool: "filler",
    rarity: "common",
    ageMin: v.ageMin, ageMax: v.ageMax,
    title: () => v.title,
    prompt: () => v.prompt,
    mood: "neutral",
    choices: () => v.choices.map((c) => ({
      id: c.id, label: c.label,
      outcomes: c.outcomes
        ? c.outcomes.map((o) => ({ weight: o.weight, text: o.text, effects: o.effects, mood: o.mood }))
        : [{ weight: 8, text: c.text ?? "", effects: c.effects, mood: c.mood }],
    })),
  };
}
