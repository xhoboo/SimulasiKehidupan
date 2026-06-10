import { LifeEvent } from "../types";
import { e, karirOf } from "./_helpers";

// Pool sindiran sosial: humor satir, kadang menyakitkan.
export const SATIRICAL_POOL: LifeEvent[] = [
  e({
    id: "toxic_positivity", category: "internet", pool: "satirical", rarity: "common",
    ageMin: 20, ageMax: 35, title: "Postingan Teman",
    prompt: "Teman lama posting 'Kalau kamu masih sedih, berarti kamu kurang bersyukur. Stay positive!' dengan 1.2k likes.",
    choices: [
      { id: "like", label: "Like, scroll terus", outcomes: [
        { weight: 8, text: "Kamu ikut menekan 'suka'. Jempolmu lebih cepat dari keberatanmu. Sesuatu di dalammu menua sedikit lebih cepat.", effects: { mental: -2 } },
        { weight: 8, text: "Kamu like, lalu menutup aplikasi dan menatap dinding. Kalimat 'kurang bersyukur' itu menempel lama, dan kamu mulai diam-diam memeriksa 'apa benar?' Begitulah cara kalimat yang dangkal melukai dalam.", effects: { mental: -3 }, mood: "melancholy" },
      ]},
      { id: "komen", label: "Komentar panjang menyanggah", outcomes: [
        { weight: 8, text: "Komentarmu di-hide. Kamu di-block. Kamu menang, mungkin?", effects: { social: -2, mental: 3 } },
        { weight: 8, text: "Kamu tulis sanggahan yang hati-hati dan berdasar. Dibalas 'jangan baper, just sharing bestie', lalu tiga orang menyerangmu karena merusak vibes. Kamu hapus komentarmu sendiri, bukan karena salah, tapi karena lelah.", effects: { social: -2, mental: 1 } },
      ]},
      { id: "unfollow", label: "Unfollow diam-diam", outcomes: [
        { weight: 8, text: "Beranda jadi lebih tenang. Kepalamu juga.", effects: { mental: 4, happiness: 2 } },
        { weight: 8, text: "Kamu unfollow tanpa drama. Dia tidak akan pernah sadar. Beranda jadi sedikit lebih jujur, dan kamu menyadari betapa banyak 'teman' ternyata cuma jadi kebisingan yang kamu izinkan tinggal terlalu lama.", effects: { mental: 4, happiness: 2 } },
      ]},
    ],
  }),

  e({
    id: "bangun_jam4", category: "internet", pool: "satirical", rarity: "uncommon",
    ageMin: 22, ageMax: 34, requireWealthMax: 35, title: "Seminar Daring",
    prompt: "Iklan 'Bangun jam 4 pagi untuk sukses.' Kamu klik karena penasaran, atau karena putus asa?",
    choices: [
      { id: "ikut", label: "Daftar Rp 999.000", outcomes: [
        { weight: 8, text: "Materi 'Mindset is everything.' 6 jam. Kamu pulang lebih lelah dari sebelumnya.", effects: { wealth: -8, mental: -3, discipline: 2 } },
        { weight: 8, text: "Pembicaranya bangun jam 4 untuk menjual cara bangun jam 4 ke orang yang bangun jam 4. Kamu mencatat rajin di dua jam pertama, lalu tertidur di kursi pada jam ketiga.", effects: { wealth: -8, mental: -2, discipline: 1 } },
      ]},
      { id: "coba", label: "Coba sendiri tanpa bayar", outcomes: [
        { weight: 8, text: "Tiga hari pertama, produktif. Hari keempat, ketiduran jam 7 malam.", effects: { discipline: 2, health: -2 } },
        { weight: 8, text: "Seminggu kamu bangun jam 4 dan benar-benar produktif. Lalu satu hari kesiangan, dan rasa gagal itu menghapus semua yang sudah kamu bangun. Ternyata yang rapuh bukan jadwalnya, tapi caramu menghukum diri sendiri.", effects: { discipline: 1, mental: -2, health: -1 } },
      ]},
      { id: "skip", label: "Tutup tab", outcomes: [
        { weight: 8, text: "Kamu lanjutkan hidupmu. Itu juga sebuah kemenangan.", effects: { mental: 3 } },
        { weight: 8, text: "Kamu tutup tab dan tidur sampai jam 7 dengan damai. Orang-orang sukses di iklan itu mungkin sudah olahraga dua jam, kamu sudah beristirahat penuh. Belum tahu siapa yang lebih menang.", effects: { mental: 3, health: 1 } },
      ]},
    ],
  }),

  e({
    id: "phk_keluarga", category: "pekerjaan", pool: "satirical", rarity: "uncommon",
    ageMin: 24, ageMax: 35, requireFlag: "loyal_pegawai", mood: "tragic",
    companionEvent: { id: "br_setelah_phk", chance: 0.5 },
    title: (ctx) => karirOf(ctx.state) === "dokter" ? "Rapat Pagi soal 'Efisiensi'" : "Pesan WhatsApp Pagi Hari",
    prompt: (ctx) => karirOf(ctx.state) === "dokter"
      ? "Manajemen baru bicara soal 'efisiensi' dan 'arah strategis'. Lalu, dengan bahasa yang sudah dipoles rapi, unit tempatmu bertugas akan dirampingkan, dan kontrakmu tidak diperpanjang. 'Ini bukan soal kinerja,' katanya, seolah itu menghibur."
      : "Bos bilang 'Kantor kita seperti keluarga.' Pesan berikutnya: 'Karena restrukturisasi, posisi Anda kami eliminasi efektif hari ini.'",
    choices: [
      { id: "linkedin", label: "Tulis post LinkedIn 'Excited to share...'", outcomes: [
        { weight: 8, text: "300 likes. 31 'open to opportunities'. Nol panggilan.", effects: { social: 1, mental: -3 }, flag: "phk" },
        { weight: 8, text: "Kamu tulis 'Setelah perjalanan luar biasa, saya membuka babak baru' dengan emoji roket. Sebelas orang yang juga baru kena layoff me-like dengan solidaritas yang tidak terucap. Babak baru itu, untuk sementara, kasur dengan sprei MU.", effects: { social: 1, mental: -3 }, flag: "phk", mood: "melancholy" },
      ]},
      { id: "diam", label: "Tutup laptop. Tatap langit-langit.", outcomes: [
        { weight: 8, text: "Tiga jam berlalu seperti tiga menit. Atau sebaliknya?", effects: { mental: -8, happiness: -6 }, mood: "tragic", flag: "phk", memory: { text: "Hari kamu di-PHK lewat WhatsApp.", tag: "phk", mood: "tragic" } },
        { weight: 8, text: "Kamu tutup laptop pelan, seolah menutupnya keras-keras membuat ini lebih nyata. Kucing tetangga lewat di jendela. Dunia tidak tahu, tidak peduli, tetap berjalan persis seperti kemarin. Itu bagian yang paling aneh.", effects: { mental: -8, happiness: -5 }, mood: "tragic", flag: "phk", memory: { text: "Sore kamu menutup laptop pelan, hari namamu dieliminasi.", tag: "phk", mood: "tragic" } },
      ]},
      { id: "tuntut", label: "Konsultasi pengacara", outcomes: [
        { weight: 8, text: "Pesangon cair. Tidak ada kata maaf, hanya angka.", effects: { wealth: 8, mental: 2 }, flag: "phk" },
        { weight: 8, text: "Pengacara menjelaskan hakmu dengan tarif per jam. Kamu menghitung apakah menuntut keadilan lebih mahal dari keadilan itu sendiri. Kamu ambil pesangon yang ditawarkan, menandatangani dokumen yang melarangmu bicara, lalu pulang.", effects: { wealth: 7, mental: 1 }, flag: "phk" },
      ]},
      { id: "rayakan", label: "Beli kue, rayakan kebebasan", outcomes: [
        { weight: 8, text: "Kuemu enak. Tabunganmu tidak.", effects: { happiness: 4, wealth: -2 }, flag: "phk" },
        { weight: 8, text: "Kamu beli kue, menyalakan satu lilin seolah ulang tahun, lalu tertawa sendirian di dapur sampai tawanya berubah jadi sesuatu yang lain. Kuenya tetap kamu habiskan. Besok urusan besok.", effects: { happiness: 3, wealth: -2, mental: -1 }, flag: "phk" },
      ]},
    ],
  }),

  e({
    id: "email_urgent_santai", category: "pekerjaan", pool: "satirical", rarity: "uncommon",
    ageMin: 24, ageMax: 42, title: "Email Pukul 23:58",
    prompt: "Subjek: 'urgent santai aja'. Body: 'Tolong dikerjakan ya. Besok pagi sudah ada di meja.'",
    choices: [
      { id: "kerjakan", label: "Kerjakan sampai pagi", outcomes: [
        { weight: 8, text: "Selesai jam 4. Bos baca jam 11 siang. Tanpa balasan.", effects: { mental: -5, discipline: 2 } },
        { weight: 8, text: "Selesai jam 4 pagi, kamu kirim dengan catatan sopan. Bos balas tiga hari kemudian 'oh ini ternyata nggak jadi dipakai, tapi makasih ya.' Kamu menatap layar, lalu menatap jendela yang mulai terang.", effects: { mental: -6, discipline: 1 }, mood: "melancholy" },
      ]},
      { id: "tunda", label: "Balas 'baik' lalu tidur", outcomes: [
        { weight: 8, text: "Pagi hari, panik singkat, lalu kerja terburu-buru. Tetap selesai.", effects: { mental: -2, happiness: 1 } },
        { weight: 8, text: "Kamu balas 'siap' lalu tidur nyenyak, sebuah pemberontakan kecil. Paginya kamu kerjakan dalam satu jam panik yang efektif. Ternyata 'urgent' semalam dan 'urgent' pagi ini menghasilkan kualitas yang sama persis.", effects: { mental: -1, happiness: 2, discipline: 1 } },
      ]},
      { id: "abaikan", label: "Tidak balas, tidur", outcomes: [
        { weight: 8, text: "Bos kecewa secara pasif-agresif selama seminggu.", effects: { social: -3, mental: 2 } },
        { weight: 8, text: "Kamu tidak balas, tidur, dan bangun tanpa rasa bersalah. Bos tidak menegur langsung. Hanya, selama seminggu, semua pesannya padamu berakhir dengan titik. Perang dingin lewat tanda baca.", effects: { social: -3, mental: 2 } },
      ]},
    ],
  }),

  e({
    id: "mlm_teman_lama", category: "absurd", pool: "satirical", rarity: "uncommon",
    ageMin: 27, ageMax: 40, deferrable: true,
    title: "Pesan dari Teman SMP",
    prompt: "Andi, teman SMP yang tidak menghubungimu 12 tahun: 'Halo bro, masih ingat aku? Ada peluang menarik nih...'",
    choices: (ctx) => [
      { id: "ikut", label: "Datang ke 'seminar gratis'", outcomes: [
        { weight: 8, text: `Tiga jam tepuk tangan. Kamu pulang dengan kit produk dan ${ctx.state.stats.wealth > 35 ? "defisit 5 juta" : "utang Rp 5 juta"}.`, effects: { wealth: -10, social: -3 }, flag: "korban_mlm" },
        { weight: 8, text: "Kamu pulang tanpa beli kit, bangga sudah menolak. Tiga hari kemudian kamu transfer juga, karena Andi ngepost foto anaknya dan menulis 'demi masa depan keluarga.' Manipulasi yang kamu lihat dari jauh ternyata tetap kena dari dekat.", effects: { wealth: -8, social: -2, mental: -2 }, mood: "melancholy" },
      ]},
      { id: "tolak", label: "Tolak halus", outcomes: [
        { weight: 8, text: "Andi tidak pernah membalas pesanmu lagi. Begitulah pertemanan modern.", effects: { social: -1, mental: 2 } },
        { weight: 8, text: "Kamu tolak, dan dia langsung beralih ke kontak berikutnya tanpa jeda. Kamu sempat dengar nada suaranya berubah ke mode penjual untuk orang setelahmu. Begitu cepat, begitu efisien.", effects: { social: -1, mental: 1 } },
      ]},
      { id: "ghosting", label: "Read, tidak balas", outcomes: [
        { weight: 8, text: "Sebulan kemudian dia mengirim ulang pesan yang sama, copy-paste.", effects: { happiness: 1 } },
        { weight: 8, text: "Read, tidak balas. Dia kirim stiker 'jangan diabaikan dong 😊', lalu broadcast. Lalu kamu masuk daftar penerima pesan motivasi paginya selama tiga tahun.", effects: { happiness: 1, social: -1 } },
      ]},
      { id: "balik", label: "Tawarkan asuransi balik", outcomes: [
        { weight: 8, text: "Stalemate. Kalian saling block dengan rasa hormat.", effects: { social: 2 } },
        { weight: 8, text: "Untuk satu menit yang aneh, kalian berdua jadi penjual yang menjual ke penjual. Tidak ada yang beli. Kalian tutup telepon dengan rasa hormat dari dua orang yang sama-sama lelah.", effects: { social: 2, happiness: 1 } },
      ]},
    ],
  }),

  e({
    id: "mantan_motivator", category: "internet", pool: "satirical", rarity: "uncommon",
    ageMin: 28, ageMax: 38, deferrable: true,
    title: "Beranda Pagi",
    prompt: "Algoritma menyodorkan video. Mantanmu, sekarang content creator motivasi, berkata 'Stop blame your past. Just glow up bestie.'",
    choices: [
      { id: "follow", label: "Follow, like, komen 'inspiring!'", outcomes: [
        { weight: 8, text: "Dia membalas satu emoji bunga. Bunga yang sama yang dia kirim ke ribuan komentar lain. Kamu membiarkan tab itu terbuka sampai layar mengunci sendiri.", effects: { mental: -3, happiness: -2 }, mood: "melancholy" },
        { weight: 8, text: "Kamu like, komen 'inspiring!', lalu menonton story-nya empat belas kali sambil meyakinkan diri kamu baik-baik saja. Algoritma mulai menjejali berandamu dengan kontennya tiap hari.", effects: { mental: -3, happiness: -2 }, mood: "melancholy" },
      ]},
      { id: "block", label: "Block.", outcomes: [
        { weight: 8, text: "Algoritma menggantinya dengan video lain. Mungkin itulah glow up sebenarnya.", effects: { mental: 4 } },
        { weight: 8, text: "Kamu block, dan untuk tiga detik merasa menang. Lalu kamu sadar kamu hafal username-nya di luar kepala, cukup untuk mengeceknya lewat mode incognito kapan saja. Block, ternyata, lebih mudah dari melupakan.", effects: { mental: 3 } },
      ]},
      { id: "stalk", label: "Stalk diam-diam selama 2 jam", outcomes: [
        { weight: 8, text: "Dia tinggal di Bali sekarang. Kamu?", effects: { mental: -6, happiness: -4 }, mood: "melancholy", memory: { text: "Malam kamu menggulir feed mantan sampai matahari terbit.", tag: "mantan", mood: "melancholy" } },
        { weight: 8, text: "Dua jam jadi empat. Kamu sampai ke postingan tiga tahun lalu, refleks menahan napas takut salah pencet 'like'. Matahari sudah naik saat kamu menutupnya, tahu persis kabarnya sekarang, dan tidak satu pun membuatmu lebih baik.", effects: { mental: -6, happiness: -4 }, mood: "melancholy", memory: { text: "Subuh kamu sampai ke postingan tiga tahun lalu, menahan napas takut salah pencet.", tag: "mantan", mood: "melancholy" } },
      ]},
      { id: "course", label: "Beli course motivasinya", outcomes: [
        { weight: 8, text: "Course-nya 70% template Canva yang dijual ulang. Kamu sudah curiga sejak menit kelima, dan tetap menontonnya sampai habis.", effects: { wealth: -4, mental: -4 } },
        { weight: 8, text: "Modul 1 dan 2 adalah 'Percaya Diri' dan 'Percaya Diri (Lanjutan)'. Modul 3 tak pernah rilis 'karena permintaan tinggi'. Kamu tetap bayar penuh. Itu yang paling kamu sesali, bukan uangnya.", effects: { wealth: -4, mental: -3 } },
      ]},
    ],
  }),

  e({
    id: "grup_wa_pagi", category: "internet", pool: "satirical", rarity: "common",
    ageMin: 60, ageMax: 88, deferrable: true,
    title: "Selamat Pagi dengan Gambar Bunga",
    prompt: "Grup keluarga aktif sejak jam lima pagi. Gambar bunga beranimasi, ayat, ucapan selamat pagi, dan satu kabar kesehatan yang sumbernya 'kata grup sebelah'.",
    choices: [
      { id: "kirim_balik", label: "Balas dengan gambar bunga juga", outcomes: [
        { weight: 8, text: "Kamu meneruskan gambar dari sepupumu ke grup yang lain. Begitulah kabar berputar di keluarga ini. Tanpa awal, tanpa akhir, tanpa pernah diperiksa.", effects: { social: 2 } },
        { weight: 8, text: "Kamu balas gambar bunga. Sepuluh menit kemudian ada yang menanyakan resep, dua berdebat politik, satu mengirim nomor rekening sumbangan tak jelas. Pagi yang biasa, di grup yang biasa.", effects: { social: 2 } },
      ]},
      { id: "luruskan", label: "Koreksi kabar kesehatan yang salah", outcomes: [
        { weight: 8, text: "Kamu mengetik penjelasan panjang lengkap dengan sumbernya. Tidak ada yang membalas. Gambar bunga berikutnya masuk dua menit kemudian.", effects: { mental: -1, intelligence: 1 } },
        { weight: 8, text: "Kamu kirim tautan dari sumber terpercaya. Dibalas 'tapi kata anak saya yang dokter, beda lho.' Kamu mengetik balasan dan menghapusnya lagi. Beberapa pertempuran lebih bijak tidak dimenangkan.", effects: { mental: -1, intelligence: 1 } },
      ]},
      { id: "diam", label: "Baca, tidak membalas apa-apa", outcomes: [
        { weight: 8, text: "Lima ratus pesan belum terbaca pada akhir minggu. Kamu menandai semuanya sudah dibaca tanpa membacanya. Sebuah upacara kecil yang dilakukan jutaan orang seusiamu, masing-masing diam-diam.", effects: { mental: 2 } },
        { weight: 8, text: "Kamu keluar diam-diam dari satu grup, dan dalam sejam ditambahkan kembali oleh Om yang merasa kamu 'kepencet'. Kamu pasrah. Ada hal-hal di usia ini yang lebih mudah diterima daripada dilawan.", effects: { mental: 2 } },
      ]},
    ],
  }),

  e({
    id: "iklan_obat_tv", category: "absurd", pool: "satirical", rarity: "uncommon",
    ageMin: 62, ageMax: 90, deferrable: true, mood: "melancholy",
    title: "Penonton yang Dituju",
    prompt: "Iklan demi iklan berbunyi, sendi yang ngilu, tulang yang keropos, jantung yang perlu dijaga. Kamu menyadari, dengan tenang, bahwa semua iklan ini ditujukan tepat untukmu.",
    choices: [
      { id: "catat", label: "Catat nomor telepon di layar", outcomes: [
        { weight: 8, text: "Kamu menuliskannya di kertas yang sama tempat tersimpan nomor-nomor lain yang tidak pernah kamu telepon. Daftar itu sudah dua halaman.", effects: { health: 1 } },
        { weight: 8, text: "Kamu tulis nomornya, lalu sadar tanganmu sendiri gemetar saat menulis. Gejala yang persis disebut iklan tadi. Kamu tertawa pelan pada lelucon yang tidak ada pembuatnya. Daftar itu bertambah lagi satu nomor yang tidak akan kamu telepon.", effects: { health: 1, mental: -1 }, mood: "melancholy" },
      ]},
      { id: "ganti", label: "Ganti channel", outcomes: [
        { weight: 8, text: "Channel berikutnya, iklan asuransi untuk 'masa pensiun yang tenang'. Dunia sudah memutuskan kamu masuk kategori mana, dan ia tidak menanyakan pendapatmu.", effects: { mental: 1 } },
        { weight: 8, text: "Kamu ganti channel berkali-kali dan tiap channel seolah tahu usiamu. Obat, asuransi, vitamin, lalu sinetron tentang orang tua yang ditinggal anak-anaknya. Kamu matikan TV. Hening kadang lebih ramah.", effects: { mental: 1 } },
      ]},
      { id: "tonton", label: "Tonton saja, tanpa beban", outcomes: [
        { weight: 8, text: "Modelnya tertawa terlalu lebar sambil memegang lutut yang katanya sudah sembuh. Kamu ikut tertawa, bukan karena percaya, hanya karena lucu betapa keras mereka berusaha.", effects: { happiness: 2, mental: 1 } },
        { weight: 8, text: "Kamu tonton sampai habis, hafal jingle-nya, dan mendapati dirimu menyenandungkannya di dapur keesokan hari. Iklan itu menang, dengan caranya yang kecil dan absurd. Kamu tidak keberatan ditemani, bahkan oleh penjual.", effects: { happiness: 2, mental: 1 } },
      ]},
    ],
  }),
];
