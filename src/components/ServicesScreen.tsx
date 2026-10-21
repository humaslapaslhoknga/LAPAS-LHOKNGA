import React, { useState } from 'react';
import { SCHEDULE_RULES, PROHIBITED_ITEMS } from '../data/mockData';

export const ServicesScreen: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'jadwal' | 'sop' | 'terlarang' | 'integrasi' | 'pengaduan'>('jadwal');
  
  // Complaint form state
  const [complaintName, setComplaintName] = useState('');
  const [complaintPhone, setComplaintPhone] = useState('');
  const [complaintType, setComplaintType] = useState('Pelayanan Loket');
  const [complaintDetail, setComplaintDetail] = useState('');
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [complaintTicketId, setComplaintTicketId] = useState('');

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `ADU-${Math.floor(100000 + Math.random() * 900000)}`;
    setComplaintTicketId(id);
    setComplaintSubmitted(true);
  };

  return (
    <div className="flex flex-col w-full pb-10 px-4 pt-4">
      {/* Title */}
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[#001428] tracking-tight">
          Layanan & Pusat Informasi
        </h1>
        <p className="text-[12px] text-[#43474d] mt-0.5">
          Standar Pelayanan Publik Lapas Kelas III Lhoknga (Zona Integritas WBK)
        </p>
      </div>

      {/* Pill/Segmented Filter Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none text-[12px]">
        <button
          type="button"
          onClick={() => setActiveSection('jadwal')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'jadwal'
              ? 'bg-[#001428] text-white'
              : 'bg-white text-[#43474d] border border-[#e5eeff] hover:bg-[#f8f9ff]'
          }`}
        >
          Jadwal Besuk
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('sop')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'sop'
              ? 'bg-[#001428] text-white'
              : 'bg-white text-[#43474d] border border-[#e5eeff] hover:bg-[#f8f9ff]'
          }`}
        >
          SOP & Pakaian
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('terlarang')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'terlarang'
              ? 'bg-[#001428] text-white'
              : 'bg-white text-[#43474d] border border-[#e5eeff] hover:bg-[#f8f9ff]'
          }`}
        >
          Barang Terlarang
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('integrasi')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'integrasi'
              ? 'bg-[#001428] text-white'
              : 'bg-white text-[#43474d] border border-[#e5eeff] hover:bg-[#f8f9ff]'
          }`}
        >
          Hak Integrasi
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('pengaduan')}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSection === 'pengaduan'
              ? 'bg-[#001428] text-white'
              : 'bg-white text-[#43474d] border border-[#e5eeff] hover:bg-[#f8f9ff]'
          }`}
        >
          Pengaduan WBK
        </button>
      </div>

      {/* Section 1: Jadwal Besuk */}
      {activeSection === 'jadwal' && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-white rounded-xl p-4 border border-[#e5eeff] shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px] text-[#21a173]">
                calendar_clock
              </span>
              <h2 className="text-[14px] font-bold text-[#001428]">
                Jadwal Kunjungan Tatap Muka Berdasarkan Blok
              </h2>
            </div>
            <p className="text-[12px] text-[#43474d] mb-3 leading-relaxed">
              Untuk menjaga kapasitas dan kenyamanan ruang temu ramah HAM, kunjungan diatur menurut jadwal blok hunian WBP:
            </p>

            <div className="space-y-2 text-[12px]">
              {SCHEDULE_RULES.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] flex items-start justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-[#001428] block">{rule.day}</span>
                    <span className="text-[#43474d] text-[11px]">{rule.blocks}</span>
                  </div>
                  <span className="font-semibold text-[#904d00] text-[11px] whitespace-nowrap">
                    {rule.session}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Jam Pelayanan */}
          <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dce9ff] text-[12px]">
            <span className="font-bold text-[#001428] block mb-1">
              Catatan Sesi Pelayanan Kunjungan:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-[#43474d]">
              <li>Sesi Pagi: 08.30 s/d 11.30 WIB (Pendaftaran tutup 11.00 WIB)</li>
              <li>Istirahat & Sterilisasi: 11.30 s/d 13.30 WIB</li>
              <li>Sesi Siang: 13.30 s/d 15.00 WIB (Pendaftaran tutup 14.30 WIB)</li>
              <li>Durasi waktu temu tiap keluarga adalah maksimal 30 menit</li>
            </ul>
          </div>
        </div>
      )}

      {/* Section 2: SOP & Pakaian */}
      {activeSection === 'sop' && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-white rounded-xl overflow-hidden border border-[#e5eeff] shadow-xs">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXh390P2dJd2Jfmjun65_QqBAgx8YChsU-q7_jHUjElEIMMPVTCrCUf6UU3VkVpQfRO44k8eRK0Rk7-69plRsPr9ODZn7xlDLSg5MH_Lx1w9a0q27keAGxBVI4rn_diYRv2SwYas3G2tPZQ1H3gavznAxd3kM4LZV5bhROsAiALrPK8GEq5Mz7hEkwxzobnFagwrzt0ZUcDHnMlrjepVIZAWg3SBJ3AZQDuhAezkOz1uzhy5cRDeE"
              alt="Tata Tertib Pakaian Pengunjung Lapas Lhoknga"
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider block mb-1">
                Kearifan Lokal & Syariat Islam Aceh
              </span>
              <h2 className="text-[15px] font-bold text-[#001428] mb-2">
                Tata Tertib Berbusana Pengunjung Lapas
              </h2>
              <div className="space-y-2 text-[12px] text-[#43474d] leading-relaxed">
                <p>
                  <strong>Pengunjung Wanita:</strong> Wajib mengenakan busana muslimah yang sopan dan longgar (tidak ketat/transparan), bawahan panjang hingga mata kaki, dan memakai jilbab dengan rapi.
                </p>
                <p>
                  <strong>Pengunjung Pria:</strong> Wajib memakai kemeja atau baju berkerah, celana panjang bahan/denim utuh (tidak sobek atau celana pendek), serta alas kaki tertutup/sepatu.
                </p>
                <p className="text-[#ba1a1a] font-medium pt-1">
                  * Petugas berhak menolak pengunjung yang mengenakan kaos oblong tanpa lengan, celana pendek, atau pakaian ketat.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Barang Terlarang */}
      {activeSection === 'terlarang' && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-white rounded-xl p-4 border border-[#e5eeff] shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[22px]">block</span>
              <h2 className="text-[14px] font-bold text-[#001428]">
                Daftar Barang Terlarang Masuk (Zero Tolerance)
              </h2>
            </div>
            <p className="text-[12px] text-[#43474d] mb-3">
              Seluruh barang bawaan akan diperiksa dengan pemindai X-Ray dan pemeriksaan fisik ketat di pos P2U.
            </p>

            <div className="space-y-2 text-[12px]">
              {PROHIBITED_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#fff8f0] border border-[#ffdcc3] flex items-start gap-2.5"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#ba1a1a] flex-shrink-0 mt-0.5">
                    cancel
                  </span>
                  <div>
                    <span className="font-bold text-[#001428] block">{item.name}</span>
                    <span className="text-[#663500] text-[11px]">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Hak Integrasi */}
      {activeSection === 'integrasi' && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-white rounded-xl p-4 border border-[#e5eeff] shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-[#005137]">
              <span className="material-symbols-outlined text-[22px]">verified</span>
              <h2 className="text-[14px] font-bold text-[#001428]">
                Layanan Hak Integrasi WBP (100% Gratis)
              </h2>
            </div>
            <p className="text-[12px] text-[#43474d] mb-3 leading-relaxed">
              Hak bersyarat bagi warga binaan yang telah memenuhi syarat substantif dan administratif:
            </p>

            <div className="space-y-2.5 text-[12px]">
              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                <span className="font-bold text-[#001428] block">
                  1. Pembebasan Bersyarat (PB)
                </span>
                <p className="text-[#43474d] text-[11px] mt-0.5">
                  Telah menjalani sekurang-kurangnya 2/3 masa pidana (minimal 9 bulan), berkelakuan baik (SPPN), dan ada surat jaminan keluarga bermaterai.
                </p>
              </div>

              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                <span className="font-bold text-[#001428] block">2. Cuti Bersyarat (CB)</span>
                <p className="text-[#43474d] text-[11px] mt-0.5">
                  Bagi narapidana dengan masa pidana paling lama 1 tahun 6 bulan dan telah menjalani sekurang-kurangnya 2/3 masa pidana.
                </p>
              </div>

              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                <span className="font-bold text-[#001428] block">
                  3. Cuti Menjelang Bebas (CMB)
                </span>
                <p className="text-[#43474d] text-[11px] mt-0.5">
                  Diberikan sebesar remisi terakhir maksimal 3 bulan jika telah menjalani 2/3 masa pidana.
                </p>
              </div>

              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                <span className="font-bold text-[#001428] block">4. Remisi Pidana</span>
                <p className="text-[#43474d] text-[11px] mt-0.5">
                  Pengurangan masa pidana pada Hari Raya Idul Fitri (Remisi Khusus) dan Hari Kemerdekaan RI 17 Agustus (Remisi Umum).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Pengaduan WBK */}
      {activeSection === 'pengaduan' && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-white rounded-xl p-4 border border-[#e5eeff] shadow-xs">
            <span className="text-[11px] font-bold text-[#005137] uppercase tracking-wider block mb-1">
              Zona Integritas WBK / WBBM
            </span>
            <h2 className="text-[15px] font-bold text-[#001428] mb-1">
              Formulir Layanan Pengaduan Masyarakat
            </h2>
            <p className="text-[12px] text-[#43474d] mb-3 leading-relaxed">
              Laporkan jika ada indikasi pungutan liar, ketidaksesuaian SOP, atau keluhan fasilitas di Lapas Kelas III Lhoknga.
            </p>

            {complaintSubmitted ? (
              <div className="p-4 bg-[#85f8c4]/30 rounded-xl border border-[#21a173] text-center space-y-2">
                <span className="material-symbols-outlined text-[32px] text-[#21a173]">
                  task_alt
                </span>
                <h3 className="text-[14px] font-bold text-[#002114]">
                  Laporan Anda Telah Diterima!
                </h3>
                <p className="text-[12px] text-[#005137]">
                  Nomor Registrasi Laporan:{' '}
                  <span className="font-mono font-bold text-[#001428]">{complaintTicketId}</span>
                </p>
                <p className="text-[11px] text-[#43474d]">
                  Tim Kepatuhan Internal WBK Lapas Lhoknga akan menindaklanjuti dalam waktu maksimal 2x24 jam kerja.
                </p>
                <button
                  onClick={() => setComplaintSubmitted(false)}
                  className="mt-2 px-4 py-1.5 bg-[#001428] text-white rounded-lg text-[12px] font-bold cursor-pointer"
                >
                  Kirim Laporan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit} className="space-y-3 text-[12px]">
                <div>
                  <label className="block text-[#001428] font-semibold mb-1">Nama Pelapor:</label>
                  <input
                    type="text"
                    required
                    value={complaintName}
                    onChange={e => setComplaintName(e.target.value)}
                    placeholder="Siti Rahmah"
                    className="w-full px-3 py-2 rounded-lg border border-[#c3c6ce] text-[#001428] focus:outline-none focus:border-[#001428]"
                  />
                </div>
                <div>
                  <label className="block text-[#001428] font-semibold mb-1">Nomor WhatsApp / HP:</label>
                  <input
                    type="tel"
                    required
                    value={complaintPhone}
                    onChange={e => setComplaintPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-lg border border-[#c3c6ce] text-[#001428] focus:outline-none focus:border-[#001428]"
                  />
                </div>
                <div>
                  <label className="block text-[#001428] font-semibold mb-1">Kategori Pengaduan:</label>
                  <select
                    value={complaintType}
                    onChange={e => setComplaintType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#c3c6ce] text-[#001428] bg-white focus:outline-none focus:border-[#001428]"
                  >
                    <option value="Pelayanan Loket">Pelayanan Meja Loket Pendaftaran</option>
                    <option value="Pemeriksaan P2U">Pemeriksaan Barang di Pintu P2U</option>
                    <option value="Fasilitas Ruang Temu">Fasilitas Ruang Temu & Arena Anak</option>
                    <option value="Dugaan Pungli">Laporan Pungutan Liar (Whistleblowing)</option>
                    <option value="Lainnya">Lain-lain / Saran Perbaikan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#001428] font-semibold mb-1">Uraian Pengaduan:</label>
                  <textarea
                    rows={3}
                    required
                    value={complaintDetail}
                    onChange={e => setComplaintDetail(e.target.value)}
                    placeholder="Jelaskan secara rinci kronologi atau keluhan yang dialami..."
                    className="w-full px-3 py-2 rounded-lg border border-[#c3c6ce] text-[#001428] focus:outline-none focus:border-[#001428]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#001428] hover:bg-[#0f2942] text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Kirimkan Pengaduan
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Lapas Contact & Map Footer Info */}
      <div className="mt-5 p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[12px] space-y-2">
        <span className="font-bold text-[#001428] block">Alamat & Lokasi Lapas Kelas III Lhoknga:</span>
        <p className="text-[#43474d] text-[11px] leading-relaxed">
          Jl. Banda Aceh - Meulaboh Km. 14,5, Gampong Lamkruet, Kec. Lhoknga, Kabupaten Aceh Besar, Aceh 23353.
        </p>
        <div className="flex items-center gap-3 pt-1 text-[11px] text-[#001428] font-semibold">
          <span>Telp: (0651) 48112</span>
          <span>•</span>
          <span>Email: humaslapaslhoknga@gmail.com</span>
        </div>
      </div>
    </div>
  );
};
