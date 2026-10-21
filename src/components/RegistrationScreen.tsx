import React, { useState } from 'react';
import { VisitTicket, ServiceType, Visitor, WBP } from '../types';
import { CURRENT_USER, DEFAULT_WBP } from '../data/mockData';

interface RegistrationScreenProps {
  initialServiceType?: ServiceType;
  onCreateTicket: (newTicket: VisitTicket) => void;
  onNavigateHome: () => void;
  onViewTicket: (ticket: VisitTicket) => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  initialServiceType = 'tatap_muka',
  onCreateTicket,
  onNavigateHome,
  onViewTicket,
}) => {
  const [serviceType, setServiceType] = useState<ServiceType>(initialServiceType);
  const [selectedDate, setSelectedDate] = useState('2024-10-25');
  const [selectedSession, setSelectedSession] = useState<'pagi' | 'siang'>('pagi');
  const [exactTime, setExactTime] = useState('09.00 WIB');
  
  // WBP state
  const [wbp] = useState<WBP>(DEFAULT_WBP);
  
  // Visitor state
  const [visitor] = useState<Visitor>(CURRENT_USER);
  const [hasFollowers, setHasFollowers] = useState(false);
  const [followerName, setFollowerName] = useState('Ahmad Faiz');
  const [followerRelation, setFollowerRelation] = useState('Anak Kandung');
  const [followerNik, setFollowerNik] = useState('1106041209180001');

  // Food / goods
  const [selectedFoods, setSelectedFoods] = useState<string[]>([
    'Nasi dan Lauk Matang (Wadah Plastik Bening)',
  ]);
  const [clothingNote, setClothingNote] = useState('1 Stel Pakaian Kaos Polos');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<VisitTicket | null>(null);

  const availableDates = [
    { date: '2024-10-24', label: 'Hari Ini (24 Okt)', quota: 12, open: true },
    { date: '2024-10-25', label: 'Besok (Jumat, 25 Okt)', quota: 38, open: true },
    { date: '2024-10-26', label: 'Sabtu, 26 Okt', quota: 25, open: true },
    { date: '2024-10-28', label: 'Senin, 28 Okt', quota: 50, open: true },
  ];

  const foodOptions = [
    'Nasi dan Lauk Matang (Wadah Plastik Bening)',
    'Buah-buahan Segar (Sudah Dipotong)',
    'Kue / Roti Kering Kemasan Segel',
    'Perlengkapan Mandi (Sabun Batang, Pasta Gigi)',
  ];

  const handleFoodToggle = (item: string) => {
    setSelectedFoods(prev =>
      prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) return;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const dateFormatted =
      availableDates.find(d => d.date === selectedDate)?.label || selectedDate;

    const newTicket: VisitTicket = {
      id: `tkt-${Date.now()}`,
      bookingCode: `#LHK-${selectedDate.replace(/-/g, '')}-${randomSuffix}`,
      serviceType,
      wbp,
      visitor,
      additionalVisitors: hasFollowers
        ? [
            {
              name: followerName,
              nik: followerNik,
              relation: followerRelation,
              ageGroup: 'anak',
            },
          ]
        : [],
      visitDate: selectedDate,
      formattedDate: dateFormatted,
      session: selectedSession,
      sessionTime: selectedSession === 'pagi' ? '08.30 - 11.30 WIB' : '13.30 - 15.00 WIB',
      exactTime: exactTime,
      loket: serviceType === 'video_call' ? 'LOKET VIRTUAL 01' : 'LOKET 02',
      lockerNumber: serviceType === 'video_call' ? '-' : `Loker Mandiri #${Math.floor(10 + Math.random() * 40)}`,
      tableNumber: serviceType === 'video_call' ? 'Bilik Virtual 01' : `Meja Tatap Muka 0${Math.floor(1 + Math.random() * 9)}`,
      status: 'active',
      goodsNote: selectedFoods.length > 0 ? selectedFoods.join(', ') + (clothingNote ? ` + ${clothingNote}` : '') : 'Tidak ada titipan',
      foodItems: selectedFoods,
      createdAt: 'Baru saja',
    };

    onCreateTicket(newTicket);
    setSubmittedTicket(newTicket);
  };

  if (submittedTicket) {
    return (
      <div className="flex flex-col w-full pb-10 px-4 pt-4 animate-fade-in">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#dce9ff] text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#85f8c4] text-[#002114] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <span className="text-[12px] font-bold text-[#21a173] uppercase tracking-wider">
            Registrasi Berhasil
          </span>
          <h2 className="text-[20px] font-bold text-[#001428] mt-1">
            Tiket Kunjungan Diterbitkan!
          </h2>
          <p className="text-[12px] text-[#43474d] mt-1">
            Nomor Pendaftaran:{' '}
            <span className="font-mono font-bold text-[#001428]">
              {submittedTicket.bookingCode}
            </span>
          </p>

          <div className="my-5 p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] text-left w-full text-[12px] space-y-2">
            <div className="flex justify-between">
              <span className="text-[#43474d]">Layanan:</span>
              <span className="font-bold text-[#001428] capitalize">
                {submittedTicket.serviceType.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#43474d]">Warga Binaan:</span>
              <span className="font-bold text-[#001428]">{submittedTicket.wbp.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#43474d]">Jadwal:</span>
              <span className="font-bold text-[#904d00]">
                {submittedTicket.formattedDate} ({submittedTicket.exactTime})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#43474d]">Loket Dituju:</span>
              <span className="font-bold text-[#21a173]">{submittedTicket.loket}</span>
            </div>
          </div>

          <div className="w-full space-y-2">
            <button
              onClick={() => onViewTicket(submittedTicket)}
              className="w-full h-11 bg-[#fe932c] hover:bg-[#e07b1a] text-white font-bold text-[14px] rounded-lg flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
              Lihat Tiket & QR Code
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full h-10 bg-white hover:bg-[#f8f9ff] text-[#43474d] font-semibold text-[13px] rounded-lg border border-[#e5eeff] cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-10 px-4 pt-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-[20px] font-bold text-[#001428] tracking-tight">
          Pendaftaran Layanan Kunjungan
        </h1>
        <p className="text-[12px] text-[#43474d] mt-0.5">
          Sistem Registrasi Mandiri Pemasyarakatan - Lapas Kelas III Lhoknga
        </p>
      </div>

      {/* Service Type Selector */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#e5eeff] rounded-xl mb-4 text-[12px]">
        <button
          type="button"
          onClick={() => setServiceType('tatap_muka')}
          className={`py-2 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
            serviceType === 'tatap_muka'
              ? 'bg-white text-[#001428] shadow-xs'
              : 'text-[#43474d] hover:text-[#001428]'
          }`}
        >
          Tatap Muka
        </button>
        <button
          type="button"
          onClick={() => setServiceType('video_call')}
          className={`py-2 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
            serviceType === 'video_call'
              ? 'bg-white text-[#001428] shadow-xs'
              : 'text-[#43474d] hover:text-[#001428]'
          }`}
        >
          Video Call
        </button>
        <button
          type="button"
          onClick={() => setServiceType('titipan_barang')}
          className={`py-2 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
            serviceType === 'titipan_barang'
              ? 'bg-white text-[#001428] shadow-xs'
              : 'text-[#43474d] hover:text-[#001428]'
          }`}
        >
          Titipan Makanan
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: WBP Profile */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider">
              Tahap 1: Warga Binaan (WBP)
            </span>
            <span className="text-[11px] text-[#21a173] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check</span>
              Terhubung
            </span>
          </div>

          <div className="flex items-start gap-3 p-2.5 bg-[#eff4ff] rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-[#0f2942] text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">account_box</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-bold text-[#001428]">{wbp.name}</span>
              <span className="text-[11px] text-[#43474d]">
                No. Registrasi: {wbp.regNumber}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-[#001428]">
                  {wbp.room}
                </span>
                <span className="text-[11px] text-[#43474d]">{wbp.block}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Date & Session */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff]">
          <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider block mb-2">
            Tahap 2: Pilih Jadwal & Kuota
          </span>

          <label className="text-[12px] font-semibold text-[#001428] block mb-1.5">
            Pilih Tanggal Kunjungan:
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {availableDates.map(item => (
              <button
                key={item.date}
                type="button"
                onClick={() => setSelectedDate(item.date)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedDate === item.date
                    ? 'border-[#001428] bg-[#e5eeff] text-[#001428]'
                    : 'border-[#e5eeff] bg-white text-[#43474d] hover:bg-[#f8f9ff]'
                }`}
              >
                <span className="text-[12px] font-bold block">{item.label}</span>
                <span className="text-[10px] text-[#21a173] font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#21a173]"></span>
                  Sisa {item.quota} Kuota
                </span>
              </button>
            ))}
          </div>

          <label className="text-[12px] font-semibold text-[#001428] block mb-1.5">
            Pilih Sesi Waktu:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedSession('pagi');
                setExactTime('09.00 WIB');
              }}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedSession === 'pagi'
                  ? 'border-[#001428] bg-[#001428] text-white'
                  : 'border-[#e5eeff] bg-white text-[#43474d]'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">wb_twilight</span>
                Sesi Pagi
              </div>
              <span className="text-[12px] font-bold block mt-0.5">08.30 - 11.30 WIB</span>
              <span className="text-[10px] opacity-80">Estimasi jam 09.00</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedSession('siang');
                setExactTime('13.45 WIB');
              }}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                selectedSession === 'siang'
                  ? 'border-[#001428] bg-[#001428] text-white'
                  : 'border-[#e5eeff] bg-white text-[#43474d]'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">wb_sunny</span>
                Sesi Siang
              </div>
              <span className="text-[12px] font-bold block mt-0.5">13.30 - 15.00 WIB</span>
              <span className="text-[10px] opacity-80">Estimasi jam 13.45</span>
            </button>
          </div>
        </div>

        {/* Step 3: Visitor Data */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff]">
          <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider block mb-2">
            Tahap 3: Pengunjung Utama & Pengikut
          </span>

          <div className="p-3 bg-[#eff4ff] rounded-lg text-[12px] space-y-1 mb-3">
            <div className="flex justify-between">
              <span className="text-[#43474d]">Nama:</span>
              <span className="font-bold text-[#001428]">{visitor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#43474d]">NIK Dukcapil:</span>
              <span className="font-mono text-[#001428]">{visitor.nik}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#43474d]">Hubungan Keluarga:</span>
              <span className="font-bold text-[#21a173]">{visitor.relation} (Terverifikasi)</span>
            </div>
          </div>

          {/* Additional family members checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[12px] font-medium text-[#001428]">
              <input
                type="checkbox"
                checked={hasFollowers}
                onChange={e => setHasFollowers(e.target.checked)}
                className="w-4 h-4 rounded text-[#fe932c] focus:ring-[#fe932c]"
              />
              Bawa Anggota Keluarga Tambahan / Anak
            </label>

            {hasFollowers && (
              <div className="mt-3 p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff] space-y-2 text-[12px]">
                <div>
                  <label className="block text-[11px] text-[#43474d] font-semibold mb-0.5">
                    Nama Anggota Keluarga:
                  </label>
                  <input
                    type="text"
                    value={followerName}
                    onChange={e => setFollowerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#c3c6ce] text-[#001428] text-[12px] focus:outline-none focus:border-[#001428]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#43474d] font-semibold mb-0.5">
                      Hubungan:
                    </label>
                    <input
                      type="text"
                      value={followerRelation}
                      onChange={e => setFollowerRelation(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#c3c6ce] text-[#001428] text-[12px] focus:outline-none focus:border-[#001428]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#43474d] font-semibold mb-0.5">
                      NIK Anak / KIA:
                    </label>
                    <input
                      type="text"
                      value={followerNik}
                      onChange={e => setFollowerNik(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#c3c6ce] text-[#001428] text-[12px] focus:outline-none focus:border-[#001428]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Items & Declaration */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e5eeff]">
          <span className="text-[11px] font-bold text-[#904d00] uppercase tracking-wider block mb-2">
            Tahap 4: Deklarasi Barang & Makanan Sesuai SOP
          </span>

          <p className="text-[11px] text-[#43474d] mb-2 leading-relaxed">
            Centang barang atau makanan yang dibawa untuk pemeriksaan awal mesin X-Ray di pintu P2U:
          </p>

          <div className="space-y-1.5 mb-3">
            {foodOptions.map((item, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg bg-[#f8f9ff] hover:bg-[#eff4ff] cursor-pointer text-[12px] text-[#001428]"
              >
                <input
                  type="checkbox"
                  checked={selectedFoods.includes(item)}
                  onChange={() => handleFoodToggle(item)}
                  className="mt-0.5 w-4 h-4 rounded text-[#fe932c] focus:ring-[#fe932c]"
                />
                <span className="leading-snug">{item}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-[11px] text-[#43474d] font-semibold mb-1">
              Catatan Pakaian / Titipan Lainnya:
            </label>
            <input
              type="text"
              value={clothingNote}
              onChange={e => setClothingNote(e.target.value)}
              placeholder="Contoh: 1 stel baju koko putih, buku doa"
              className="w-full px-3 py-2 rounded-lg border border-[#c3c6ce] text-[#001428] text-[12px] focus:outline-none focus:border-[#001428]"
            />
          </div>

          <div className="mt-3 pt-3 border-t border-[#eff4ff]">
            <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#43474d] leading-relaxed">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#fe932c] focus:ring-[#fe932c]"
              />
              <span>
                Saya menyatakan dengan sungguh-sungguh mematuhi tata tertib Lapas Kelas III Lhoknga, berpakaian sopan/tertutup, tidak membawa HP/gawai ke dalam, dan bersedia digeledah fisik oleh petugas sesuai SOP Kemenimipas RI.
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!agreeTerms}
          className={`w-full h-12 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm ${
            agreeTerms
              ? 'bg-[#fe932c] hover:bg-[#e07b1a] text-white active:scale-[0.99] cursor-pointer'
              : 'bg-[#c3c6ce] text-[#74777e] cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
          Konfirmasi & Terbitkan Tiket Masuk
        </button>
      </form>
    </div>
  );
};
