import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Zap, Shield, ArrowRight, Check } from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { UserRole } from '../../types/ppob';

export const LoginView: React.FC = () => {
  const { login } = usePPOB();

  const [employeeId, setEmployeeId] = useState('1014776');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('KEUANGAN_DISTRIBUSI');
  const [isLoading, setIsLoading] = useState(false);

  // Demo user presets
  const rolePresets: { role: UserRole; id: string; label: string }[] = [
    { role: 'KEUANGAN_DISTRIBUSI', id: '1014776', label: 'Keuangan' },
    { role: 'PETUGAS_PPOB', id: '1014777', label: 'Kasir PPOB' },
    { role: 'SUPERVISOR', id: '1014778', label: 'Supervisor' },
    { role: 'AKUNTANSI_UPJ', id: '1014779', label: 'Akuntansi' },
    { role: 'PELANGGAN', id: '530000000003', label: 'Pelanggan' },
    { role: 'ADMIN', id: 'ADMIN-01', label: 'Admin' },
  ];

  const handleSelectPreset = (preset: typeof rolePresets[0]) => {
    setSelectedRole(preset.role);
    setEmployeeId(preset.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole, employeeId);
      setIsLoading(false);
    }, 400);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      login('KEUANGAN_DISTRIBUSI', 'frizputra19@gmail.com');
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 relative select-none">
      {/* Decorative subtle ambient backdrop glow */}
      <div className="absolute w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl -top-12 -left-12 pointer-events-none"></div>
      <div className="absolute w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -bottom-12 -right-12 pointer-events-none"></div>

      {/* Outer Card with iridescent gradient border matching screenshot */}
      <div className="p-[1.5px] rounded-[34px] bg-gradient-to-tr from-rose-400/80 via-sky-400 to-cyan-400 shadow-xl max-w-[440px] w-full relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-[33px] p-7 sm:p-9 space-y-6">
          
          {/* Top Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm tracking-tight shadow-md shadow-cyan-500/20">
              PP
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                PPOB PLN
              </h1>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wide">
                Penerimaan Kas & UPJ
              </p>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Login
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
              Enter your NIK, Employee ID, or ID Pelanggan and password to access pages
            </p>
          </div>

          {/* Quick Demo Role Selector */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pilih Role Akses Demo:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {rolePresets.map((preset) => {
                const isActive = selectedRole === preset.role;
                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                      isActive
                        ? 'bg-cyan-500 text-white border-cyan-500 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Field: Employee ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {selectedRole === 'PELANGGAN' ? 'ID Pelanggan (IDPEL)' : 'Employee ID / NIK'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <div className="bg-[#f0f4f9] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-200/60 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-400/20 transition-all">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. 1014776"
                  className="bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 w-full focus:outline-none"
                />
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="bg-[#f0f4f9] rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-200/60 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-400/20 transition-all">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 w-full focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 h-3.5 w-3.5"
                />
                <span>Ingat saya</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Fitur pemulihan kata sandi: Silakan hubungi Helpdesk IT PLN / Supervisor')}
                className="font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
              >
                Forgot Password ?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 font-medium absolute">
              atau
            </span>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 flex items-center justify-center gap-2.5 text-xs font-bold text-slate-700 transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            {/* Google 4-Color G logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.67v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.16z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Login dengan Google</span>
          </button>

          {/* Security note */}
          <div className="text-[10px] text-center text-slate-400">
            Sistem Informasi Akuntansi Penerimaan Kas • Enkripsi TLS 1.3
          </div>
        </div>
      </div>
    </div>
  );
};
