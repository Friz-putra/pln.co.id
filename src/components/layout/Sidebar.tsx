import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  FileCheck2, 
  ArrowLeftRight, 
  Scale, 
  Search, 
  BookOpen, 
  GitMerge, 
  Database, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { usePPOB, PageId } from '../../context/PPOBContext';

interface NavItem {
  id: PageId;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, kasusSelisihList } = usePPOB();

  const openKasusCount = kasusSelisihList.filter(k => k.status !== 'SELESAI').length;

  const primaryNavs: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', sublabel: 'Ringkasan penerimaan', icon: LayoutDashboard },
    { id: 'pembayaran', label: 'Pembayaran', sublabel: '08 Tagihan PPOB', icon: CreditCard },
    { id: 'bukti', label: 'Status Transaksi', sublabel: '09 Bukti bayar', icon: FileCheck2 },
    { id: 'settlement', label: 'Settlement', sublabel: '10 Monitoring bank', icon: ArrowLeftRight },
    { id: 'rekonsiliasi', label: 'Rekonsiliasi', sublabel: '11 Pencocokan W08', icon: Scale },
    { 
      id: 'investigasi', 
      label: 'Investigasi Selisih', 
      sublabel: '12 Kasus KAS-001', 
      icon: Search,
      badge: openKasusCount > 0 ? openKasusCount : undefined
    },
    { id: 'jurnal', label: 'Jurnal & Laporan', sublabel: '13 Pembukuan UPJ/APJ', icon: BookOpen },
  ];

  const secondaryNavs: NavItem[] = [
    { id: 'workflow', label: 'Alur Proses W01-W11', sublabel: 'BPMN To-Be', icon: GitMerge },
    { id: 'erd', label: 'Arsitektur ERD (18 Tabel)', sublabel: 'Struktur Data Logis', icon: Database },
    { id: 'audit', label: 'Jejak Audit Log', sublabel: 'Riwayat Transaksi', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-[#0a2540] text-slate-200 flex flex-col shrink-0 min-h-screen border-r border-[#153456] select-none no-print">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#17375a]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center font-black text-white text-lg tracking-wider shadow-sm">
            ⚡
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">
              PPOB PLN
            </h1>
            <p className="text-[11px] text-sky-200/70 font-medium">
              SIA Kas & Pembukuan UPJ
            </p>
          </div>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-sky-300/60 uppercase">
          Menu Operasional
        </div>
        {primaryNavs.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                isActive
                  ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-600/30'
                  : 'text-slate-300 hover:bg-[#133355] hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-sky-300/80'}`} />
                <span className="truncate text-sm">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white text-sky-700' : 'bg-rose-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-5 px-3 pb-1 text-[10px] font-bold tracking-wider text-sky-300/60 uppercase">
          Dokumentasi & Audit
        </div>
        {secondaryNavs.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-sky-500/20 text-sky-200 border border-sky-400/30 font-semibold'
                  : 'text-slate-400 hover:bg-[#133355] hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-sky-400" />
              <div className="truncate">
                <div>{item.label}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 m-3 rounded-lg bg-[#0e3153]/80 border border-sky-900/40 text-xs text-sky-200/80">
        <div className="flex items-center gap-1.5 text-sky-300 font-semibold mb-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Simulasi Siklus Lengkap</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Dari kasir PPOB, settlement perbankan, rekonsiliasi W08, resolusi selisih KAS-001, hingga jurnal UPJ.
        </p>
      </div>
    </aside>
  );
};
