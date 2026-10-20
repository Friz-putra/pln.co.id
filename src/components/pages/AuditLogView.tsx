import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  UserCheck, 
  CreditCard, 
  RefreshCw, 
  FileCheck, 
  AlertTriangle,
  Download,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { AuditLog } from '../../types/ppob';
import { formatRupiah } from '../../utils/formatters';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = usePPOB();
  const [filterEntity, setFilterEntity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = auditLogs.filter(log => {
    const matchEntity = filterEntity === 'ALL' || log.entitas === filterEntity;
    const matchQuery = 
      log.entitas_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.aksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.aktor_sistem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.correlation_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.log_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchEntity && matchQuery;
  });

  const formatActionTitle = (aksi: string): string => {
    return aksi.replace(/_/g, ' ');
  };

  const getEntityBadgeStyle = (entitas: string) => {
    switch (entitas) {
      case 'PEMBAYARAN':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DETAIL_REKONSILIASI':
      case 'REKONSILIASI':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'KASUS_SELISIH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'JURNAL':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatAuditSummary = (log: AuditLog): string => {
    if (log.aksi === 'PEMBAYARAN_SUKSES' || log.aksi === 'TRANSAKSI_LUNAS_TERVERIFIKASI') {
      const nominal = log.sesudah?.nominal_pln 
        ? formatRupiah(Number(log.sesudah.nominal_pln)) 
        : 'Rp450.000';
      const ref = log.sesudah?.ref_bank || 'BNK';
      return `Pembayaran tervalidasi sukses (${nominal}) · Referensi Bank: ${ref}`;
    }
    if (log.aksi === 'JALANKAN_PENCOCOKAN_OTOMATIS') {
      const total = log.sesudah?.total_items ?? 3;
      const matched = log.sesudah?.matched ?? 2;
      return `Pencocokan 4-vektor dijalankan · ${matched} dari ${total} transaksi berstatus COCOK`;
    }
    if (log.aksi === 'DETEKSI_SELISIH') {
      const selisih = log.sesudah?.selisih ? formatRupiah(Number(log.sesudah.selisih)) : '-Rp50.000';
      return `Selisih dana penerimaan terdeteksi (${selisih}) · Kasus KAS-001 dibuat otomatis`;
    }
    if (log.aksi === 'PENGAJUAN_USULAN_KOREKSI') {
      return 'Bukti transfer konfirmasi diunggah & usulan tindak lanjut diajukan ke Supervisor';
    }
    if (log.aksi === 'PERSETUJUAN_USULAN_SELESAI') {
      return 'Otorisasi disetujui Supervisor Keuangan · Menunggu pelunasan transfer bank mitra';
    }
    if (log.aksi === 'REVISI_USULAN_DIMINTA') {
      return 'Usulan investigasi dikembalikan ke Petugas Keuangan untuk perbaikan verifikasi';
    }
    if (log.aksi === 'PELUNASAN_DANA_DAN_RESOLUSI_KASUS') {
      return 'Pelengkapan dana transfer (+Rp50.000) diterima · Rekonsiliasi COCOK · Kasus selesai ditutup';
    }
    if (log.aksi === 'POSTING_JURNAL_KE_BUKU_BESAR') {
      const count = log.sesudah?.posted_count || 2;
      return `${count} Jurnal penerimaan kas seimbang (Debit = Kredit) berhasil diposting ke Buku Besar UPJ`;
    }

    if (log.sesudah && typeof log.sesudah === 'object') {
      return Object.entries(log.sesudah)
        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
        .join(' · ');
    }
    return 'Catatan audit transaksi terdaftar';
  };

  const handleDownloadAuditCsv = () => {
    const headers = ['ID Log', 'Waktu', 'Aksi', 'Entitas', 'ID Entitas', 'Aktor', 'Keterangan', 'Correlation ID'];
    const rows = [headers.join(',')];

    filteredLogs.forEach(l => {
      rows.push([
        l.log_id,
        `"${l.waktu}"`,
        `"${formatActionTitle(l.aksi)}"`,
        l.entitas,
        l.entitas_id,
        `"${l.aktor_sistem}"`,
        `"${formatAuditSummary(l).replace(/"/g, '""')}"`,
        l.correlation_id
      ].join(','));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Audit_Log_PPOB_PLN_20261020.csv`);
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
            Audit Log
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            ERD 03 • Catatan audit append-only untuk integritas akuntansi, pelacakan selisih, dan otorisasi bertingkat.
          </p>
        </div>

        <button
          onClick={handleDownloadAuditCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Export Audit (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID log, transaksi, aktor, atau correlation ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Entity Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mr-1">
            Entitas:
          </span>
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'PEMBAYARAN', label: 'Pembayaran' },
            { id: 'DETAIL_REKONSILIASI', label: 'Rekonsiliasi' },
            { id: 'KASUS_SELISIH', label: 'Kasus Selisih' },
            { id: 'JURNAL', label: 'Jurnal' }
          ].map(e => (
            <button
              key={e.id}
              onClick={() => setFilterEntity(e.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                filterEntity === e.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Structured List / Table View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 w-44">Waktu & ID</th>
                <th className="px-5 py-3 w-52">Aktivitas / Aksi</th>
                <th className="px-5 py-3 w-44">Entitas & Ref</th>
                <th className="px-5 py-3 w-48">Aktor Pelaksana</th>
                <th className="px-5 py-3">Rincian Perubahan</th>
                <th className="px-5 py-3 w-40 text-right">Correlation ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const summaryText = formatAuditSummary(log);
                  const badgeClass = getEntityBadgeStyle(log.entitas);

                  return (
                    <tr key={log.log_id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Waktu & ID */}
                      <td className="px-5 py-3.5 align-top">
                        <div className="font-mono font-bold text-blue-700">
                          {log.log_id}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-mono">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{log.waktu}</span>
                        </div>
                      </td>

                      {/* Aktivitas / Aksi */}
                      <td className="px-5 py-3.5 align-top">
                        <div className="font-bold text-slate-900 leading-tight">
                          {formatActionTitle(log.aksi)}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeClass}`}>
                            {log.entitas}
                          </span>
                        </div>
                      </td>

                      {/* Entitas & Ref */}
                      <td className="px-5 py-3.5 align-top">
                        <div className="font-mono font-bold text-slate-800">
                          {log.entitas_id}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Tabel: {log.entitas}
                        </div>
                      </td>

                      {/* Aktor Pelaksana */}
                      <td className="px-5 py-3.5 align-top">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{log.aktor_sistem}</span>
                        </div>
                      </td>

                      {/* Rincian Keterangan (Clean List text, NO CODE!) */}
                      <td className="px-5 py-3.5 align-top">
                        <div className="text-slate-700 leading-relaxed font-medium">
                          {summaryText}
                        </div>
                      </td>

                      {/* Correlation ID */}
                      <td className="px-5 py-3.5 align-top text-right font-mono text-[11px] text-slate-400">
                        {log.correlation_id}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-400">
                    Tidak ada catatan audit yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-between">
          <div>
            Menampilkan <strong className="text-slate-900 font-mono">{filteredLogs.length}</strong> catatan log audit append-only
          </div>
          <div className="text-[11px] text-slate-400">
            Jaminan Integritas: Log tidak dapat dimanipulasi atau dihapus
          </div>
        </div>
      </div>
    </div>
  );
};
