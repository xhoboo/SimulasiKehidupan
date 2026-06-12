import { LifeEvent } from "../types";
import { e } from "./_helpers";

export const TRAUMA_POOL: LifeEvent[] = [
  e({
    id: "bullying", category: "sekolah", pool: "trauma", rarity: "common",
    ageMin: 10, ageMax: 14, deferrable: true,
    prompt: "Seorang anak yang lebih besar mendorongmu di koridor.",
    choices: [
      { id: "lawan", label: "Dorong balik", outcomes: [
        { weight: 8, text: "Kamu kalah, tapi dia tidak mengganggumu lagi.", effects: { health: -5, social: 4, mental: 3 }, addTrait: "aggressive" },
        { weight: 8, text: "Kamu kalah, dan jadi target tetap selama setahun.", effects: { health: -8, mental: -10, happiness: -8 }, mood: "tragic", flag: "korban_bully" },
      ]},
      { id: "diam", label: "Pungut tas, jalan terus", outcomes: [
        { weight: 8, text: "Kamu menelan sesuatu yang tidak kamu pahami. Itu tinggal di dalam dadamu.", effects: { mental: -6, happiness: -4 }, mood: "melancholy", flag: "korban_bully",
          memory: { text: "Hari di koridor itu. Kamu tidak menangis. Kamu hanya jalan.", tag: "luka", mood: "melancholy" } },
        { weight: 8, text: "Kamu pungut isi tasmu satu per satu sementara mereka menonton. Tidak ada yang membantu. Kamu jadi hafal corak lantai koridor itu, bukan wajah-wajah yang memandangmu.", effects: { mental: -7, happiness: -3 }, mood: "melancholy", flag: "korban_bully",
          memory: { text: "Corak lantai koridor yang kamu hafal sambil memunguti isi tasmu.", tag: "luka", mood: "melancholy" } },
      ]},
      { id: "lapor", label: "Lapor guru", outcomes: [
        { weight: 8, text: "Guru menasehati kalian berdua. Kamu dicap 'pengadu'.", effects: { social: -3, mental: 1 } },
        { weight: 8, text: "Si pem-bully diskors. Kamu tidur nyenyak malam itu.", effects: { mental: 4, happiness: 3 } },
      ]},
      { id: "berteman", label: "Coba ajak ngobrol setelah pulang", outcomes: [
        { weight: 8, text: "Anehnya, dia bercerita soal ayahnya yang pemarah. Kalian jadi teman yang aneh.", effects: { social: 5, mental: 4 }, addTrait: "empathetic", addsRelationship: { id: "bully", name: "Riko", role: "friend", closeness: 30, alive: true } },
        { weight: 8, text: "Dia menertawakanmu. Lebih sakit dari dorongan tadi.", effects: { mental: -5 }, mood: "tragic" },
      ]},
    ],
  }),

  e({
    id: "kehilangan_sahabat", category: "kehilangan", pool: "trauma", rarity: "rare",
    ageMin: 22, ageMax: 60, mood: "tragic",
    requireRelationship: "sahabat",
    title: "Pesan Grup yang Mengubah Pagi",
    prompt: "Pesan grup. Lima kata. Sahabat yang kamu kenal sejak kecil itu tidak ada lagi. Kamu membaca berulang, seolah maknanya akan berbeda kalau cukup sering dibaca.",
    choices: [
      { id: "datang", label: "Datang ke rumahnya", outcomes: [
        { weight: 8, text: "Kamu memeluk ibunya. Kalian menangis tanpa kata. Tidak ada yang tepat untuk dikatakan.", effects: { mental: -10, social: 3 }, killsRelationship: "sahabat", extraFlags: ["sahabat_meninggal"], memory: { text: "Pelukan dengan ibu sahabatmu, tanpa kata.", tag: "kehilangan", mood: "tragic" } },
        { weight: 8, text: "Kamu sampai di depan rumahnya, tapi tidak bisa masuk. Kamu berdiri di seberang jalan, menatap rumah yang penuh orang, lalu pulang tanpa ada yang tahu kamu sempat datang. Kehadiran yang tidak pernah jadi kehadiran.", effects: { mental: -12, happiness: -4 }, killsRelationship: "sahabat", extraFlags: ["sahabat_meninggal"], mood: "tragic", memory: { text: "Berdiri di seberang jalan, tak sanggup masuk ke rumah duka sahabatmu.", tag: "kehilangan", mood: "tragic" } },
      ]},
      { id: "kabur", label: "Tidak sanggup datang", outcomes: [
        { weight: 8, text: "Kamu tidak datang. Dia pernah datang ke malam terburukmu tanpa diminta, dan kamu tidak bisa membalas hal sesederhana itu di pemakamannya. Kamu menyesal, bertahun-tahun.", effects: { mental: -15, happiness: -8 }, flag: "regret_sahabat", killsRelationship: "sahabat", extraFlags: ["sahabat_meninggal"] },
        { weight: 8, text: "Kamu kirim karangan bunga dengan kartu yang kalimatnya kamu hapus-tulis sepuluh kali. Tidak satu pun terasa benar. Bertahun kemudian kamu masih memikirkan kalimat yang seharusnya kamu tulis, yang tidak akan pernah sempat dia baca.", effects: { mental: -14, happiness: -7 }, flag: "regret_sahabat", killsRelationship: "sahabat", extraFlags: ["sahabat_meninggal"], mood: "tragic" },
      ]},
    ],
  }),

  e({
    id: "ortu_sakit", category: "keluarga", pool: "trauma", rarity: "uncommon",
    ageMin: 35, ageMax: 55, forbidFlag: "ibu_meninggal", mood: "tragic",
    title: "Suara yang Berbeda di Pagi Hari",
    prompt: "Layar ponselmu berkedip. Nama adikmu. Jam tujuh pagi. Suaranya terlalu tenang. Cara orang bicara ketika sudah menangis duluan, dan kini memaksa diri untuk terdengar baik-baik saja. Kamu langsung duduk di tepi kasur. Tangan kirimu mencari sesuatu untuk dipegang.",
    choices: (ctx) => {
      const pkl = !!ctx.state.flags.pedagang_kaki_lima;
      const kerja = pkl
        ? { id: "kerja", label: "Habiskan dagangan dulu. Besok pasti bisa.", outcomes: [
            { weight: 8, text: "Besok tidak datang seperti yang kamu bayangkan. Telepon berikutnya bukan dari kakakmu, suaranya lebih dalam, lebih berat. Dagangan yang kamu kira tak bisa ditinggal ternyata bisa — semua bisa, kecuali yang satu itu.",
              effects: { mental: -20, happiness: -15, discipline: -5 },
              mood: "tragic" as const,
              flag: "regret_ibu", extraFlags: ["ibu_meninggal", "regret_ibu_kerja"], killsRelationship: "ibu",
              memory: { text: "Gerobak yang tetap kamu dorong malam itu, daripada pulang ke ibu.", tag: "regret", mood: "tragic" as const } },
            { weight: 8, text: "Kamu habiskan dagangan sampai gerobak kosong; uangnya tak seberapa, tak ada yang menunggumu menutup lapak. Saat kamu pulang, yang menyambut cuma kursi-kursi yang sudah ditata rapi untuk tamu. Kamu tidak pernah lagi bisa mendorong gerobak itu tanpa rasa mual yang samar.",
              effects: { mental: -18, happiness: -15, discipline: -4 },
              mood: "tragic" as const,
              flag: "regret_ibu", extraFlags: ["ibu_meninggal", "regret_ibu_kerja"], killsRelationship: "ibu",
              memory: { text: "Gerobak kosong malam itu, dan kursi-kursi tamu yang menyambutmu di rumah.", tag: "regret", mood: "tragic" as const } },
          ]}
        : { id: "kerja", label: "Selesaikan deadline dulu. Besok pasti bisa.", outcomes: [
            { weight: 8, text: "Besok tidak datang seperti yang kamu bayangkan. Telepon berikutnya bukan dari kakakmu, suaranya berbeda lagi, lebih dalam, lebih berat. Kata 'besok' terasa seperti kesalahan ejaan selamanya setelah malam itu.",
              effects: { mental: -20, happiness: -15, discipline: -5 },
              mood: "tragic" as const,
              flag: "regret_ibu", extraFlags: ["ibu_meninggal", "regret_ibu_kerja"], killsRelationship: "ibu",
              memory: { text: "Deadline yang kamu pilih daripada pulang ke ibu malam itu.", tag: "regret", mood: "tragic" as const } },
            { weight: 8, text: "Kamu kirim pekerjaan itu tepat waktu; atasanmu bahkan tidak membacanya sampai lusa. Saat kamu pulang, yang menyambut cuma kursi-kursi yang sudah ditata rapi untuk tamu. Kamu tidak pernah lagi bisa menatap kata 'deadline' tanpa rasa mual yang samar.",
              effects: { mental: -18, happiness: -15, discipline: -4 },
              mood: "tragic" as const,
              flag: "regret_ibu", extraFlags: ["ibu_meninggal", "regret_ibu_kerja"], killsRelationship: "ibu",
              memory: { text: "Kursi-kursi tamu yang sudah ditata rapi saat kamu akhirnya pulang.", tag: "regret", mood: "tragic" as const } },
          ]};
      return [
      { id: "pulang", label: "Pesan tiket pertama. Pulang sekarang.", outcomes: [
        { weight: 8, text: "Kamu sempat. Tangannya lebih ringan dari yang kamu ingat, tulang di balik kulit, tapi jari-jarinya merespons genggamanmu — ia masih di sana. Tidak banyak yang kalian katakan, tidak perlu banyak.",
          effects: { mental: 5, happiness: -8, wealth: -5 },
          flag: "ibu_meninggal", killsRelationship: "ibu",
          memory: { text: "Tangan ibu yang masih merespons genggamanmu, untuk terakhir kalinya.", tag: "ibu", mood: "tragic" as const },
          mood: "tragic" as const },
        { weight: 8, text: "Kamu terlambat beberapa jam. Di ujung perjalanan, kakakmu menyambutmu di pintu dengan wajah yang tidak perlu menjelaskan apa-apa. Kamu duduk di kursi di sudut ruangan yang sudah sepi, mencium bau parfumnya yang masih ada di bantal.",
          effects: { mental: -10, happiness: -10, wealth: -5 },
          flag: "ibu_meninggal", killsRelationship: "ibu",
          memory: { text: "Parfumnya yang masih ada di bantal, setelah semuanya selesai.", tag: "ibu", mood: "tragic" as const },
          mood: "tragic" as const },
      ]},
      kerja,
      { id: "tanya_kondisi", label: "Tanya seberapa serius. Pikirkan dulu.", outcomes: [
        { weight: 8, text: "Kakakmu bilang 'stabil, tapi minta kamu ada'. Kamu pesan tiket malam itu dan sempat di sisinya sehari sebelum ia pergi. Sehari yang tidak akan pernah terasa cukup.",
          effects: { mental: 3, happiness: -7, wealth: -4 },
          flag: "ibu_meninggal", killsRelationship: "ibu",
          memory: { text: "Sehari di sisinya, yang tidak pernah terasa cukup.", tag: "ibu", mood: "tragic" },
          mood: "tragic" },
        { weight: 8, text: "'Stabil' ternyata punya definisi berbeda dari yang kamu bayangkan. Kamu berangkat keesokan harinya, satu pagi yang terlambat.",
          effects: { mental: -12, happiness: -10 },
          flag: "regret_ibu", extraFlags: ["ibu_meninggal"], killsRelationship: "ibu",
          mood: "tragic" },
      ]},
      ];
    },
  }),

  e({
    id: "ayah_pergi", category: "kehilangan", pool: "trauma", rarity: "uncommon",
    ageMin: 42, ageMax: 68, forbidFlag: "ayah_meninggal", deferrable: true, mood: "tragic",
    title: "Hal yang Tidak Pernah Kalian Ucapkan",
    prompt: "Ayahmu sudah tidak sepenuhnya sehat beberapa bulan ini. 'Masih kuat' selalu dikatakannya, dengan nada yang menutup percakapan. Pagi ini telepon berdering dari nomor keluarga. Nadanya berbeda. Ada sesuatu di baliknya yang tidak perlu dijelaskan dengan kata-kata.",
    choices: [
      { id: "pulang", label: "Pulang. Ada yang masih perlu dikatakan.", outcomes: [
        { weight: 8, text: "Kamu sempat. Ruangan itu berbau obat dan cahaya sore yang terlalu tenang; ayahmu menatapmu lama tanpa kata, dan kamu juga diam. Ada sesuatu yang berpindah di antara tatapan kalian, hal yang tak pernah kalian pelajari cara mengucapkannya tapi ternyata bisa disampaikan tanpa suara.",
          effects: { mental: 4, happiness: -10, wealth: -3 },
          flag: "ayah_meninggal", killsRelationship: "ayah",
          memory: { text: "Tatapan ayah di ruangan itu. Diam, tapi cukup untuk keduanya.", tag: "ayah", mood: "tragic" },
          mood: "tragic" },
        { weight: 8, text: "Hampir terlambat. Tangannya sudah dingin, tapi kamu sempat memegang pergelangannya dan bicara meski tak ada yang menjawab. Mungkin itu yang ia butuhkan, mungkin juga kamu.",
          effects: { mental: 2, happiness: -10, wealth: -3 },
          flag: "ayah_meninggal", killsRelationship: "ayah",
          memory: { text: "Berbicara pada ayah yang sudah tidak bisa menjawab, tapi kamu tetap bicara.", tag: "ayah", mood: "tragic" },
          mood: "tragic" },
      ]},
      { id: "hubungan_jauh", label: "Kalian memang tidak pernah dekat. Tapi tetap pulang.", outcomes: [
        { weight: 8, text: "Kamu pulang, bukan karena kalian selalu akur, tapi karena ada hal yang tak bisa diselesaikan kalau tidak hadir. Berdiri di sebelahnya, kamu sadar bukan dia yang kamu ratapi. Kamu meratapi jarak yang tak pernah kalian perkecil, dan sekarang tidak akan pernah bisa.",
          effects: { mental: -5, happiness: -8, wealth: -3 },
          flag: "ayah_meninggal", killsRelationship: "ayah",
          memory: { text: "Jarak antara kalian yang baru terasa nyata saat sudah terlambat untuk diperkecil.", tag: "ayah", mood: "tragic" },
          mood: "tragic" },
        { weight: 8, text: "Kamu datang dan berdiri agak jauh dari yang lain, seperti seumur hidup. Seseorang menyerahkan jam tangan tuanya, 'dia mau kamu yang simpan' — kamu tidak ingat dia pernah bilang begitu, mungkin tidak pernah. Kamu pakai jam itu sampai berhenti, lalu tidak pernah memperbaikinya.",
          effects: { mental: -6, happiness: -7, wealth: -3 },
          flag: "ayah_meninggal", killsRelationship: "ayah",
          memory: { text: "Jam tangan tua ayah yang kamu pakai sampai berhenti, lalu kamu biarkan.", tag: "ayah", mood: "tragic" },
          mood: "tragic" },
      ]},
      { id: "tunda", label: "Tunda sehari. Mungkin tidak separah itu.", outcomes: [
        { weight: 8, text: "Kamu tiba setelah semuanya selesai. Rumah masih ramai, tapi udaranya berbeda — cara orang bergerak, cara suara teredam. Kamu masuk ke kamarnya yang kosong, bau obat masih ada, dan berdiri di sana sampai seseorang memanggil namamu pelan dari ruang depan.",
          effects: { mental: -15, happiness: -10 },
          flag: "ayah_meninggal", killsRelationship: "ayah",
          memory: { text: "Kamar ayah yang kosong, bau obat, dan buku dengan pembatas yang tidak bergerak.", tag: "regret", mood: "tragic" },
          mood: "tragic" },
        { weight: 8, text: "'Mungkin tidak separah itu,' kamu yakinkan diri, lalu tidur lebih lelap dari semestinya. Justru tidur lelap itu yang tidak pernah kamu maafkan. Paginya kamu berangkat ke rumah yang sudah tahu sesuatu yang belum kamu tahu.",
          effects: { mental: -16, happiness: -10 },
          flag: "ayah_meninggal", killsRelationship: "ayah",
          memory: { text: "Tidur lelap yang tidak pernah kamu maafkan dari dirimu sendiri.", tag: "regret", mood: "tragic" },
          mood: "tragic" },
      ]},
    ],
  }),

  e({
    id: "lupa_suara_ayah", category: "kehilangan", pool: "trauma", rarity: "rare",
    ageMin: 50, ageMax: 65, requireFlag: "ayah_meninggal", deferrable: true, mood: "tragic",
    title: "Yang Hilang Pelan-pelan",
    prompt: "Kamu sedang menyetir. Tiba-tiba sadar kamu tidak ingat lagi suara ayahmu terdengar seperti apa.",
    choices: [
      { id: "menepi", label: "Menepi. Duduk sebentar.", outcomes: [
        { weight: 8, text: "Bukan karena ia pergi, itu sudah lama. Tapi karena sosoknya di kepalamu juga mulai pergi, tanpa pamit, tanpa kamu sadari.", effects: { mental: -8, happiness: -5 }, mood: "tragic", memory: { text: "Hari kamu lupa suara ayahmu untuk selamanya.", tag: "ayah", mood: "tragic" } },
        { weight: 8, text: "Kamu menutup mata, memaksa mengingat, tapi yang datang malah hal lain: cara ia mengetuk meja, bau sabunnya sehabis mandi, langkahnya di teras. Suaranya hilang, tapi ia tidak sepenuhnya pergi — hanya pindah ke indra yang lain.", effects: { mental: -4, happiness: -3 }, mood: "melancholy", memory: { text: "Cara ayah mengetuk meja saat berpikir, yang masih kamu ingat.", tag: "ayah", mood: "melancholy" } },
      ]},
      { id: "rekaman", label: "Cari video lama di HP", outcomes: [
        { weight: 8, text: "Ada satu video, 11 detik. Kamu putar 38 kali malam itu.", effects: { mental: 3, happiness: -3 }, mood: "melancholy" },
        { weight: 8, text: "Kamu gulir bertahun-tahun foto dan video, tak menemukan suaranya di satu pun. Dia selalu yang memegang kamera, tak pernah yang direkam. Betapa banyak orang menghilang justru karena merekalah yang selalu mengabadikan orang lain.", effects: { mental: -6, happiness: -4 }, mood: "tragic" },
      ]},
      { id: "lupakan", label: "Lanjutkan menyetir", outcomes: [
        { weight: 8, text: "Hidup tidak menunggumu. Tapi sebagian dari dirimu tertinggal di tepi jalan itu.", effects: { mental: -5 }, mood: "melancholy" },
        { weight: 8, text: "Kamu lanjut menyetir, radio dibesarkan. Tapi sepanjang sisa hari kamu mencari suaranya di suara orang asing — kasir, penyiar, orang di telepon. Kamu tidak menemukannya di mana pun lagi.", effects: { mental: -5, happiness: -2 }, mood: "melancholy" },
      ]},
    ],
  }),
];
