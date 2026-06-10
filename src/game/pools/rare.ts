import { LifeEvent } from "../types";
import { e } from "./_helpers";

// Pool langka & absurd. Rarity sangat rendah.
export const RARE_POOL: LifeEvent[] = [
  e({
    id: "salah_kirim_vn", category: "absurd", pool: "rare", rarity: "rare",
    ageMin: 16, ageMax: 70,
    title: "Voice Note Salah Sasaran",
    prompt: "Voice note umpatan untuk sahabatmu, terkirim ke grup keluarga besar.",
    choices: [
      { id: "klarifikasi", label: "Kirim klarifikasi panjang", outcomes: [
        { weight: 8, text: "Tante membalas: 'tidak apa-apa, nak.' Kamu tahu itu apa-apa.", effects: { social: -4, mental: -3 } },
        { weight: 8, text: "Klarifikasimu malah memperjelas semuanya. Om-om mulai bertanya 'maksudnya gimana?' dan jawabanmu makin aneh tiap balasan. Akhirnya kamu matikan ponsel, pura-pura hilang sinyal selama tiga hari.", effects: { social: -4, mental: -2 } },
      ]},
      { id: "delete", label: "Delete cepat-cepat", outcomes: [
        { weight: 8, text: "Sudah ada 7 yang dengar. Tante membuat screenshot.", effects: { social: -5 } },
        { weight: 8, text: "'Pesan ini telah dihapus' justru mengundang lebih banyak penasaran daripada pesannya sendiri. Sepupu-sepupu jadi detektif dadakan. Kamu belajar, di keluarga besar, yang dihapus selalu lebih ramai dibahas daripada yang dibiarkan.", effects: { social: -4, happiness: -1 } },
      ]},
      { id: "tertawa", label: "Tertawa, ngaku salah", outcomes: [
        { weight: 8, text: "Anehnya, semua tertawa. Grup keluarga jadi lebih hidup setelah itu.", effects: { social: 5, happiness: 4 } },
        { weight: 8, text: "Kamu ngaku salah sambil tertawa, dan satu om malah mengirim voice note umpatannya sendiri yang jauh lebih parah. Grup itu pecah ketawa sampai tengah malam. Aib jadi perekat, kadang.", effects: { social: 6, happiness: 5 } },
      ]},
    ],
  }),

  e({
    id: "viral_bakso", category: "absurd", pool: "rare", rarity: "veryRare",
    ageMin: 18, ageMax: 50, title: "Video 14 Detik",
    prompt: "Video kamu makan bakso dengan ekspresi aneh viral. 4 juta views dalam 24 jam.",
    choices: [
      { id: "manfaatkan", label: "Buka endorse", outcomes: [
        { weight: 8, text: "Sebulan kamu kaya. Setahun kemudian, tidak ada yang ingat.", effects: { wealth: 15, mental: -3 }, achievement: "Bintang 30 Hari" },
        { weight: 8, text: "Endorse pertama obat kuat, kedua pinjol. Kamu terima semua, lalu suatu pagi membaca kolom komentar dan menutup laptop dengan tangan dingin. Uangnya nyata, harga dirinya kamu hitung belakangan.", effects: { wealth: 12, mental: -6 }, mood: "melancholy" },
      ]},
      { id: "diam", label: "Hapus akun", outcomes: [
        { weight: 8, text: "Kamu kembali makan bakso dengan tenang.", effects: { mental: 5, happiness: 4 } },
        { weight: 8, text: "Kamu biarkan akunnya tenggelam sendiri tanpa menghapusnya. Sesekali ada yang mengenalimu di warung 'eh, yang bakso itu ya?' Kamu tersenyum, mengangguk, lalu kembali jadi orang biasa.", effects: { mental: 4, happiness: 3 } },
      ]},
    ],
  }),

  e({
    id: "existensial_bintang", category: "eksistensial", pool: "rare", rarity: "existential",
    ageMin: 18, ageMax: 90, deferrable: true, mood: "hope",
    title: "Langit Tanpa Lampu Kota",
    prompt: "Listrik mati di seluruh kota. Kamu keluar. Untuk pertama kali, kamu melihat bintang sebanyak ini. Sesuatu di dadamu pecah pelan, dengan cara yang baik.",
    choices: [
      { id: "diam", label: "Hanya berdiri, menatap", outcomes: [
        { weight: 8, text: "Kamu menyadari betapa kecilnya semua yang kamu khawatirkan. Tidak menghapusnya, tapi mengubah ukurannya.", effects: { mental: 15, happiness: 10 }, achievement: "Pernah Melihat Langit", memory: { text: "Malam listrik mati, dan kamu melihat bintang.", tag: "langit", mood: "hope" } },
        { weight: 8, text: "Kamu duduk di bangku taman, dan untuk pertama kalinya sejak sekian lama tidak memikirkan apa pun. Hanya cahaya dari bintang-bintang yang barangkali sudah lama mati, tapi masih sempat menemukanmu malam ini.", effects: { mental: 14, happiness: 11 }, mood: "hope", achievement: "Pernah Melihat Langit", memory: { text: "Duduk di bangku taman menatap cahaya bintang yang menemukanmu tepat waktu.", tag: "langit", mood: "hope" } },
      ]},
    ],
  }),

  e({
    id: "nft_pantun", category: "absurd", pool: "rare", rarity: "veryRare",
    ageMin: 22, ageMax: 45,
    title: "Diajak Join Startup",
    prompt: "Kawan SMA mengajakmu join startup AI penghasil pantun NFT. 'Ini akan ubah peradaban,' katanya, serius.",
    choices: [
      { id: "ikut", label: "Resign, ikut", outcomes: [
        { weight: 8, text: "Tiga bulan kemudian, kantor kosong. Salah satu founder pindah ke Bali, satunya hilang.", effects: { wealth: -10, mental: -4 }, mood: "melancholy" },
        { weight: 8, text: "Mengejutkan. Laku. Kamu cuan. Pantunnya tetap jelek.", effects: { wealth: 25 }, achievement: "Crypto Pantun" },
      ]},
      { id: "tolak", label: "Tolak halus", outcomes: [
        { weight: 8, text: "Hubungan kalian renggang. Tahun depan dia menghubungi soal MLM skincare.", effects: { social: -2, mental: 2 } },
        { weight: 8, text: "Kamu tolak, dan dia menatapmu seperti kamu baru menolak masa depan. Dua tahun berikutnya dia menemukan 'peluang' lain, lalu berikutnya lagi. Kamu jadi penonton tetap dari kursi yang aman.", effects: { social: -2, mental: 2 } },
      ]},
    ],
  }),

  e({
    id: "p_dari_mantan", category: "absurd", pool: "rare", rarity: "rare",
    ageMin: 25, ageMax: 50,
    title: "Notifikasi Pukul 23:47",
    prompt: "Mantan, 11 tahun tidak bertemu. Pesannya hanya 'P'.",
    choices: [
      { id: "balas", label: "Balas 'P juga'", outcomes: [
        { weight: 8, text: "Percakapan dimulai lagi. Tidak ada yang baik, tidak ada yang buruk. Hanya gema masa lalu.", effects: { mental: -3, happiness: 1 }, mood: "melancholy" },
        { weight: 8, text: "'P juga.' Lalu hening dua hari, satu pertanyaan basa-basi, hening lagi. Percakapan itu mati pelan, seperti yang pertama dulu. Bedanya, kali ini kamu tidak ikut mati bersamanya.", effects: { mental: -2, happiness: 1 }, mood: "melancholy" },
      ]},
      { id: "abaikan", label: "Diamkan", outcomes: [
        { weight: 8, text: "Pagi datang. Kamu menghapus chat-nya tanpa membuka.", effects: { mental: 4 } },
        { weight: 8, text: "Kamu lihat notifikasinya, lalu menaruh ponsel terbalik dan kembali tidur. Paginya kamu sadar kamu tidak penasaran sama sekali. Bukan marah, bukan rindu, hanya tidak penasaran. Itu tanda kamu benar-benar sudah selesai.", effects: { mental: 5 } },
      ]},
      { id: "block", label: "Block", outcomes: [
        { weight: 8, text: "Selesai sebelum dimulai. Pilihan terdewasa yang pernah kamu buat.", effects: { mental: 6 } },
        { weight: 8, text: "Jarimu sempat ragu di tombol itu. Bukan karena masih sayang, tapi karena memblokir terasa terlalu dramatis untuk sesuatu yang sudah tidak berarti. Kamu tekan juga. Drama kecil demi ketenangan besar.", effects: { mental: 5 } },
      ]},
    ],
  }),

  e({
    id: "admin_rt", category: "absurd", pool: "rare", rarity: "rare",
    ageMin: 30, ageMax: 65, deferrable: true,
    title: "Diangkat Tanpa Diminta",
    prompt: "Tanpa pemilihan jelas, kamu menjadi admin grup WA RT. Notifikasi tidak pernah berhenti.",
    choices: [
      { id: "serius", label: "Jalankan dengan serius", outcomes: [
        { weight: 8, text: "RT-mu jadi paling rapi se-kelurahan. Kamu tidak pernah lagi tidur sebelum jam 1.", effects: { social: 5, mental: -4 }, achievement: "Pahlawan RT" },
        { weight: 8, text: "Kamu buat jadwal ronda digital, spreadsheet iuran, polling lokasi 17-an. RT-mu jadi percontohan. Istilah 'micro-manage' baru kamu pelajari saat seseorang di rumah memakainya untuk menggambarkanmu.", effects: { social: 6, mental: -5, discipline: 3 } },
      ]},
      { id: "diamkan", label: "Mute grup, pura-pura tidak baca", outcomes: [
        { weight: 8, text: "Tetangga tetap memanggilmu 'pak/bu admin'. Kamu pasrah.", effects: { mental: 1 } },
        { weight: 8, text: "Grup itu berkembang biak. Grup RT, grup ibu-ibu, grup bapak-bapak, grup khusus galang dana. Kamu admin di semuanya, tidak aktif di satu pun. Mute, ternyata, juga sejenis jabatan publik.", effects: { mental: 1, social: 1 } },
      ]},
      { id: "mundur", label: "Mengundurkan diri secara resmi", outcomes: [
        { weight: 8, text: "Tidak ada yang menerima pengunduranmu. Demokrasi gagal.", effects: { mental: -2 } },
        { weight: 8, text: "Pesan pengunduranmu yang sopan dibalas satu jempol, lalu dilupakan, lalu kamu di-tag lagi soal got mampet keesokan harinya. Jabatan yang tidak bisa kamu lepaskan karena tidak ada yang sudi menerimanya.", effects: { mental: -1, social: 1 } },
      ]},
    ],
  }),
];
