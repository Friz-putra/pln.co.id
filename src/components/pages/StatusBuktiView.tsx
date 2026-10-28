import React, { useState } from 'react';
import { 
  Printer, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Copy, 
  Check, 
  Search, 
  Eye, 
  Download, 
  X,
  CreditCard,
  Building,
  ShieldCheck
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';
import { Pembayaran } from '../../types/ppob';

export const StatusBuktiView: React.FC = () => {
  const { 
    pembayaranList, 
    selectedTrxId, 
    setSelectedTrxId, 
    rekonsiliasiList,
    setActivePage 
  } = usePPOB();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activeModalTrx, setActiveModalTrx] = useState<Pembayaran | null>(null);
  const [copied, setCopied] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  // Totals
  const totalHakPln = pembayaranList.reduce((sum, p) => sum + p.nominal_pln, 0);
  const totalAdmin = pembayaranList.reduce((sum, p) => sum + p.admin, 0);
  const totalPembayaran = totalHakPln + totalAdmin;

  // Filtered transactions
  const filteredList = pembayaranList.filter(p => {
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchQuery = 
      p.pembayaran_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nomor_pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nama_pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ref_bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.periode_tagihan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchQuery;
  });

  const getReconciliationStatus = (trx: Pembayaran) => {
    const recon = rekonsiliasiList.find(r => 
      r.settlement_id.replace('SET', 'TRX') === trx.pembayaran_id ||
      r.ekspektasi === trx.nominal_pln
    );
    return recon ? recon.status_hasil : 'COCOK';
  };

  const handleOpenReceipt = (trx: Pembayaran) => {
    setSelectedTrxId(trx.pembayaran_id);
    setActiveModalTrx(trx);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReceipt = (trx: Pembayaran) => {
    const receiptText = `
=========================================
  STRUK BUKTI PEMBAYARAN TAGIHAN LISTRIK
           PLN PPOB TERPADU
=========================================
No. Transaksi    : ${trx.pembayaran_id}
Ref. Bank        : ${trx.ref_bank}
Waktu            : ${trx.waktu_bayar}
ID Pelanggan     : ${trx.nomor_pelanggan}
Nama Pelanggan   : ${trx.nama_pelanggan}
Periode          : ${trx.periode_tagihan}
-----------------------------------------
Nominal Hak PLN  : ${formatRupiah(trx.nominal_pln)}
Biaya Admin      : ${formatRupiah(trx.admin)}
TOTAL DIBAYAR    : ${formatRupiah(trx.nominal_pln + trx.admin)}
-----------------------------------------
Status Transaksi : SUKSES (LUNAS)
Simpan struk ini sebagai bukti pembayaran sah.
=========================================
    `.trim();

    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendProof = () => {
    setSendStatus('Bukti pembayaran berhasil dikirimkan via SMS/WhatsApp Gateway Pelanggan.');
    setTimeout(() => setSendStatus(null), 4000);
  };

  const handleExportCsv = () => {
    const headers = ['No Transaksi', 'ID Pelanggan', 'Nama Pelanggan', 'Periode', 'Waktu Bayar', 'Hak PLN', 'Biaya Admin', 'Total Bayar', 'Ref Bank', 'Status'];
    const rows = [headers.join(',')];

    pembayaranList.forEach(p => {
      rows.push([
        p.pembayaran_id,
        `"${p.nomor_pelanggan}"`,
        `"${p.nama_pelanggan}"`,
        `"${p.periode_tagihan}"`,
        `"${p.waktu_bayar}"`,
        p.nominal_pln,
        p.admin,
        p.nominal_pln + p.admin,
        p.ref_bank,
        p.status
      ].join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Daftar_Status_Transaksi_PPOB_PLN.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Status Transaksi & Bukti Pembayaran
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            W05–W07 • Daftar status pembayaran pelanggan, referensi bank, dan akses struk bukti bayar sah.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setActivePage('pembayaran')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Bayar Tagihan Baru</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Transaksi Lunas
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {pembayaranList.length} <span className="text-xs font-medium text-slate-500">Transaksi</span>
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Tervalidasi Idempotent</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Hak PLN
          </div>
          <div className="text-2xl font-black text-blue-600 mt-1 font-mono tabular-nums">
            {formatRupiah(totalHakPln)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Pokok tagihan listrik PLN terverifikasi
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Pembayaran Diterima
          </div>
          <div className="text-2xl font-black text-indigo-700 mt-1 font-mono tabular-nums">
            {formatRupiah(totalPembayaran)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Termasuk biaya admin kanal {formatRupiah(totalAdmin)}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari no transaksi, ID pelanggan, nama, atau ref bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Status:
          </span>
          {['ALL', 'SUKSES'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {st === 'ALL' ? 'Semua Transaksi' : 'Sukses Lunas'}
            </button>
          ))}
        </div>
      </div>

      {/* Table List View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 w-40">No. Transaksi</th>
                <th className="px-5 py-3">Pelanggan & Unit</th>
                <th className="px-5 py-3">Periode</th>
                <th className="px-5 py-3 text-right">Hak PLN</th>
                <th className="px-5 py-3 text-right">Admin</th>
                <th className="px-5 py-3 text-right">Total Bayar</th>
                <th className="px-5 py-3 text-center">Status Proses</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length > 0 ? (
                filteredList.map((trx) => {
                  const reconStatus = getReconciliationStatus(trx);
                  const isSelisih = reconStatus === 'SELISIH';
                  const total = trx.nominal_pln + trx.admin;

                  return (
                    <tr 
                      key={trx.pembayaran_id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => handleOpenReceipt(trx)}
                    >
                      {/* No Transaksi & Waktu */}
                      <td className="px-5 py-3.5 align-top">
                        <div className="font-mono font-bold text-blue-700">
                          {trx.pembayaran_id}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-mono">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{trx.waktu_bayar}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Ref: {trx.ref_bank}
                        </div>
                      </td>

                      {/* Pelanggan */}
                      <td className="px-5 py-3.5 align-top">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {trx.nama_pelanggan}
                        </div>
                        <div className="font-mono text-slate-500 text-[11px] mt-0.5">
                          ID: {trx.nomor_pelanggan}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Unit: UPJ Simulasi
                        </div>
                      </td>

                      {/* Periode */}
                      <td className="px-5 py-3.5 align-top font-semibold text-slate-700">
                        {trx.periode_tagihan}
                      </td>

                      {/* Hak PLN */}
                      <td className="px-5 py-3.5 align-top text-right font-mono font-bold text-slate-900">
                        {formatRupiah(trx.nominal_pln)}
                      </td>

                      {/* Admin */}
                      <td className="px-5 py-3.5 align-top text-right font-mono text-slate-600">
                        {formatRupiah(trx.admin)}
                      </td>

                      {/* Total Bayar */}
                      <td className="px-5 py-3.5 align-top text-right font-mono font-black text-blue-700 text-sm">
                        {formatRupiah(total)}
                      </td>

                      {/* Status Proses (4 Tahap Badge) */}
                      <td className="px-5 py-3.5 align-top text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            SUKSES · LUNAS
                          </span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isSelisih 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}>
                            Rekon: {reconStatus}
                          </span>
                        </div>
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-3.5 align-top text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenReceipt(trx)}
                            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                            title="Buka Struk Resmi"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Struk</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTrxId(trx.pembayaran_id);
                              window.print();
                            }}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg transition-colors"
                            title="Cetak Langsung"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-xs text-slate-400">
                    Tidak ada transaksi yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
          <div>
            Menampilkan <strong className="text-slate-900 font-mono">{filteredList.length}</strong> transaksi pembayaran pelanggan
          </div>
          <div className="text-[11px] text-slate-400">
            Klik baris transaksi untuk menampilkan dan mencetak struk resmi PPOB
          </div>
        </div>
      </div>

      {/* Modal Popup Bukti Pembayaran Resmi (Wireframe 09) */}
      {activeModalTrx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  STRUK RESMI PLN PPOB TERPADU
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Bukti Pembayaran Tagihan Listrik
                </h3>
              </div>
              <button
                onClick={() => setActiveModalTrx(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification alert strip */}
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>PEMBAYARAN SUKSES • Ref Bank: <strong>{activeModalTrx.ref_bank}</strong> • No. Transaksi: <strong>{activeModalTrx.pembayaran_id}</strong></span>
              </div>
              <span className="text-[11px] text-emerald-700 bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
                Tervalidasi Idempotent
              </span>
            </div>

            {sendStatus && (
              <div className="p-3 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-medium">
                {sendStatus}
              </div>
            )}

            {/* 2-Column Detail (Left Struk Cetak, Right Status Proses) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Struk Resmi */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <div className="text-[11px] uppercase font-black text-blue-800 tracking-wider">
                      PT PLN (PERSERO)
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      Struk Pembayaran Listrik
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 font-mono">
                    ASLI
                  </div>
                </div>

                <div className="divide-y divide-slate-200/80 text-xs space-y-2.5">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Nomor Pelanggan:</span>
                    <span className="font-mono font-bold text-slate-900">{activeModalTrx.nomor_pelanggan}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Nama Pelanggan:</span>
                    <span className="font-bold text-slate-900">{activeModalTrx.nama_pelanggan}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Periode Tagihan:</span>
                    <span className="font-semibold text-slate-800">{activeModalTrx.periode_tagihan}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Waktu Transaksi:</span>
                    <span className="font-mono text-slate-800">{activeModalTrx.waktu_bayar}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Nominal Hak PLN:</span>
                    <span className="font-mono font-bold text-slate-900">{formatRupiah(activeModalTrx.nominal_pln)}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-500">Biaya Admin Kanal:</span>
                    <span className="font-mono font-semibold text-slate-900">{formatRupiah(activeModalTrx.admin)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-slate-300 font-bold">
                    <span className="text-slate-900">Total Dibayar:</span>
                    <span className="text-lg font-mono font-extrabold text-blue-700">
                      {formatRupiah(activeModalTrx.nominal_pln + activeModalTrx.admin)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 leading-relaxed border-t border-dashed border-slate-200">
                  PLN menyatakan struk ini sebagai bukti pembayaran tagihan listrik yang sah. Harap disimpan dengan baik.
                </div>
              </div>

              {/* Right Column: Status Proses (4 Tahap) */}
              <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-200">
                  Status Proses Sistem
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Pembayaran Bank:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      SUKSES
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Tagihan DPP-UPI:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LUNAS
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Settlement Bank:</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      DITERIMA
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Rekonsiliasi:</span>
                    {getReconciliationStatus(activeModalTrx) === 'SELISIH' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        SELISIH
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        COCOK
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <div className="font-bold text-slate-800">
                    Jika bank belum memberi hasil:
                  </div>
                  <p className="leading-relaxed">
                    Tampilkan MENUNGGU KONFIRMASI. Periksa ulang referensi yang sama; jangan melakukan debit ulang.
                  </p>
                </div>

                <div className="text-[10px] text-slate-400">
                  Bukti pelanggan tidak menyatakan rekonsiliasi kas sudah selesai.
                </div>
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Unduh Bukti</span>
                </button>
                <button
                  onClick={() => handleCopyReceipt(activeModalTrx)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>
                <button
                  onClick={handleSendProof}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kirim Bukti</span>
                </button>
              </div>

              <button
                onClick={() => setActiveModalTrx(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
