import React from 'react';
import { UserCheck, RotateCcw, Calendar, Shield } from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { UserRole } from '../../types/ppob';

export const Header: React.FC = () => {
  const { currentRole, setCurrentRole, resetDataToDefault, activePage } = usePPOB();

  const roleLabels: Record<UserRole, { title: string; subtitle: string; color: string }> = {
    PETUGAS_PPOB: { title: 'Petugas PPOB', subtitle: 'Kasir & Validasi Tagihan (W01-W07)', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    KEUANGAN_DISTRIBUSI: { title: 'Keuangan Distribusi', subtitle: 'Settlement & Rekonsiliasi (W06B-W09)', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    SUPERVISOR: { title: 'Supervisor Keuangan', subtitle: 'Otorisasi Koreksi Selisih (W10)', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    AKUNTANSI_UPJ: { title: 'Akuntansi UPJ/APJ', subtitle: 'Pembukuan & Laporan Jurnal (W11)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ADMIN: { title: 'Administrator SIA', subtitle: 'Hak Akses Penuh Sistem & Audit', color: 'bg-slate-100 text-slate-800 border-slate-300' }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Dashboard Penerimaan Kas';
      case 'pembayaran': return 'Pembayaran Tagihan PPOB (08)';
      case 'bukti': return 'Status Transaksi & Bukti Pembayaran (09)';
      case 'settlement': return 'Monitoring Settlement Bank (10)';
      case 'rekonsiliasi': return 'Rekonsiliasi Otomatis (11)';
      case 'investigasi': return 'Investigasi Kasus Selisih (12)';
      case 'jurnal': return 'Jurnal Penerimaan Kas & Laporan (13)';
      case 'workflow': return 'Spesifikasi Workflow To-Be (W01-W11)';
      case 'erd': return 'Diagram Hubungan Entitas (ERD 01 - 03)';
      case 'audit': return 'Audit Log & Jejak Transaksi';
      default: return 'SIA Penerimaan Kas PPOB PLN';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 no-print">
      {/* Left side: Context title */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded border border-sky-100">
          SIA PENERIMAAN KAS / PLN
        </span>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-800">
          {getPageTitle()}
        </span>
      </div>

      {/* Right side: Role selector and time */}
      <div className="flex items-center gap-4">
        {/* Date Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>20 Okt 2026 • WIB</span>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="role-select" className="text-xs text-slate-500 font-medium hidden sm:inline">
            Peran:
          </label>
          <div className="relative">
            <select
              id="role-select"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer transition-colors"
            >
              <option value="PETUGAS_PPOB">Petugas PPOB (W01-W07)</option>
              <option value="KEUANGAN_DISTRIBUSI">Keuangan Distribusi (W08-W09)</option>
              <option value="SUPERVISOR">Supervisor Keuangan (W10)</option>
              <option value="AKUNTANSI_UPJ">Akuntansi UPJ/APJ (W11)</option>
              <option value="ADMIN">Admin Sistem</option>
            </select>
            <Shield className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Active Role Badge */}
        <div className={`hidden md:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${roleLabels[currentRole].color}`}>
          <UserCheck className="w-3.5 h-3.5" />
          <span>{roleLabels[currentRole].title}</span>
        </div>

        {/* Reset Simulation Button */}
        <button
          onClick={() => {
            if (confirm('Kembalikan semua data ke kondisi default awal sesuai rancangan PDF?')) {
              resetDataToDefault();
            }
          }}
          title="Reset simulasi ke data awal"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
