import React from 'react';

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacilityModal: React.FC<FacilityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-[440px] max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="facility-title"
      >
        <div className="relative h-44 w-full">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuArpbIhWVXlpJndpCxbQNwtN6aIItLlsX7VBJxwqgDB79L55KIOo5TJkGrsBAi_yNtFEMv3EbmayFrcep7VZSCX8tBRS361ZjJRKVMefI3m-_BaykiUVym1kK2iC1S4CrCfjvNCSPvcX2WKPsayOyZK9Kz9T3mNZpORdG5B0lUyFfDlv1gZN9wYCVw5PDzmUeL7UK093dM-czwmqRXguut5W23QfjxGHJExHDpMr-fIK2EhUCIK4dI"
            alt="Fasilitas Ruang Kunjungan Tatap Muka Terpadu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001428] via-[#001428]/40 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[11px] text-[#ffdcc3] uppercase tracking-wider font-bold">
              FASILITAS RAMAH HAM
            </span>
            <h2 id="facility-title" className="text-[16px] font-bold text-white leading-tight">
              Ruang Kunjungan Tatap Muka Terpadu
            </h2>
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-4 text-[12px]">
          <div className="flex items-center gap-2 p-2.5 bg-[#eff4ff] rounded-xl text-[#005137] font-semibold">
            <span className="material-symbols-outlined text-[20px] text-[#21a173]">check_circle</span>
            <span>Standar Pelayanan Berbasis Hak Asasi Manusia (P2HAM)</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
              <div className="flex items-center gap-2 mb-1 text-[#001428] font-bold">
                <span className="material-symbols-outlined text-[18px] text-[#21a173]">toys</span>
                <span>Arena Bermain Anak Ramah & Bersih</span>
              </div>
              <p className="text-[#43474d] text-[11px] leading-relaxed">
                Tersedia mainan edukatif, buku bergambar, dan matras empuk agar anak-anak keluarga pengunjung merasa nyaman dan aman selama mendampingi orang tua.
              </p>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
              <div className="flex items-center gap-2 mb-1 text-[#001428] font-bold">
                <span className="material-symbols-outlined text-[18px] text-[#fe932c]">child_friendly</span>
                <span>Pojok Laktasi (Ibu Menyusui)</span>
              </div>
              <p className="text-[#43474d] text-[11px] leading-relaxed">
                Ruangan privat ber-AC dengan sofa nyaman, wastafel cuci tangan, dan dispenser air hangat untuk ibu yang menyusui balita.
              </p>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
              <div className="flex items-center gap-2 mb-1 text-[#001428] font-bold">
                <span className="material-symbols-outlined text-[18px] text-[#001428]">accessible</span>
                <span>Jalur Landai & Fasilitas Disabilitas</span>
              </div>
              <p className="text-[#43474d] text-[11px] leading-relaxed">
                Tersedia kursi roda gratis, jalur pemandu (guiding block), dan toilet khusus ramah disabilitas dan lansia.
              </p>
            </div>

            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
              <div className="flex items-center gap-2 mb-1 text-[#001428] font-bold">
                <span className="material-symbols-outlined text-[18px] text-[#ba1a1a]">smoke_free</span>
                <span>Kawasan Bebas Asap Rokok (100% Non-Smoking)</span>
              </div>
              <p className="text-[#43474d] text-[11px] leading-relaxed">
                Demi kesehatan bersama dan perlindungan anak-anak, seluruh area tertutup kunjungan steril dari asap rokok atau vape.
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#f8f9ff] border-t border-[#e5eeff]">
          <button
            onClick={onClose}
            className="w-full h-10 bg-[#001428] hover:bg-[#0f2942] text-white font-bold rounded-lg text-[13px] transition-colors cursor-pointer"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
};
