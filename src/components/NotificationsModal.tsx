import React from 'react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTicket: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTicket,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Tiket Kunjungan Terjadwal Besok',
      message: 'Tiket #LHK-20241024-042 untuk membesuk M. Yusuf bin Abdullah telah aktif. Silakan hadir di Loket 02 pukul 09.00 WIB.',
      time: '1 jam yang lalu',
      unread: true,
      action: 'ticket',
    },
    {
      id: 2,
      title: 'Himbauan Pakaian Pengunjung',
      message: 'Pastikan mengenakan busana muslimah sopan, tertutup, dan berjilbab sesuai tata tertib Lapas Lhoknga.',
      time: 'Kemarin',
      unread: false,
    },
    {
      id: 3,
      title: 'Pemeriksaan Biometrik Sidik Jari',
      message: 'Data kependudukan NIK 1106********0004 berhasil diverifikasi dan disinkronkan dengan SDP Kemenimipas.',
      time: '3 hari yang lalu',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-[440px] max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-title"
      >
        <div className="bg-[#0f2942] text-white p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#fe932c]">notifications</span>
            <div>
              <h3 id="notif-title" className="text-[14px] font-bold">
                Pemberitahuan Layanan
              </h3>
              <p className="text-[11px] text-[#7991af]">Lapas Kelas III Lhoknga</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-2.5 text-[12px]">
          {notifications.map(item => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-colors ${
                item.unread
                  ? 'bg-[#eff4ff] border-[#b0c9e8]'
                  : 'bg-white border-[#e5eeff]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#001428] flex items-center gap-1.5">
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#fe932c]"></span>
                  )}
                  {item.title}
                </span>
                <span className="text-[10px] text-[#43474d]">{item.time}</span>
              </div>
              <p className="text-[#43474d] text-[11px] leading-relaxed">{item.message}</p>
              {item.action === 'ticket' && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToTicket();
                  }}
                  className="mt-2 text-[11px] font-bold text-[#904d00] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Buka Tiket Kunjungan
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#f8f9ff] border-t border-[#e5eeff]">
          <button
            onClick={onClose}
            className="w-full h-10 bg-[#001428] hover:bg-[#0f2942] text-white font-bold rounded-lg text-[13px] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
