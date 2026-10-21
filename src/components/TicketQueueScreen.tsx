import React, { useState } from 'react';
import { VisitTicket, QueueItem } from '../types';
import { INITIAL_QUEUE } from '../data/mockData';

interface TicketQueueScreenProps {
  tickets: VisitTicket[];
  onOpenTicketModal: (ticket: VisitTicket) => void;
  onNavigateToRegister: () => void;
}

export const TicketQueueScreen: React.FC<TicketQueueScreenProps> = ({
  tickets,
  onOpenTicketModal,
  onNavigateToRegister,
}) => {
  const [subTab, setSubTab] = useState<'tickets' | 'queue'>('tickets');
  const [queueList] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [currentCall, setCurrentCall] = useState<string>('A-042');
  const [currentLoket, setCurrentLoket] = useState<string>('Loket 02');
  const [isCalling, setIsCalling] = useState<boolean>(false);

  // Play audio chime using Web Audio API
  const playQueueChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Note 1: E5
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      // Note 2: C5
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.4);
      gain2.gain.setValueAtTime(0.35, now + 0.4);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.4);
      osc2.stop(now + 1.2);

      setIsCalling(true);

      // Web Speech Synthesis announcement
      if ('speechSynthesis' in window) {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(`Nomor antrean A, 0, 4, 2, silakan menuju Loket 2`);
          utterance.lang = 'id-ID';
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        }, 1100);
      }

      setTimeout(() => {
        setIsCalling(false);
      }, 3500);
    } catch {
      // Audio playback fallback
      setIsCalling(true);
      setTimeout(() => setIsCalling(false), 2000);
    }
  };

  const activeTickets = tickets.filter(t => t.status === 'active');
  const pastTickets = tickets.filter(t => t.status !== 'active');

  return (
    <div className="flex flex-col w-full pb-10 px-4 pt-4">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-[20px] font-bold text-[#001428] tracking-tight">
            Tiket & Antrean Kunjungan
          </h1>
          <p className="text-[12px] text-[#43474d] mt-0.5">
            Sistem Database Pemasyarakatan (SDP) Lapas Lhoknga
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#e5eeff] rounded-xl mb-4 text-[12px]">
        <button
          type="button"
          onClick={() => setSubTab('tickets')}
          className={`py-2 px-3 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'tickets'
              ? 'bg-white text-[#001428] shadow-xs'
              : 'text-[#43474d] hover:text-[#001428]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
          Tiket Saya ({activeTickets.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('queue')}
          className={`py-2 px-3 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'queue'
              ? 'bg-white text-[#001428] shadow-xs'
              : 'text-[#43474d] hover:text-[#001428]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">sensors</span>
          Live Antrean Loket
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse ml-0.5"></span>
        </button>
      </div>

      {subTab === 'tickets' ? (
        <div className="space-y-4">
          {/* Active Tickets Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-[#001428] uppercase tracking-wider">
                Tiket Kunjungan Aktif
              </span>
              <span className="text-[11px] text-[#21a173] font-semibold">
                {activeTickets.length} Terjadwal
              </span>
            </div>

            {activeTickets.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center border border-[#e5eeff]">
                <span className="material-symbols-outlined text-[36px] text-[#c3c6ce] mb-2">
                  event_busy
                </span>
                <p className="text-[13px] font-semibold text-[#001428]">
                  Belum ada tiket kunjungan aktif
                </p>
                <p className="text-[12px] text-[#43474d] mt-1 mb-4">
                  Daftarkan jadwal kunjungan untuk membesuk warga binaan.
                </p>
                <button
                  onClick={onNavigateToRegister}
                  className="px-4 py-2 bg-[#001428] text-white text-[12px] font-bold rounded-lg shadow-xs hover:bg-[#0f2942] cursor-pointer"
                >
                  Daftar Kunjungan Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="relative overflow-hidden rounded-xl bg-[#0f2942] text-white p-4 shadow-md border border-[#e5eeff]/10"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fe932c] text-white text-[10px] font-bold">
                        {ticket.serviceType === 'tatap_muka'
                          ? 'Kunjungan Tatap Muka'
                          : ticket.serviceType === 'video_call'
                          ? 'Video Call Jarak Jauh'
                          : 'Titipan Barang/Makanan'}
                      </span>
                      <span className="text-[11px] font-mono text-[#b0c9e8]">
                        {ticket.bookingCode}
                      </span>
                    </div>

                    <div className="my-3 flex items-start gap-3">
                      <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 text-[#ffdcc3]">
                        <span className="material-symbols-outlined text-[24px]">account_box</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] text-[#7991af]">Warga Binaan:</span>
                        <span className="text-[15px] font-bold text-white truncate">
                          {ticket.wbp.name}
                        </span>
                        <span className="text-[11px] text-[#b0c9e8]">
                          {ticket.wbp.room} • {ticket.wbp.block}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-black/25 rounded-lg text-[11px] mb-3">
                      <div>
                        <span className="text-[#7991af] block">Jadwal Kunjungan:</span>
                        <span className="font-semibold text-white">{ticket.formattedDate}</span>
                        <span className="text-[#ffdcc3] block">{ticket.exactTime}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#7991af] block">Verifikasi Loket:</span>
                        <span className="font-bold text-[#85f8c4]">{ticket.loket}</span>
                        <span className="text-[#b0c9e8] block">{ticket.lockerNumber}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenTicketModal(ticket)}
                      className="w-full h-11 bg-[#fe932c] hover:bg-[#e07b1a] active:bg-[#c96c14] text-white font-bold text-[13px] rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                      Tampilkan Kode QR Masuk
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past History */}
          {pastTickets.length > 0 && (
            <div className="pt-2">
              <span className="text-[12px] font-bold text-[#001428] uppercase tracking-wider block mb-2">
                Riwayat Kunjungan Sebelumnya
              </span>
              <div className="space-y-2">
                {pastTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="p-3 bg-white rounded-xl border border-[#e5eeff] flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#001428]">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-[#001428]">
                          {ticket.wbp.name}
                        </span>
                        <span className="text-[11px] text-[#43474d]">
                          {ticket.formattedDate} • {ticket.serviceType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#e5eeff] text-[#005137]">
                      Selesai
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Live Queue Display */
        <div className="space-y-4 animate-fade-in">
          {/* Main LED Calling Board */}
          <div className="rounded-2xl bg-[#001428] text-white p-5 text-center shadow-lg border border-[#0f2942] relative overflow-hidden">
            <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[10px] text-[#85f8c4] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#21a173] animate-ping"></span>
              SISTEM AKTIF
            </div>

            <span className="text-[12px] font-semibold uppercase tracking-widest text-[#7991af]">
              PANGGILAN ANTREAN SEKARANG
            </span>

            <div className="my-3 py-2 bg-black/40 rounded-xl border border-white/10">
              <span className="text-[42px] font-mono font-extrabold text-[#ffdcc3] tracking-wider block">
                {currentCall}
              </span>
              <span className="text-[14px] font-bold text-[#85f8c4] block uppercase">
                Menuju {currentLoket}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={playQueueChime}
                disabled={isCalling}
                className={`px-4 py-2.5 rounded-lg text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isCalling
                    ? 'bg-[#fe932c] text-white animate-pulse'
                    : 'bg-[#fe932c] hover:bg-[#e07b1a] text-white active:scale-95 shadow-sm'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">volume_up</span>
                {isCalling ? 'Sedang Memanggil...' : 'Panggil Antrean (Bunyikan Bel)'}
              </button>
            </div>
          </div>

          {/* Loket Status Grid */}
          <div>
            <span className="text-[12px] font-bold text-[#001428] uppercase tracking-wider block mb-2">
              Status Seluruh Loket Pelayanan Terpadu
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-white rounded-xl border border-[#e5eeff] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold text-[#001428]">Loket 01</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#005137] font-bold">
                    Melayani
                  </span>
                </div>
                <span className="text-[18px] font-mono font-bold text-[#001428]">A-041</span>
                <span className="text-[10px] text-[#43474d] block mt-0.5">Tatap Muka</span>
              </div>

              <div className="p-3 bg-[#e5eeff] rounded-xl border-2 border-[#fe932c] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold text-[#001428]">Loket 02</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#fe932c] text-white font-bold animate-pulse">
                    Tiket Anda!
                  </span>
                </div>
                <span className="text-[18px] font-mono font-bold text-[#904d00]">A-042</span>
                <span className="text-[10px] text-[#001428] font-semibold block mt-0.5">
                  Segera Masuk P2U
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#e5eeff] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold text-[#001428]">Loket 03</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#005137] font-bold">
                    Melayani
                  </span>
                </div>
                <span className="text-[18px] font-mono font-bold text-[#001428]">B-015</span>
                <span className="text-[10px] text-[#43474d] block mt-0.5">Titipan Makanan</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#e5eeff] shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold text-[#001428]">Loket Virtual</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eff4ff] text-[#005137] font-bold">
                    Tersambung
                  </span>
                </div>
                <span className="text-[18px] font-mono font-bold text-[#001428]">V-008</span>
                <span className="text-[10px] text-[#43474d] block mt-0.5">Video Call Zoom</span>
              </div>
            </div>
          </div>

          {/* Queue List */}
          <div className="bg-white rounded-xl p-4 border border-[#e5eeff] shadow-xs">
            <span className="text-[12px] font-bold text-[#001428] uppercase tracking-wider block mb-3">
              Daftar Antrean Selanjutnya
            </span>
            <div className="divide-y divide-[#eff4ff] text-[12px]">
              {queueList.slice(4).map(item => (
                <div key={item.number} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#001428] font-mono font-bold flex items-center justify-center text-[12px]">
                      {item.number}
                    </span>
                    <div>
                      <span className="font-semibold text-[#001428] block">
                        {item.serviceType}
                      </span>
                      <span className="text-[11px] text-[#43474d]">Target: {item.loket}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#43474d] bg-[#f8f9ff] px-2 py-1 rounded">
                    Est. {item.time} WIB
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
