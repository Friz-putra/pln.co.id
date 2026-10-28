import React, { useState } from 'react';
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
import { PelangganPortalView } from './components/pages/PelangganPortalView';
import { LoginView } from './components/pages/LoginView';

const MainLayout: React.FC = () => {
  const { activePage, currentRole, isAuthenticated } = usePPOB();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f7fb] text-slate-900 font-sans">
      {/* Sidebar with toggle */}
      {sidebarOpen && <Sidebar />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6 lg:p-8">
          {(activePage === 'portal_pelanggan' || (currentRole === 'PELANGGAN' && activePage === 'dashboard')) && (
            <PelangganPortalView />
          )}
          {activePage === 'dashboard' && currentRole !== 'PELANGGAN' && <DashboardView />}
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

        {/* Footer matching reference image */}
        <footer className="px-8 py-5 border-t border-slate-200/70 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 no-print bg-white/50">
          <div className="font-medium">
            SIA PPOB PLN • Prototipe tugas kelompok
          </div>
          <div className="font-medium text-slate-400">
            20 Okt 2026 • WIB
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <PPOBProvider>
      <MainLayout />
    </PPOBProvider>
  );
}
