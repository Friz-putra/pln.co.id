import React, { useState } from 'react';
import { Menu, Moon, Sun, Bell, LogOut, ChevronDown, Check, Shield } from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { UserRole } from '../../types/ppob';

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    logout, 
    currentUser, 
    users, 
    isDarkMode, 
    toggleDarkMode 
  } = usePPOB();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles: { id: UserRole; label: string; badge: string; color: string }[] = [
    { id: 'KEUANGAN_DISTRIBUSI', label: 'Keuangan Distribusi', badge: 'W08 Rekonsiliasi & Kas', color: 'bg-blue-600' },
    { id: 'PETUGAS_PPOB', label: 'Petugas PPOB', badge: 'W01-W07 Kasir & Loket', color: 'bg-sky-600' },
    { id: 'SUPERVISOR', label: 'Supervisor Keuangan', badge: 'W10 Otorisasi & Review', color: 'bg-indigo-600' },
    { id: 'AKUNTANSI_UPJ', label: 'Akuntansi UPJ/APJ', badge: 'W11 Jurnal & Buku Besar', color: 'bg-emerald-600' },
    { id: 'ADMIN', label: 'Admin Sistem', badge: 'Akses Lengkap', color: 'bg-slate-800' },
    { id: 'PELANGGAN', label: 'Pelanggan PLN', badge: 'Portal Layanan Mandiri', color: 'bg-amber-600' }
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];

  const canonicalNameMap: Record<UserRole, string> = {
    PETUGAS_PPOB: 'Ivan',
    KEUANGAN_DISTRIBUSI: 'Valda',
    SUPERVISOR: 'Khurin',
    AKUNTANSI_UPJ: 'Levina',
    PELANGGAN: 'Friz',
    ADMIN: 'Admin'
  };

  const displayName = (currentUser?.role === currentRole && currentUser?.nama_lengkap)
    ? currentUser.nama_lengkap
    : (users.find(u => u.role === currentRole)?.nama_lengkap || canonicalNameMap[currentRole] || 'Admin');

  const displaySubtitle = currentRoleObj.label;

  const avatarInitial = (displayName.charAt(0) || 'U').toUpperCase();
  const avatarBg = currentRole === 'PELANGGAN' ? 'bg-amber-600' : 'bg-blue-600';

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 no-print transition-colors">
      {/* Left: Hamburger menu toggle & Role context badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          title="Toggle menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Role contextual tag */}
        <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
          <Shield className="w-3.5 h-3.5" />
          <span>Role Aktif: {currentRoleObj.label}</span>
        </span>
      </div>

      {/* Right side: Tools & Profile */}
      <div className="flex items-center gap-3">
        {/* Dark Mode toggle icon button */}
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs cursor-pointer"
          title={isDarkMode ? "Beralih ke Mode Terang (Light Mode)" : "Beralih ke Mode Gelap (Dark Mode)"}
          aria-label={isDarkMode ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in fade-in zoom-in-75 duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 animate-in fade-in zoom-in-75 duration-200" />
          )}
        </button>

        {/* Notification Bell with red dot */}
        <button
          className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative shadow-2xs cursor-pointer"
          title="Notifikasi Sistem"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900"></span>
        </button>

        {/* User profile with role dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
          >
            <div className={`w-9 h-9 rounded-full ${avatarBg} flex items-center justify-center font-bold text-white text-sm shadow-xs transition-colors`}>
              {avatarInitial}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[140px]">
                {displayName}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <span className="truncate max-w-[130px]">{displaySubtitle}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
            </div>
          </button>

          {/* Role selector dropdown */}
          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-30 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="px-4 py-2">
                <div className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  GANTI PERAN AKSES (RBAC)
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
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
                        ? 'text-blue-700 dark:text-blue-300 font-bold bg-blue-50/80 dark:bg-blue-950/60' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{r.label}</span>
                        {r.id === 'PELANGGAN' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            Baru
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal mt-0.5">
                        {r.badge}
                      </div>
                    </div>
                    {currentRole === r.id && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shadow-2xs cursor-pointer"
          title="Keluar ke Halaman Login"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
