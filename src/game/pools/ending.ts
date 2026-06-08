import { GameState } from "../types";
import { deriveTraits } from "../engine";

// ============================================================================
// Pool epilog (batu nisan). Menyatukan tiga teks yang dulu tersebar:
//   - title         : judul di layar "IN MEMORIAM"
//   - causeOfDeath   : keterangan singkat "{umur} tahun · {causeOfDeath}"
//   - epitaph        : paragraf epitaf di bawah judul
// Dirender oleh DeathScreen di pages/Game.tsx lewat computeEnding(state).
//
// Prinsip: ketiganya harus SALING MENYAMBUNG dengan dua hal —
//   1) NARASI kematian (event mana di DEATH_POOL yang barusan terpicu). Event
//      kematian punya id "death_*"; id terakhir di history adalah adegan sekarat
//      yang baru saja dialami pemain. Maka batu nisan bisa menggemakan adegan itu
//      alih-alih memberi epitaf generik yang kadang BERTENTANGAN dengan adegan
//      (mis. mati dipeluk anak yang sempat pulang, tapi epitaf malah menyalahkan
//      "pintu yang tak pernah dibuka").
//   2) KEADAAN hidup pemain (stats/flags/relasi/sifat). Untuk kematian yang
//      generik (mati di pagi biasa, mati mendadak paruh baya) adegan sekaratnya
//      netral, jadi epitaf diturunkan dari jalan hidup lewat endingByState().
//
// Aturan gabung di computeEnding():
//   reflection (title+epitaph) = entri-adegan bila event itu punya, kalau tidak
//                                → endingByState (jalan hidup).
//   causeOfDeath               = frasa khas per-event; fallback ke kalimat pertama
//                                outcome sekarat untuk event tak terpetakan.
// ============================================================================

export interface Ending {
  title: string;
  causeOfDeath: string;
  epitaph: string;
}

type Reflection = { title: string; epitaph: string };
interface EndingEntry {
  // Frasa singkat sebab/keadaan kematian, menyambung adegan sekarat.
  cause: (s: GameState) => string;
  // Refleksi batu nisan khas adegan ini. Bila kosong, dipakai endingByState
  // supaya kematian generik tetap membaca jalan hidup pemain.
  reflection?: (s: GameState) => Reflection;
}

// Apakah pasangan masih hidup saat pemain pergi (untuk death_bersama_pasangan).
function pasanganHidup(s: GameState): boolean | undefined {
  return s.relationships.find((r) => r.id === "pasangan")?.alive;
}

// Entri per-event kematian. Kunci = LifeEvent.id di DEATH_POOL (death.ts).
const DEATH_ENDINGS: Record<string, EndingEntry> = {
  death_muda: {
    cause: () => "Pergi sebelum sempat mengeja dunia.",
    reflection: () => ({
      title: "Bab Pertama yang Ditutup Terlalu Cepat",
      epitaph: "Hidup yang baru saja akan dimulai, sudah harus pamit. Tidak ada yang pernah benar-benar siap untuk perpisahan sependek ini.",
    }),
  },

  death_langit: {
    cause: () => "Menatap langit yang sama, untuk terakhir kali.",
    reflection: () => ({
      title: "Kembali ke Malam Berbintang",
      epitaph: "Kamu pergi ke arah yang dulu kamu tatap dari balik jendela saat listrik mati: luas, gelap, penuh titik cahaya. Ternyata ia tidak sejauh yang kamu kira.",
    }),
  },

  death_anak_jauh_kembali: {
    cause: () => "Anakmu sempat datang sebelum kamu pergi.",
    reflection: () => ({
      title: "Yang Sempat Diperbaiki",
      epitaph: "Tidak semua jarak terbayar lunas. Tapi pintu yang kamu kira sudah tertutup selamanya, sempat terbuka sekali lagi — dan satu kali itu cukup.",
    }),
  },

  death_teman_khayalan: {
    cause: () => "Dijemput yang pertama kamu ciptakan.",
    reflection: () => ({
      title: "Yang Pertama, yang Terakhir",
      epitaph: "Sosok yang dulu hanya kamu yang bisa melihatnya kembali untuk mengantar. Kamu menutup hidup ditemani hal pertama yang pernah kamu buat dari ketiadaan. Ada simetri ganjil yang menenangkan di situ.",
    }),
  },

  death_sekolah: {
    cause: () => "Pergi saat dunia baru saja terbuka.",
    reflection: () => ({
      title: "Bangku yang Besok Kosong",
      epitaph: "Ada nama yang besok tidak dipanggil saat absen, dan ruang di barisan tengah yang tak pernah benar-benar terisi lagi. Sebagian temanmu akan mengingatmu seumur hidup — sejenis keabadian yang tak pernah kamu minta.",
    }),
  },

  death_kuliah: {
    cause: () => "Berhenti di tengah mencari arah.",
    reflection: () => ({
      title: "Yang Belum Sempat Jadi Siapa-Siapa",
      epitaph: "Kamu pergi sebelum tahu akan menjadi siapa. Mungkin tidak ada yang benar-benar tahu — kebanyakan orang hanya diberi waktu lebih lama untuk berpura-pura tahu.",
    }),
  },

  death_paruh_baya: {
    cause: () => "Berhenti di tengah kalimat hidupmu.",
  },
  death_paruh_mendadak: {
    cause: () => "Pergi di tengah hari biasa, tanpa sempat pamit.",
  },
  death_paruh_lelah: {
    cause: () => "Mesin tubuh yang aus sebelum waktunya.",
  },
  death_paruh_sempat: {
    cause: () => "Singkat, tapi sempat.",
    reflection: () => ({
      title: "Singkat, Tapi Cukup",
      epitaph: "Hidupmu tidak panjang, tapi kamu sempat: mencintai seseorang, tertawa sampai sakit perut, menjadi penting bagi setidaknya satu orang. Tidak semua yang singkat berarti belum selesai.",
    }),
  },

  death_terapi: {
    cause: () => "Berdamai dengan kepalamu sendiri, akhirnya.",
    reflection: () => ({
      title: "Pulang ke Diri Sendiri",
      epitaph: "Suara di dalam dirimu yang dulu kejam itu belajar berbicara lebih lembut. Kamu pergi sebagai orang yang sudah kamu maafkan — pekerjaan tak terlihat yang mungkin paling berat yang pernah kamu menangkan.",
    }),
  },

  death_ibu_regret: {
    cause: () => "Membawa satu telepon yang tak pernah dijawab.",
    reflection: () => ({
      title: "Telepon yang Tak Pernah Dibalas",
      epitaph: "Sampai napas terakhir, yang muncul di kepalamu bukan pencapaianmu, tapi panggilan ibu yang dulu kamu lewatkan. Kamu pergi dengan luka yang tidak sembuh — tapi setidaknya kamu mengakuinya.",
    }),
  },

  death_bersama_pasangan: {
    cause: (s) => pasanganHidup(s) === false
      ? "Menyusul ke sisi ranjang yang sudah lama kosong."
      : "Dalam genggaman tangan yang puluhan tahun kamu kenal.",
    reflection: (s) => pasanganHidup(s) === false
      ? {
          title: "Menyusul ke Sisi yang Sama",
          epitaph: "Sisi ranjang itu sudah lama kosong; kamu hanya menyeberang ke tempat ia menunggu. Kalau benar ada yang menyambut di sana, kamu tahu persis siapa dia.",
        }
      : {
          title: "Sisi Ranjang yang Sama",
          epitaph: "Tidak ada kalimat terakhir yang perlu diucapkan — semuanya, yang penting dan yang tidak, sudah pernah kalian katakan. Sebagian cinta memang baru terasa utuh justru di titik perpisahannya.",
        },
  },

  death_sahabat_regret: {
    cause: () => "Menyusul sahabat yang dulu kamu lewatkan.",
    reflection: () => ({
      title: "Akhirnya Menyusul",
      epitaph: "Pemakaman yang dulu tidak kamu hadiri akhirnya terbayar dengan caramu sendiri. Kalian tidak perlu bicara apa-apa — hanya tersenyum, dan semuanya saling mengerti.",
    }),
  },

  death_seniman: {
    cause: () => "Tanganmu berhenti, karyamu tidak.",
    reflection: () => ({
      title: "Yang Tertinggal Setelah Tanganmu Berhenti",
      epitaph: "Kamu tidak lagi membuat apa pun, tapi yang terlanjur kamu buat tetap ada. Suatu hari seseorang akan berhenti di depan salah satunya dan merasakan sesuatu yang tak bisa ia jelaskan. Itu sebentuk hidup yang lebih panjang dari tubuh.",
    }),
  },

  death_loyal_pegawai: {
    cause: () => "Tidak ada lagi yang menunggu kabar darimu.",
    reflection: () => ({
      title: "Hafalan Sepihak",
      epitaph: "Puluhan tahun kamu hafal tempat itu di luar kepala; ia tidak pernah menghafal apa pun tentangmu. Penggantimu belajar semuanya dalam seminggu, dan untuk pertama kalinya tidak ada yang menunggu laporanmu.",
    }),
  },

  death_kaya_sepi: {
    cause: () => "Sendirian, di kamar yang terlalu besar.",
    reflection: () => ({
      title: "Kamar yang Terlalu Besar",
      epitaph: "Kamu pergi di ruang yang lebih besar dari rumah masa kecilmu, tanpa tangan yang menggenggam. Yang kamu sesali bukan apa yang kamu beli, tapi apa yang kamu tukar untuk membelinya.",
    }),
  },

  death_biasa: {
    cause: () => "Memejamkan mata di pagi yang biasa.",
  },
  death_senja: {
    cause: () => "Cahaya yang berkurang pelan, lalu reda.",
  },

  death_bersama_anak: {
    cause: () => "Dalam genggaman tangan anakmu.",
    reflection: () => ({
      title: "Tangan yang Kamu Kenal",
      epitaph: "Kamu tidak perlu membuka mata untuk tahu tangan siapa yang menggenggam. Genggaman itu lebih mudah dipahami daripada kata-kata, dan ia mengerti betapa besar hidupnya bagimu.",
    }),
  },

  death_abai: {
    cause: () => "Tagihan tubuh yang terlalu lama kamu tunda.",
    reflection: () => ({
      title: "Map Kuning di Laci",
      epitaph: "Hasil lab dengan angka kuning yang dulu kamu masukkan ke laci akhirnya menepati janjinya. Tubuhmu memberi tahu sejak awal; kamu hanya tidak siap mendengar.",
    }),
  },

  death_tenang_kenangan: {
    cause: () => "Dikelilingi wajah-wajah yang pulang bersamamu.",
    reflection: () => ({
      title: "Kenangan yang Pulang Bersama",
      epitaph: "Wajah-wajah berdatangan tidak berurutan — orang tua saat muda, sahabat yang pertama, mereka yang dulu tertawa di balik dinding. Mereka tidak bicara, hanya hadir, dan kamu pergi sambil masih merasa hangat.",
    }),
  },
};

// Cari id event kematian yang barusan terpicu: entri terakhir di history yang
// ber-prefix "death_". (applyOutcome menyimpan outcome sekarat sebagai history
// terakhir sebelum menandai pemain mati.)
function lastDeathEventId(s: GameState): string | null {
  for (let i = s.history.length - 1; i >= 0; i--) {
    if (s.history[i].eventId.startsWith("death_")) return s.history[i].eventId;
  }
  return null;
}

// Fallback sebab kematian untuk event yang belum terpetakan di DEATH_ENDINGS:
// ambil kalimat pertama dari teks outcome sekarat (perilaku lama).
function fallbackCause(s: GameState): string {
  const last = s.history[s.history.length - 1]?.text ?? "";
  return (last.match(/^[^.!?]+[.!?]/)?.[0] ?? last).trim() || "Sebab yang tidak tercatat.";
}

// Refleksi batu nisan berbasis JALAN HIDUP (dipakai saat adegan kematian netral).
// Dulu inline sebagai computeEnding di pages/Game.tsx; dipindah utuh ke sini.
function endingByState(s: GameState): Reflection {
  const { stats, achievements, memories, age, flags, relationships } = s;
  // Konsisten dengan bagian "Sifat" di epilogue: judul/epitaf membaca sifat
  // turunan dari keadaan akhir, bukan akumulasi addTrait sepanjang hidup.
  const traits = deriveTraits(s);

  if (age < 18) return {
    title: "Pergi terlalu cepat",
    epitaph: "Hidup yang baru saja akan dimulai. Tapi semesta tidak selalu adil.",
  };

  if (flags["dokter_jadi"] && traits.includes("empathetic")) return {
    title: "Tangan yang Merawat",
    epitaph: "Ribuan tangan yang kamu pegang saat mereka takut. Beberapa sembuh, tidak semua — tapi semua merasa didengar.",
  };
  if (flags["dokter_jadi"]) return {
    title: "Yang Merawat",
    epitaph: "Tanganmu menyentuh ribuan tubuh yang sakit. Beberapa sembuh. Semua merasa diperhatikan.",
  };
  if (flags["seniman_naik"]) return {
    title: "Nama di Pojok Kanvas",
    epitaph: "Beberapa karyamu masih ada di dinding orang yang tak pernah kamu kenal. Itu sebuah keabadian kecil.",
  };
  if (flags["terapi"] && stats.mental > 60) return {
    title: "Pulang ke Diri Sendiri",
    epitaph: "Kamu belajar berbicara baik pada dirimu sendiri. Terlambat dari yang seharusnya, tapi tidak pernah terlambat sepenuhnya.",
  };
  if (flags["teknik_burnout"] && !flags["teknik_burnout_pulih"]) return {
    title: "No blockers.",
    epitaph: "Kamu berkata 'no blockers' ratusan kali. Tidak ada yang tahu berapa kali kamu berbohong.",
  };
  if (flags["wirausaha"] && stats.happiness > 50) return {
    title: "Jalan yang Tidak Ada di Peta",
    epitaph: "Kamu memilih jalanmu sendiri. Tidak selalu lebih mudah, tapi selalu lebih milikmu.",
  };
  if (flags["loyal_pegawai"] && stats.happiness < 50) return {
    title: "30 Tahun Tepat Waktu",
    epitaph: "Tidak pernah terlambat sehari pun. Pensiun dengan jam dinding berlogo perusahaan dan keheningan yang memekakkan.",
  };
  if (flags["regret_ibu_kerja"]) return {
    title: "Besok yang Tidak Datang",
    epitaph: "Kamu yakin masih ada esok untuk pulang. Pekerjaanmu selesai; perjalananmu terlambat. Sejak itu kata 'nanti' tidak pernah lagi terdengar tanpa rasa bersalah.",
  };
  if (flags["regret_ibu"]) return {
    title: "Selalu ada satu telepon yang tidak dijawab",
    epitaph: "Kamu membawa hari itu sepanjang sisa hidupmu. Ia tidak pernah tertinggal.",
  };
  if (flags["anak_jauh"]) return {
    title: "Pintu yang Tidak Pernah Dibuka",
    epitaph: "Anakmu tidak sempat mengenal versi terbaikmu. Itu bukan kesalahannya — tapi kamu yang akan menanggungnya.",
  };
  if (flags["gap_panjang"]) return {
    title: "Yang Tidak Terburu-buru",
    epitaph: "Beberapa tahun kamu memilih untuk tidak tahu ke mana pergi. Tidak semua orang berani mengakui itu pilihan.",
  };

  if (age < 30) return {
    title: "Baru Saja Dimulai",
    epitaph: "Beberapa hidup hanya sempat jadi pendahuluan. Tapi pendahuluan yang baik sudah cukup.",
  };

  if (stats.wealth > 80 && stats.happiness < 30) return {
    title: "Kaya dan kesepian",
    epitaph: "Rekening penuh, ruang tamu kosong. Penjaga kuburanmu tidak tahu siapa yang harus dihubungi.",
  };
  if (stats.happiness > 70 && stats.wealth < 30) return {
    title: "Tidur yang Selalu Nyenyak",
    epitaph: "Yang kamu tinggalkan tidak bisa dihitung, tapi terasa: tawa di ruang tamu, pintu yang selalu terbuka, dan nama yang disebut orang dengan senyum.",
  };
  if (stats.mental < 25) return {
    title: "Lelah, akhirnya istirahat",
    epitaph: "Kamu bertahan lebih lama dari yang siapapun tahu kamu butuhkan.",
  };

  if (traits.includes("nihilistic") && memories.length < 5) return {
    title: "Hidup yang ringan, kosong, ringan",
    epitaph: "Tidak banyak yang ingin diceritakan. Mungkin itulah yang kamu mau.",
  };

  if (achievements.length >= 2) return {
    title: "Cukup berarti",
    epitaph: "Beberapa orang akan menyebut namamu di pidato pernikahan, dekade dari sekarang.",
  };

  if (memories.length >= 10 && stats.happiness > 55) return {
    title: "Hidup yang Penuh Cerita",
    epitaph: "Ada banyak malam yang akan diceritakan ulang. Kamu tidak sia-sia.",
  };

  const livingClose = relationships.filter((r) => r.alive && r.closeness > 50 && r.role !== "parent");
  if (age >= 70 && livingClose.length >= 2) return {
    title: "Dikelilingi yang Dicinta",
    epitaph: "Kamu pergi dengan tangan yang digenggam. Tidak semua orang mendapat itu.",
  };

  return {
    title: "Sebuah hidup biasa",
    epitaph: "Tidak ada monumen, tidak ada Wikipedia. Hanya beberapa orang yang akan mengingat caramu menyeduh kopi.",
  };
}

// Satu pintu masuk: gabungkan adegan kematian (narasi) dengan jalan hidup (state)
// menjadi title + causeOfDeath + epitaph yang saling menyambung.
export function computeEnding(s: GameState): Ending {
  const id = lastDeathEventId(s);
  const entry = id ? DEATH_ENDINGS[id] : undefined;
  const reflection = entry?.reflection?.(s) ?? endingByState(s);
  const causeOfDeath = entry ? entry.cause(s) : fallbackCause(s);
  return { title: reflection.title, causeOfDeath, epitaph: reflection.epitaph };
}
