import React from 'react';
import { 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const { 
    pembayaranList, 
    mutasiBankList, 
    rekonsiliasiList, 
    kasusSelisihList, 
    setActivePage,
    setSelectedTrxId,
    setSelectedKasusId
  } = usePPOB();

  // Metrics computation
  const totalPembayaranSukses = pembayaranList
    .filter(p => p.status === 'SUKSES')
    .reduce((sum, p) => sum + p.nominal_pln, 0);

  const totalDanaBank = mutasiBankList
    .reduce((sum, m) => sum + m.kredit, 0);

  const selisihPenerimaan = totalDanaBank - totalPembayaranSukses;

  const totalSiapDibukukan = rekonsiliasiList
    .filter(r => r.status_hasil === 'COCOK')
    .reduce((sum, r) => sum + r.aktual, 0);

  const cocokFinalCount = rekonsiliasiList.filter(r => r.status_hasil === 'COCOK').length;
  const selisihCount = rekonsiliasiList.filter(r => r.status_hasil === 'SELISIH').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard penerimaan kas
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Ringkasan bank mitra dan transaksi tanggal 20 Oktober 2026. Data ilustratif.
        </p>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pembayaran sukses
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
              {formatRupiah(totalPembayaranSukses)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{pembayaranList.length} transaksi · hak PLN</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dana bank diterima
            </div>
            <div className="text-2xl font-bold text-sky-900 mt-2 font-mono tabular-nums">
              {formatRupiah(totalDanaBank)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-sky-500"></span>
            <span>{mutasiBankList.length} mutasi receipt bank</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Selisih penerimaan
            </div>
            <div className={`text-2xl font-bold mt-2 font-mono tabular-nums ${selisihPenerimaan < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {formatRupiah(selisihPenerimaan)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${selisihCount > 0 ? 'bg-rose-500' : 'bg-slate-300'}`}></span>
            <span>{selisihCount} kasus perlu ditelusuri</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Siap dibukukan
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono tabular-nums">
              {formatRupiah(totalSiapDibukukan)}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{cocokFinalCount} hasil cocok final</span>
          </div>
        </div>
      </div>

      {/* Antrean Pekerjaan Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Antrean pekerjaan
            </h3>
            <p className="text-xs text-slate-500">
              Daftar status verifikasi transaksi, settlement perbankan, dan hasil rekonsiliasi
            </p>
          </div>
          <button
            onClick={() => setActivePage('pembayaran')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Bayar Tagihan PPOB</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e2a47] text-white text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-3">Referensi</th>
                <th className="px-6 py-3">Pelanggan</th>
                <th className="px-6 py-3">Pembayaran</th>
                <th className="px-6 py-3">Settlement</th>
                <th className="px-6 py-3">Rekonsiliasi</th>
                <th className="px-6 py-3 text-right">Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pembayaranList.map((trx, idx) => {
                const rekon = rekonsiliasiList[idx];
                const isSelisih = rekon?.status_hasil === 'SELISIH';
                const isCocok = rekon?.status_hasil === 'COCOK';

                return (
                  <tr key={trx.pembayaran_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs font-semibold text-sky-800">
                      <button
                        onClick={() => {
                          setSelectedTrxId(trx.pembayaran_id);
                          setActivePage('bukti');
                        }}
                        className="hover:underline flex items-center gap-1"
                      >
                        {trx.pembayaran_id}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-700">
                      <div className="font-medium text-slate-900">{trx.nama_pelanggan}</div>
                      <div className="font-mono text-slate-400 text-[11px]">{trx.nomor_pelanggan}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        <Clock className="w-3 h-3" />
                        DITERIMA
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {isCocok && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          COCOK
                        </span>
                      )}
                      {isSelisih && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                          <AlertTriangle className="w-3 h-3" />
                          SELISIH {formatRupiah(rekon.selisih)}
                        </span>
                      )}
                      {!isCocok && !isSelisih && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          TERTUNDA
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {isCocok && (
                        <button
                          onClick={() => setActivePage('jurnal')}
                          className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline"
                        >
                          Jurnal siap &rarr;
                        </button>
                      )}
                      {isSelisih && (
                        <button
                          onClick={() => {
                            setSelectedKasusId(rekon.kasus_id || 'KAS-001');
                            setActivePage('investigasi');
                          }}
                          className="text-xs font-semibold text-rose-700 hover:text-rose-900 hover:underline flex items-center justify-end gap-1 ml-auto"
                        >
                          Investigasi &rarr;
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActivePage('rekonsiliasi')}
            className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Buka rekonsiliasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setSelectedKasusId('KAS-001');
              setActivePage('investigasi');
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Tinjau kasus selisih</span>
          </button>
          <button
            onClick={() => setActivePage('jurnal')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lihat Jurnal UPJ</span>
          </button>
        </div>
      </div>

      {/* Daily Priority Alert Banner */}
      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-start gap-3">
        <div className="p-1 rounded bg-sky-100 text-sky-700 shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-sky-950">Prioritas hari ini: </span>
          <span>
            {kasusSelisihList.some(k => k.status !== 'SELESAI') 
              ? `selesaikan KAS-001; ${formatRupiah(totalSiapDibukukan)} hasil cocok dapat dibukukan tanpa menunggu kasus lain.` 
              : `Semua kasus selisih telah diselesaikan! Total ${formatRupiah(totalDanaBank)} penerimaan siap diposting ke Buku Besar UPJ.`}
          </span>
        </div>
      </div>

      {/* Information Source Footnote */}
      <div className="text-[11px] text-slate-400">
        Sumber informasi: pembayaran sukses, detail settlement, mutasi bank, dan hasil rekonsiliasi final.
      </div>
    </div>
  );
};
