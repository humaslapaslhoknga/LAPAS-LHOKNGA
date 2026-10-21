import { VisitTicket, WBP, Visitor, Announcement, QueueItem } from '../types';

export const CURRENT_USER: Visitor = {
  name: 'Siti Rahmah',
  nik: '1106045812900004',
  relation: 'Istri Sah',
  phone: '+62 812-6901-8842',
  address: 'Kec. Lhoknga, Kabupaten Aceh Besar, Aceh',
  isVerified: true,
};

export const DEFAULT_WBP: WBP = {
  id: 'wbp-01',
  name: 'M. Yusuf bin Abdullah',
  alias: 'Yusuf',
  regNumber: 'BI/082/2023',
  room: 'Kamar Hunian B-04',
  block: 'Blok Melati',
  caseType: 'Pasal 372 KUHP',
  sentenceLength: '2 Tahun 6 Bulan',
  expiryDate: '15 Agustus 2025',
};

export const INITIAL_TICKETS: VisitTicket[] = [
  {
    id: 'tkt-01',
    bookingCode: '#LHK-20241024-042',
    serviceType: 'tatap_muka',
    wbp: DEFAULT_WBP,
    visitor: CURRENT_USER,
    additionalVisitors: [
      {
        name: 'Ahmad Faiz (Anak)',
        nik: '1106041209180001',
        relation: 'Anak Kandung',
        ageGroup: 'anak',
      },
    ],
    visitDate: '2024-10-24',
    formattedDate: 'Kamis, 24 Okt 2024',
    session: 'pagi',
    sessionTime: '08.30 - 11.30 WIB',
    exactTime: '09.00 WIB',
    loket: 'LOKET 02',
    lockerNumber: 'Loker Mandiri #18',
    tableNumber: 'Meja Tatap Muka 06',
    status: 'active',
    goodsNote: '1 Kotak Nasi Bungkus Khas Aceh, 1 Stel Baju Kaos Polos Putih (sudah divalidasi SOP)',
    foodItems: ['Nasi Gurih Lhoknga', 'Buah Pisang Ambon', 'Kue Timphan'],
    createdAt: '2024-10-23 14:15 WIB',
  },
  {
    id: 'tkt-02',
    bookingCode: '#LHK-20241010-019',
    serviceType: 'tatap_muka',
    wbp: DEFAULT_WBP,
    visitor: CURRENT_USER,
    visitDate: '2024-10-10',
    formattedDate: 'Kamis, 10 Okt 2024',
    session: 'pagi',
    sessionTime: '08.30 - 11.30 WIB',
    exactTime: '09.30 WIB',
    loket: 'LOKET 01',
    lockerNumber: 'Loker Mandiri #04',
    tableNumber: 'Meja 03',
    status: 'completed',
    createdAt: '2024-10-09 10:20 WIB',
  },
  {
    id: 'tkt-03',
    bookingCode: '#LHK-20240926-055',
    serviceType: 'video_call',
    wbp: DEFAULT_WBP,
    visitor: CURRENT_USER,
    visitDate: '2024-09-26',
    formattedDate: 'Kamis, 26 Sep 2024',
    session: 'siang',
    sessionTime: '13.30 - 15.00 WIB',
    exactTime: '14.00 WIB',
    loket: 'LOKET VIRTUAL 01',
    lockerNumber: '-',
    tableNumber: 'Bilik Video Call 2',
    status: 'completed',
    createdAt: '2024-09-25 09:12 WIB',
  },
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Layanan Lapas Bebas Pungutan Liar (Zona Integritas WBK)',
    category: 'WBK 2024',
    badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
    date: '21 Okt 2024',
    excerpt: 'Seluruh layanan pemasyarakatan gratis tanpa dipungut biaya apapun.',
    fullContent: [
      'Lembaga Pemasyarakatan Kelas III Lhoknga Kantor Wilayah Kemenimipas RI berkomitmen mewujudkan Wilayah Bebas dari Korupsi (WBK) dan Wilayah Birokrasi Bersih dan Melayani (WBBM).',
      'Kami menegaskan kembali bahwa SELURUH LAYANAN publik di Lapas Kelas III Lhoknga:',
      '1. Pendaftaran Kunjungan Tatap Muka & Online: 100% GRATIS',
      '2. Penitipan Makanan & Pakaian: 100% GRATIS',
      '3. Pengurusan Hak Integrasi (PB, CB, CMB, Asimilasi, Remisi): 100% GRATIS TANPA SYARAT BIAYA',
      'Apabila menemukan oknum petugas yang meminta imbalan uang, pulsa, atau barang, segera laporkan melalui Hotline WBK WhatsApp: +62 811-6800-432.',
    ],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAvhLYobxfTGZXZVKL3e9QomApc13afZ7U0Onq0IsBDU7hD69Cbiljv5L8cqlE8g7LAA3DWUu6TV4TXrb36_RMapBn_pRSqEcMYoFVsxznFcKE5Q176w-MsKsX2Yic2-2Zk2ZK5jCfhaamVDyhNCfFsc_oElYN_nnlnPUsZsA84-uHrVSvU-eiDBMB1F5QhuLKj18501WciJc7Y9DM2ixJKrUgqYJ9hYnzuTSi7ag3Czx5t0ww4SiY',
  },
  {
    id: 'ann-2',
    title: 'Himbauan Pakaian Pengunjung & Larangan Bawaan Elektronik',
    category: 'TATA TERTIB',
    badgeColor: 'bg-secondary-fixed text-on-secondary-fixed',
    date: '19 Okt 2024',
    excerpt: 'Wajib berbusana sopan, tertutup, dan tidak membawa kamera atau gawai.',
    fullContent: [
      'Guna menjaga keamanan dan ketertiban serta menghormati kearifan lokal syariat Islam di Aceh, pengunjung Lapas Kelas III Lhoknga diwajibkan mematuhi tata tertib berbusana:',
      '• Pengunjung Wanita: Mengenakan pakaian sopan dan tertutup, celana/rok panjang tidak ketat, dan berjilbab rapi.',
      '• Pengunjung Pria: Mengenakan kemeja/baju berkerah, celana panjang bahan (tidak celana pendek atau sobek-sobek), serta bersepatu atau sandal tertutup.',
      '• Larangan Keras: Dilarang keras membawa gawai (HP), powerbank, kamera, smart watch, senjata tajam, sendok garpu besi, rokok melebihi 1 bungkus terbuka, dan narkotika.',
      'Petugas P2U (Pengamanan Pintu Utama) berhak menolak izin masuk pengunjung yang tidak mematuhi tata tertib di atas.',
    ],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXh390P2dJd2Jfmjun65_QqBAgx8YChsU-q7_jHUjElEIMMPVTCrCUf6UU3VkVpQfRO44k8eRK0Rk7-69plRsPr9ODZn7xlDLSg5MH_Lx1w9a0q27keAGxBVI4rn_diYRv2SwYas3G2tPZQ1H3gavznAxd3kM4LZV5bhROsAiALrPK8GEq5Mz7hEkwxzobnFagwrzt0ZUcDHnMlrjepVIZAWg3SBJ3AZQDuhAezkOz1uzhy5cRDeE',
  },
];

export const INITIAL_QUEUE: QueueItem[] = [
  { number: 'A-041', serviceType: 'Kunjungan Tatap Muka', loket: 'Loket 01', status: 'serving', time: '08:55' },
  { number: 'A-042', serviceType: 'Kunjungan Tatap Muka (Tiket Anda)', loket: 'Loket 02', status: 'calling', time: '08:58' },
  { number: 'B-015', serviceType: 'Titipan Barang/Makanan', loket: 'Loket 03', status: 'serving', time: '08:52' },
  { number: 'V-008', serviceType: 'Kunjungan Video Call', loket: 'Loket Virtual', status: 'serving', time: '08:45' },
  { number: 'A-043', serviceType: 'Kunjungan Tatap Muka', loket: 'Loket 01', status: 'waiting', time: '09:05' },
  { number: 'A-044', serviceType: 'Kunjungan Tatap Muka', loket: 'Loket 02', status: 'waiting', time: '09:10' },
  { number: 'B-016', serviceType: 'Titipan Barang/Makanan', loket: 'Loket 03', status: 'waiting', time: '09:12' },
];

export const PROHIBITED_ITEMS = [
  { name: 'Ponsel & Gawai Elektronik', desc: 'Smartphone, tablet, powerbank, headset wireless, smartwatch' },
  { name: 'Senjata & Benda Tajam', desc: 'Pisau, gunting, silet, cutter, kawat besi, obeng, jarum' },
  { name: 'Narkoba & Obat Terlarang', desc: 'Narkotika, psikotropika, obat tanpa resep resmi dokter' },
  { name: 'Minuman Keras / Beralkohol', desc: 'Segala jenis minuman fermentasi, oplosan, alkohol' },
  { name: 'Uang Tunai Berlebih di Dalam', desc: 'Wajib dititipkan, gunakan kartu e-money / brizzi khusus lapas jika ada' },
  { name: 'Kemasan Kaleng & Kaca', desc: 'Makanan berwadah beling/kaca atau kaleng harus dipindah ke plastik transparan' },
];

export const SCHEDULE_RULES = [
  { day: 'Senin', blocks: 'Blok Melati & Kamar Isolasi/Mapenaling', session: '08.30 - 15.00 WIB' },
  { day: 'Selasa', blocks: 'Blok Seulawah (WBP Tindak Pidana Umum)', session: '08.30 - 15.00 WIB' },
  { day: 'Rabu', blocks: 'Tahanan Titipan Kejaksaan & Pengadilan', session: '08.30 - 15.00 WIB' },
  { day: 'Kamis', blocks: 'Blok Melati & WBP Khusus Lansia/Rentang', session: '08.30 - 15.00 WIB' },
  { day: 'Jumat', blocks: 'Pembersihan Ruang & Khusus Layanan Titipan Barang', session: '08.30 - 11.30 WIB' },
  { day: 'Sabtu', blocks: 'Kunjungan Khusus Keluarga Luar Daerah (Surat Keterangan)', session: '08.30 - 12.00 WIB' },
  { day: 'Minggu & Libur Nasional', blocks: 'TUTUP (Hanya Kunjungan Virtual Darurat)', session: 'Tutup' },
];
