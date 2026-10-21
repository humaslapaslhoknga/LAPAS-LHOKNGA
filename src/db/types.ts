export interface UserRow {
  Username: string;
  Nama: string;
  Jabatan: string;
  Role: 'Super Admin' | 'Petugas Layanan' | 'Humas';
  Password_Hash: string;
  Salt: string;
  Status: 'Aktif' | 'Nonaktif';
  Wajib_Ganti: 'Ya' | 'Tidak';
  Email: string;
  Terakhir_Login: string;
  Dibuat: string;
  _row?: number;
}

export interface PengaturanRow {
  Kunci: string;
  Nilai: string;
  Keterangan: string;
  _row?: number;
}

export interface HalamanRow {
  Slug: string;
  Judul: string;
  Kelompok: string;
  Isi: string;
  Diubah: string;
  Diubah_Oleh: string;
  _row?: number;
}

export interface PejabatRow {
  ID: string;
  Nama: string;
  Jabatan: string;
  Foto_URL: string;
  Atasan_ID: string;
  Urutan: string;
  Tipe: string;
  Profil: string;
  Aktif: string;
  _atasan?: string;
  _row?: number;
}

export interface BeritaRow {
  ID: string;
  Slug: string;
  Judul: string;
  Kategori: string;
  Ringkasan: string;
  Foto_URL: string;
  Galeri: string; // JSON array of urls
  Penulis: string;
  Status: 'Draft' | 'Menunggu Persetujuan' | 'Terjadwal' | 'Terbit' | 'Arsip';
  Tgl_Terbit: string;
  Tgl_Jadwal: string;
  Dibuat: string;
  Diubah: string;
  SEO_Judul: string;
  SEO_Deskripsi: string;
  Dilihat: string;
  Dibuat_Oleh: string;
  Disetujui_Oleh: string;
  Catatan_Review: string;
  _row?: number;
}

export interface BeritaIsiRow {
  ID: string;
  Isi: string;
  _row?: number;
}

export interface PelayananRow {
  ID: string;
  Kelompok: string;
  Nama: string;
  Ikon: string;
  Ringkasan: string;
  Tujuan: string;
  Persyaratan: string;
  Prosedur: string;
  Alur: string;
  Waktu: string;
  Biaya: string;
  Dasar_Hukum: string;
  Dokumen: string;
  Formulir: string;
  FAQ: string;
  Kontak: string;
  Urutan: string;
  Aktif: string;
  _row?: number;
}

export interface ProgramRow {
  ID: string;
  Judul: string;
  Kategori: string;
  Ikon: string;
  Deskripsi: string;
  Foto_URL: string;
  Capaian: string;
  Urutan: string;
  Aktif: string;
  _row?: number;
}

export interface GaleriRow {
  ID: string;
  Judul: string;
  Foto_URL: string;
  Album: string;
  Tanggal: string;
  Dibuat_Oleh: string;
  Aktif: string;
  _row?: number;
}

export interface DokumenRow {
  ID: string;
  Judul: string;
  Kategori: string;
  Deskripsi: string;
  File_URL: string;
  Tanggal: string;
  Unduhan: string;
  Dibuat_Oleh: string;
  Aktif: string;
  _row?: number;
}

export interface KunjunganRow {
  No_Reg: string;
  Kode_Cek: string;
  Tgl_Daftar: string;
  Tgl_Kunjungan: string;
  Sesi: string;
  Jam: string;
  Nama: string;
  NIK: string;
  No_HP: string;
  Email: string;
  Alamat: string;
  Nama_WBP: string;
  Hubungan: string;
  Pengikut: string; // JSON array
  Kebutuhan: string; // JSON array
  Detail_Kebutuhan: string;
  Berkas_ID: string;
  Status: string;
  Catatan: string;
  Diproses_Oleh: string;
  Waktu_Proses: string;
  _row?: number;
}

export interface PengaduanRow {
  No_Tiket: string;
  Kode_Cek: string;
  Tanggal: string;
  Jenis: string;
  Kategori: string;
  Nama: string;
  Kontak: string;
  Anonim: string;
  Subjek: string;
  Isi: string;
  Lampiran_ID: string;
  Status: string;
  Tanggapan: string;
  Ditangani_Oleh: string;
  Waktu_Tanggapan: string;
  _row?: number;
}

export interface LogRow {
  Waktu: string;
  User: string;
  Role: string;
  Aksi: string;
  Detail: string;
  _row?: number;
}

export type SheetName =
  | 'Users'
  | 'Pengaturan'
  | 'Halaman'
  | 'Pejabat'
  | 'Berita'
  | 'Berita_Isi'
  | 'Pelayanan'
  | 'Program'
  | 'Galeri'
  | 'Dokumen'
  | 'Kunjungan'
  | 'Pengaduan'
  | 'Log';
