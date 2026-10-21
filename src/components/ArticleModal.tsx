import React from 'react';
import { Announcement } from '../types';

interface ArticleModalProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  announcement,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !announcement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-[440px] max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-title"
      >
        <div className="relative h-48 w-full">
          <img
            src={announcement.imageUrl}
            alt={announcement.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Tutup Artikel"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${announcement.badgeColor} mb-1`}
            >
              {announcement.category}
            </span>
            <span className="text-[11px] text-[#ffdcc3] block">{announcement.date}</span>
          </div>
        </div>

        <div className="overflow-y-auto p-4 space-y-3 text-[13px]">
          <h2 id="article-title" className="text-[16px] font-bold text-[#001428] leading-snug">
            {announcement.title}
          </h2>

          <div className="space-y-2.5 text-[#43474d] leading-relaxed">
            {announcement.fullContent.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-4 p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[11px] text-[#001428]">
            <span className="font-bold block mb-0.5">Lembaga Pemasyarakatan Kelas III Lhoknga</span>
            <p className="text-[#43474d]">
              Direktorat Jenderal Pemasyarakatan — Kementerian Imigrasi dan Pemasyarakatan Republik Indonesia
            </p>
          </div>
        </div>

        <div className="p-3 bg-[#f8f9ff] border-t border-[#e5eeff]">
          <button
            onClick={onClose}
            className="w-full h-10 bg-[#001428] hover:bg-[#0f2942] text-white font-bold rounded-lg text-[13px] transition-colors cursor-pointer"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};
