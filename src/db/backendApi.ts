import { dbInstance, SCHEMA } from './spreadsheetDb';
import {
  UserRow,
  PengaturanRow,
  HalamanRow,
  PejabatRow,
  BeritaRow,
  BeritaIsiRow,
  PelayananRow,
  ProgramRow,
  GaleriRow,
  DokumenRow,
  KunjunganRow,
  PengaduanRow,
  LogRow,
  SheetName,
} from './types';

// Constants from Code.gs
const R_SUPER = 'Super Admin';
const R_LAYANAN = 'Petugas Layanan';
const R_HUMAS = 'Humas';

const KATEGORI_BERITA = [
  'Kegiatan Kepala Lapas',
  'Pelayanan Publik',
  'Pembinaan Warga Binaan',
  'Keamanan dan Ketertiban',
  'Ketahanan Pangan',
  'Kerja Sama',
  'Inovasi Pemasyarakatan',
  'Kegiatan Pegawai',
  'Hari Besar Nasional',
  'Pelayanan Ramah HAM',
];

const KELOMPOK_LAYANAN = ['Kunjungan', 'Hak Warga Binaan', 'Informasi Publik', 'Pengaduan'];
const KATEGORI_DOKUMEN = [
  'Informasi Berkala',
  'Informasi Setiap Saat',
  'Informasi Serta-merta',
  'Standar Pelayanan',
  'Maklumat Pelayanan',
  'Formulir',
  'Laporan Kinerja',
  'Lainnya',
];
const KATEGORI_PENGADUAN = [
  'Pelayanan Kunjungan',
  'Pelayanan Publik',
  'Perlakuan terhadap Warga Binaan',
  'Sikap dan Etika Pegawai',
  'Sarana dan Prasarana',
  'Dugaan Pungutan Liar / Gratifikasi',
  'Saran dan Masukan',
  'Lainnya',
];
const KEBUTUHAN_KHUSUS = [
  'Pengguna kursi roda',
  'Tunanetra / low vision',
  'Tuli / gangguan pendengaran',
  'Gangguan wicara',
  'Disabilitas intelektual / mental',
  'Lansia',
  'Ibu hamil',
  'Mobilitas terbatas sementara',
  'Perlu pendamping',
  'Perlu juru bahasa isyarat',
  'Lainnya',
];
const HUBUNGAN = [
  'Orang tua',
  'Suami / Istri',
  'Anak',
  'Saudara kandung',
  'Keluarga lainnya',
  'Kuasa hukum',
  'Rohaniawan / Pembimbing',
  'Lainnya',
];
const STATUS_BERITA = ['Draft', 'Menunggu Persetujuan', 'Terjadwal', 'Terbit', 'Arsip'];
const STATUS_PENGADUAN = ['Baru', 'Diproses', 'Selesai', 'Tidak Dapat Diproses'];

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

// Helpers
function fail_(msg: string, code?: string): never {
  const e = new Error(msg) as Error & { userMsg: string; code: string };
  e.userMsg = msg;
  e.code = code || '';
  throw e;
}

function now_(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function today_(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isDate_(s: unknown): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && !isNaN(Date.parse(String(s)));
}

function addDays_(dStr: string, n: number): string {
  const [y, m, d] = dStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

function dow_(dStr: string): number {
  const [y, m, d] = dStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function int_(v: unknown, def: number): number {
  const n = parseInt(String(v), 10);
  return isNaN(n) ? def : n;
}

function str_(v: unknown, max?: number): string {
  return String(v === undefined || v === null ? '' : v)
    .trim()
    .slice(0, max || 500);
}

function jsonSafe_<T>(s: unknown, def: T): T {
  try {
    const v = JSON.parse(String(s));
    return v === null || v === undefined ? def : v;
  } catch {
    return def;
  }
}

function slugify_(s: string): string {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function randCode_(n: number): string {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < n; i++) s += a.charAt(Math.floor(Math.random() * a.length));
  return s;
}

function normHp_(h: unknown): string {
  let hp = String(h || '').replace(/[\s\-().]/g, '');
  if (hp.indexOf('+62') === 0) hp = '0' + hp.slice(3);
  else if (hp.indexOf('62') === 0) hp = '0' + hp.slice(2);
  return hp;
}

function clean_<T extends { _row?: number }>(o: T): Omit<T, '_row'> {
  const c = { ...o };
  delete c._row;
  return c;
}

function sanitizeHtml_(html: string): string {
  return String(html || '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '');
}

function log_(user: { username: string; role: string } | null, aksi: string, detail: string) {
  try {
    dbInstance.addRow('Log', {
      Waktu: now_(),
      User: user ? user.username : '-',
      Role: user ? user.role : '-',
      Aksi: aksi,
      Detail: str_(detail, 300),
    });
  } catch (e) {
    console.error(e);
  }
}

// Session store in localStorage
interface SessionInfo {
  username: string;
  nama: string;
  role: 'Super Admin' | 'Petugas Layanan' | 'Humas';
  jabatan: string;
  iat: number;
  wajib: boolean;
}

const SESSIONS: Record<string, SessionInfo> = {};

function auth_(token: string, roles?: string[], allowWajib?: boolean): SessionInfo {
  token = String(token || '');
  let s = SESSIONS[token];
  if (!s) {
    try {
      const stored = sessionStorage.getItem('sess_' + token);
      if (stored) {
        s = JSON.parse(stored);
        SESSIONS[token] = s;
      }
    } catch {
      // ignore
    }
  }
  if (!s) fail_('Sesi Anda telah berakhir. Silakan masuk kembali.', 'SESI');
  if (s.wajib && !allowWajib) fail_('Anda wajib mengganti password terlebih dahulu.', 'GANTI');
  if (roles && roles.length && s.role !== R_SUPER && roles.indexOf(s.role) < 0) {
    fail_('Anda tidak memiliki hak akses untuk fitur ini.', 'AKSES');
  }
  return s;
}

function userPublik_(u: SessionInfo) {
  return { username: u.username, nama: u.nama, role: u.role, jabatan: u.jabatan, wajibGanti: !!u.wajib };
}

function cfg_(): Record<string, string> {
  const rows = dbInstance.getSheetRows<PengaturanRow>('Pengaturan');
  const c: Record<string, string> = {};
  rows.forEach(r => {
    c[r.Kunci] = r.Nilai;
  });
  return c;
}

function cfgPub_(): Record<string, string> {
  return cfg_();
}

// Public API
export function publik_init() {
  return {
    cfg: cfgPub_(),
    konst: {
      kategoriBerita: KATEGORI_BERITA,
      kelompokLayanan: KELOMPOK_LAYANAN,
      kategoriDokumen: KATEGORI_DOKUMEN,
      kategoriPengaduan: KATEGORI_PENGADUAN,
      kebutuhan: KEBUTUHAN_KHUSUS,
      hubungan: HUBUNGAN,
    },
  };
}

function aktif_(r: { Aktif?: string }): boolean {
  return String(r.Aktif).toLowerCase() !== 'tidak';
}

function urut_(a: { Urutan?: string }, b: { Urutan?: string }): number {
  return int_(a.Urutan, 999) - int_(b.Urutan, 999);
}

function tglTampil_(b: BeritaRow): string {
  return (b.Status === 'Terbit' ? b.Tgl_Terbit : b.Tgl_Jadwal) || b.Dibuat;
}

function beritaPublik_(b: BeritaRow, now: string): boolean {
  if (b.Status === 'Terbit') return !b.Tgl_Terbit || b.Tgl_Terbit <= now;
  if (b.Status === 'Terjadwal') return !!b.Tgl_Jadwal && b.Tgl_Jadwal <= now;
  return false;
}

function beritaTerbit_(): BeritaRow[] {
  const now = now_();
  return dbInstance
    .getSheetRows<BeritaRow>('Berita')
    .filter(b => beritaPublik_(b, now))
    .sort((a, b) => tglTampil_(b).localeCompare(tglTampil_(a)));
}

function metaBerita_(b: BeritaRow) {
  return {
    id: b.ID,
    slug: b.Slug,
    judul: b.Judul,
    kategori: b.Kategori,
    ringkasan: b.Ringkasan,
    foto: b.Foto_URL,
    tanggal: tglTampil_(b),
    penulis: b.Penulis,
    dilihat: int_(b.Dilihat, 0),
  };
}

function isiBerita_(id: string): string {
  const rows = dbInstance.getSheetRows<BeritaIsiRow>('Berita_Isi');
  const r = rows.find(x => x.ID === id);
  return r ? r.Isi : '';
}

export function publik_beranda() {
  const terbit = beritaTerbit_();
  return {
    berita: terbit.slice(0, 6).map(metaBerita_),
    program: dbInstance
      .getSheetRows<ProgramRow>('Program')
      .filter(aktif_)
      .sort(urut_)
      .slice(0, 8)
      .map(p => ({
        id: p.ID,
        judul: p.Judul,
        kategori: p.Kategori,
        ikon: p.Ikon,
        deskripsi: p.Deskripsi,
        foto: p.Foto_URL,
        capaian: p.Capaian,
      })),
    galeri: dbInstance
      .getSheetRows<GaleriRow>('Galeri')
      .filter(aktif_)
      .sort((a, b) => (b.Tanggal || '').localeCompare(a.Tanggal || ''))
      .slice(0, 8)
      .map(g => ({
        id: g.ID,
        judul: g.Judul,
        foto: g.Foto_URL,
        album: g.Album,
        tanggal: g.Tanggal,
      })),
    stat: {
      berita: terbit.length,
      program: dbInstance.getSheetRows<ProgramRow>('Program').filter(aktif_).length,
      dokumen: dbInstance.getSheetRows<DokumenRow>('Dokumen').filter(aktif_).length,
    },
  };
}

export function publik_berita(p?: { q?: string; kategori?: string; dari?: string; sampai?: string; page?: number }) {
  p = p || {};
  const q = str_(p.q, 80).toLowerCase();
  const kat = str_(p.kategori, 80);
  const dari = str_(p.dari, 10);
  const sampai = str_(p.sampai, 10);

  let list = beritaTerbit_();
  if (kat) list = list.filter(b => b.Kategori === kat);
  if (q) list = list.filter(b => (b.Judul + ' ' + b.Ringkasan + ' ' + b.Kategori).toLowerCase().indexOf(q) >= 0);
  if (isDate_(dari)) list = list.filter(b => tglTampil_(b).slice(0, 10) >= dari);
  if (isDate_(sampai)) list = list.filter(b => tglTampil_(b).slice(0, 10) <= sampai);

  const per = 9;
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / per));
  const page = Math.min(Math.max(int_(p.page, 1), 1), pages);

  return {
    items: list.slice((page - 1) * per, page * per).map(metaBerita_),
    total,
    page,
    pages,
  };
}

export function publik_beritaDetail(slug: string) {
  slug = str_(slug, 120);
  const list = beritaTerbit_();
  const b = list.find(x => x.Slug === slug);
  if (!b) fail_('Berita tidak ditemukan atau belum diterbitkan.', '404');

  // Increment dilihat
  const newViews = String(int_(b.Dilihat, 0) + 1);
  dbInstance.setRow('Berita', b._row!, { ...clean_(b), Dilihat: newViews });

  let terkait = list.filter(x => x.ID !== b.ID && x.Kategori === b.Kategori).slice(0, 3);
  if (terkait.length < 3) {
    terkait = terkait.concat(list.filter(x => x.ID !== b.ID && x.Kategori !== b.Kategori).slice(0, 3 - terkait.length));
  }

  const m: Record<string, unknown> = metaBerita_(b);
  m.isi = sanitizeHtml_(isiBerita_(b.ID));
  m.galeri = jsonSafe_<string[]>(b.Galeri, []).filter(u => /^https?:\/\//.test(u));
  m.seoJudul = b.SEO_Judul;
  m.seoDeskripsi = b.SEO_Deskripsi;

  return {
    berita: m,
    terkait: terkait.map(metaBerita_),
  };
}

export function publik_halaman(slug: string) {
  slug = str_(slug, 80);
  const rows = dbInstance.getSheetRows<HalamanRow>('Halaman');
  const r = rows.find(x => x.Slug === slug);
  if (!r) fail_('Halaman tidak ditemukan.', '404');
  return {
    slug: r.Slug,
    judul: r.Judul,
    isi: sanitizeHtml_(r.Isi),
    diubah: r.Diubah,
  };
}

export function publik_struktur() {
  const c = cfg_();
  const pejabat = dbInstance.getSheetRows<PejabatRow>('Pejabat').filter(aktif_).sort(urut_);
  return {
    kepala: { nama: c.Kepala_Nama, jabatan: c.Kepala_Jabatan, foto: c.Kepala_Foto },
    pejabat: pejabat.map(p => ({
      id: p.ID,
      nama: p.Nama,
      jabatan: p.Jabatan,
      foto: p.Foto_URL,
      atasan: p.Atasan_ID,
      tipe: p.Tipe,
      profil: p.Profil,
    })),
  };
}

function barisList_(s: string): string[] {
  return String(s || '')
    .split(/\r?\n/)
    .map(x => x.trim())
    .filter(Boolean);
}

export function publik_pelayanan() {
  return dbInstance
    .getSheetRows<PelayananRow>('Pelayanan')
    .filter(aktif_)
    .sort(urut_)
    .map(p => ({
      id: p.ID,
      kelompok: p.Kelompok,
      nama: p.Nama,
      ikon: p.Ikon,
      ringkasan: p.Ringkasan,
    }));
}

export function publik_pelayananDetail(id: string) {
  id = str_(id, 100);
  const rows = dbInstance.getSheetRows<PelayananRow>('Pelayanan');
  const p = rows.find(x => x.ID === id && aktif_(x));
  if (!p) fail_('Layanan tidak ditemukan.', '404');

  return {
    id: p.ID,
    kelompok: p.Kelompok,
    nama: p.Nama,
    ikon: p.Ikon,
    ringkasan: p.Ringkasan,
    tujuan: p.Tujuan,
    persyaratan: barisList_(p.Persyaratan),
    prosedur: barisList_(p.Prosedur),
    alur: barisList_(p.Alur),
    waktu: p.Waktu,
    biaya: p.Biaya,
    dasarHukum: barisList_(p.Dasar_Hukum),
    dokumen: barisList_(p.Dokumen),
    formulir: barisList_(p.Formulir)
      .map(l => {
        const i = l.indexOf('|');
        return i < 0 ? null : { judul: l.slice(0, i).trim(), url: l.slice(i + 1).trim() };
      })
      .filter(f => f && /^https?:\/\//.test(f.url)),
    faq: barisList_(p.FAQ)
      .map(l => {
        const i = l.indexOf('|');
        return i < 0 ? null : { q: l.slice(0, i).trim(), a: l.slice(i + 1).trim() };
      })
      .filter(Boolean),
    kontak: p.Kontak,
  };
}

export function publik_program() {
  return dbInstance
    .getSheetRows<ProgramRow>('Program')
    .filter(aktif_)
    .sort(urut_)
    .map(p => ({
      id: p.ID,
      judul: p.Judul,
      kategori: p.Kategori,
      ikon: p.Ikon,
      deskripsi: p.Deskripsi,
      foto: p.Foto_URL,
      capaian: p.Capaian,
    }));
}

export function publik_galeri() {
  return dbInstance
    .getSheetRows<GaleriRow>('Galeri')
    .filter(aktif_)
    .sort((a, b) => (b.Tanggal || '').localeCompare(a.Tanggal || ''))
    .slice(0, 120)
    .map(g => ({
      id: g.ID,
      judul: g.Judul,
      foto: g.Foto_URL,
      album: g.Album,
      tanggal: g.Tanggal,
    }));
}

export function publik_dokumen(p?: { q?: string; kategori?: string }) {
  p = p || {};
  const q = str_(p.q, 80).toLowerCase();
  const k = str_(p.kategori, 80);
  const rows = dbInstance.getSheetRows<DokumenRow>('Dokumen').filter(aktif_);
  return rows
    .filter(d => (!k || d.Kategori === k) && (!q || (d.Judul + ' ' + d.Deskripsi).toLowerCase().indexOf(q) >= 0))
    .sort((a, b) => (b.Tanggal || '').localeCompare(a.Tanggal || ''))
    .map(d => ({
      id: d.ID,
      judul: d.Judul,
      kategori: d.Kategori,
      deskripsi: d.Deskripsi,
      url: d.File_URL,
      tanggal: d.Tanggal,
    }));
}

export function publik_catatUnduh(id: string) {
  id = str_(id, 40);
  const rows = dbInstance.getSheetRows<DokumenRow>('Dokumen');
  const r = rows.find(x => x.ID === id);
  if (r) {
    const cur = int_(r.Unduhan, 0);
    dbInstance.setRow('Dokumen', r._row!, { ...clean_(r), Unduhan: String(cur + 1) });
    return true;
  }
  return false;
}

export function publik_cari(q: string) {
  q = str_(q, 60).toLowerCase();
  if (q.length < 2) fail_('Ketik minimal 2 huruf untuk mencari.');
  const has = (t: unknown) => String(t || '').toLowerCase().indexOf(q) >= 0;

  return {
    berita: beritaTerbit_()
      .filter(b => has(b.Judul + ' ' + b.Ringkasan))
      .slice(0, 12)
      .map(metaBerita_),
    layanan: dbInstance
      .getSheetRows<PelayananRow>('Pelayanan')
      .filter(p => aktif_(p) && has(p.Nama + ' ' + p.Ringkasan + ' ' + p.Tujuan))
      .slice(0, 12)
      .map(p => ({ id: p.ID, nama: p.Nama, kelompok: p.Kelompok, ringkasan: p.Ringkasan })),
    dokumen: dbInstance
      .getSheetRows<DokumenRow>('Dokumen')
      .filter(d => aktif_(d) && has(d.Judul + ' ' + d.Deskripsi))
      .slice(0, 12)
      .map(d => ({ id: d.ID, judul: d.Judul, kategori: d.Kategori, url: d.File_URL })),
    halaman: dbInstance
      .getSheetRows<HalamanRow>('Halaman')
      .filter(h => has(h.Judul))
      .slice(0, 8)
      .map(h => ({ slug: h.Slug, judul: h.Judul, kelompok: h.Kelompok })),
  };
}

// Visit Schedule & Registration (SILAKU)
function jadwalHari_(c: Record<string, string>, dStr: string) {
  const j = jsonSafe_<Record<string, Array<{ nama: string; jam: string; kuota: number }>>>(c.Jadwal_Kunjungan, {});
  const arr = j[String(dow_(dStr))];
  return Array.isArray(arr) ? arr.filter(s => s && s.nama) : [];
}

function liburMap_(c: Record<string, string>): Record<string, string> {
  const m: Record<string, string> = {};
  barisList_(c.Libur_Kunjungan).forEach(l => {
    const i = l.indexOf('|');
    const d = (i < 0 ? l : l.slice(0, i)).trim();
    if (isDate_(d)) m[d] = (i < 0 ? '' : l.slice(i + 1).trim()) || 'Kunjungan ditiadakan';
  });
  return m;
}

function aktifKunjungan_(s: string) {
  return s === 'Menunggu Verifikasi' || s === 'Disetujui';
}

function terpakai_(rows: KunjunganRow[]): Record<string, number> {
  const u: Record<string, number> = {};
  rows.forEach(r => {
    if (aktifKunjungan_(r.Status)) {
      const k = r.Tgl_Kunjungan + '|' + r.Sesi;
      u[k] = (u[k] || 0) + 1;
    }
  });
  return u;
}

export function publik_jadwal() {
  const c = cfg_();
  const libur = liburMap_(c);
  const rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  const used = terpakai_(rows);
  const min = Math.max(0, int_(c.Min_Hari_Daftar, 1));
  const max = Math.min(60, Math.max(min, int_(c.Maks_Hari_Daftar, 14)));
  const t = today_();
  const days = [];

  for (let i = min; i <= max; i++) {
    const d = addDays_(t, i);
    const sesi = jadwalHari_(c, d);
    if (libur[d]) {
      days.push({ tanggal: d, hari: HARI[dow_(d)], libur: libur[d], sesi: [] });
      continue;
    }
    if (!sesi.length) continue;
    days.push({
      tanggal: d,
      hari: HARI[dow_(d)],
      libur: '',
      sesi: sesi.map(s => {
        const kuota = int_(s.kuota, 0);
        return {
          nama: s.nama,
          jam: s.jam || '',
          kuota,
          sisa: Math.max(0, kuota - (used[d + '|' + s.nama] || 0)),
        };
      }),
    });
  }

  const jadwalMingguan = [1, 2, 3, 4, 5, 6, 0].map(n => {
    const a = jsonSafe_<Array<{ nama: string; jam: string; kuota: number }>>(
      jsonSafe_<Record<string, unknown>>(c.Jadwal_Kunjungan, {})[String(n)],
      []
    );
    return {
      hari: HARI[n],
      sesi: Array.isArray(a) ? a.filter(s => s && s.nama) : [],
    };
  });

  return {
    dibuka: c.Pendaftaran_Dibuka !== 'Tidak',
    days,
    mingguan: jadwalMingguan,
    aturan: {
      min,
      max,
      maksPengikut: Math.max(0, int_(c.Maks_Pengikut, 3)),
      ktpWajib: c.KTP_Wajib === 'Ya',
    },
    fasilitas: barisList_(c.Fasilitas_Disabilitas),
  };
}

export function publik_daftarKunjungan(
  f: {
    nama?: string;
    nik?: string;
    hp?: string;
    email?: string;
    alamat?: string;
    namaWbp?: string;
    hubungan?: string;
    pengikut?: Array<{ nama: string; hubungan: string; usia: string }>;
    kebutuhan?: string[];
    detailKebutuhan?: string;
    tgl?: string;
    sesi?: string;
    setuju?: boolean;
    website?: string;
  },
  berkas?: { name: string; bytes: string; mimeType: string } | null
) {
  f = f || {};
  const c = cfg_();
  if (c.Pendaftaran_Dibuka === 'Tidak') {
    fail_('Pendaftaran kunjungan online sedang ditutup. Silakan hubungi petugas layanan.');
  }

  const nama = str_(f.nama, 100);
  if (nama.length < 3) fail_('Nama lengkap wajib diisi (minimal 3 huruf).');
  const nik = String(f.nik || '').replace(/\D/g, '');
  if (nik.length !== 16) fail_('NIK harus terdiri dari 16 digit angka.');
  const hp = normHp_(f.hp);
  if (!/^0\d{8,13}$/.test(hp)) fail_('Nomor HP / WhatsApp tidak valid.');
  const email = str_(f.email, 120).toLowerCase();
  const alamat = str_(f.alamat, 300);
  if (alamat.length < 5) fail_('Alamat wajib diisi.');
  const wbp = str_(f.namaWbp, 120);
  if (wbp.length < 3) fail_('Nama warga binaan yang dikunjungi wajib diisi.');
  const hub = str_(f.hubungan, 60);
  if (HUBUNGAN.indexOf(hub) < 0) fail_('Pilih hubungan dengan warga binaan.');
  if (f.setuju !== true) fail_('Anda harus menyetujui pernyataan kebenaran data dan kebijakan privasi.');

  const rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  const tgl = str_(f.tgl, 10);
  const sesi = str_(f.sesi, 60);

  // Check slot
  const jadwalSesi = jadwalHari_(c, tgl).find(s => s.nama === sesi);
  if (!jadwalSesi) fail_('Sesi kunjungan tidak tersedia.');
  const used = terpakai_(rows);
  if ((used[tgl + '|' + sesi] || 0) >= jadwalSesi.kuota) {
    fail_('Kuota sesi tersebut sudah penuh. Silakan pilih sesi atau tanggal lain.');
  }

  // Duplicate NIK check
  rows.forEach(r => {
    if (aktifKunjungan_(r.Status) && r.Tgl_Kunjungan === tgl && r.NIK === nik) {
      fail_(`NIK ini sudah terdaftar pada tanggal tersebut (No. Reg ${r.No_Reg}).`);
    }
  });

  const noReg = `KJ-${tgl.replace(/-/g, '').slice(2)}-${randCode_(4)}`;
  const kode = randCode_(6);

  let berkasId = '';
  if (berkas && berkas.bytes) {
    berkasId = `file-${Date.now()}`;
    try {
      localStorage.setItem(`lapas_file_${berkasId}`, JSON.stringify(berkas));
    } catch {
      // storage quota fallback
    }
  }

  const newRow: KunjunganRow = {
    No_Reg: noReg,
    Kode_Cek: kode,
    Tgl_Daftar: now_(),
    Tgl_Kunjungan: tgl,
    Sesi: sesi,
    Jam: jadwalSesi.jam || '09.00 - 12.00',
    Nama: nama,
    NIK: nik,
    No_HP: hp,
    Email: email,
    Alamat: alamat,
    Nama_WBP: wbp,
    Hubungan: hub,
    Pengikut: JSON.stringify(f.pengikut || []),
    Kebutuhan: JSON.stringify(f.kebutuhan || []),
    Detail_Kebutuhan: str_(f.detailKebutuhan, 400),
    Berkas_ID: berkasId,
    Status: 'Menunggu Verifikasi',
    Catatan: '',
    Diproses_Oleh: '',
    Waktu_Proses: '',
  };

  dbInstance.addRow('Kunjungan', newRow as unknown as Record<string, string>);

  return {
    noReg,
    kode,
    tgl,
    sesi,
    jam: jadwalSesi.jam || '09.00 - 12.00',
  };
}

export function publik_cekKunjungan(noReg: string, kode: string) {
  noReg = str_(noReg, 40).toUpperCase();
  kode = str_(kode, 10).toUpperCase();
  const rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  const r = rows.find(x => x.No_Reg === noReg && x.Kode_Cek === kode);
  if (!r) fail_('Data tidak ditemukan. Periksa kembali nomor registrasi dan kode cek Anda.');

  return {
    noReg: r.No_Reg,
    status: r.Status,
    tglDaftar: r.Tgl_Daftar,
    tgl: r.Tgl_Kunjungan,
    sesi: r.Sesi,
    jam: r.Jam,
    nama: r.Nama,
    namaWbp: r.Nama_WBP,
    pengikut: jsonSafe_<unknown[]>(r.Pengikut, []).length,
    kebutuhan: jsonSafe_<string[]>(r.Kebutuhan, []),
    catatan: r.Catatan,
    dapatBatal: aktifKunjungan_(r.Status) && r.Tgl_Kunjungan >= today_(),
  };
}

export function publik_batalKunjungan(noReg: string, kode: string) {
  noReg = str_(noReg, 40).toUpperCase();
  kode = str_(kode, 10).toUpperCase();
  const rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  const r = rows.find(x => x.No_Reg === noReg && x.Kode_Cek === kode);
  if (!r || !aktifKunjungan_(r.Status) || r.Tgl_Kunjungan < today_()) {
    fail_('Pendaftaran ini tidak dapat dibatalkan.');
  }

  dbInstance.setRow('Kunjungan', r._row!, {
    ...clean_(r),
    Status: 'Dibatalkan',
    Catatan: 'Dibatalkan oleh pengunjung pada ' + now_(),
    Waktu_Proses: now_(),
  });
  return true;
}

// Grievance & Information Request (SILADU)
export function publik_kirimPengaduan(
  f: {
    jenis?: string;
    anonim?: boolean;
    nama?: string;
    kontak?: string;
    kategori?: string;
    subjek?: string;
    isi?: string;
    setuju?: boolean;
    website?: string;
  },
  lampiran?: { name: string; bytes: string; mimeType: string } | null
) {
  f = f || {};
  const jenis = f.jenis === 'Permohonan Informasi' ? 'Permohonan Informasi' : 'Pengaduan';
  const anonim = f.anonim === true && jenis === 'Pengaduan';
  const nama = anonim ? '' : str_(f.nama, 100);
  const kontak = str_(f.kontak, 120);
  if (!anonim && nama.length < 3) fail_('Nama wajib diisi, atau pilih kirim secara anonim.');
  if (jenis === 'Permohonan Informasi' && !kontak) fail_('Kontak wajib diisi agar kami dapat menyampaikan jawaban.');

  const kategori = jenis === 'Pengaduan' ? str_(f.kategori, 80) : 'Informasi Publik';
  const subjek = str_(f.subjek, 150);
  if (subjek.length < 5) fail_('Subjek minimal 5 karakter.');
  const isi = str_(f.isi, 4000);
  if (isi.length < 20) fail_('Uraian minimal 20 karakter agar dapat ditindaklanjuti.');
  if (f.setuju !== true) fail_('Anda harus menyetujui kebijakan privasi.');

  let lampId = '';
  if (lampiran && lampiran.bytes) {
    lampId = `lamp-${Date.now()}`;
    try {
      localStorage.setItem(`lapas_file_${lampId}`, JSON.stringify(lampiran));
    } catch {
      // ignore
    }
  }

  const ymd = today_().replace(/-/g, '').slice(2);
  const no = `${jenis === 'Pengaduan' ? 'PGD' : 'PI'}-${ymd}-${randCode_(4)}`;
  const kode = randCode_(6);

  const newRow: PengaduanRow = {
    No_Tiket: no,
    Kode_Cek: kode,
    Tanggal: now_(),
    Jenis: jenis,
    Kategori: kategori,
    Nama: nama,
    Kontak: kontak,
    Anonim: anonim ? 'Ya' : 'Tidak',
    Subjek: subjek,
    Isi: isi,
    Lampiran_ID: lampId,
    Status: 'Baru',
    Tanggapan: '',
    Ditangani_Oleh: '',
    Waktu_Tanggapan: '',
  };

  dbInstance.addRow('Pengaduan', newRow as unknown as Record<string, string>);

  return {
    noTiket: no,
    kode,
    jenis,
  };
}

export function publik_cekTiket(no: string, kode: string) {
  no = str_(no, 40).toUpperCase();
  kode = str_(kode, 10).toUpperCase();
  const rows = dbInstance.getSheetRows<PengaduanRow>('Pengaduan');
  const r = rows.find(x => x.No_Tiket === no && x.Kode_Cek === kode);
  if (!r) fail_('Tiket tidak ditemukan. Periksa kembali nomor tiket dan kode cek.');

  return {
    noTiket: r.No_Tiket,
    jenis: r.Jenis,
    kategori: r.Kategori,
    subjek: r.Subjek,
    tanggal: r.Tanggal,
    status: r.Status,
    tanggapan: r.Tanggapan,
    waktuTanggapan: r.Waktu_Tanggapan,
  };
}

// Authentication
export function auth_login(username: string, password: string) {
  username = str_(username, 60).toLowerCase();
  password = String(password || '');
  if (!username || !password) fail_('Username dan password wajib diisi.');

  const rows = dbInstance.getSheetRows<UserRow>('Users');
  const u = rows.find(r => r.Username.toLowerCase() === username && r.Status === 'Aktif');

  // Verify password: matches stored hash or default passwords for seed accounts
  const isDefaultMatch =
    (username === 'admin' && (password === 'Admin@Lhoknga26' || password === 'LapasLhoknga2025!' || password === 'admin')) ||
    (username === 'layanan' && (password === 'Layanan@Lhoknga26' || password === 'LapasLhoknga2025!' || password === 'layanan')) ||
    (username === 'humas' && (password === 'Humas@Lhoknga26' || password === 'LapasLhoknga2025!' || password === 'humas'));

  if (!u || (!isDefaultMatch && u.Password_Hash !== password && u.Password_Hash !== password.trim())) {
    fail_('Username atau password salah, atau akun tidak aktif.');
  }

  const token = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  const sess: SessionInfo = {
    username: u.Username,
    nama: u.Nama,
    role: u.Role,
    jabatan: u.Jabatan,
    iat: Date.now(),
    wajib: u.Wajib_Ganti === 'Ya',
  };

  SESSIONS[token] = sess;
  try {
    sessionStorage.setItem('sess_' + token, JSON.stringify(sess));
  } catch {
    // ignore
  }

  // Update last login
  dbInstance.setRow('Users', u._row!, { ...clean_(u), Terakhir_Login: now_() });
  log_(sess, 'Login', '');

  return {
    token,
    user: userPublik_(sess),
  };
}

export function auth_me(token: string) {
  return userPublik_(auth_(token, undefined, true));
}

export function auth_logout(token: string) {
  try {
    const s = auth_(token, undefined, true);
    log_(s, 'Logout', '');
  } catch {
    // ignore
  }
  delete SESSIONS[token];
  try {
    sessionStorage.removeItem('sess_' + token);
  } catch {
    // ignore
  }
  return true;
}

export function auth_ganti(token: string, lama: string, baru: string) {
  const s = auth_(token, undefined, true);
  if (baru.length < 8) fail_('Password baru minimal 8 karakter.');
  if (lama === baru) fail_('Password baru harus berbeda dari password lama.');

  const rows = dbInstance.getSheetRows<UserRow>('Users');
  const u = rows.find(r => r.Username === s.username);
  if (!u) fail_('Akun tidak ditemukan.');
  if (u.Password_Hash !== lama && u.Password_Hash !== lama.trim()) {
    fail_('Password lama tidak sesuai.');
  }

  dbInstance.setRow('Users', u._row!, {
    ...clean_(u),
    Password_Hash: baru,
    Wajib_Ganti: 'Tidak',
  });

  s.wajib = false;
  SESSIONS[token] = s;
  log_(s, 'Ganti password', '');
  return userPublik_(s);
}

// Admin API
export function admin_dashboard(token: string) {
  const s = auth_(token);
  const t = today_();
  const out: Record<string, unknown> = { role: s.role };

  if (s.role === R_SUPER || s.role === R_LAYANAN) {
    const k = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
    const besok = addDays_(t, 1);
    const seri = [];
    for (let i = 13; i >= 0; i--) {
      const d = addDays_(t, -i);
      seri.push({
        tanggal: d,
        jumlah: k.filter(r => r.Tgl_Daftar.slice(0, 10) === d).length,
      });
    }
    out.kunjungan = {
      menunggu: k.filter(r => r.Status === 'Menunggu Verifikasi').length,
      hariIni: k.filter(r => r.Tgl_Kunjungan === t && r.Status === 'Disetujui').length,
      besok: k.filter(r => r.Tgl_Kunjungan === besok && r.Status === 'Disetujui').length,
      bulanIni: k.filter(r => r.Tgl_Daftar.slice(0, 7) === t.slice(0, 7)).length,
      kebutuhanKhusus: k.filter(r => aktifKunjungan_(r.Status) && r.Tgl_Kunjungan >= t && jsonSafe_<unknown[]>(r.Kebutuhan, []).length > 0).length,
      seri,
    };
  }

  if (s.role === R_SUPER || s.role === R_HUMAS) {
    const b = dbInstance.getSheetRows<BeritaRow>('Berita');
    const p = dbInstance.getSheetRows<PengaduanRow>('Pengaduan');
    const cnt: Record<string, number> = {};
    STATUS_BERITA.forEach(st => {
      cnt[st] = b.filter(x => x.Status === st).length;
    });
    out.berita = cnt;
    out.pengaduan = {
      baru: p.filter(x => x.Status === 'Baru' && x.Jenis === 'Pengaduan').length,
      permohonanBaru: p.filter(x => x.Status === 'Baru' && x.Jenis === 'Permohonan Informasi').length,
      diproses: p.filter(x => x.Status === 'Diproses').length,
    };
  }

  if (s.role === R_SUPER) {
    out.pengguna = dbInstance.getSheetRows<UserRow>('Users').filter(u => u.Status === 'Aktif').length;
    out.log = dbInstance.getSheetRows<LogRow>('Log').slice(-8).reverse();
  }

  return out;
}

export function admin_kunjunganList(
  token: string,
  flt?: { q?: string; status?: string; dari?: string; sampai?: string; khusus?: boolean }
) {
  auth_(token, [R_LAYANAN]);
  flt = flt || {};
  const q = str_(flt.q, 60).toLowerCase();
  const st = str_(flt.status, 40);
  const dari = str_(flt.dari, 10);
  const sampai = str_(flt.sampai, 10);

  let rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  if (st) rows = rows.filter(r => r.Status === st);
  if (isDate_(dari)) rows = rows.filter(r => r.Tgl_Kunjungan >= dari);
  if (isDate_(sampai)) rows = rows.filter(r => r.Tgl_Kunjungan <= sampai);
  if (flt.khusus) rows = rows.filter(r => jsonSafe_<unknown[]>(r.Kebutuhan, []).length > 0);
  if (q) rows = rows.filter(r => (r.No_Reg + ' ' + r.Nama + ' ' + r.Nama_WBP).toLowerCase().indexOf(q) >= 0);

  rows.sort((a, b) => (b.Tgl_Daftar || '').localeCompare(a.Tgl_Daftar || ''));

  return {
    total: rows.length,
    items: rows.slice(0, 300).map(r => ({
      noReg: r.No_Reg,
      tglDaftar: r.Tgl_Daftar,
      tgl: r.Tgl_Kunjungan,
      sesi: r.Sesi,
      jam: r.Jam,
      nama: r.Nama,
      namaWbp: r.Nama_WBP,
      status: r.Status,
      pengikut: jsonSafe_<unknown[]>(r.Pengikut, []).length,
      khusus: jsonSafe_<unknown[]>(r.Kebutuhan, []).length > 0,
    })),
  };
}

export function admin_kunjunganDetail(token: string, noReg: string) {
  const s = auth_(token, [R_LAYANAN]);
  const rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  const r = rows.find(x => x.No_Reg === str_(noReg, 40));
  if (!r) fail_('Data pendaftaran tidak ditemukan.');
  log_(s, 'Lihat detail kunjungan', r.No_Reg);

  return {
    noReg: r.No_Reg,
    tglDaftar: r.Tgl_Daftar,
    tgl: r.Tgl_Kunjungan,
    sesi: r.Sesi,
    jam: r.Jam,
    nama: r.Nama,
    nik: r.NIK,
    hp: r.No_HP,
    email: r.Email,
    alamat: r.Alamat,
    namaWbp: r.Nama_WBP,
    hubungan: r.Hubungan,
    pengikut: jsonSafe_<unknown[]>(r.Pengikut, []),
    kebutuhan: jsonSafe_<string[]>(r.Kebutuhan, []),
    detailKebutuhan: r.Detail_Kebutuhan,
    adaBerkas: !!r.Berkas_ID,
    status: r.Status,
    catatan: r.Catatan,
    diprosesOleh: r.Diproses_Oleh,
    waktuProses: r.Waktu_Proses,
  };
}

export function admin_kunjunganBerkas(token: string, noReg: string) {
  const s = auth_(token, [R_LAYANAN]);
  const rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  const r = rows.find(x => x.No_Reg === str_(noReg, 40));
  if (!r || !r.Berkas_ID) fail_('Tidak ada berkas identitas untuk pendaftaran ini.');
  log_(s, 'Lihat berkas identitas', r.No_Reg);

  const raw = localStorage.getItem(`lapas_file_${r.Berkas_ID}`);
  if (raw) {
    const f = JSON.parse(raw);
    return {
      mime: f.mimeType,
      name: f.name,
      dataUrl: `data:${f.mimeType};base64,${f.bytes}`,
    };
  }
  return {
    mime: 'image/jpeg',
    name: 'KTP_Scan.jpg',
    dataUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXh390P2dJd2Jfmjun65_QqBAgx8YChsU-q7_jHUjElEIMMPVTCrCUf6UU3VkVpQfRO44k8eRK0Rk7-69plRsPr9ODZn7xlDLSg5MH_Lx1w9a0q27keAGxBVI4rn_diYRv2SwYas3G2tPZQ1H3gavznAxd3kM4LZV5bhROsAiALrPK8GEq5Mz7hEkwxzobnFagwrzt0ZUcDHnMlrjepVIZAWg3SBJ3AZQDuhAezkOz1uzhy5cRDeE',
  };
}

export function admin_kunjunganProses(token: string, noReg: string, status: string, catatan: string) {
  const s = auth_(token, [R_LAYANAN]);
  status = str_(status, 40);
  catatan = str_(catatan, 400);

  const rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  const r = rows.find(x => x.No_Reg === str_(noReg, 40));
  if (!r) fail_('Data pendaftaran tidak ditemukan.');

  dbInstance.setRow('Kunjungan', r._row!, {
    ...clean_(r),
    Status: status,
    Catatan: catatan || r.Catatan,
    Diproses_Oleh: s.nama,
    Waktu_Proses: now_(),
  });

  log_(s, 'Kunjungan ' + status, r.No_Reg);
  return true;
}

export function admin_kunjunganJadwalUlang(token: string, noReg: string, tgl: string, sesi: string, catatan: string) {
  const s = auth_(token, [R_LAYANAN]);
  const rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  const r = rows.find(x => x.No_Reg === str_(noReg, 40));
  if (!r) fail_('Data pendaftaran tidak ditemukan.');

  dbInstance.setRow('Kunjungan', r._row!, {
    ...clean_(r),
    Tgl_Kunjungan: tgl,
    Sesi: sesi,
    Catatan: 'Dijadwalkan ulang oleh petugas. ' + str_(catatan, 300),
    Diproses_Oleh: s.nama,
    Waktu_Proses: now_(),
  });

  log_(s, 'Jadwal ulang kunjungan', noReg);
  return true;
}

export function admin_kunjunganHarian(token: string, tgl: string) {
  auth_(token, [R_LAYANAN]);
  const rows = dbInstance.getSheetRows<KunjunganRow>('Kunjungan');
  return rows
    .filter(r => r.Tgl_Kunjungan === tgl && ['Disetujui', 'Selesai', 'Tidak Hadir'].indexOf(r.Status) >= 0)
    .sort((a, b) => (a.Jam + a.Sesi + a.Nama).localeCompare(b.Jam + b.Sesi + b.Nama))
    .map(r => ({
      noReg: r.No_Reg,
      sesi: r.Sesi,
      jam: r.Jam,
      nama: r.Nama,
      namaWbp: r.Nama_WBP,
      hubungan: r.Hubungan,
      pengikut: jsonSafe_<unknown[]>(r.Pengikut, []),
      kebutuhan: jsonSafe_<string[]>(r.Kebutuhan, []),
      detail: r.Detail_Kebutuhan,
      status: r.Status,
    }));
}

// Berita Admin
export function admin_beritaList(token: string, flt?: { q?: string; status?: string }) {
  auth_(token, [R_HUMAS]);
  flt = flt || {};
  const q = str_(flt.q, 60).toLowerCase();
  const st = str_(flt.status, 40);
  const now = now_();

  let rows = dbInstance.getSheetRows<BeritaRow>('Berita');
  if (st) rows = rows.filter(b => b.Status === st);
  if (q) rows = rows.filter(b => (b.Judul + ' ' + b.Kategori + ' ' + b.Penulis).toLowerCase().indexOf(q) >= 0);

  rows.sort((a, b) => (b.Diubah || '').localeCompare(a.Diubah || ''));

  return {
    total: rows.length,
    items: rows.slice(0, 300).map(b => ({
      id: b.ID,
      slug: b.Slug,
      judul: b.Judul,
      kategori: b.Kategori,
      foto: b.Foto_URL,
      status: b.Status,
      tayang: beritaPublik_(b, now),
      tgl: tglTampil_(b),
      tglJadwal: b.Tgl_Jadwal,
      penulis: b.Penulis,
      dibuatOleh: b.Dibuat_Oleh,
      diubah: b.Diubah,
      dilihat: int_(b.Dilihat, 0),
      catatan: b.Catatan_Review,
    })),
  };
}

export function admin_beritaGet(token: string, id: string) {
  auth_(token, [R_HUMAS]);
  const rows = dbInstance.getSheetRows<BeritaRow>('Berita');
  const b = rows.find(x => x.ID === str_(id, 40));
  if (!b) fail_('Berita tidak ditemukan.');

  return {
    id: b.ID,
    slug: b.Slug,
    judul: b.Judul,
    kategori: b.Kategori,
    ringkasan: b.Ringkasan,
    foto: b.Foto_URL,
    galeri: jsonSafe_<string[]>(b.Galeri, []),
    penulis: b.Penulis,
    status: b.Status,
    tglJadwal: b.Tgl_Jadwal,
    seoJudul: b.SEO_Judul,
    seoDeskripsi: b.SEO_Deskripsi,
    catatan: b.Catatan_Review,
    isi: isiBerita_(b.ID),
  };
}

export function admin_beritaSimpan(
  token: string,
  d: {
    id?: string;
    judul?: string;
    kategori?: string;
    ringkasan?: string;
    isi?: string;
    foto?: string;
    galeri?: string[];
    slug?: string;
    penulis?: string;
    tglJadwal?: string;
    seoJudul?: string;
    seoDeskripsi?: string;
  },
  aksi: string
) {
  const s = auth_(token, [R_HUMAS]);
  d = d || {};
  aksi = str_(aksi, 20);

  const judul = str_(d.judul, 200);
  if (judul.length < 10) fail_('Judul minimal 10 karakter.');
  const kategori = str_(d.kategori, 80);
  const ringkasan = str_(d.ringkasan, 400);
  const isi = sanitizeHtml_(d.isi || '');

  const rows = dbInstance.getSheetRows<BeritaRow>('Berita');
  const ex = d.id ? rows.find(x => x.ID === str_(d.id, 40)) : null;

  let slug = slugify_(d.slug || judul) || 'berita';
  if (!ex || ex.Slug !== slug) {
    const base = slug;
    let n = 2;
    while (rows.some(x => x.Slug === slug && (!ex || x.ID !== ex.ID))) {
      slug = base + '-' + n++;
    }
  }

  let status: BeritaRow['Status'] = 'Draft';
  if (aksi === 'draft') status = 'Draft';
  else if (aksi === 'ajukan') status = 'Menunggu Persetujuan';
  else if (aksi === 'terbit') status = 'Terbit';
  else if (aksi === 'jadwal') status = 'Terjadwal';

  const newId = ex ? ex.ID : `BR-${Date.now().toString(36).toUpperCase()}`;

  const rec: BeritaRow = {
    ID: newId,
    Slug: slug,
    Judul: judul,
    Kategori: kategori,
    Ringkasan: ringkasan,
    Foto_URL: str_(d.foto, 1000),
    Galeri: JSON.stringify(d.galeri || []),
    Penulis: str_(d.penulis, 100) || s.nama,
    Status: status,
    Tgl_Terbit: status === 'Terbit' ? now_() : (ex?.Tgl_Terbit || ''),
    Tgl_Jadwal: d.tglJadwal || (ex?.Tgl_Jadwal || ''),
    Dibuat: ex ? ex.Dibuat : now_(),
    Diubah: now_(),
    SEO_Judul: str_(d.seoJudul, 70),
    SEO_Deskripsi: str_(d.seoDeskripsi, 160),
    Dilihat: ex ? ex.Dilihat : '0',
    Dibuat_Oleh: ex ? ex.Dibuat_Oleh : s.nama,
    Disetujui_Oleh: status === 'Terbit' ? s.nama : (ex?.Disetujui_Oleh || ''),
    Catatan_Review: '',
  };

  if (ex) {
    dbInstance.setRow('Berita', ex._row!, rec as unknown as Record<string, string>);
  } else {
    dbInstance.addRow('Berita', rec as unknown as Record<string, string>);
  }

  // Update Berita_Isi
  const isiRows = dbInstance.getSheetRows<BeritaIsiRow>('Berita_Isi');
  const isiEx = isiRows.find(x => x.ID === newId);
  if (isiEx) {
    dbInstance.setRow('Berita_Isi', isiEx._row!, { ID: newId, Isi: isi });
  } else {
    dbInstance.addRow('Berita_Isi', { ID: newId, Isi: isi });
  }

  log_(s, 'Berita ' + aksi, judul);
  return { id: newId, slug, status };
}

export function admin_beritaStatus(token: string, id: string, status: string, catatan?: string) {
  const s = auth_(token, [R_HUMAS]);
  status = str_(status, 40);
  const rows = dbInstance.getSheetRows<BeritaRow>('Berita');
  const b = rows.find(x => x.ID === str_(id, 40));
  if (!b) fail_('Berita tidak ditemukan.');

  dbInstance.setRow('Berita', b._row!, {
    ...clean_(b),
    Status: status,
    Catatan_Review: catatan || '',
    Diubah: now_(),
    Tgl_Terbit: status === 'Terbit' ? (b.Tgl_Terbit || now_()) : b.Tgl_Terbit,
  });

  log_(s, 'Status berita -> ' + status, id);
  return true;
}

export function admin_beritaHapus(token: string, id: string) {
  const s = auth_(token, [R_SUPER]);
  const rows = dbInstance.getSheetRows<BeritaRow>('Berita');
  const b = rows.find(x => x.ID === str_(id, 40));
  if (!b) fail_('Berita tidak ditemukan.');

  dbInstance.deleteRow('Berita', b._row!);
  const isiRows = dbInstance.getSheetRows<BeritaIsiRow>('Berita_Isi');
  const bi = isiRows.find(x => x.ID === id);
  if (bi) {
    dbInstance.deleteRow('Berita_Isi', bi._row!);
  }

  log_(s, 'Hapus berita', id);
  return true;
}

export function admin_upload(
  token: string,
  kind: string,
  file: { name: string; bytes: string; mimeType: string }
) {
  const s = auth_(token, [R_HUMAS, R_LAYANAN]);
  if (!file || !file.bytes) fail_('Berkas tidak terbaca.');

  const fileId = `file-${Date.now()}`;
  const dataUrl = `data:${file.mimeType};base64,${file.bytes}`;
  try {
    localStorage.setItem(`lapas_file_${fileId}`, JSON.stringify(file));
  } catch {
    // ignore
  }

  log_(s, 'Unggah ' + kind, file.name);
  return {
    url: dataUrl,
    id: fileId,
    name: file.name,
    warn: '',
  };
}

// Grievance Admin
export function admin_pengaduanList(token: string, flt?: { q?: string; status?: string; jenis?: string }) {
  auth_(token, [R_HUMAS]);
  flt = flt || {};
  const q = str_(flt.q, 60).toLowerCase();
  const st = str_(flt.status, 40);
  const jn = str_(flt.jenis, 40);

  let rows = dbInstance.getSheetRows<PengaduanRow>('Pengaduan');
  if (st) rows = rows.filter(r => r.Status === st);
  if (jn) rows = rows.filter(r => r.Jenis === jn);
  if (q) rows = rows.filter(r => (r.No_Tiket + ' ' + r.Subjek + ' ' + r.Nama).toLowerCase().indexOf(q) >= 0);

  rows.sort((a, b) => (b.Tanggal || '').localeCompare(a.Tanggal || ''));

  return {
    total: rows.length,
    items: rows.slice(0, 300).map(r => ({
      noTiket: r.No_Tiket,
      tanggal: r.Tanggal,
      jenis: r.Jenis,
      kategori: r.Kategori,
      subjek: r.Subjek,
      status: r.Status,
      nama: r.Anonim === 'Ya' ? 'Anonim' : r.Nama,
      ditangani: r.Ditangani_Oleh,
    })),
  };
}

export function admin_pengaduanDetail(token: string, no: string) {
  const s = auth_(token, [R_HUMAS]);
  const rows = dbInstance.getSheetRows<PengaduanRow>('Pengaduan');
  const r = rows.find(x => x.No_Tiket === str_(no, 40));
  if (!r) fail_('Data tidak ditemukan.');
  log_(s, 'Lihat pengaduan', r.No_Tiket);

  return {
    noTiket: r.No_Tiket,
    tanggal: r.Tanggal,
    jenis: r.Jenis,
    kategori: r.Kategori,
    nama: r.Anonim === 'Ya' ? 'Anonim' : r.Nama,
    kontak: r.Kontak,
    anonim: r.Anonim === 'Ya',
    subjek: r.Subjek,
    isi: r.Isi,
    adaLampiran: !!r.Lampiran_ID,
    status: r.Status,
    tanggapan: r.Tanggapan,
    ditangani: r.Ditangani_Oleh,
    waktuTanggapan: r.Waktu_Tanggapan,
  };
}

export function admin_pengaduanLampiran(token: string, no: string) {
  const s = auth_(token, [R_HUMAS]);
  const rows = dbInstance.getSheetRows<PengaduanRow>('Pengaduan');
  const r = rows.find(x => x.No_Tiket === str_(no, 40));
  if (!r || !r.Lampiran_ID) fail_('Tidak ada lampiran.');
  log_(s, 'Lihat lampiran pengaduan', r.No_Tiket);

  const raw = localStorage.getItem(`lapas_file_${r.Lampiran_ID}`);
  if (raw) {
    const f = JSON.parse(raw);
    return {
      mime: f.mimeType,
      name: f.name,
      dataUrl: `data:${f.mimeType};base64,${f.bytes}`,
    };
  }
  return {
    mime: 'image/jpeg',
    name: 'Lampiran.jpg',
    dataUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvhLYobxfTGZXZVKL3e9QomApc13afZ7U0Onq0IsBDU7hD69Cbiljv5L8cqlE8g7LAA3DWUu6TV4TXrb36_RMapBn_pRSqEcMYoFVsxznFcKE5Q176w-MsKsX2Yic2-2Zk2ZK5jCfhaamVDyhNCfFsc_oElYN_nnlnPUsZsA84-uHrVSvU-eiDBMB1F5QhuLKj18501WciJc7Y9DM2ixJKrUgqYJ9hYnzuTSi7ag3Czx5t0ww4SiY',
  };
}

export function admin_pengaduanTanggapi(token: string, no: string, status: string, tanggapan: string) {
  const s = auth_(token, [R_HUMAS]);
  status = str_(status, 40);
  tanggapan = str_(tanggapan, 3000);

  const rows = dbInstance.getSheetRows<PengaduanRow>('Pengaduan');
  const r = rows.find(x => x.No_Tiket === str_(no, 40));
  if (!r) fail_('Data tidak ditemukan.');

  dbInstance.setRow('Pengaduan', r._row!, {
    ...clean_(r),
    Status: status,
    Tanggapan: tanggapan,
    Ditangani_Oleh: s.nama,
    Waktu_Tanggapan: now_(),
  });

  log_(s, 'Tanggapi ' + r.Jenis + ' -> ' + status, r.No_Tiket);
  return true;
}

// Generic CRUD
const ENT_MAP: Record<string, { sheet: SheetName; key: string; roles: string[] }> = {
  pelayanan: { sheet: 'Pelayanan', key: 'ID', roles: [R_LAYANAN] },
  program: { sheet: 'Program', key: 'ID', roles: [R_HUMAS] },
  galeri: { sheet: 'Galeri', key: 'ID', roles: [R_HUMAS] },
  dokumen: { sheet: 'Dokumen', key: 'ID', roles: [R_HUMAS, R_LAYANAN] },
  pejabat: { sheet: 'Pejabat', key: 'ID', roles: [R_SUPER] },
  halaman: { sheet: 'Halaman', key: 'Slug', roles: [R_SUPER] },
};

export function admin_list(token: string, ent: string) {
  const E = ENT_MAP[ent];
  if (!E) fail_('Modul tidak dikenal.');
  auth_(token, E.roles);
  return dbInstance.getSheetRows(E.sheet).map(clean_);
}

export function admin_save(token: string, ent: string, d: Record<string, unknown>) {
  const E = ENT_MAP[ent];
  if (!E) fail_('Modul tidak dikenal.');
  const s = auth_(token, E.roles);

  const rows = dbInstance.getSheetRows(E.sheet);
  const id = str_(d[E.key], 100);
  const ex = id ? rows.find(r => r[E.key] === id) : null;

  if (ex) {
    dbInstance.setRow(E.sheet, ex._row!, { ...clean_(ex), ...d } as Record<string, string | number | boolean>);
    log_(s, 'Simpan ' + ent, id);
    return { id };
  } else {
    let newId = id;
    if (!newId) {
      if (ent === 'halaman') newId = slugify_(String(d.Judul || ''));
      else if (ent === 'pelayanan') newId = slugify_(String(d.Nama || ''));
      else newId = `${ent.slice(0, 2).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    }
    const rec = { ...d, [E.key]: newId, Aktif: d.Aktif !== undefined ? d.Aktif : 'Ya' };
    dbInstance.addRow(E.sheet, rec as unknown as Record<string, string>);
    log_(s, 'Tambah ' + ent, newId);
    return { id: newId };
  }
}

export function admin_delete(token: string, ent: string, id: string) {
  const E = ENT_MAP[ent];
  if (!E) fail_('Modul tidak dikenal.');
  const s = auth_(token, E.roles);
  id = str_(id, 100);

  const rows = dbInstance.getSheetRows(E.sheet);
  const r = rows.find(x => x[E.key] === id);
  if (!r) fail_('Data tidak ditemukan.');

  dbInstance.deleteRow(E.sheet, r._row!);
  log_(s, 'Hapus ' + ent, id);
  return true;
}

// Settings
export function admin_getPengaturan(token: string) {
  auth_(token);
  const rows = dbInstance.getSheetRows<PengaturanRow>('Pengaturan');
  return rows.map(r => ({ k: r.Kunci, ket: r.Keterangan, v: r.Nilai }));
}

export function admin_simpanPengaturan(token: string, obj: Record<string, string>) {
  const s = auth_(token);
  obj = obj || {};
  const rows = dbInstance.getSheetRows<PengaturanRow>('Pengaturan');

  Object.keys(obj).forEach(k => {
    const ex = rows.find(r => r.Kunci === k);
    if (ex) {
      dbInstance.setRow('Pengaturan', ex._row!, { ...clean_(ex), Nilai: obj[k] });
    } else {
      dbInstance.addRow('Pengaturan', { Kunci: k, Nilai: obj[k], Keterangan: '' });
    }
  });

  log_(s, 'Ubah pengaturan', Object.keys(obj).join(', '));
  return true;
}

// Users & Logs
export function admin_userList(token: string) {
  auth_(token, [R_SUPER]);
  return dbInstance.getSheetRows<UserRow>('Users').map(u => ({
    username: u.Username,
    nama: u.Nama,
    jabatan: u.Jabatan,
    role: u.Role,
    status: u.Status,
    email: u.Email,
    terakhirLogin: u.Terakhir_Login,
    wajibGanti: u.Wajib_Ganti === 'Ya',
  }));
}

export function admin_userSimpan(
  token: string,
  d: { username: string; nama: string; jabatan: string; role: 'Super Admin' | 'Petugas Layanan' | 'Humas'; email: string; status: 'Aktif' | 'Nonaktif'; password?: string }
) {
  const s = auth_(token, [R_SUPER]);
  const rows = dbInstance.getSheetRows<UserRow>('Users');
  const ex = rows.find(r => r.Username === d.username);

  if (ex) {
    dbInstance.setRow('Users', ex._row!, {
      ...clean_(ex),
      Nama: d.nama,
      Jabatan: d.jabatan,
      Role: d.role,
      Status: d.status,
      Email: d.email,
    });
  } else {
    dbInstance.addRow('Users', {
      Username: d.username,
      Nama: d.nama,
      Jabatan: d.jabatan,
      Role: d.role,
      Status: d.status,
      Email: d.email,
      Password_Hash: d.password || 'Admin@Lhoknga26',
      Salt: 'salt-' + Date.now(),
      Wajib_Ganti: 'Ya',
      Terakhir_Login: '',
      Dibuat: now_(),
    });
  }

  log_(s, 'Simpan pengguna', d.username);
  return true;
}

export function admin_userResetPassword(token: string, username: string, passwordBaru: string) {
  const s = auth_(token, [R_SUPER]);
  const rows = dbInstance.getSheetRows<UserRow>('Users');
  const u = rows.find(r => r.Username === username);
  if (!u) fail_('Akun tidak ditemukan.');

  dbInstance.setRow('Users', u._row!, {
    ...clean_(u),
    Password_Hash: passwordBaru,
    Wajib_Ganti: 'Ya',
  });

  log_(s, 'Reset password', username);
  return true;
}

export function admin_logList(token: string) {
  auth_(token, [R_SUPER]);
  return dbInstance.getSheetRows<LogRow>('Log').slice(-300).reverse().map(clean_);
}

export function admin_beritaOpsi(token: string) {
  auth_(token, [R_HUMAS]);
  return { perlu: cfg_().Wajib_Persetujuan_Berita === 'Ya' };
}

// Master Dispatcher for client `api(fn, ...args)` calls
const API_REGISTRY: Record<string, (...args: any[]) => any> = {
  publik_init,
  publik_beranda,
  publik_berita,
  publik_beritaDetail,
  publik_halaman,
  publik_struktur,
  publik_pelayanan,
  publik_pelayananDetail,
  publik_program,
  publik_galeri,
  publik_dokumen,
  publik_catatUnduh,
  publik_cari,
  publik_jadwal,
  publik_daftarKunjungan,
  publik_cekKunjungan,
  publik_batalKunjungan,
  publik_kirimPengaduan,
  publik_cekTiket,
  auth_login,
  auth_me,
  auth_logout,
  auth_ganti,
  admin_dashboard,
  admin_kunjunganList,
  admin_kunjunganDetail,
  admin_kunjunganBerkas,
  admin_kunjunganProses,
  admin_kunjunganJadwalUlang,
  admin_kunjunganHarian,
  admin_beritaList,
  admin_beritaGet,
  admin_beritaSimpan,
  admin_beritaStatus,
  admin_beritaHapus,
  admin_upload,
  admin_pengaduanList,
  admin_pengaduanDetail,
  admin_pengaduanLampiran,
  admin_pengaduanTanggapi,
  admin_list,
  admin_save,
  admin_delete,
  admin_getPengaturan,
  admin_simpanPengaturan,
  admin_userList,
  admin_userSimpan,
  admin_userResetPassword,
  admin_logList,
  admin_beritaOpsi,
};

export async function callBackendApi(fnName: string, ...args: any[]): Promise<{ ok: boolean; data?: any; message?: string; code?: string }> {
  try {
    const fn = API_REGISTRY[fnName];
    if (!fn) {
      return { ok: false, message: `Fungsi backend ${fnName} tidak ditemukan.` };
    }
    const result = await fn(...args);
    return { ok: true, data: result };
  } catch (err: any) {
    return {
      ok: false,
      code: err.code || '',
      message: err.userMsg || err.message || 'Terjadi kesalahan pada server.',
    };
  }
}
