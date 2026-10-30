import React, { useState } from 'react';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { UserRole } from '../../types/ppob';

export const LoginView: React.FC = () => {
  const { login, isDarkMode, toggleDarkMode } = usePPOB();

  const [username, setUsername] = useState('petugas');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('PETUGAS_PPOB');
  const [isLoading, setIsLoading] = useState(false);

  // User role presets
  const rolePresets: { role: UserRole; username: string; label: string; name: string }[] = [
    { role: 'PETUGAS_PPOB', username: 'petugas', label: 'Petugas PPOB', name: 'Ivan' },
    { role: 'KEUANGAN_DISTRIBUSI', username: 'keuangan', label: 'Keuangan', name: 'Valda' },
    { role: 'SUPERVISOR', username: 'supervisor', label: 'Supervisor', name: 'Khurin' },
    { role: 'AKUNTANSI_UPJ', username: 'akuntansi', label: 'Akuntansi', name: 'Levina' },
    { role: 'PELANGGAN', username: 'pelanggan', label: 'Pelanggan', name: 'Friz' },
    { role: 'ADMIN', username: 'admin', label: 'Admin', name: 'Admin' },
  ];

  const handleSelectPreset = (preset: typeof rolePresets[0]) => {
    setSelectedRole(preset.role);
    setUsername(preset.username);
  };

  const handleUsernameChange = (val: string) => {
    setUsername(val);
    const lower = val.toLowerCase().trim();
    if (lower.includes('keuangan') || lower.includes('valda')) {
      setSelectedRole('KEUANGAN_DISTRIBUSI');
    } else if (lower.includes('super') || lower.includes('khurin')) {
      setSelectedRole('SUPERVISOR');
    } else if (lower.includes('akun') || lower.includes('levina')) {
      setSelectedRole('AKUNTANSI_UPJ');
    } else if (lower.includes('pelanggan') || lower.includes('friz') || /^\d{10,}$/.test(lower)) {
      setSelectedRole('PELANGGAN');
    } else if (lower.includes('admin')) {
      setSelectedRole('ADMIN');
    } else if (lower.includes('petugas') || lower.includes('ivan')) {
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f4f7fb] dark:bg-slate-950 select-none relative transition-colors">
      {/* Dark mode toggle top right */}
      <div className="absolute top-5 right-5 z-30">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
          title={isDarkMode ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
          aria-label={isDarkMode ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Left Column: Vivid Blue Branding Panel */}
      <div className="w-full md:w-[44%] lg:w-[42%] bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#3730a3] text-white flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 py-12 md:py-20 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background glow circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-lg mx-auto md:mx-0 w-full space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Sistem Informasi Akuntansi PLN
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
            PPOB PLN
          </h1>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight pt-1">
            Penerimaan kas <br className="hidden sm:inline" />
            yang tertelusur.
          </h2>

          <p className="text-white/90 text-sm sm:text-base lg:text-lg font-normal leading-relaxed pt-2 max-w-md">
            Pembayaran, settlement, rekonsiliasi, dan jurnal dalam satu workspace akuntansi terintegrasi.
          </p>
        </div>
      </div>

      {/* Right Column: Clean White Card on Soft Background */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 md:p-14 lg:p-16 bg-[#f4f7fb] dark:bg-slate-950 min-h-screen transition-colors">
        <div className="w-full max-w-[500px] bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 md:p-11 animate-in fade-in duration-200">
          
          {/* Card Header */}
          <div className="mb-7">
            <h3 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
              Masuk ke workspace
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1.5">
              Silakan masukkan kredensial akun untuk mengakses sistem.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field: Username */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="petugas"
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-2xs"
              />
            </div>

            {/* Field: Kata sandi with Eye Icon */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Kata sandi
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-base font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-all tracking-wider shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none transition-colors rounded-lg cursor-pointer"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400 dark:text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-7 bg-[#0062ff] hover:bg-[#0052cc] text-white font-bold py-3.5 px-6 rounded-xl text-base transition-all shadow-md hover:shadow-blue-500/25 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>

          {/* Role selector chips for seamless review */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              PILIH ROLE AKUN:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {rolePresets.map((preset) => {
                const isActive = username === preset.username;
                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`py-2 px-2.5 rounded-xl text-center cursor-pointer shadow-2xs transition-all border ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-400 dark:border-blue-600 ring-1 ring-blue-400/50'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="text-xs sm:text-[13px] font-bold leading-tight">{preset.label}</div>
                    <div className={`text-[11px] font-medium mt-0.5 ${isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400 dark:text-slate-500'}`}>
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-7 text-center font-medium">
          Sistem Informasi Akuntansi Penerimaan Kas PPOB PLN
        </div>
      </div>
    </div>
  );
};
