import { LifeEvent } from "../types";
import { e, karirOf } from "./_helpers";

// Pool berbasis usia: peristiwa milestone hidup yang terikat fase usia.
//
// Urutan: event disusun menaik berdasarkan usia (ageMin). Untuk sebagian usia
// ada lebih dari satu varian beat — dipilih acak tiap kehidupan supaya awal
// hidup tidak terasa diulang.
// (Lihat juga teman_khayalan_pergi & callback_surat_kapsul di callback.ts.)
export const AGE_POOL: LifeEvent[] = [
e({
    id: "bayi_lahir", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 0, ageMax: 0, mood: "warm",
    title: "Tangisan Pertama",
    prompt: "Cahaya menusuk mata. Suara asing memanggilmu dengan nama yang baru saja dipilih sehari sebelumnya. Dunia, kata mereka, akan menyambutmu dengan baik. Atau tidak.",
    choices: [
      { id: "menangis", label: "Menangis sekencang-kencangnya", outcomes: [
        { weight: 8, text: "Ibumu memeluk lebih erat. Kamu merasa hangat tanpa tahu kata 'hangat'.", effects: { happiness: 4, social: 2 }, mood: "warm",
          memory: { text: "Pelukan pertama ibumu.", tag: "ibu", mood: "warm" } },
        { weight: 8, text: "Tangismu menggema, tapi yang menjawab justru tawa lega seisi ruangan. Suara pertamamu disambut bahagia. Awal yang tidak semua orang dapatkan.", effects: { happiness: 4, social: 1 }, mood: "warm",
          memory: { text: "Tangismu yang disambut tawa lega.", tag: "keluarga", mood: "warm" } },
      ]},
      { id: "diam", label: "Diam, mengamati lampu di langit-langit", outcomes: [
        { weight: 8, text: "Perawat berkata 'tenang sekali bayi ini'. Sebuah label yang mungkin akan menempel sampai kamu dewasa.", effects: { intelligence: 3, social: -2 }, addTrait: "introvert" },
        { weight: 8, text: "Matamu mengikuti lampu, tenang, seolah sedang menimbang dunia sebelum memutuskan ikut serta.", effects: { intelligence: 3, social: -1 }, addTrait: "introvert" },
      ]},
      { id: "tidur", label: "Tertidur lagi", outcomes: [
        { weight: 8, text: "Tidur adalah kemewahan yang tidak akan pernah sebegitu mudahnya lagi.", effects: { health: 3 } },
      ]},
      { id: "lapar", label: "Mencari sumber kehangatan", outcomes: [
        { weight: 8, text: "Insting bekerja. Kamu menemukan apa yang kamu butuhkan tanpa memikirkannya.", effects: { health: 4 } },
      ]},
    ],
  }),

e({
    id: "bayi_genggam", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 0, ageMax: 0, mood: "warm",
    title: "Jari yang Tidak Menarik Diri",
    prompt: "Sebelum kamu sempat menangis, seseorang sudah menangis lebih dulu untukmu. Tangan-tangan yang gemetar memindahkanmu dari satu kehangatan ke kehangatan yang lain.",
    choices: [
      { id: "genggam", label: "Genggam jari yang menyentuhmu", outcomes: [
        { weight: 8, text: "Jari itu jauh lebih besar dari seluruh tanganmu, dan ia tidak menarik diri. Untuk pertama kalinya kamu tahu, tanpa kata, bahwa ada yang akan bertahan.", effects: { happiness: 4, social: 2 }, mood: "warm",
          memory: { text: "Jari pertama yang kamu genggam, dan tidak menarik diri.", tag: "keluarga", mood: "warm" } },
      ]},
      { id: "geliat", label: "Menggeliat cari posisi", outcomes: [
        { weight: 8, text: "Dunia di luar terlalu luas setelah tempat sempit yang kamu kenal. Kamu belajar bahwa nyaman itu sesuatu yang harus dicari.", effects: { discipline: 2, health: 2 } },
      ]},
      { id: "tatap", label: "Buka mata, mencari satu wajah", outcomes: [
        { weight: 8, text: "Wajah itu buram, tapi kamu menatapnya seolah sudah mengenalnya seumur hidup.", effects: { social: 3, intelligence: 1 }, mood: "warm" },
      ]},
    ],
  }),

e({
    id: "bayi_hujan", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 0, ageMax: 0, mood: "neutral",
    title: "Lahir di Tengah Hujan",
    prompt: "Di luar hujan turun deras malam itu. Kamu datang di antara suara air dan suara orang yang lelah tapi lega.",
    choices: [
      { id: "dengar", label: "Dengarkan suara hujan", outcomes: [
        { weight: 8, text: "Suara itu akan kembali padamu bertahun-tahun lagi setiap kali hujan, tanpa kamu tahu kenapa.", effects: { mental: 3, intelligence: 1 }, mood: "melancholy",
          memory: { text: "Hujan di malam kamu dilahirkan.", tag: "hujan", mood: "melancholy" } },
      ]},
      { id: "tangis", label: "Menangis, saingi hujan", outcomes: [
        { weight: 8, text: "Suaramu kecil, tapi cukup untuk membuat satu ruangan berhenti bernapas sejenak. Itu kuasa pertama yang kamu punya.", effects: { social: 3, happiness: 2 } },
      ]},
      { id: "hangat", label: "Diam, menempel pada yang hangat", outcomes: [
        { weight: 8, text: "Di luar dingin, di sini tidak. Kamu memilih tidak peduli pada apapun selain itu. Sebuah kebijaksanaan yang mungkin akan kamu lupakan begitu dewasa.", effects: { health: 3, mental: 2 }, mood: "warm" },
      ]},
    ],
  }),

e({
    id: "bayi_subuh", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 0, ageMax: 0, mood: "neutral",
    title: "Lahir Sebelum Matahari Terbit",
    prompt: "Kamu datang di jam paling sepi, saat langit masih ragu antara malam atau pagi. Tidak banyak orang, hanya beberapa yang lelah, dan satu yang menahan tangis.",
    choices: [
      { id: "tenang", label: "Diam, ikuti sunyinya pagi", outcomes: [
        { weight: 8, text: "Kamu tidak menangis lama, seolah tahu pagi seharusnya dijaga tetap sunyi.", effects: { mental: 3, intelligence: 1 }, mood: "neutral",
          memory: { text: "Subuh saat kamu dilahirkan.", tag: "pagi", mood: "melancholy" } },
      ]},
      { id: "menangis", label: "Menangis", outcomes: [
        { weight: 8, text: "Suaramu adalah hal pertama yang mengisi pagi itu. Seseorang tertawa kecil, lega, di antara kantuk yang menumpuk semalaman.", effects: { social: 3, happiness: 2 }, mood: "warm" },
      ]},
      { id: "tidur", label: "Tertidur lagi", outcomes: [
        { weight: 8, text: "Kamu memilih tidur, dan dunia membiarkanmu. Hari pertama, dan kamu sudah tahu kapan harus berhenti mempedulikan.", effects: { health: 3 } },
      ]},
    ],
  }),

e({
    id: "bayi_nama", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 0, ageMax: 0, mood: "melancholy",
    title: "Nama yang Diwariskan",
    prompt: "Namamu sudah disiapkan jauh sebelum kamu ada. Nama seseorang yang pergi sebelum sempat menggendongmu. Saat mereka menyebutnya, seperti memanggil dua orang sekaligus.",
    choices: [
      { id: "diam", label: "Diam saja", outcomes: [
        { weight: 8, text: "Tidak ada yang kamu mengerti. Kamu membawa nama itu seumur hidup, dan kadang lupa ia pernah jadi milik orang lain.", effects: { mental: 3, social: 1 }, mood: "melancholy",
          memory: { text: "Namamu milik seseorang yang pergi sebelum sempat menggendongmu.", tag: "keluarga", mood: "melancholy" } },
      ]},
      { id: "tangis", label: "Menangis", outcomes: [
        { weight: 8, text: "Tangismu seperti jawaban. Seseorang yang tua menyeka mata, seakan ada yang kembali. Tidak ada yang ingin membantahnya.", effects: { social: 2, happiness: 1 }, mood: "melancholy" },
      ]},
      { id: "genggam", label: "Raih tangan yang gemetar", outcomes: [
        { weight: 8, text: "Kamu menggenggam tangan yang paling lama menatapmu. Untuknya, kamu bukan sekadar bayi. Kamu sedikit dari yang hilang, dikembalikan.", effects: { happiness: 2, social: 2 }, mood: "warm" },
      ]},
    ],
  }),

e({
    id: "balita_kata_pertama", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 1, ageMax: 1, title: "Kata Pertama",
    prompt: "Mulutmu membentuk suara yang membuat orangtuamu menahan napas.",
    choices: [
      { id: "mama", label: "\"Mama\"", outcomes: [
        { weight: 8, text: "Ibumu menangis. Ayahmu pura-pura tidak cemburu.", effects: { social: 3, happiness: 4 }, memory: { text: "Kata pertamamu: Mama.", tag: "keluarga", mood: "warm" }, mood: "warm" },
        { weight: 6, text: "Ibumu membeku sedetik, lalu memelukmu sampai kamu protes. Ayahmu merekam dengan tangan gemetar, lupa menekan tombol yang benar.", effects: { social: 2, happiness: 4 }, memory: { text: "Kata pertamamu: Mama.", tag: "keluarga", mood: "warm" }, mood: "warm" },
      ]},
      { id: "papa", label: "\"Papa\"", outcomes: [
        { weight: 8, text: "Ayahmu memamerkan ke seluruh kantor selama dua minggu.", effects: { social: 3, happiness: 3 }, memory: { text: "Kata pertamamu: Papa.", tag: "keluarga", mood: "warm" } },
      ]},
      { id: "tidak", label: "\"Tidak\"", outcomes: [
        { weight: 8, text: "Kamu menemukan kata yang akan menjadi favoritmu seumur hidup.", effects: { discipline: 2 }, addTrait: "ambitious" },
        { weight: 8, text: "Seisi rumah tertawa, lalu berhenti saat mereka sadar kamu mengucapkannya dengan serius.", effects: { discipline: 3 }, addTrait: "ambitious" },
      ]},
      { id: "anjir", label: "Sesuatu yang terdengar seperti makian", outcomes: [
        { weight: 8, text: "Bibi yang sedang berkunjung tertawa terbahak. Ibu tidak.", effects: { happiness: 2, social: -1 } },
      ]},
    ],
  }),

e({
    id: "balita_langkah", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 1, ageMax: 1, mood: "warm",
    title: "Menuju Tangan yang Terbuka",
    prompt: "Ayah berjongkok di depanmu dengan tangan terbuka. Di antara kamu dan tangan itu hanya ada lantai, dan keberanian yang belum kamu tahu namanya.",
    choices: [
      { id: "melangkah", label: "Lepaskan pegangan, melangkah", outcomes: [
        { weight: 8, text: "Dua langkah, lalu jatuh tepat ke tangan itu. Seluruh ruangan bersorak untuk sesuatu yang besok akan kamu lakukan tanpa dipuji lagi. Begitulah hampir semua hal pertama.", effects: { discipline: 3, happiness: 4 }, mood: "warm",
          memory: { text: "Langkah pertamamu, dan tangan yang menangkapmu.", tag: "keluarga", mood: "warm" } },
      ]},
      { id: "merangkak", label: "Pilih merangkak saja, lebih aman", outcomes: [
        { weight: 8, text: "Kamu sampai juga, tapi dengan caramu sendiri. Tangan itu tetap memelukmu, tidak kecewa sedikit pun.", effects: { mental: 2, happiness: 3 } },
      ]},
      { id: "duduk", label: "Duduk, tertawa, menolak bergerak", outcomes: [
        { weight: 8, text: "Kamu menertawakan seluruh urusan ini sampai tangan itu sendiri yang datang menghampirimu. Sesekali, dunia memang mendatangi orang yang cukup keras kepala.", effects: { happiness: 3, social: 1 } },
      ]},
    ],
  }),

e({
    id: "balita_suara_keras", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 1, ageMax: 1, mood: "neutral",
    title: "Suara yang Terlalu Besar",
    prompt: "Suara monster menggelegar, atau hanya pintu yang dibanting angin? Untuk sesaat, dunia terasa terlalu besar untuk tubuh sekecil kamu.",
    choices: [
      { id: "menangis", label: "Menangis, cari yang bisa dipeluk", outcomes: [
        { weight: 8, text: "Sepasang tangan datang setelah tangismu pecah. Kamu belajar lebih awal, bahwa takut itu lebih ringan kalau ada yang memegangmu.", effects: { happiness: 3, social: 2 }, mood: "warm" },
      ]},
      { id: "diam", label: "Diam, dengarkan sampai habis", outcomes: [
        { weight: 8, text: "Kamu menunggu suara itu reda sendiri. Sudah belajar, sangat dini, bahwa hal-hal yang menakutkan biasanya cuma lewat.", effects: { mental: 3, discipline: 1 } },
      ]},
    ],
  }),

e({
    id: "balita_cilukba", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 1, ageMax: 1, mood: "warm",
    title: "Wajah yang Hilang lalu Kembali",
    prompt: "Ayah menutup wajahnya dengan kedua tangan, 'Ciluk...'. Lalu membukanya tiba-tiba, 'Ba!'. Setiap kali wajah itu hilang, dadamu sempit. Setiap kali kembali, dunia utuh lagi.",
    choices: [
      { id: "tawa", label: "Tertawa", outcomes: [
        { weight: 8, text: "Kamu tertawa terlalu keras. Permainan paling sederhana di dunia. Dan kamu belum tahu, kelak akan memainkannya dengan orang yang pergi betulan.", effects: { happiness: 3, social: 2 }, mood: "warm" },
      ]},
      { id: "raih", label: "Raih tangannya, jangan biarkan menutup lagi", outcomes: [
        { weight: 8, text: "Kamu menahan jari-jari itu, takut wajah yang hilang tidak akan kembali lagi kalau dibiarkan.", effects: { mental: 2, social: 1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "balita_suapan", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 1, ageMax: 1, mood: "neutral",
    title: "Suapan yang Ditolak",
    prompt: "Sesendok bubur didekatkan ke mulutmu dengan suara pesawat-pesawatan. Kamu menutup mulut rapat-rapat, menatap sendok itu seperti ia berniat jahat.",
    choices: [
      { id: "buka", label: "Buka mulut, coba", outcomes: [
        { weight: 8, text: "Rasanya aneh, lalu tidak terlalu aneh. Kamu membuka mulut lagi, dan wajah ibumu menyala seperti memenangkan sesuatu.", effects: { health: 2, happiness: 2 }, mood: "warm" },
      ]},
      { id: "lepeh", label: "Singkirkan sendok jahat itu", outcomes: [
        { weight: 8, text: "Bubur di pipi, di meja, di rambut. Yang menyuapi menghela napas, tapi diam-diam memotret dulu sebelum membersihkan.", effects: { happiness: 2, social: 1 } },
      ]},
    ],
  }),

e({
    id: "balita_cermin", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 2, ageMax: 2, title: "Bayi di Dalam Cermin",
    prompt: "Ada bayi lain di dalam cermin. Ia menirukan semua gerakanmu, terlalu cepat untuk diajak petak umpet, terlalu setia untuk ditinggal.",
    choices: [
      { id: "sentuh", label: "Tepuk kaca, cari temannya", outcomes: [
        { weight: 8, text: "Kaca itu dingin dan keras, dan temanmu tidak pernah keluar. Kekecewaan kecil pertama, lalu kamu lupakan dalam hitungan detik.", effects: { intelligence: 3 } },
      ]},
      { id: "tertawa", label: "Tertawa pada cermin", outcomes: [
        { weight: 8, text: "Ia tertawa balik, persis bersamaan. Untuk satu momen kamu yakin kamu tidak sendirian. Dan keyakinan itu — anehnya — akan kamu cari lagi seumur hidup.", effects: { happiness: 3, mental: 2 }, mood: "warm" },
      ]},
    ],
  }),

e({
    id: "balita_air_keran", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 2, ageMax: 2, mood: "warm",
    title: "Air dari Keran",
    prompt: "Keran dibuka sedikit, dan air jatuh berkilat. Kamu menaruh tangan di bawahnya.",
    choices: [
      { id: "tampung", label: "Tampung di telapak", outcomes: [
        { weight: 8, text: "Air itu tak pernah mau tinggal. Kamu tertawa tiap kali ia lolos dari jari-jarimu. Pelajaran paling awal, dan paling lembut, tentang hal-hal yang tidak bisa digenggam.", effects: { happiness: 3, intelligence: 2 }, mood: "warm" },
      ]},
      { id: "tarik", label: "Tarik tangan, kaget karena dinginnya", outcomes: [
        { weight: 8, text: "Kamu belajar kata 'dingin' tanpa persiapan. Dunia ternyata bukan cuma untuk dilihat. Ia bisa terasa, kadang sebelum kamu siap.", effects: { mental: 2, intelligence: 1 } },
      ]},
    ],
  }),

e({
    id: "balita_balok", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 2, ageMax: 2, mood: "neutral",
    title: "Menara dari Balok",
    prompt: "Balok kayu kamu tumpuk satu per satu. Lalu kamu pukul, roboh, dan menumpuknya lagi.",
    choices: [
      { id: "tumpuk", label: "Tumpuk setinggi mungkin", outcomes: [
        { weight: 8, text: "Tiga balok, lalu roboh. Kamu tertawa. Sebuah pelajaran kecil tentang kegagalan.", effects: { intelligence: 2 } },
        { weight: 8, text: "Lima balok berdiri sebelum roboh sendiri. Sesaat kamu menatapnya seakan baru membangun sesuatu yang penting.", effects: { intelligence: 2, happiness: 1 } },
      ]},
      { id: "lempar", label: "Lempar ke seberang ruangan", outcomes: [
        { weight: 8, text: "Balok itu terlempar, kucing kabur. Ibu berkata 'tidak boleh', Kata yang akan kamu dengar ribuan kali lagi.", effects: { social: 1 } },
      ]},
    ],
  }),

e({
    id: "balita_panjat", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 2, ageMax: 2, mood: "neutral",
    title: "Apa Saja Bisa Dipanjat",
    prompt: "Kursi, lalu meja, lalu rak yang lebih tinggi dari kepalamu. Dunia terlihat berbeda dari atas, dan kamu ingin lebih tinggi lagi.",
    choices: [
      { id: "naik", label: "Terus naik setinggi-tingginya", outcomes: [
        { weight: 8, text: "Kamu sampai ke puncak rak sebelum tangan ayah menangkapmu, jantungnya lebih berdebar dari kakimu. Kamu tertawa, ia belum.", effects: { discipline: 2, happiness: 2 } },
        { weight: 8, text: "Sedetik di puncak, seluruh ruangan jadi kecil. Lalu kamu jatuh ke pelukan yang sudah menunggu di bawah, seakan ia tahu kamu akan jatuh.", effects: { happiness: 2, social: 1 }, mood: "warm" },
      ]},
      { id: "turun", label: "Sudah waktunya turun", outcomes: [
        { weight: 8, text: "Naik ternyata mudah, turunnya tidak. Kamu menangis di puncak rak sampai ada yang datang. Pelajaran pertama bahwa yang berani naik belum tentu tahu cara turun.", effects: { mental: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "balita_amukan", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 2, ageMax: 2, mood: "melancholy",
    title: "Amukan Pertama",
    prompt: "Kamu menginginkan sesuatu yang entah apa, kamu sendiri tidak yakin, dan dunia menolaknya. Kamu bergeliat di lantai, tangismu mengisi seluruh minimarket.",
    choices: [
      { id: "teriak", label: "Menangis sampai napas habis", outcomes: [
        { weight: 8, text: "Tidak ada yang berubah, kecuali satu hal: kamu belajar bahwa marah yang paling besar pun tidak akan mengubah apa-apa.", effects: { mental: -1, discipline: 1 }, mood: "melancholy" },
      ]},
      { id: "dipeluk", label: "Lari keluar", outcomes: [
        { weight: 8, text: "Ibu mengejarmu keluar tanpa banyak bicara. Menggendong, menunggu badaimu reda. Diam-diam kamu lega ada yang tetap memelukmu saat kamu paling tidak manis.", effects: { happiness: 2, social: 1 }, mood: "warm", memory: { text: "Dipeluk justru saat kamu paling sulit disayang.", tag: "keluarga", mood: "warm" } },
      ]},
    ],
  }),

e({
    id: "teman_khayalan", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 3, ageMax: 3, mood: "warm",
    title: "Teman yang Hanya Kamu Lihat",
    prompt: "Kamu punya teman yang duduk di kursi kosong saat makan, yang harus diberi jatah biskuit. Tidak ada orang lain yang bisa melihatnya, dan itu tidak pernah jadi masalah bagimu.",
    choices: [
      { id: "kenalkan", label: "Kenalkan dia ke ibu", outcomes: [
        { weight: 8, text: "Ibumu menyalami udara dengan serius, menanyakan kabarnya. Bertahun kemudian kamu akan tahu betapa lembutnya itu. Ikut percaya pada sesuatu yang tidak ada, demi kamu.", effects: { happiness: 4, social: 2 }, mood: "warm",
          addsRelationship: { id: "teman_khayalan", name: "Teman Khayalan", role: "friend", closeness: 35, alive: true },
          memory: { text: "Teman yang hanya kamu lihat, dan ibu yang ikut menyapanya.", tag: "teman_khayalan", mood: "warm" } },
        { weight: 8, text: "Ibumu hampir tak mengangkat wajah dari cucian. 'Tidak ada siapa-siapa di situ.' Kamu mengangguk, lalu diam-diam tetap menyisihkan satu biskuit di kursi kosong itu.", effects: { mental: 2, happiness: -1 }, mood: "melancholy",
          addsRelationship: { id: "teman_khayalan", name: "Teman Khayalan", role: "friend", closeness: 42, alive: true },
          memory: { text: "Teman yang hanya kamu lihat , dan tidak ada orang lain yang bisa melihatnya.", tag: "teman_khayalan", mood: "melancholy" } },
      ]},
      { id: "rahasia", label: "Simpan dia sebagai rahasia berdua", outcomes: [
        { weight: 8, text: "Dia menemanimu di sudut-sudut sepi rumah, mendengar semua yang belum bisa kamu ucapkan ke orang sungguhan.", effects: { mental: 3, intelligence: 1 }, mood: "melancholy",
          addsRelationship: { id: "teman_khayalan", name: "Teman Khayalan", role: "friend", closeness: 40, alive: true },
          memory: { text: "Teman rahasia mendengar hal-hal yang belum bisa kamu ucapkan ke siapa pun.", tag: "teman_khayalan", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "balita_benda", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 3, ageMax: 3, mood: "neutral",
    title: "Benda yang Tidak Boleh Hilang",
    prompt: "Ada tiga benda — boneka, bantal kecil, kain lusuh — yang harus ada sebelum kamu bisa tidur. Hari ini ia tidak ada di tempatnya.",
    choices: [
      { id: "cari", label: "Menangis sampai semua orang ikut mencari", outcomes: [
        { weight: 8, text: "Ditemukan di bawah kursi makan, tertutup koran. Seisi rumah lega berlebihan untuk sebuah benda kecil. Kelak kamu akan mengerti kenapa.", effects: { happiness: 3 } },
      ]},
      { id: "ganti", label: "Mau dipinjami benda lain sebagai pengganti", outcomes: [
        { weight: 8, text: "Kamu menerimanya dengan curiga, lalu menerimanya betulan. Yang kamu butuhkan ternyata bukan bendanya, tapi rasa 'ada yang menemani'.", effects: { mental: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "balita_kenapa", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 3, ageMax: 3, mood: "neutral",
    title: "Kenapa",
    prompt: "Kamu menemukan satu kata yang membuka semua pintu: 'kenapa'. Kenapa langit di atas, kenapa malam datang, kenapa nenek tidak pulang-pulang.",
    choices: [
      { id: "terus", label: "Balas tiap jawaban dengan 'kenapa' lagi", outcomes: [
        { weight: 8, text: "Orang dewasa kehabisan jawaban dan hanya bisa berkata 'ya begitulah'. Pertama kali kamu tahu, mereka pun tidak tahu segalanya.", effects: { intelligence: 3 }, mood: "melancholy" },
      ]},
      { id: "satu", label: "Tanyakan satu yang paling mengganjal", outcomes: [
        { weight: 8, text: "Pertanyaanmu membuat ruangan diam terlalu lama. 'Nanti kamu ngerti,' kata seseorang. Kalimat yang baru kamu pahami puluhan tahun kemudian.", effects: { intelligence: 2, mental: 1 }, mood: "melancholy", memory: { text: "Pertanyaan kecil yang membuat orang dewasa terdiam.", tag: "waktu", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "balita_pispot", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 3, ageMax: 3, mood: "neutral",
    title: "Pispot",
    prompt: "Popok ditinggalkan, dan sebuah singgasana kecil dari plastik menggantikannya. Semua orang menunggu dengan tangan yang siap bertepuk.",
    choices: [
      { id: "berhasil", label: "Coba sampai berhasil", outcomes: [
        { weight: 8, text: "Berhasil! Seisi rumah bersorak seakan kamu memenangkan sesuatu yang besar. Mungkin, untuk ukuranmu saat itu, memang besar.", effects: { discipline: 2, happiness: 2 } },
        { weight: 8, text: "Gagal. Malu yang pertama dalam hidupmu, yang sebenarnya tidak perlu. Ada yang membersihkan tanpa memarahimu.", effects: { mental: 1, social: 1 }, mood: "warm" },
      ]},
      { id: "tolak", label: "Belum mau, rebut kembali popokmu", outcomes: [
        { weight: 8, text: "Singgasana plastik itu kamu dorong jauh-jauh. Tidak ada yang memaksa. Lalu suatu pagi, kamu sendiri yang memutuskan sudah waktunya. Tidak semua hal perlu diburu-buru.", effects: { mental: 2, discipline: 1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "balita_gelap", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 3, ageMax: 3, mood: "melancholy",
    title: "Lampu yang Harus Menyala",
    prompt: "Lampu kamar dimatikan dan tiba-tiba sudut-sudut ruangan jadi punya niat buruk. Kamu menarik selimut sampai ke hidung.",
    choices: [
      { id: "panggil", label: "Panggil ibu, minta lampu dinyalakan", outcomes: [
        { weight: 8, text: "Ibu menyalakan lampu kecil di sudut. Bayangan-bayangan menyusut jadi cuma lemari dan tumpukan baju. Kamu tidur dengan satu mata, lalu dua.", effects: { happiness: 2, mental: 2 } },
      ]},
      { id: "berani", label: "Pejamkan mata, hitung sampai tertidur", outcomes: [
        { weight: 8, text: "Kamu menghitung sampai entah berapa. Pagi datang tanpa kamu tahu kapan rasa takut itu pergi. Mungkin begitu cara takut selalu bekerja.", effects: { discipline: 2, mental: 1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "balita_bohong", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 4, ageMax: 4, mood: "neutral",
    title: "Bohong yang Pertama",
    prompt: "Sesuatu pecah di lantai. Saat ditanya siapa, untuk pertama kalinya kamu menemukan bahwa kamu bisa berkata 'bukan aku', dan kata-kata itu terasa seperti pintu yang istimewa.",
    choices: [
      { id: "ngaku", label: "Akhirnya mengaku sambil menangis", outcomes: [
        { weight: 8, text: "Kamu tidak tahan lama. Pengakuan itu keluar bersama tangis. Dan pelukan yang menyusul terasa lebih besar dari benda apa pun yang pecah.", effects: { mental: 2, happiness: 2 }, mood: "warm" },
      ]},
      { id: "lanjut", label: "Bertahan dengan bohongmu", outcomes: [
        { weight: 8, text: "Tidak ada yang membantah. Kamu lolos, dan menyimpan rasa aneh: menang yang tidak terasa seperti menang.", effects: { intelligence: 1, mental: -1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "balita_cerita", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 4, ageMax: 4, mood: "warm",
    title: "Cerita yang Tidak Pernah Terjadi",
    prompt: "Kamu bercerita bahwa tadi ada dinosaurus di halaman, dan kamu mengusirnya sendirian. Kamu menceritakannya dengan begitu yakin sampai kamu sendiri hampir percaya.",
    choices: [
      { id: "lanjutkan", label: "Tambah terus sampai jadi naga", outcomes: [
        { weight: 8, text: "Ayah mendengarkan dengan wajah serius yang dibuat-buat. Di masa ini, batas antara yang nyata dan yang kamu inginkan masih boleh kabur.", effects: { intelligence: 2, social: 1 }, mood: "warm" },
      ]},
      { id: "malu", label: "Berhenti saat ada yang tertawa", outcomes: [
        { weight: 8, text: "Kamu tiba-tiba mengerti bahwa mereka tahu itu tidak benar. Pertama kali ini kamu malu karena ketahuan berkhayal, dan diam-diam kamu simpan khayalan berikutnya untuk dirimu sendiri.", effects: { mental: 1, intelligence: 1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "balita_gunting", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 4, ageMax: 4, mood: "neutral",
    title: "Gunting",
    prompt: "Sepasang gunting tumpul dan selembar kertas. Untuk pertama kalinya kamu boleh memotong sendiri, dan tanganmu gemetar antara takut dan ingin.",
    choices: [
      { id: "potong", label: "Ikuti garis pelan-pelan", outcomes: [
        { weight: 8, text: "Garis yang kamu ikuti meliuk ke mana-mana, tapi kertas itu terbelah juga. Kamu memandang dua potongan di tanganmu seperti baru menciptakan robot canggih.", effects: { intelligence: 2, discipline: 1 } },
      ]},
      { id: "rambut", label: "Diam-diam coba pada rambutmu sendiri", outcomes: [
        { weight: 8, text: "Hasilnya membuat ibu menghela napas panjang dan menyimpan foto itu untuk dibahas bertahun-tahun kemudian.", effects: { happiness: 2, social: 1 }, mood: "warm" },
      ]},
    ],
  }),

e({
    id: "balita_satu_kaki", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 4, ageMax: 4, mood: "melancholy",
    title: "Berdiri dengan Satu Kaki",
    prompt: "Kamu menemukan bahwa tubuhmu bisa berdiri di atas satu kaki, lalu melompat-lompat dengannya. 'Lihat! Lihat!'. Dan kamu butuh seseorang melihatmu.",
    choices: [
      { id: "pamer", label: "Lompat terus sampai ada yang menoleh", outcomes: [
        { weight: 8, text: "Ibu menoleh dan berkata 'hebat!'. Satu kata kecil itu membuatmu melompat sepuluh kali lagi. Kelak kamu akan lupa betapa mudahnya dulu merasa hebat.", effects: { happiness: 3, social: 1 }, mood: "melancholy" },
        { weight: 8, text: "Kamu melompat sampai napasmu habis, tapi tak ada satu kepala pun yang berbalik. 'Lihat...' katamu lebih lirih, lalu kakimu turun pelan ke lantai. Ini pertama kalinya kamu tahu rasanya memanggil dan tidak ada yang datang.", effects: { mental: -1, social: -1 }, mood: "melancholy", memory: { text: "Melompat dengan satu kaki, memanggil-manggil, tapi tak ada yang menoleh.", tag: "kesepian", mood: "melancholy" } },
      ]},
      { id: "sendiri", label: "Lompat saja walau tak ada yang lihat", outcomes: [
        { weight: 8, text: "Tidak ada yang menoleh. Kamu tetap melompat, sedikit lebih pelan, lalu berhenti sendiri. Pelajaran penting hari ini: tidak semua pencapaian kecilmu harus ada yang melihat.", effects: { mental: 2, discipline: 1 }, mood: "melancholy", memory: { text: "Melompat dengan satu kaki, tanpa peduli ada yang menoleh.", tag: "kesepian", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "balita_langit", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 4, ageMax: 4, mood: "melancholy",
    title: "Pertanyaan yang Terlalu Besar",
    prompt: "Di mobil, di tengah perjalanan pulang, kamu bertanya pelan: 'Nanti semua orang mati, ya?' Yang menyetir di depan diam terlalu lama.",
    choices: [
      { id: "tunggu", label: "Tunggu sampai ada jawaban", outcomes: [
        { weight: 8, text: "Akhirnya datang: 'Iya, tapi masih lama sekali.' Kamu mengangguk dan kembali melihat ke luar jendela, menyimpan kalimat itu di tempat yang baru kamu pahami puluhan tahun lagi.", effects: { intelligence: 3, mental: 1 }, mood: "melancholy", memory: { text: "Pertanyaan tentang kematian, dan langit di luar jendela mobil.", tag: "langit", mood: "melancholy" } },
      ]},
      { id: "lupa", label: "Lihat sesuatu di pinggir jalan tanpa peduli jawaban", outcomes: [
        { weight: 8, text: "Sebelum jawabannya datang, perhatianmu sudah pindah ke seekor anjing di trotoar. Pertanyaan paling besar pun, di usia ini, masih kalah oleh seekor anjing. 'Guk... Guk...'", effects: { happiness: 2, intelligence: 1 } },
      ]},
    ],
  }),

e({
    id: "tk_warna", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 5, ageMax: 5, prompt: "Hari pertama TK. Guru meminta semua anak menggambar 'rumah impian'.",
    choices: [
      { id: "istana", label: "Istana raksasa dengan helikopter", outcomes: [
        { weight: 8, text: "Guru tersenyum. Teman-teman terkesan. Kamu merasa kreatif.", effects: { happiness: 5, social: 3 }, addTrait: "creative" },
        { weight: 8, text: "Gambarmu dipajang paling depan. Untuk satu hari kamu jadi anak paling terkenal di kelas.", effects: { happiness: 4, social: 4 }, addTrait: "creative" },
      ]},
      { id: "kotak", label: "Rumah kotak biasa", outcomes: [
        { weight: 8, text: "Guru menulis 'realistis' di buku catatan. Entah itu pujian atau bukan.", effects: { intelligence: 2 } },
      ]},
      { id: "hitam", label: "Mewarnai semuanya hitam", outcomes: [
        { weight: 8, text: "Guru memanggil orangtuamu. Tidak ada yang salah, tapi semua orang khawatir.", effects: { mental: -3 }, addTrait: "nihilistic", mood: "melancholy" },
        { weight: 8, text: "Guru menyebutmu 'seniman avant-garde kecil'. Kamu tidak tahu artinya.", addTrait: "creative", effects: { happiness: 2 } },
      ]},
      { id: "tidak_gambar", label: "Tidak menggambar apa-apa", outcomes: [
        { weight: 8, text: "Kamu duduk diam mengamati anak lain. Sebuah kebiasaan yang mungkin akan bertahan.", addTrait: "introvert", effects: { intelligence: 2 } },
      ]},
    ],
  }),

e({
    id: "anak_nama", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 5, ageMax: 5, mood: "melancholy",
    title: "Namamu, Ditulis Sendiri",
    prompt: "Pensil di tanganmu, dan untuk pertama kali kamu menulis namamu sendiri. Salah satu hurufnya menghadap ke arah yang salah, tapi itu namamu.",
    choices: [
      { id: "bangga", label: "Tunjukkan ke semua orang", outcomes: [
        { weight: 8, text: "Bertahun ke depan kamu akan menandatangani namamu ribuan kali tanpa merasakan apa pun, tapi tidak hari ini.", effects: { intelligence: 2, happiness: 3 }, mood: "melancholy", memory: { text: "Pertama kali menulis namamu sendiri, satu huruf terbalik.", tag: "waktu", mood: "melancholy" } },
      ]},
      { id: "ulang", label: "Hapus, tulis ulang sampai benar", outcomes: [
        { weight: 8, text: "Kamu menulis ulang sampai hurufnya menghadap benar. Sejak sekecil itu, kamu tidak suka melihat yang miring dibiarkan miring.", effects: { discipline: 3 }, addTrait: "ambitious" },
      ]},
    ],
  }),

e({
    id: "anak_hitung", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 5, ageMax: 5, mood: "neutral",
    title: "Menghitung Segalanya",
    prompt: "Akhirnya kamu bisa menghitung sampai angka yang terasa raksasa. Sekarang semuanya harus dihitung: anak tangga, ubin, jari orang lain.",
    choices: [
      { id: "pamer", label: "Hitung keras-keras sampai dua puluh", outcomes: [
        { weight: 8, text: "Kamu melewatkan angka lima belas, dan tidak ada yang mengoreksi. Tepuk tangan datang seakan kamu menemukan sesuatu yang baru. Dan dalam kasusmu, memang.", effects: { intelligence: 3, happiness: 2 } },
      ]},
      { id: "tangga", label: "Hitung anak tangga rumah tiap kali naik", outcomes: [
        { weight: 8, text: "Jumlahnya selalu sama. Ada rasa aman yang aneh pada hal-hal yang tidak berubah. Rasa yang kelak makin sulit kamu temukan.", effects: { mental: 2, intelligence: 1 }, mood: "melancholy", memory: { text: "Menghitung anak tangga yang jumlahnya tak pernah berubah.", tag: "waktu", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "anak_aturan", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 5, ageMax: 5, mood: "melancholy",
    title: "Tidak Boleh Curang",
    prompt: "Ular tangga di lantai, dan kamu baru paham bahwa ada aturan yang tidak boleh dilanggar. Saat seseorang melanggarnya, dadamu panas oleh rasa yang baru kamu tahu namanya: tidak adil.",
    choices: [
      { id: "protes", label: "Protes keras, hentikan permainan", outcomes: [
        { weight: 8, text: "Permainan berhenti. Kelak kamu tahu betapa banyak hal di dunia ini melanggar aturan tanpa ada yang menghentikannya. Tapi malam itu, kamu masih percaya protes bisa mengubah sesuatu. Dan sebaiknya tetap begitu", effects: { discipline: 2, social: 1 }, mood: "melancholy" },
      ]},
      { id: "diam", label: "Diam saja, tetap ikut bermain", outcomes: [
        { weight: 8, text: "Kamu menelan rasa itu demi tidak merusak kebersamaan. Pertama kali kamu mengalah pada yang tidak adil supaya tetap diajak. Dan sepertinya bukan yang terakhir.", effects: { mental: 1, social: 2 }, mood: "melancholy", memory: { text: "Menelan rasa tidak adil demi tetap ikut bermain.", tag: "teman_kecil", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "anak_bandingkan", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 5, ageMax: 5, mood: "melancholy",
    title: "Punya Temanmu",
    prompt: "Temanmu membawa sepatu baru yang menyala di bagian tumitnya. Kamu melihat ke sepatumu sendiri, dan untuk pertama kalinya sepatumu terasa kurang.",
    choices: [
      { id: "minta", label: "Pulang, minta yang sama", outcomes: [
        { weight: 8, text: "Dari cara ibu tersenyum lalu mengalihkan pembicaraan, kamu menangkap sesuatu yang belum bisa kamu mengerti, tapi kamu berhenti meminta.", effects: { mental: -1, social: 1 }, mood: "melancholy", memory: { text: "Sepatu menyala milik teman, dan senyum ibu yang mengalihkan.", tag: "ibu", mood: "melancholy" } },
        { weight: 8, text: "Seminggu kemudian sepatu itu ada di kakimu, menyala persis seperti milik temanmu. Tapi kamu melihat ibu makan lebih sedikit dari biasanya, dan entah kenapa cahaya di tumitmu tidak seterang yang kamu bayangkan.", effects: { happiness: 1, mental: -1 }, mood: "melancholy", memory: { text: "Sepatu menyala yang kamu dapat, dan ibu yang makan lebih sedikit.", tag: "ibu", mood: "melancholy" } },
      ]},
      { id: "lupa", label: "Lupakan, perhatikan hal lain", outcomes: [
        { weight: 8, text: "Sampai di rumah kamu sudah lupa soal sepatu itu, sibuk dengan kardus bekas yang jauh lebih menarik. Rasa kurang itu pergi secepat datangnya, kemewahan yang tidak akan bertahan lama.", effects: { happiness: 2, mental: 1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "uang_warung", category: "random", pool: "age", rarity: "common",
    ageMin: 6, ageMax: 8, deferrable: true, forbidFlag: "ibu_meninggal",
    title: "Selembar 20 Ribu",
    prompt: "Di depan warung Bu Tini, ada lembaran 20 ribu yang sedikit kusut. Tidak ada yang melihat.",
    choices: [
      { id: "ke_ibu", label: "Serahkan ke ibu, ceritakan apa adanya", outcomes: [
        { weight: 8, text: "Ibu mengusap rambutmu. 'Anak jujur', katanya. Kalimat yang akan kamu simpan jauh setelah ia ucapkan.", effects: { happiness: 4, social: 2 }, memory: { text: "Pertama kali ibumu menyebutmu 'anak jujur'.", tag: "ibu", mood: "warm" }, mood: "warm", flag: "warung_bu_tini" },
        { weight: 8, text: "Ibu menyipitkan mata. 'Dapat dari mana?' Tuduhan halus itu tinggal di dadamu seharian.", effects: { mental: -4, happiness: -3 }, mood: "melancholy", flag: "warung_bu_tini" },
      ]},
      { id: "jajan", label: "Beli jajan diam-diam", outcomes: [
        { weight: 8, text: "Es krim itu yang paling enak yang pernah kamu makan. Mungkin karena rasa bersalahnya.", effects: { happiness: 3, mental: -1 }, flag: "warung_bu_tini" },
        { weight: 8, text: "Uangnya ternyata palsu. Penjualnya marah. Kamu lari sambil menangis.", effects: { mental: -5, social: -2 }, mood: "melancholy", flag: "warung_bu_tini" },
      ]},
      { id: "tunggu", label: "Menunggu pemiliknya", outcomes: [
        { weight: 8, text: "Seorang anak datang sambil menangis. 'Itu uang jajanku.' Kamu memberikannya. Dia tidak bilang terima kasih, tapi kamu merasa lebih besar dari biasanya.", effects: { social: 3, mental: 4 }, addTrait: "empathetic", memory: { text: "Anak kecil yang menangis di depan warung.", tag: "kebaikan", mood: "warm" }, flag: "warung_bu_tini" },
        { weight: 8, text: "Tidak ada yang datang sampai langit gelap. Akhirnya kamu titipkan ke Bu Tini. Kamu pulang dengan tangan kosong, dan dada yang penuh.", effects: { social: 2, mental: 3 }, addTrait: "empathetic", flag: "warung_bu_tini", memory: { text: "Uang temuan yang kamu titipkan ke Bu Tini.", tag: "kebaikan", mood: "warm" } },
      ]},
      { id: "tas", label: "Simpan di tas sekolah", outcomes: [
        { weight: 8, text: "Beberapa hari kemudian kamu lupa uang itu ada. Saat menemukannya, rasanya seperti hadiah dari diri sendiri.", effects: { wealth: 1, happiness: 2 }, flag: "warung_bu_tini" },
        { weight: 2, text: "Di tasmu, di samping uang itu, kamu menemukan robot mainan kecil. Kamu tidak ingat memilikinya. Tapi kamu menyimpannya.", effects: { happiness: 2 }, memory: { text: "Robot kecil yang entah datang dari mana.", tag: "robot_kecil", mood: "neutral" }, flag: "robot_kecil" },
      ]},
    ],
  }),

e({
    id: "teman_sebelah_rumah", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 6, ageMax: 8, deferrable: true, mood: "warm",
    title: "Pagar yang Rendah",
    prompt: "Anak dari rumah sebelah memanggilmu lewat pagar yang rendah setiap sore. Kalian belum tahu nama lengkap masing-masing, tapi itu tidak penting selama ada bola dan matahari yang belum tenggelam.",
    choices: [
      { id: "main", label: "Lompati pagar, main sampai magrib", outcomes: [
        { weight: 8, text: "Sore itu terasa tidak akan pernah habis. Lalu keluarganya pindah ke kota lain. Wajahnya terekam beberapa tahun di ingatanmu sebelum akhirnya memudar.", effects: { social: 4, happiness: 4 }, mood: "warm",
          addsRelationship: { id: "teman_sebelah", name: "Teman Sebelah Rumah", role: "friend", closeness: 45, alive: false },
          memory: { text: "Teman sebelah rumah dan sore yang dikira tak akan habis.", tag: "teman_kecil", mood: "warm" } },
      ]},
      { id: "malu", label: "Balas dari balik pagar, malu-malu", outcomes: [
        { weight: 8, text: "Butuh seminggu sebelum kamu berani melompat. Begitu berani, kalian jadi tak terpisahkan untuk waktu yang — seperti semua waktu masa kecil — ternyata pendek.", effects: { social: 3, mental: 2 },
          addsRelationship: { id: "teman_sebelah", name: "Teman Sebelah Rumah", role: "friend", closeness: 40, alive: false } },
      ]},
    ],
  }),

e({
    id: "bolos_les", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 7, ageMax: 10, deferrable: true,
    title: "Ajakan",
    prompt: "Temanmu menarik tanganmu. 'Bolos yuk.'",
    choices: [
      { id: "ikut", label: "Ikut", outcomes: [
        { weight: 8, text: "Kalian duduk di lapangan kosong sampai sore. Untuk pertama kalinya kamu merasa bebas, dan itu menakutkan.", effects: { happiness: 5, mental: 3 }, memory: { text: "Sore pertama kamu merasa bebas.", tag: "bebas", mood: "warm" } },
        { weight: 8, text: "Ketahuan guru. Orangtuamu dipanggil. Kamu menangis bukan karena dimarahi, tapi karena malu.", effects: { mental: -4, social: -2 } },
      ]},
      { id: "tolak", label: "Menolak", outcomes: [
        { weight: 8, text: "Tidak ada yang terjadi. Kamu menyesal. Atau hanya merasa harus menyesal. Sulit dibedakan.", effects: { discipline: 2, happiness: -1 } },
      ]},
      { id: "bohong", label: "Bohong ke orang tua, lalu ikut", outcomes: [
        { weight: 8, text: "Kamu tidak ketahuan. Pelajaran yang salah masuk: bohong itu bisa berhasil.", effects: { intelligence: 1, mental: -2 }, addTrait: "manipulative" },
      ]},
      { id: "ajak", label: "Ajak teman lain ikut", outcomes: [
        { weight: 8, text: "Kalian bertiga jadi sahabat dekat selama dua tahun.", effects: { social: 5, happiness: 4 }, addsRelationship: { id: "sahabat_bolos", name: "Sahabat Bolos", role: "friend", closeness: 60, alive: true }, memory: { text: "Dua tahun jadi bertiga, sahabat yang lahir dari satu ajakan bolos.", tag: "sahabat_bolos", mood: "warm" } },
        { weight: 8, text: "Kalian bertiga ketahuan dan dihukum berdiri di depan kelas. Anehnya, justru hukuman itu yang merekatkan kalian.", effects: { social: 4, happiness: 2, mental: -1 }, addsRelationship: { id: "sahabat_bolos", name: "Sahabat Bolos", role: "friend", closeness: 55, alive: true }, memory: { text: "Berdiri dihukum bertiga di depan kelas, dan malah jadi sahabat karenanya.", tag: "sahabat_bolos", mood: "warm" } },
      ]},
    ],
  }),

e({
    id: "pensil_biru", category: "pertemanan", pool: "callback", rarity: "uncommon",
    ageMin: 8, ageMax: 11, deferrable: true, mood: "warm",
    title: "Pensil Biru Kecil",
    prompt: "Teman sebangkumu — namanya susah kamu ingat sekarang — meminjamkan pensil biru kecil. Kamu lupa mengembalikannya.",
    choices: [
      { id: "kembalikan", label: "Kembalikan besoknya", outcomes: [
        { weight: 8, text: "Dia tersenyum. Kalian menjadi teman selama tiga bulan, lalu dia pindah sekolah.", effects: { social: 3 },
          memory: { text: "Pensil biru kecil dari teman sebangku yang namanya kini hilang.", tag: "pensil_biru", mood: "warm" },
          flag: "pensil_biru_dikembalikan", addsRelationship: { id: "tmn_pensil", name: "Teman Pensil", role: "friend", closeness: 40, alive: false } },
        { weight: 8, text: "Dia bilang 'simpan aja, aku punya banyak.' Pensil itu jadi milikmu dengan cara yang bersih. Kalian berteman beberapa bulan sebelum hidup menarik kalian ke arah yang berbeda.", effects: { social: 3, happiness: 1 },
          memory: { text: "Pensil biru yang akhirnya diberikan untukmu.", tag: "pensil_biru", mood: "warm" },
          flag: "pensil_biru_dikembalikan", addsRelationship: { id: "tmn_pensil", name: "Teman Pensil", role: "friend", closeness: 40, alive: false } },
      ]},
      { id: "simpan", label: "Simpan diam-diam", outcomes: [
        { weight: 8, text: "Pensil itu terselip di laci selama bertahun-tahun.", effects: { mental: -1 },
          memory: { text: "Pensil biru kecil yang tidak pernah kamu kembalikan.", tag: "pensil_biru", mood: "melancholy" },
          flag: "pensil_biru_disimpan" },
        { weight: 8, text: "Bertahun-tahun kemudian, setiap kali mengingat pensil itu, ada sengatan rasa bersalah yang tak sebanding dengan harga sebatang pensil. Begitulah utang yang paling lama dibayar: yang paling kecil.", effects: { mental: -2, intelligence: 1 },
          memory: { text: "Sengatan rasa bersalah tiap kali laci pensil biru terbuka.", tag: "pensil_biru", mood: "melancholy" },
          flag: "pensil_biru_disimpan" },
      ]},
      { id: "patah", label: "Patah tanpa sengaja", outcomes: [
        { weight: 8, text: "Kamu meminta maaf. Dia berkata 'tidak apa-apa' dengan suara yang sebenarnya apa-apa.", effects: { social: -2 } },
        { weight: 8, text: "Kamu meminta maaf dan menggantinya dengan pensilmu sendiri. Dia menerima. Pertukaran kecil yang entah kenapa kamu ingat sampai dewasa.", effects: { social: 1, mental: 1 } },
      ]},
      { id: "tidak_ingat", label: "Lupakan total", outcomes: [
        { weight: 8, text: "Sebuah hutang kecil yang menguap. Begitulah kebanyakan hutang dalam hidup.", effects: { happiness: 1 } },
      ]},
    ],
  }),

e({
    id: "surat_masa_depan", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 10, ageMax: 12, deferrable: true,
    title: "Surat untuk Nanti",
    prompt: "Guru menyuruh kalian menulis surat untuk diri sendiri 'yang akan dibuka saat sudah dewasa'. Kamu menggigit ujung pulpen, tidak tahu harus menjanjikan apa pada orang yang belum kamu kenal: dirimu nanti.",
    choices: [
      { id: "cita", label: "Tulis semua cita-cita besarmu", outcomes: [
        { weight: 8, text: "Kamu menulis daftar yang panjang dan berani, percaya semuanya mungkin. Surat itu disegel. Suatu hari kamu akan membacanya lagi dengan perasaan yang belum punya nama sekarang.", effects: { happiness: 3, intelligence: 2 }, flag: "surat_masa_depan",
          memory: { text: "Surat berisi cita-cita yang kamu segel untuk dibuka nanti.", tag: "surat_kapsul", mood: "warm" } },
      ]},
      { id: "pesan", label: "Tulis satu pesan singkat saja", outcomes: [
        { weight: 8, text: "'Semoga kamu senang.' Hanya itu. Tiga kata yang ternyata lebih paham masa depan daripada seluruh daftar cita-cita teman-temanmu.", effects: { mental: 3, intelligence: 2 }, flag: "surat_masa_depan", extraFlags: ["surat_isi_pesan"], mood: "melancholy",
          memory: { text: "Tiga kata yang kamu titipkan pada dirimu yang dewasa.", tag: "surat_kapsul", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "pubertas", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 13, ageMax: 16, deferrable: true,
    title: "Cermin",
    prompt: "Kamu menatap cermin lebih lama dari biasanya. Wajahmu mulai bukan wajahmu.",
    choices: [
      { id: "terima", label: "Tersenyum, mencoba menerima", outcomes: [
        { weight: 8, text: "Senyummu canggung, tapi kamu mencatat: ini aku, untuk sekarang.", effects: { mental: 4, happiness: 3 }, addTrait: "optimistic" },
        { weight: 8, text: "Senyummu canggung dan kamu tahu itu. Tapi kamu memutuskan tidak apa-apa terlihat canggung untuk sementara. Penerimaan yang rapuh, tapi kamu memulainya.", effects: { mental: 3, happiness: 2 }, addTrait: "optimistic" },
      ]},
      { id: "benci", label: "Memaki diri sendiri", outcomes: [
        { weight: 8, text: "Sebuah kebiasaan dimulai. Akan butuh berdekade untuk menghentikannya.", effects: { mental: -8, happiness: -5 }, flag: "self_loathing", mood: "melancholy" },
        { weight: 8, text: "Kata-kata yang kamu lempar ke cermin, menempel di kaca dan di dirimu. Tidak ada yang mendengar, jadi tidak ada yang menghentikannya.", effects: { mental: -7, happiness: -4 }, flag: "self_loathing", mood: "melancholy" },
      ]},
      { id: "ubah", label: "Memutuskan: aku akan jadi orang yang berbeda", outcomes: [
        { weight: 8, text: "Kamu mulai berolahraga, membaca, mencatat. Disiplin lahir dari rasa malu.", effects: { discipline: 8, health: 4, intelligence: 3 }, addTrait: "ambitious" },
        { weight: 8, text: "Kamu mulai dari satu hal kecil: bangun setengah jam lebih awal. Janji-janji besar itu kebanyakan gagal, tapi yang kecil bertahan dan diam-diam membentukmu.", effects: { discipline: 6, health: 2, mental: 2 }, addTrait: "ambitious" },
      ]},
      { id: "tidur", label: "Mematikan lampu, tidur", outcomes: [
        { weight: 8, text: "Beberapa malam memang lebih baik diakhiri saja.", effects: { health: 1 } },
      ]},
    ],
  }),

e({
    id: "remaja_lagu", category: "eksistensial", pool: "age", rarity: "common",
    ageMin: 13, ageMax: 17, deferrable: true, mood: "warm",
    title: "Lagu yang Kamu Klaim Sendiri",
    prompt: "Sebuah lagu menemukanmu di waktu yang tepat. Lewat earphone butut, di kamar, larut malam. Liriknya seperti ditulis oleh seseorang yang diam-diam menontonmu.",
    choices: [
      { id: "ulang", label: "Putar sampai hafal setiap jeda", outcomes: [
        { weight: 8, text: "Bertahun-tahun lagi, beberapa nada pertamanya saja sudah cukup menyeretmu kembali ke kamar ini, ke usia ini, ke versi dirimu yang masih percaya lagu bisa menyelamatkan orang.", effects: { happiness: 4, mental: 3 }, mood: "warm",
          memory: { text: "Lagu yang kamu klaim jadi milikmu sendiri, larut malam di usia remaja.", tag: "lagu_lama", mood: "warm" } },
      ]},
      { id: "bagikan", label: "Bagikan ke satu orang yang kamu percaya", outcomes: [
        { weight: 8, text: "Dia mendengarkan, lalu bilang 'biasa aja'. Ada sesuatu yang patah. Kamu belajar: ada lagu yang tetap utuh hanya kalau disimpan sendiri.", effects: { social: 2, mental: 1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "ktp_pertama", category: "absurd", pool: "age", rarity: "common",
    ageMin: 17, ageMax: 17, deferrable: true,
    title: "Dewasa di Atas Kertas",
    prompt: "Kartu identitas pertamamu jadi. Fotonya jelek, dan mulai hari ini negara menganggapmu bertanggung jawab atas dirimu sendiri.",
    choices: [
      { id: "pamer", label: "Tunjukkan ke semua orang", outcomes: [
        { weight: 8, text: "Tidak ada yang sekagum kamu. Tapi kamu tetap menyimpannya di dompet seperti benda berharga.", effects: { happiness: 2 } },
      ]},
      { id: "renung", label: "Tatap fotonya, merasa aneh", outcomes: [
        { weight: 8, text: "Wajah di kartu itu terlihat seperti orang yang sedang berpura-pura siap. Kamu belum merasa berbeda dari kemarin. Ternyata dewasa datang tanpa pemberitahuan.", effects: { mental: 2 } },
      ]},
    ],
  }),

e({
    id: "malam_terakhir_sekolah", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 18, ageMax: 18, mood: "melancholy",
    title: "Malam Terakhir Seragam",
    prompt: "Besok seragam itu tidak dipakai lagi. Malam ini kalian berkumpul di lapangan sekolah yang gelap, bicara tentang rencana besar yang — mungkin — sebagian besar tidak akan terjadi.",
    choices: [
      { id: "janji", label: "Buat janji akan tetap berteman", outcomes: [
        { weight: 8, text: "Kalian bersumpah tidak akan saling lupa. Sebagian menepatinya. Sebagian tidak. Kalian belum tahu yang mana.", effects: { social: 3, happiness: 3 }, mood: "melancholy",
          memory: { text: "Janji di lapangan gelap, malam terakhir seragam.", tag: "waktu", mood: "melancholy" } },
        { weight: 8, text: "Seseorang menyalakan lagu dari ponsel, dan kalian diam mendengarkannya sampai habis. Tidak ada yang bilang apa-apa. Tidak perlu.", effects: { social: 3, happiness: 2 }, mood: "warm",
          memory: { text: "Satu lagu yang kalian dengarkan diam-diam di malam perpisahan.", tag: "waktu", mood: "melancholy" } },
      ]},
      { id: "diam", label: "Lebih banyak diam, simpan momennya", outcomes: [
        { weight: 8, text: "Kamu mencoba menghafal semuanya. Siapa duduk di mana, siapa tertawa paling keras. Beberapa tahun lagi, ini yang tersisa.", effects: { mental: 3 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "pilih_jurusan", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 18, ageMax: 18, guaranteed: true,
    companionEvent: { id: "malam_terakhir_sekolah", chance: 0.5 },
    title: "Jurusan",
    prompt: "Formulir pendaftaran kuliah ada di mejamu. Kosong. Mengintimidasi.",
    choices: [
      { id: "kedokteran", label: "Kedokteran (kata orangtua)", outcomes: [
        { weight: 8, text: "Mereka bangga. Kamu mengangguk. Sesuatu di dadamu mengecil.", effects: { wealth: 5, happiness: -5, discipline: 5 }, flag: "jurusan_kedokteran" },
        { weight: 8, text: "Mereka bangga. Dan diam-diam, di balik rasa terpaksa, ada bagian kecil dirimu yang lega punya jalan yang sudah ditentukan.", effects: { wealth: 4, discipline: 6, mental: -2 }, flag: "jurusan_kedokteran" },
      ]},
      { id: "seni", label: "Seni rupa (yang kamu mau)", outcomes: [
        { weight: 8, text: "Ibumu diam tiga hari. Tapi kamu tidur lebih nyenyak.", effects: { happiness: 8, wealth: -3 }, addTrait: "creative", flag: "jurusan_seni" },
        { weight: 8, text: "Ayahmu marah. Tapi kamu menandatangani formulir itu dengan tangan yang tidak gemetar. Untuk pertama kalinya kamu memilih dirimu sendiri, dengan harga yang kamu tahu persis.", effects: { happiness: 5, wealth: -3, mental: 3 }, addTrait: "creative", flag: "jurusan_seni", mood: "melancholy" },
      ]},
      { id: "teknik", label: "IT (kata internet)", outcomes: [
        { weight: 8, text: "Pilihan aman yang akan membuatmu bertanya 'kenapa aku di sini' selama 4 tahun.", effects: { intelligence: 4, wealth: 3 }, flag: "jurusan_teknik" },
        { weight: 8, text: "Pilihan aman. Tapi di tahun kedua satu mata kuliah menyalakan sesuatu: kamu suka menyelesaikan masalah yang belum punya jawaban.", effects: { intelligence: 5, wealth: 3, discipline: 3 }, flag: "jurusan_teknik" },
      ]},
      { id: "gap_year", label: "Gap year. Cari diri sendiri.", outcomes: [
        { weight: 8, text: "Kamu menemukan dirimu. Atau hanya menunda menemukannya.", effects: { mental: 5, wealth: -5 }, addTrait: "curious", flag: "gap_year" },
        { weight: 8, text: "Setahun berlalu. Kamu masih tidak tahu apa-apa, tapi sekarang lebih tua.", effects: { happiness: -3, mental: -3 }, flag: "gap_year" },
      ]},
    ],
  }),

e({
    id: "teman_berpencar", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 19, ageMax: 24, deferrable: true, mood: "melancholy",
    title: "Arah yang Berbeda",
    prompt: "Grup chat yang dulu ramai tiap menit sekarang sepi berhari-hari. Masing-masing pergi ke kota, kampus, kesibukan sendiri. Tidak ada yang bertengkar. Kalian hanya pelan-pelan berhenti.",
    choices: [
      { id: "hidupkan", label: "Coba hidupkan lagi, ajak ketemu", outcomes: [
        { weight: 8, text: "Beberapa membalas antusias, lalu sibuk lagi. Satu orang benar-benar datang. Ternyata satu sudah cukup.", effects: { social: 4, happiness: 3 },
          addsRelationship: { id: "teman_bertahan", name: "Teman yang Bertahan", role: "friend", closeness: 50, alive: true } },
        { weight: 8, text: "Tidak ada yang sempat. Rencana itu mengambang lalu tenggelam, seperti banyak rencana setelah ini. Kamu belajar menerimanya tanpa membencinya.", effects: { mental: 2, social: -1 }, mood: "melancholy" },
      ]},
      { id: "relakan", label: "Biarkan. Tidak semua harus diselamatkan.", outcomes: [
        { weight: 8, text: "Kamu menutup grup itu tanpa keluar. Sesekali kamu membukanya lagi, membaca obrolan lama, tersenyum, lalu menutupnya lagi.", effects: { mental: 2 }, mood: "melancholy",
          memory: { text: "Grup chat lama yang sepi, sesekali kamu buka cuma untuk tersenyum.", tag: "waktu", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "pulang_pertama_kos", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 23, ageMax: 26, requireFlag: "tinggal_kos", forbidFlag: "ibu_meninggal", deferrable: true, mood: "melancholy",
    title: "Pulang, Pertama Kali",
    prompt: (ctx) => {
      const ayahHidup = ctx.state.relationships.some((r) => r.id === "ayah" && r.alive);
      const siapa = ayahHidup ? "orang tuamu" : "ibumu";
      return `Pulang ke rumah pertama kali setelah ngekos. Pintunya sama, bau rumahnya sama. Hanya ${siapa} yang terlihat sedikit lebih tua dari yang kamu ingat. Atau kamu yang baru memperhatikan.`;
    },
    choices: [
      { id: "peluk", label: "Peluk dulu, sebelum apa-apa", outcomes: [
        { weight: 8, text: "Pelukan yang lebih lama dari biasanya. Kalian sama-sama tidak bilang kenapa.", effects: { happiness: 5, mental: 3 }, mood: "warm",
          memory: { text: "Pulang pertama dari kos, dan pelukan yang lebih lama dari biasa.", tag: "keluarga", mood: "warm" } },
        { weight: 8, text: "Ibumu langsung menanyakan kamu sudah makan apa belum, dan entah kenapa pertanyaan itu yang membuat matamu panas.", effects: { happiness: 4, mental: 3 }, mood: "warm",
          memory: { text: "'Sudah makan belum?' Pertanyaan yang membuatmu hampir menangis.", tag: "ibu", mood: "warm" } },
      ]},
      { id: "amati", label: "Diam, perhatikan rumah yang menua", outcomes: [
        { weight: 8, text: "Cat yang mengelupas, kursi yang sama, foto yang tidak pernah diganti. Rumah berhenti di satu waktu sementara kamu terus berjalan.", effects: { mental: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "kerja_pertama", category: "pekerjaan", pool: "age", rarity: "common",
    ageMin: 24, ageMax: 24, guaranteed: true,
    forbidAnyFlag: ["jurusan_kedokteran", "jurusan_filsafat", "jurusan_psikologi", "barista", "pedagang_kaki_lima"],
    companionEvent: { id: "gaji_pertama", chance: 1 },
    title: "Hari Pertama Kerja",
    prompt: (ctx) => karirOf(ctx.state) === "seni"
      ? "Hari pertama di agensi desain. Layar besar menyala, playlist lo-fi pelan, dan kalimat 'di sini kita santai kok, kayak keluarga'."
      : "Kantor pertamamu. Air galon, AC dingin, dan kalimat 'kita di sini seperti keluarga'.",
    choices: (ctx) => {
      const seni = karirOf(ctx.state) === "seni";
      return [
        { id: "percaya", label: "Percaya itu", outcomes: [
          { weight: 8, text: seni
              ? "Kamu revisi desain sampai dini hari, tanpa dihitung lembur. 'Demi keluarga.'"
              : "Kamu lembur tanpa dibayar. 'Demi keluarga.'", effects: { wealth: 3, mental: -5, happiness: -3 }, flag: "loyal_pegawai", extraFlags: ["sudah_lulus"] },
          { weight: 8, text: seni
              ? "Kamu beri lebih dari yang diminta. Namamu disebut di rapat, desainmu dipakai. Tapi pujian tidak pernah berubah jadi cuti atau upah lembur."
              : "Kamu beri lebih dari yang diminta. Awalnya terasa dihargai. Sampai kamu sakit, dan tak seorang pun dari 'keluarga' ini yang menanyakan kabarmu.", effects: { wealth: 4, mental: -4, social: 2 }, flag: "loyal_pegawai", extraFlags: ["sudah_lulus"], mood: "melancholy" },
        ]},
        { id: "skeptis", label: "Tersenyum sopan, tapi tidak percaya", outcomes: [
          { weight: 8, text: "Kamu pulang tepat waktu. Dianggap 'tidak punya passion'.", effects: { mental: 4, social: -2 }, addTrait: "ambitious", flag: "sudah_lulus" },
          { weight: 8, text: seni
              ? "Kamu pulang tepat waktu dan mengerjakan desain sendiri di rumah. 'Kurang passion,' kata mereka. Karya pribadi itu yang kelak membuka pintu yang tidak mereka punya."
              : "Kamu pulang tepat waktu, menjaga sisa harimu untuk dirimu sendiri. Dianggap kurang ambisius. Tapi kamu mengukur hidup dengan penggaris yang berbeda dari mereka.", effects: { mental: 4, happiness: 3, discipline: 2 }, addTrait: "ambitious", flag: "sudah_lulus" },
        ]},
        { id: "freelance", label: seni ? "Resign minggu kedua, jadi desainer lepas" : "Resign minggu kedua, jadi freelancer", outcomes: [
          { weight: 8, text: "Kebebasan! Juga ketidakpastian, kelaparan, dan klien yang ghosting.", effects: { happiness: 3, wealth: -5, mental: -2 }, flag: "freelancer", extraFlags: ["sudah_lulus"] },
          { weight: 8, text: "Tiga bulan kemudian, kamu punya 5 klien tetap. Kamu jarang tidur, tapi kamu hidup.", effects: { wealth: 8, happiness: 4 }, flag: "freelancer_sukses", extraFlags: ["sudah_lulus"] },
        ]},
        { id: "startup", label: seni ? "Pindah ke startup produk, jadi desainer pertama" : "Pindah ke startup yang menjanjikan saham", outcomes: [
          { weight: 8, text: "CEO bilang kalian akan IPO tahun depan. Itu 6 tahun lalu.", effects: { wealth: -2, mental: -4 }, mood: "melancholy", flag: "sudah_lulus" },
          { weight: 8, text: "Startup itu exit. Kamu beli rumah cash. Tapi tidak bisa tidur.", effects: { wealth: 30, happiness: 3, mental: -3 }, achievement: "Equity Bermakna", flag: "rumah_besar", extraFlags: ["sudah_lulus"] },
        ]},
      ];
    },
  }),

e({
    id: "gaji_pertama", category: "pekerjaan", pool: "age", rarity: "common",
    ageMin: 24, ageMax: 24, companionOnly: true, forbidFlag: "jurusan_kedokteran",
    title: "Angka Pertama di Rekening",
    prompt: "Notifikasi masuk: gaji pertamamu. Angka yang dulu terasa besar, sekarang terlihat persis sebesar yang kamu butuhkan dan tidak lebih.",
    choices: (ctx) => {
      const ibuHidup = ctx.state.relationships.some((r) => r.id === "ibu" && r.alive);
      const ayahHidup = ctx.state.relationships.some((r) => r.id === "ayah" && r.alive);
      const ortuChoice = (() => {
        if (ibuHidup && ayahHidup) {
          return [{ id: "ortu", label: "Belikan sesuatu untuk orang tua", outcomes: [
            { weight: 8, text: "Mereka bilang tidak usah, tapi menyimpannya. Wajah ibumu adalah hal terbaik yang dibeli uang itu.", effects: { happiness: 5, wealth: -2, social: 2 }, mood: "warm" as const,
              memory: { text: "Hadiah pertama dari gaji pertama, dan wajah orang tuamu.", tag: "keluarga", mood: "warm" as const } },
            { weight: 8, text: "Mereka menolak keras, lalu menerima sambil pura-pura kesal. Malamnya kamu dengar mereka menelepon saudara, menceritakannya.", effects: { happiness: 5, wealth: -2, social: 2 }, mood: "warm" as const,
              memory: { text: "Orang tua yang diam-diam membanggakan gaji pertamamu.", tag: "keluarga", mood: "warm" as const } },
          ]}];
        }
        if (ibuHidup) {
          return [{ id: "ortu", label: "Belikan sesuatu untuk Ibu", outcomes: [
            { weight: 8, text: "Ibumu bilang tidak usah, tapi menyimpannya. Wajahnya adalah hal terbaik yang dibeli uang itu.", effects: { happiness: 5, wealth: -2, social: 2 }, mood: "warm" as const,
              memory: { text: "Hadiah pertama dari gaji pertama, dan wajah ibu.", tag: "ibu", mood: "warm" as const } },
            { weight: 8, text: "Ibumu menolak keras, lalu menerima sambil pura-pura kesal. Malamnya kamu dengar dia menelepon saudara, menceritakannya.", effects: { happiness: 5, wealth: -2, social: 2 }, mood: "warm" as const,
              memory: { text: "Ibu yang diam-diam membanggakan gaji pertamamu.", tag: "ibu", mood: "warm" as const } },
          ]}];
        }
        if (ayahHidup) {
          return [{ id: "ortu", label: "Belikan sesuatu untuk Ayah", outcomes: [
            { weight: 8, text: "Ayahmu bilang tidak usah, tapi menyimpannya di laci. Caranya menahan diri agar tidak tersenyum adalah hal terbaik yang dibeli uang itu.", effects: { happiness: 5, wealth: -2, social: 2 }, mood: "warm" as const,
              memory: { text: "Hadiah pertama dari gaji pertama, dan wajah ayah.", tag: "ayah", mood: "warm" as const } },
            { weight: 8, text: "Ayahmu menolak keras, lalu menerima sambil pura-pura kesal. Malamnya kamu dengar dia menelepon saudara, menceritakannya.", effects: { happiness: 5, wealth: -2, social: 2 }, mood: "warm" as const,
              memory: { text: "Ayah yang diam-diam membanggakan gaji pertamamu.", tag: "ayah", mood: "warm" as const } },
          ]}];
        }
        return [];
      })();
      return [
        ...ortuChoice,
        { id: "diri", label: "Beli satu hal yang lama kamu inginkan", outcomes: [
          { weight: 8, text: "Barang itu tidak sehebat yang kamu bayangkan. Tapi membelinya dengan uang sendiri, itu yang terasa hebat.", effects: { happiness: 4, wealth: -2 } },
        ]},
        { id: "simpan", label: "Tabung semuanya", outcomes: [
          { weight: 8, text: "Kamu menatap saldonya tumbuh sedikit, dan merasa dewasa dengan cara yang membosankan. Berdekade kemudian, kamu akan berterima kasih pada disiplin ini.", effects: { wealth: 3, discipline: 3 } },
        ]},
      ];
    },
  }),

e({
    id: "wawancara_pertama", category: "pekerjaan", pool: "age", rarity: "common",
    ageMin: 24, ageMax: 26, deferrable: true,
    forbidAnyFlag: ["jurusan_kedokteran", "barista", "pedagang_kaki_lima"],
    title: "Wawancara",
    prompt: "Kemeja yang terlalu rapi, ruang tunggu yang terlalu dingin. Pewawancara bertanya: 'Apa kelemahan terbesarmu?' Kamu tahu jawaban jujurnya, dan kamu tahu kamu tidak ingin mengatakannya.",
    choices: [
      { id: "klise", label: "'Saya terlalu perfeksionis.'", outcomes: [
        { weight: 8, text: "Dia mengangguk seperti belum pernah mendengarnya hari itu. Kalian sama-sama tahu ini sandiwara. Kamu dapat panggilan kedua.", effects: { social: 2, wealth: 1 } },
        { weight: 8, text: "Dia mencatat sesuatu. Kamu tidak pernah tahu apa. Surat penolakan datang dua minggu kemudian, sopan dan kosong.", effects: { mental: -3 }, mood: "melancholy" },
      ]},
      { id: "jujur", label: "Jawab dengan jujur, apa adanya", outcomes: [
        { weight: 8, text: "Sesuatu di matanya berubah. Entah respek, entah kasihan. Kamu keluar tanpa tahu hasilnya, tapi kamu bangga pada dirimu sendiri.", effects: { mental: 3, social: 1 },
          memory: { text: "Wawancara pertama yang kamu jawab jujur, apa pun hasilnya.", tag: "kerja", mood: "neutral" } },
        { weight: 8, text: "Kejujuran itu terlalu dini. Dia tersenyum sopan dan menutup map. Kamu belajar: ada ruangan yang tidak dibuat untuk kejujuran.", effects: { mental: -2, intelligence: 1 }, mood: "melancholy" },
      ]},
    ],
  }),
];
