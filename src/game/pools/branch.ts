import { Choice, LifeEvent } from "../types";
import { e } from "./_helpers";

// Pool cabang: event yang HANYA muncul kalau pemain mengambil pilihan tertentu sebelumnya.
// Ini yang membuat tiap playthrough membawa cerita berbeda.
//
// Catatan desain: pilihan yang menentukan jalan cerita (men-set flag cabang) tetap
// men-set flag yang sama di SEMUA outcome-nya, supaya alurnya lanjut — tapi outcome-nya
// bisa berbeda (stat, mood, kenangan, sifat). Jadi "jalan yang sama" bisa membuahkan
// hidup yang berbeda, sampai ke cara kematiannya (health/mental mempengaruhi mortalitas).
export const BRANCH_POOL: LifeEvent[] = [
e({
    id: "br_gap_pulang", category: "eksistensial", pool: "age", rarity: "uncommon",
    ageMin: 20, ageMax: 20, requireFlag: "gap_year", guaranteed: true, mood: "melancholy",
    title: "Sehabis Setahun",
    prompt: "Setahun gap berakhir. Kamu masih belum tahu mau jadi apa, tapi sekarang lebih jujur tentang itu.",
    choices: [
      { id: "kuliah", label: "Daftar kuliah, jurusan apa saja yang masuk", outcomes: [
        { weight: 8, text: "Filsafat. Kamu tidak menyangka, tapi kelas pertamamu terasa seperti pulang.", effects: { intelligence: 6, happiness: 5 }, flag: "jurusan_filsafat", addTrait: "curious" },
        { weight: 8, text: "Psikologi. Kamu mengira akan belajar membaca orang lain, ternyata yang paling sering kamu lakukan di tiap teori justru dirimu sendiri.", effects: { intelligence: 6, mental: 4 }, flag: "jurusan_psikologi", addTrait: "empathetic" },
      ]},
      { id: "kerja", label: "Cari kerja apapun, mulai dari nol", outcomes: [
        { weight: 8, text: "Barista. Tiga bulan pertama berat. Tapi tanganmu belajar sesuatu yang sekolah tidak pernah ajarkan.", effects: { discipline: 5, social: 4 }, flag: "barista" },
        { weight: 8, text: "Berjualan di pinggir jalan. Gerobak pinjaman, dagangan seadanya. Malu di hari pertama hampir mengalahkanmu.", effects: { discipline: 5, social: 3, wealth: 1 }, flag: "pedagang_kaki_lima" },
      ]},
      { id: "lanjut_gap", label: "Lanjutkan gap. Setahun lagi.", outcomes: [
        { weight: 8, text: "Setahun jadi tiga. Orangtuamu berhenti bertanya. Itu terasa seperti kekalahan dan kebebasan sekaligus.", effects: { mental: -3, happiness: 1 }, flag: "gap_panjang" },
        { weight: 8, text: "Setahun lagi. Tapi kali ini kamu isi: kerja paruh waktu, kelas online tengah malam, satu proyek yang tak seorang pun memintamu. Gap yang tidak lagi terasa seperti melarikan diri.", effects: { intelligence: 4, discipline: 3, mental: 2 }, flag: "gap_panjang" },
      ]},
    ],
  }),

e({
    id: "br_dokter_koas", category: "pekerjaan", pool: "age", rarity: "common",
    // guaranteed + jendela 22-24: koas HARUS muncul sebelum br_dokter_kerja (27+),
    // supaya kalimat "beberapa tahun sejak koas" di sana tidak pernah menggantung.
    ageMin: 22, ageMax: 24, requireFlag: "jurusan_kedokteran", guaranteed: true, mood: "melancholy",
    title: "Jaga Malam Pertama",
    prompt: "Koas. Jaga malam pertama. Pasien meninggal jam 03:14. Kamu menulis di rekam medis dengan tangan yang sedikit gemetar.",
    choices: [
      { id: "tegar", label: "Pulang, mandi, tidur 2 jam", outcomes: [
        { weight: 8, text: "Kamu belajar mematikan satu bagian dalam dirimu. Itu yang membuatmu bisa bertahan.", effects: { mental: -4, discipline: 5 }, addTrait: "ambitious", flag: "dokter_jadi", extraFlags: ["sudah_lulus"] },
        { weight: 8, text: "Mandi tidak menghapus bau lorong itu. Kamu berangkat lagi sebelum sempat merasa apa-apa, dan begitu seterusnya. Kamu jadi pandai melakukannya.", effects: { mental: -7, health: -3, discipline: 6 }, addTrait: "ambitious", flag: "dokter_jadi", extraFlags: ["sudah_lulus"], mood: "tragic" },
      ]},
      { id: "menangis", label: "Menangis di tangga rumah sakit", outcomes: [
        { weight: 8, text: "Senior menemukanmu, tidak berkata apa-apa, hanya duduk di sebelah. Sepuluh menit. Lalu kalian kembali kerja.", effects: { mental: -2, social: 3 }, addTrait: "empathetic", flag: "dokter_jadi", extraFlags: ["sudah_lulus"], memory: { text: "Tangga rumah sakit jam 4 pagi.", tag: "koas", mood: "melancholy" } },
        { weight: 8, text: "Tidak ada yang menemukanmu. Kamu menangis sampai habis, mencuci muka di wastafel, lalu kembali ke bangsal. Ternyata kamu sanggup, dan itu menakutkan.", effects: { mental: 2, discipline: 4 }, addTrait: "empathetic", flag: "dokter_jadi", extraFlags: ["sudah_lulus"], memory: { text: "Menangis sendirian, lalu kembali kerja.", tag: "koas", mood: "melancholy" } },
      ]},
      { id: "berhenti", label: "Pikirkan untuk berhenti", outcomes: [
        // flag dokter_jadi: meski sempat ingin berhenti, ia tetap jadi dokter — jadi br_dokter_kerja boleh menyusul.
        { weight: 8, text: "Kamu menulis surat resign tiga kali dan merobeknya tiga kali. Pagi datang. Kamu tetap di sana.", effects: { mental: -5, discipline: 2 }, flag: "dokter_jadi", extraFlags: ["sudah_lulus"] },
        { weight: 8, text: "Kamu tidak menulis apa-apa. Hanya duduk di parkiran sampai matahari naik, lalu masuk lagi. Pikiran untuk berhenti itu tidak pernah benar-benar pergi, tapi juga tidak pernah menang.", effects: { mental: -3, happiness: -2 }, flag: "dokter_jadi", extraFlags: ["sudah_lulus"] },
      ]},
    ],
  }),

e({
    id: "br_filsafat_jalan", category: "eksistensial", pool: "age", rarity: "uncommon",
    ageMin: 24, ageMax: 26, requireFlag: "jurusan_filsafat", guaranteed: true, mood: "melancholy",
    title: "Gelar yang Tidak Ada Lowongannya",
    prompt: "Ijazah filsafat di laci. Kolom lowongan tidak pernah menyebut kata itu sekali pun. Yang kamu punya cuma kebiasaan bertanya yang tidak bisa dimatikan, di dunia yang membayar orang untuk berhenti bertanya.",
    choices: [
      { id: "ajar", label: "Mengajar. Bagikan pertanyaannya ke yang lebih muda", outcomes: [
        { weight: 8, flag: "sudah_lulus", text: "Gaji guru honorer tidak cukup, tapi ada satu murid yang matanya menyala saat kamu bilang 'belum tentu'. Itu yang membuatmu kembali tiap pagi.", effects: { happiness: 5, social: 4, wealth: -2 }, addTrait: "curious",
          memory: { text: "Murid yang matanya menyala saat kamu bilang 'belum tentu'.", tag: "waktu", mood: "warm" } },
        { weight: 8, flag: "sudah_lulus", text: "Kamu mengajar, dan menyadari sebagian besar muridmu cuma ingin nilai, bukan pertanyaan. Kamu tetap menyelipkannya, diam-diam, seperti menanam pohon yang teduhnya untuk orang lain.", effects: { mental: 4, social: 2, wealth: -2 }, mood: "melancholy" },
      ]},
      { id: "kantor", label: "Ambil kerja apa saja", outcomes: [
        { weight: 8, flag: "sudah_lulus", text: "Siang kamu jadi orang yang berguna di sebuah kantor. Malam kamu baca Camus sampai larut. Dua orang dalam satu tubuh, dan keduanya belajar berdamai.", effects: { wealth: 4, mental: 2, intelligence: 3 },
          memory: { text: "Malam-malam membaca Camus setelah hari yang tidak ada hubungannya dengan filsafat.", tag: "bebas", mood: "melancholy" } },
      ]},
      { id: "tulis", label: "Menulis, meski belum tentu ada yang membaca", outcomes: [
        { weight: 8, flag: "sudah_lulus", text: "Tulisanmu dibaca segelintir orang di internet. Tidak menghasilkan uang, tapi sekali waktu ada pesan: 'tulisanmu menahanku malam itu.'", effects: { intelligence: 4, mental: 4, happiness: 2 }, addTrait: "creative", mood: "warm" },
        { weight: 8, flag: "sudah_lulus", text: "Kamu menulis bertahun-tahun di ruang yang sebagian besar sunyi. Tidak ada yang datang, tapi kamu tetap menulis. Ternyata sebagian tulisan tidak harus dibaca, hanya agar tidak menumpuk di kepala saja.", effects: { intelligence: 3, mental: 3, wealth: -2 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "br_psikologi_jalan", category: "pekerjaan", pool: "age", rarity: "uncommon",
    ageMin: 24, ageMax: 26, requireFlag: "jurusan_psikologi", guaranteed: true, mood: "melancholy",
    title: "Kursi di Seberang",
    prompt: "Gelar psikologi di tangan. Orang mengira kamu bisa membaca pikiran. Yang sebenarnya kamu pelajari hanya cara duduk diam, sementara seseorang merangkai ulang dirinya yang berantakan. Tinggal satu hal, di kursi mana kamu mau duduk.",
    choices: [
      { id: "klinis", label: "Praktik. Dengarkan orang yang sedang hancur", outcomes: [
        { weight: 8, text: "Kamu jadi tempat orang menumpahkan hal yang tak bisa mereka katakan ke siapa pun. Kamu sering pulang dengan dada yang berat, tapi sekali waktu ada yang berkata 'saya bertahan karena Anda mendengar.'", effects: { mental: -2, social: 5, happiness: 4 }, addTrait: "empathetic", flag: "psikolog_praktik", extraFlags: ["sudah_lulus"],
          memory: { text: "'Saya bertahan karena Anda mendengar.'", tag: "kerja", mood: "warm" } },
        { weight: 8, text: "Tiap hari kamu menampung luka orang lain, dan menyadari kamu tak pernah punya tempat menumpahkan milikmu. Kamu pandai menambal orang, lukamu sendiri kamu rapikan belakangan. Kalau sempat.", effects: { mental: -5, social: 4 }, flag: "psikolog_praktik", extraFlags: ["sudah_lulus"], mood: "tragic" },
      ]},
      { id: "korporat", label: "Masuk korporat. Pakai ilmunya untuk hal yang lebih aman", outcomes: [
        { weight: 8, flag: "sudah_lulus", text: "Kamu kelola manusia di sebuah kantor. Tes, wawancara, angka keluar-masuk karyawan. Gajinya nyaman, ilmunya terpakai separuh. Sesekali kamu rindu pertanyaan yang lebih dalam dari 'kandidat ini cocok atau tidak'.", effects: { wealth: 5, intelligence: 2, mental: -1 }, mood: "melancholy" },
      ]},
      { id: "riset", label: "Riset. Cari pola di balik kenapa manusia begini", outcomes: [
        { weight: 8, text: "Kamu masuk ke angka, kuesioner, dan jurnal yang dibaca segelintir orang. Tak ada yang sembuh langsung oleh tanganmu, tapi kamu menambah satu paragraf kecil pada cara manusia memahami dirinya. Itu pun warisan.", effects: { intelligence: 5, mental: 2, wealth: -1 }, addTrait: "curious", flag: "psikolog_riset", extraFlags: ["sudah_lulus"], mood: "melancholy" },
        { weight: 8, text: "Bertahun-tahun meneliti, dan kamu makin yakin sebagian manusia tak bisa benar-benar dirumuskan. Kamu belajar berdamai dengan ilmu yang lebih banyak bertanya daripada menjawab.", effects: { intelligence: 4, mental: 3 }, flag: "psikolog_riset", extraFlags: ["sudah_lulus"], mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "br_seni_pameran", category: "sukses_kosong", pool: "age", rarity: "uncommon",
    ageMin: 24, ageMax: 30, requireFlag: "jurusan_seni", mood: "warm",
    title: "Pameran Pertama",
    prompt: (ctx) => {
      const ibuHidup = ctx.state.relationships.some((r) => r.id === "ibu" && r.alive);
      const ayahHidup = ctx.state.relationships.some((r) => r.id === "ayah" && r.alive);
      const hadir = ibuHidup ? "ibumu" : ayahHidup ? "ayahmu" : null;
      if (hadir)
        return `Karyamu dipajang di galeri kecil di gang sempit. Yang datang: ${hadir}, dua teman, dan satu orang asing yang lama berdiri di depan satu lukisan.`;
      return "Karyamu dipajang di galeri kecil di gang sempit. Yang datang: dua teman dan satu orang asing yang lama berdiri di depan satu lukisan. Kursi yang dulu kamu bayangkan untuk orang tuamu, tetap kosong.";
    },
    choices: (ctx) => {
      const ibuHidup = ctx.state.relationships.some((r) => r.id === "ibu" && r.alive);
      const ayahHidup = ctx.state.relationships.some((r) => r.id === "ayah" && r.alive);
      const sapa = { id: "sapa", label: "Sapa orang asing itu", outcomes: [
        { weight: 8, text: "Dia kolektor. Membeli lukisan itu cash. Bukan banyak, tapi cukup untuk menyewa studio sebulan.", effects: { wealth: 8, happiness: 8 }, achievement: "Pertama Kali Dibayar", flag: "seniman_naik" },
        { weight: 8, text: "Dia bilang lukisanmu mengingatkannya pada istrinya yang sudah meninggal. Dia tidak membeli. Tapi kamu tidak akan lupa wajahnya.", effects: { mental: 6, happiness: 4 }, memory: { text: "Orang asing yang lama berdiri di depan lukisanmu.", tag: "pameran", mood: "warm" as const } },
      ]};

      if (ibuHidup)
        return [sapa, { id: "ibu", label: "Peluk ibu", outcomes: [
          { weight: 8, text: "Ibumu, yang dulu diam tiga hari saat kamu pilih jurusan ini, berkata pelan: 'Mama bangga.' Sisanya tidak penting.", effects: { mental: 8, happiness: 8 }, mood: "warm" as const, memory: { text: "'Mama bangga' di pameran pertamamu.", tag: "ibu", mood: "warm" as const } },
          { weight: 8, text: "Ibumu tidak bilang apa-apa. Hanya menggenggam tanganmu terlalu lama di depan satu lukisan, yang kebetulan kamu buat tentang dapur rumah kalian. Kamu mengerti tanpa perlu kata.", effects: { mental: 9, happiness: 6 }, mood: "warm" as const, memory: { text: "Ibumu lama menatap lukisan dapur rumah kalian.", tag: "ibu", mood: "warm" as const } },
        ]}];

      if (ayahHidup)
        return [sapa, { id: "ayah", label: "Peluk ayah", outcomes: [
          { weight: 8, text: "Ayahmu, yang dulu marah saat kamu pilih jurusan ini, berkata pelan: 'Bapak bangga.' Sisanya tidak penting.", effects: { mental: 8, happiness: 8 }, mood: "warm" as const, memory: { text: "'Bapak bangga' di pameran pertamamu.", tag: "ayah", mood: "warm" as const } },
          { weight: 8, text: "Ayahmu tidak bilang apa-apa. Hanya berdiri terlalu lama di depan satu lukisan, yang kebetulan kamu buat tentang teras tempat dia biasa duduk sendiri. Kamu mengerti tanpa perlu kata.", effects: { mental: 9, happiness: 6 }, mood: "warm" as const, memory: { text: "Ayahmu lama menatap lukisan teras tempat dia biasa duduk.", tag: "ayah", mood: "warm" as const } },
        ]}];

      return [sapa, { id: "kenang", label: "Tatap kursi kosong di depan lukisanmu", outcomes: [
        { weight: 8, text: "Di depan lukisanmu sendiri, mereka berdua tiba-tiba hadir di kepalamu. Bukan sebagai hantu, tapi sebagai orang yang dulu diam tiga hari, lalu pelan-pelan luluh. Pameran ini untuk dua kursi yang tidak akan pernah terisi lagi.", effects: { mental: 6, happiness: -3 }, mood: "melancholy" as const, memory: { text: "Pameran pertama yang kamu persembahkan untuk dua kursi yang kosong.", tag: "pameran", mood: "melancholy" as const } },
        { weight: 8, text: "Salah satu lukisan itu kamu buat tentang rumah kalian dulu. Kamu berdiri lama di depannya, dan untuk sekejap kamu hampir mendengar suara mereka di dapur. Lalu galeri sepi lagi.", effects: { mental: 5, happiness: -2 }, mood: "melancholy" as const, memory: { text: "Lukisan rumah lama, tempat kamu hampir mendengar suara mereka lagi.", tag: "pameran", mood: "melancholy" as const } },
      ]}];
    },
  }),

e({
    id: "br_setelah_phk", category: "pekerjaan", pool: "economic", rarity: "common",
    ageMin: 24, ageMax: 35, requireFlag: "phk", companionOnly: true,
    title: "Tiga Bulan Setelahnya",
    prompt: "Tiga bulan setelah PHK. Tabungan menipis. Semua wawancara berakhir di 'kami akan kabari.'",
    choices: (ctx) => {
      const ibuHidup = ctx.state.relationships.some((r) => r.id === "ibu" && r.alive);
      const ayahHidup = ctx.state.relationships.some((r) => r.id === "ayah" && r.alive);

      let wirausaha: Choice;
      if (ctx.state.flags.tinggal_kos && !ctx.state.flags.punya_rumah) {
        wirausaha = { id: "wirausaha", label: "Mulai jualan online dari kamar kos", outcomes: [
          { weight: 8, text: "Kardus stok menumpuk di kamar kos yang sudah sempit. Kamu tidur berdesakan dengan barang dagangan. Tiga bulan sepi. Bulan keempat satu pembeli setia. Bulan keenam jadi lima. Kamu tidak kaya, tapi kamu hidup.", effects: { wealth: 6, happiness: 5, discipline: 4 }, flag: "wirausaha" },
          { weight: 8, text: "Setahun coba, gagal. Modal habis, dan ibu kos menagih sewa yang telat dua bulan. Tapi kamu belajar lebih banyak tentang dirimu daripada 5 tahun di kantor itu.", effects: { wealth: -10, mental: 3 } },
        ]};
      } else if (ctx.state.flags.punya_rumah) {
        wirausaha = { id: "wirausaha", label: "Mulai jualan online dari rumah", outcomes: [
          { weight: 8, text: "Satu sudut rumahmu berubah jadi gudang kecil. Tiga bulan sepi. Bulan keempat satu pembeli setia. Bulan keenam jadi lima. Kamu tidak kaya, tapi untuk pertama kalinya rumah yang kamu cicil itu ikut menafkahimu.", effects: { wealth: 6, happiness: 5, discipline: 4 }, flag: "wirausaha" },
          { weight: 8, text: "Setahun coba, gagal. Modal habis, satu kamar penuh stok yang tak laku. Tapi kamu belajar lebih banyak tentang dirimu daripada 5 tahun di kantor itu.", effects: { wealth: -10, mental: 3 } },
        ]};
      } else {
        wirausaha = { id: "wirausaha", label: "Mulai jualan online dari rumah", outcomes: [
          { weight: 8, text: "Tiga bulan sepi. Bulan keempat satu pembeli setia. Bulan keenam jadi lima. Kamu tidak kaya, tapi kamu hidup.", effects: { wealth: 6, happiness: 5, discipline: 4 }, flag: "wirausaha" },
          { weight: 8, text: "Setahun coba, gagal. Modal habis. Tapi kamu belajar lebih banyak tentang dirimu daripada 5 tahun di kantor itu.", effects: { wealth: -10, mental: 3 } },
        ]};
      }

      let pulang;
      if (ibuHidup && ayahHidup) {
        pulang = { id: "pulang", label: "Pulang ke rumah orangtua", outcomes: [
          { weight: 8, text: "Di rumah, masakan favoritmu tersaji setiap malam selama dua minggu. Tanpa ada yang bertanya kapan kamu kerja lagi.", effects: { mental: 6, wealth: 2, happiness: 4 }, mood: "warm" as const, memory: { text: "Dua minggu masakan rumah yang tidak menanyakan apa-apa.", tag: "keluarga", mood: "warm" as const } },
          { weight: 6, text: "Kamar lamamu masih persis sama, lengkap dengan poster yang sudah memudar. Tidur di sana terasa seperti kekalahan. Tapi juga seperti diampuni.", effects: { mental: 5, happiness: 3 }, mood: "melancholy" as const },
        ]};
      } else if (ibuHidup) {
        pulang = { id: "pulang", label: "Pulang ke rumah orangtua", outcomes: [
          { weight: 8, text: "Ibu memasak makanan favoritmu selama dua minggu, porsi yang cukup untuk dua orang meski mejanya terasa lebih lengang. Tanpa sekali pun bertanya kapan kamu kerja lagi.", effects: { mental: 6, wealth: 2, happiness: 4 }, mood: "warm" as const, memory: { text: "Dua minggu masakan ibu, di meja yang kini lebih sepi.", tag: "ibu", mood: "warm" as const } },
          { weight: 8, text: "Kamar lamamu masih persis sama. Tapi kursi ayah di ruang depan kini kosong, dan rumah jadi lebih sunyi dari yang kamu ingat. Tidur di sana terasa seperti kekalahan, juga seperti diampuni.", effects: { mental: 5, happiness: 3 }, mood: "melancholy" as const },
        ]};
      } else if (ayahHidup) {
        pulang = { id: "pulang", label: "Pulang ke rumah orangtua", outcomes: [
          { weight: 8, text: "Ayah tidak pandai memasak, jadi kalian makan seadanya berdua di meja yang dulu selalu penuh. Dia tidak bertanya kapan kamu kerja lagi, mungkin karena dia pun masih belajar menata hari tanpa ibumu.", effects: { mental: 4, wealth: 2, happiness: 2 }, mood: "melancholy" as const, memory: { text: "Makan seadanya berdua ayah, di rumah yang kehilangan juru masaknya.", tag: "ayah", mood: "melancholy" as const } },
          { weight: 8, text: "Kamar lamamu masih persis sama, lengkap dengan poster yang memudar. Tapi dapur sudah lama tak berbau masakan ibu. Tidur di rumah ini terasa seperti kekalahan, juga seperti diampuni.", effects: { mental: 5, happiness: 3 }, mood: "melancholy" as const },
        ]};
      } else {
        pulang = { id: "pulang", label: "Pulang ke rumah orangtua", outcomes: [
          { weight: 8, text: "Rumah itu masih berdiri, tapi tidak ada yang menyambut. Kamu membuka pintu dengan kunci yang dulu kamu pikir tak akan pernah kamu pegang sendiri. Masakan favoritmu kini hanya ada di ingatan.", effects: { mental: 1, wealth: 2, happiness: -2 }, mood: "tragic" as const, memory: { text: "Pulang ke rumah yang masih berdiri, tapi tak ada lagi yang menyambut.", tag: "kehilangan", mood: "tragic" as const } },
          { weight: 8, text: "Kamar lamamu masih persis sama, hanya rumahnya yang kini terlalu sepi. Tidur di sana terasa seperti pulang ke sesuatu yang sudah tidak ada. Pulang, pada akhirnya, hanya nama untuk tempat yang kamu tinggali.", effects: { mental: 2, happiness: -1 }, mood: "melancholy" as const },
        ]};
      }

      return [
      { id: "turun_gaji", label: "Terima tawaran gaji 40% lebih rendah", outcomes: [
        { weight: 8, text: "Kamu mulai dari bawah lagi. Egomu remuk perlahan. Tapi kamu masih di sini, dan belum kalah.", effects: { wealth: 5, mental: -3, discipline: 3 }, flag: "comeback_kerja" },
        { weight: 8, text: "Jabatan yang dulu kamu lewati, gaji yang dulu kamu tertawakan. Yang mengejutkan: bos barumu sepuluh tahun lebih muda dan ternyata lebih baik. Egomu sembuh lebih dulu dari dompetmu.", effects: { wealth: 5, mental: 1, social: 3 }, flag: "comeback_kerja" },
      ]},
      wirausaha,
      pulang,
      ];
    },
  }),

e({
    id: "br_patah_hati_echo", category: "cinta", pool: "relationship", rarity: "uncommon",
    ageMin: 25, ageMax: 30, requireFlag: "patah_hati_pertama", deferrable: true, mood: "melancholy",
    forceCallbackTag: "cinta_pertama",
    title: "Refleks Lama",
    prompt: "Ada lagi seseorang yang membuat dadamu berdebar. Tapi sebelum kamu sempat senang, tubuhmu sudah waspada lebih dulu. Bertahun lalu sepucuk surat pernah dibacakan keras-keras di depan kelas, dan sebagian dari dirimu tidak pernah ikhlas.",
    choices: [
      { id: "coba_lagi", label: "Beranikan diri, kali ini dengan lebih pelan", outcomes: [
        { weight: 8, text: "Kamu hanya bertanya kabar, lalu mendengarkan. Ternyata mendekat tidak harus selalu diteriakkan.", effects: { happiness: 6, social: 4, mental: 3 }, removeTrait: "nihilistic", mood: "warm",
          memory: { text: "Pertama kali kamu mendekat lagi setelah surat itu.", tag: "cinta_pertama", mood: "warm" } },
        { weight: 8, text: "Kamu mencoba, dan canggung setengah mati. Dia tidak menertawakanmu, hanya tersenyum dan melanjutkan obrolan. Luka lamamu tidak sembuh malam itu, tapi kamu tahu sekarang ia bisa sembuh.", effects: { happiness: 3, mental: 4 }, mood: "melancholy" },
      ]},
      { id: "jaga_jarak", label: "Simpan rapat-rapat, seperti yang dulu kamu pelajari", outcomes: [
        { weight: 8, text: "Kamu menyibukkan diri sampai perasaan itu reda sendiri. Aman. Tapi 'aman' punya harga yang baru kamu hitung bertahun kemudian.", effects: { mental: -2, intelligence: 2 }, mood: "melancholy",
          memory: { text: "Perasaan yang kamu padamkan sebelum sempat menyala.", tag: "cinta_pertama", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "br_terapi", category: "eksistensial", pool: "age", rarity: "uncommon",
    ageMin: 25, ageMax: 35, requireFlag: "self_loathing", mood: "warm",
    title: "Kursi Empuk, Pertama Kali",
    prompt: "Setelah bertahun-tahun memaki diri sendiri di cermin, kamu duduk di kursi empuk seorang terapis. Dia bertanya: 'Kapan terakhir kamu berbaik hati pada dirimu sendiri?'",
    choices: [
      { id: "menangis", label: "Menangis tanpa menjawab", outcomes: [
        { weight: 8, text: "Pertanyaan itu menjawab dirinya sendiri. Sesi pertama dari 47 sesi. Hidupmu pelan-pelan berbelok.", effects: { mental: 12, happiness: 6 }, removeTrait: "nihilistic", flag: "terapi", achievement: "Pulang ke Diri Sendiri" },
        { weight: 8, text: "Air mata itu mengejutkanmu. Terapis itu hanya mengangguk, seolah tahu ini akan datang. Jalan pulihmu tidak lurus, ada sesi yang terasa sia-sia, tapi arahnya benar.", effects: { mental: 10, happiness: 4 }, removeTrait: "nihilistic", flag: "terapi" },
      ]},
      { id: "bohong", label: "'Saya baik-baik saja'", outcomes: [
        { weight: 8, text: "Kamu pulang dari sesi itu dan tidak pernah kembali. Lima tahun lagi kamu akan menyesalinya.", effects: { mental: -2 } },
        { weight: 8, text: "Dia menatapmu sebentar, lalu menulis sesuatu. Kalimat itu terus terngiang, dan dua tahun kemudian mungkin kamu akan kembali.", effects: { mental: -1, happiness: -1 }, flag: "terapi_ragu", setAgeFlag: "terapi_bohong_age" },
      ]},
    ],
  }),

e({
    id: "br_teknik_burnout", category: "pekerjaan", pool: "age", rarity: "common",
    ageMin: 27, ageMax: 32, requireFlag: "jurusan_teknik", title: "Standup Meeting",
    prompt: "Standup ke-740 dalam tiga tahun. Kamu mendengar dirimu berkata 'no blockers' otomatis, padahal segala sesuatu adalah blocker.",
    choices: [
      { id: "jujur", label: "Untuk pertama kali, bilang jujur kamu tidak baik-baik saja", outcomes: [
        { weight: 7, text: "Hening 4 detik di Zoom. Lalu PM-mu bilang 'mari ngobrol berdua setelah ini.' Itu obrolan terbaik selama bertahun-tahun.", effects: { mental: 6, social: 4 }, flag: "teknik_burnout_pulih" },
        { weight: 7, text: "Hening, lalu satu rekan menulis di chat: 'aku juga.' Lalu yang lain. Ternyata kalian semua diam-diam tenggelam di kapal yang sama.", effects: { mental: 5, social: 6 }, flag: "teknik_burnout_pulih", mood: "warm" },
        { weight: 8, text: "Atasanmu mematikan kamera. 'Kalau tidak sanggup, jangan dibawa ke standup.' Ternyata yang dia takuti bukan kamu jatuh, tapi sprint yang meleset. Kamu belajar di tempat yang salah, kejujuran cuma celah lain untuk dinilai.", effects: { mental: -7, social: -3 }, flag: "teknik_burnout", mood: "tragic" },
      ]},
      { id: "tetap", label: "'No blockers'. Lanjut.", outcomes: [
        { weight: 8, text: "Kamu menua satu tahun dalam dua bulan. Tubuhmu mulai mengirim sinyal halus.", effects: { mental: -6, health: -4 }, flag: "teknik_burnout" },
        { weight: 8, text: "'No blockers.' Otomatis. Tapi malam itu kamu menatap layar laptop yang sudah beberapa saat mati dan tidak ingat kapan terakhir kali kamu menutupnya dengan lega.", effects: { mental: -7, health: -5, discipline: 2 }, flag: "teknik_burnout", mood: "tragic" },
      ]},
      { id: "resign", label: "Resign hari itu juga", outcomes: [
        { weight: 8, text: "Tidak ada rencana. Hanya tahu: ini bukan tempatnya. Tabungan cukup untuk 4 bulan rasa bingung.", effects: { wealth: -8, mental: 5, happiness: 5 }, flag: "resigner" },
        { weight: 4, text: "Kamu kosongkan meja dalam sepuluh menit. Di lift, tanganmu gemetar. Bukan takut, tapi lega yang belum kamu percaya. Empat bulan bingung itu ternyata jadi empat bulan paling jujur.", effects: { wealth: -8, mental: 8, happiness: 4 }, flag: "resigner" },
      ]},
    ],
  }),

e({
    id: "br_dokter_kerja", category: "pekerjaan", pool: "age", rarity: "common",
    // requireFlag dokter_jadi (di-set oleh br_dokter_koas), bukan sekadar jurusan_kedokteran,
    // agar event ini mustahil muncul sebelum koas dialami.
    ageMin: 27, ageMax: 32, requireFlag: "dokter_jadi", mood: "melancholy",
    title: "Tahun-tahun di Bangsal",
    prompt: "Beberapa tahun sejak koas. Kamu mengenali bau lorong rumah sakit lebih baik daripada bau rumahmu sendiri. Atasan bilang, dengan nada yang seharusnya menghibur: 'Anggap saja kita ini satu keluarga besar di sini.'",
    choices: [
      { id: "abdi", label: "Beri semuanya untuk rumah sakit ini", outcomes: [
        { weight: 8, text: "Kamu ambil setiap jaga tambahan, setiap shift yang ditinggalkan orang lain. Pasien terlayani. Tapi sebagian hidupmu pelan-pelan pindah jadi milik bangsal itu.", effects: { wealth: 4, mental: -5, happiness: -3 }, flag: "loyal_pegawai" },
        { weight: 8, text: "Dedikasimu dilihat. Suatu hari namamu ada di pintu sebuah ruangan sendiri. Kepala bagian termuda yang pernah ada di sana. Gelar itu terasa berat dan ringan pada saat bersamaan.", effects: { wealth: 9, social: 4, mental: -4, health: -3 }, flag: "loyal_pegawai", achievement: "Diberikan pada Bangsal" },
        { weight: 8, text: "Tubuhmu menagih lebih awal dari semestinya. Suatu pagi kamu pingsan di lorong yang kamu hafal baunya. Mereka memberimu cuti seminggu, dan melupakan sebabnya.", effects: { wealth: 3, health: -8, mental: -6 }, flag: "loyal_pegawai", mood: "tragic" },
      ]},
      { id: "batas", label: "Tetapkan batas. Pulang saat jadwalmu habis", outcomes: [
        { weight: 8, text: "Beberapa senior memandangmu seolah kamu kurang berdedikasi. Tapi kamu masih ingat wajah keluargamu, dan itu kamu hitung sebagai kemenangan.", effects: { mental: 5, social: -2, health: 2 } },
        { weight: 8, text: "Awalnya canggung menolak. Lama-lama ada satu-dua rekan muda diam-diam menirumu. Batas itu menular, pelan, seperti kabar baik yang malu-malu.", effects: { mental: 6, social: 3, health: 3 }, mood: "warm" },
      ]},
      { id: "klinik", label: "Keluar, buka praktik kecil sendiri", outcomes: [
        { weight: 8, text: "Ruang tunggu sempit, papan nama sederhana. Penghasilannya tidak pasti di tahun pertama, tapi untuk pertama kalinya kamu memutuskan ritme harimu sendiri.", effects: { wealth: -3, happiness: 5, mental: 3 }, flag: "praktik_sendiri" },
        { weight: 8, text: "Lima tahun kemudian, kliniknya jadi tempat yang dikenal sekelurahan. Orang datang bukan hanya untuk diperiksa, tapi untuk didengar.", effects: { wealth: 8, happiness: 6, social: 4 }, flag: "praktik_sendiri", achievement: "Dokter Kampung" },
        { weight: 8, text: "Tahun-tahun pertama nyaris menenggelamkanmu. Sewa, listrik, pasien yang membayar dengan telur dan terima kasih. Kamu bertahan karena tidak tahu harus ke mana lagi, dan ternyata itu cukup.", effects: { wealth: -6, mental: 2, happiness: 2 }, flag: "praktik_sendiri" },
      ]},
    ],
  }),

e({
    id: "br_terapi_kembali", category: "eksistensial", pool: "age", rarity: "uncommon",
    ageMin: 27, ageMax: 37, requireFlag: "terapi_ragu", guaranteed: true,
    requireFlagAge: { flag: "terapi_bohong_age", min: 2, max: 2 }, mood: "melancholy",
    title: "Kursi yang Sama, Dua Tahun Kemudian",
    prompt: "Kalimat yang ditulis terapis itu tak pernah benar-benar berhenti terngiang. Suatu pagi kamu mendapati dirimu menekan bel klinik yang sama. Kali ini tanpa lebih dulu menyiapkan 'saya baik-baik saja'.",
    choices: [
      { id: "jujur", label: "Ulang kalimat yang dulu kamu telan", outcomes: [
        { weight: 8, text: "Kamu ucapkan apa yang dua tahun lalu kamu tukar dengan kebohongan. Kali ini kamu datang lagi minggu depan, dan minggu setelahnya.", effects: { mental: 11, happiness: 5 }, removeTrait: "nihilistic", flag: "terapi", mood: "warm", achievement: "Kembali ke Kursi Itu", memory: { text: "Kursi empuk yang akhirnya kamu datangi lagi, dua tahun terlambat.", tag: "waktu", mood: "warm" } },
        { weight: 8, text: "Tidak semuanya langsung membaik. Ada minggu-minggu kamu ingin berhenti lagi seperti dulu. Bedanya, sekarang kamu tahu arahnya sudah benar.", effects: { mental: 8, happiness: 3 }, removeTrait: "nihilistic", flag: "terapi" },
      ]},
      { id: "pelan", label: "'Saya... tidak tahu harus mulai dari mana'", outcomes: [
        { weight: 8, text: "Terapis itu mengangguk, seolah itu jawaban paling jujur yang bisa dia harap. Kalian mulai dari diam. Pelan, tapi kali ini kamu tidak pulang lalu menghilang.", effects: { mental: 9, happiness: 3 }, flag: "terapi", mood: "warm" },
        { weight: 8, text: "Mengaku bahwa kamu tersesat ternyata sudah setengah jalannya. Kamu pulang dengan lelah yang aneh, bukan lelah yang kosong.", effects: { mental: 7, happiness: 2 }, flag: "terapi", mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "br_mlm_lanjutan", category: "pekerjaan", pool: "economic", rarity: "uncommon",
    ageMin: 27, ageMax: 42, requireFlag: "korban_mlm", title: "Kit Produk di Pojok Kamar",
    prompt: "Kotak produk MLM itu masih utuh di pojok kamar. Andi sudah hilang. Utang Rp 5 juta belum lunas.",
    choices: (ctx) => [
      { id: "jual_rugi", label: "Jual rugi di marketplace", outcomes: [
        { weight: 8, text: `Laku 1.2 juta. Kamu menulis di catatan: 'pelajaran termahal usia ${ctx.state.age}.' Lalu lupakan.`, effects: { wealth: -4, mental: 4 } },
        { weight: 8, text: "Tidak ada yang beli berbulan-bulan. Akhirnya kamu bagikan cuma-cuma ke tetangga. Rugi total, tapi anehnya beban di dadamu ikut hilang bersama kardus itu.", effects: { wealth: -5, mental: 5 } },
      ]},
      { id: "pakai", label: "Pakai sendiri saja", outcomes: [
        { weight: 8, text: "Vitaminnya kamu minum 3 hari, lalu lupa. Sabunnya kamu pakai sampai habis. Krim wajahnya kamu kasih sepupu.", effects: { mental: 2, happiness: 1 } },
        { weight: 8, text: "Krim wajahnya ternyata cocok. Selama setahun kamu punya rutinitas kecil yang lumayan. Penipuan yang menyisakan satu hal berguna. Lucu juga.", effects: { happiness: 2, health: 1 } },
      ]},
      { id: "balas", label: "Cari Andi, minta tanggung jawab", outcomes: [
        { weight: 8, text: "Nomornya tidak aktif. Akun sosialnya hilang. Kamu menghela napas, lalu membiarkannya.", effects: { mental: -3 } },
        { weight: 8, text: "Kamu temukan akun barunya. Nama lain, foto lain, janji yang sama persis ke orang-orang baru. Kamu screenshot, report, lalu menutup ponsel. Setidaknya bukan cuma kamu yang akan tahu.", effects: { mental: -1, social: 1 } },
      ]},
    ],
  }),

e({
    id: "br_freelance_sepi", category: "pekerjaan", pool: "economic", rarity: "uncommon",
    ageMin: 28, ageMax: 35, requireFlag: "freelancer", deferrable: true, mood: "melancholy",
    title: "Bulan yang Tidak Pernah Sama",
    prompt: "Bulan ini tiga proyek menumpuk sekaligus. Bulan depan mungkin kosong total. Tidak ada yang menanyakan kabarmu saat kamu sakit, tidak ada slip gaji yang pasti. Hanya kamu, laptop, dan deadline yang tidak peduli kamu lelah.",
    choices: (ctx) => {
      const ibuHidup = ctx.state.relationships.some((r) => r.id === "ibu" && r.alive);
      return [
        { id: "balik_kantor", label: "Cukup. Lamar kerja kantoran lagi", outcomes: [
          { weight: 8, text: "Kamu kembali ke meja, ke gaji yang masuk tiap tanggal yang sama. Lega, dan sedikit kalah. Kebebasan ternyata barang yang gampang dijual saat lapar.", effects: { wealth: 7, mental: 2, happiness: -2 }, flag: "comeback_kerja", mood: "melancholy" as const },
          { weight: 8, text: "Kamu kirim lamaran ke mana-mana. Yang membalas menanyakan 'kenapa ada jeda di CV-mu' seolah hidup harus selalu berisi. Kamu menyerah melamar.", effects: { mental: 1, wealth: -2 } },
        ]},
        { id: "bertahan", label: "Bertahan. Kebebasan ini mahal, tapi milikmu", outcomes: [
          { weight: 8, text: "Kamu belajar menyisihkan saat ramai untuk menambal saat sepi. Hidupmu tidak rapi, tapi tidak ada yang menyuruhmu datang pagi. Itu kamu hitung sebagai untung.", effects: { discipline: 5, mental: 3, wealth: 1 }, addTrait: "ambitious",
            memory: { text: "Tahun-tahun kerja lepas, ramai dan sepi yang silih berganti.", tag: "bebas", mood: "melancholy" as const } },
          { weight: 8, text: ibuHidup
              ? "Satu bulan benar-benar kosong. Kamu makan seadanya, tapi sempat mengantar ibu ke pasar di hari kerja. Hal yang dulu mustahil. Miskin di satu hal, kaya di hal lain."
              : "Satu bulan benar-benar kosong. Kamu makan seadanya, tapi sempat menengok makam ibu di hari kerja, saat di pemakaman hanya ada kamu. Hal yang dulu tak pernah sempat. Miskin di satu hal, kaya di hal lain.", effects: { wealth: -4, happiness: 4, mental: 2 }, mood: "warm" as const },
        ]},
      ];
    },
  }),

e({
    id: "br_freelance_jalan", category: "sukses_kosong", pool: "economic", rarity: "uncommon",
    ageMin: 28, ageMax: 44, requireFlag: "freelancer_sukses", deferrable: true, mood: "melancholy",
    title: "Lima Klien, Nol Rekan",
    prompt: "Lima klien tetap, penghasilan yang dulu kamu ragu bisa kamu capai sendiri. Makan siang selalu di depan layar yang sama. Dan saat satu proyek besar akhirnya kelar, tidak ada yang menoleh untuk ikut senang.",
    choices: [
      { id: "jaringan", label: "Ajak freelancer lain berkolaborasi", outcomes: [
        { weight: 8, text: "Kalian patungan sewa satu ruangan kerja kecil. Bukan kantor, hanya beberapa meja dan kopi yang sama-sama buruk. Tapi ada yang menyapa saat kamu datang, dan itu cukup mengubah banyak hal.", effects: { social: 6, happiness: 5, wealth: 2 }, mood: "warm",
          addsRelationship: { name: "Rekan Seruangan", role: "friend", closeness: 45, alive: true } },
        { weight: 8, text: "Beberapa kolaborasi jalan, beberapa berantakan soal uang. Kamu belajar mana orang yang bisa dibawa untuk kerja, mana yang hanya untuk ditemani. Dua kategori yang ternyata jarang berhimpit.", effects: { social: 3, intelligence: 2, mental: 1 } },
      ]},
      { id: "sunyi", label: "Nikmati saja sunyinya", outcomes: [
        { weight: 8, text: "Kamu atur sendiri kapan mulai, kapan berhenti, kapan tidak melakukan apa-apa. Sunyi itu kadang berat menjelang malam. Tapi kamu tidak pernah ingin menukarnya.", effects: { mental: 4, happiness: 3, wealth: 2 },
          memory: { text: "Sukses yang kamu rayakan sendirian, di depan layar yang sama.", tag: "kesepian", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "br_pkl_kerajinan", category: "pekerjaan", pool: "economic", rarity: "uncommon",
    ageMin: 29, ageMax: 35, requireFlag: "pedagang_kaki_lima", deferrable: true, mood: "melancholy",
    title: "Trotoar yang Hafal Namamu",
    prompt: "Beberapa tahun di gerobak yang dulu kamu malu mendorongnya. Sekarang pelanggan datang bukan cuma untuk dagangan, tapi karena kamu. Kamu hafal jam mereka lewat, mereka hafal harga yang tak pernah diam-diam kamu naikkan.",
    choices: [
      { id: "naik", label: "Kumpulkan modal, buka warung tetap", outcomes: [
        { weight: 8, text: "Dari gerobak ke kios kecil beratap. Tak perlu lagi menganggap hujan sebagai musuh. Kamu pandangi papan nama sederhana itu, milik orang yang dulu tak punya apa-apa selain berani menanggung malu.", effects: { wealth: 5, happiness: 6, discipline: 4 }, flag: "wirausaha", extraFlags: ["pkl_toko"],
          memory: { text: "Papan nama warung pertamamu, setelah bertahun-tahun mendorong gerobak.", tag: "bebas", mood: "warm" } },
        { weight: 6, text: "Kamu buka warung tetap, tapi ramainya tak sebesar harapan. Tetap saja, malammu tak lagi habis untuk memikirkan ke mana harus mendorong gerobak besok. Sedikit lebih tenang.", effects: { wealth: 2, happiness: 4, mental: 3 }, flag: "wirausaha", extraFlags: ["pkl_toko"], mood: "melancholy" },
      ]},
      { id: "bertahan", label: "Tetap di trotoar, di sinilah tempatmu", outcomes: [
        { weight: 8, text: "Kamu tak mau atap dan sewa yang mengikat. Hidupmu kamu ukur bukan dari besarnya tempat, tapi dari pelanggan yang menanyakanmu kalau kamu absen sehari.", effects: { social: 5, happiness: 4, discipline: 2 }, extraFlags: ["pkl_jalan"],
          memory: { text: "Pelanggan yang menanyakanmu saat sehari kamu tak mendorong gerobak.", tag: "kerja", mood: "warm" } },
      ]},
      { id: "berhenti", label: "Cukup. Cari kerja yang lebih pasti", outcomes: [
        { weight: 6, text: "Kamu titipkan gerobak ke orang lain dan masuk kerja bergaji tetap. Lebih aman, lebih sepi. Sesekali kamu lewat trotoar lamamu, melihat orang lain berdiri di tempatmu dulu. Ada yang ngilu, kecil, di dada.", effects: { wealth: 5, mental: -1, happiness: -1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "br_barista_kerajinan", category: "pekerjaan", pool: "economic", rarity: "uncommon",
    ageMin: 30, ageMax: 34, requireFlag: "barista", deferrable: true, mood: "melancholy",
    title: "Pekerjaan yang Katanya Sementara",
    prompt: "Beberapa tahun bertahan di pekerjaan yang dulu kamu sebut 'sementara'. Tanganmu hafal takaran tanpa timbangan, pelanggan tetap memanggil namamu. Sesuatu yang sederhana, diam-diam, sudah jadi milikmu.",
    choices: [
      { id: "kedai", label: "Buka kedai kecil sendiri", outcomes: [
        { weight: 8, text: "Sewa tempat sempit, satu mesin bekas, namamu di papan yang kamu cat sendiri. Tahun pertama menakutkan. Tapi tiap pagi kamu membuka pintu di tempat yang benar-benar milikmu.", effects: { wealth: 4, happiness: 6, discipline: 4 }, flag: "wirausaha", extraFlags: ["barista_jalan"],
          memory: { text: "Pagi pertama membuka pintu kedai yang namanya kamu cat sendiri.", tag: "bebas", mood: "warm" } },
        { weight: 6, text: "Kedaimu tidak pernah ramai betul, tapi punya beberapa pelanggan yang datang justru karena sepi. Kamu tidak kaya, tapi kamu memutuskan sendiri jam berapa kopi pertama diseduh.", effects: { wealth: 1, happiness: 5, mental: 3 }, flag: "wirausaha", extraFlags: ["barista_jalan"], mood: "melancholy" },
      ]},
      { id: "jiwa", label: "Tetap bertahan", outcomes: [
        { weight: 8, text: "Tempat ini tidak sama tanpamu. Pemiliknya berganti dua kali, kamu yang tetap. Ada yang mengukur hidup dengan jabatan, kamu mengukurnya dengan wajah yang kamu hafal.", effects: { social: 5, happiness: 4, mental: 2 }, extraFlags: ["barista_jalan"],
          memory: { text: "Jadi satu hal yang tidak terganti di tempat yang pemiliknya berganti-ganti.", tag: "kerja", mood: "warm" } },
      ]},
      { id: "keluar", label: "Cukup. Cari kerja yang 'benar'", outcomes: [
        { weight: 6, text: "Kamu gantung celemek dan masuk ke kantor ber-AC. Gajinya lebih pasti. Tapi sesekali, di antrean kopi, tanganmu gatal ingin membetulkan cara barista muda itu memadatkan kopi.", effects: { wealth: 5, mental: -1, happiness: -1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "br_sahabat_bolos_dewasa", category: "pertemanan", pool: "callback", rarity: "uncommon",
    ageMin: 32, ageMax: 45, requireRelationship: "sahabat_bolos", mood: "warm",
    forceCallbackTag: "sahabat_bolos",
    title: "Pesan dari Sahabat SD",
    prompt: "Sahabat bolosmu dulu, sekarang tinggal di kota lain, mengirim foto: lapangan kosong yang dulu kalian datangi sore itu. 'Masih ingat?'",
    choices: [
      { id: "datang", label: "Naik kereta minggu depan, datangi lapangan itu bersama", outcomes: [
        { weight: 8, text: "Lapangan jauh lebih kecil dari yang kamu ingat. Tapi tawamu sama besarnya.", effects: { social: 6, happiness: 8, mental: 6 }, mood: "warm", memory: { text: "Reuni di lapangan kosong masa kecil.", tag: "sahabat_bolos", mood: "warm" } },
        { weight: 8, text: "Lapangan itu sudah jadi ruko. Kalian berdiri di parkiran yang dulunya garis tengah, dan tertawa getir. Yang kalian datangi ternyata bukan tempat, tapi satu sama lain.", effects: { social: 6, happiness: 6, mental: 4 }, mood: "melancholy", memory: { text: "Lapangan masa kecil yang kini jadi ruko.", tag: "sahabat_bolos", mood: "melancholy" } },
      ]},
      { id: "balas", label: "'Ingat banget. Ayo kita ke sana.'", outcomes: [
        { weight: 8, text: "Janji yang tulus, tapi tidak tertepati. Kalian sama-sama tahu, dan itu tidak apa-apa.", effects: { mental: 3 } },
        { weight: 8, text: "Kalian mengobrol sampai larut malam itu, lalu pelan-pelan kembali ke diam yang nyaman. Persahabatan yang tidak butuh sering bertemu untuk tetap ada.", effects: { mental: 4, social: 2 }, mood: "warm" },
      ]},
    ],
  }),

e({
    id: "br_psikologi_praktik", category: "pekerjaan", pool: "age", rarity: "uncommon",
    ageMin: 34, ageMax: 50, requireFlag: "psikolog_praktik", deferrable: true, mood: "melancholy",
    title: "Ruang yang Tak Pernah Lama Sepi",
    prompt: "Bertahun-tahun kursi di seberangmu jarang kosong lama. Kamu hafal cara orang menahan tangis sebelum akhirnya menyerah pada tangis itu. Pekerjaan ini sudah jadi seluruh isi harimu, dan kamu mesti memutuskan mau membawanya ke mana.",
    choices: [
      { id: "praktik_sendiri", label: "Buka praktik sendiri", outcomes: [
        { weight: 8, text: "Satu ruang kecil, dua kursi, dan jam yang kamu tentukan sendiri. Tak ada lagi atasan yang mengukurmu dari jumlah pasien per hari. Sekarang orang datang karena namamu.", effects: { wealth: 4, happiness: 4, discipline: 3, mental: -1 }, flag: "wirausaha",
          memory: { text: "Membuka pintu ruang praktik yang akhirnya benar-benar milikmu.", tag: "bebas", mood: "warm" } },
        { weight: 8, text: "Praktikmu jalan, tapi tiap kursi yang terisi berarti satu beban lagi yang ikut pulang ke rumahmu.", effects: { wealth: 3, mental: -4, social: 3 }, mood: "melancholy" },
      ]},
      { id: "satu_hilang", label: "Lanjutkan saja", outcomes: [
        { weight: 8, text: "Dari ratusan yang pulih, satu tidak. Kamu ulang percakapan terakhir kalian berkali-kali, mencari kalimat yang seharusnya kamu ucapkan. Dengan pahit kamu belajar bahwa mendengar pun bisa punya kesalahan.", effects: { mental: -6, happiness: -2 }, mood: "tragic",
          memory: { text: "Satu yang tak sempat kamu tahan, dan percakapan terakhir yang kamu ulang terus.", tag: "luka", mood: "melancholy" } },
      ]},
      { id: "didik", label: "Didik calon psikolog", outcomes: [
        { weight: 8, text: "Kamu ajari yang muda hal yang tak ada di buku: kapan diam lebih menyembuhkan daripada nasihat. Sebagian beban kini berpindah ke tangan-tangan baru.", effects: { social: 4, happiness: 4, mental: 2, intelligence: 2 }, mood: "warm",
          memory: { text: "Mengajari yang muda kapan diam lebih menyembuhkan daripada nasihat.", tag: "kerja", mood: "warm" } },
      ]},
    ],
  }),

e({
    id: "br_psikologi_riset", category: "pekerjaan", pool: "age", rarity: "uncommon",
    ageMin: 34, ageMax: 50, requireFlag: "psikolog_riset", deferrable: true, mood: "melancholy",
    title: "Di Balik Angka, Manusia",
    prompt: "Bertahun-tahun kamu mengejar pola yang orang lain tak sempat lihat. Tak ada yang pulih di depan matamu, hanya data yang pelan-pelan membentuk satu kalimat yang lebih jujur, 'untuk apa, dan untuk siapa semua ini?'",
    choices: [
      { id: "kejar", label: "Kejar temuan besar, buktikan namamu layak dikenang", outcomes: [
        { weight: 8, text: "Satu temuan akhirnya tembus, dikutip banyak orang yang tak pernah kamu temui. Namamu kecil di pojok jurnal. Untuk sesuatu yang tak kasat mata, kamu menancapkan satu paku.", effects: { intelligence: 5, wealth: 2, happiness: 3 }, mood: "melancholy",
          memory: { text: "Temuanmu dikutip orang yang tak pernah kamu temui.", tag: "kerja", mood: "warm" } },
        { weight: 8, text: "Bertahun-tahun mengejar satu hasil yang tak pernah benar-benar terbukti. Kamu bakar usia untuk pertanyaan yang ternyata salah diajukan sejak awal.", effects: { intelligence: 3, mental: -4, wealth: -1 }, mood: "tragic" },
      ]},
      { id: "ajar", label: "Mengajar, tanam pertanyaan di kepala yang lebih muda", outcomes: [
        { weight: 8, text: "Risetmu mungkin terlupakan, tapi mahasiswa yang kamu ajari membawa caramu bertanya ke tempat yang tak bisa kamu jangkau. Warisanmu bukan kertas, tapi kepala-kepala yang belajar ragu pada hal yang dikira sudah pasti.", effects: { social: 4, intelligence: 3, happiness: 4 }, mood: "warm",
          memory: { text: "Mahasiswa yang membawa caramu bertanya ke tempat yang tak bisa kamu jangkau.", tag: "kerja", mood: "warm" } },
      ]},
      { id: "terapan", label: "Bawa risetmu turun ke orang sungguhan", outcomes: [
        { weight: 8, text: "Kamu bosan menulis untuk segelintir orang. Temuanmu kamu bawa ke ruang yang nyata: pelatihan, kebijakan, program yang menyentuh orang yang tak pernah buka jurnal. Lebih lambat, lebih berisik, tapi terasa sampai.", effects: { intelligence: 3, social: 4, happiness: 3, wealth: 1 }, mood: "melancholy",
          memory: { text: "Membawa temuanmu turun ke orang yang tak pernah buka jurnal.", tag: "kerja", mood: "warm" } },
      ]},
    ],
  }),

e({
    id: "br_robot_anakmu", category: "keluarga", pool: "callback", rarity: "uncommon",
    ageMin: 35, ageMax: 50, requireFlag: "robot_kecil", requireRelationship: "anak1", mood: "warm",
    forceCallbackTag: "robot_kecil",
    title: "Tangan yang Lebih Kecil",
    prompt: "Saat membersihkan gudang, kamu menemukan robot mainan kecil yang dulu entah datang dari mana. Anakmu mengambilnya dari tanganmu, matanya berbinar.",
    choices: [
      { id: "berikan", label: "Berikan padanya. Ceritakan kisahnya.", outcomes: [
        { weight: 8, text: "Dia memeluk robot itu seperti kamu dulu. Sebuah lingkaran kecil dalam hidup yang menutup tanpa upacara.", effects: { mental: 8, happiness: 8 }, mood: "warm", memory: { text: "Anakmu memeluk robot kecil yang sama.", tag: "robot_kecil", mood: "warm" }, achievement: "Estafet Tanpa Nama" },
        { weight: 8, text: "Kamu ceritakan asal-usulnya, yang sebenarnya kamu sendiri tidak tahu. Anakmu mendengar dengan serius, lalu memberi robot itu nama.", effects: { mental: 7, happiness: 7 }, mood: "warm", memory: { text: "Anakmu memberi nama pada robot kecil itu.", tag: "robot_kecil", mood: "warm" } },
      ]},
      { id: "simpan", label: "Simpan kembali. Belum waktunya.", outcomes: [
        { weight: 8, text: "Kamu menaruhnya di kotak khusus. 'Suatu hari nanti.' Gumammu.", effects: { mental: 3 } },
        { weight: 8, text: "Kamu taruh kembali. Tapi malam itu, kamu sendiri yang memegangnya sebelum tidur. Ada hal-hal yang kita simpan bukan untuk diberikan, tapi untuk diingat.", effects: { mental: 4, happiness: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "br_barista_warisan", category: "pekerjaan", pool: "economic", rarity: "uncommon",
    ageMin: 54, ageMax: 74, requireFlag: "barista_jalan", deferrable: true, mood: "melancholy",
    title: "Pelanggan yang Ikut Menua",
    prompt: "Wajah-wajah yang dulu datang muda, sekarang datang pelan-pelan Dengan tongkat, dengan cucu, atau tidak datang lagi. Seorang anak baru, secanggung dirimu dulu, salah grinding kopi di belakang meja. Kopinya sama, tahunnya yang berbeda.",
    choices: [
      { id: "ajari", label: "Ajari dia, seperti dulu kamu diajari", outcomes: [
        { weight: 8, text: "Kamu tunjukkan caranya tanpa banyak kata, persis seperti yang dulu kamu terima dari seseorang yang sudah lama pergi. Sesuatu yang kecil diteruskan.", effects: { social: 5, happiness: 5, mental: 4 }, mood: "warm",
          memory: { text: "Mengajari barista muda, persis seperti kamu dulu diajari.", tag: "kerja", mood: "warm" } },
        { weight: 6, text: "Kamu ajari dia, dan dia mendengarkan setengah, sibuk dengan ponselnya. Tidak apa-apa, kamu pun dulu begitu. Sebagian pelajaran memang baru nyangkut bertahun-tahun setelah diberikan.", effects: { social: 3, mental: 3 }, mood: "melancholy" },
      ]},
      { id: "pandang", label: "Diam, pandangi tempat yang menua bersamamu", outcomes: [
        { weight: 8, text: "Kamu hitung berapa cangkir yang sudah lewat dari tanganmu seumur hidup, dan menyerah di angka yang sudah tidak masuk akal. Pekerjaan yang dulu kamu kira sementara ternyata jadi bentuk seluruh hidupmu. Dan kamu tidak menyesalinya.", effects: { mental: 5, happiness: 3 }, mood: "melancholy",
          memory: { text: "Menyerah menghitung berapa cangkir yang lewat dari tanganmu seumur hidup.", tag: "waktu", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "br_pkl_warisan", category: "pekerjaan", pool: "economic", rarity: "uncommon",
    ageMin: 54, ageMax: 75, requireFlag: "pkl_jalan", deferrable: true, mood: "melancholy",
    title: "Tangan yang Mulai Gemetar di Atas Wajan",
    prompt: "Pelanggan yang dulu anak kecil sekarang datang membawa anak mereka sendiri. Tanganmu mulai gemetar di atas wajan, punggungmu protes tiap pagi. Di sebelah, seorang anak muda baru membuka gerobak. Gugup, kikuk, dengan mata yang sama takutnya seperti kamu berpuluh tahun lalu.",
    choices: (ctx) => {
      const punyaAnak = !!ctx.state.flags.punya_anak;
      let pandangText: string;
      let pandangMem: string;
      if (punyaAnak) {
        pandangText = "Kamu pandangi trotoar yang dulu terasa asing, kini hafal sampai tiap retaknya. Pekerjaan yang dulu kamu malu mengakuinya ternyata yang membesarkan anak-anakmu, menyekolahkan mereka, membawamu sampai sejauh ini. Bukan pekerjaan kecil. Tidak pernah kecil.";
        pandangMem = "Menyadari gerobak di pinggir jalan itu yang membesarkan seluruh keluargamu.";
      } else if (ctx.state.flags.menikah) {
        pandangText = "Kamu pandangi trotoar yang dulu terasa asing, kini hafal sampai tiap retaknya. Pekerjaan yang dulu kamu malu mengakuinya ternyata yang menghidupimu berdua dengan orang yang kamu nikahi, mengisi meja makan kalian tiap malam, membawamu sampai sejauh ini. Bukan pekerjaan kecil. Tidak pernah kecil.";
        pandangMem = "Menyadari gerobak di pinggir jalan itu yang menghidupimu berdua sepanjang pernikahan.";
      } else {
        pandangText = "Kamu pandangi trotoar yang dulu terasa asing, kini hafal sampai tiap retaknya. Pekerjaan yang dulu kamu malu mengakuinya ternyata yang menghidupimu seorang diri selama ini, membayar tiap kontrakan dan tiap obat, membawamu sampai sejauh ini. Bukan pekerjaan kecil. Tidak pernah kecil.";
        pandangMem = "Menyadari gerobak di pinggir jalan itu yang menghidupimu seorang diri sampai setua ini.";
      }
      return [
        { id: "ajari", label: "Bagi tempat dan ilmu pada yang muda", outcomes: [
          { weight: 8, text: "Kamu tunjukkan trik yang cuma bisa dipelajari dari pengalaman, bukan dari buku: cara membaca cuaca, ramah tanpa rugi, bertahan saat sepi.", effects: { social: 5, happiness: 5, mental: 4 }, mood: "warm" as const,
            memory: { text: "Mengajari pedagang muda trik yang hanya bisa dipelajari dari pengalaman.", tag: "kerja", mood: "warm" as const } },
          { weight: 6, text: "Kamu ajari dia sebisanya, dan dia mengangguk-angguk sambil sibuk sendiri. Tak apa. Kamu pun dulu keras kepala. Sebagian nasihat memang baru terasa benar setelah orang yang memberikannya tak ada lagi.", effects: { social: 3, mental: 3 }, mood: "melancholy" as const },
        ]},
        { id: "pandang", label: "Diam, pandangi trotoar yang menua bersamamu", outcomes: [
          { weight: 8, text: pandangText, effects: { mental: 5, happiness: 3 }, mood: "melancholy" as const,
            memory: { text: pandangMem, tag: "waktu", mood: "melancholy" as const } },
        ]},
      ];
    },
  }),

e({
    id: "br_pkl_toko", category: "pekerjaan", pool: "economic", rarity: "uncommon",
    ageMin: 54, ageMax: 75, requireFlag: "pkl_toko", deferrable: true, mood: "melancholy",
    title: "Dapur yang Tak Pernah Dingin",
    prompt: "Warung yang dulu kamu cat sendiri sekarang catnya mengelupas di tiap sudut. Pelanggan yang dulu remaja, kini datang membawa anak mereka, memesan menu yang sama. Dapur kecil ini sudah menghidupi lebih banyak orang daripada yang sempat kamu hitung.",
    choices: (ctx) => {
      const punyaAnak = !!ctx.state.flags.punya_anak;
      const childBirthAge = typeof ctx.state.flags.child_birth_age === "number"
        ? (ctx.state.flags.child_birth_age as number) : null;
      const anakDewasa = punyaAnak && childBirthAge != null && ctx.state.age - childBirthAge >= 20;

      let wariskan: Choice;
      if (anakDewasa) {
        wariskan = { id: "wariskan", label: "Mulai serahkan dapur pada anakmu", outcomes: [
          { weight: 8, text: "Anakmu yang dulu main di kolong meja warung sekarang berdiri di depan kompor, tangannya luwes meracik bumbu yang dulu kamu ajarkan diam-diam. Kamu serahkan dapur pelan-pelan, masih sambil mengoreksi takaran garamnya.", effects: { social: 5, happiness: 5, mental: 4 }, mood: "warm" as const,
            memory: { text: "Menyerahkan dapur warung pada anak yang dulu main di kolong mejanya.", tag: "kerja", mood: "warm" as const } },
          { weight: 8, text: "Anakmu mau melanjutkan, tapi racikannya tak sama dengan tanganmu, dan kamu belajar diam. Rasa warung ini akan berubah sesudah kamu, dan mungkin memang harus. Kamu cuma berharap pelanggan lama tetap datang, walau nanti kamu tak sempat lihat.", effects: { social: 3, mental: 3 }, mood: "melancholy" as const },
        ]};
      } else {
        wariskan = { id: "wariskan", label: "Latih pegawai muda memegang warung", outcomes: [
          { weight: 8, text: "Anak muda yang kamu gaji sejak lima tahun lalu sekarang hafal pesanan langganan tanpa bertanya. Kamu ajari dia hal yang tak ada di buku resep: pelanggan mana yang boleh ngutang, cara membuat yang datang tetap betah. Dapur yang kamu nyalakan sendiri pelan-pelan belajar menyala tanpamu.", effects: { social: 5, happiness: 4, mental: 4 }, mood: "warm" as const,
            memory: { text: "Melatih pegawai muda memegang dapur yang kamu bangun dari satu wajan.", tag: "kerja", mood: "warm" as const } },
          { weight: 8, text: "Kamu latih dia sebisanya, walau tahu suatu hari nanti dia akan pergi membuka warungnya sendiri. Tak apa. Sebagian dari resepmu akan ikut dengannya ke mana pun dia melangkah, dan itu sudah lebih dari cukup.", effects: { social: 3, mental: 3 }, mood: "melancholy" as const },
        ]};
      }

      let pandangText: string;
      let pandangMem: string;
      if (punyaAnak) {
        pandangText = "Kamu pandangi meja-meja yang dulu cuma dua, kini penuh tiap jam makan. Gerobak yang dulu kamu malu mendorongnya, ternyata yang membesarkan anak-anakmu, menyekolahkan mereka, mengantarmu sampai sejauh ini.";
        pandangMem = "Menyadari warung kecil itu yang membesarkan seluruh keluargamu, dari gerobak ke dapur sendiri.";
      } else if (ctx.state.flags.menikah) {
        pandangText = "Kamu pandangi meja-meja yang dulu cuma dua, kini penuh tiap jam makan. Gerobak yang dulu kamu malu mendorongnya, ternyata yang menghidupimu berdua dengan orang yang kamu nikahi, mengisi piring kalian dari piring yang kamu masak untuk orang lain.";
        pandangMem = "Menyadari warung kecil itu yang menghidupimu berdua sepanjang pernikahan, dari gerobak ke dapur sendiri.";
      } else {
        pandangText = "Kamu pandangi meja-meja yang dulu cuma dua, kini penuh tiap jam makan. Gerobak yang dulu kamu malu mendorongnya, ternyata yang menghidupimu seorang diri selama ini, membayar tiap tagihan dan tiap obat, mengantarmu sampai sejauh ini.";
        pandangMem = "Menyadari warung kecil itu yang menghidupimu seorang diri sampai setua ini, dari gerobak ke dapur sendiri.";
      }

      return [
        wariskan,
        { id: "pandang", label: "Diam, pandangi warung yang menua bersamamu", outcomes: [
          { weight: 8, text: pandangText, effects: { mental: 5, happiness: 3 }, mood: "melancholy" as const,
            memory: { text: pandangMem, tag: "waktu", mood: "melancholy" as const } },
        ]},
      ];
    },
  }),

e({
    id: "br_psikologi_tua", category: "eksistensial", pool: "age", rarity: "uncommon",
    ageMin: 54, ageMax: 76, requireFlag: "jurusan_psikologi", deferrable: true, mood: "melancholy",
    title: (ctx) => ctx.state.flags.psikolog_riset ? "Seumur Hidup Bertanya" : "Penampung yang Lupa Dikosongkan",
    prompt: (ctx) => ctx.state.flags.psikolog_riset
      ? "Seumur hidup kamu menyusun pertanyaan tentang manusia, dan belum sempat mengarahkannya ke dalam dirimu sendiri. Sekarang, di usia ini, kamu menghitung dua hal: seberapa jauh kamu menambah pengetahuan baru, dan seberapa lama kamu menunda mengenal dirimu sendiri."
      : "Sepanjang hidup kamu jadi tempat orang menaruh beban mereka. Sekarang, di usia ini, kamu menghitung dua hal: berapa banyak yang kamu bantu bertahan, dan berapa lama kamu menunda menengok lukamu sendiri.",
    choices: (ctx) => ctx.state.flags.psikolog_riset
      ? [
          { id: "tengok", label: "Akhirnya, arahkan pertanyaanmu ke dalam", outcomes: [
            { weight: 8, text: "Kamu yang seumur hidup membedah kepala orang lain lewat data, akhirnya duduk dengan kepalamu sendiri. Tak ada kuesioner untuk ini. Hanya kamu dan pertanyaan yang sengaja kamu hindari berpuluh tahun.", effects: { mental: 7, happiness: 4 }, mood: "warm",
              memory: { text: "Akhirnya mengarahkan pertanyaanmu ke dalam dirimu sendiri.", tag: "tenang", mood: "warm" } },
          ]},
          { id: "warisan", label: "Hitung seberapa jauh kamu menambah pengetahuan baru", outcomes: [
            { weight: 8, text: "Tak ada patung untuk orang yang sedikit menambahkan apa yang manusia sudah tahu tentang dirinya. Tapi caramu bertanya masih hidup di kepala orang yang tak pernah tahu namamu.", effects: { mental: 5, happiness: 5, intelligence: 2 }, mood: "melancholy",
              memory: { text: "Caramu bertanya, masih hidup di kepala orang yang tak pernah tahu namamu.", tag: "waktu", mood: "warm" } },
          ]},
        ]
      : [
          { id: "tengok", label: "Akhirnya, duduk dengan lukamu sendiri", outcomes: [
            { weight: 8, text: "Kamu yang seumur hidup mengajari orang berhenti lari, akhirnya melakukannya sendiri. Terlambat, agaknya. Kamu melakukan hal yang kamu tunda berpuluh tahun, dan untuk pertama kalinya merasa selesai.", effects: { mental: 7, happiness: 4 }, mood: "warm",
              memory: { text: "Akhirnya duduk dengan lukamu sendiri, setelah seumur hidup mengurus luka orang lain.", tag: "tenang", mood: "warm" } },
          ]},
          { id: "bangga", label: "Hitung wajah-wajah yang kamu bantu bertahan", outcomes: [
            { weight: 8, text: "Sebagian dari mereka sudah kamu lupa namanya, tapi kamu tahu mereka masih melanjutkan hidup. Tak ada papan nama untuk pekerjaan itu. Kamu menyimpannya diam-diam, dan itu cukup.", effects: { mental: 5, happiness: 5, social: 2 }, mood: "melancholy",
              memory: { text: "Wajah-wajah yang bertahan, karena pernah duduk di seberangmu.", tag: "waktu", mood: "warm" } },
          ]},
        ],
  }),

e({
    id: "br_filsafat_tua", category: "eksistensial", pool: "age", rarity: "uncommon",
    ageMin: 60, ageMax: 74, requireFlag: "jurusan_filsafat", deferrable: true, mood: "melancholy",
    title: "Pertanyaan yang Tidak Pernah Lulus",
    prompt: "Lebih dari setengah abad kamu memutar pertanyaan yang sama, yang dulu pernah membuat satu ruang kelas terdiam: untuk apa semua ini, dan ke mana kita sesudahnya. Kamu tidak lebih dekat ke jawaban. Hanya lebih akrab dengan pertanyaannya.",
    choices: [
      { id: "damai", label: "Berdamai. Mungkin hidup bersama pertanyaan itu sudah jawabannya", outcomes: [
        { weight: 8, text: "Kamu berhenti menuntut kepastian dari hidup, dan anehnya hidup terasa lebih ringan sesudahnya.", effects: { mental: 7, happiness: 5 }, mood: "warm",
          memory: { text: "Saat kamu berhenti memburu jawaban, dan pertanyaannya duduk tenang di sebelahmu.", tag: "tenang", mood: "warm" } },
      ]},
      { id: "gali", label: "Tetap menggali, sampai napas terakhir", outcomes: [
        { weight: 8, text: "Kamu masih membuka buku-buku tebal dengan tangan yang mulai gemetar, masih menggarisbawahi kalimat. Tidak akan sempat selesai, dan kamu tahu itu. Tapi orang sepertimu memang tidak hidup untuk selesai.", effects: { intelligence: 4, mental: 3, happiness: 2 }, addTrait: "curious", mood: "melancholy" },
      ]},
    ],
  }),
];
