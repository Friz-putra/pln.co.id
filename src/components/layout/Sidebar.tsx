import React, { useState } from 'react';
import { 
  LayoutGrid, 
  FileText, 
  CreditCard, 
  Landmark, 
  RefreshCw, 
  ShieldAlert, 
  BookOpen, 
  ShieldCheck,
  Search,
  Zap,
  Clock,
  UserCheck,
  Users
} from 'lucide-react';
import { usePPOB, PageId } from '../../context/PPOBContext';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, kasusSelisihList, currentRole } = usePPOB();
  const [searchQuery, setSearchQuery] = useState('');

  const openKasusCount = kasusSelisihList.filter(k => k.status !== 'SELESAI').length;

  // Navigation for Staff roles
  const commandNavs: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutGrid },
    { id: 'bukti', label: 'Status transaksi', icon: FileText },
  ];

  const penerimaanNavs: NavItem[] = [
    { id: 'pembayaran', label: 'Pembayaran tagihan', icon: CreditCard },
    { id: 'settlement', label: 'Settlement bank', icon: Landmark },
    { id: 'rekonsiliasi', label: 'Rekonsiliasi', icon: RefreshCw },
    { 
      id: 'investigasi', 
      label: 'Investigasi selisih', 
      icon: ShieldAlert,
      badge: openKasusCount > 0 ? openKasusCount : undefined
    },
  ];

  const akuntansiNavs: NavItem[] = [
    { id: 'jurnal', label: 'Jurnal dan laporan', icon: BookOpen },
    { id: 'audit', label: 'Audit log', icon: ShieldCheck },
    { id: 'user_management', label: 'User Management', icon: Users },
  ];


  // Navigation for Customer role (PELANGGAN)
  const pelangganCommandNavs: NavItem[] = [
    { id: 'portal_pelanggan', label: 'Portal Pelanggan', icon: LayoutGrid },
    { id: 'bukti', label: 'Struk & Bukti Resmi', icon: FileText },
  ];

  const pelangganLayananNavs: NavItem[] = [
    { id: 'pembayaran', label: 'Bayar Tagihan PPOB', icon: CreditCard },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="space-y-1">
      <div className="px-3 pb-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        {title}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-150 ${
              isActive
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </div>
            {item.badge !== undefined && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white text-blue-700' : 'bg-rose-500 text-white'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 min-h-screen select-none no-print">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm tracking-tight shadow-sm shadow-blue-500/30">
            PP
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
              PPOB PLN
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {currentRole === 'PELANGGAN' ? 'PORTAL PELANGGAN' : 'PENERIMAAN KAS'}
            </p>
          </div>
        </div>
      </div>

      {/* Search Input with ⌘K */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 transition-all placeholder:text-slate-400"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Nav groups based on active role */}
      <div className="flex-1 px-3 py-3 space-y-6 overflow-y-auto">
        {currentRole === 'PELANGGAN' ? (
          <>
            {renderNavGroup('MENU PELANGGAN', pelangganCommandNavs)}
            {renderNavGroup('LAYANAN MANDIRI', pelangganLayananNavs)}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>PLN 123 Siap Melayani</span>
              </div>
              <p className="text-[11px] text-amber-700/80 leading-relaxed">
                Layanan informasi gangguan, pengaduan kWh meter, dan pasang baru 24 jam.
              </p>
            </div>
          </>
        ) : (
          <>
            {renderNavGroup('COMMAND', commandNavs)}
            {renderNavGroup('PENERIMAAN KAS', penerimaanNavs)}
            {renderNavGroup('AKUNTANSI', akuntansiNavs)}
          </>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          WORKSPACE
        </div>
        <div className="text-xs font-semibold text-slate-600">
          {currentRole === 'PELANGGAN' ? 'Portal Mandiri Pelanggan' : 'Simulasi akademis MTSIA'}
        </div>
      </div>
    </aside>
  );
};
