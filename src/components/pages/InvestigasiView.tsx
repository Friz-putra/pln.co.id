import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Send, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah } from '../../utils/formatters';

export const InvestigasiView: React.FC = () => {
  const { 
    kasusSelisihList, 
    selectedKasusId, 
    currentRole, 
    approveInvestigation, 
    completeDiscrepancyTransfer,
    updateKasusProposal,
    setActivePage
  } = usePPOB();

  const activeKasus = kasusSelisihList.find(k => k.kasus_id === selectedKasusId) || kasusSelisihList[0];

  const [editPenyebab, setEditPenyebab] = useState(activeKasus?.penyebab || '');
  const [editUsulan, setEditUsulan] = useState(activeKasus?.usulan || '');
  const [actionNotice, setActionNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!activeKasus) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
        <p className="text-slate-500">Tidak ada kasus selisih yang ditemukan.</p>
        <button
          onClick={() => setActivePage('rekonsiliasi')}
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold"
        >
          Kembali ke Rekonsiliasi
        </button>
      </div>
    );
  }

  const isSupervisorOrAdmin = currentRole === 'SUPERVISOR' || currentRole === 'ADMIN';

  const handleApprove = () => {
    const res = approveInvestigation(activeKasus.kasus_id, true);
    setActionNotice({
      text: res.message,
      type: res.success ? 'success' : 'error'
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleReject = () => {
    const res = approveInvestigation(activeKasus.kasus_id, false);
    setActionNotice({
      text: res.message,
      type: res.success ? 'success' : 'error'
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleSimulateBankSettlement = () => {
    const res = completeDiscrepancyTransfer(activeKasus.kasus_id);
    setActionNotice({
      text: res.message,
      type: res.success ? 'success' : 'error'
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleSaveProposal = () => {
    updateKasusProposal(activeKasus.kasus_id, editPenyebab, editUsulan);
    setActionNotice({
      text: 'Usulan koreksi berhasil diperbarui & status diubah menjadi DIAJUKAN.',
      type: 'success'
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Investigasi selisih • {activeKasus.kasus_id}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          W09–W10 • Pembuat: Keuangan Distribusi • Penyetuju: Supervisor yang berbeda.
        </p>
      </div>

      {/* Discrepancy Highlight Header Strip */}
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs font-semibold flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{activeKasus.settlement_id} / {activeKasus.mutasi_id}</span>
          <span className="text-rose-400">·</span>
          <span>Ekspektasi {formatRupiah(activeKasus.ekspektasi)}</span>
          <span className="text-rose-400">·</span>
          <span>Aktual {formatRupiah(activeKasus.aktual)}</span>
          <span className="text-rose-400">·</span>
          <span className="text-rose-700 font-bold">
            {activeKasus.kekurangan > 0 ? `Kekurangan ${formatRupiah(activeKasus.kekurangan)}` : 'Selisih Rp0 (Terselesaikan)'}
          </span>
        </div>

        <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
          activeKasus.status === 'SELESAI'
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            : activeKasus.status === 'DISETUJUI'
            ? 'bg-blue-100 text-blue-800 border border-blue-300'
            : 'bg-amber-100 text-amber-800 border border-amber-300'
        }`}>
          STATUS: {activeKasus.status}
        </span>
      </div>

      {actionNotice && (
        <div className={`p-3.5 rounded-lg text-xs font-medium border flex items-center gap-2 ${
          actionNotice.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {actionNotice.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{actionNotice.text}</span>
        </div>
      )}

      {/* Main 2-Column Split: Left Investigation Form, Right Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Penelusuran & Usulan Koreksi */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Penelusuran dan usulan koreksi
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Penyebab sementara
            </label>
            <input
              type="text"
              value={editPenyebab}
              onChange={(e) => setEditPenyebab(e.target.value)}
              disabled={activeKasus.status === 'SELESAI'}
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Bukti pendukung
            </label>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <FileText className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-mono text-slate-700 font-medium">{activeKasus.bukti_uri}</span>
              <button
                onClick={() => alert(`Membuka lampiran bukti: ${activeKasus.bukti_uri}\nKonfirmasi transfer parsial dari bank mitra aggregator.`)}
                className="ml-auto text-[11px] text-sky-700 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Lihat file</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Usulan tindak lanjut
            </label>
            <textarea
              rows={3}
              value={editUsulan}
              onChange={(e) => setEditUsulan(e.target.value)}
              disabled={activeKasus.status === 'SELESAI'}
              className="w-full text-xs p-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 leading-relaxed"
            />
          </div>

          {activeKasus.status !== 'SELESAI' && currentRole === 'KEUANGAN_DISTRIBUSI' && (
            <button
              onClick={handleSaveProposal}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Simpan Perubahan Usulan
            </button>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div>
              Status kasus: <strong className="text-slate-900">{activeKasus.status}</strong>
            </div>
            <div>
              Pembuat: <strong className="text-slate-900">{activeKasus.pembuat_nama}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Jejak Tindak Lanjut (Timeline) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Jejak tindak lanjut
            </h3>

            <div className="py-4 space-y-4 text-xs">
              {activeKasus.riwayat.map((step, idx) => (
                <div key={idx} className="relative pl-5 border-l-2 border-sky-200 space-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500 absolute -left-[6px] top-1"></div>
                  <div className="font-bold text-slate-900 font-mono">
                    {step.waktu} · {step.aktor}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {step.keterangan}
                  </p>
                </div>
              ))}

              {activeKasus.status === 'DIAJUKAN' && (
                <div className="relative pl-5 border-l-2 border-amber-300 space-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 absolute -left-[6px] top-1"></div>
                  <div className="font-bold text-amber-900">
                    Menunggu supervisor
                  </div>
                  <p className="text-slate-500">
                    Review bukti dan kelengkapan otorisasi.
                  </p>
                </div>
              )}

              {activeKasus.status === 'DISETUJUI' && (
                <div className="relative pl-5 border-l-2 border-emerald-300 space-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[6px] top-1"></div>
                  <div className="font-bold text-emerald-900">
                    Setelah disetujui
                  </div>
                  <p className="text-slate-600">
                    Pelengkapan dana bank → cocokkan ulang rekonsiliasi.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Pemisahan tugas (Segregation of Duties): Pembuat usulan tidak dapat mengesahkan persetujuan sendiri.
          </div>
        </div>
      </div>

      {/* Action Footer & Segregation of Duties Check */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {activeKasus.status !== 'SELESAI' && (
              <>
                <button
                  onClick={handleApprove}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Setujui tindak lanjut</span>
                </button>

                <button
                  onClick={handleReject}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                >
                  Kembalikan untuk revisi
                </button>
              </>
            )}

            {/* End-to-End Simulation of Bank Resolving the Missing 50.000 */}
            {activeKasus.status !== 'SELESAI' && (
              <button
                onClick={handleSimulateBankSettlement}
                className="px-4 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                title="Simulasi bank mengirim sisa Rp50.000 sehingga rekonsiliasi menjadi cocok"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulasi Pelengkapan Transfer Bank (+Rp50.000)</span>
              </button>
            )}

            {activeKasus.status === 'SELESAI' && (
              <button
                onClick={() => setActivePage('jurnal')}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Lihat Jurnal Pembukuan Tersedia</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Persetujuan tidak mengubah SELISIH menjadi COCOK otomatis.
          </div>
        </div>

        {!isSupervisorOrAdmin && activeKasus.status !== 'SELESAI' && (
          <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            💡 <em>Catatan Otorisasi:</em> Anda sedang menggunakan peran <strong>{currentRole}</strong>. Tombol &quot;Setujui tindak lanjut&quot; memerlukan peran <strong>SUPERVISOR</strong> atau <strong>ADMIN</strong>. Anda dapat mengganti peran sewaktu-waktu di pojok kanan atas.
          </p>
        )}
      </div>
    </div>
  );
};
