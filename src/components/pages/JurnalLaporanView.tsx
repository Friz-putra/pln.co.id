import React, { useState } from 'react';
import { 
  CheckCircle, 
  Download, 
  FileCheck, 
  AlertCircle, 
  Printer, 
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export const JurnalLaporanView: React.FC = () => {
  const { 
    jurnalList, 
    rekonsiliasiList, 
    postJournals, 
    kasusSelisihList,
    setActivePage,
    setSelectedKasusId
  } = usePPOB();

  const [activeJurnalIndex, setActiveJurnalIndex] = useState(0);
  const [postNotice, setPostNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Ready to post: journals whose settlement is COCOK and status is DRAF
  const readyJournals = jurnalList.filter(j => {
    const rekon = rekonsiliasiList.find(r => r.settlement_id === j.settlement_id);
    return rekon?.status_hasil === 'COCOK' && j.status === 'DRAF';
  });

  const postedJournals = jurnalList.filter(j => j.status === 'POSTED');

  const totalReadyAmount = readyJournals.reduce((sum, j) => sum + j.total_debit, 0);

  const blockedSettlements = rekonsiliasiList.filter(r => r.status_hasil === 'SELISIH');

  const currentPreviewJurnal = jurnalList[activeJurnalIndex] || jurnalList[0];

  const handlePostAllReady = () => {
    if (readyJournals.length === 0) {
      setPostNotice({
        text: 'Tidak ada jurnal draft siap posting.',
        type: 'error'
      });
      return;
    }

    const ids = readyJournals.map(j => j.jurnal_id);
    const res = postJournals(ids);

    if (res.success) {
      setPostNotice({
        text: `Berhasil memposting ${res.count} jurnal ke Buku Besar UPJ (W11). Total debit & kredit seimbang terverifikasi.`,
        type: 'success'
      });
    } else {
      setPostNotice({
        text: res.error || 'Gagal posting jurnal',
        type: 'error'
      });
    }

    setTimeout(() => setPostNotice(null), 5000);
  };

  const handleDownloadCsv = () => {
    const headers = ['ID Jurnal', 'Settlement', 'Tanggal', 'Kode Akun', 'Nama Akun', 'Debit', 'Kredit', 'Status'];
    const rows: string[] = [headers.join(',')];

    jurnalList.forEach(j => {
      j.detail.forEach(d => {
        rows.push([
          j.jurnal_id,
          j.settlement_id,
          j.tanggal,
          d.kode_akun,
          `"${d.nama_akun}"`,
          d.debit,
          d.kredit,
          j.status
        ].join(','));
      });
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Jurnal_Penerimaan_PLN_20261020.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Jurnal penerimaan kas & laporan
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          W11 • Contoh skema sederhana: kas diakui setelah penerimaan dan rekonsiliasi terkonfirmasi.
        </p>
      </div>

      {postNotice && (
        <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
          postNotice.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {postNotice.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{postNotice.text}</span>
        </div>
      )}

      {/* Top Status Notification Banner */}
      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 text-xs font-semibold flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-emerald-700 font-bold">{readyJournals.length} hasil COCOK final</span>
          <span>·</span>
          <span className="text-sky-900 font-bold">{formatRupiah(totalReadyAmount)} siap posting</span>
          {blockedSettlements.length > 0 && (
            <>
              <span>·</span>
              <span className="text-rose-700 font-bold">
                {blockedSettlements.map(b => b.settlement_id).join(', ')} masih diblokir karena kasus selisih.
              </span>
            </>
          )}
        </div>

        {blockedSettlements.length > 0 && (
          <button
            onClick={() => {
              setSelectedKasusId('KAS-001');
              setActivePage('investigasi');
            }}
            className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline flex items-center gap-1"
          >
            <span>Tinjau Kasus Selisih</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Jurnal Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-500 mr-2 shrink-0">Pilih Pratinjau Jurnal:</span>
        {jurnalList.map((j, idx) => (
          <button
            key={j.jurnal_id}
            onClick={() => setActiveJurnalIndex(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              activeJurnalIndex === idx
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {j.jurnal_id} ({j.settlement_id}) {j.status === 'POSTED' ? '✓' : ''}
          </button>
        ))}
      </div>

      {/* Pratinjau Jurnal Table */}
      {currentPreviewJurnal && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pratinjau jurnal • {currentPreviewJurnal.jurnal_id} / {currentPreviewJurnal.settlement_id} • {currentPreviewJurnal.tanggal}
              </h3>
              <p className="text-xs text-slate-500">
                Unit Kerja: {currentPreviewJurnal.unit_id} • Status:{' '}
                <strong className={currentPreviewJurnal.status === 'POSTED' ? 'text-emerald-700' : 'text-sky-700'}>
                  {currentPreviewJurnal.status}
                </strong>
              </p>
            </div>

            <div className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold">
              Keseimbangan: Dr = Cr
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0e2a47] text-white text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3 w-32 font-bold">Kode akun*</th>
                  <th className="px-6 py-3">Nama akun</th>
                  <th className="px-6 py-3 text-right w-44">Debit (Rp)</th>
                  <th className="px-6 py-3 text-right w-44">Kredit (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {currentPreviewJurnal.detail.map((baris) => (
                  <tr key={baris.baris_id} className="hover:bg-slate-50">
                    <td className="px-6 py-3.5 font-bold text-sky-800">
                      {baris.kode_akun}
                    </td>
                    <td className="px-6 py-3.5 text-slate-900 font-medium">
                      {baris.nama_akun}
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-slate-900">
                      {baris.debit > 0 ? formatNumber(baris.debit) : '0'}
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-slate-900">
                      {baris.kredit > 0 ? formatNumber(baris.kredit) : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-xs">
                <tr>
                  <td colSpan={2} className="px-6 py-3 uppercase tracking-wider text-slate-800">
                    TOTAL
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-slate-900 text-sm">
                    {formatNumber(currentPreviewJurnal.total_debit)}
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-slate-900 text-sm">
                    {formatNumber(currentPreviewJurnal.total_kredit)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-200 text-[11px] text-slate-500">
            *Kode akun hanya ilustrasi. JRN-002 untuk SET-002 bernilai sama; total debit dan kredit seimbang.
          </div>
        </div>
      )}

      {/* Kebijakan Pencatatan Callout */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-2">
        <h3 className="text-sm font-bold text-slate-900">
          Kebijakan pencatatan
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Jika piutang telah dikredit saat konfirmasi pembayaran, gunakan akun perantara saat settlement: <strong>Dr Bank / Cr Piutang pada bank mitra</strong>. Hindari pelunasan piutang dua kali. Biaya admin kanal tidak masuk jurnal contoh ini.
        </p>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePostAllReady}
            disabled={readyJournals.length === 0}
            className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Posting {readyJournals.length} jurnal</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Unduh laporan penerimaan (CSV)</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          Syarat: periode terbuka, seimbang, hasil final belum pernah diposting.
        </div>
      </div>
    </div>
  );
};
