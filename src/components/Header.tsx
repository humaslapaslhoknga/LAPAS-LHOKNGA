import React from 'react';

interface HeaderProps {
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onNavigateHome: () => void;
  onSwitchToWebsite?: () => void;
  onOpenDatabase?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unreadNotificationsCount = 1,
  onOpenNotifications,
  onOpenProfile,
  onNavigateHome,
  onSwitchToWebsite,
  onOpenDatabase,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0f2942]/95 backdrop-blur-xl text-white pt-safe shadow-[0_1px_8px_rgba(15,41,66,0.12)]">
      <div className="max-w-[480px] mx-auto h-20 px-3 flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 min-w-0 pr-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
          aria-label="Kembali ke Beranda Lapas Lhoknga"
        >
          <img
            alt="Logo Lapas Kelas III Lhoknga"
            className="h-8.5 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XOh593sO5EoQfPU6aUTdXvgsb2n0DXQMLF5zlzoTzZfBXyRKHqhDHte6bG_buBoMI6xhF-mswnTGFKwb0UGN4jPrJWAMxNQ7c4TUNpRxzDD49dPBf2VNIuAa1SN4maWiqUYkN0eD7Nom0juGfRh1NcJW23kdkmpkh0nVS4GtbCJG2k03lsIhLpCqMBF6JvN-drjz2YxEfWBNNvh9O261EKCl_LRjpBubxKaAPm5EYYIipN69oCOt30"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[13px] leading-tight tracking-tight font-bold text-white truncate">
                Lapas Lhoknga
              </span>
            </div>
            <span className="text-[10px] leading-tight text-[#7991af] tracking-wider uppercase font-semibold truncate mt-0.5">
              Kemenimipas RI
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1 flex-shrink-0">
          {onOpenDatabase && (
            <button
              onClick={onOpenDatabase}
              className="h-8 px-2 rounded-lg bg-[#10b981]/20 hover:bg-[#10b981]/30 text-[#34d399] border border-[#10b981]/40 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Buka Database Spreadsheet (13 Sheet)"
            >
              <span className="material-symbols-outlined text-[16px]">table_chart</span>
              <span className="hidden sm:inline">DB</span>
            </button>
          )}

          {onSwitchToWebsite && (
            <button
              onClick={onSwitchToWebsite}
              className="h-8 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#e9c170] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Kembali ke Portal Website & Admin"
            >
              <span className="material-symbols-outlined text-[16px]">language</span>
              <span className="hidden sm:inline">Portal</span>
            </button>
          )}

          <button
            onClick={onOpenNotifications}
            aria-label="Pemberitahuan"
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 active:bg-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#fe932c] rounded-full ring-2 ring-[#0f2942]"></span>
            )}
          </button>

          <button
            onClick={onOpenProfile}
            aria-label="Profil Siti Rahmah"
            className="flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-[#fe932c] focus:outline-none focus:ring-2 focus:ring-[#fe932c] transition-all ml-0.5"
          >
            <img
              alt="Profile"
              className="w-7.5 h-7.5 rounded-full object-cover ring-1 ring-white/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1f10hWwA1hKREfyso_voy_b3xmaK6zCi4DWLVrhp8zRoiqJMEB1YYCq_ZbWW5lNSeekzrzQFol7vWMvHpXn785Yx41skD4d-irOHI6RjD5dub2M7fd3mNSdg-jas8Jbbz9XeXc_JnL2ksI9llX9ZBfw6rGnMnTRN4qGSJWZrw1qbkTsmiIqnkzHjV6EwERH7oKGEwZLqHNum9PE8x2vitHBkftf2n5GN4a8-VrziM7caWMW-KSow"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
