import React from 'react';
import { PPOBProvider, usePPOB } from './context/PPOBContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/pages/DashboardView';
import { PembayaranView } from './components/pages/PembayaranView';
import { StatusBuktiView } from './components/pages/StatusBuktiView';
import { SettlementView } from './components/pages/SettlementView';
import { RekonsiliasiView } from './components/pages/RekonsiliasiView';
import { InvestigasiView } from './components/pages/InvestigasiView';
import { JurnalLaporanView } from './components/pages/JurnalLaporanView';
import { WorkflowView } from './components/pages/WorkflowView';
import { ErdView } from './components/pages/ErdView';
import { AuditLogView } from './components/pages/AuditLogView';

const MainContent: React.FC = () => {
  const { activePage } = usePPOB();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-y-auto">
      <Header />
      <main className="flex-1 p-6 lg:p-8">
        {activePage === 'dashboard' && <DashboardView />}
        {activePage === 'pembayaran' && <PembayaranView />}
        {activePage === 'bukti' && <StatusBuktiView />}
        {activePage === 'settlement' && <SettlementView />}
        {activePage === 'rekonsiliasi' && <RekonsiliasiView />}
        {activePage === 'investigasi' && <InvestigasiView />}
        {activePage === 'jurnal' && <JurnalLaporanView />}
        {activePage === 'workflow' && <WorkflowView />}
        {activePage === 'erd' && <ErdView />}
        {activePage === 'audit' && <AuditLogView />}
      </main>
      <footer className="px-8 py-4 border-t border-slate-200 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 no-print bg-white/70">
        <div>
          Rancangan akademis To-Be • Data ilustratif • Bukan spesifikasi resmi sistem produksi PLN
        </div>
        <div className="font-mono text-[11px] text-slate-400">
          SIA-PPOB-PLN • Siklus Pendapatan & Penerimaan Kas Listrik
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <PPOBProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
        <Sidebar />
        <MainContent />
      </div>
    </PPOBProvider>
  );
}
