import { Choice, LifeEvent } from "../types";
import { e, kerjaCtx } from "./_helpers";

export const RELATIONSHIP_POOL: LifeEvent[] = [
  e({
    id: "bertemu_sahabat", category: "pertemanan", pool: "relationship", rarity: "common",
    ageMin: 8, ageMax: 11, deferrable: true, mood: "warm",
    title: "Teman yang Kamu Pilih Sendiri",
    prompt: "Anak yang duduk di sebelahmu membagi dua jajannya tanpa kamu minta, lalu mendorong setengahnya ke mejamu seolah itu hal paling biasa di dunia. Kalian belum hafal nama panjang masing-masing, tapi bel istirahat berbunyi terlalu cepat.",
    choices: [
      { id: "balas", label: "Besok, bawa jajan lebih untuk dibagi balik", outcomes: [
        { weight: 8, text: "Besoknya kamu sengaja membawa lebih. Begitulah kalian mulai. Bukan dengan janji, hanya giliran membagi yang tidak pernah kalian hitung. Bertahun-tahun dia jadi orang pertama yang kamu cari setiap ada kabar, baik atau buruk.", effects: { social: 6, happiness: 6 }, mood: "warm", flag: "punya_sahabat", addsRelationship: { id: "sahabat", name: "Sahabat", role: "friend", closeness: 80, alive: true }, memory: { text: "Setengah jajan yang didorong ke mejamu, hari kalian jadi teman.", tag: "sahabat", mood: "warm" } },
      ]},
      { id: "main", label: "Ajak main bareng sepulang sekolah", outcomes: [
        { weight: 8, text: "Sepulang sekolah kalian menghabiskan sore di tempat yang sekarang sudah kamu lupa namanya, tapi tidak rasanya. Dari hari itu kalian punya bahasa sendiri, lelucon yang cuma lucu buat kalian berdua.", effects: { social: 6, happiness: 5 }, mood: "warm", flag: "punya_sahabat", addsRelationship: { id: "sahabat", name: "Sahabat", role: "friend", closeness: 75, alive: true }, memory: { text: "Sore pertama main bersama sahabatmu. Tempatnya lupa, rasanya tidak.", tag: "sahabat", mood: "warm" } },
      ]},
      { id: "malu", label: "Malu-malu, cuma bilang terima kasih pelan", outcomes: [
        { weight: 8, text: "Kamu cuma berani bilang terima kasih pelan. Tapi dia tetap di sebelahmu keesokan harinya, dan esoknya lagi, sampai canggung itu pelan-pelan jadi diam yang nyaman. Persahabatan tidak selalu butuh dimulai dengan berani.", effects: { social: 4, happiness: 4, mental: 2 }, mood: "warm", flag: "punya_sahabat", addsRelationship: { id: "sahabat", name: "Sahabat", role: "friend", closeness: 70, alive: true }, memory: { text: "Terima kasih pelan yang jadi awal persahabatan paling panjang.", tag: "sahabat", mood: "warm" } },
      ]},
    ],
  }),

  e({
    id: "sahabat_rahasia", category: "pertemanan", pool: "relationship", rarity: "common",
    ageMin: 13, ageMax: 17, requireRelationship: "sahabat", forbidFlag: "sahabat_meninggal",
    deferrable: true, mood: "warm",
    title: "Rahasia yang Kalian Jaga Berdua",
    prompt: "Kalian sama-sama berbohong pada orang tua masing-masing demi satu sore yang sebenarnya tidak penting-penting amat. Duduk di tangga belakang, membicarakan masa depan seolah itu sudah pasti milik kalian.",
    choices: [
      { id: "janji", label: "Saling janji hal-hal besar yang belum tentu ditepati", outcomes: [
        { weight: 8, text: "Kalian berjanji akan tinggal di kota yang sama, tua bersama di teras yang sama. Janji-janji yang kelak sebagian tidak tertepati. Tapi sore itu, kalian sungguh-sungguh mempercayainya.", effects: { social: 5, happiness: 5, mental: 3 }, mood: "warm", memory: { text: "Janji-janji di tangga belakang yang kalian percayai sepenuh hati.", tag: "sahabat", mood: "warm" } },
        { weight: 8, text: "Dia menitipkan satu rahasia yang belum pernah dia ceritakan ke siapa pun, dan memilih kamu untuk mendengarnya pertama kali. Kamu tidak pernah membocorkannya, bahkan setelah bertahun-tahun, bahkan setelah tidak ada lagi alasan untuk menjaganya.", effects: { social: 5, mental: 4 }, mood: "melancholy", memory: { text: "Rahasia yang dia titipkan padamu pertama kali.", tag: "sahabat", mood: "melancholy" } },
      ]},
      { id: "diam", label: "Tidak bilang apa-apa, cukup duduk berdua", outcomes: [
        { weight: 8, text: "Kalian tidak banyak bicara sore itu. Tapi ada usia di mana ditemani saja sudah cukup, dan kamu beruntung punya seseorang yang mengerti itu tanpa harus dijelaskan.", effects: { social: 4, happiness: 4 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "cinta_pertama", category: "cinta", pool: "relationship", rarity: "common",
    ageMin: 14, ageMax: 18, deferrable: true, mood: "warm",
    title: "Cinta yang Tidak Tahu Namanya",
    prompt: "Ada seseorang di kelas yang membuat dadamu sakit dengan cara yang menyenangkan.",
    choices: [
      { id: "ungkap", label: "Tulis surat, selipkan di bukunya", outcomes: [
        { weight: 8, text: "Dia membalas dengan senyum kecil. Selama dua bulan, kamu merasa hidup punya soundtrack.", effects: { happiness: 10, social: 5 }, addTrait: "romantic", addsRelationship: { id: "cinta1", name: "Cinta Pertama", role: "lover", closeness: 70, alive: true }, memory: { text: "Surat pertama yang pernah kamu tulis untuk seseorang.", tag: "cinta_pertama", mood: "warm" } },
        { weight: 8, text: "Dia menunjukkan suratmu ke seluruh kelas. Kamu pulang lewat jalan belakang.", effects: { happiness: -8, mental: -10, social: -5 }, mood: "tragic", flag: "patah_hati_pertama", memory: { text: "Surat cintamu yang dibacakan keras-keras di depan kelas.", tag: "cinta_pertama", mood: "tragic" } },
      ]},
      { id: "diam", label: "Pendam saja", outcomes: [
        { weight: 8, text: "Kamu menulis namanya di pinggir buku. Belasan tahun kemudian, kamu menemukan buku itu.", memory: { text: "Nama yang ditulis di pinggir buku Matematika.", tag: "cinta_pertama", mood: "melancholy" }, mood: "melancholy", effects: { mental: -2 } },
        { weight: 8, text: "Kamu tidak pernah bilang. Dia pindah saat kenaikan kelas, dan kamu menyadari betapa banyak hal di usia itu yang berakhir tanpa pernah benar-benar dimulai.", effects: { mental: -2, happiness: -1 }, mood: "melancholy", memory: { text: "Seseorang yang pindah sebelum kamu sempat bilang apa-apa.", tag: "cinta_pertama", mood: "melancholy" } },
      ]},
      { id: "teman", label: "Coba jadi temannya dulu", outcomes: [
        { weight: 8, text: "Kalian jadi sahabat. Dia bercerita soal gebetannya. Itu bukan kamu.", effects: { social: 4, happiness: -3 } },
        { weight: 8, text: "Kalian jadi sahabat. Bertahun kemudian kamu sadar, kamu lebih beruntung daripada kalau dia membalas perasaanmu. Kamu mendapatkannya seumur hidup, bukan semusim.", effects: { social: 5, happiness: 2 } },
      ]},
      { id: "lupakan", label: "Fokus belajar saja", outcomes: [
        { weight: 8, text: "Nilaimu naik. Sesuatu yang lain turun, pelan-pelan.", effects: { intelligence: 6, happiness: -2 } },
        { weight: 8, text: "Kamu kubur dalam buku pelajaran. Berhasil, sebagian besar. Hanya sesekali saat dia lewat, satu halaman jadi sulit dibaca.", effects: { intelligence: 5, mental: -1 } },
      ]},
    ],
  }),

  e({
    id: "pura_pura_tidur", category: "keluarga", pool: "relationship", rarity: "uncommon",
    ageMin: 15, ageMax: 18, forbidFlag: "ayah_meninggal", title: "Pura-pura Tidur",
    prompt: "Kamu pulang lewat jam malam. Kamu mendengar langkah ayahmu di lorong.",
    choices: [
      { id: "pura", label: "Pura-pura tidur", outcomes: [
        { weight: 8, text: "Pintu dibuka pelan. Ayahmu menatap sebentar, lalu menutup pintu lebih pelan lagi.", effects: { mental: -2 }, memory: { text: "Malam kamu pura-pura tidur, dan ayah pura-pura percaya.", tag: "ayah", mood: "melancholy" }, mood: "melancholy" },
        { weight: 8, text: "Kamu menahan napas. Langkahnya berhenti lama di depan pintu. Terlalu lama, sebelum akhirnya menjauh. Kamu tidak pernah tahu apa yang dia pikirkan malam itu, dan kamu tidak pernah berani bertanya.", effects: { mental: -3 }, memory: { text: "Langkah ayah yang berhenti terlalu lama di depan pintu.", tag: "ayah", mood: "melancholy" }, mood: "melancholy" },
      ]},
      { id: "duduk", label: "Duduk, hadapi", outcomes: [
        { weight: 8, text: "Kalian bertengkar. Esoknya, sarapan canggung, tapi jujur.", effects: { social: 3, mental: 3 } },
        { weight: 8, text: "Ayahmu hanya berkata 'tidur lah' dan pergi. Sesuatu pecah pelan.", effects: { mental: -4 }, mood: "melancholy" },
      ]},
      { id: "kabur", label: "Kabur ke kamar mandi", outcomes: [
        { weight: 8, text: "Kamu duduk di lantai dingin sampai langkah itu hilang.", effects: { mental: -3 } },
        { weight: 8, text: "Di lantai kamar mandi, kamu mendengar dia menyeduh kopi di dapur. Terlalu pagi untuk kopi. Dia menunggumu, ternyata, dengan caranya yang tidak pernah berupa kata.", effects: { mental: -2, happiness: 1 }, mood: "melancholy" },
      ]},
      { id: "minta_maaf", label: "Buka pintu, minta maaf", outcomes: [
        { weight: 8, text: "Ayahmu memelukmu canggung. Aroma kopi paginya tertinggal di bajumu.", effects: { mental: 5, happiness: 4 }, memory: { text: "Pelukan canggung ayah jam 2 pagi.", tag: "ayah", mood: "warm" }, mood: "warm" },
        { weight: 8, text: "Kamu buka pintu lebih dulu darinya. Dia kaget, lalu mengangguk pelan, seolah lega tidak perlu mengetuk. Kalian tidak banyak bicara, tapi sesuatu yang tegang sejak lama mengendur malam itu.", effects: { mental: 5, social: 3 }, memory: { text: "Malam kamu yang membuka pintu lebih dulu.", tag: "ayah", mood: "warm" }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "kawan_seperjalanan", category: "pertemanan", pool: "relationship", rarity: "uncommon",
    ageMin: 20, ageMax: 45, mood: "warm",
    title: "Sebelah Kursi di Perjalanan Jauh",
    prompt: "Perjalanan panjang, kereta malam, bus antarkota. Orang di sebelahmu mengajakmu bicara, dan entah kenapa kalian menceritakan hal-hal yang tidak kalian ceritakan ke orang yang kalian kenal.",
    choices: [
      { id: "cerita", label: "Buka diri pada orang asing ini", outcomes: [
        { weight: 8, text: "Sampai tujuan, kalian berpisah tanpa bertukar nomor. Sengaja. Sebagian orang hadir hanya untuk satu perjalanan, dan justru itu yang membuatmu jujur. Wajahnya kamu lupa, tapi rasa ringan yang dia tinggalkan tidak.", effects: { social: 3, mental: 5 }, mood: "warm",
          addsRelationship: { id: "kawan_jalan", name: "Kawan Seperjalanan", role: "friend", closeness: 25, alive: false },
          memory: { text: "Orang asing di perjalanan jauh yang kamu ceritakan segalanya.", tag: "traveling", mood: "warm" } },
        { weight: 8, text: "Kalian bertukar nomor, tapi keduanya tahu tidak akan pernah dipakai. Beberapa pertemuan ditakdirkan utuh justru karena tidak dilanjutkan. Nomornya masih tersimpan, tidak pernah kamu hapus, tidak pernah kamu hubungi.", effects: { social: 2, mental: 4 }, mood: "melancholy",
          addsRelationship: { id: "kawan_jalan", name: "Kawan Seperjalanan", role: "friend", closeness: 25, alive: false },
          memory: { text: "Nomor dari perjalanan jauh yang tak pernah kamu hubungi.", tag: "traveling", mood: "melancholy" } },
      ]},
      { id: "diam", label: "Pasang earphone, pura-pura tidur", outcomes: [
        { weight: 8, text: "Kamu tiba dengan tenang dan utuh, tidak berutang cerita pada siapa pun. Hanya sesekali, bertahun kemudian, kamu penasaran apa yang akan dia katakan kalau kamu menjawab.", effects: { mental: 1 } },
        { weight: 8, text: "Kamu pasang earphone tanpa memutar apa pun, mendengarkan dia bercerita ke kursi kosong sebelahnya sampai dia menyerah. Kadang kamu memikirkannya. Orang yang butuh didengar, dan kamu yang memilih pura-pura tidur.", effects: { mental: -1 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "cinta_dewasa", category: "cinta", pool: "relationship", rarity: "common", weight: 8,
    ageMin: 21, ageMax: 28, mood: "warm",
    title: "Bukan Seperti yang Kamu Bayangkan",
    prompt: "Dia bukan yang kamu rencanakan. Tapi cara dia mendengarkan saat kamu bicara, tidak terburu-buru, tidak mengambil alih, membuatmu bicara lebih banyak dari biasanya.",
    choices: [
      { id: "kejar", label: "Ajak. Makan, atau apa pun yang bisa jadi alasan.", outcomes: [
        { weight: 8, text: "Kalian mulai, perlahan. Bukan pasangan dalam seminggu, tapi sesuatu yang lebih nyata dari label.", effects: { happiness: 8, social: 4, mental: 4 }, addsRelationship: { id: "kekasih", name: "Kekasih", role: "lover", closeness: 65, alive: true }, flag: "ada_romansa", mood: "warm", memory: { text: "Cara dia mendengarkanmu, saat kamu sadar ada sesuatu.", tag: "cinta_dewasa", mood: "warm" } },
        { weight: 8, text: "Kamu mencoba. Dia tidak tertarik. Kamu canggung dua minggu, lalu lupa.", effects: { happiness: -3, mental: -2 } },
      ]},
      { id: "biarkan", label: "Biarkan tumbuh sendiri. Tidak perlu terburu-buru.", outcomes: [
        { weight: 8, text: "Lambat. Tapi ketika namanya muncul di layar, kamu sadar sudah lama menunggunya.", effects: { mental: 4, happiness: 4 }, addsRelationship: { id: "kekasih", name: "Kekasih", role: "lover", closeness: 55, alive: true }, flag: "ada_romansa", mood: "warm" },
        { weight: 8, text: "Kamu menunggu terlalu lama. Dia duluan yang pergi.", effects: { happiness: -4, mental: -3 }, mood: "melancholy" },
      ]},
      { id: "lupakan", label: "Terlalu sibuk. Sekarang bukan waktunya.", outcomes: [
        { weight: 8, text: "Kamu benar. Atau tidak. Sulit dibedakan dari sini.", effects: { mental: 1 } },
        { weight: 8, text: "Kamu pilih kerja dan target, hal yang bisa kamu kendalikan. Bertahun kemudian kamu melihatnya menggendong anak orang lain di pernikahan teman. Tiga detik bertanya soal hidup yang tidak kamu pilih.", effects: { mental: -2, wealth: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "sahabat_menjaga", category: "pertemanan", pool: "relationship", rarity: "uncommon",
    ageMin: 21, ageMax: 34, requireRelationship: "sahabat", forbidFlag: "sahabat_meninggal",
    mood: "melancholy",
    title: "Yang Datang Tanpa Diminta",
    prompt: "Malam terburukmu tahun itu, kamu tidak menelepon siapa-siapa. Tapi dia tetap datang, mengetuk pintu, membawa makanan yang tidak kamu pesan, lalu duduk tanpa banyak bertanya sampai pagi.",
    choices: [
      { id: "cerita", label: "Akhirnya cerita, sampai habis", outcomes: [
        { weight: 8, text: "Kamu cerita sampai habis, dan dia hanya mendengar. Tidak menasihati, tidak memperbaiki, hanya hadir. Sebelum pulang dia bilang, 'kalau aku yang kena, kamu juga bakal datang, kan?' Kamu mengiyakan tanpa berpikir dua kali. Kamu belum tahu kalimat itu akan menagihmu suatu hari.", effects: { social: 6, happiness: 5, mental: 6 }, mood: "warm", memory: { text: "Malam dia datang tanpa diminta, dan kamu berjanji akan membalas.", tag: "sahabat", mood: "warm" } },
        { weight: 8, text: "Kamu tidak banyak cerita, tapi kamu tidak mengusirnya juga. Dia mengerti kode itu. Menginap di sebelah kasurmu, dan paginya pergi seolah tidak ada yang perlu dibahas. Sebagian pertemanan diukur bukan dari kata-kata, tapi dari siapa yang tetap tinggal saat kamu paling tidak enak ditemani.", effects: { social: 5, mental: 5 }, mood: "melancholy", memory: { text: "Dia yang tetap tinggal di malam kamu paling tidak enak ditemani.", tag: "sahabat", mood: "melancholy" } },
      ]},
      { id: "syukur", label: "Tidak bisa bilang apa-apa selain terima kasih", outcomes: [
        { weight: 8, text: "Kamu cuma bisa bilang terima kasih, dan dia menanggapinya dengan 'ya udah, gausah lebay.' Khas dia. Tapi kamu mengingat malam itu jauh lebih lama daripada dia, dan menyimpannya untuk dibalas suatu hari. Utang yang kamu niatkan, lalu lupa, lalu terlambat.", effects: { social: 5, happiness: 4, mental: 3 }, mood: "melancholy", memory: { text: "Utang kebaikan pada sahabat yang kamu niatkan membalas suatu hari.", tag: "sahabat", mood: "melancholy" } },
      ]},
    ],
  }),

  e({
    id: "hubungan_retak", category: "cinta", pool: "relationship", rarity: "uncommon",
    ageMin: 23, ageMax: 32, requireFlag: "ada_romansa", forbidFlag: "menikah", mood: "melancholy",
    title: "Percakapan yang Tidak Bisa Ditarik Kembali",
    prompt: "Ada kalimat yang sudah lama ingin diucapkan salah satu dari kalian. Malam ini ia akhirnya keluar.",
    choices: [
      { id: "selesai", label: "Berpisah, dengan baik, sebisa mungkin.", outcomes: [
        { weight: 8, text: "Tidak ada yang marah. Hanya dua orang yang tumbuh ke arah berbeda. Itu juga bisa menjadi bentuk kasih sayang.", effects: { mental: -5, happiness: -6, social: -2 }, killsRelationship: "kekasih", flag: "pernah_putus", mood: "melancholy", memory: { text: "Perpisahan yang tidak ada yang benar-benar menginginkannya.", tag: "cinta_dewasa", mood: "melancholy" } },
        { weight: 8, text: "Prosesnya panjang. Tapi kamu akhirnya bisa tidur lagi.", effects: { mental: -3, happiness: -5 }, killsRelationship: "kekasih", flag: "pernah_putus", mood: "melancholy" },
      ]},
      { id: "coba_lagi", label: "Coba lagi. Satu kali lagi.", outcomes: [
        { weight: 8, text: "Kalian mencoba. Beberapa bulan lebih baik, beberapa bulan lebih sulit. Tapi kamu mencoba, dan itu juga sesuatu.", effects: { mental: -2, happiness: 2 }, mood: "melancholy" },
        { weight: 8, text: "Kamu mencoba dua tahun lagi sebelum akhirnya selesai. Tidak menyesal sudah mencoba.", effects: { mental: -6, happiness: -3 }, killsRelationship: "kekasih", flag: "pernah_putus" },
      ]},
      { id: "jeda", label: "Minta waktu. Jeda, bukan akhir.", outcomes: [
        { weight: 8, text: "Jedanya panjang. Kalian bicara lagi tiga bulan kemudian, lebih jujur dari sebelumnya.", effects: { mental: 2, happiness: -2 } },
        { weight: 8, text: "Jedanya jadi perpisahan yang tidak pernah diumumkan. Kalian tidak pernah resmi 'selesai', hanya pelan-pelan berhenti membalas. Cara paling sunyi sebuah hubungan bisa berakhir.", effects: { mental: -4, happiness: -3 }, killsRelationship: "kekasih", flag: "pernah_putus", mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "cinta_setelah_putus", category: "cinta", pool: "relationship", rarity: "uncommon",
    ageMin: 28, ageMax: 40, requireFlag: "pernah_putus", forbidFlag: "menikah",
    deferrable: true, mood: "warm",
    title: "Setelah Sekian Lama Sendiri",
    prompt: "Kamu pikir kamu sudah selesai dengan urusan begini. Lalu seseorang datang, tidak buru-buru, tidak menjanjikan apa-apa, hanya hadir dengan tenang di sela hari-harimu yang sudah kamu kira utuh sendirian.",
    choices: [
      { id: "buka", label: "Beri kesempatan. Sekali lagi.", outcomes: [
        { weight: 8, text: "Pelan-pelan kamu sadar kamu masih bisa. Bukan untuk menambal yang dulu, tapi untuk sesuatu yang berdiri sendiri. Kali ini kamu mencintai dengan luka yang sudah kamu kenali, dan itu membuatmu lebih hati-hati, juga lebih jujur.", effects: { happiness: 8, social: 4, mental: 5 }, addsRelationship: { id: "kekasih", name: "Kekasih", role: "lover", closeness: 60, alive: true }, flag: "ada_romansa", mood: "warm", memory: { text: "Cinta yang datang setelah kamu kira sudah selesai dengan urusan begini.", tag: "cinta_dewasa", mood: "warm" } },
        { weight: 8, text: "Kamu mencoba, tapi separuh hatimu masih membandingkan diam-diam. Dia merasakannya. Tidak semua kesempatan kedua tumbuh, sebagian hanya mengajarkan apa yang belum selesai di dalam dirimu.", effects: { mental: -3, happiness: -2 }, mood: "melancholy" },
      ]},
      { id: "tahan", label: "Belum. Kamu belum siap.", outcomes: [
        { weight: 8, text: "Kamu memilih sendiri sebentar lagi, dan tidak ada yang salah dengan itu. Ada masa di mana menyembuhkan diri lebih mendesak daripada ditemani.", effects: { mental: 4 } },
        { weight: 8, text: "Kamu menahan diri, lalu menyesal pelan-pelan saat dia berhenti datang. Beberapa pintu hanya terbuka sekali, dan kamu memilih menutupnya demi rasa aman yang ternyata juga sepi.", effects: { mental: -2, happiness: -2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "rekan_sebelah_meja", category: "pekerjaan", pool: "relationship", rarity: "common",
    ageMin: 24, ageMax: 34, deferrable: true,
    title: "Orang di Meja Sebelah",
    prompt: (ctx) => {
      const { rekan, diTempat } = kerjaCtx(ctx.state);
      return `Ada ${rekan} di meja sebelah yang menyelamatkan hari-hari biasamu ${diTempat}, dengan kopi, gosip pelan, dan diam yang nyaman saat semua sedang terasa berat.`;
    },
    choices: [
      { id: "dekat", label: "Biarkan jadi sekutu harianmu", outcomes: [
        { weight: 8, text: "Selama beberapa tahun, dia tahu lebih banyak soal harimu daripada keluargamu. Lalu salah satu dari kalian pindah kerja, dan kontak itu menipis jadi ucapan ulang tahun otomatis, lalu tidak sama sekali.", effects: { social: 5, happiness: 4 }, mood: "warm",
          addsRelationship: { id: "rekan_meja", name: "Rekan Sebelah Meja", role: "friend", closeness: 55, alive: false } },
        { weight: 8, text: "Kalian janji akan tetap kontak setelah salah satu resign. Janji itu bertahan tiga bulan. Tapi untuk tiga tahun sebelumnya, meja sebelah itu adalah alasan kecil kenapa kamu tidak benci pekerjaanmu.", effects: { social: 4, happiness: 3 }, mood: "melancholy",
          addsRelationship: { id: "rekan_meja", name: "Rekan Sebelah Meja", role: "friend", closeness: 50, alive: false } },
      ]},
      { id: "jaga_jarak", label: "Ramah secukupnya, jaga jarak", outcomes: [
        { weight: 8, text: "Kalian sopan, tidak lebih. Bertahun kemudian kamu sadar kamu melewatkan satu pertemanan yang sebenarnya ada dalam jangkauan tangan.", effects: { mental: -1, discipline: 1 },
          addsRelationship: { id: "rekan_meja", name: "Rekan Sebelah Meja", role: "friend", closeness: 20, alive: false } },
        { weight: 8, text: "Suatu hari dia pindah, dan kursi itu diisi orang lain. Kamu baru sadar kamu tidak pernah tahu nama anaknya, atau apakah dia punya anak. Kedekatan yang kamu tolak itu sekarang cuma kursi kosong yang sopan.", effects: { mental: -1, discipline: 1 }, mood: "melancholy",
          addsRelationship: { id: "rekan_meja", name: "Rekan Sebelah Meja", role: "friend", closeness: 20, alive: false } },
      ]},
    ],
  }),

  e({
    id: "sahabat_jauh", category: "pertemanan", pool: "relationship", rarity: "uncommon",
    ageMin: 25, ageMax: 60, deferrable: true,
    title: "Jarang Balas",
    prompt: "Sahabat lamamu mulai jarang membalas. Bukan karena marah. Hanya karena hidup.",
    choices: [
      { id: "telp", label: "Hubungi, tanpa alasan khusus", outcomes: [
        { weight: 8, text: "Dia mengangkat tepat sebelum kamu hendak menutup. Kalian tertawa selama satu jam. Tidak ada yang berubah, tapi semuanya membaik.", effects: { social: 6, happiness: 6, mental: 4 }, mood: "warm" },
        { weight: 8, text: "Voicemail. Kamu tidak meninggalkan pesan.", effects: { mental: -2 }, mood: "melancholy" },
      ]},
      { id: "pasrah", label: "Biarkan", outcomes: [
        { weight: 8, text: "Pertemanan adalah kapal yang kadang berlabuh, kadang lewat begitu saja.", effects: { mental: 1 } },
        { weight: 8, text: "Kamu biarkan, dan pelan-pelan dia jadi nama yang muncul cuma saat aplikasi mengingatkan ulang tahunnya. Kamu mengetik 'met ultah!' tiap tahun, dan tiap tahun terasa seperti basa-basi.", effects: { mental: -1 }, mood: "melancholy" },
      ]},
      { id: "kecewa", label: "Posting story sindiran", outcomes: [
        { weight: 8, text: "Dia melihatnya. Tidak membalas. Hubungan itu mati dengan suara stiker emoji.", effects: { social: -4, mental: -3 } },
        { weight: 8, text: "Kamu hapus story itu setelah satu jam, malu sendiri. Tapi dia sudah melihatnya. Kalian tidak pernah membahasnya, hanya saling tahu, dan saling diam, sampai diam itu jadi permanen.", effects: { social: -3, mental: -2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "menikah_atau_tidak", category: "cinta", pool: "relationship", rarity: "common", weight: 8,
    ageMin: 26, ageMax: 35, title: "Pertanyaan dari Tante",
    prompt: "Kumpul keluarga. Tante bertanya untuk ke-tujuh-belas kalinya: 'Kapan nikah?'",
    choices: (ctx) => {
      const adaRomansa = !!ctx.state.flags.ada_romansa;
      // Apakah ada kekasih yang masih hadir (kekasih, kekasih2, ...) — dialah yang
      // akan naik status jadi Pasangan. Kalau tidak ada, pemain menikahi orang
      // yang baru dikenal.
      const pasanganMasihAda = ctx.state.relationships.some(
        (r) => r.role === "lover" && r.alive && /^kekasih\d*$/.test(r.id),
      );
      const opsiNikah: Choice[] = adaRomansa
        ? [{
            id: "menikah",
            label: pasanganMasihAda
              ? "Akhir tahun ini, dengan dia yang sudah lama bersamamu"
              : "Akhir tahun ini, dengan seseorang yang baru kamu kenal tapi rasanya sudah lama",
            outcomes: [
              { weight: 8, text: "Pernikahan sederhana. Kamu menangis di pelaminan bukan karena terharu, tapi karena bingung.", effects: { happiness: 5, social: 5, wealth: -10 }, addsRelationship: { id: "pasangan", name: "Pasangan", role: "lover", closeness: 70, alive: true }, flag: "menikah" },
              { weight: 8, text: "Pernikahan indah. Kamu menangis bahagia. Sesuatu di hidupmu akhirnya pas.", effects: { happiness: 12, mental: 6 }, addsRelationship: { id: "pasangan", name: "Pasangan", role: "lover", closeness: 90, alive: true }, flag: "menikah", mood: "warm" },
              { weight: 8, text: "Pernikahan yang diburu kalender dan pertanyaan tante-tante. Di tengah resepsi kamu menatap orang di sebelahmu dan berpikir 'semoga kita belajar mencintai sebaik kita berpura-pura.'", effects: { happiness: 2, social: 4, wealth: -10, mental: -3 }, addsRelationship: { id: "pasangan", name: "Pasangan", role: "lover", closeness: 55, alive: true }, flag: "menikah", mood: "melancholy" },
            ],
          }]
        : [];
      return [
        ...opsiNikah,
        { id: "sendiri", label: "'Aku belum siap, tante.'", outcomes: [
          { weight: 8, text: "Tante mendesah seolah kamu mengecewakan negara.", effects: { social: -2, mental: 3 } },
          { weight: 8, text: "'Belum siap, tante.' Kamu bilang dengan senyum, dan untuk pertama kalinya kamu percaya pada kalimatmu sendiri. Tidak semua orang harus berlari di garis waktu yang sama.", effects: { mental: 4, happiness: 2 } },
        ]},
        { id: "kabur", label: "Pergi ke kamar mandi, scroll TikTok 40 menit", outcomes: [
          { weight: 8, text: "Strategi hidup yang valid.", effects: { happiness: 1 } },
          { weight: 8, text: "Empat puluh menit jadi satu jam. Saat keluar, topiknya sudah pindah ke anak tetangga yang baru lulus. Kamu selamat, lagi.", effects: { happiness: 1 } },
        ]},
        { id: "jujur", label: "'Mungkin aku tidak mau menikah, tante.'", outcomes: [
          { weight: 8, text: "Hening. Lalu topik berubah ke harga cabai. Kamu menang.", effects: { mental: 5 }, addTrait: "nihilistic" },
          { weight: 8, text: "'Mungkin aku tidak mau, tante.' Kali ini tidak ada yang mengganti topik. Seorang om tua di pojok mengangguk diam-diam, seperti mengenali sesuatu. Kamu pulang merasa lebih ringan, juga sedikit kesepian.", effects: { mental: 4, happiness: -1 }, addTrait: "nihilistic", mood: "melancholy" },
        ]},
      ];
    },
  }),

  e({
    id: "punya_anak", category: "keluarga", pool: "relationship", rarity: "common",
    ageMin: 27, ageMax: 42, requireFlag: "menikah", mood: "warm",
    title: "Dua Garis",
    prompt: "Tes itu tergeletak di antara kalian berdua. Dua garis. Dunia kalian menyusut dan membesar bersamaan.",
    choices: [
      { id: "bahagia", label: "Menangis, memeluk", outcomes: [
        { weight: 8, text: "Kalian duduk di lantai kamar mandi, tertawa terlalu keras untuk jam segini. Rasa takutnya datang belakangan, pelan, setelah tawanya reda.", effects: { happiness: 10, mental: 4 }, addsRelationship: { id: "anak1", name: "Anak", role: "child", closeness: 90, alive: true }, flag: "punya_anak", setAgeFlag: "child_birth_age", memory: { text: "Lantai kamar mandi tempat kamu pertama kali tahu akan jadi orangtua.", tag: "anak", mood: "warm" } },
        { weight: 8, text: "Kalian tidak menangis. Hanya saling pandang lama sekali, lalu tertawa pelan. Rasa takut datang malam itu, saat kamu terjaga menatap pasanganmu yang tidur, berjanji hal-hal yang belum tahu caranya kamu tepati.", effects: { happiness: 9, mental: 3 }, addsRelationship: { id: "anak1", name: "Anak", role: "child", closeness: 88, alive: true }, flag: "punya_anak", setAgeFlag: "child_birth_age", mood: "warm", memory: { text: "Janji-janji yang kamu ucapkan sebelum tahu caranya menepati.", tag: "anak", mood: "warm" } },
      ]},
      { id: "panik", label: "Panik secara internal", outcomes: [
        { weight: 8, text: "Kamu tersenyum di luar. Di dalam, kamu menghitung tabungan.", effects: { mental: -4 }, addsRelationship: { id: "anak1", name: "Anak", role: "child", closeness: 70, alive: true }, flag: "punya_anak", setAgeFlag: "child_birth_age" },
        { weight: 8, text: "Senyummu meyakinkan, suaramu tidak. Pasanganmu menangkap getar itu dan menggenggam tanganmu. 'Kita cari tahu sambil jalan,' katanya. Kamu tidak percaya sepenuhnya, tapi cukup untuk mengangguk.", effects: { mental: -3, social: 2 }, addsRelationship: { id: "anak1", name: "Anak", role: "child", closeness: 72, alive: true }, flag: "punya_anak", setAgeFlag: "child_birth_age" },
      ]},
    ],
  }),

  e({
    id: "kehilangan_anak_bayi", category: "kehilangan", pool: "trauma", rarity: "veryRare",
    ageMin: 27, ageMax: 60, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 0, requireChildAgeMax: 2,
    lifetimeChance: 0.05, mood: "tragic",
    title: "Kamar yang Sudah Terlanjur Disiapkan",
    prompt: "Boksnya masih di sudut kamar. Baju-baju kecil masih terlipat menunggu ukuran yang tidak akan dia capai. Tidak ada yang lebih sunyi dari rumah yang sudah terlanjur disiapkan untuk sebuah tangis yang berhenti terlalu cepat.",
    choices: [
      { id: "simpan", label: "Simpan satu baju kecilnya", outcomes: [
        { weight: 8, text: "Kamu menyimpan satu baju yang masih menyimpan baunya, di laci yang jarang kamu buka tapi tidak pernah bisa kamu kosongkan. Orang bilang waktu menyembuhkan. Yang tidak mereka bilang, waktu hanya mengajari kamu menggendong luka itu dengan lebih tenang.", effects: { mental: -14, happiness: -12 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Baju kecil di laci yang tidak pernah bisa kamu kosongkan.", tag: "kehilangan", mood: "tragic" } },
      ]},
      { id: "diam", label: "Tidak tahu harus berbuat apa", outcomes: [
        { weight: 8, text: "Tidak ada panduan untuk ini. Kamu dan pasanganmu melewatinya dengan cara yang berbeda, kadang berjauhan justru saat paling butuh berdekatan. Sebagian dari kalian belajar berjalan lagi, sebagian lain memutuskan diam di tanggal itu selamanya.", effects: { mental: -15, happiness: -12, social: -3 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Tanggal yang sebagian dirimu memutuskan untuk diam di sana selamanya.", tag: "kehilangan", mood: "tragic" } },
      ]},
    ],
  }),

  e({
    id: "anak_malam_pertama", category: "keluarga", pool: "relationship", rarity: "common",
    ageMin: 28, ageMax: 42, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 0, requireChildAgeMax: 1,
    mood: "warm",
    title: "Jam 3 Pagi, Versi Baru",
    prompt: "Tangis bayi. Jam 3 pagi. Kamu sudah tidak ingat kapan terakhir tidur lebih dari dua jam. Di kursi goyang di sudut kamar, kamu menggendong sesuatu yang beratnya tidak ada, tapi terasa seperti seluruh dunia.",
    choices: [
      { id: "gendong", label: "Gendong, tenangkan sendiri", outcomes: [
        { weight: 8, text: "Bayi itu berhenti menangis di lenganmu. Lelahnya menindih sampai ke tulang. Tapi ada sesuatu di bawahnya, yang membuatmu tak ingin meletakkannya walau lengan sudah mati rasa.", effects: { mental: -2, happiness: 5 }, mood: "warm", memory: { text: "Berat kecil bayi di lenganmu, jam 3 pagi.", tag: "anak", mood: "warm" } },
        { weight: 8, text: "Berapa pun kamu gendong, tangisnya tidak reda. Kamu ikut hampir menangis. Lalu tiba-tiba ia tidur, dan kamu berdiri kaku setengah jam, takut bergerak membangunkannya.", effects: { mental: -4, health: -2, happiness: 3 }, mood: "melancholy" },
      ]},
      { id: "bergantian", label: "Bergantian dengan pasangan", outcomes: [
        { weight: 8, text: "Kalian tidak banyak bicara. Tapi cara pasanganmu menatapmu saat giliran berganti, ada sesuatu yang tidak perlu diucapkan.", effects: { social: 3, mental: 1, happiness: 3 } },
      ]},
      { id: "hampir_tidak_sanggup", label: "Duduk di lantai, hampir menangis sendiri", outcomes: [
        { weight: 8, text: "Ini fase, semua orang bilang. Kamu percaya mereka. Tapi malam ini, di lantai itu, kamu juga menangis sebentar, diam-diam, supaya tidak membangunkan bayi yang akhirnya tidur.", effects: { mental: -3, health: -2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "anak_kata_pertama_kita", category: "keluarga", pool: "relationship", rarity: "common",
    ageMin: 29, ageMax: 44, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 1, requireChildAgeMax: 2,
    mood: "warm",
    title: "Kata Pertamanya",
    prompt: "Mulut kecil itu membentuk sesuatu. Tidak jelas, tidak sempurna, tapi cukup. Kamu tahu itu panggilanmu, dalam bahasanya yang sedang diciptakan.",
    choices: [
      { id: "panggil_lagi", label: "Panggil lagi, tunggu diulang", outcomes: [
        { weight: 8, text: "Dia mengulanginya lebih keras, puas seperti baru menyelesaikan sesuatu yang besar. Kamu terbahak, lalu tanpa peringatan, matamu panas. Dia menatapmu bingung, dan itu membuatmu tertawa lagi.", effects: { happiness: 10, mental: 6 }, mood: "warm", memory: { text: "Kata pertamanya, panggilanmu, dalam mulut kecil itu.", tag: "anak", mood: "warm" } },
      ]},
      { id: "rekam", label: "Rekam dulu, baru rayakan", outcomes: [
        { weight: 8, text: "Video itu menjadi file yang paling sering kamu buka di HP-mu, bertahun-tahun kemudian, tanpa alasan khusus.", effects: { happiness: 8, mental: 5 }, memory: { text: "Video kata pertamanya, sudah pudar warnanya tapi masih diputar.", tag: "anak", mood: "warm" } },
      ]},
    ],
  }),

  e({
    id: "kehilangan_anak_balita", category: "kehilangan", pool: "trauma", rarity: "veryRare",
    ageMin: 30, ageMax: 65, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 3, requireChildAgeMax: 5,
    lifetimeChance: 0.05, mood: "tragic",
    title: "Sepeda Roda Tiga yang Berhenti Berbunyi",
    prompt: "Dia baru saja sampai di usia paling penuh tanya. Kenapa langit biru, kenapa kucing tidak bisa bicara, kenapa kamu harus kerja. Sandal kecilnya masih di rak, sepeda roda tiganya masih di teras. Rumah yang biasa penuh suara kaki kecil berlari mendadak hafal pada sunyi yang salah.",
    choices: [
      { id: "mainan", label: "Simpan satu mainan kesayangannya", outcomes: [
        { weight: 8, text: "Kamu menyimpan boneka yang ke mana-mana dia bawa, yang sudah kusam dan satu matanya copot. Bertahun-tahun ia duduk di lemari, dan kamu tidak pernah bisa memutuskan apakah memeluknya membantu atau justru membuka lagi yang belum sembuh.", effects: { mental: -15, happiness: -13 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Boneka kusam bermata satu yang ke mana-mana dia bawa.", tag: "kehilangan", mood: "tragic" } },
      ]},
      { id: "tanya", label: "Terhantui pertanyaan-pertanyaan kecilnya", outcomes: [
        { weight: 8, text: "Yang paling sering kembali bukan tangisnya, tapi pertanyaan-pertanyaan kecil yang dulu kadang membuatmu lelah menjawab. Sekarang kamu rela menjawab sejuta lagi, kalau saja ada yang bertanya. Tidak ada lagi yang bertanya.", effects: { mental: -16, happiness: -13 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Sejuta pertanyaan kecil yang rela kamu jawab, kalau saja masih ada yang bertanya.", tag: "kehilangan", mood: "tragic" } },
      ]},
    ],
  }),

  e({
    id: "anak_celetuk", category: "keluarga", pool: "relationship", rarity: "common",
    ageMin: 31, ageMax: 46, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 3, requireChildAgeMax: 6,
    mood: "neutral",
    title: "Kejujuran yang Salah Waktu",
    prompt: "Di antrean kasir, anakmu menunjuk seseorang dan bertanya sesuatu yang sangat jujur dan sangat tidak pada tempatnya. Antrean hening sejenak.",
    choices: [
      { id: "seret", label: "Minta maaf cepat, buru-buru pergi", outcomes: [
        { weight: 8, text: "Kamu tersenyum minta maaf ke segala arah, mendorong troli secepat mungkin. Di parkiran kamu coba menjelaskan kenapa itu tidak sopan, tapi suaramu pecah jadi tawa di tengah kalimat. Pelajaran sopan santun yang gagal total.", effects: { happiness: 4, social: -1 } },
      ]},
      { id: "ajari", label: "Jongkok, jelaskan pelan kenapa itu bisa menyakiti", outcomes: [
        { weight: 8, text: "Dia menghampiri orang itu dan minta maaf dengan caranya sendiri yang berantakan. Orang itu malah tertawa terharu. Kamu pulang dengan dada yang hangat.", effects: { social: 4, mental: 3 }, mood: "warm" },
      ]},
      { id: "diam_kagum", label: "Tegur seperlunya, diam-diam mengagumi anakmu yang belum memiliki filter mulut", outcomes: [
        { weight: 8, text: "Kamu menegurnya, seperti seharusnya. Tapi sebagian kecil dirimu iri pada anak yang belum belajar menahan apa yang dilihatnya. Filter itu akan datang sendiri nanti.", effects: { happiness: 2, mental: 1 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "anak_sakit_demam", category: "keluarga", pool: "relationship", rarity: "uncommon",
    ageMin: 31, ageMax: 50, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 6, requireChildAgeMax: 10,
    mood: "melancholy",
    title: "Termometer",
    prompt: "38,9. Anakmu tidur gelisah dengan pipi merah. Kamu mengganti kompres untuk kesekian kalinya malam ini.",
    choices: [
      { id: "jaga", label: "Jaga semalaman", outcomes: [
        { weight: 8, text: "Pagi, demamnya turun. Matanya membuka, tersenyum seolah tidak terjadi apa-apa semalam. Kamu hanya lelah, dengan lega yang menyusul begitu telapakmu menyentuh dahinya yang sudah dingin.", effects: { mental: -2, happiness: 6, health: -2 }, mood: "warm" },
        { weight: 8, text: "Demamnya naik lagi menjelang subuh. Kamu nyaris membawanya ke IGD sebelum ia turun sendiri. Paginya dia baik-baik saja, kamu yang butuh tiga hari pulih dari ketakutan semalam.", effects: { mental: -5, health: -3, happiness: 3 }, mood: "melancholy" },
      ]},
      { id: "dokter", label: "Bawa ke dokter malam ini juga", outcomes: [
        { weight: 8, text: "Dokter bilang virus biasa. Kamu membayar sejumlah uang untuk ketenangan pikiran yang sebenarnya gratis.", effects: { wealth: -2, mental: 4, happiness: 3 } },
      ]},
      { id: "bergantian", label: "Bergantian jaga dengan pasangan", outcomes: [
        { weight: 8, text: "Kalian tidak banyak bicara sepanjang malam, tapi bergerak seperti satu tim yang sudah latihan bertahun-tahun tanpa disadari.", effects: { social: 4, happiness: 3 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "anak_pertanyaan_susah", category: "keluarga", pool: "relationship", rarity: "uncommon",
    ageMin: 32, ageMax: 48, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 5, requireChildAgeMax: 5,
    mood: "neutral",
    title: "Pertanyaan yang Tidak Ada Jawabannya",
    prompt: "'Kenapa orang harus mati, pa/ma?' Dia bertanya sambil memakan nasinya tanpa menoleh. Lima tahun, dan sudah mulai bertanya hal-hal yang belum kamu jawab untuk dirimu sendiri.",
    choices: [
      { id: "jujur", label: "Jawab jujur: 'papa/mama juga tidak tahu pasti'", outcomes: [
        { weight: 8, text: "Dia mengangguk seperti jawaban itu sudah cukup. Mungkin memang kejujuran itu yang dia minta.", effects: { social: 4, mental: 4, happiness: 3 }, mood: "warm" },
      ]},
      { id: "alihkan", label: "Alihkan dengan cerita alam dan bintang", outcomes: [
        { weight: 8, text: "Dia mendengarkan, tapi matanya bilang dia tahu kamu menghindari sesuatu. Lima tahun, tapi sudah bisa baca wajahmu.", effects: { happiness: 2 } },
      ]},
      { id: "peluk", label: "Peluk saja, bilang akan ceritakan nanti", outcomes: [
        { weight: 8, text: "Dia tidak protes. Kadang tubuh lebih jujur daripada kata-kata. Kalian duduk diam sebentar, dan itu sudah menjadi jawaban.", effects: { happiness: 4, mental: 3 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "kehilangan_anak_sekolah", category: "kehilangan", pool: "trauma", rarity: "veryRare",
    ageMin: 33, ageMax: 62, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 6, requireChildAgeMax: 12,
    lifetimeChance: 0.05, mood: "tragic",
    title: "Tas yang Tergantung di Pintu",
    prompt: "Tasnya masih tergantung di balik pintu, dengan tugas yang belum selesai di dalamnya. Sepatunya masih di rak, ukuran yang terakhir. Seluruh dunia kecilnya, gambar di kulkas, mainan setengah dibongkar, lagu yang dia hafal, berhenti di tengah. Dan kamu harus terus hidup di tengah-tengah benda yang tidak tahu pemiliknya sudah tidak ada.",
    choices: [
      { id: "jaga", label: "Biarkan kamarnya seperti apa adanya, untuk sekarang", outcomes: [
        { weight: 8, text: "Kamu tidak sanggup memindahkan apa pun. Selama berbulan-bulan kamar itu jadi ruang yang kamu lewati pelan-pelan, seperti takut membangunkan sesuatu. Lalu suatu hari kamu masuk, duduk di lantainya, dan untuk pertama kalinya menangis tanpa menahannya.", effects: { mental: -16, happiness: -13 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Lantai kamarnya, tempat kamu akhirnya menangis tanpa menahan.", tag: "kehilangan", mood: "tragic" } },
      ]},
      { id: "gambar", label: "Simpan gambar terakhirnya di kulkas", outcomes: [
        { weight: 8, text: "Gambar itu tetap di sana, di balik magnet yang sama, sampai kertasnya menguning. Kamu tidak pernah memindahkannya. Sebagian orang menyimpan abu, sebagian menyimpan foto, kamu menyimpan coretan krayon yang artinya hanya kamu yang mengerti.", effects: { mental: -15, happiness: -13 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Coretan krayon di kulkas yang artinya hanya kamu yang mengerti.", tag: "kehilangan", mood: "tragic" } },
      ]},
    ],
  }),

  e({
    id: "anak_hari_sekolah", category: "keluarga", pool: "relationship", rarity: "common",
    ageMin: 34, ageMax: 50, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 6, requireChildAgeMax: 6,
    mood: "warm",
    title: "Hari Pertama SD",
    prompt: "Hari pertama SD. Kamu sudah menyiapkan bekal, menulis namanya di setiap barang, mengulang tiga kali nama wali kelasnya supaya dia hafal. Dia sendiri? Sudah lupa kamu ada bahkan sebelum sampai gerbang.",
    choices: [
      { id: "khawatir", label: "Habiskan pagi mengkhawatirkan hal-hal kecil", outcomes: [
        { weight: 8, text: "Apakah ada yang mau jadi temannya? Kamu mengarang seratus skenario buruk, tidak satu pun terjadi. Sore harinya, yang dia ceritakan cuma seekor semut besar di lapangan.", effects: { mental: 1, happiness: 4 } },
      ]},
      { id: "lega", label: "Diam-diam bangga dia tidak terlalu butuh kamu", outcomes: [
        { weight: 8, text: "Dia melangkah masuk seperti sudah melakukannya seumur hidup. Ada campuran lega dan sedikit tersinggung yang membuatmu tersenyum sendiri, ternyata anakmu lebih siap daripada kamu.", effects: { happiness: 5, mental: 2 }, mood: "warm" },
      ]},
      { id: "foto", label: "Foto dia berlebihan sampai dia protes", outcomes: [
        { weight: 8, text: "'Cukup, ma/pa!' katanya, malu di depan teman-teman barunya. Kamu berhenti, tapi sudah terlanjur dapat dua belas foto yang nyaris sama. Salah satunya akan kamu simpan di dompet sampai lusuh.", effects: { happiness: 4, social: 2 }, memory: { text: "Dua belas foto nyaris sama di hari pertamanya sekolah.", tag: "anak", mood: "warm" } },
      ]},
    ],
  }),

  e({
    id: "anak_raport", category: "sekolah", pool: "relationship", rarity: "common",
    ageMin: 36, ageMax: 53, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 8, requireChildAgeMax: 12,
    title: "Raport",
    prompt: "Raport di meja. Rata-rata 74. Tidak bagus, tidak buruk. Wajahnya menunggu reaksimu.",
    choices: [
      { id: "dukung", label: "Bilang 'ini titik awal, bukan hasil akhir'", outcomes: [
        { weight: 8, text: "Ekspresinya mengendur. Kamu sadar butuh bertahun-tahun untuk bisa mengucapkan kalimat seperti itu, padahal hanya sepuluh detik.", effects: { social: 5, happiness: 5, mental: 4 }, mood: "warm" },
        { weight: 8, text: "Kalimat itu keluar lebih kaku dari yang kamu mau, tapi sampai. Dia membawa raportnya ke kamar dengan langkah yang sedikit lebih ringan. Kadang yang penting bukan kata-katanya, tapi bahwa kamu tidak marah.", effects: { social: 4, happiness: 4, mental: 3 }, mood: "warm" },
      ]},
      { id: "kecewa", label: "Tidak bisa menyembunyikan kekecewaan", outcomes: [
        { weight: 8, text: "Dia diam. Kamu juga diam. Malam itu kalian sama-sama tidak nyenyak.", effects: { social: -3, mental: -3, happiness: -2 }, mood: "melancholy" },
        { weight: 8, text: "Kamu menahan diri, tapi wajahmu lebih cepat dari niatmu. Dia melihatnya, dan sesuatu kecil di matanya meredup. Bertahun kemudian kamu masih ingat reaksi itu lebih jelas daripada angka di raportnya.", effects: { social: -3, mental: -4, happiness: -2 }, mood: "melancholy", memory: { text: "Wajah anakmu yang meredup karena reaksimu.", tag: "anak", mood: "melancholy" } },
      ]},
      { id: "les", label: "Langsung daftarkan les tambahan", outcomes: [
        { weight: 8, text: "Les-nya rajin di minggu pertama. Bulan kedua mulai berselisih jadwal. Kamu belajar bahwa niat orangtua dan stamina anak adalah dua hal berbeda.", effects: { wealth: -3, intelligence: 2 } },
        { weight: 8, text: "Raport berikutnya naik 8 poin. Kamu hampir tidak menyadari betapa lugunya kamu bangga.", effects: { wealth: -3, happiness: 5 } },
      ]},
    ],
  }),

  e({
    id: "anak_berbohong_pertama", category: "keluarga", pool: "relationship", rarity: "uncommon",
    ageMin: 37, ageMax: 52, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 9, requireChildAgeMax: 13,
    mood: "melancholy",
    title: "Wajah yang Tidak Bisa Menipu",
    prompt: "Kamu tahu anakmu berbohong. Caranya menatap ke arah lain. Caranya menjelaskan terlalu panjang. Kamu tahu, karena dulu kamu juga begitu.",
    choices: [
      { id: "tanya", label: "Tanya langsung, beri ruang untuk jujur", outcomes: [
        { weight: 8, text: "Awalnya bertahan. Tapi saat kamu bilang 'tidak apa-apa, cerita saja', sesuatu runtuh. Dia menangis lebih lama dari bobot kebohongannya.", effects: { social: 5, mental: 4, happiness: 4 }, mood: "warm" },
        { weight: 8, text: "Dia tetap tutup mulut. Kalian masing-masing menyimpan sesuatu malam itu.", effects: { social: -2, mental: -2 }, mood: "melancholy" },
      ]},
      { id: "berpura", label: "Pura-pura tidak tahu, amati lebih lama", outcomes: [
        { weight: 8, text: "Seminggu kemudian dia memberitahumu sendiri. Beberapa hal butuh waktu untuk siap diakui.", effects: { social: 2, mental: 3 } },
        { weight: 8, text: "Kamu diamkan, dia tidak pernah mengaku. Kebohongan kecil itu menguap, hanya menyisakan satu pengetahuan baru di antara kalian, bahwa dia bisa, dan kamu tahu dia bisa.", effects: { social: -1, mental: 1 }, mood: "melancholy" },
      ]},
      { id: "marah", label: "Konfrontasi langsung", outcomes: [
        { weight: 8, text: "Dia ngaku, tapi dengan takut bukan dengan lega. Kamu menang secara teknis, tapi merasa seperti yang kalah.", effects: { social: -3, mental: -4 }, mood: "melancholy" },
        { weight: 8, text: "Kamu meninggikan suara, dan dia mengaku sambil gemetar. Belakangan kamu sadar kamu mengajarinya satu hal yang tidak kamu maksudkan, bahwa jujur itu menakutkan. Butuh waktu untuk membongkar pelajaran itu kembali.", effects: { social: -3, mental: -3 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "anak_hp", category: "internet", pool: "relationship", rarity: "common",
    ageMin: 40, ageMax: 56, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 12, requireChildAgeMax: 15,
    title: "Jempol yang Tidak Berhenti",
    prompt: "Anakmu tidak lepas dari HP sejak pulang sekolah. Makan, nonton, sambil HP. Kamu hampir berkata sesuatu.",
    choices: (ctx) => [
      { id: "bicara", label: "Bicara, bukan marah, tentang yang kamu khawatirkan", outcomes: [
        { weight: 8, text: "Dia mendengarkan lebih dari yang kamu duga. 'Oke,' katanya. Tiga hari berikutnya sedikit lebih berkurang.", effects: { social: 5, mental: 4 } },
        { weight: 8, text: "Perdebatan. Tidak ada yang menang. Makan malam dalam diam.", effects: { social: -2, mental: -2 }, mood: "melancholy" },
      ]},
      { id: "ingat", label: "Ingat dirimu, bedanya hanya mediumnya", outcomes: [
        { weight: 8, text: `Kamu dulu punya ${ctx.state.age > 45 ? "komik dan TV sampai dimarahi" : "game dan internet yang sama merusaknya"}. Mereka tidak jauh berbeda. Kamu duduk bersamanya, tanya apa yang dia tonton, dan kamu mendengarkan jawaban yang lebih panjang dari dugaanmu.`, effects: { social: 6, happiness: 4 }, mood: "warm" },
        { weight: 8, text: "Kamu duduk di sampingnya tanpa berkata apa-apa soal HP, cuma bertanya 'lagi nonton apa?' Dia menoleh, kaget, lalu mulai menjelaskan dengan antusias yang sudah lama tidak kamu lihat. Layar itu ternyata pintu, bukan tembok, kalau kamu mau lewat.", effects: { social: 5, happiness: 4 }, mood: "warm" },
      ]},
      { id: "aturan", label: "Buat aturan screen time yang jelas", outcomes: [
        { weight: 8, text: "Aturannya dipatuhi dua minggu sebelum mulai licin batasannya. Tapi ada percakapan di prosesnya yang lebih berharga dari aturan itu sendiri.", effects: { social: 2, discipline: 3 } },
        { weight: 8, text: "Aturannya jadi medan perang kecil tiap malam. Suatu titik kamu lelah dan melonggarkannya, bukan karena kalah, tapi karena sadar yang kamu kejar bukan layar yang mati, tapi anak yang mau bicara.", effects: { social: 1, mental: -1, discipline: 1 } },
      ]},
    ],
  }),

  e({
    id: "anak_menjauh", category: "keluarga", pool: "relationship", rarity: "uncommon",
    ageMin: 40, ageMax: 58, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 13, requireChildAgeMax: 17,
    mood: "melancholy",
    title: "Pintu yang Selalu Tertutup",
    prompt: "Anakmu mulai menutup pintu kamarnya lebih lama dari biasanya. Kalimat berkurang. Mata berbeda.",
    choices: [
      { id: "ajak_bicara", label: "Ketuk, ajak bicara", outcomes: [
        { weight: 8, text: "Awalnya canggung. Tapi kalian bicara sampai jam dua. Sesuatu kembali tersambung.", effects: { social: 6, mental: 5, happiness: 5 } },
        { weight: 8, text: "Dia berkata 'aku capek, ma/pa.' Kamu mengangguk. Pintu tertutup lagi.", effects: { mental: -4 }, mood: "melancholy" },
      ]},
      { id: "beri_ruang", label: "Beri ruang", outcomes: [
        { weight: 8, text: "Bertahun kemudian, dia berterima kasih untuk itu. Atau tidak. Itu di luar kendalimu sekarang.", effects: { mental: 1 } },
        { weight: 8, text: "Kamu mundur, dan keheningan di rumah bertambah satu lapis. Suatu sore dia keluar kamar, duduk di sebelahmu tanpa kata, dan mulai cerita sedikit. Ruang yang kamu beri ternyata jembatan, bukan jurang, kali ini.", effects: { social: 4, mental: 3, happiness: 3 }, mood: "warm" },
      ]},
      { id: "marahi", label: "Marahi karena tidak sopan", outcomes: [
        { weight: 8, text: "Pintunya makin sering tertutup. Kalian tinggal serumah, tapi terpisah dinding tipis selama dekade.", effects: { social: -6, mental: -6 }, mood: "tragic", flag: "anak_jauh" },
        { weight: 8, text: "Kamu berteriak hal-hal yang tidak kamu maksudkan. Pintu dibanting. Yang kamu menangkan cuma keheningan yang lebih dingin, dan itu bertahan jauh setelah kemarahanmu sendiri reda.", effects: { social: -6, mental: -5 }, mood: "tragic", flag: "anak_jauh" },
      ]},
      { id: "sibuk", label: "Sibuk kerja saja, anggap fase remaja", outcomes: [
        { weight: 8, text: "Lima tahun kemudian kamu sadar kamu tidak tahu lagu favoritnya.", effects: { mental: -5, happiness: -4 }, flag: "anak_jauh", memory: { text: "Lagu favorit anakmu yang tidak pernah kamu tanya.", tag: "regret", mood: "tragic" } },
        { weight: 8, text: "Kamu tenggelam dalam pekerjaan, meyakinkan diri ini cuma fase. Saat kamu mengangkat kepala, dia sudah hampir dewasa, dan kalian bicara seperti dua kenalan yang sopan. Fase itu ternyata pintu yang menutup pelan.", effects: { mental: -5, happiness: -4 }, flag: "anak_jauh", memory: { text: "Tahun-tahun yang kamu kira cuma fase.", tag: "regret", mood: "tragic" } },
      ]},
    ],
  }),

  e({
    id: "kehilangan_anak_remaja", category: "kehilangan", pool: "trauma", rarity: "veryRare",
    ageMin: 40, ageMax: 75, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 13, requireChildAgeMax: 17,
    lifetimeChance: 0.05, mood: "tragic",
    title: "Kamar yang Pintunya Tidak Pernah Lagi Dibanting",
    prompt: "Dia baru saja jadi orang asing yang manis. Pintu kamar lebih sering tertutup, playlist yang kamu tidak mengerti, kalimat yang berkurang, sesekali percikan dewasa yang membuatmu diam-diam bangga. Kamu kira kalian masih punya bertahun-tahun untuk kembali dekat setelah fase ini lewat. Fase itu tidak pernah sempat lewat.",
    choices: [
      { id: "kamar", label: "Masuk ke kamarnya yang sekarang sunyi", outcomes: [
        { weight: 8, text: "Kamu masuk ke ruang yang dulu butuh izin untuk dimasuki. Poster yang tidak kamu kenali, buku setengah baca, bau parfum murah yang baru dia suka. Kamu duduk di kasurnya dan menyesali tiap kali kamu menganggap diamnya sebagai penolakan, padahal itu cuma anak yang sedang belajar jadi dirinya sendiri.", effects: { mental: -16, happiness: -13 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Kamarnya yang dulu butuh izin untuk dimasuki, kini sunyi tanpa syarat.", tag: "kehilangan", mood: "tragic" } },
      ]},
      { id: "playlist", label: "Putar playlist yang dulu tak kamu mengerti", outcomes: [
        { weight: 8, text: "Kamu memutar lagu-lagu yang dulu cuma terdengar samar dari balik pintu. Kali ini kamu mendengarkannya sampai habis, mencoba mengenal anakmu lewat hal-hal yang dia cintai dan tidak sempat kamu tanyakan. Terlambat untuk berkenalan, tapi kamu lakukan saja, itu satu-satunya cara yang tersisa untuk dekat.", effects: { mental: -16, happiness: -13 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Playlist anakmu yang akhirnya kamu dengarkan sampai habis, terlambat.", tag: "kehilangan", mood: "tragic" } },
      ]},
    ],
  }),

  e({
    id: "anak_pacaran", category: "cinta", pool: "relationship", rarity: "uncommon",
    ageMin: 43, ageMax: 58, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 15, requireChildAgeMax: 17,
    mood: "warm",
    title: "Nama yang Disebut Terlalu Sering",
    prompt: "Ada nama yang disebut terlalu sering. Cara anakmu bicara pun berubah. Kamu pernah di sana. Kamu tahu tanda-tandanya.",
    choices: [
      { id: "bicara", label: "Buka percakapan, tanya siapa dia", outcomes: [
        { weight: 8, text: "Anakmu kaku sebentar, lalu perlahan bercerita. Kamu mendengarkan tanpa interupsi. Sesuatu yang butuh usaha lebih dari yang kamu bayangkan. Itu salah satu percakapan terbaik yang pernah kalian punya.", effects: { social: 6, happiness: 5, mental: 4 }, mood: "warm" },
        { weight: 8, text: "Dia bercerita lebih sedikit dari yang kamu harap, tapi lebih dari yang dia rencanakan. Di akhir dia bilang 'jangan kasih tahu siapa-siapa ya.' Rahasia kecil yang kalian jaga berdua itu mengikat kalian dengan caranya sendiri.", effects: { social: 5, happiness: 4, mental: 3 }, mood: "warm" },
      ]},
      { id: "biarkan", label: "Biarkan. Dia akan cerita kalau mau.", outcomes: [
        { weight: 8, text: "Dua minggu kemudian dia cerita sendiri, dengan senyum kecil di ujung kalimat terakhirnya.", effects: { social: 3, happiness: 3 } },
        { weight: 8, text: "Dia tidak pernah benar-benar cerita. Kamu tahu dari hal-hal kecil. Senyum ke layar, lagu baru yang diputar berulang. Kamu menghormati diamnya, meski sebagian dirimu rindu jadi orang pertama yang dia ceritai.", effects: { social: 2, mental: 1 }, mood: "melancholy" },
      ]},
      { id: "khawatir", label: "Pasang batas, mulai protektif", outcomes: [
        { weight: 8, text: "Perdebatan. Anakmu merasa tidak dipercaya. Kamu merasa tidak didengar. Dua perspektif yang sama-sama valid, tidak ada yang mudah dikalahkan.", effects: { social: -4, mental: -3 }, mood: "melancholy" },
        { weight: 8, text: "Batas yang kamu pasang malah membuatnya lebih rapat menutup diri. Kamu sadar terlambat, melindungi dan mengurung kadang terlihat sama dari luar, tapi terasa sangat berbeda dari dalam.", effects: { social: -4, mental: -2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "kehilangan_anak_kuliah", category: "kehilangan", pool: "trauma", rarity: "veryRare",
    ageMin: 45, ageMax: 70, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 18, requireChildAgeMax: 23,
    lifetimeChance: 0.05, mood: "tragic",
    title: "Telepon di Jam yang Salah",
    prompt: "Telepon itu datang di jam yang tidak pernah membawa kabar baik. Anakmu, yang baru saja mulai hidupnya sendiri di kota lain, yang minggu lalu masih mengeluh soal tugas lewat chat, tidak akan pulang di libur berikutnya. Kamu masih sempat membayangkan dia dewasa, mandiri. Bayangan itu berhenti di tengah kalimat.",
    choices: [
      { id: "kota", label: "Berangkat ke kota tempat dia merantau", outcomes: [
        { weight: 8, text: "Kamu mengemasi kamar kos yang baru sempat dia tempati beberapa bulan. Tumpukan buku, mug, baju yang belum sempat dicuci. Kamu mencium baju itu sebelum melipatnya. Mengurus barang anak yang seharusnya hidup lebih lama darimu adalah pekerjaan yang tidak pernah disiapkan untuk siapa pun.", effects: { mental: -16, happiness: -13 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Kamar kos yang baru beberapa bulan ia tempati, yang harus kamu kemasi sendiri.", tag: "kehilangan", mood: "tragic" } },
      ]},
      { id: "chat", label: "Buka chat terakhir kalian", outcomes: [
        { weight: 8, text: "Pesan terakhirmu belum dibalas, dan tidak akan pernah. Kamu membaca ulang percakapan biasa yang dulu kamu pikir akan ada jutaan lagi sesudahnya. Bertahun kemudian kamu masih tidak tega menghapus kontaknya. Nomor mati yang kamu jaga seperti makam kecil di dalam ponsel.", effects: { mental: -16, happiness: -12 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Pesan terakhir yang tidak akan pernah dibalas.", tag: "kehilangan", mood: "tragic" } },
      ]},
    ],
  }),

  e({
    id: "anak_pergi_kuliah_momen", category: "keluarga", pool: "relationship", rarity: "common",
    ageMin: 46, ageMax: 61, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 18, requireChildAgeMax: 19,
    mood: "melancholy",
    title: "Koper di Depan Pintu",
    prompt: "Koper sudah siap sejak kemarin. Hari ini dia berangkat ke kota lain. Kamu berdiri di depan pintu, tidak tahu harus memulai dari mana.",
    choices: [
      { id: "peluk_lama", label: "Peluk lama. Titip banyak pesan.", outcomes: [
        { weight: 8, text: "Dia mendengarkan sambil memelukmu balik. Kamu tidak ingat semua yang kamu katakan. Tapi cara dia menggenggam bahumu sebelum pergi, itu kamu simpan.", effects: { mental: -3, happiness: 5 }, mood: "melancholy", memory: { text: "Genggaman terakhirnya sebelum koper itu dibawa pergi.", tag: "anak", mood: "melancholy" } },
        { weight: 8, text: "Pesanmu tumpang tindih, setengahnya kamu lupa begitu diucapkan. Dia menunggu sampai selesai, lalu berkata 'aku tahu, ma/pa', yang artinya 'sudah, lepaskan.' Kamu lepaskan juga, dengan susah payah.", effects: { mental: -2, happiness: 4 }, mood: "melancholy" },
      ]},
      { id: "singkat", label: "'Jaga diri.'", outcomes: [
        { weight: 8, text: "Dia tersenyum, tidak mendramatisir. Kamu merasa telah mengajarkan sesuatu yang benar, meski kamu yang menangis diam-diam di ruang tamu setelah dia tidak terlihat.", effects: { mental: 3, happiness: 3 }, mood: "warm" },
        { weight: 8, text: "Kalimat itu keluar tenang, persis seperti yang kamu latih. Baru setelah lampu dia hilang di tikungan, tenang itu runtuh. Di dapur, di depan dua gelas kopi yang tidak sempat diminum.", effects: { mental: -2, happiness: 3 }, mood: "melancholy", memory: { text: "Dua gelas kopi yang tidak sempat diminum saat dia pergi.", tag: "anak", mood: "melancholy" } },
      ]},
      { id: "iringi", label: "Antar sampai ke kosnya", outcomes: [
        { weight: 8, text: "Kamu sempat masuk kamarnya sebentar, membantu beresin koper. Lalu kamu bilang selamat tinggal di ambang pintu yang tidak akan bisa kamu buka kapanpun kamu mau lagi.", effects: { mental: -4, happiness: 4 }, mood: "melancholy", memory: { text: "Pintu kamarnya di kos, tempat kamu mengucapkan selamat tinggal.", tag: "anak", mood: "melancholy" } },
      ]},
    ],
  }),

  e({
    id: "kehilangan_anak_dewasa", category: "kehilangan", pool: "trauma", rarity: "veryRare",
    ageMin: 50, ageMax: 90, requireFlag: "punya_anak", forbidFlag: "anak_meninggal",
    requireChildAgeMin: 25,
    lifetimeChance: 0.045, mood: "tragic",
    title: "Urutan yang Tidak Pernah Benar",
    prompt: "Ada urutan yang sudah disepakati semesta, orang tua pergi lebih dulu, anak yang mengantar. Hari ini urutan itu terbalik, dan tidak ada satu pun bagian dari dirimu yang siap. Anakmu sudah dewasa, mungkin sudah punya hidupnya sendiri, tapi di matamu, dia kembali jadi bayi yang dulu kamu gendong jam tiga pagi.",
    choices: [
      { id: "antar", label: "Antar dia, walau ini terbalik", outcomes: [
        { weight: 8, text: "Kamu berdiri di tempat yang seharusnya tidak pernah kamu tempati. Tanganmu yang menua mengusap peti yang isinya pernah kamu ajari berjalan. Tidak ada kata untuk orang tua yang kehilangan anak, bahasa pun tahu, itu sesuatu yang seharusnya tidak perlu dinamai.", effects: { mental: -17, happiness: -14, health: -4 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Berdiri sebagai orang tua yang menguburkan anaknya sendiri.", tag: "kehilangan", mood: "tragic" } },
      ]},
      { id: "bayi", label: "Ingat dia sebagai bayi yang dulu kamu gendong", outcomes: [
        { weight: 8, text: "Di tengah semua urusan yang harus diurus, kepalamu malah memutar hal-hal paling tua. Berat kecilnya di lenganmu, kata pertamanya, hari pertamanya sekolah. Seolah dengan mengingat awalnya, kamu bisa menolak akhirnya. Kamu tidak bisa. Tapi ingatan itu tetap kamu peluk, satu-satunya yang tersisa untuk dipeluk.", effects: { mental: -16, happiness: -14, health: -3 }, mood: "tragic",
          flag: "anak_meninggal", killsRelationship: "anak1",
          memory: { text: "Berat kecilnya di lenganmu, ingatan yang kamu peluk saat tak ada lagi yang bisa dipeluk.", tag: "kehilangan", mood: "tragic" } },
      ]},
    ],
  }),
];
