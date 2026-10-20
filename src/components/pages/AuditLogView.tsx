import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Code2, Clock, UserCheck } from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';

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
      log.correlation_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchEntity && matchQuery;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Jejak Audit Sistem (Audit Log)
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          ERD 03 • Catatan audit append-only untuk integritas akuntansi, pelacakan selisih, dan otorisasi bertingkat.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID transaksi, aktor, atau correlation ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Entitas:</span>
          {['ALL', 'PEMBAYARAN', 'DETAIL_REKONSILIASI', 'KASUS_SELISIH', 'JURNAL'].map(e => (
            <button
              key={e}
              onClick={() => setFilterEntity(e)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterEntity === e
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {e === 'ALL' ? 'Semua' : e}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-200">
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <div key={log.log_id} className="p-5 hover:bg-slate-50 transition-colors space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {log.log_id}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {log.aksi}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-mono">
                      {log.entitas} [{log.entitas_id}]
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {log.waktu}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Aktor: <strong>{log.aktor_sistem}</strong></span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400">
                    Correlation: {log.correlation_id}
                  </div>
                </div>

                {/* State Diff preview if available */}
                {(log.sebelum || log.sesudah) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-[11px] font-mono">
                    {log.sebelum && (
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                          Kondisi Sebelum:
                        </div>
                        <pre className="text-slate-700 whitespace-pre-wrap">
                          {JSON.stringify(log.sebelum, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.sesudah && (
                      <div className="p-2.5 rounded bg-emerald-50/50 border border-emerald-200">
                        <div className="text-[10px] uppercase font-bold text-emerald-800 mb-1">
                          Kondisi Sesudah:
                        </div>
                        <pre className="text-emerald-900 whitespace-pre-wrap">
                          {JSON.stringify(log.sesudah, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Tidak ada log yang cocok dengan kriteria pencarian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
