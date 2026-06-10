import { LifeEvent } from "../types";
import { e, karirOf } from "./_helpers";

export const REGRET_POOL: LifeEvent[] = [
  e({
    id: "regret_kerja", category: "regret", pool: "regret", rarity: "uncommon",
    ageMin: 60, ageMax: 75, requireFlag: "loyal_pegawai", mood: "melancholy",
    title: "Pensiun",
    prompt: (ctx) => karirOf(ctx.state) === "dokter"
      ? "Pensiun. Tumpeng kecil di ruang dokter, pidato singkat kepala bagian, salam yang sudah dilatih. Besok pagi, jam tujuh tidak lagi berarti apa-apa."
      : "Pensiun. Kue kantor, pidato lima menit, salam yang sudah dilatih. Besok pagi, jam tujuh tidak lagi berarti apa-apa.",
    choices: (ctx) => [
      { id: "rindu", label: "Rindukan rutinitas itu", outcomes: [
        { weight: 8, text: `Kamu tetap bangun jam enam, lalu ingat tidak ada ke mana-mana. ${ctx.state.age - 23} tahun rutinitas tidak bisa dimatikan dalam semalam.`, effects: { mental: -5 }, mood: "melancholy" },
        { weight: 8, text: "Berbulan-bulan kamu masih memimpikan rapat dan telepon yang berdering. Tubuhmu belum diberi tahu bahwa semua itu sudah selesai.", effects: { mental: -4 }, mood: "melancholy" },
      ]},
      { id: "lepas", label: "Lepaskan. Nikmati sisanya.", outcomes: [
        { weight: 8, text: "Lega yang aneh. Seperti terlambat melepas sepatu yang terlalu sempit.", effects: { mental: 4 } },
        { weight: 8, text: "Butuh sebulan sebelum kamu berhenti merasa bersalah saat bangun siang. Yang mengejutkan bukan betapa mudahnya berhenti, tapi betapa lama kamu pikir itu akan sulit.", effects: { mental: 4 } },
      ]},
      { id: "refleksi", label: "Duduk, hitung apa yang benar-benar kamu dapat", outcomes: [
        { weight: 8, text: "Ada lebih banyak yang kamu syukuri daripada yang kamu sesali, atau mungkin kamu pandai memilih mana yang dihitung. Keduanya bisa jadi kebijaksanaan.", effects: { mental: 6, happiness: 3 }, mood: "warm" },
        { weight: 8, text: "Kamu buat dua daftar, yang kamu syukuri dan yang kamu sesali. Yang pertama lebih panjang, yang kedua lebih berat tiap barisnya. Kamu duduk lama di antara keduanya, dan memutuskan tak perlu memenangkan salah satu.", effects: { mental: 5, happiness: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "regret_menggambar", category: "regret", pool: "regret", rarity: "uncommon",
    ageMin: 60, ageMax: 80, requireTrait: "creative", deferrable: true, mood: "melancholy",
    title: "Pensil yang Berhenti",
    prompt: "Kamu berhenti menggambar entah kapan. Tidak ada momen besar, hanya pensil yang pelan-pelan tertelan laci, tanpa upacara.",
    choices: [
      { id: "mulai_lagi", label: "Beli buku sketsa", outcomes: [
        { weight: 8, text: "Tanganmu kaku. Tapi setelah seminggu, ada bagian dirimu yang bangun lagi, bagian yang sudah tertidur entah sejak kapan, dan ternyata hanya menunggu dipanggil.", effects: { happiness: 8, mental: 6 }, achievement: "Kembali Pulang ke Diri Sendiri" },
        { weight: 8, text: "Tanganmu kaku, gambar pertamamu jelek, matamu masih bisa menilai meski jari tak lagi menurut. Tapi kamu menggambar lagi besoknya, dan besoknya lagi. Bukan untuk jadi bagus, hanya untuk merasa hidup di ujung jari.", effects: { happiness: 6, mental: 5 } },
      ]},
      { id: "biarkan", label: "Biarkan. Mungkin memang sudah waktunya.", outcomes: [
        { weight: 8, text: "Mimpi itu menua tanpa drama, hanya pelan-pelan menghilang seperti warna di kertas lama.", effects: { mental: -4 }, mood: "melancholy" },
        { weight: 8, text: "Kamu biarkan, dan suatu hari menemukan satu sketsa lama terselip di buku. Garis tangan yang dulu milikmu. Kamu tutup buku itu pelan. Sebagian mimpi cukup pernah ada, katamu pada diri sendiri, mencoba percaya.", effects: { mental: -3, happiness: 1 }, mood: "melancholy", memory: { text: "Satu sketsa lama yang terselip, dari tangan yang dulu yakin.", tag: "regret", mood: "melancholy" } },
      ]},
    ],
  }),

  e({
    id: "regret_meminta_maaf", category: "regret", pool: "regret", rarity: "rare",
    ageMin: 60, ageMax: 85, requireFlag: "ada_kehilangan", deferrable: true, mood: "tragic",
    title: "Maaf yang Tertunda",
    prompt: "Kamu sadar, ada satu orang yang seharusnya kamu mintai maaf. Kamu tidak melakukannya waktu itu. Sekarang dia sudah tidak ada, dan kata-kata itu tidak punya tempat lagi untuk dituju.",
    choices: [
      { id: "tulis", label: "Tulis surat, walau tidak akan terbaca", outcomes: [
        { weight: 8, text: "Kamu menyimpannya di laci. Tinta itu menyerap sebagian bebanmu.", effects: { mental: 5 }, memory: { text: "Surat permintaan maaf yang tidak akan pernah dibaca.", tag: "regret", mood: "melancholy" } },
        { weight: 8, text: "Kamu tulis surat itu, lalu membakarnya pelan di wastafel. Bukan untuk menghapus, tapi untuk mengirim, lewat satu-satunya pos yang tersisa. Abunya hitam, ringan, dan anehnya melegakan.", effects: { mental: 5 }, mood: "melancholy", memory: { text: "Surat maaf yang kamu bakar agar sampai ke tempat dia berada.", tag: "regret", mood: "melancholy" } },
      ]},
      { id: "diam", label: "Diamkan", outcomes: [
        { weight: 8, text: "Beban itu mengikutimu. Selalu.", effects: { mental: -8, happiness: -5 }, mood: "tragic" },
        { weight: 8, text: "Kamu pilih diam, lagi, seperti dulu. Tapi diam yang dulu terasa seperti pilihan. Diam yang sekarang terasa seperti hukuman yang kamu jatuhkan pada diri sendiri.", effects: { mental: -8, happiness: -4 }, mood: "tragic" },
      ]},
      { id: "selesaikan_dengan_lain", label: "Minta maaf ke orang yang masih bisa diajak bicara", outcomes: [
        { weight: 8, text: "Bukan orang yang sama. Tapi ada sesuatu yang serupa dalam aksi itu, seolah permintaan maafmu akhirnya punya tempat berlabuh.", effects: { mental: 7, social: 3 }, mood: "warm" },
        { weight: 8, text: "Kamu minta maaf ke orang lain untuk hal lain, dan dia berkata 'sudah lama aku tidak memikirkan itu.' Maafmu jatuh di tempat yang salah, untuk luka yang sudah sembuh. Tapi mengucapkannya tetap melonggarkan sesuatu di dadamu sendiri.", effects: { mental: 6, social: 2 }, mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "regret_telepon_malam_itu", category: "regret", pool: "regret", rarity: "rare",
    ageMin: 60, ageMax: 85, requireFlag: "ada_kehilangan", deferrable: true, mood: "tragic",
    title: "Telepon yang Tidak Jadi",
    prompt: (ctx) => {
      const hilang = ctx.state.relationships.find((r) => !r.alive);
      const siapa = hilang ? hilang.name : "seseorang yang dulu dekat";
      return `Tengah malam, sebuah nama muncul tanpa diundang, ${siapa}. Bukan karena genting, kamu cuma pernah ingin meneleponnya tanpa alasan, untuk hal-hal kecil. Kamu pikir itu bisa kapan saja, tapi 'kapan saja' ternyata punya batas, dan kamu melewatinya tanpa sadar.`;
    },
    choices: [
      { id: "menangis", label: "Biarkan air mata datang", outcomes: [
        { weight: 8, text: "Kamu menangis sebentar, lalu menyeduh sesuatu yang hangat. Hidup berjalan dengan luka kecil yang tidak pernah sembuh sempurna, tapi mungkin tidak harus.", effects: { mental: -6 }, mood: "tragic", memory: { text: "Telepon yang tidak pernah jadi, malam yang masih kamu ingat.", tag: "regret", mood: "tragic" } },
        { weight: 8, text: "Air mata itu datang tanpa banyak suara. Cara orang tua menangis, efisien, terlatih. Kamu menyeka dengan punggung tangan, duduk di gelap sampai matamu terbiasa, dan dunia kembali ke ukuran yang bisa kamu tanggung.", effects: { mental: -6 }, mood: "tragic", memory: { text: "Cara orang tua menangis di tengah malam, tanpa suara, terlatih.", tag: "regret", mood: "tragic" } },
      ]},
      { id: "hubungi_sekarang", label: "Ambil HP, hubungi seseorang yang masih bisa dihubungi malam ini", outcomes: [
        { weight: 8, text: "Kamu mengetik nama-nama di kontak, beberapa dicoret, dua dipilih. Pesanmu singkat tapi sungguh-sungguh, dan besok paginya keduanya membalas. Tidak memperbaiki masa lalu, tapi mengubah malam ini.", effects: { mental: 4, happiness: 3, social: 3 }, mood: "warm" },
        { weight: 8, text: "Kamu telepon satu orang yang masih hidup, jam segini. Dia mengangkat kaget 'Kenapa? Ada apa?'. 'Nggak ada, cuma kepingin dengar suaramu.' Kalian mengobrol sampai kantuk menang.", effects: { mental: 5, happiness: 4, social: 3 }, mood: "warm" },
      ]},
      { id: "tulis", label: "Tulis di buku catatan. Nama itu, dan yang ingin kamu katakan", outcomes: [
        { weight: 8, text: "Kamu menulis sampai tidak ada lagi yang perlu ditulis. Buku itu kamu tutup dan taruh di tempat yang mudah dijangkau. Sebagai pengingat bahwa ada kata-kata yang masih layak diucapkan, selagi masih bisa.", effects: { mental: 5 }, mood: "melancholy" },
        { weight: 8, text: "Kamu tulis namanya di halaman baru, lalu semua hal kecil yang dulu ingin kamu ceritakan padanya. Daftarnya lebih panjang dari dugaanmu. Ternyata kamu menyimpan banyak sekali untuknya. Untuk 'kapan saja' yang tidak pernah datang.", effects: { mental: 4 }, mood: "melancholy", memory: { text: "Daftar panjang hal-hal kecil yang ingin kamu ceritakan, terlambat.", tag: "regret", mood: "melancholy" } },
      ]},
    ],
  }),
];
