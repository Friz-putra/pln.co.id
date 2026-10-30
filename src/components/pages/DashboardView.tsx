import React, { useState } from 'react';
import { 
  Layers, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle, 
  ArrowRight,
  Plus, 
  Landmark, 
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  CreditCard,
  UserCheck,
  Search
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const { 
    pembayaranList, 
    mutasiBankList, 
    rekonsiliasiList, 
    kasusSelisihList, 
    currentRole,
    setActivePage,
    setSelectedKasusId,
    approveInvestigation,
    jurnalList,
    postJournals
  } = usePPOB();

  const [activeTab, setActiveTab] = useState<'pembayaran' | 'settlement' | 'rekonsiliasi' | 'jurnal'>('pembayaran');
  const [quickNotice, setQuickNotice] = useState<string | null>(null);

  // Dynamic calculations
  const totalPembayaran = pembayaranList
    .filter(p => p.status === 'SUKSES')
    .reduce((sum, p) => sum + p.nominal_pln, 0);

  const totalDanaReceipt = mutasiBankList
    .reduce((sum, m) => sum + m.kredit, 0);

  const cocokItems = rekonsiliasiList.filter(r => r.status_hasil === 'COCOK');
  const selisihItems = rekonsiliasiList.filter(r => r.status_hasil === 'SELISIH');

  const totalHasilCocok = cocokItems.reduce((sum, r) => sum + r.aktual, 0);
  const totalSelisihAmount = Math.abs(totalDanaReceipt - totalPembayaran);

  const totalTrxCount = pembayaranList.length;
  const cocokCount = cocokItems.length;
  const selisihCount = selisihItems.length;

  const cocokPercentage = totalTrxCount > 0 ? Math.round((cocokCount / totalTrxCount) * 100) : 0;
  const selisihPercentage = totalTrxCount > 0 ? 100 - cocokPercentage : 0;

  // Bar percentage calculations relative to Hak PLN (max)
  const maxBarValue = Math.max(totalPembayaran, 1);
  const pctHakPln = Math.min(100, Math.round((totalPembayaran / maxBarValue) * 100));
  const pctDanaReceipt = Math.min(100, Math.round((totalDanaReceipt / maxBarValue) * 100));
  const pctHasilCocok = Math.min(100, Math.round((totalHasilCocok / maxBarValue) * 100));

  const pendingApprovals = kasusSelisihList.filter(k => k.status === 'DIAJUKAN');
  const readyJournals = jurnalList.filter(j => j.status === 'DRAF');

  const handleQuickApprove = (kasusId: string) => {
    const res = approveInvestigation(kasusId, true, 'Disetujui cepat melalui Dashboard Supervisor.');
    setQuickNotice(res.message);
    setTimeout(() => setQuickNotice(null), 4000);
  };

  const handleQuickPostJournals = () => {
    const ids = readyJournals.map(j => j.jurnal_id);
    const res = postJournals(ids);
    if (res.success) {
      setQuickNotice(`Berhasil memposting ${res.count} jurnal ke Buku Besar UPJ.`);
    } else {
      setQuickNotice(res.error || 'Gagal posting jurnal.');
    }
    setTimeout(() => setQuickNotice(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header with Role Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Dashboard Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Ringkasan penerimaan kas PPOB PLN dan status penyelesaian dana bank.
          </p>
        </div>

        {/* Role Identity Tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Peran: <strong className="text-slate-900">{currentRole.replace(/_/g, ' ')}</strong></span>
          </span>
        </div>
      </div>

      {quickNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{quickNotice}</span>
        </div>
      )}

      {/* Role-Specific Operational Quick Banner */}
      {currentRole === 'PETUGAS_PPOB' && (
        <div className="p-4 bg-sky-50 border border-sky-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-sky-700 shrink-0" />
            <div>
              <span className="font-bold text-sky-950">Mode Kasir Loket PPOB Aktif: </span>
              <span className="text-sky-900">Validasi identitas pelanggan, inquiry tagihan, dan cetak struk resmi pembayaran (W01–W07).</span>
            </div>
          </div>
          <button
            onClick={() => setActivePage('pembayaran')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shrink-0 transition-colors shadow-2xs"
          >
            Buka Loket Pembayaran &rarr;
          </button>
        </div>
      )}

      {currentRole === 'SUPERVISOR' && (
        <div className="p-4 bg-indigo-50 border border-indigo-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0" />
            <div>
              <span className="font-bold text-indigo-950">Mode Supervisor Keuangan: </span>
              <span className="text-indigo-900">
                {pendingApprovals.length > 0 
                  ? `Terdapat ${pendingApprovals.length} usulan selisih kas (${pendingApprovals.map(p => p.kasus_id).join(', ')}) menanti otorisasi Anda (W10).`
                  : 'Semua usulan investigasi selisih kas telah selesai ditinjau.'}
              </span>
            </div>
          </div>
          {pendingApprovals.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleQuickApprove(pendingApprovals[0].kasus_id)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-2xs"
              >
                Setujui {pendingApprovals[0].kasus_id}
              </button>
              <button
                onClick={() => {
                  setSelectedKasusId(pendingApprovals[0].kasus_id);
                  setActivePage('investigasi');
                }}
                className="px-3 py-1.5 bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-100 font-bold rounded-xl transition-colors"
              >
                Review Detail
              </button>
            </div>
          )}
        </div>
      )}

      {currentRole === 'AKUNTANSI_UPJ' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950">Mode Akuntansi UPJ/APJ: </span>
              <span className="text-emerald-900">
                {readyJournals.length > 0 
                  ? `${readyJournals.length} jurnal hasil rekonsiliasi cocok (${formatRupiah(totalHasilCocok)}) siap diposting ke Buku Besar UPJ (W11).`
                  : 'Seluruh jurnal penerimaan kas telah terposting ke Buku Besar.'}
              </span>
            </div>
          </div>
          {readyJournals.length > 0 && (
            <button
              onClick={handleQuickPostJournals}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shrink-0 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>Posting {readyJournals.length} Jurnal</span>
            </button>
          )}
        </div>
      )}

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL PEMBAYARAN */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs px-3.5 py-1 rounded-full font-bold">
              Aktif
            </span>
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL PEMBAYARAN
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {formatRupiah(totalPembayaran)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {totalTrxCount} transaksi sukses
            </div>
          </div>
        </div>

        {/* Card 2: DANA RECEIPT */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs px-3.5 py-1 rounded-full font-bold">
              Dana masuk
            </span>
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              DANA RECEIPT
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {formatRupiah(totalDanaReceipt)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {mutasiBankList.length} mutasi bank tersedia
            </div>
          </div>
        </div>

        {/* Card 3: HASIL REKONSILIASI */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs">
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="bg-blue-50 text-blue-600 text-xs px-3.5 py-1 rounded-full font-bold">
              Siap jurnal
            </span>
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              HASIL REKONSILIASI
            </div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {cocokCount} Cocok
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {formatRupiah(totalHasilCocok)} siap dibukukan
            </div>
          </div>
        </div>

        {/* Card 4: SELISIH PENERIMAAN */}
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-2xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs px-3.5 py-1 rounded-full font-bold">
              Perlu atensi
            </span>
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              SELISIH PENERIMAAN
            </div>
            <div className="text-2xl font-bold text-amber-500 mt-1">
              {formatRupiah(totalSelisihAmount)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              {selisihCount} kasus perlu ditindaklanjuti
            </div>
          </div>
        </div>
      </div>

      {/* Action Button: Mulai rekonsiliasi */}
      <div className="flex justify-end">
        <button
          onClick={() => setActivePage('rekonsiliasi')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 flex items-center gap-2 text-xs transition-colors"
        >
          <span>Mulai rekonsiliasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-xl w-fit">
        <button
          onClick={() => {
            setActiveTab('pembayaran');
            setActivePage('pembayaran');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'pembayaran'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Pembayaran</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('settlement');
            setActivePage('settlement');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'settlement'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Settlement</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('rekonsiliasi');
            setActivePage('rekonsiliasi');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'rekonsiliasi'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Rekonsiliasi</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('jurnal');
            setActivePage('jurnal');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'jurnal'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Jurnal</span>
        </button>
      </div>

      {/* Main 2-Column Split: Left Metrics, Right Horizontal Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3) */}
        <div className="space-y-4">
          {/* Card: TOTAL TRANSAKSI PEMBAYARAN */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              TOTAL TRANSAKSI PEMBAYARAN
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">
                {totalTrxCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Transaksi
              </span>
            </div>
          </div>

          {/* Card: DISTRIBUSI HASIL REKONSILIASI */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              DISTRIBUSI HASIL REKONSILIASI
            </div>

            {/* Progress 1: Cocok */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Cocok
                </span>
                <span className="text-slate-500 font-medium">
                  {cocokCount} transaksi ({cocokPercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${cocokPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Progress 2: Selisih */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Selisih
                </span>
                <span className="text-slate-500 font-medium">
                  {selisihCount} transaksi ({selisihPercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selisihPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: RINGKASAN NILAI PENERIMAAN (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-6">
              RINGKASAN NILAI PENERIMAAN
            </div>

            <div className="space-y-6">
              {/* Row 1: Hak PLN */}
              <div className="flex items-center gap-4">
                <div className="w-24 text-xs font-bold text-slate-700 shrink-0">
                  Hak PLN
                </div>
                <div className="flex-1 bg-slate-100 h-9 rounded-xl overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-xl flex items-center px-4 text-xs font-bold text-white shadow-2xs transition-all duration-500"
                    style={{ width: `${pctHakPln}%` }}
                  >
                    {formatRupiah(totalPembayaran)}
                  </div>
                </div>
              </div>

              {/* Row 2: Dana receipt */}
              <div className="flex items-center gap-4">
                <div className="w-24 text-xs font-bold text-slate-700 shrink-0">
                  Dana receipt
                </div>
                <div className="flex-1 bg-slate-100 h-9 rounded-xl overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-xl flex items-center px-4 text-xs font-bold text-white shadow-2xs transition-all duration-500"
                    style={{ width: `${pctDanaReceipt}%` }}
                  >
                    {formatRupiah(totalDanaReceipt)}
                  </div>
                </div>
              </div>

              {/* Row 3: Hasil cocok */}
              <div className="flex items-center gap-4">
                <div className="w-24 text-xs font-bold text-slate-700 shrink-0">
                  Hasil cocok
                </div>
                <div className="flex-1 bg-slate-100 h-9 rounded-xl overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-xl flex items-center px-4 text-xs font-bold text-white shadow-2xs transition-all duration-500"
                    style={{ width: `${pctHasilCocok}%` }}
                  >
                    {formatRupiah(totalHasilCocok)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-8 pt-4 border-t border-slate-100">
            Satuan rupiah • Data simulasi tanggal 20 Oktober 2026
          </div>
        </div>
      </div>
    </div>
  );
};
