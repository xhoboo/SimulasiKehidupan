import { LifeEvent } from "../types";
import { e } from "./_helpers";

// Pool callback: peristiwa lama yang muncul kembali bertahun kemudian.
export const CALLBACK_POOL: LifeEvent[] = [
e({
    id: "teman_khayalan_pergi", category: "pertemanan", pool: "callback", rarity: "uncommon",
    ageMin: 8, ageMax: 11, requireRelationship: "teman_khayalan", deferrable: true, mood: "melancholy",
    forceCallbackTag: "teman_khayalan",
    title: "Kursi yang Tidak Lagi Disiapkan",
    prompt: "Suatu sore kamu sadar sudah lama tidak menyiapkan kursi untuknya. Tidak ada perpisahan, tidak ada pertengkaran. Dia hanya pelan-pelan menjadi sesuatu yang kamu tahu tidak pernah benar-benar ada.",
    choices: [
      { id: "pamit", label: "Ucapkan selamat tinggal pelan-pelan", outcomes: [
        { weight: 8, text: "Kamu berterima kasih ke udara kosong, merasa konyol dan sedih sekaligus. Ini perpisahan pertama yang kamu lakukan dengan benar, sebelum kamu tahu betapa banyak yang akan menyusul.", effects: { mental: 2, intelligence: 2 }, mood: "melancholy", flag: "teman_khayalan_selesai", endsRelationship: "teman_khayalan",
          memory: { text: "Selamat tinggal untuk teman yang tidak pernah ada.", tag: "teman_khayalan", mood: "melancholy" } },
        { weight: 8, text: "Kamu siapkan kursinya satu kali terakhir, isi dengan biskuit, lalu bilang pelan bahwa kamu akan baik-baik saja sekarang. Konyol, dan kamu tahu itu. Tapi bertahun kemudian kamu sadar itu cara pertama kamu belajar melepaskan dengan lembut.", effects: { mental: 3, intelligence: 1 }, mood: "melancholy", flag: "teman_khayalan_selesai", endsRelationship: "teman_khayalan",
          memory: { text: "Kursi terakhir yang kamu siapkan untuk teman yang tak pernah ada.", tag: "teman_khayalan", mood: "melancholy" } },
      ]},
      { id: "lupakan", label: "Tidak memikirkannya lagi", outcomes: [
        { weight: 8, text: "Begitu saja, dia hilang dari hari-harimu tanpa kamu sadari kapan. Begitulah cara sebagian besar orang akan meninggalkan hidupmu nanti, bukan dengan pintu yang dibanting, tapi dengan kursi yang lama-lama berhenti disiapkan.", effects: { mental: -2 }, mood: "melancholy", flag: "teman_khayalan_selesai", endsRelationship: "teman_khayalan" },
        { weight: 8, text: "Suatu hari, ibu bertanya 'mana temanmu?' dan kamu balik bertanya 'teman yang mana?' Dari raut wajahnya kamu tahu kamu baru saja kehilangan sesuatu tanpa merasakannya.", effects: { mental: -2, intelligence: 1 }, mood: "melancholy", flag: "teman_khayalan_selesai", endsRelationship: "teman_khayalan" },
      ]},
    ],
  }),

e({
    id: "robot_kembali", category: "nostalgia", pool: "callback", rarity: "rare",
    ageMin: 25, ageMax: 34, requireFlag: "robot_kecil",
    requireAnyFlag: ["punya_rumah", "tinggal_kos", "menikah"],
    mood: "warm",
    forceCallbackTag: "robot_kecil",
    title: "Robot Kecil itu Lagi",
    prompt: "Saat membongkar rumah lama orangtua, kamu menemukan robot kecil dari masa kanak-kanak. Kakinya patah satu, tapi senyumnya masih sama.",
    choices: [
      { id: "bawa", label: "Bawa pulang, taruh di meja kerja", outcomes: [
        { weight: 8, text: "Robot itu mengawasimu mengetik selama bertahun-tahun lagi. Kamu sering bicara dengannya, diam-diam.", effects: { mental: 5, happiness: 4 }, memory: { text: "Robot kecil yang akhirnya pulang.", tag: "robot_kecil", mood: "warm" } },
        { weight: 8, text: "Kamu lem kaki yang patah itu, kurang rapi tapi berdiri lagi. Di meja kerjamu, dia jadi saksi tahun-tahun tersibukmu.", effects: { mental: 5, happiness: 4 }, memory: { text: "Robot kecil berkaki lem yang berdiri lagi di meja kerjamu.", tag: "robot_kecil", mood: "warm" } },
      ]},
      { id: "simpan", label: "Simpan di kotak, tutup lagi", outcomes: [
        { weight: 8, text: "Ada bagian masa kecil yang lebih utuh kalau dibiarkan di dalam kotak.", effects: { mental: 2 }, mood: "melancholy" },
        { weight: 8, text: "Kamu tutup kotaknya, lalu membukanya lagi sekali untuk menatap senyum cat yang sudah pudar itu. Lalu kamu tutup untuk terakhir kali. Beberapa hal kita jaga justru dengan tidak menyentuhnya.", effects: { mental: 2 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "warung_lama", category: "nostalgia", pool: "callback", rarity: "uncommon",
    ageMin: 30, ageMax: 70, requireFlag: "warung_bu_tini", mood: "melancholy",
    title: "Warung Bu Tini",
    prompt: "Kamu lewat di jalan masa kecil. Warung kecil itu masih ada. Etalasenya lebih buram. Bu Tini? kamu tidak tahu.",
    choices: [
      { id: "mampir", label: "Mampir, beli sesuatu", outcomes: [
        { weight: 8, text: "Bu Tini masih hidup. Lebih kecil dan lebih lambat. Dia tidak ingat kamu, dan itu tidak apa-apa.", effects: { mental: 3, happiness: 4 }, memory: { text: "Bu Tini, masih di warungnya, tidak mengenalimu.", tag: "warung_lama", mood: "melancholy" } },
        { weight: 8, text: "Yang menjaga warungnya anak muda. Bu Tini sudah lama pergi. Kamu beli minuman dingin yang sama seperti dulu.", effects: { mental: -3, happiness: 1 }, mood: "melancholy" },
      ]},
      { id: "lewat", label: "Lewatkan saja", outcomes: [
        { weight: 8, text: "Spion menampilkan warung itu mengecil sampai hilang.", effects: { mental: -2 }, mood: "melancholy" },
        { weight: 8, text: "Kamu lewatkan, lalu memutar balik dua kilometer kemudian. Tapi kamu cuma memarkir di seberang dan menatapnya dari jauh, tidak turun. Ada nostalgia yang lebih aman dibiarkan jadi pemandangan.", effects: { mental: -1 }, mood: "melancholy" },
      ]},
    ],
  }),

e({
    id: "chat_terakhir", category: "nostalgia", pool: "callback", rarity: "rare",
    ageMin: 30, ageMax: 70, mood: "melancholy",
    title: "Scroll ke Bawah Lagi",
    prompt: (ctx) => {
      const v = [
        "Kamu scroll WhatsApp ke chat orang yang sudah tidak ada. Pesan terakhir kalian 'oke besok ya'. Besok itu tidak pernah datang.",
        "Jarimu berhenti di nama yang tidak akan pernah online lagi. Foto profilnya masih yang sama, diambil di hari yang kamu pun masih ingat.",
        "Tanpa sengaja kamu mengetik nama itu di kolom pencarian. Chat-nya muncul, lengkap, beku di pesan terakhir yang tak pernah sempat kalian lanjutkan.",
      ];
      return v[Math.floor(ctx.rand() * v.length)];
    },
    choices: [
      { id: "tutup", label: "Tutup aplikasi", outcomes: [
        { weight: 8, text: "Kamu menatap layar gelap. Wajahmu di pantulannya. Tidak ada kata yang muat.", effects: { mental: -4, happiness: -3 }, mood: "tragic" },
        { weight: 8, text: "Kamu kunci ponsel, tapi ibu jarimu sudah hafal jalan ke chat itu, dan besok kamu akan ke sana lagi. Berduka, ternyata, sebagian besar adalah mengunjungi ruangan yang sama sampai kamu sanggup mengikhlaskannya.", effects: { mental: -4, happiness: -2 }, mood: "tragic" },
      ]},
      { id: "kirim", label: "Tetap kirim pesan", outcomes: [
        { weight: 8, text: "Centangnya tidak akan pernah dua. Tapi mengetiknya saja sudah cukup malam itu.", effects: { mental: 4 }, memory: { text: "Pesan yang tidak akan terbaca, tapi tetap kamu kirim.", tag: "kehilangan", mood: "melancholy" }, mood: "melancholy" },
        { weight: 8, text: "Kamu kirim, bukan kabar, cuma 'hai.' Centangnya satu, abu-abu, selamanya. Tapi ada lega kecil yang aneh. Rasa rindu itu akhirnya keluar dari dadamu.", effects: { mental: 4 }, mood: "melancholy", memory: { text: "'Hai' yang kamu kirim ke centang yang tak akan pernah jadi dua.", tag: "kehilangan", mood: "melancholy" } },
      ]},
    ],
  }),

e({
    id: "kenangan_pensil", category: "nostalgia", pool: "callback", rarity: "rare",
    ageMin: 35, ageMax: 60, requireFlag: "pensil_biru_disimpan", mood: "melancholy",
    forceCallbackTag: "pensil_biru",
    title: "Laci Lama",
    prompt: "Kamu menemukan pensil biru kecil di laci kantor. Tumpul. Familiar. Kamu tidak ingat namanya lagi.",
    choices: [
      { id: "buang", label: "Buang", outcomes: [
        { weight: 8, text: "Kamu memegangnya sebentar, lalu tetap saja menyimpannya kembali. Entah kenapa ada yang berat.", effects: { mental: -2 } },
        { weight: 8, text: "Kamu benar-benar membuangnya kali ini, lalu menyesalinya sebelum tempat sampah ditutup. Tapi gengsi menahanmu mengambilnya lagi.", effects: { mental: -3 }, mood: "melancholy" },
      ]},
      { id: "simpan", label: "Letakkan kembali", outcomes: [
        { weight: 8, text: "Beberapa benda hanya ingin dilihat sekali setiap dekade.", effects: { mental: 1 }, mood: "melancholy" },
        { weight: 8, text: "Kamu raut sedikit. Isi grafitnya ternyata masih hidup setelah puluhan tahun. Kamu pakai menulis satu kata di nota, lalu menyimpannya lagi. Sebagian benda menolak untuk benar-benar habis.", effects: { mental: 2 }, mood: "melancholy" },
      ]},
      { id: "cari", label: "Cari namanya di Facebook", outcomes: [
        { weight: 8, text: "Kamu menemukan akun. Foto profilnya seorang anak kecil. Bukan dia, tapi anaknya.", effects: { happiness: -3 }, mood: "melancholy" },
        { weight: 8, text: "Tidak ketemu. Mungkin memang sudah waktunya tidak ketemu.", effects: { mental: 2 } },
      ]},
    ],
  }),

e({
    id: "teman_khayalan_pamit_dewasa", category: "pertemanan", pool: "callback", rarity: "uncommon",
    ageMin: 35, ageMax: 75, requireRelationship: "teman_khayalan", forbidFlag: "teman_khayalan_selesai",
    deferrable: true, mood: "melancholy",
    forceCallbackTag: "teman_khayalan",
    title: "Teman yang Tidak Pernah Kamu Antar Pulang",
    prompt: "Sudah puluhan tahun, dan baru sekarang kamu sadar kamu tidak pernah benar-benar mengantarnya pergi. Dia tidak hilang waktu kecil, kamu cuma berhenti menyebutnya.",
    choices: [
      { id: "antar", label: "Antar dia pergi sekarang, dengan benar", outcomes: [
        { weight: 8, text: "Kamu ucapkan terima kasih yang dulu tidak sempat. Bukan ke udara kosong lagi, tapi ke sesuatu di dalam dirimu yang menjaga kursi itu tetap hangat sampai orang-orang sungguhan mendudukinya. Perpisahan yang harusnya kamu lakukan di umur sepuluh, akhirnya selesai. Telat, tapi sah.", effects: { mental: 4, intelligence: 1 }, mood: "melancholy", flag: "teman_khayalan_selesai", endsRelationship: "teman_khayalan",
          memory: { text: "Perpisahan dengan teman khayalan, datang puluhan tahun terlambat.", tag: "teman_khayalan", mood: "melancholy" } },
        { weight: 8, text: "Kamu antar dia ke pintu yang tidak ada, lalu menutupnya pelan-pelan. Konyol, di umur segini, sendirian di ruang tamu. Tapi ada yang lega, ternyata tidak ada yang terlalu terlambat untuk diberi akhir yang layak, bahkan teman yang tidak pernah ada sekalipun.", effects: { mental: 3, happiness: 1 }, mood: "melancholy", flag: "teman_khayalan_selesai", endsRelationship: "teman_khayalan",
          memory: { text: "Kamu antar teman yang tak pernah ada ke pintu yang tak pernah ada.", tag: "teman_khayalan", mood: "melancholy" } },
      ]},
      { id: "akui", label: "Akui kamu menyimpannya terlalu lama", outcomes: [
        { weight: 8, text: "Kamu akui pada diri sendiri kenapa dia bertahan selama ini. Dia memegang tempat untuk kesepian yang tidak pernah kamu beri nama. Melepasnya berarti mengakui kesepian itu, dan anehnya, justru pengakuan itu yang meringankanmu.", effects: { mental: 2, intelligence: 2 }, mood: "melancholy", flag: "teman_khayalan_selesai", endsRelationship: "teman_khayalan" },
        { weight: 8, text: "Lalu kamu menyadari, bahwa kamu sudah berhenti menyisakan tempat untuk seseorang yang tidak pernah ada.", effects: { mental: 2 }, mood: "melancholy", flag: "teman_khayalan_selesai", endsRelationship: "teman_khayalan" },
      ]},
    ],
  }),

e({
    id: "callback_surat_kapsul", category: "nostalgia", pool: "callback", rarity: "uncommon",
    ageMin: 60, ageMax: 88, requireFlag: "surat_masa_depan", deferrable: true, mood: "melancholy",
    forceCallbackTag: "surat_kapsul",
    title: "Surat yang Akhirnya Dibuka",
    prompt: (ctx) => ctx.state.flags.surat_isi_pesan
      ? "Di antara barang lama, sebuah amplop dengan tulisan tanganmu yang masih kanak-kanak, 'Untuk aku yang sudah dewasa.' Kamu hampir lupa pernah menulisnya. Tanganmu yang sekarang berkerut memegang beberapa patah kata dari tangan yang dulu mungil."
      : "Di antara barang lama, sebuah amplop dengan tulisan tanganmu yang masih kanak-kanak, 'Untuk aku yang sudah dewasa.' Kamu hampir lupa pernah menulisnya. Tanganmu yang sekarang berkerut memegang daftar janji-janji dari tangan yang dulu mungil dan begitu yakin.",
    choices: (ctx) => ctx.state.flags.surat_isi_pesan
      ? [
        { id: "buka", label: "Buka, baca pelan-pelan", outcomes: [
          { weight: 8, text: "Cuma tiga kata, persis seperti yang samar kamu ingat, 'Semoga kamu senang.' Tidak ada daftar cita-cita, tidak ada tuntutan. Anak sekecil itu sudah tahu mendoakan satu-satunya hal yang penting.", effects: { mental: 4, happiness: 3 }, mood: "melancholy",
            memory: { text: "'Semoga kamu senang' yang akhirnya kamu terima di usia tua.", tag: "surat_kapsul", mood: "melancholy" } },
          { weight: 8, text: "'Semoga kamu senang.' Kamu baca tiga kata itu berkali-kali. Anak itu tidak memintamu jadi hebat atau kaya, cuma senang. Kamu balas dalam hati 'terima kasih sudah tidak menuntut apa-apa selain itu.'", effects: { mental: 5, happiness: 2 }, mood: "warm",
            memory: { text: "Doa tiga kata dari dirimu yang kecil, akhirnya kamu terima.", tag: "surat_kapsul", mood: "warm" } },
        ]},
        { id: "simpan", label: "Pegang, tapi belum sanggup membukanya", outcomes: [
          { weight: 8, text: "Kamu tahu persis isinya cuma beberapa patah kata, dan justru itu yang membuatmu belum sanggup. Harapan sesederhana itu kadang yang paling berat dijawab. Kamu simpan lagi, masih tersegel.", effects: { mental: 2 }, mood: "melancholy" },
          { weight: 8, text: "Kamu pegang amplop tipis itu sepanjang sore. Begitu sedikit yang ditulis, begitu banyak yang diharapkannya. Kamu menyimpannya lagi. Mungkin besok kamu cukup berani untuk bertemu dengan anak yang dulu menulisnya.", effects: { mental: 2 }, mood: "melancholy" },
        ]},
      ]
      : [
        { id: "buka", label: "Buka, baca pelan-pelan", outcomes: [
          { weight: 8, text: "Daftar panjang itu memintamu hal-hal besar. Sebagian kamu tepati, sebagian tidak. Yang membuat matamu panas bukan cita-cita yang gagal, tapi betapa yakinnya kamu dulu semuanya akan baik-baik saja.", effects: { mental: 4, happiness: 3 }, mood: "melancholy",
            memory: { text: "Daftar cita-cita dari dirimu yang kecil, akhirnya kamu buka.", tag: "surat_kapsul", mood: "melancholy" } },
          { weight: 8, text: "Di antara cita-cita besar itu satu baris kecil 'bisa main terus.' Kamu menimbang apakah kamu menepatinya, lalu tertawa kecil. Kamu mulai menepatinya hari ini juga, semoga belum terlambat untuk surat yang sabar menunggu puluhan tahun.", effects: { mental: 5, happiness: 4 }, mood: "warm",
            memory: { text: "Janji masa kecil 'jangan lupa main' yang baru kamu tepati di usia tua.", tag: "surat_kapsul", mood: "warm" } },
        ]},
        { id: "simpan", label: "Pegang, tapi belum sanggup membukanya", outcomes: [
          { weight: 8, text: "Kamu membayangkan tulisanmu sendiri dan itu sudah cukup membuatmu duduk lama. Kamu menyimpannya kembali, masih tersegel. Ada percakapan dengan diri sendiri yang lebih baik ditunda.", effects: { mental: 2 }, mood: "melancholy" },
          { weight: 8, text: "Kamu pegang amplop itu sepanjang sore, lalu menyimpannya lagi. Mungkin besok. Atau mungkin saat kamu cukup berani bertemu anak yang dulu menulis daftar cita-cita itu.", effects: { mental: 2 }, mood: "melancholy" },
      ]},
    ],
  }),
];
