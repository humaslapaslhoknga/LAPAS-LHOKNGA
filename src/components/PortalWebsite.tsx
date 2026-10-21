import React, { useRef, useState, useEffect } from 'react';
import { dbInstance } from '../db/spreadsheetDb';

interface PortalWebsiteProps {
  onOpenDatabase: () => void;
  onSwitchToMobile: () => void;
}

export const PortalWebsite: React.FC<PortalWebsiteProps> = ({
  onOpenDatabase,
  onSwitchToMobile,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentHash, setCurrentHash] = useState<string>('#/');
  const [dbRowCount, setDbRowCount] = useState(0);

  const updateCounts = () => {
    let total = 0;
    const sheets = [
      'Kunjungan',
      'Pengaduan',
      'Berita',
      'Berita_Isi',
      'Pelayanan',
      'Program',
      'Dokumen',
      'Galeri',
      'Pejabat',
      'Halaman',
      'Pengaturan',
      'Users',
      'Log',
    ];
    sheets.forEach(s => {
      total += (dbInstance.getSheetRows(s as any) || []).length;
    });
    setDbRowCount(total);
  };

  useEffect(() => {
    updateCounts();
    const interval = setInterval(updateCounts, 3000);
    return () => clearInterval(interval);
  }, []);

  const navigateIframe = (hash: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.location.hash = hash;
      setCurrentHash(hash);
    }
  };

  const copyCreds = () => {
    navigator.clipboard.writeText('admin / LapasLhoknga2025!');
    alert('Kredensial disalin: Username: admin, Password: LapasLhoknga2025!');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#000c18] overflow-hidden select-none">
      {/* Top Universal App Navigation Bar */}
      <header className="bg-[#000c18] border-b border-[#032a52] px-4 py-2.5 flex items-center justify-between z-40 text-white flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1XOh593sO5EoQfPU6aUTdXvgsb2n0DXQMLF5zlzoTzZfBXyRKHqhDHte6bG_buBoMI6xhF-mswnTGFKwb0UGN4jPrJWAMxNQ7c4TUNpRxzDD49dPBf2VNIuAa1SN4maWiqUYkN0eD7Nom0juGfRh1NcJW23kdkmpkh0nVS4GtbCJG2k03lsIhLpCqMBF6JvN-drjz2YxEfWBNNvh9O261EKCl_LRjpBubxKaAPm5EYYIipN69oCOt30"
            alt="Logo Lapas Lhoknga"
            className="h-8 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="text-[14px] font-extrabold tracking-tight text-white flex items-center gap-1.5">
              Portal Website Lapas Kelas III Lhoknga
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#34d399] font-bold border border-[#10b981]/30">
                Code.gs & Index Live
              </span>
            </span>
            <span className="text-[10px] text-[#7fa9cf] font-medium">
              Kementerian Imigrasi dan Pemasyarakatan RI • Kanwil Ditjenpas Aceh
            </span>
          </div>
        </div>

        {/* Quick Mode & Feature Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#01162a] p-1 rounded-xl border border-[#043666]">
            <button
              onClick={() => navigateIframe('#/')}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentHash === '#/' || currentHash === ''
                  ? 'bg-[#0a5085] text-white shadow-xs'
                  : 'text-[#aecbe3] hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              Beranda
            </button>
            <button
              onClick={() => navigateIframe('#/kunjungan/daftar')}
              className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#aecbe3] hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#e9c170]">calendar_month</span>
              SILAKU Kunjungan
            </button>
            <button
              onClick={() => navigateIframe('#/kontak')}
              className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#aecbe3] hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#f43f5e]">support_agent</span>
              SILADU Pengaduan
            </button>
            <button
              onClick={() => navigateIframe('#/admin')}
              className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#e9c170] hover:bg-[#e9c170]/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              Portal Admin
            </button>
          </div>

          {/* Database Inspector Action */}
          <button
            onClick={onOpenDatabase}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#047857] hover:brightness-110 text-white text-[12px] font-extrabold flex items-center gap-1.5 shadow-md transition-all cursor-pointer border border-[#34d399]/40"
            title="Buka Database Spreadsheet 13 Sheet lengkap"
          >
            <span className="material-symbols-outlined text-[18px]">table_chart</span>
            <span>DATA BASE (13 Sheet)</span>
            <span className="px-1.5 py-0.2 bg-black/30 rounded-full text-[10px] font-mono">
              {dbRowCount}
            </span>
          </button>

          {/* Mobile App Mode Switcher */}
          <button
            onClick={onSwitchToMobile}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#dbe7f3] text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
            title="Beralih ke tampilan Aplikasi Mobile SILAPAS untuk warga"
          >
            <span className="material-symbols-outlined text-[18px] text-[#e9c170]">smartphone</span>
            <span>Tampilan Mobile</span>
          </button>

          {/* Quick Credential Badge */}
          <button
            onClick={copyCreds}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#01162a] border border-[#043666] text-[11px] text-[#aecbe3] hover:border-[#e9c170] transition-colors cursor-pointer"
            title="Klik untuk menyalin username dan password Admin"
          >
            <span className="material-symbols-outlined text-[14px] text-[#e9c170]">key</span>
            <span>admin / LapasLhoknga2025!</span>
          </button>
        </div>
      </header>

      {/* Main Website Frame hosting portal.html */}
      <div className="flex-1 w-full relative bg-[#f6f8fb]">
        <iframe
          ref={iframeRef}
          src="/portal.html"
          title="Website Resmi Lapas Kelas III Lhoknga"
          className="w-full h-full border-0 absolute inset-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
        />
      </div>
    </div>
  );
};
