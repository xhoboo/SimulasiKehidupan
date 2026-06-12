import { LifeEvent } from "../types";
import { e } from "./_helpers";

// Pool filler: peristiwa kecil unik untuk mengisi tahun-tahun yang kosong.
// Semua muncul sekali per hidup (default). Rarity common, weight rendah.
export const FILLER_POOL: LifeEvent[] = [
  e({
    id: "f_lutut_lecet", category: "random", pool: "age", rarity: "common",
    ageMin: 6, ageMax: 9, deferrable: true, weight: 8,
    prompt: "Kamu jatuh dari sepeda. Lututmu berdarah. Ibu mengoleskan obat merah yang perih.",
    choices: [
      { id: "menangis", label: "Menangis sekencang-kencangnya", outcomes: [
        { weight: 8, text: "Ibu memelukmu sambil meniup lukanya. Sakitnya hilang lebih cepat.", effects: { happiness: 3, mental: 2 } },
        { weight: 8, text: "Kamu menangis sampai tetangga ikut menengok. Lukanya kecil, tapi perhatian yang kamu dapat dari ibu hari itu terasa seluas dunia.", effects: { happiness: 3, mental: 2 } },
        { weight: 8, text: "Air matamu lebih banyak dari darah di lututmu. Ibu menempelkan plester bergambar, dan entah kenapa gambar itu membuat sakitnya berkurang separuh.", effects: { happiness: 3, mental: 2 } },
      ]},
      { id: "tahan", label: "Tahan, jangan menangis", outcomes: [
        { weight: 8, text: "Ayahmu bilang 'anak hebat'. Tapi malam itu kamu menangis pelan di kamar.", effects: { discipline: 2, mental: -2 } },
        { weight: 8, text: "Kamu mengeratkan gigi, dan ayahmu mengangguk pelan. Malamnya, perih itu baru kamu izinkan keluar dalam gelap.", effects: { discipline: 2, mental: -2 } },
      ]},
      { id: "naik_lagi", label: "Bangun, naik sepeda lagi", outcomes: [
        { weight: 8, text: "Lima menit kemudian kamu jatuh lagi. Tapi sekarang kamu tahu caranya.", effects: { discipline: 4, health: -1 } },
        { weight: 8, text: "Kali ini bisa sampai ujung gang tanpa jatuh. Tidak ada yang melihat kemenangan kecil itu kecuali kamu. Sebagian besar kemenangan dalam hidup memang begitu.", effects: { discipline: 3, happiness: 2 } },
      ]},
    ],
  }),

  e({
    id: "f_bekal_ibu", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 6, ageMax: 11, deferrable: true, weight: 8,
    prompt: "Kamu membuka kotak bekal. Ibu menyelipkan kertas kecil bertuliskan 'semangat ya'.",
    choices: [
      { id: "simpan", label: "Lipat, simpan di dompet kecil", outcomes: [
        { weight: 8, text: "Sepertinya kertas itu akan kamu temukan 25 tahun lagi, sudah pudar. Dan kamu akan menangis tanpa peringatan.", effects: { happiness: 5, mental: 4 }, mood: "warm",
          memory: { text: "Kertas 'semangat ya' dari kotak bekal.", tag: "ibu", mood: "warm" } },
        { weight: 8, text: "Kamu lipat, simpan di saku, dan diam-diam membacanya lagi saat pelajaran membosankan. Dua kata yang entah kenapa cukup untuk menyelesaikan satu hari kecil.", effects: { happiness: 5, mental: 4 }, mood: "warm",
          memory: { text: "Kertas 'semangat ya' yang kamu baca diam-diam saat bosan.", tag: "ibu", mood: "warm" } },
      ]},
      { id: "tunjuk", label: "Tunjukkan ke teman", outcomes: [
        { weight: 8, text: "Mereka mengejekmu dengan iri. Bekalmu jadi yang paling enak.", effects: { social: 2, happiness: 3 } },
      ]},
      { id: "buang", label: "Buang, malu", outcomes: [
        { weight: 8, text: "Sore itu kamu menyesal. Pulangnya, kamu memeluk ibu lebih lama dari biasanya tanpa bisa menjelaskan.", effects: { mental: -3 } },
      ]},
    ],
  }),

  e({
    id: "f_main_hujan", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 7, ageMax: 11, deferrable: true, weight: 8,
    prompt: "Hujan deras saat istirahat. Beberapa anak berlari ke lapangan, basah-basahan.",
    choices: [
      { id: "ikut", label: "Ikut, lepas sepatu", outcomes: [
        { weight: 8, text: "Kamu pulang sakit, tapi tertawa sepanjang minggu kalau ingat.", effects: { happiness: 6, health: -3 }, memory: { text: "Hujan istirahat sekolah, tertawa basah kuyup.", tag: "sd_basah", mood: "warm" } },
        { weight: 8, text: "Guru memarahi kalian semua di depan kelas dengan baju basah. Tapi barisan itu menahan tawa diam-diam, dan kamu merasa jadi bagian dari sesuatu. Hukuman paling sepadan yang pernah kamu terima.", effects: { happiness: 6, social: 3, health: -2 }, memory: { text: "Dimarahi sekelas dengan baju basah, menahan tawa di barisan.", tag: "sd_basah", mood: "warm" } },
      ]},
      { id: "lihat", label: "Tonton dari teras kelas", outcomes: [
        { weight: 8, text: "Kamu menjadi pengamat. Peran yang akan kamu pegang bertahun-tahun ke depan.", effects: { intelligence: 2 }, addTrait: "introvert" },
      ]},
      { id: "ajak", label: "Tarik temanmu yang juga ragu-ragu", outcomes: [
        { weight: 8, text: "Kalian jadi basah berdua, lalu berempat, lalu seangkatan.", effects: { social: 5, happiness: 5 } },
      ]},
    ],
  }),

  e({
    id: "f_buku_terbaik", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 13, ageMax: 18, deferrable: true, weight: 8,
    prompt: "Kamu menemukan satu buku di perpustakaan sekolah yang seakan ditulis khusus untukmu.",
    choices: [
      { id: "pinjam_terus", label: "Pinjam berulang sampai dimarahi penjaga perpus", outcomes: [
        { weight: 8, text: "Penjaga perpus akhirnya menghadiahkanmu salinannya saat kelulusan.", effects: { intelligence: 5, happiness: 5 }, addTrait: "curious", memory: { text: "Buku yang seperti ditulis untukmu.", tag: "buku_terbaik", mood: "warm" } },
        { weight: 5, text: "Kamu pinjam berulang sampai hafal nomor panggilnya. Suatu hari buku itu hilang dari rak. Kamu mencarinya bertahun-tahun, tidak pernah ingat judulnya.", effects: { intelligence: 4, happiness: 2 }, addTrait: "curious", mood: "melancholy", memory: { text: "Buku yang seperti ditulis untukmu, hilang sebelum kamu hafal judulnya.", tag: "buku_terbaik", mood: "melancholy" } },
      ]},
      { id: "salin", label: "Salin paragraf favoritmu di buku catatan", outcomes: [
        { weight: 8, text: "Catatan itu jadi awal kebiasaan menulis yang akan menyelamatkanmu di usia 28.", effects: { intelligence: 4, discipline: 3 }, addTrait: "creative" },
      ]},
      { id: "lupa", label: "Selesai membaca, lupakan judulnya", outcomes: [
        { weight: 8, text: "Bertahun-tahun kemudian, kamu mencari-cari buku itu di toko buku tanpa pernah ingat judulnya.", effects: { happiness: 1 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "f_makan_warung", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 15, ageMax: 18, deferrable: true, weight: 8,
    prompt: "Pulang sekolah, temanmu mengajak makan di warung pinggir jalan. Uangnya kalian patungan.",
    choices: [
      { id: "ikut", label: "Ikut, walau uangmu tipis", outcomes: [
        { weight: 8, text: "Nasi telor dengan kecap. Tertawa sampai tersedak. Sore yang tidak akan kamu tukar dengan apapun.", effects: { social: 5, happiness: 6 }, memory: { text: "Nasi telor sore di warung pinggir jalan.", tag: "warung_remaja", mood: "warm" } },
        { weight: 8, text: "Uangmu cuma cukup untuk teh hangat, tapi mereka berbagi gorengan tanpa kamu minta. Kamu pulang kenyang oleh hal yang bukan makanan. Sore seperti ini yang kelak kamu rindukan tanpa tahu cara menjelaskannya.", effects: { social: 5, happiness: 5 }, memory: { text: "Gorengan yang dibagi tanpa diminta, sore di warung pinggir jalan.", tag: "warung_remaja", mood: "warm" } },
        { weight: 8, text: "Satu porsi mie ayam dibagi bertiga, kuah diminta tambah gratis sampai penjualnya pura-pura tidak lihat. Bumbunya biasa saja, tapi tawa kalian membuatnya jadi mie ayam terenak yang kamu ingat sampai tua.", effects: { social: 5, happiness: 6 }, memory: { text: "Satu mangkok mie ayam dibagi bertiga di warung pinggir jalan.", tag: "warung_remaja", mood: "warm" } },
        { weight: 8, text: "Hujan yang turun begitu kalian duduk jadi alasan untuk berlama-lama. Es teh, gorengan, dan obrolan yang tidak penting tapi tidak ingin kalian sudahi. Warung itu menahan kalian sampai langit gelap.", effects: { social: 5, happiness: 5 }, memory: { text: "Terjebak hujan di warung, obrolan remaja yang tak ingin disudahi.", tag: "warung_remaja", mood: "warm" } },
      ]},
      { id: "tolak", label: "Tolak, langsung pulang", outcomes: [
        { weight: 8, text: "Mereka tetap pergi tanpamu. Sebuah cabang kecil dari hidupmu menutup tanpa kamu sadari.", effects: { social: -3, mental: -2 } },
        { weight: 8, text: "Kamu pulang, dan dari jendela mendengar tawa mereka lewat di gang. Ada undangan-undangan kecil yang kalau ditolak terlalu sering, lama-lama berhenti datang.", effects: { social: -3, mental: -2 }, mood: "melancholy" },
        { weight: 8, text: "Kamu bilang ada urusan, padahal cuma ingin pulang. Di rumah, notifikasi grup mereka berbunyi terus, penuh tawa yang tidak kamu ikuti. Kamu matikan suaranya, lalu menyesalinya.", effects: { social: -3, mental: -2 }, mood: "melancholy" },
      ]},
      { id: "bayari", label: "Bayari semua dari uang tabungan", outcomes: [
        { weight: 8, text: "Mereka kaget. Selama seminggu kamu jadi 'sahabat baik'. Lalu lupa.", effects: { wealth: -3, social: 3 } },
        { weight: 5, text: "Kamu keluarkan uang tabungan diam-diam, biar tak ada yang merasa berutang. Tidak ada yang tahu itu sisa uang jajanmu minggu itu. Kamu pulang jalan kaki, dan anehnya merasa kaya.", effects: { wealth: -3, social: 3, happiness: 2 } },
      ]},
    ],
  }),

  e({
    id: "f_kos_pertama", category: "random", pool: "filler", rarity: "common",
    ageMin: 18, ageMax: 23, deferrable: true, weight: 8,
    prompt: "Malam pertama di kos. Lampu kuning. Kasur tipis. Bau kamar orang lain yang belum jadi baumu.",
    choices: [
      { id: "menangis", label: "Menangis pelan sambil rebahan", outcomes: [
        { weight: 8, text: "Kamu sadar dewasa itu sebagian besar adalah menangis sambil tidak bisa menjelaskan kenapa, dan itu justru membuatmu bisa tidur.", effects: { mental: -2 }, flag: "tinggal_kos", memory: { text: "Malam pertama di kos, bau kamar orang lain, dan air mata yang tidak ada yang tahu.", tag: "kos_pertama", mood: "melancholy" } },
        { weight: 5, text: "Kamu menelepon rumah, tapi begitu telepon diangkat kamu malah tidak bisa bicara. Kadang kita hanya rindu pada suara yang biasa kita dengar.", effects: { mental: -2, social: 1 }, flag: "tinggal_kos", mood: "melancholy", memory: { text: "Telepon rumah malam pertama di kos, yang tak sanggup kamu lanjutkan.", tag: "kos_pertama", mood: "melancholy" } },
      ]},
      { id: "beresin", label: "Beresin koper dulu, baru istirahat", outcomes: [
        { weight: 8, text: "Kamu mengeluarkan foto keluarga kecil dari tas. Tidak tahu mau ditaruh di mana. Akhirnya di dalam laci. Beberapa hal butuh waktu untuk menemukan tempatnya.", effects: { discipline: 2, mental: 1 }, flag: "tinggal_kos" },
        { weight: 5, text: "Kamu tata semuanya rapi sampai kamar asing itu mulai terasa seperti milikmu. Menjelang tidur kamu merasa sedikit bangga. Ini kamarmu, hasil keputusanmu sendiri, sesempit apa pun.", effects: { discipline: 3, mental: 2, happiness: 1 }, flag: "tinggal_kos" },
      ]},
      { id: "kenalan", label: "Keluar, kenalan dengan tetangga kos", outcomes: [
        { weight: 8, text: "Anak teknik dari Lampung. Semalam kamu baru kenal, tapi sudah ngobrol sampai jam dua. Akan jadi sahabatmu selama empat tahun ke depan.", effects: { social: 6, happiness: 3 }, flag: "tinggal_kos", addsRelationship: { name: "Tetangga Kos", role: "friend", closeness: 50, alive: true } },
        { weight: 5, text: "Kamu mengetuk pintu sebelah, yang membuka orang yang sama canggungnya. Obrolan kaku lima menit, lalu pamit. Kalian tidak pernah dekat, tapi satu wajah yang dikenal di tempat asing sudah cukup.", effects: { social: 3, mental: 2 }, flag: "tinggal_kos", addsRelationship: { name: "Tetangga Kos", role: "friend", closeness: 25, alive: true } },
      ]},
    ],
  }),

  e({
    id: "f_skripsi_macet", category: "sekolah", pool: "age", rarity: "common",
    ageMin: 22, ageMax: 24, deferrable: true, weight: 8,
    requireAnyFlag: ["jurusan_kedokteran", "jurusan_seni", "jurusan_teknik", "jurusan_filsafat", "jurusan_psikologi"],
    forbidFlag: "sudah_lulus",
    prompt: "Skripsi macet di bab 3. Dosen pembimbingmu menghilang seperti hantu.",
    choices: [
      { id: "kejar", label: "Kejar, datangi rumahnya", outcomes: [
        { weight: 8, text: "Dia kaget, tapi tetap tanda tangan. Kamu lulus.", effects: { intelligence: 4, discipline: 5 }, achievement: "Lulus", flag: "sudah_lulus" },
        { weight: 8, text: "Dia menolak menemuimu. Skripsimu tertunda satu semester.", effects: { mental: -5, wealth: -3 } },
      ]},
      { id: "ganti", label: "Ganti pembimbing", outcomes: [
        { weight: 8, text: "Birokrasi memakan waktu. Tapi pembimbing baru lebih manusiawi.", effects: { intelligence: 3, mental: 2 } },
        { weight: 5, text: "Pembimbing baru membaca skripsimu semalam, mengembalikannya penuh coretan. Sakit, tapi akhirnya ada yang benar-benar membaca tulisanmu. Kamu lulus terlambat, tapi lebih merasa berhak lulus.", effects: { intelligence: 4, discipline: 3, mental: 1 }, flag: "sudah_lulus" },
      ]},
      { id: "menyerah", label: "Cuti dulu, jeda", outcomes: [
        { weight: 8, text: "Cuti dua semester. Tapi kamu kembali dengan mental yang lebih siap.", effects: { mental: 5, wealth: -3 } },
        { weight: 5, text: "Cuti itu kamu isi dengan kerja serabutan dan tidur yang cukup untuk pertama kalinya dalam setahun. Saat kembali, skripsi yang dulu seperti tembok ternyata cuma tumpukan tugas biasa. Yang berubah bukan skripsinya, tapi kamu.", effects: { mental: 5, discipline: 2, wealth: -2 } },
      ]},
    ],
  }),

  e({
    id: "f_undangan_nikah", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 26, ageMax: 35, deferrable: true, weight: 8,
    prompt: "Undangan pernikahan datang dari teman SMA-mu yang dulu bilang 'aku tidak ingin menikah'.",
    choices: [
      { id: "datang", label: "Datang, beri ucapan tulus", outcomes: [
        { weight: 8, text: "Dia menangis di pelukanmu di pojok pelaminan. Kalian belum bertemu sejak SMA, dan kalian sahabat lagi malam itu.", effects: { social: 5, happiness: 5 }, mood: "warm" },
        { weight: 8, text: "Di antara ratusan tamu, dia menyempatkan mencarimu hanya untuk bilang 'makasih udah dateng,' lalu ditarik lagi oleh keramaian. Pertemanan dewasa adalah pertemuan singkat di sela hidup yang masing-masing sudah penuh.", effects: { social: 4, happiness: 4 }, mood: "warm" },
      ]},
      { id: "transfer", label: "Transfer kado, tidak datang", outcomes: [
        { weight: 8, text: "Dia mengirim foto pelaminan dengan caption 'thank you ya'. Kamu balas emoji love. Itu saja.", effects: { social: -1 } },
      ]},
      { id: "sedih", label: "Datang, tapi pulang awal sambil merenung", outcomes: [
        { weight: 8, text: "Bukan iri. Hanya sadar, hidupmu tidak sinkron dengan kebanyakan orang. Itu bukan masalah, tapi malam ini terasa seperti masalah.", effects: { mental: -4 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "f_reunian", category: "pertemanan", pool: "age", rarity: "common",
    ageMin: 30, ageMax: 40, deferrable: true, weight: 8,
    prompt: "Grup reuni SMA tiba-tiba aktif. Mereka mengajak kumpul akhir pekan ini.",
    choices: [
      { id: "datang", label: "Datang, bawa cerita", outcomes: [
        { weight: 8, text: "Kalian tertawa sampai jam tiga. Beberapa wajah kamu lupa namanya. Tidak apa.", effects: { social: 5, happiness: 5 } },
        { weight: 8, text: "Kamu sadar, kalian tidak punya apa-apa lagi selain kenangan. Itu menyedihkan dan indah sekaligus.", effects: { mental: -2, happiness: 2 }, mood: "melancholy" },
      ]},
      { id: "ghosting", label: "React 👍, tidak datang", outcomes: [
        { weight: 8, text: "Mereka bilang memahami. Entah memang memahami, entah hanya sopan.", effects: { social: -2, mental: 2 } },
      ]},
      { id: "tolak_tegas", label: "Bilang jujur kamu tidak siap", outcomes: [
        { weight: 8, text: "Satu orang kirim DM panjang. Kalian ngobrol berdua minggu depan, lebih dalam dari semua reuni.", effects: { social: 4, mental: 4 } },
        { weight: 5, text: "Kejujuran itu membuat satu-dua orang ikut mengaku mereka juga datang ke reuni cuma karena takut dianggap sombong. Mungkin separuh reuni memang dihadiri orang yang sama-sama tidak ingin datang.", effects: { social: 2, mental: 3 } },
      ]},
    ],
  }),

  e({
    id: "f_resep_ibu", category: "keluarga", pool: "age", rarity: "common",
    ageMin: 30, ageMax: 60, deferrable: true, weight: 8, mood: "warm",
    requireFlag: "ibu_meninggal",
    title: "Resep Tulisan Tangan",
    prompt: "Kamu menemukan kertas resep masakan tulisan tangan ibu. Tinta birunya sudah memudar.",
    choices: [
      { id: "masak", label: "Masak persis sesuai resep", outcomes: [
        { weight: 8, text: "Rasanya 80% mirip. 20% sisanya adalah tangannya, dan kamu tidak bisa meniru itu.", effects: { mental: 5, happiness: 5 }, memory: { text: "Resep tulisan tangan ibu, di kertas yang memudar.", tag: "ibu", mood: "warm" } },
      ]},
      { id: "scan", label: "Foto, simpan di cloud", outcomes: [
        { weight: 8, text: "Kamu juga menyimpan kertas aslinya di kotak khusus. Sebagian hal tidak boleh hanya digital.", effects: { mental: 3, discipline: 2 } },
        { weight: 5, text: "Kamu foto resepnya dari berbagai sudut, takut kehilangan satu coretan pun. Lalu kamu sadar yang kamu takut hilang bukan resepnya, tapi tulisan tangannya, satu-satunya yang tersisa yang masih berbentuk dia.", effects: { mental: 4, discipline: 2 }, mood: "melancholy" },
      ]},
      { id: "bingkai", label: "Bingkai, gantung di dapur", outcomes: [
        { weight: 8, text: "Setiap kamu masak, dia ada di sana. Tidak benar-benar ada, tapi cukup.", effects: { mental: 6, happiness: 4 }, mood: "warm" },
        { weight: 8, text: "Kamu bingkai dan gantung di dapur. Tamu mengira itu hiasan, bagimu itu kehadiran. Setiap masakan adalah percakapan dengan seseorang yang sudah tidak menjawab.", effects: { mental: 5, happiness: 3 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "f_kacamata", category: "random", pool: "age", rarity: "common",
    ageMin: 38, ageMax: 48, deferrable: true, weight: 8,
    prompt: "Kamu sadar harus menjauhkan ponsel agar bisa membaca. Optik di mall menunggumu.",
    choices: [
      { id: "bingkai_lucu", label: "Pilih bingkai yang berani", outcomes: [
        { weight: 8, text: "Kamu terlihat seperti versi dirimu yang lebih percaya diri. Mungkin memang itu maumu.", effects: { happiness: 4, social: 3 } },
      ]},
      { id: "bingkai_aman", label: "Bingkai netral, hitam standar", outcomes: [
        { weight: 8, text: "Tidak ada yang menyadari. Itu yang kamu mau.", effects: { mental: 1 } },
      ]},
      { id: "tunda", label: "Tunda. Ponselmu masih bisa dijauhkan.", outcomes: [
        { weight: 8, text: "Setahun lagi tanganmu kurang panjang. Setahun lagi kamu menyerah.", effects: { health: -2 } },
        { weight: 5, text: "Kamu tunda, lalu mendapati diri membaca menu restoran dengan tangan yang terjulur maksimal seperti sedang menjauhkan dunia. Pelayan muda menahan senyum. Kamu pesan kacamata minggu itu juga, kalah oleh menu nasi goreng.", effects: { health: -1, happiness: 1 } },
      ]},
    ],
  }),

  e({
    id: "f_check_up", category: "penyakit", pool: "age", rarity: "common",
    ageMin: 42, ageMax: 55, deferrable: true, weight: 8, mood: "melancholy",
    title: "Hasil Lab",
    prompt: "Hasil medical check-up datang. Beberapa angka berwarna kuning. Bukan merah, tapi tidak hijau.",
    choices: [
      { id: "serius", label: "Ubah pola makan, mulai jalan kaki", outcomes: [
        { weight: 8, text: "Enam bulan kemudian angkanya hijau. Tubuhmu berterima kasih dengan caranya.", effects: { health: 8, discipline: 5 } },
        { weight: 5, text: "Kamu mulai jalan kaki tiap pagi. Angkanya membaik. Tapi yang lebih berharga adalah kamu menemukan satu jam dalam sehari yang benar-benar milikmu.", effects: { health: 7, discipline: 4, mental: 3 } },
      ]},
      { id: "abaikan", label: "Simpan map, lupakan", outcomes: [
        { weight: 8, text: "Angka kuning suatu hari jadi merah. Tapi itu nanti.", effects: { health: -8 }, flag: "abai_kesehatan" },
        { weight: 5, text: "Kamu taruh map itu di laci yang sama tempat semua hal yang ingin kamu lupakan. Tubuhmu masih terasa baik-baik saja, dan 'baik-baik saja' adalah pembohong yang paling kamu percaya.", effects: { health: -8, mental: 1 }, flag: "abai_kesehatan", mood: "melancholy" },
      ]},
      { id: "panik", label: "Panik, googling sampai pagi", outcomes: [
        { weight: 8, text: "Kamu mendiagnosis dirimu kena 14 penyakit. Tidak ada yang benar.", effects: { mental: -5 } },
        { weight: 5, text: "Kamu googling sampai pagi, tidur dengan keyakinan kamu tidak akan bangun. Kamu bangun, tentu saja. Lalu kamu bikin janji dokter beneran. Kepanikan, sesekali, adalah pintu masuk ke tindakan yang benar.", effects: { mental: -3, health: 2 } },
      ]},
    ],
  }),

  e({
    id: "f_baca_obituari", category: "kehilangan", pool: "age", rarity: "common",
    ageMin: 50, ageMax: 80, deferrable: true, weight: 8, mood: "melancholy",
    title: "Halaman Obituari",
    prompt: "Kamu mulai membaca halaman obituari koran. Tidak sengaja awalnya, lalu jadi rutin.",
    choices: [
      { id: "amati", label: "Amati nama-nama, hitung usia", outcomes: [
        { weight: 8, text: "Kebanyakan lebih tua darimu. Beberapa lebih muda. Itu pengingat yang aneh dan berguna.", effects: { mental: -2 }, mood: "melancholy" },
        { weight: 5, text: "Suatu pagi kamu menemukan nama yang kamu kenal. Teman lama, hilang kontak puluhan tahun. Kamu hitung berapa lama kalian terpisah. Ternyata lebih panjang dari masa kalian pernah berteman. Kamu lipat koran itu pelan.", effects: { mental: -4, happiness: -1 }, mood: "melancholy", memory: { text: "Nama teman lama yang kamu temukan di halaman obituari.", tag: "kehilangan", mood: "melancholy" } },
      ]},
      { id: "stop", label: "Berhenti baca, taruh koran", outcomes: [
        { weight: 8, text: "Kamu beralih ke halaman olahraga. Lebih aman, untuk sekarang.", effects: { mental: 2 } },
      ]},
      { id: "tulis", label: "Tulis obituarimu sendiri di buku catatan", outcomes: [
        { weight: 8, text: "Kamu menulis tiga paragraf, lalu robek. Lalu menulis ulang lebih jujur.", effects: { mental: 6, discipline: 3 }, memory: { text: "Obituari yang kamu tulis untuk dirimu sendiri.", tag: "tua", mood: "melancholy" } },
        { weight: 5, text: "Yang ingin kamu sebut bukan jabatan atau pencapaian, tapi sore-sore biasa, orang yang kamu temani, hal kecil yang tak pernah masuk koran. Kamu menutup buku itu, anehnya, merasa lega.", effects: { mental: 6, happiness: 2 }, mood: "melancholy", memory: { text: "Obituari yang kamu tulis, berisi sore-sore biasa, bukan pencapaian.", tag: "tua", mood: "melancholy" } },
      ]},
    ],
  }),

  e({
    id: "f_kursi_taman", category: "quiet", pool: "age", rarity: "common",
    ageMin: 55, ageMax: 70, deferrable: true, weight: 8, mood: "warm",
    title: "Bangku Taman",
    prompt: "Sore di bangku taman. Anak-anak berlarian. Kamu menyadari kamu sudah bukan yang berlari.",
    choices: [
      { id: "amati", label: "Tersenyum, amati", outcomes: [
        { weight: 8, text: "Peran baru, menjadi yang melihat. Ternyata tidak buruk.", effects: { mental: 5, happiness: 4 }, mood: "warm" },
        { weight: 5, text: "Seorang anak jatuh tak jauh darimu, menangis, lalu bangun sendiri sebelum kamu sempat beranjak. Kamu cukup jadi saksi sekarang, dan itu peran yang terhormat.", effects: { mental: 5, happiness: 3 }, mood: "warm" },
      ]},
      { id: "ajak", label: "Ajak ngobrol kakek di sebelahmu", outcomes: [
        { weight: 8, text: "Dia bercerita soal istrinya yang sudah lama pergi. Kalian diam bersama lalu pulang.", effects: { social: 4, mental: 5 }, memory: { text: "Kakek di bangku taman dan istrinya yang sudah lama pergi.", tag: "tua", mood: "melancholy" } },
        { weight: 5, text: "Dia tidak banyak bicara, cuma menunjuk pohon besar di ujung taman. 'Saya yang tanam, empat puluh tahun lalu.' Kalian menatap pohon itu bersama dalam diam. Ada warisan yang tidak butuh nama, hanya butuh ditanam tepat waktu.", effects: { social: 3, mental: 5 }, mood: "melancholy", memory: { text: "Kakek taman dan pohon yang ia tanam empat puluh tahun lalu.", tag: "tua", mood: "melancholy" } },
      ]},
      { id: "menulis", label: "Tulis sesuatu di buku saku", outcomes: [
        { weight: 8, text: "Tulisanmu tidak akan dibaca siapapun. Itu juga tidak masalah.", effects: { mental: 4 } },
      ]},
    ],
  }),
];
