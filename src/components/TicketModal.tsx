import React, { useState } from 'react';
import { VisitTicket } from '../types';

interface TicketModalProps {
  ticket: VisitTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelTicket?: (ticketId: string) => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onCancelTicket,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
    }, 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*TIKET KUNJUNGAN LAPAS KELAS III LHOKNGA*\n\n` +
      `No. Tiket: ${ticket.bookingCode}\n` +
      `WBP: ${ticket.wbp.name} (${ticket.wbp.room}, ${ticket.wbp.block})\n` +
      `Pengunjung: ${ticket.visitor.name} (${ticket.visitor.relation})\n` +
      `Jadwal: ${ticket.formattedDate} - ${ticket.exactTime}\n` +
      `Loket Verifikasi: ${ticket.loket}\n` +
      `Loker Barang: ${ticket.lockerNumber}\n\n` +
      `Tunjukkan QR code ini saat tiba di Pintu Utama (P2U) Lapas Lhoknga.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-[440px] max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-title"
      >
        {/* Header Bar */}
        <div className="bg-[#0f2942] text-white p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#ffdcc3]">
              confirmation_number
            </span>
            <div>
              <h3 id="ticket-title" className="text-[14px] font-bold tracking-tight">
                Tiket & Kartu Pengunjung Digital
              </h3>
              <p className="text-[11px] text-[#7991af]">Sistem Database Pemasyarakatan (SDP)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup Tiket"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Badge & Code */}
          <div className="flex items-center justify-between bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff]">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-[#43474d] uppercase tracking-wider">
                Kode Registrasi Tiket
              </span>
              <span className="text-[18px] font-mono font-bold text-[#001428]">
                {ticket.bookingCode}
              </span>
            </div>
            <span className="px-3 py-1 bg-[#85f8c4] text-[#002114] text-[12px] font-bold rounded-full">
              TERVALIDASI
            </span>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border-2 border-dashed border-[#b0c9e8] text-center">
            {/* SVG QR Code Simulation */}
            <div className="relative p-2 bg-white rounded-lg shadow-xs">
              <svg
                viewBox="0 0 160 160"
                className="w-44 h-44 text-[#001428]"
                fill="currentColor"
              >
                {/* 3 Corner Finder Squares */}
                {/* Top-Left */}
                <rect x="10" y="10" width="40" height="40" rx="4" />
                <rect x="16" y="16" width="28" height="28" rx="2" fill="white" />
                <rect x="22" y="22" width="16" height="16" rx="2" />
                {/* Top-Right */}
                <rect x="110" y="10" width="40" height="40" rx="4" />
                <rect x="116" y="16" width="28" height="28" rx="2" fill="white" />
                <rect x="122" y="22" width="16" height="16" rx="2" />
                {/* Bottom-Left */}
                <rect x="10" y="110" width="40" height="40" rx="4" />
                <rect x="16" y="116" width="28" height="28" rx="2" fill="white" />
                <rect x="22" y="122" width="16" height="16" rx="2" />

                {/* Timing patterns and simulated QR modules */}
                <rect x="56" y="24" width="6" height="6" />
                <rect x="68" y="24" width="6" height="6" />
                <rect x="80" y="24" width="6" height="6" />
                <rect x="92" y="24" width="6" height="6" />

                <rect x="24" y="56" width="6" height="6" />
                <rect x="24" y="68" width="6" height="6" />
                <rect x="24" y="80" width="6" height="6" />
                <rect x="24" y="92" width="6" height="6" />

                {/* Data Matrix Dots */}
                <rect x="60" y="60" width="10" height="10" />
                <rect x="74" y="60" width="6" height="6" />
                <rect x="90" y="60" width="10" height="10" />
                <rect x="60" y="76" width="6" height="12" />
                <rect x="72" y="76" width="12" height="6" />
                <rect x="90" y="76" width="6" height="6" />
                <rect x="102" y="76" width="8" height="8" />

                <rect x="60" y="96" width="14" height="6" />
                <rect x="80" y="96" width="6" height="6" />
                <rect x="92" y="96" width="14" height="6" />

                <rect x="60" y="112" width="8" height="8" />
                <rect x="74" y="112" width="12" height="6" />
                <rect x="92" y="112" width="8" height="8" />
                <rect x="106" y="112" width="10" height="10" />

                <rect x="60" y="128" width="6" height="6" />
                <rect x="72" y="128" width="8" height="8" />
                <rect x="86" y="128" width="12" height="6" />
                <rect x="104" y="128" width="12" height="6" />

                <rect x="120" y="60" width="6" height="14" />
                <rect x="132" y="60" width="12" height="6" />
                <rect x="120" y="80" width="14" height="6" />
                <rect x="140" y="80" width="6" height="12" />
                <rect x="120" y="100" width="8" height="8" />
                <rect x="134" y="100" width="12" height="6" />
                <rect x="124" y="120" width="18" height="6" />
                <rect x="124" y="132" width="6" height="12" />
                <rect x="136" y="132" width="10" height="6" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[#001428] mt-2 tracking-wide uppercase">
              Tunjukkan pada Scanner di Pintu Utama P2U
            </span>
            <span className="text-[11px] text-[#43474d]">
              Pemindaian otomatis sinkron dengan sidik jari biometrik
            </span>
          </div>

          {/* Details Grid */}
          <div className="bg-[#f8f9ff] rounded-xl p-3.5 space-y-3 border border-[#e5eeff] text-[12px]">
            {/* WBP */}
            <div className="flex items-start justify-between border-b border-[#e5eeff] pb-2">
              <span className="text-[#43474d]">Warga Binaan (WBP):</span>
              <div className="text-right">
                <p className="font-bold text-[#001428]">{ticket.wbp.name}</p>
                <p className="text-[11px] text-[#7991af]">{ticket.wbp.regNumber} • {ticket.wbp.room}</p>
              </div>
            </div>

            {/* Visitor */}
            <div className="flex items-start justify-between border-b border-[#e5eeff] pb-2">
              <span className="text-[#43474d]">Pengunjung Utama:</span>
              <div className="text-right">
                <p className="font-bold text-[#001428]">{ticket.visitor.name}</p>
                <p className="text-[11px] text-[#21a173] font-semibold">
                  {ticket.visitor.relation} (Terverifikasi Dukcapil)
                </p>
              </div>
            </div>

            {/* Additional Visitors */}
            {ticket.additionalVisitors && ticket.additionalVisitors.length > 0 && (
              <div className="flex items-start justify-between border-b border-[#e5eeff] pb-2">
                <span className="text-[#43474d]">Pengikut ({ticket.additionalVisitors.length}):</span>
                <div className="text-right">
                  {ticket.additionalVisitors.map((av, idx) => (
                    <p key={idx} className="font-semibold text-[#001428]">
                      {av.name} <span className="text-[10px] text-[#7991af]">({av.relation})</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            <div className="flex items-start justify-between border-b border-[#e5eeff] pb-2">
              <span className="text-[#43474d]">Jadwal & Waktu:</span>
              <div className="text-right">
                <p className="font-bold text-[#001428]">{ticket.formattedDate}</p>
                <p className="text-[11px] text-[#fe932c] font-semibold">
                  Sesi {ticket.session === 'pagi' ? 'Pagi' : 'Siang'} ({ticket.exactTime})
                </p>
              </div>
            </div>

            {/* Loket & Facilities */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded-lg border border-[#e5eeff]">
                <span className="text-[10px] text-[#43474d] block font-semibold">MEJA LOKET</span>
                <span className="text-[12px] font-bold text-[#001428]">{ticket.loket}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#e5eeff]">
                <span className="text-[10px] text-[#43474d] block font-semibold">LOKER TITIP</span>
                <span className="text-[12px] font-bold text-[#904d00]">{ticket.lockerNumber}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-[#e5eeff]">
                <span className="text-[10px] text-[#43474d] block font-semibold">MEJA TEMU</span>
                <span className="text-[12px] font-bold text-[#21a173]">{ticket.tableNumber}</span>
              </div>
            </div>

            {/* Barang Bawaan */}
            {ticket.goodsNote && (
              <div className="bg-[#eff4ff] p-2.5 rounded-lg border border-[#dce9ff] text-[11px]">
                <span className="font-bold text-[#0f2942] block">Barang / Makanan Terdaftar:</span>
                <p className="text-[#43474d] mt-0.5">{ticket.goodsNote}</p>
              </div>
            )}
          </div>

          {/* SOP Reminder */}
          <div className="rounded-xl bg-[#fff8f0] p-3 border border-[#ffdcc3] text-[11px] space-y-1 text-[#663500]">
            <p className="font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#904d00]">warning</span>
              Ketentuan Wajib Pintu Utama (P2U):
            </p>
            <ul className="list-disc pl-4 space-y-0.5 text-[#904d00]">
              <li>Hadir 15 menit sebelum sesi kunjungan dimulai.</li>
              <li>Wajib menunjukkan KTP fisik asli & KK asli saat verifikasi loket.</li>
              <li>Dilarang keras membawa gawai/HP dan benda tajam ke dalam ruang steril.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#f8f9ff] border-t border-[#e5eeff] flex flex-col gap-2">
          {downloaded ? (
            <div className="h-10 bg-[#21a173] text-white rounded-lg flex items-center justify-center gap-1.5 text-[13px] font-bold">
              <span className="material-symbols-outlined text-[18px]">check</span>
              Tiket Tersimpan di Perangkat!
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="h-10 rounded-lg bg-[#001428] hover:bg-[#0f2942] active:bg-black text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Unduh Kartu
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="h-10 rounded-lg bg-[#21a173] hover:bg-[#1b845e] text-white text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                Kirim WhatsApp
              </button>
            </div>
          )}

          {/* Cancellation row */}
          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-[11px] text-[#ba1a1a] hover:underline text-center py-1 cursor-pointer"
            >
              Batalkan Tiket Kunjungan Ini
            </button>
          ) : (
            <div className="p-2 bg-[#ffdad6] rounded-lg text-center flex items-center justify-between text-[11px] text-[#93000a]">
              <span>Yakin ingin membatalkan kunjungan?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onCancelTicket?.(ticket.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-[#ba1a1a] text-white rounded font-bold cursor-pointer"
                >
                  Ya, Batalkan
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-2.5 py-1 bg-white text-[#43474d] rounded font-medium cursor-pointer"
                >
                  Kembali
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
