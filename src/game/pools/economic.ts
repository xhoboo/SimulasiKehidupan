import { Choice, LifeEvent } from "../types";
import { e, FLAG_MANDIRI, isMandiri } from "./_helpers";

export const ECONOMIC_POOL: LifeEvent[] = [
  e({
    id: "akhir_bulan_2", category: "pekerjaan", pool: "economic", rarity: "common",
    ageMin: 25, ageMax: 42, requireWealthMax: 20, requireFlag: "akhir_bulan_1", mood: "melancholy",
    title: "Tanggal 25, Lagi",
    prompt: "Rekening yang kamu hafal angkanya sebelum dicek. Sudah beberapa kali seperti ini. Kamu tahu cara bertahan, yang kamu tidak tahu adalah 'kenapa masih harus?'",
    choices: (ctx) => {
      const choices: Choice[] = [
        { id: "sistem", label: "Coba buat anggaran yang lebih ketat", outcomes: [
          { weight: 8, text: "Spreadsheet terbuka. Angkanya tidak bohong. Kamu menyadari bukan pengeluaranmu yang masalah. Pendapatannya.", effects: { intelligence: 3, mental: -2, discipline: 4 }, extraFlags: ["akhir_bulan_2"] },
          { weight: 6, text: "Kamu pasang aplikasi pencatat. Rajin seminggu, lalu lupa. Tapi satu hal menetap, kamu jadi tahu persis ke mana uangmu lari. Pengetahuan yang tidak menyenangkan, tapi berguna.", effects: { intelligence: 3, discipline: 2 }, extraFlags: ["akhir_bulan_2"] },
        ]},
        { id: "kerja_sampingan", label: "Cari kerja sampingan", outcomes: [
          { weight: 8, text: "Driver ojol dua hari seminggu. Kelelahan jenis baru, tapi juga rasa kendali yang lebih.", effects: { wealth: 4, health: -3, mental: 2 }, extraFlags: ["akhir_bulan_2"] },
          { weight: 8, text: "Freelance desain. Tiga klien pertama ghosting. Yang keempat bayar, terlambat dua minggu.", effects: { wealth: 3, mental: -3 }, extraFlags: ["akhir_bulan_2"] },
        ]},
        { id: "terima", label: "Terima ini sebagai kondisi hidup sekarang", outcomes: [
          { weight: 8, text: "Ada ketenangan aneh saat tidak melawan sesuatu yang belum bisa diubah. Atau mungkin itu hanya kelelahan yang menyamar.", effects: { mental: 2, happiness: -3 }, extraFlags: ["akhir_bulan_2"] },
          { weight: 6, text: "Kamu berhenti memarahi diri sendiri tiap akhir bulan. Bukan menyerah, hanya berhenti menambah luka di atas luka. Itu ternyata, juga sejenis kekuatan.", effects: { mental: 3, happiness: -2 }, extraFlags: ["akhir_bulan_2"] },
        ]},
      ];
      // "Minta naik gaji" → "Bos bilang…" mengandaikan ada atasan; hanya tawarkan
      // ke pegawai, bukan pemain berjalur sendiri (lihat isMandiri).
      if (!isMandiri(ctx.state)) {
        choices.push({ id: "minta_naik", label: "Minta naik gaji", outcomes: [
          { weight: 8, text: "Bos bilang 'nanti review dulu ya'. Kalimat itu sudah kamu hafal intonasinya.", effects: { mental: -3 }, extraFlags: ["akhir_bulan_2"] },
          { weight: 8, text: "Naik 8%. Tidak cukup, tapi lebih baik dari nol.", effects: { wealth: 5, mental: 3 }, extraFlags: ["akhir_bulan_2"] },
        ]});
      }
      return choices;
    },
  }),

  e({
    id: "akhir_bulan_susah", category: "pekerjaan", pool: "economic", rarity: "common",
    // Outcome "pening di tengah rapat" mengasumsikan pemain pekerja kantoran —
    // tutup untuk yang berjalur sendiri (wirausaha/pedagang/praktik/freelance)
    // yang tidak punya rapat kantor.
    ageMin: 24, ageMax: 40, requireWealthMax: 25, deferrable: true, mood: "melancholy",
    forbidAnyFlag: [...FLAG_MANDIRI],
    title: "Tanggal 27",
    prompt: "Saldo tinggal cukup untuk satu galon dan satu kotak indomie. Tanggal gajian masih jauh.",
    choices: [
      { id: "pinjol", label: "Buka aplikasi pinjol", outcomes: [
        { weight: 8, text: "Cair dalam 4 menit. Bunga 38%. Tidur? Tentu tidak nyenyak.", effects: { wealth: 5, mental: -5 }, flag: "ada_pinjol", extraFlags: ["akhir_bulan_1"] },
        { weight: 8, text: "Cair lagi, semudah yang pertama dulu. Itu yang menakutkan. kamu hafal jadwal penagih lebih baik daripada jadwal kerjamu.", effects: { wealth: 4, mental: -7 }, flag: "ada_pinjol", extraFlags: ["akhir_bulan_1"], mood: "tragic" },
      ]},
      { id: "pinjam_teman", label: "Pinjam teman", outcomes: [
        { weight: 8, text: "Dia transfer tanpa banyak tanya. Kamu menulis catatan untuk membalas suatu hari, dengan yakin.", effects: { wealth: 3, social: -2, mental: 2 }, extraFlags: ["akhir_bulan_1"] },
        { weight: 8, text: "Dia berkata 'aku juga lagi susah'. Kamu mengangguk, mengerti. Atau berpura-pura mengerti?", effects: { social: -3, mental: -3 }, extraFlags: ["akhir_bulan_1"] },
      ]},
      { id: "puasa", label: "Puasa diam-diam sampai gajian", outcomes: [
        { weight: 8, text: "Tubuhmu ringan. Pikiranmu lebih ringan. Atau hanya kelaparan?", effects: { health: -3, discipline: 3 }, extraFlags: ["akhir_bulan_1"] },
        { weight: 6, text: "Hari ketiga, kepalamu pening di tengah rapat. Kamu tersenyum, menjawab pertanyaan, lalu duduk lagi dengan kepala yang terlalu ringan dan badan yang gemetar.", effects: { health: -5, mental: -2, discipline: 2 }, extraFlags: ["akhir_bulan_1"], mood: "melancholy" },
      ]},
      { id: "jual", label: "Jual barang di marketplace", outcomes: [
        { weight: 8, text: "Kamera lamamu laku. Jarimu menggantung sebentar, lalu klik 'kirim'.", effects: { wealth: 6, happiness: -2 }, extraFlags: ["akhir_bulan_1"] },
        { weight: 6, text: "Yang laku justru jam tangan pemberian ayahmu. Pembelinya menawar tega, kamu terima karena tidak punya pilihan. Uangnya bertahan dua minggu. Rasa kehilangannya jauh lebih panjang.", effects: { wealth: 7, happiness: -4, mental: -2 }, extraFlags: ["akhir_bulan_1"], mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "akhir_bulan_3", category: "pekerjaan", pool: "economic", rarity: "uncommon",
    ageMin: 26, ageMax: 45, requireWealthMax: 15, requireFlag: "akhir_bulan_2", mood: "melancholy",
    title: "Siklus",
    prompt: "Kamu tahu ini akan terjadi lagi. Setiap bulan, ritme yang sama. Harap-cemas-bertahan-gajian. Kamu tidak lagi kaget, hanya lelah yang berbeda dari kelelahan biasa.",
    choices: [
      { id: "putus_siklus", label: "Putuskan, ubah sesuatu yang struktural", outcomes: [
        { weight: 8, text: "Pindah kerja, kurangi hutang, atau mulai menabung sekecil apapun. Kamu pilih salah satu. Bukan solusi ajaib seketika, tapi jalan perlahan ke arah yang tepat.", effects: { mental: 6, wealth: 3, discipline: 5 } },
        { weight: 8, text: "Resolusinya kuat. Pelaksanaannya kurang. Tapi setidaknya kali ini kamu sadar ada yang perlu diubah.", effects: { mental: 3, discipline: 2 } },
      ]},
      { id: "filosofis", label: "Sadari, banyak orang hidup seperti ini seumur hidup", outcomes: [
        { weight: 8, text: "Bukan penghiburan yang berguna, tapi entah kenapa sedikit membantu. Kamu tidak sendirian dalam siklus ini.", effects: { mental: 3, happiness: -2 } },
        { weight: 8, text: "Kamu memikirkan orang-orang di angkot, di warung, di halte. Masing-masing memikul siklus yang mungkin sama, diam-diam. Anehnya itu membuatmu merasa lebih terhubung, bukan lebih kalah.", effects: { mental: 3, social: 1, happiness: -1 } },
      ]},
      { id: "minta_tolong", label: "Ceritakan ke keluarga, minta bantuan sementara", outcomes: [
        { weight: 8, text: "Lebih sulit dari yang kamu kira. Tapi mereka ada. Dan untuk malam ini, sepertinya cukup.", effects: { wealth: 5, mental: 4, happiness: 3 }, mood: "warm" },
        { weight: 8, text: "Mereka membantu dengan ikhlas tapi dengan tatapan yang sulit untuk tidak dibaca. Kamu berterima kasih sambil menelan sesuatu.", effects: { wealth: 5, mental: -3 } },
      ]},
    ],
  }),

  e({
    id: "kaya_mendadak", category: "sukses_kosong", pool: "economic", rarity: "rare",
    ageMin: 25, ageMax: 60, title: "Transferan Tidak Terduga",
    prompt: "Saldo bertambah 8 digit. Investasi lama yang kamu lupa, tiba-tiba berbuah.",
    choices: [
      { id: "rumah", label: "Beli rumah cash", outcomes: [
        { weight: 8, text: "Rumah besar, kamar terlalu banyak. Kamu lebih sering tidur di sofa ruang tamu.", effects: { wealth: 25, mental: -3, happiness: 4 }, mood: "melancholy", flag: "rumah_besar" },
        { weight: 4, text: "Rumah besar yang akhirnya kamu isi dengan orang-orang. Keluarga, teman yang singgah. Ternyata ruang kosong hanya menakutkan kalau kamu sendirian.", effects: { wealth: 22, happiness: 8, social: 5 }, mood: "warm" },
      ]},
      { id: "bagi", label: "Bagikan ke keluarga", outcomes: [
        { weight: 8, text: "Mereka menangis. Lalu berhenti bicara denganmu setelahnya. Uang itu aneh.", effects: { wealth: 5, social: -3, mental: 4 } },
        { weight: 6, text: "Kamu bagikan rata, dengan niat tulus. Sebagian berterima kasih seumur hidup. Sebagian merasa kurang, lalu menjauh. Uang tidak mengubah orang, hanya memperjelas siapa mereka sejak awal.", effects: { wealth: 4, social: -2, mental: 3 }, mood: "melancholy" },
      ]},
      { id: "donasi", label: "Donasikan setengah", outcomes: [
        { weight: 6, text: "Tidak ada yang tahu. Kamu tidur lebih nyenyak, dan lega yang kamu tidak tahu namanya.", effects: { wealth: 10, mental: 8, happiness: 6 }, achievement: "Diam-diam Murah Hati" },
        { weight: 8, text: "Kamu salurkan diam-diam, tanpa plakat, tanpa foto. Bertahun kemudian kamu bertemu seseorang yang hidupnya berubah karenamu, dan dia tidak tahu itu. Kamu simpan rahasia itu seperti harta.", effects: { wealth: 9, mental: 9, happiness: 5 }, achievement: "Diam-diam Murah Hati", mood: "warm" },
      ]},
      { id: "investasi", label: "Investasi ulang", outcomes: [
        { weight: 8, text: "Setahun kemudian, jumlahnya berlipat. Kamu masih makan indomie sesekali, soalnya enak.", effects: { wealth: 30 } },
        { weight: 8, text: "Setahun kemudian, separuhnya menguap di keputusan yang terlalu berani. Kamu tetap jauh lebih baik dari sebelumnya, tapi cukup terbakar untuk belajar.", effects: { wealth: 12, mental: -3 } },
      ]},
    ],
  }),

  e({
    id: "promosi", category: "pekerjaan", pool: "economic", rarity: "uncommon",
    // Promosi dari HR mengandaikan pemain pegawai berstruktur kantor — tidak relevan
    // bagi yang berjalur sendiri (wirausaha/pedagang/praktik/freelance).
    ageMin: 26, ageMax: 45, requireWealthMin: 30, forbidAnyFlag: [...FLAG_MANDIRI], title: "Email dari HR",
    prompt: "Subjek: 'Perubahan Posisi'. Hatimu loncat sebentar. Promosi!",
    choices: [
      { id: "ambil", label: "Ambil tantangan baru.", outcomes: [
        { weight: 8, text: "Gajimu naik 30%. Jam tidurmu turun 30%. Pertukaran yang adil, katamu pada cermin.", effects: { wealth: 12, mental: -5, social: 3 }, flag: "manajer" },
        { weight: 6, text: "Dan ternyata kamu pandai. Orang mulai mencari pendapatmu. Bebannya nyata, tapi untuk pertama kali ini kamu merasa dilihat, bukan sekadar pengisi kursi.", effects: { wealth: 12, social: 5, mental: -3 }, flag: "manajer" },
      ]},
      { id: "tolak", label: "Tolak. Kamu suka posisi sekarang.", outcomes: [
        { weight: 8, text: "Bos kecewa, tapi menghormati. Rekan kerjamu diam-diam lega.", effects: { mental: 5, happiness: 4 } },
        { weight: 8, text: "Untuk beberapa bulan kamu bertanya-tanya apakah itu pengecut atau bijak. Lalu kamu melihat manajer baru itu pulang jam sebelas malam terus-menerus, dan pertanyaanmu terjawab dengan sendirinya.", effects: { mental: 4, happiness: 3 } },
      ]},
      { id: "negosiasi", label: "Negosiasi gaji lebih tinggi", outcomes: [
        { weight: 8, text: "Mereka setuju. Kamu sadar kamu seharusnya minta lebih sejak awal.", effects: { wealth: 18, mental: -3 }, flag: "manajer" },
        { weight: 8, text: "Tawaran ditarik. Posisi diberikan ke yang lain. Kamu pulang dengan harga diri yang utuh dan saldo yang tidak.", effects: { mental: -4, social: -2 } },
      ]},
    ],
  }),
];
