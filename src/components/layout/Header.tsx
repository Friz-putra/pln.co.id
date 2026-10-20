import React, { useState } from 'react';
import { Menu, Moon, Bell, LogOut, ChevronDown, Check } from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { UserRole } from '../../types/ppob';

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { currentRole, setCurrentRole, resetDataToDefault } = usePPOB();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const roles: { id: UserRole; label: string }[] = [
    { id: 'KEUANGAN_DISTRIBUSI', label: 'Keuangan Distribusi' },
    { id: 'PETUGAS_PPOB', label: 'Petugas PPOB' },
    { id: 'SUPERVISOR', label: 'Supervisor Keuangan' },
    { id: 'AKUNTANSI_UPJ', label: 'Akuntansi UPJ/APJ' },
    { id: 'ADMIN', label: 'Admin Sistem' }
  ];

  const currentRoleLabel = roles.find(r => r.id === currentRole)?.label || 'Keuangan Distribusi';

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 no-print">
      {/* Left: Hamburger menu toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Toggle menu"
        >
          <Menu className="w-4 h-4" />
        </button>
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
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-xs">
              F
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                Friz (Demo)
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <span>{currentRoleLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </button>

          {/* Role selector dropdown */}
          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ganti Peran Akses (RBAC)
              </div>
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setCurrentRole(r.id);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    currentRole === r.id ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{r.label}</span>
                  {currentRole === r.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout button styled like screenshot */}
        <button
          onClick={() => {
            if (confirm('Keluar dari sesi demo atau reset data simulasi?')) {
              resetDataToDefault();
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-500 border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
