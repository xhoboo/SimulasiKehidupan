import { LifeEvent } from "../types";
import { e, kerjaCtx } from "./_helpers";

export const EMOTION_POOL: LifeEvent[] = [
  e({
    id: "semua_hari_sama", category: "eksistensial", pool: "emotion", rarity: "uncommon",
    ageMin: 25, ageMax: 45, title: "Senin, Lagi",
    mood: "melancholy",
    prompt: "Kamu mulai merasa semua hari terasa sama. Bahkan akhir pekan terasa seperti pengulangan.",
    choices: [
      { id: "traveling", label: "Beli tiket, pergi", outcomes: [
        { weight: 8, text: "Kamu menangis di lobi hotel murah di kota yang tidak kamu kenal. Aneh, tapi melegakan.", effects: { happiness: 5, wealth: -6, mental: 6 }, memory: { text: "Menangis di hotel murah kota asing.", tag: "traveling", mood: "melancholy" } },
        { weight: 8, text: "Kamu pulang dengan oleh-oleh dan rasa kosong yang sama, hanya lebih lelah.", effects: { mental: -3, wealth: -6 } },
      ]},
      { id: "hapus_sosmed", label: "Hapus semua media sosial", outcomes: [
        { weight: 8, text: "Tiga hari pertama, cemas. Sebulan kemudian, tenang yang asing.", effects: { mental: 8, happiness: 4 } },
        { weight: 8, text: "Kamu memperhatikan hal-hal kecil lagi. Uap kopi, suara hujan, wajah orang yang sedang bicara padamu.", effects: { mental: 7, happiness: 5, social: 2 }, mood: "warm" },
      ]},
      { id: "fokus_kerja", label: "Tenggelam dalam pekerjaan", outcomes: [
        { weight: 8, text: "Promosi datang. Tidur tidak.", effects: { wealth: 5, mental: -5 } },
        { weight: 8, text: "Sibuk itu obat bius yang efektif. Tapi setelah proyeknya selesai, ada hening yang terasa lebih nyaring.", effects: { wealth: 6, mental: -6, happiness: -2 }, mood: "melancholy" },
      ]},
      { id: "telp_lama", label: "Hubungi teman lama", outcomes: [
        { weight: 8, text: "Dia mengangkat, kaget kamu menelepon alih-alih chat. Kalian mengobrol dua jam soal hal-hal sepele yang ternyata tidak sepele.", effects: { social: 6, happiness: 5, mental: 4 }, mood: "warm" },
        { weight: 8, text: "Nomornya sudah berbeda orang.", effects: { mental: -3 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "burnout", category: "eksistensial", pool: "emotion", rarity: "uncommon",
    ageMin: 25, ageMax: 50, requireMentalMax: 35, title: "Tubuh yang Memberontak",
    mood: "melancholy",
    prompt: "Pagi-pagi, kamu menatap langit-langit dan tidak bisa bangkit. Bukan malas. Tetapi sesuatu yang lebih besar dari malas.",
    choices: (ctx) => [
      { id: "izin", label: "Izin sehari", outcomes: [
        { weight: 8, text: "Sehari menjadi seminggu. Seminggu menjadi pertanyaan baru tentang segalanya.", effects: { mental: 4, happiness: 2 }, flag: "burnout_1_done" },
        { weight: 4, text: "Tubuhmu di kasur, kepalamu di email kantor. Tapi setidaknya kamu mulai mengaku ada yang salah.", effects: { mental: 2, health: 1 }, flag: "burnout_1_done" },
      ]},
      { id: "paksakan", label: "Paksakan", outcomes: [
        { weight: 8, text: `Kamu sampai ${kerjaCtx(ctx.state).diTempat}. Tidak ada yang ingat namamu hari itu.`, effects: { mental: -8, health: -4 }, mood: "tragic", flag: "burnout_1_done" },
        { weight: 4, text: "Hari itu lewat seperti biasa, tidak ada yang runtuh. Justru itu yang menakutkan, betapa mudah kamu menyembunyikannya.", effects: { mental: -7, health: -3 }, flag: "burnout_1_done", mood: "tragic" },
      ]},
      { id: "resign", label: "Tulis surat resign", outcomes: [
        { weight: 8, text: "Tombol kirim ditekan. Beban menguap. Tabungan juga, sebentar lagi.", effects: { mental: 10, wealth: -8, happiness: 6 }, flag: "burnout_1_done" },
        { weight: 4, text: "Lega datang dulu. Panik menyusul saat tagihan ternyata tidak ikut resign. Tapi malam-malammu kembali jadi milikmu.", effects: { mental: 8, wealth: -9, happiness: 4 }, flag: "burnout_1_done" },
      ]},
    ],
  }),

  e({
    id: "tawa_tanpa_alasan", category: "eksistensial", pool: "emotion", rarity: "rare",
    ageMin: 25, ageMax: 60, mood: "hope",
    title: "Tertawa Sendiri",
    prompt: "Di tengah kemacetan, kamu tiba-tiba tertawa. Tidak ada yang lucu. Tapi juga semua terasa lucu.",
    choices: [
      { id: "lanjutkan", label: "Biarkan mengalir", outcomes: [
        { weight: 8, text: "Sepanjang sisa hari kamu merasa ringan. Tidak tahu kenapa. Tidak perlu tahu.", effects: { mental: 6, happiness: 6 }, memory: { text: "Tertawa sendiri di kemacetan, tanpa alasan.", tag: "tenang", mood: "hope" } },
        { weight: 6, text: "Kamu biarkan tawa itu mengalir sampai habis. Tidak semua kebahagiaan butuh sebab. Sebagian datang seperti hujan di musim yang salah.", effects: { mental: 6, happiness: 7 }, mood: "hope", memory: { text: "Tawa tanpa sebab yang kamu biarkan sampai habis.", tag: "tenang", mood: "hope" } },
      ]},
      { id: "tahan", label: "Tahan, takut dianggap aneh", outcomes: [
        { weight: 8, text: "Tawa itu padam. Kamu kembali ke wajah dewasa yang serius itu.", effects: { mental: 1 } },
        { weight: 4, text: "Wajah serius terpasang lagi. Tapi sudut bibirmu naik sendiri sepanjang hari. Sulit menahan sesuatu yang murni.", effects: { mental: 2, happiness: 1 } },
      ]},
    ],
  }),

  e({
    id: "burnout_2", category: "eksistensial", pool: "emotion", rarity: "uncommon",
    ageMin: 27, ageMax: 52, requireFlag: "burnout_1_done", requireMentalMax: 30, title: "Ini Lagi",
    mood: "melancholy",
    prompt: "Bukan pertama kali. Kamu kenal rasa ini. Seperti bertemu kembali dengan seseorang yang tak pernah kamu undang. Badanmu menolak diajak kerja sama, pikiranmu terlalu penuh untuk diisi apa pun.",
    choices: [
      { id: "akui", label: "Akui pada diri sendiri 'ini serius!'", outcomes: [
        { weight: 4, text: "Terapi, atau jeda. Kali ini kamu tidak boleh berpura-pura bisa melewatinya sendirian.", effects: { mental: 6, happiness: 3 }, flag: "burnout_2_done" },
        { weight: 8, text: "Mengakuinya keras-keras ternyata bagian tersulit. Setelah itu: satu janji terapi, satu malam tidur penuh. Belum sembuh, tapi mulai.", effects: { mental: 7, happiness: 2 }, flag: "burnout_2_done" },
      ]},
      { id: "tahan_lagi", label: "Tahan saja. Dulu juga lewat.", outcomes: [
        { weight: 8, text: "Lewat memang, tapi meninggalkan sesuatu setiap kali muncul. Seperti rem yang dipakai terlalu keras dan terlalu sering.", effects: { mental: -6, health: -5 }, mood: "tragic", flag: "burnout_2_done" },
        { weight: 8, text: "Lewat lagi. Tapi kali ini kamu lihat polanya. Seperti tulang yang patah di tempat yang sama, makin bengkok tiap sembuh.", effects: { mental: -6, health: -6 }, flag: "burnout_2_done", mood: "tragic" },
      ]},
      { id: "cerita", label: "Ceritakan ke seseorang yang dipercaya", outcomes: [
        { weight: 8, text: "Dia tidak menyela sedikitpun. Tidak memberikan solusi. Hanya hadir. Itu sudah lebih dari yang kamu butuhkan malam itu.", effects: { mental: 8, social: 4 }, flag: "burnout_2_done" },
        { weight: 8, text: "Kamu cerita, dan dia ternyata pernah berada di tempat yang sama. Bukan nasihat yang dia beri, tapi satu kalimat yang menempel 'kamu nggak harus kuat terus.'", effects: { mental: 8, social: 3 }, flag: "burnout_2_done", mood: "warm" },
      ]},
    ],
  }),

  e({
    id: "krisis_30", category: "eksistensial", pool: "emotion", rarity: "uncommon",
    ageMin: 28, ageMax: 33, mood: "melancholy",
    title: "Jam 3 Pagi",
    prompt: "Kamu terbangun. Langit-langit yang sama. Pertanyaan yang sama, 'Apakah ini saja?'",
    choices: [
      { id: "terapi", label: "Cari psikolog besok pagi", outcomes: [
        { weight: 8, text: "Butuh waktu. Tapi sesuatu di dalam dirimu mulai mereda.", effects: { mental: 10, wealth: -3 }, achievement: "Cukup Berani Bertanya" },
        { weight: 8, text: "Yang pertama tidak cocok. Yang kedua membuatmu menangis di sesi ketiga, entah kenapa. Pelan-pelan ada yang mencair.", effects: { mental: 8, wealth: -4, happiness: 2 } },
      ]},
      { id: "alkohol", label: "Buka botol di kulkas", outcomes: [
        { weight: 8, text: "Tidur lagi. Besok tetap datang, seperti biasa.", effects: { health: -4, mental: -3 } },
        { weight: 8, text: "Pagi datang dengan kepala lebih berat dan pertanyaan yang sama. Kamu berjanji ini yang terakhir, seperti kemarin.", effects: { health: -5, mental: -4 }, mood: "melancholy" },
      ]},
      { id: "ubah", label: "Resign, pergi ke gunung", outcomes: [
        { weight: 8, text: "Pemandangan indah. Insightnya: tidak ada insight.", effects: { happiness: 4, wealth: -5, mental: 3 } },
        { weight: 8, text: "Di puncak, kamu menangis sebentar lalu tertawa. Sesuatu lepas.", effects: { mental: 12, happiness: 8 }, mood: "hope" },
      ]},
      { id: "scroll", label: "Scroll Instagram sampai pagi", outcomes: [
        { weight: 8, text: "Semua orang lebih sukses. Atau hanya lebih pandai berpura-pura?", effects: { mental: -5, happiness: -3 } },
        { weight: 8, text: "Jam empat pagi, baterai 6%. Layar mati sendiri. Di gelap itu wajahmu memantul di kaca, lebih tua dari yang kamu rasa.", effects: { mental: -4, health: -2, happiness: -2 }, mood: "melancholy" },
      ]},
    ],
  }),

  e({
    id: "burnout_3", category: "eksistensial", pool: "emotion", rarity: "rare",
    ageMin: 30, ageMax: 55, requireFlag: "burnout_2_done", requireMentalMax: 25, title: "Sudah Tidak Mengejutkan",
    mood: "tragic",
    prompt: "Kamu tidak lagi kaget. Tubuh yang berhenti, kepala yang kosong, hari-hari yang terasa seperti tembok. Ini sudah terlalu familiar. Yang aneh justru adalah kamu masih di sini.",
    choices: [
      { id: "bantuan", label: "Cari bantuan profesional, serius kali ini", outcomes: [
        { weight: 8, text: "Butuh beberapa bulan untuk mulai terasa berbeda. Pelan, tidak dramatis, tapi nyata.", effects: { mental: 12, wealth: -5, happiness: 5 }, mood: "hope", achievement: "Bertahan Lebih dari yang Kamu Kira", flag: "burnout_3_done" },
        { weight: 8, text: "Kali ini kamu terus datang, bahkan di minggu yang terasa percuma. Pemulihan ternyata spiral, titik yang sama berulang, sedikit lebih tinggi tiap putaran.", effects: { mental: 11, wealth: -5, happiness: 4 }, flag: "burnout_3_done", mood: "hope" },
      ]},
      { id: "pasrah", label: "Biarkan berlalu sendiri. Seperti biasanya.", outcomes: [
        { weight: 8, text: "Berlalu memang. Tapi 'seperti biasanya' ini mulai terasa lebih gelap dari sebelumnya.", effects: { mental: -10, health: -6 }, flag: "burnout_3_done", mood: "tragic" },
        { weight: 8, text: "Kamu biarkan berlalu, seperti biasa. Tapi 'biasa' itu sekarang punya dasar yang lebih rendah dari sebelumnya. Dan terus lebih rendah.", effects: { mental: -9, health: -6 }, flag: "burnout_3_done", mood: "tragic" },
      ]},
      { id: "ubah_hidup", label: "Ubah sesuatu yang fundamental. Pekerjaan, rutinitas, semuanya", outcomes: [
        { weight: 8, text: "Kamu berhenti dari hal yang menghabisimu. Rutinitas baru, orang-orang baru. Tubuhmu butuh waktu untuk percaya kamu tidak sedang lari.", effects: { mental: 7, wealth: -10, happiness: 4 }, flag: "burnout_3_done" },
        { weight: 8, text: "Satu hal besar berubah. Tidak menyembuhkan apa-apa langsung. Tapi melepas beban itu melegakan dengan caranya sendiri.", effects: { mental: 6, wealth: -8, happiness: 3 }, flag: "burnout_3_done" },
      ]},
    ],
  }),
];
