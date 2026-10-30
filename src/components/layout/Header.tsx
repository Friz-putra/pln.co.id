import React, { useState } from 'react';
import { Menu, Moon, Bell, LogOut, ChevronDown, Check, User, Shield } from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { UserRole } from '../../types/ppob';

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { currentRole, setCurrentRole, resetDataToDefault, pelangganList, selectedPelangganId, logout, currentUser } = usePPOB();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const activeCustomer = pelangganList.find(p => p.pelanggan_id === selectedPelangganId) || pelangganList[2];

  const roles: { id: UserRole; label: string; badge: string; color: string }[] = [
    { id: 'KEUANGAN_DISTRIBUSI', label: 'Keuangan Distribusi', badge: 'W08 Rekonsiliasi & Kas', color: 'bg-blue-600' },
    { id: 'PETUGAS_PPOB', label: 'Petugas PPOB', badge: 'W01-W07 Kasir & Loket', color: 'bg-sky-600' },
    { id: 'SUPERVISOR', label: 'Supervisor Keuangan', badge: 'W10 Otorisasi & Review', color: 'bg-indigo-600' },
    { id: 'AKUNTANSI_UPJ', label: 'Akuntansi UPJ/APJ', badge: 'W11 Jurnal & Buku Besar', color: 'bg-emerald-600' },
    { id: 'ADMIN', label: 'Admin Sistem', badge: 'Akses Lengkap', color: 'bg-slate-800' },
    { id: 'PELANGGAN', label: 'Pelanggan PLN', badge: 'Portal Layanan Mandiri', color: 'bg-amber-600' }
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];

  const displayName = currentRole === 'PELANGGAN' 
    ? `${activeCustomer.nama}` 
    : (currentUser?.nama_lengkap || 'Friz');

  const displaySubtitle = currentRole === 'PELANGGAN'
    ? `IDPEL: ${activeCustomer.nomor_pelanggan}`
    : currentRoleObj.label;

  const avatarInitial = currentRole === 'PELANGGAN' 
    ? (activeCustomer.nama.charAt(0) || 'P') 
    : (currentUser?.nama_lengkap.charAt(0) || 'F');
  const avatarBg = currentRole === 'PELANGGAN' ? 'bg-amber-600' : 'bg-blue-600';


  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 no-print">
      {/* Left: Hamburger menu toggle & Role context badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Toggle menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Role contextual tag */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
          <Shield className="w-3.5 h-3.5" />
          <span>Role Aktif: {currentRoleObj.label}</span>
        </span>
      </div>

      {/* Right side: Tools & Profile */}
      <div className="flex items-center gap-3">
        {/* Dark Mode toggle icon button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Ganti Tema"
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* Notification Bell with red dot */}
        <button
          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors relative shadow-2xs"
          title="Notifikasi Sistem"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white"></span>
        </button>

        {/* User profile with role dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center font-bold text-white text-sm shadow-xs transition-colors`}>
              {avatarInitial}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
                {displayName}
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <span className="truncate max-w-[130px]">{displaySubtitle}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
            </div>
          </button>

          {/* Role selector dropdown */}
          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30 divide-y divide-slate-100">
              <div className="px-4 py-2">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  GANTI PERAN AKSES (RBAC)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Pilih peran untuk melihat tampilan & otorisasi modul
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setCurrentRole(r.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      currentRole === r.id 
                        ? 'text-blue-700 font-bold bg-blue-50/80' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{r.label}</span>
                        {r.id === 'PELANGGAN' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            Baru
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {r.badge}
                      </div>
                    </div>
                    {currentRole === r.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors shadow-2xs cursor-pointer"
          title="Keluar ke Halaman Login"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
