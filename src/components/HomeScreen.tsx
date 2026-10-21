import React, { useState } from 'react';
import { VisitTicket, Announcement, TabType, ServiceType } from '../types';

interface HomeScreenProps {
  activeTicket: VisitTicket | null;
  announcements: Announcement[];
  onOpenTicketModal: (ticket: VisitTicket) => void;
  onOpenFacilityModal: () => void;
  onOpenAnnouncement: (announcement: Announcement) => void;
  onNavigateToTab: (tab: TabType, serviceType?: ServiceType) => void;
  onOpenProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeTicket,
  announcements,
  onOpenTicketModal,
  onOpenFacilityModal,
  onOpenAnnouncement,
  onNavigateToTab,
  onOpenProfile,
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(prev => (prev === stepNumber ? null : stepNumber));
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* 1. Top Greeting & Citizen Identity Card */}
      <section className="px-4 pt-4 pb-2">
        <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm border border-[#e5eeff]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 text-[#43474d] text-[11px] font-semibold tracking-wide">
                <span className="material-symbols-outlined text-[16px] text-[#21a173]">
                  verified_user
                </span>
                <span>Identitas Terdata Resmi</span>
              </div>
              <h1 className="text-[20px] font-bold text-[#001428] mt-0.5 truncate tracking-tight">
                Assalamu’alaikum, Siti Rahmah
              </h1>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#eff4ff] px-2.5 py-1 self-start flex-wrap">
                <span className="inline-block w-2 h-2 rounded-full bg-[#21a173]"></span>
                <span className="text-[11px] font-semibold text-[#0b1c30]">
                  Keluarga Terverifikasi Dukcapil
                </span>
                <span className="text-[12px] text-[#43474d]">(NIK 1106********0004)</span>
              </div>
            </div>
            <button
              onClick={onOpenProfile}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#0f2942] hover:bg-[#dce9ff] transition-colors cursor-pointer"
              title="Lihat Data Kependudukan Terverifikasi"
              aria-label="Lihat Profil Keluarga"
            >
              <span className="material-symbols-outlined text-[24px]">family_restroom</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Live Status: Kuota & Jam Layanan Hari Ini */}
      <section className="px-4 py-2">
        <div className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm border border-[#e5eeff]">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#68dba9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#21a173]"></span>
              </span>
              <span className="text-[14px] font-semibold text-[#0b1c30]">
                Jadwal Kunjungan Hari Ini
              </span>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e5eeff] text-[#005137] text-[11px] font-bold tracking-wide">
              <span className="material-symbols-outlined text-[14px]">lock_open</span>
              BUKA
            </span>
          </div>

          {/* Capacity Progress Bar */}
          <div className="rounded-lg bg-[#eff4ff] p-3 mt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] text-[#43474d]">Ketersediaan Kuota Fisik</span>
              <span className="text-[12px] text-[#001428] font-bold">38 / 100 Sisa Kuota</span>
            </div>
            <div className="w-full h-2.5 bg-[#e5eeff] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#fe932c] rounded-full transition-all duration-500"
                style={{ width: '62%' }}
              ></div>
            </div>
            <p className="text-[11px] text-[#43474d] mt-2 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px] text-[#904d00]">info</span>
              62 slot telah terisi untuk sesi kunjungan hari ini
            </p>
          </div>

          {/* Sessions Schedule */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
            <div className="flex flex-col bg-[#f8f9ff] p-2.5 rounded-lg border border-[#e5eeff]/70">
              <span className="text-[11px] text-[#43474d] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#001428]">
                  wb_twilight
                </span>{' '}
                Sesi Pagi
              </span>
              <span className="text-[13px] text-[#0b1c30] font-bold mt-1">08.30 - 11.30 WIB</span>
            </div>
            <div className="flex flex-col bg-[#f8f9ff] p-2.5 rounded-lg border border-[#e5eeff]/70">
              <span className="text-[11px] text-[#43474d] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#fe932c]">
                  wb_sunny
                </span>{' '}
                Sesi Siang
              </span>
              <span className="text-[13px] text-[#0b1c30] font-bold mt-1">13.30 - 15.00 WIB</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Active Visit Reminder Card (Hero Ticket Preview) */}
      {activeTicket && (
        <section className="px-4 py-2">
          <div className="relative overflow-hidden rounded-xl bg-[#0f2942] text-white p-4 shadow-md">
            {/* Decorative Emblem Watermark */}
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-white">
              <span className="material-symbols-outlined text-[140px]">shield</span>
            </div>

            <div className="relative z-10 flex flex-col">
              <div className="flex items-center justify-between pb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fe932c] text-white text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[14px]">event_upcoming</span>
                  Kunjungan Terjadwal Besok
                </span>
                <span className="text-[11px] text-[#7991af] tracking-wider font-mono font-medium">
                  {activeTicket.bookingCode}
                </span>
              </div>

              <div className="mt-2 flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#ffdcc3]">
                  <span className="material-symbols-outlined text-[28px]">account_box</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] text-[#7991af]">Warga Binaan Pemasyarakatan:</span>
                  <span className="text-[16px] font-bold text-white truncate">
                    {activeTicket.wbp.name}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded text-white font-medium">
                      {activeTicket.wbp.room}
                    </span>
                    <span className="text-[12px] text-[#b0c9e8]">{activeTicket.wbp.block}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between bg-black/25 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#ffb77d]">
                    calendar_month
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[12px] text-white font-semibold">
                      {activeTicket.formattedDate}
                    </span>
                    <span className="text-[11px] text-[#b0c9e8]">
                      Sesi {activeTicket.session === 'pagi' ? 'Pagi' : 'Siang'} (Pukul{' '}
                      {activeTicket.exactTime})
                    </span>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded bg-[#85f8c4] text-[#002114] font-bold">
                  {activeTicket.loket}
                </span>
              </div>

              <button
                onClick={() => onOpenTicketModal(activeTicket)}
                className="mt-4 w-full h-11 bg-[#fe932c] hover:bg-[#e07b1a] active:bg-[#c96c14] text-white font-bold text-[14px] rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                Lihat Tiket & QR Code Masuk
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. Quick Action Navigation 4 Grid */}
      <section className="px-4 py-3">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[16px] font-bold text-[#001428]">Layanan Utama</h2>
          <span className="text-[11px] text-[#43474d] font-medium">Lapas Kelas III Lhoknga</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* 1. Kunjungan Tatap Muka */}
          <button
            onClick={() => onNavigateToTab('pendaftaran', 'tatap_muka')}
            className="group relative flex flex-col items-start p-4 rounded-xl bg-white text-left shadow-sm hover:shadow-md border border-[#e5eeff] transition-all active:scale-[0.98] cursor-pointer"
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#001428] group-hover:bg-[#001428] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">group</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#005137] font-bold">
                Buka
              </span>
            </div>
            <span className="text-[14px] text-[#001428] font-bold leading-snug">
              Daftar Kunjungan Tatap Muka
            </span>
            <span className="text-[12px] text-[#43474d] mt-1 line-clamp-2">
              Pilih jadwal besuk langsung keluarga
            </span>
          </button>

          {/* 2. Kunjungan Online / Video Call */}
          <button
            onClick={() => onNavigateToTab('pendaftaran', 'video_call')}
            className="group relative flex flex-col items-start p-4 rounded-xl bg-white text-left shadow-sm hover:shadow-md border border-[#e5eeff] transition-all active:scale-[0.98] cursor-pointer"
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#ffdcc3]/50 flex items-center justify-center text-[#904d00] group-hover:bg-[#904d00] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">video_call</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#43474d] font-semibold">
                Virtual
              </span>
            </div>
            <span className="text-[14px] text-[#001428] font-bold leading-snug">
              Kunjungan Video Call
            </span>
            <span className="text-[12px] text-[#43474d] mt-1 line-clamp-2">
              Layanan daring jarak jauh gratis
            </span>
          </button>

          {/* 3. Titipan Barang & Makanan */}
          <button
            onClick={() => onNavigateToTab('pendaftaran', 'titipan_barang')}
            className="group relative flex flex-col items-start p-4 rounded-xl bg-white text-left shadow-sm hover:shadow-md border border-[#e5eeff] transition-all active:scale-[0.98] cursor-pointer"
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#0f2942] group-hover:bg-[#0f2942] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#43474d] font-semibold">
                SOP Ketat
              </span>
            </div>
            <span className="text-[14px] text-[#001428] font-bold leading-snug">
              Titipan Barang & Makanan
            </span>
            <span className="text-[12px] text-[#43474d] mt-1 line-clamp-2">
              Registrasi bawaan sebelum diantar
            </span>
          </button>

          {/* 4. Cek Antrean Real-Time */}
          <button
            onClick={() => onNavigateToTab('tiket-antrean')}
            className="group relative flex flex-col items-start p-4 rounded-xl bg-white text-left shadow-sm hover:shadow-md border border-[#e5eeff] transition-all active:scale-[0.98] cursor-pointer"
            type="button"
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] group-hover:bg-[#ba1a1a] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">sensors</span>
              </div>
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                Live
              </span>
            </div>
            <span className="text-[14px] text-[#001428] font-bold leading-snug">
              Cek Antrean Loket
            </span>
            <span className="text-[12px] text-[#43474d] mt-1 line-clamp-2">
              Pantau nomor panggilan meja loket
            </span>
          </button>
        </div>
      </section>

      {/* 5. Interactive Visual Showcase: Suasana Ruang Layanan */}
      <section className="px-4 py-2">
        <div
          onClick={onOpenFacilityModal}
          className="rounded-xl overflow-hidden bg-white shadow-sm border border-[#e5eeff] hover:shadow-md transition-all cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onOpenFacilityModal()}
        >
          <div className="relative h-36 w-full overflow-hidden">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Ruang Kunjungan Tatap Muka Terpadu Lapas Lhoknga"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuArpbIhWVXlpJndpCxbQNwtN6aIItLlsX7VBJxwqgDB79L55KIOo5TJkGrsBAi_yNtFEMv3EbmayFrcep7VZSCX8tBRS361ZjJRKVMefI3m-_BaykiUVym1kK2iC1S4CrCfjvNCSPvcX2WKPsayOyZK9Kz9T3mNZpORdG5B0lUyFfDlv1gZN9wYCVw5PDzmUeL7UK093dM-czwmqRXguut5W23QfjxGHJExHDpMr-fIK2EhUCIK4dI"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001428]/85 via-[#001428]/35 to-transparent"></div>
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[11px] text-[#ffdcc3] uppercase tracking-wider font-bold">
                Fasilitas Ramah HAM
              </span>
              <p className="text-[14px] text-white font-semibold">
                Ruang Kunjungan Tatap Muka Terpadu
              </p>
            </div>
          </div>
          <div className="p-3 flex items-center justify-between text-[#43474d]">
            <span className="text-[12px] flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#21a173]">
                check_circle
              </span>
              Bebas Asap Rokok • Dilengkapi Arena Bermain Anak
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#001428] group-hover:translate-x-1 transition-transform">
              arrow_forward_ios
            </span>
          </div>
        </div>
      </section>

      {/* 6. Alur & Ketentuan Kunjungan (Step Accordion / Visual Process) */}
      <section className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-[#001428]">Alur Kunjungan Praktis</h2>
          <span className="text-[11px] text-[#904d00] font-bold">4 Tahap SOP</span>
        </div>
        <div className="flex flex-col gap-2.5">
          {/* Step 1 */}
          <div
            onClick={() => toggleStep(1)}
            className="rounded-xl bg-white p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-2 transition-all cursor-pointer hover:border-[#b0c9e8]"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0f2942] text-white flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                1
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#001428] font-bold">
                    Daftar Online & Siapkan KTP Asli
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#43474d]">
                    {expandedStep === 1 ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                <p className="text-[12px] text-[#43474d] mt-0.5 leading-relaxed">
                  Pesan tiket H-1 melalui aplikasi SILAPAS. Bawa KTP asli serta Kartu Keluarga asli saat verifikasi fisik di lapas.
                </p>
              </div>
            </div>
            {expandedStep === 1 && (
              <div className="mt-2 pt-2 border-t border-[#eff4ff] text-[12px] text-[#0b1c30] bg-[#eff4ff]/60 p-2.5 rounded-lg">
                <p className="font-semibold text-[#001428] mb-1">Catatan Penting Tahap 1:</p>
                <ul className="list-disc pl-4 space-y-1 text-[#43474d]">
                  <li>Pendaftaran dibuka setiap hari kerja pukul 08.00 - 15.00 WIB.</li>
                  <li>Maksimal 3 orang pengunjung per satu tiket kunjungan warga binaan.</li>
                  <li>Wajib membawa dokumen identitas fisik asli yang masih berlaku.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Step 2 */}
          <div
            onClick={() => toggleStep(2)}
            className="rounded-xl bg-white p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-2 transition-all cursor-pointer hover:border-[#b0c9e8]"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0f2942] text-white flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                2
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#001428] font-bold">
                    Verifikasi Biometrik di Loket Terpadu
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#43474d]">
                    {expandedStep === 2 ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                <p className="text-[12px] text-[#43474d] mt-0.5 leading-relaxed">
                  Tunjukkan kode QR tiket pada petugas loket untuk pemindaian sidik jari dan pencocokan data Sistem Database Pemasyarakatan (SDP).
                </p>
              </div>
            </div>
            {expandedStep === 2 && (
              <div className="mt-2 pt-2 border-t border-[#eff4ff] text-[12px] text-[#0b1c30] bg-[#eff4ff]/60 p-2.5 rounded-lg">
                <p className="font-semibold text-[#001428] mb-1">Catatan Penting Tahap 2:</p>
                <ul className="list-disc pl-4 space-y-1 text-[#43474d]">
                  <li>Petugas akan mencocokkan biometrik sidik jari dengan database SDP.</li>
                  <li>Pengunjung akan diberikan lanyard identitas tamu dan kartu nomor meja temu.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Step 3 */}
          <div
            onClick={() => toggleStep(3)}
            className="rounded-xl bg-white p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-2 transition-all cursor-pointer hover:border-[#b0c9e8]"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0f2942] text-white flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                3
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#001428] font-bold">
                    Penitipan Barang Sesuai SOP Kemenimipas
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#43474d]">
                    {expandedStep === 3 ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                <p className="text-[12px] text-[#43474d] mt-0.5 leading-relaxed">
                  Titipkan ponsel pintar, tas ransel, dan perkakas di loker mandiri gratis. Makanan akan diperiksa melalui mesin X-Ray security.
                </p>
              </div>
            </div>
            {expandedStep === 3 && (
              <div className="mt-2 pt-2 border-t border-[#eff4ff] text-[12px] text-[#0b1c30] bg-[#eff4ff]/60 p-2.5 rounded-lg">
                <p className="font-semibold text-[#001428] mb-1">Catatan Penting Tahap 3:</p>
                <ul className="list-disc pl-4 space-y-1 text-[#43474d]">
                  <li>Loker mandiri dilengkapi kunci khusus yang dipegang oleh pengunjung.</li>
                  <li>Dilarang menyelipkan gawai atau benda logam di dalam kotak makanan.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Step 4 */}
          <div
            onClick={() => toggleStep(4)}
            className="rounded-xl bg-white p-4 shadow-sm border border-[#e5eeff] flex flex-col gap-2 transition-all cursor-pointer hover:border-[#ffb77d]"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#904d00] text-white flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                4
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-[#001428] font-bold">
                    Temu di Ruang Kunjungan Ramah Keluarga
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#43474d]">
                    {expandedStep === 4 ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                <p className="text-[12px] text-[#43474d] mt-0.5 leading-relaxed">
                  Masuki ruang temu bernomor meja sesuai tiket. Durasi pertemuan tatap muka maksimal 30 menit per sesi kunjungan.
                </p>
              </div>
            </div>
            {expandedStep === 4 && (
              <div className="mt-2 pt-2 border-t border-[#eff4ff] text-[12px] text-[#0b1c30] bg-[#eff4ff]/60 p-2.5 rounded-lg">
                <p className="font-semibold text-[#001428] mb-1">Catatan Penting Tahap 4:</p>
                <ul className="list-disc pl-4 space-y-1 text-[#43474d]">
                  <li>Tersedia arena bermain ramah anak dan fasilitas pojok laktasi.</li>
                  <li>Petugas senantiasa memantau ketertiban dengan sopan dan humanis.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. Berita & Pengumuman Resmi Lapas Lhoknga */}
      <section className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-[#001428]">Pengumuman Resmi</h2>
          <button
            onClick={() => onNavigateToTab('layanan')}
            className="text-[11px] text-[#904d00] font-bold hover:underline cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {announcements.map(ann => (
            <div
              key={ann.id}
              onClick={() => onOpenAnnouncement(ann)}
              className="rounded-xl bg-white overflow-hidden shadow-sm border border-[#e5eeff] flex hover:shadow-md transition-all cursor-pointer group"
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onOpenAnnouncement(ann)}
            >
              <div className="w-28 h-auto flex-shrink-0 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={ann.title}
                  src={ann.imageUrl}
                />
              </div>
              <div className="p-3.5 flex flex-col justify-center min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded ${ann.badgeColor} text-[10px] font-bold`}
                  >
                    {ann.category}
                  </span>
                  <span className="text-[11px] text-[#43474d]">{ann.date}</span>
                </div>
                <span className="text-[13px] text-[#001428] font-bold line-clamp-2 leading-snug group-hover:text-[#904d00] transition-colors">
                  {ann.title}
                </span>
                <p className="text-[11px] text-[#43474d] line-clamp-1 mt-1 leading-normal">
                  {ann.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Help & Hotline Callout Card */}
      <section className="px-4 pt-2">
        <div className="rounded-xl bg-[#eff4ff] p-4 flex items-center justify-between border border-[#dce9ff]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#001428] flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">contact_support</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] text-[#001428] font-bold truncate">
                Pusat Bantuan & Pengaduan
              </span>
              <span className="text-[11px] text-[#43474d] truncate">
                Hotline WhatsApp: +62 811-6800-432
              </span>
            </div>
          </div>
          <a
            aria-label="Hubungi Hotline WhatsApp Lapas Lhoknga"
            className="h-9 px-3 rounded-lg bg-[#001428] hover:bg-[#0f2942] text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0 active:scale-95 transition-all shadow-xs cursor-pointer"
            href="https://wa.me/628116800432?text=Halo%20Lapas%20Kelas%20III%20Lhoknga,%20saya%20ingin%20bertanya%20seputar%20layanan%20kunjungan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hubungi
          </a>
        </div>
      </section>
    </div>
  );
};
