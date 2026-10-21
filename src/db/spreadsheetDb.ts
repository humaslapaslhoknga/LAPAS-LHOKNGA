import { SheetName } from './types';
import {
  SEED_PENGATURAN,
  SEED_USERS,
  SEED_HALAMAN,
  SEED_PELAYANAN,
  SEED_PROGRAM,
  SEED_BERITA,
  SEED_BERITA_ISI,
  SEED_PEJABAT,
  SEED_GALERI,
  SEED_DOKUMEN,
  SEED_KUNJUNGAN,
  SEED_PENGADUAN,
  SEED_LOG,
} from './initialData';

export const SCHEMA: Record<SheetName, string[]> = {
  Users: ['Username', 'Nama', 'Jabatan', 'Role', 'Password_Hash', 'Salt', 'Status', 'Wajib_Ganti', 'Email', 'Terakhir_Login', 'Dibuat'],
  Pengaturan: ['Kunci', 'Nilai', 'Keterangan'],
  Halaman: ['Slug', 'Judul', 'Kelompok', 'Isi', 'Diubah', 'Diubah_Oleh'],
  Pejabat: ['ID', 'Nama', 'Jabatan', 'Foto_URL', 'Atasan_ID', 'Urutan', 'Tipe', 'Profil', 'Aktif'],
  Berita: ['ID', 'Slug', 'Judul', 'Kategori', 'Ringkasan', 'Foto_URL', 'Galeri', 'Penulis', 'Status', 'Tgl_Terbit', 'Tgl_Jadwal', 'Dibuat', 'Diubah', 'SEO_Judul', 'SEO_Deskripsi', 'Dilihat', 'Dibuat_Oleh', 'Disetujui_Oleh', 'Catatan_Review'],
  Berita_Isi: ['ID', 'Isi'],
  Pelayanan: ['ID', 'Kelompok', 'Nama', 'Ikon', 'Ringkasan', 'Tujuan', 'Persyaratan', 'Prosedur', 'Alur', 'Waktu', 'Biaya', 'Dasar_Hukum', 'Dokumen', 'Formulir', 'FAQ', 'Kontak', 'Urutan', 'Aktif'],
  Program: ['ID', 'Judul', 'Kategori', 'Ikon', 'Deskripsi', 'Foto_URL', 'Capaian', 'Urutan', 'Aktif'],
  Galeri: ['ID', 'Judul', 'Foto_URL', 'Album', 'Tanggal', 'Dibuat_Oleh', 'Aktif'],
  Dokumen: ['ID', 'Judul', 'Kategori', 'Deskripsi', 'File_URL', 'Tanggal', 'Unduhan', 'Dibuat_Oleh', 'Aktif'],
  Kunjungan: ['No_Reg', 'Kode_Cek', 'Tgl_Daftar', 'Tgl_Kunjungan', 'Sesi', 'Jam', 'Nama', 'NIK', 'No_HP', 'Email', 'Alamat', 'Nama_WBP', 'Hubungan', 'Pengikut', 'Kebutuhan', 'Detail_Kebutuhan', 'Berkas_ID', 'Status', 'Catatan', 'Diproses_Oleh', 'Waktu_Proses'],
  Pengaduan: ['No_Tiket', 'Kode_Cek', 'Tanggal', 'Jenis', 'Kategori', 'Nama', 'Kontak', 'Anonim', 'Subjek', 'Isi', 'Lampiran_ID', 'Status', 'Tanggapan', 'Ditangani_Oleh', 'Waktu_Tanggapan'],
  Log: ['Waktu', 'User', 'Role', 'Aksi', 'Detail'],
};

const DB_KEY = 'lapas_lhoknga_db_v2';

export class SpreadsheetDatabase {
  private cache: Record<string, unknown> = {};

  constructor() {
    this.ensureInitialized();
  }

  public ensureInitialized() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (!stored) {
        this.resetToDefaults();
      }
    } catch {
      this.resetToDefaults();
    }
  }

  public resetToDefaults() {
    const defaultDb: Record<SheetName, Record<string, string>[]> = {
      Users: JSON.parse(JSON.stringify(SEED_USERS)),
      Pengaturan: JSON.parse(JSON.stringify(SEED_PENGATURAN)),
      Halaman: JSON.parse(JSON.stringify(SEED_HALAMAN)),
      Pejabat: JSON.parse(JSON.stringify(SEED_PEJABAT)),
      Berita: JSON.parse(JSON.stringify(SEED_BERITA)),
      Berita_Isi: JSON.parse(JSON.stringify(SEED_BERITA_ISI)),
      Pelayanan: JSON.parse(JSON.stringify(SEED_PELAYANAN)),
      Program: JSON.parse(JSON.stringify(SEED_PROGRAM)),
      Galeri: JSON.parse(JSON.stringify(SEED_GALERI)),
      Dokumen: JSON.parse(JSON.stringify(SEED_DOKUMEN)),
      Kunjungan: JSON.parse(JSON.stringify(SEED_KUNJUNGAN)),
      Pengaduan: JSON.parse(JSON.stringify(SEED_PENGADUAN)),
      Log: JSON.parse(JSON.stringify(SEED_LOG)),
    };

    try {
      localStorage.setItem(DB_KEY, JSON.stringify(defaultDb));
      this.cache = {};
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }

  private loadRawDb(): Record<SheetName, Record<string, string>[]> {
    try {
      const s = localStorage.getItem(DB_KEY);
      if (s) {
        return JSON.parse(s);
      }
    } catch (e) {
      console.error(e);
    }
    this.resetToDefaults();
    return JSON.parse(localStorage.getItem(DB_KEY)!);
  }

  private saveRawDb(db: Record<SheetName, Record<string, string>[]>) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      this.cache = {};
    } catch (e) {
      console.error('Failed to save db', e);
    }
  }

  public getSheetRows<T = Record<string, string>>(sheetName: SheetName): (T & { _row: number })[] {
    const db = this.loadRawDb();
    const rows = db[sheetName] || [];
    return rows.map((r, idx) => ({
      ...r,
      _row: idx + 2, // Header is row 1, data starts at row 2
    })) as unknown as (T & { _row: number })[];
  }

  public addRow(sheetName: SheetName, rowData: Record<string, string | number | boolean>): number {
    const db = this.loadRawDb();
    const headers = SCHEMA[sheetName] || [];
    const sanitized: Record<string, string> = {};
    headers.forEach(h => {
      sanitized[h] = rowData[h] === undefined || rowData[h] === null ? '' : String(rowData[h]);
    });

    if (!db[sheetName]) {
      db[sheetName] = [];
    }
    db[sheetName].push(sanitized);
    this.saveRawDb(db);
    return db[sheetName].length + 1;
  }

  public setRow(sheetName: SheetName, rowNumber: number, rowData: Record<string, string | number | boolean>) {
    const db = this.loadRawDb();
    const idx = rowNumber - 2;
    if (idx >= 0 && db[sheetName] && idx < db[sheetName].length) {
      const headers = SCHEMA[sheetName] || [];
      const sanitized: Record<string, string> = {};
      headers.forEach(h => {
        sanitized[h] = rowData[h] === undefined || rowData[h] === null ? '' : String(rowData[h]);
      });
      db[sheetName][idx] = sanitized;
      this.saveRawDb(db);
    }
  }

  public deleteRow(sheetName: SheetName, rowNumber: number) {
    const db = this.loadRawDb();
    const idx = rowNumber - 2;
    if (idx >= 0 && db[sheetName] && idx < db[sheetName].length) {
      db[sheetName].splice(idx, 1);
      this.saveRawDb(db);
    }
  }

  public getAllSheetsData(): Record<SheetName, Record<string, string>[]> {
    return this.loadRawDb();
  }

  public exportDatabaseJson(): string {
    return JSON.stringify(this.loadRawDb(), null, 2);
  }

  public importDatabaseJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        this.saveRawDb(parsed);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }
}

export const dbInstance = new SpreadsheetDatabase();
