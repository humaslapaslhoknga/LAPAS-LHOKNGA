import React from 'react';
import { CURRENT_USER, DEFAULT_WBP } from '../data/mockData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-[440px] max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
      >
        <div className="bg-[#0f2942] text-white p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#ffdcc3]">badge</span>
            <div>
              <h3 id="profile-title" className="text-[14px] font-bold">
                Kartu Tanda Pengunjung Lapas
              </h3>
              <p className="text-[11px] text-[#7991af]">Identitas Terintegrasi SIAK Dukcapil & SDP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup Profil"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4 text-[12px]">
          {/* Avatar & Main Tag */}
          <div className="flex items-center gap-3.5 p-3.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
            <img
              alt="Siti Rahmah"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1f10hWwA1hKREfyso_voy_b3xmaK6zCi4DWLVrhp8zRoiqJMEB1YYCq_ZbWW5lNSeekzrzQFol7vWMvHpXn785Yx41skD4d-irOHI6RjD5dub2M7fd3mNSdg-jas8Jbbz9XeXc_JnL2ksI9llX9ZBfw6rGnMnTRN4qGSJWZrw1qbkTsmiIqnkzHjV6EwERH7oKGEwZLqHNum9PE8x2vitHBkftf2n5GN4a8-VrziM7caWMW-KSow"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#21a173]"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[16px] font-bold text-[#001428] truncate">
                {CURRENT_USER.name}
              </span>
              <span className="text-[11px] font-mono text-[#43474d]">
                NIK: {CURRENT_USER.nik}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#21a173]"></span>
                <span className="text-[11px] font-bold text-[#21a173]">
                  Keluarga Sah Terverifikasi Dukcapil
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-[#f8f9ff] rounded-xl p-3 space-y-2 border border-[#e5eeff]">
            <div className="flex justify-between py-1 border-b border-[#e5eeff]">
              <span className="text-[#43474d]">Hubungan dengan WBP:</span>
              <span className="font-bold text-[#001428]">{CURRENT_USER.relation}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#e5eeff]">
              <span className="text-[#43474d]">Warga Binaan Dibesuk:</span>
              <span className="font-bold text-[#001428]">{DEFAULT_WBP.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#e5eeff]">
              <span className="text-[#43474d]">Nomor Kontak:</span>
              <span className="font-bold text-[#001428]">{CURRENT_USER.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#e5eeff]">
              <span className="text-[#43474d]">Domisili:</span>
              <span className="font-medium text-[#001428] text-right">{CURRENT_USER.address}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#43474d]">Status Biometrik:</span>
              <span className="font-bold text-[#21a173]">Sidik Jari Aktif</span>
            </div>
          </div>

          <div className="rounded-xl bg-[#eff4ff] p-3 border border-[#dce9ff] text-[11px] text-[#001428]">
            <p className="font-semibold mb-1">Informasi Hak Pengunjung:</p>
            <p className="text-[#43474d] leading-relaxed">
              Sebagai keluarga inti yang terdaftar secara sah di Dukcapil, Anda berhak mendapatkan layanan kunjungan tatap muka sesuai jadwal blok WBP dan layanan penitipan barang secara gratis tanpa dipungut biaya apapun.
            </p>
          </div>
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
