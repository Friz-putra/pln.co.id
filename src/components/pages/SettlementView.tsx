import React, { useState } from 'react';
import { 
  RefreshCw, 
  ArrowRight, 
  Building2, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export const SettlementView: React.FC = () => {
  const { 
    settlementList, 
    mutasiBankList, 
    banks, 
    setActivePage,
    setSelectedTrxId
  } = usePPOB();

  const [selectedBank, setSelectedBank] = useState('BANK-SIM');
  const [selectedDate, setSelectedDate] = useState('2026-10-20');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  // Totals calculation
  const totalHakPln = settlementList.reduce((sum, s) => sum + s.nominal_pln, 0);
  const totalDanaMasuk = settlementList.reduce((sum, s) => {
    const mut = mutasiBankList.find(m => m.ref_transfer === s.ref_settlement);
    return sum + (mut ? mut.kredit : 0);
  }, 0);

  const handleRefreshMutasi = () => {
    setIsRefreshing(true);
    setRefreshNotice(null);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshNotice('Sinkronisasi mutasi rekening receipt bank mitra berhasil diperbarui (W06B).');
      setTimeout(() => setRefreshNotice(null), 3500);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Monitoring settlement bank
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          W06B • Satu settlement per transaksi pada simulasi; pola batch didukung oleh tabel detail.
        </p>
      </div>

      {refreshNotice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{refreshNotice}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Bank mitra
            </label>
            <div className="relative">
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {banks.map(b => (
                  <option key={b.bank_id} value={b.kode_bank}>
                    {b.kode_bank} ({b.nama_bank})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Tanggal settlement
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedDate === '2026-10-20' ? '20 Oktober 2026' : selectedDate}
                readOnly
                className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleRefreshMutasi}
              disabled={isRefreshing}
              className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Perbarui mutasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">
            Dana settlement dan mutasi receipt
          </h3>
          <p className="text-xs text-slate-500">
            Pencocokan referensi transfer bank mitra terhadap hak tagihan listrik PLN
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0e2a47] text-white text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Settlement</th>
                <th className="px-6 py-3">Transaksi</th>
                <th className="px-6 py-3 text-right">Hak PLN</th>
                <th className="px-6 py-3 text-right">Dana Masuk</th>
                <th className="px-6 py-3">Ref. Transfer</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {settlementList.map((set) => {
                const mut = mutasiBankList.find(m => m.ref_transfer === set.ref_settlement);
                const danaMasuk = mut ? mut.kredit : 0;
                const hasDiscrepancy = danaMasuk !== set.nominal_pln;

                return (
                  <tr key={set.settlement_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-semibold text-sky-800">
                      {set.settlement_id}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-700">
                      <button
                        onClick={() => {
                          setSelectedTrxId(set.pembayaran_id);
                          setActivePage('bukti');
                        }}
                        className="hover:underline hover:text-sky-700"
                      >
                        {set.pembayaran_id}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900">
                      {formatNumber(set.nominal_pln)}
                    </td>
                    <td className={`px-6 py-3.5 text-right font-mono font-bold ${
                      hasDiscrepancy ? 'text-rose-600 bg-rose-50/50' : 'text-slate-900'
                    }`}>
                      {formatNumber(danaMasuk)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600">
                      {set.ref_settlement}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        {set.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Total Footer Row */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold text-xs">
              <tr>
                <td colSpan={2} className="px-6 py-3 uppercase text-slate-800 tracking-wider">
                  TOTAL
                </td>
                <td className="px-6 py-3 text-right font-mono text-slate-900 text-sm">
                  {formatNumber(totalHakPln)}
                </td>
                <td className="px-6 py-3 text-right font-mono text-sky-900 text-sm">
                  {formatNumber(totalDanaMasuk)}
                </td>
                <td colSpan={2} className="px-6 py-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Note info banner */}
        <div className="p-4 bg-sky-50/60 border-t border-slate-200 text-xs text-slate-600">
          <p className="font-medium text-slate-800">
            <strong>DITERIMA</strong> berarti mutasi bank tersedia. Nominal yang berbeda tetap memerlukan pemeriksaan rekonsiliasi.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setActivePage('rekonsiliasi')}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
        >
          <span>Lanjut ke rekonsiliasi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-[11px] text-slate-400">
          Sumber: SETTLEMENT, DETAIL_SETTLEMENT dan MUTASI_BANK. Data masuk berasal dari integrasi bank.
        </div>
      </div>
    </div>
  );
};
