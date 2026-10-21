import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  activeTicketCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  activeTicketCount = 1,
}) => {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 backdrop-blur-xl border-t border-[#0f2942]/10 shadow-[0_-4px_16px_rgba(15,41,66,0.06)]"
      role="navigation"
      aria-label="Navigasi Utama Aplikasi"
    >
      <div className="max-w-[480px] mx-auto grid grid-cols-4 items-center h-16 px-1">
        {/* Tab 1: Beranda */}
        <button
          type="button"
          onClick={() => onChangeTab('beranda')}
          aria-current={activeTab === 'beranda' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-all cursor-pointer ${
            activeTab === 'beranda'
              ? 'text-[#904d00] font-semibold'
              : 'text-[#43474d] hover:text-[#0b1c30]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] transition-transform ${
              activeTab === 'beranda' ? 'scale-110' : ''
            }`}
          >
            home
          </span>
          <span className="text-[11px] leading-[14px]">Beranda</span>
        </button>

        {/* Tab 2: Pendaftaran */}
        <button
          type="button"
          onClick={() => onChangeTab('pendaftaran')}
          aria-current={activeTab === 'pendaftaran' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-all cursor-pointer ${
            activeTab === 'pendaftaran'
              ? 'text-[#904d00] font-semibold'
              : 'text-[#43474d] hover:text-[#0b1c30]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] transition-transform ${
              activeTab === 'pendaftaran' ? 'scale-110' : ''
            }`}
          >
            event_available
          </span>
          <span className="text-[11px] leading-[14px]">Pendaftaran</span>
        </button>

        {/* Tab 3: Tiket Antrean */}
        <button
          type="button"
          onClick={() => onChangeTab('tiket-antrean')}
          aria-current={activeTab === 'tiket-antrean' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-all cursor-pointer ${
            activeTab === 'tiket-antrean'
              ? 'text-[#904d00] font-semibold'
              : 'text-[#43474d] hover:text-[#0b1c30]'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <span
              className={`material-symbols-outlined text-[22px] transition-transform ${
                activeTab === 'tiket-antrean' ? 'scale-110' : ''
              }`}
            >
              confirmation_number
            </span>
            {activeTicketCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.5 bg-[#fe932c] text-white text-[10px] font-bold leading-none rounded-full shadow-xs">
                {activeTicketCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-[14px]">Tiket Antrean</span>
        </button>

        {/* Tab 4: Layanan */}
        <button
          type="button"
          onClick={() => onChangeTab('layanan')}
          aria-current={activeTab === 'layanan' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center gap-1 h-full min-h-[44px] transition-all cursor-pointer ${
            activeTab === 'layanan'
              ? 'text-[#904d00] font-semibold'
              : 'text-[#43474d] hover:text-[#0b1c30]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[22px] transition-transform ${
              activeTab === 'layanan' ? 'scale-110' : ''
            }`}
          >
            support_agent
          </span>
          <span className="text-[11px] leading-[14px]">Layanan</span>
        </button>
      </div>
    </nav>
  );
};
