import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  ArrowRight, 
  FileSpreadsheet, 
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export const RekonsiliasiView: React.FC = () => {
  const { 
    rekonsiliasiList, 
    runReconciliation, 
    setActivePage, 
    setSelectedKasusId,
    kasusSelisihList
  } = usePPOB();

  const [isRunning, setIsRunning] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const cocokList = rekonsiliasiList.filter(r => r.status_hasil === 'COCOK');
  const selisihList = rekonsiliasiList.filter(r => r.status_hasil === 'SELISIH');
  const tertundaList = rekonsiliasiList.filter(r => r.status_hasil === 'TERTUNDA');

  const totalSiapDibukukan = cocokList.reduce((sum, r) => sum + r.aktual, 0);

  const handleRunReconciliation = () => {
    setIsRunning(true);
    setSuccessNotice(null);
    setTimeout(() => {
      runReconciliation('BANK-SIM', '2026-10-20');
      setIsRunning(false);
      setSuccessNotice('Pencocokan algoritma 4-vektor (Bank + Ref Transfer + Tanggal + Nominal) selesai dijalankan.');
      setTimeout(() => setSuccessNotice(null), 4000);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Rekonsiliasi otomatis
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          W08 • Pencocokan bank, referensi, nominal dan tanggal; toleransi contoh Rp0.
        </p>
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Filter / Run Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Bank / rekening receipt
            </label>
            <input
              type="text"
              readOnly
              value="BANK-SIM / 0001234567"
              className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Periode
            </label>
            <input
              type="text"
              readOnly
              value="20 Oktober 2026"
              className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800"
            />
          </div>

          <div>
            <button
              onClick={handleRunReconciliation}
              disabled={isRunning}
              className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
              <span>{isRunning ? 'Mencocokkan...' : 'Jalankan pencocokan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hasil Run Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Hasil run RKN-20261020-01
            </h3>
            <p className="text-xs text-slate-500">
              Detail verifikasi pasangan transfer settlement versus mutasi bank
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
            Toleransi: Rp0
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e2a47] text-white text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Settlement</th>
                <th className="px-5 py-3">Mutasi</th>
                <th className="px-5 py-3 text-right">Ekspektasi</th>
                <th className="px-5 py-3 text-right">Aktual</th>
                <th className="px-5 py-3 text-right">Selisih</th>
                <th className="px-5 py-3 text-center">Hasil</th>
                <th className="px-5 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {rekonsiliasiList.map((row) => {
                const isSelisih = row.status_hasil === 'SELISIH';
                const isCocok = row.status_hasil === 'COCOK';

                return (
                  <tr key={row.hasil_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-sky-800">
                      {row.settlement_id}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700">
                      {row.mutasi_id || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-medium text-slate-900">
                      {formatNumber(row.ekspektasi)}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                      {formatNumber(row.aktual)}
                    </td>
                    <td className={`px-5 py-3.5 text-right font-mono font-bold ${
                      row.selisih < 0 ? 'text-rose-600' : 'text-slate-900'
                    }`}>
                      {row.selisih === 0 ? '0' : formatNumber(row.selisih)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        isCocok 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : isSelisih 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {row.status_hasil}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {isCocok && (
                        <button
                          onClick={() => setActivePage('jurnal')}
                          className="font-medium text-sky-700 hover:text-sky-900 hover:underline"
                        >
                          Siap jurnal
                        </button>
                      )}
                      {isSelisih && (
                        <button
                          onClick={() => {
                            setSelectedKasusId(row.kasus_id || 'KAS-001');
                            setActivePage('investigasi');
                          }}
                          className="font-bold text-rose-700 hover:text-rose-900 hover:underline flex items-center justify-end gap-1 ml-auto"
                        >
                          <span>{row.tindakan}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tally Summary Bar */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-t border-slate-200 text-xs font-semibold text-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-bold">{cocokList.length} cocok</span>
            <span>·</span>
            <span className={selisihList.length > 0 ? 'text-rose-700 font-bold' : 'text-slate-500'}>
              {selisihList.length} selisih
            </span>
            <span>·</span>
            <span className="text-slate-500">{tertundaList.length} tertunda</span>
          </div>

          <div className="text-sky-800 font-mono font-bold">
            {formatRupiah(totalSiapDibukukan)} siap dibukukan
          </div>
        </div>
      </div>

      {/* Discrepancy explanation notice */}
      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 text-xs space-y-1">
        <p className="font-semibold">
          Selisih = aktual - ekspektasi. Nilai negatif menunjukkan kekurangan dana. Hasil selisih diblokir dari posting.
        </p>
      </div>

      {/* Action Footer Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedKasusId('KAS-001');
              setActivePage('investigasi');
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Buka KAS-001</span>
          </button>

          <button
            onClick={() => setActivePage('jurnal')}
            className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Buat jurnal hasil cocok</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          Tanpa pasangan mutasi: TERTUNDA. Mutasi tanpa settlement: TIDAK TERIDENTIFIKASI, lalu investigasi.
        </div>
      </div>
    </div>
  );
};
