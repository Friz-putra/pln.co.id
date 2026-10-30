import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { UserRole } from '../../types/ppob';

export const LoginView: React.FC = () => {
  const { login } = usePPOB();

  const [username, setUsername] = useState('petugas');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('PETUGAS_PPOB');
  const [isLoading, setIsLoading] = useState(false);

  // User role presets
  const rolePresets: { role: UserRole; username: string; label: string }[] = [
    { role: 'PETUGAS_PPOB', username: 'petugas', label: 'Petugas PPOB' },
    { role: 'KEUANGAN_DISTRIBUSI', username: 'keuangan', label: 'Keuangan' },
    { role: 'SUPERVISOR', username: 'supervisor', label: 'Supervisor' },
    { role: 'AKUNTANSI_UPJ', username: 'akuntansi', label: 'Akuntansi' },
    { role: 'PELANGGAN', username: 'pelanggan', label: 'Pelanggan' },
    { role: 'ADMIN', username: 'admin', label: 'Admin' },
  ];

  const handleSelectPreset = (preset: typeof rolePresets[0]) => {
    setSelectedRole(preset.role);
    setUsername(preset.username);
  };

  const handleUsernameChange = (val: string) => {
    setUsername(val);
    const lower = val.toLowerCase();
    if (lower.includes('keuangan')) {
      setSelectedRole('KEUANGAN_DISTRIBUSI');
    } else if (lower.includes('super')) {
      setSelectedRole('SUPERVISOR');
    } else if (lower.includes('akun')) {
      setSelectedRole('AKUNTANSI_UPJ');
    } else if (lower.includes('pelanggan') || /^\d{10,}$/.test(val.trim())) {
      setSelectedRole('PELANGGAN');
    } else if (lower.includes('admin')) {
      setSelectedRole('ADMIN');
    } else {
      setSelectedRole('PETUGAS_PPOB');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole, username);
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-[#f4f7fb] select-none overflow-x-hidden">
      {/* Left Column: Vivid Blue Branding Panel */}
      <div className="w-full md:w-[42%] lg:w-[40%] bg-gradient-to-br from-[#2563eb] via-[#2458e6] to-[#4338ca] text-white flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 md:py-20 shadow-lg relative">
        <div className="max-w-md mx-auto md:mx-0 w-full space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-none">
            PPOB PLN
          </h1>
          
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white leading-tight tracking-tight pt-1">
            Penerimaan kas <br className="hidden sm:inline" />
            yang tertelusur.
          </h2>

          <p className="text-white/85 text-sm sm:text-base font-normal leading-relaxed pt-3 max-w-sm">
            Pembayaran, settlement, rekonsiliasi, dan jurnal dalam satu workspace.
          </p>
        </div>
      </div>

      {/* Right Column: Clean White Card on Soft Background */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 bg-[#f4f7fb]">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xs border border-slate-200/70 p-7 sm:p-9 animate-in fade-in duration-200">
          
          {/* Card Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-6">
            Masuk ke workspace
          </h3>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="petugas"
                className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200/90 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            {/* Field: Kata sandi with Eye Icon */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Kata sandi
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 bg-[#f8fafc] border border-slate-200/90 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors rounded"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-[#0062ff] hover:bg-[#0052cc] text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          {/* Role selector chips for seamless review */}
          <div className="mt-7 pt-5 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Pilih Role Akun:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {rolePresets.map((preset) => {
                const isActive = username === preset.username;
                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all border text-center cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-xs text-slate-400 mt-6 text-center">
          Sistem Informasi Akuntansi Penerimaan Kas PPOB PLN
        </div>
      </div>
    </div>
  );
};
