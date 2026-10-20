import React, { useState } from 'react';
import { 
  Printer, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Share2, 
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah } from '../../utils/formatters';

export const StatusBuktiView: React.FC = () => {
  const { 
    pembayaranList, 
    selectedTrxId, 
    setSelectedTrxId, 
    rekonsiliasiList,
    setActivePage
  } = usePPOB();

  const [copied, setCopied] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  // Active transaction
  const activeTrx = pembayaranList.find(p => p.pembayaran_id === selectedTrxId) || pembayaranList[pembayaranList.length - 1];
  
  // Find matching reconciliation
  const activeRecon = rekonsiliasiList.find(r => r.settlement_id.replace('SET', 'TRX') === activeTrx?.pembayaran_id || r.ekspektasi === activeTrx?.nominal_pln);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReceipt = () => {
    if (!activeTrx) return;
    const receiptText = `
=========================================
  STRUK BUKTI PEMBAYARAN TAGIHAN LISTRIK
           PLN PPOB TERPADU
=========================================
No. Transaksi    : ${activeTrx.pembayaran_id}
Ref. Bank        : ${activeTrx.ref_bank}
Waktu            : ${activeTrx.waktu_bayar}
ID Pelanggan     : ${activeTrx.nomor_pelanggan}
Nama Pelanggan   : ${activeTrx.nama_pelanggan}
Periode          : ${activeTrx.periode_tagihan}
-----------------------------------------
Nominal Hak PLN  : ${formatRupiah(activeTrx.nominal_pln)}
Biaya Admin      : ${formatRupiah(activeTrx.admin)}
TOTAL DIBAYAR    : ${formatRupiah(activeTrx.nominal_pln + activeTrx.admin)}
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

  if (!activeTrx) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
        <p className="text-slate-500">Belum ada transaksi pembayaran yang dipilih.</p>
        <button
          onClick={() => setActivePage('pembayaran')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold"
        >
          Buka Pembayaran PPOB
        </button>
      </div>
    );
  }

  const isSelisih = activeRecon?.status_hasil === 'SELISIH';
  const totalDibayar = activeTrx.nominal_pln + activeTrx.admin;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Selector Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Status transaksi & bukti pembayaran
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            W05–W07 • Status pembayaran dipisahkan dari status dana bank.
          </p>
        </div>

        {/* Transaction switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-600">Pilih Transaksi:</label>
          <select
            value={activeTrx.pembayaran_id}
            onChange={(e) => setSelectedTrxId(e.target.value)}
            className="text-xs font-mono font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {pembayaranList.map(p => (
              <option key={p.pembayaran_id} value={p.pembayaran_id}>
                {p.pembayaran_id} - {p.nama_pelanggan} ({p.nomor_pelanggan})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Success Notification Bar */}
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold tracking-wider">PEMBAYARAN SUKSES</span>
          <span className="text-emerald-400">·</span>
          <span>Referensi bank: <strong className="text-emerald-950">{activeTrx.ref_bank}</strong></span>
          <span className="text-emerald-400">·</span>
          <span>Nomor transaksi: <strong className="text-emerald-950">{activeTrx.pembayaran_id}</strong></span>
        </div>

        <span className="text-[11px] text-emerald-700 bg-white/70 px-2.5 py-0.5 rounded border border-emerald-200">
          Tervalidasi Idempotent
        </span>
      </div>

      {sendStatus && (
        <div className="p-3 bg-sky-50 text-sky-800 border border-sky-200 rounded-lg text-xs font-medium no-print">
          {sendStatus}
        </div>
      )}

      {/* Main 2-Column Layout: Left Bukti Pembayaran, Right Status Proses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Bukti Pembayaran Listrik (Struk Cetak) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs uppercase font-extrabold text-sky-800 tracking-wider">
                PT PLN (Persero)
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Bukti pembayaran listrik
              </h3>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono">
              STRUK RESMI PPOB
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs py-4 space-y-3">
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Nomor pelanggan</span>
              <span className="font-mono font-semibold text-slate-900">
                {activeTrx.nomor_pelanggan}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Nama</span>
              <span className="font-semibold text-slate-900">
                {activeTrx.nama_pelanggan}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Periode tagihan</span>
              <span className="font-semibold text-slate-900">
                {activeTrx.periode_tagihan}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Waktu transaksi</span>
              <span className="font-mono text-slate-800">
                {activeTrx.waktu_bayar}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Nominal hak PLN</span>
              <span className="font-mono font-bold text-slate-900">
                {formatRupiah(activeTrx.nominal_pln)}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-slate-500">Biaya admin kanal</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatRupiah(activeTrx.admin)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t-2 border-slate-200">
              <span className="font-bold text-slate-900">Total dibayar</span>
              <span className="text-lg font-mono font-extrabold text-sky-700">
                {formatRupiah(totalDibayar)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-dashed border-slate-200 text-[11px] text-slate-400 leading-relaxed">
            PLN menyatakan struk ini sebagai bukti pembayaran tagihan listrik yang sah. Harap disimpan dengan baik.
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / unduh bukti</span>
            </button>
            <button
              onClick={handleCopyReceipt}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin teks'}</span>
            </button>
            <button
              onClick={handleSendProof}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-sky-600" />
              <span>Kirim bukti</span>
            </button>
          </div>
        </div>

        {/* Right: Status Proses (4 Status stages) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Status proses
            </h3>

            <div className="py-4 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Pembayaran bank</span>
                <span className="px-3 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SUKSES
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Tagihan DPP-UPI</span>
                <span className="px-3 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  LUNAS
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Settlement bank</span>
                <span className="px-3 py-1 rounded text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  DITERIMA
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Rekonsiliasi</span>
                {isSelisih ? (
                  <span className="px-3 py-1 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    SELISIH
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    COCOK
                  </span>
                )}
              </div>
            </div>

            {/* If bank hasn't sent result advisory */}
            <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-slate-900">
                Jika bank belum memberi hasil
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tampilkan MENUNGGU KONFIRMASI. Periksa ulang referensi yang sama; jangan melakukan debit ulang.
              </p>
            </div>

            <div className="mt-4 text-[11px] text-slate-400">
              Bukti pelanggan tidak menyatakan rekonsiliasi kas sudah selesai.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
