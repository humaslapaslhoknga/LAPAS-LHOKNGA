import React, { useState, useEffect, useRef } from 'react';
import { dbInstance, SCHEMA } from '../db/spreadsheetDb';
import { SheetName } from '../db/types';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [activeSheet, setActiveSheet] = useState<SheetName>('Kunjungan');
  const [tableData, setTableData] = useState<Record<string, string>[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Row edit / add modal
  const [editingRow, setEditingRow] = useState<Record<string, string> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editFormData, setEditFormData] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sheetNames: SheetName[] = [
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

  const reloadData = () => {
    const rows = dbInstance.getSheetRows(activeSheet);
    setTableData(rows);
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
    }
  }, [isOpen, activeSheet]);

  if (!isOpen) return null;

  const currentHeaders = SCHEMA[activeSheet] || [];

  const filteredData = tableData.filter(row => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return Object.values(row).some(val => String(val || '').toLowerCase().includes(q));
  });

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleReset = () => {
    if (window.confirm('Reset seluruh database ke data bawaan awal (seed data Code.gs)? Semua perubahan yang belum diekspor akan dikembalikan ke kondisi awal.')) {
      dbInstance.resetToDefaults();
      reloadData();
      showToast('Database berhasil direset ke kondisi awal Code.gs.');
    }
  };

  const handleExportJson = () => {
    const json = dbInstance.exportDatabaseJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DATABASE_LAPAS_LHOKNGA_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database JSON berhasil diunduh.');
  };

  const handleExportCsv = () => {
    const headers = SCHEMA[activeSheet];
    const rows = dbInstance.getSheetRows(activeSheet);
    let csv = headers.join(',') + '\n';
    rows.forEach(r => {
      const line = headers
        .map(h => {
          let v = String(r[h] || '').replace(/"/g, '""');
          if (v.includes(',') || v.includes('\n') || v.includes('"')) {
            v = `"${v}"`;
          }
          return v;
        })
        .join(',');
      csv += line + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SHEET_${activeSheet}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Sheet ${activeSheet} berhasil diekspor ke CSV.`);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const text = ev.target?.result as string;
        const ok = dbInstance.importDatabaseJson(text);
        if (ok) {
          reloadData();
          showToast('Database JSON berhasil diimpor & disimpan.');
        } else {
          alert('Format berkas JSON database tidak valid.');
        }
      } catch {
        alert('Gagal membaca berkas JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const openAddRowModal = () => {
    const initial: Record<string, string> = {};
    currentHeaders.forEach(h => {
      initial[h] = '';
    });
    setEditFormData(initial);
    setIsAddingNew(true);
    setEditingRow(null);
  };

  const openEditRowModal = (row: Record<string, string>) => {
    setEditFormData({ ...row });
    setEditingRow(row);
    setIsAddingNew(false);
  };

  const handleDeleteRow = (rowNum: number) => {
    if (window.confirm(`Hapus baris #${rowNum} dari sheet ${activeSheet}?`)) {
      dbInstance.deleteRow(activeSheet, rowNum);
      reloadData();
      showToast(`Baris #${rowNum} berhasil dihapus.`);
    }
  };

  const handleSaveRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingNew) {
      dbInstance.addRow(activeSheet, editFormData);
      showToast(`Data baru berhasil ditambahkan ke sheet ${activeSheet}.`);
    } else if (editingRow && editingRow._row) {
      const rowNum = parseInt(String(editingRow._row), 10);
      dbInstance.setRow(activeSheet, rowNum, editFormData);
      showToast(`Baris #${rowNum} sheet ${activeSheet} berhasil diperbarui.`);
    }
    setEditingRow(null);
    setIsAddingNew(false);
    reloadData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div
        className="relative w-full max-w-[1300px] h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#cbd5e1]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="db-title"
      >
        {/* Top Header */}
        <div className="bg-[#001428] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">table_chart</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="db-title" className="text-[17px] font-extrabold tracking-tight text-white flex items-center gap-2">
                  Database Spreadsheet Lapas Lhoknga
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#10b981]/25 text-[#34d399] text-[11px] font-bold border border-[#10b981]/40 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                  13 SHEET AKTIF
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-0.5">
                Penyimpanan Real-Time & Persisten sinkron dengan Backend API Code.gs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={openAddRowModal}
              className="h-8.5 px-3 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Tambah baris baru ke sheet yang aktif"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              + Tambah Baris
            </button>
            <button
              onClick={handleExportJson}
              className="h-8.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Unduh seluruh database dalam format JSON"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              Backup JSON
            </button>
            <button
              onClick={handleExportCsv}
              className="h-8.5 px-3 rounded-lg bg-[#e9c170] hover:bg-[#dca847] text-[#01162a] text-[12px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Unduh sheet aktif dalam format CSV"
            >
              <span className="material-symbols-outlined text-[17px]">file_download</span>
              Export CSV
            </button>
            <label
              className="h-8.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Pulihkan database dari berkas JSON backup"
            >
              <span className="material-symbols-outlined text-[17px]">upload_file</span>
              Import JSON
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
            <button
              onClick={handleReset}
              className="h-8.5 px-3 rounded-lg bg-[#f43f5e]/20 hover:bg-[#f43f5e]/30 text-[#fecdd3] text-[12px] font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#f43f5e]/30"
              title="Kembalikan database ke data bawaan awal"
            >
              <span className="material-symbols-outlined text-[17px]">restart_alt</span>
              Reset Data
            </button>
            <button
              onClick={onClose}
              className="w-8.5 h-8.5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer ml-1"
              aria-label="Tutup Database"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="p-3 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between flex-wrap gap-2 text-[12px]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#001428] text-[13px]">
              Sheet: <span className="text-[#0a5085]">{activeSheet}</span>
            </span>
            <span className="text-[#64748b]">
              ({filteredData.length} baris ditampilkan dari {tableData.length} total baris, {currentHeaders.length} kolom)
            </span>
            {statusMessage && (
              <span className="text-[#047857] font-bold bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded-md animate-fade-in flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                {statusMessage}
              </span>
            )}
          </div>

          <div className="relative min-w-[280px]">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Cari apa saja di sheet ${activeSheet}...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#cbd5e1] text-[12px] bg-white focus:outline-none focus:border-[#0a5085] focus:ring-2 focus:ring-[#0a5085]/20 shadow-xs"
            />
            <span className="material-symbols-outlined text-[18px] text-[#94a3b8] absolute left-2 top-1.5">
              search
            </span>
          </div>
        </div>

        {/* Table View (Spreadsheet Grid) */}
        <div className="flex-1 overflow-auto bg-white select-text">
          <table className="w-full border-collapse text-[12px] text-left">
            <thead>
              <tr className="bg-[#001428] text-white sticky top-0 z-20 shadow-sm">
                <th className="p-2 border border-[#334155] w-14 text-center text-[#94a3b8] font-mono text-[11px]">
                  # Row
                </th>
                <th className="p-2 border border-[#334155] w-20 text-center text-[#e9c170] font-bold text-[11px]">
                  Aksi
                </th>
                {currentHeaders.map(col => (
                  <th
                    key={col}
                    className="p-2.5 border border-[#334155] font-bold text-white whitespace-nowrap text-[12px] tracking-wide"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentHeaders.length + 2}
                    className="p-12 text-center text-[#64748b] bg-[#f8fafc]"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[40px] text-[#cbd5e1]">
                        table_rows
                      </span>
                      <p className="font-semibold">
                        {searchQuery
                          ? `Tidak ditemukan data dengan kata kunci "${searchQuery}".`
                          : `Sheet ${activeSheet} masih kosong.`}
                      </p>
                      <button
                        onClick={openAddRowModal}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-[#10b981] text-white text-[12px] font-bold hover:bg-[#059669] cursor-pointer"
                      >
                        + Tambah Baris Pertama
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row, idx) => {
                  const rowNum = parseInt(String(row._row || idx + 2), 10);
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-[#f1f5f9] transition-colors border-b border-[#e2e8f0] group"
                    >
                      <td className="p-2 border border-[#e2e8f0] text-center font-mono text-[#64748b] bg-[#f8fafc] text-[11px]">
                        {rowNum}
                      </td>
                      <td className="p-1.5 border border-[#e2e8f0] text-center whitespace-nowrap bg-white">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditRowModal(row)}
                            className="p-1 rounded text-[#0a5085] hover:bg-[#dbe7f3] transition-colors cursor-pointer"
                            title="Edit baris ini"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteRow(rowNum)}
                            className="p-1 rounded text-[#f43f5e] hover:bg-[#ffe4e6] transition-colors cursor-pointer"
                            title="Hapus baris ini"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                      {currentHeaders.map(col => {
                        const val = String(row[col] ?? '');
                        const isLong = val.length > 55 || val.includes('\n') || val.includes('<');
                        return (
                          <td
                            key={col}
                            className="p-2 border border-[#e2e8f0] text-[#0f172a] max-w-[280px] truncate font-sans text-[12px]"
                            title={val}
                          >
                            {isLong ? (
                              <span className="font-mono text-[11px] text-[#043666] bg-[#f1f5f9] px-1 py-0.5 rounded">
                                {val.slice(0, 50)}...
                              </span>
                            ) : (
                              val || <span className="text-[#cbd5e1] italic">(kosong)</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Sheet Tabs Bottom Bar (Google Sheets style) */}
        <div className="bg-[#000c18] border-t border-[#334155] px-2 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-extrabold text-[#94a3b8] px-2 uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#e9c170]">tabs</span>
            SHEETS:
          </span>
          {sheetNames.map(sheet => {
            const isActive = activeSheet === sheet;
            const count = (dbInstance.getSheetRows(sheet) || []).length;
            return (
              <button
                key={sheet}
                onClick={() => {
                  setActiveSheet(sheet);
                  setSearchQuery('');
                  setEditingRow(null);
                  setIsAddingNew(false);
                }}
                className={`px-3 py-1.5 rounded-t-lg text-[12px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#001428] border-t-2 border-[#10b981] shadow-md'
                    : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{sheet}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-[#001428] text-[#34d399]' : 'bg-[#334155] text-white'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row Edit / Add Modal */}
      {(isAddingNew || editingRow) && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#cbd5e1]">
            <div className="px-5 py-3.5 bg-[#001428] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#e9c170]">
                  {isAddingNew ? 'add_box' : 'edit_document'}
                </span>
                <h3 className="font-extrabold text-[15px]">
                  {isAddingNew
                    ? `Tambah Data Baru di Sheet [${activeSheet}]`
                    : `Edit Baris #${editingRow?._row} di Sheet [${activeSheet}]`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingRow(null);
                  setIsAddingNew(false);
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveRow} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentHeaders.map(col => {
                  const val = editFormData[col] || '';
                  const isLargeField =
                    col.toLowerCase().includes('isi') ||
                    col.toLowerCase().includes('deskripsi') ||
                    col.toLowerCase().includes('alamat') ||
                    col.toLowerCase().includes('tanggapan') ||
                    col.toLowerCase().includes('sambutan') ||
                    col.toLowerCase().includes('jadwal') ||
                    col.toLowerCase().includes('fasilitas');

                  return (
                    <div key={col} className={isLargeField ? 'col-span-full' : ''}>
                      <label className="block text-[12px] font-bold text-[#001428] mb-1">
                        {col}
                      </label>
                      {isLargeField ? (
                        <textarea
                          rows={4}
                          value={val}
                          onChange={e =>
                            setEditFormData({ ...editFormData, [col]: e.target.value })
                          }
                          className="w-full p-2.5 rounded-lg border border-[#cbd5e1] text-[12px] bg-[#f8fafc] focus:bg-white focus:outline-none focus:border-[#0a5085] focus:ring-2 focus:ring-[#0a5085]/20 font-mono"
                          placeholder={`Isi nilai kolom ${col}...`}
                        />
                      ) : (
                        <input
                          type="text"
                          value={val}
                          onChange={e =>
                            setEditFormData({ ...editFormData, [col]: e.target.value })
                          }
                          className="w-full p-2 rounded-lg border border-[#cbd5e1] text-[12px] bg-[#f8fafc] focus:bg-white focus:outline-none focus:border-[#0a5085] focus:ring-2 focus:ring-[#0a5085]/20"
                          placeholder={`Isi nilai kolom ${col}...`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRow(null);
                    setIsAddingNew(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#cbd5e1] text-[12px] font-bold text-[#475569] hover:bg-[#f1f5f9] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white text-[12px] font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Simpan ke Spreadsheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
