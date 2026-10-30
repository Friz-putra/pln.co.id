import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Sliders, 
  Lock, 
  AlertCircle, 
  Check, 
  X, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { UserRole, AppUser, PermissionCategory, UserStatus } from '../../types/ppob';

export const UserManagementView: React.FC = () => {
  const { 
    users, 
    permissionItems, 
    rolePermissions, 
    currentRole,
    currentUser,
    addUser, 
    updateUser, 
    deleteUser, 
    toggleUserStatus, 
    resetUserPassword, 
    updateRolePermission, 
    updateUserCustomPermission,
    resetPermissionsToDefault,
    auditLogs
  } = usePPOB();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'users' | 'matrix' | 'logs'>('users');

  // Filters for User List
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [customPermUser, setCustomPermUser] = useState<AppUser | null>(null);
  const [deleteTargetUser, setDeleteTargetUser] = useState<AppUser | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // New User Form State
  const [formData, setFormData] = useState({
    username: '',
    nama_lengkap: '',
    email: '',
    telepon: '',
    role: 'PETUGAS_PPOB' as UserRole,
    unit_pln: 'Loket Gambir UP3 Menteng',
    status: 'AKTIF' as UserStatus,
  });

  const roleMeta: Record<UserRole, { label: string; badge: string; color: string; border: string; bg: string }> = {
    PETUGAS_PPOB: { label: 'Petugas PPOB', badge: 'Loket & Kasir', color: 'text-sky-700', border: 'border-sky-200', bg: 'bg-sky-50' },
    KEUANGAN_DISTRIBUSI: { label: 'Keuangan Distribusi', badge: 'Rekonsiliasi Bank', color: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50' },
    SUPERVISOR: { label: 'Supervisor', badge: 'Otorisasi & Review', color: 'text-indigo-700', border: 'border-indigo-200', bg: 'bg-indigo-50' },
    AKUNTANSI_UPJ: { label: 'Akuntansi UPJ', badge: 'Jurnal & Buku Besar', color: 'text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    ADMIN: { label: 'Admin Sistem', badge: 'Akses Penuh', color: 'text-slate-800', border: 'border-slate-300', bg: 'bg-slate-100' },
    PELANGGAN: { label: 'Pelanggan', badge: 'Portal Mandiri', color: 'text-amber-700', border: 'border-amber-200', bg: 'bg-amber-50' }
  };

  const categoryTitles: Record<PermissionCategory, { title: string; subtitle: string; icon: string }> = {
    TRANSAKSI: { title: '1. Transaksi & Kasir PPOB', subtitle: 'Proses loket, inquiry tagihan listrik, pembayaran, dan pencetakan bukti bayar', icon: '💳' },
    SETTLEMENT: { title: '2. Settlement & Perbankan', subtitle: 'Pengelompokan transaksi batch dan rekonsiliasi transfer ke rekening bank receipt', icon: '🏦' },
    REKONSILIASI: { title: '3. Rekonsiliasi & Investigasi Selisih', subtitle: 'Pencocokan 3-way matching dan eskalasi kasus selisih kas penerimaan', icon: '🔄' },
    JURNAL: { title: '4. Jurnal & Akuntansi Umum', subtitle: 'Penyusunan draft jurnal double-entry dan pemindahbukuan ke General Ledger SAP', icon: '📖' },
    SISTEM: { title: '5. Keamanan & Administrasi Sistem', subtitle: 'Pengelolaan data pengguna, konfigurasi wewenang permission, dan audit log', icon: '🛡️' }
  };

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchQuery = 
        u.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.unit_pln.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;

      return matchQuery && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Grouped Permissions
  const groupedPermissions = useMemo(() => {
    const groups: Record<PermissionCategory, typeof permissionItems> = {
      TRANSAKSI: [],
      SETTLEMENT: [],
      REKONSILIASI: [],
      JURNAL: [],
      SISTEM: []
    };

    permissionItems.forEach(item => {
      if (groups[item.kategori]) {
        groups[item.kategori].push(item);
      }
    });

    return groups;
  }, [permissionItems]);

  // Handle Add User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.nama_lengkap.trim() || !formData.email.trim()) {
      showToast('Mohon lengkapi username, nama lengkap, dan email', 'error');
      return;
    }

    // Check duplicate username
    if (users.some(u => u.username.toLowerCase() === formData.username.trim().toLowerCase())) {
      showToast('Username tersebut sudah digunakan oleh pengguna lain', 'error');
      return;
    }

    addUser({
      username: formData.username.trim().toLowerCase(),
      nama_lengkap: formData.nama_lengkap.trim(),
      email: formData.email.trim(),
      telepon: formData.telepon.trim() || '0812-0000-0000',
      role: formData.role,
      unit_pln: formData.unit_pln.trim(),
      status: formData.status
    });

    setIsAddUserModalOpen(false);
    setFormData({
      username: '',
      nama_lengkap: '',
      email: '',
      telepon: '',
      role: 'PETUGAS_PPOB',
      unit_pln: 'Loket Gambir UP3 Menteng',
      status: 'AKTIF'
    });
    showToast(`Pengguna baru ${formData.nama_lengkap} berhasil didaftarkan`);
  };

  // Handle Update User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.user_id, {
      nama_lengkap: editingUser.nama_lengkap,
      email: editingUser.email,
      telepon: editingUser.telepon,
      role: editingUser.role,
      unit_pln: editingUser.unit_pln,
      status: editingUser.status
    });

    setEditingUser(null);
    showToast(`Data pengguna ${editingUser.nama_lengkap} berhasil diperbarui`);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!deleteTargetUser) return;
    const res = deleteUser(deleteTargetUser.user_id);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
    setDeleteTargetUser(null);
  };

  // Handle Reset Password
  const handleResetPassword = (user: AppUser) => {
    const res = resetUserPassword(user.user_id);
    showToast(res.message, 'info');
  };

  // Handle Toggle Permission in Matrix
  const handleTogglePermission = (role: UserRole, permissionKey: string, currentVal: boolean) => {
    const newVal = !currentVal;
    updateRolePermission(role, permissionKey, newVal);
    const permObj = permissionItems.find(p => p.key === permissionKey);
    showToast(`Izin "${permObj?.label || permissionKey}" untuk role ${roleMeta[role].label} diubah jadi ${newVal ? 'DIIZINKAN' : 'DILARANG'}`);
  };

  const userLogs = useMemo(() => {
    return auditLogs.filter(log => 
      log.entitas === 'PENGGUNA' || 
      log.entitas === 'PERMISSION' || 
      log.aksi.includes('USER') || 
      log.aksi.includes('PENGGUNA') ||
      log.aksi.includes('HAK_AKSES')
    );
  }, [auditLogs]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border animate-in slide-in-from-bottom-5 duration-200 text-sm font-medium ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-900 text-white border-emerald-700 shadow-emerald-900/20' 
            : toastMessage.type === 'error'
            ? 'bg-rose-900 text-white border-rose-700 shadow-rose-900/20'
            : 'bg-slate-900 text-white border-slate-700 shadow-slate-900/20'
        }`}>
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toastMessage.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toastMessage.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wider">
              Administrasi & Keamanan
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Pengaturan Otorisasi PPOB PLN</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User Management & Hak Akses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola akun pengguna, struktur wewenang unit kerja, dan konfigurasi permission granular setiap role.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              if (confirm('Kembalikan matriks hak akses ke standar template kepatuhan operasional PLN?')) {
                resetPermissionsToDefault();
                showToast('Matriks hak akses berhasil di-reset ke standar default PLN');
              }
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Default PLN</span>
          </button>
          
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pengguna</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{users.length}</span>
            <span className="text-xs font-medium text-emerald-600">Akun terdaftar</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Mencakup loket, keuangan, & pelanggan</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pengguna Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">
              {users.filter(u => u.status === 'AKTIF').length}
            </span>
            <span className="text-xs text-slate-500">/ {users.length} user</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Status aktif & dapat login ke sistem</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Role Terdaftar</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">6 Role</span>
            <span className="text-xs text-indigo-600 font-semibold">Tersinkronisasi</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Segregasi tugas operasional & akuntansi</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Matriks Hak Akses</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{permissionItems.length} Izin</span>
            <span className="text-xs text-amber-600 font-semibold">5 Kategori</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dapat disetting langsung secara realtime</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-200/80 px-6 pt-3 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Pengguna ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'matrix'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Matriks Hak Akses & Permission</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
              Setting Langsung
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'logs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Audit Trail Akun & Izin ({userLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: USERS LIST */}
        {activeTab === 'users' && (
          <div className="p-6 space-y-5">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari nama, username, email, atau unit kerja..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">Role:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Semua Role</option>
                    <option value="PETUGAS_PPOB">Petugas PPOB</option>
                    <option value="KEUANGAN_DISTRIBUSI">Keuangan Distribusi</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="AKUNTANSI_UPJ">Akuntansi UPJ</option>
                    <option value="ADMIN">Admin Sistem</option>
                    <option value="PELANGGAN">Pelanggan</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Semua Status</option>
                    <option value="AKTIF">Aktif</option>
                    <option value="NONAKTIF">Nonaktif</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold tracking-wider uppercase text-[10px]">
                    <th className="py-3 px-4">Pengguna</th>
                    <th className="py-3 px-3">Username</th>
                    <th className="py-3 px-3">Role & Wewenang</th>
                    <th className="py-3 px-3">Unit PLN</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Terakhir Login</th>
                    <th className="py-3 px-4 text-right">Aksi & Pengaturan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        Tidak ada pengguna yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const meta = roleMeta[u.role] || roleMeta.PETUGAS_PPOB;
                      const initial = u.nama_lengkap.charAt(0).toUpperCase();

                      return (
                        <tr key={u.user_id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Nama & Email */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${meta.bg} ${meta.color} font-black flex items-center justify-center border ${meta.border} text-xs shadow-2xs`}>
                                {initial}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{u.nama_lengkap}</span>
                                  {u.user_id === currentUser?.user_id && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                                      Anda
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Username */}
                          <td className="py-3.5 px-3">
                            <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              {u.username}
                            </span>
                          </td>

                          {/* Role Badge */}
                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${meta.bg} ${meta.color} border ${meta.border}`}>
                              <ShieldCheck className="w-3 h-3" />
                              <span>{meta.label}</span>
                            </span>
                          </td>

                          {/* Unit PLN */}
                          <td className="py-3.5 px-3 text-slate-600 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[180px]">{u.unit_pln}</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-3">
                            <button
                              onClick={() => toggleUserStatus(u.user_id)}
                              title="Klik untuk ubah status aktif/nonaktif"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                u.status === 'AKTIF'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'AKTIF' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                              <span>{u.status}</span>
                            </button>
                          </td>

                          {/* Last Login */}
                          <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                            {u.last_login || '-'}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Custom Permissions Override */}
                              <button
                                onClick={() => setCustomPermUser(u)}
                                title="Pengaturan Izin Khusus Pengguna"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                <Sliders className="w-3.5 h-3.5" />
                              </button>

                              {/* Reset Password */}
                              <button
                                onClick={() => handleResetPassword(u)}
                                title="Reset Kata Sandi"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-amber-600 transition-colors cursor-pointer"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit Profile */}
                              <button
                                onClick={() => setEditingUser(u)}
                                title="Edit Pengguna"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeleteTargetUser(u)}
                                title="Hapus Pengguna"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Kata sandi default setelah reset adalah <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800 font-semibold">PLN@2026</code>. Pengguna wajib menggantinya saat pertama kali masuk.
                </span>
              </div>
              <span className="font-semibold text-slate-700 shrink-0">
                Menampilkan {filteredUsers.length} dari {users.length} akun
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: PERMISSION MATRIX */}
        {activeTab === 'matrix' && (
          <div className="p-6 space-y-6">
            <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-blue-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>Konfigurasi Matriks Hak Akses (Permission Matrix)</span>
                </div>
                <p className="text-xs text-blue-700/80">
                  Setiap toggle switch di bawah ini langsung mengubah wewenang role terkait secara real-time. Klik sakelar untuk mengizinkan atau menonaktifkan fitur.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>Diizinkan</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 ml-2"></span>
                  <span>Dilarang</span>
                </div>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                    <th className="py-3 px-4 min-w-[260px]">Modul & Rincian Hak Akses</th>
                    <th className="py-3 px-3 text-center min-w-[110px]">
                      <div className="font-bold text-sky-800">Petugas PPOB</div>
                      <div className="text-[10px] text-sky-600 font-normal">Loket Kasir</div>
                    </th>
                    <th className="py-3 px-3 text-center min-w-[120px]">
                      <div className="font-bold text-blue-800">Keuangan</div>
                      <div className="text-[10px] text-blue-600 font-normal">Distribusi / UP3</div>
                    </th>
                    <th className="py-3 px-3 text-center min-w-[110px]">
                      <div className="font-bold text-indigo-800">Supervisor</div>
                      <div className="text-[10px] text-indigo-600 font-normal">Otorisasi & Rev</div>
                    </th>
                    <th className="py-3 px-3 text-center min-w-[110px]">
                      <div className="font-bold text-emerald-800">Akuntansi</div>
                      <div className="text-[10px] text-emerald-600 font-normal">UPJ / GL SAP</div>
                    </th>
                    <th className="py-3 px-3 text-center min-w-[110px]">
                      <div className="font-bold text-amber-800">Pelanggan</div>
                      <div className="text-[10px] text-amber-600 font-normal">Layanan Mandiri</div>
                    </th>
                    <th className="py-3 px-3 text-center min-w-[110px]">
                      <div className="font-bold text-slate-900">Admin</div>
                      <div className="text-[10px] text-slate-500 font-normal">Super User</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200/70">
                  {(Object.keys(groupedPermissions) as PermissionCategory[]).map((catKey) => {
                    const cat = categoryTitles[catKey];
                    const items = groupedPermissions[catKey];

                    return (
                      <React.Fragment key={catKey}>
                        {/* Category Header Row */}
                        <tr className="bg-slate-50/90 border-y border-slate-200">
                          <td colSpan={7} className="py-2.5 px-4 font-bold text-slate-800 text-xs">
                            <div className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span className="uppercase tracking-wider text-[11px] font-black">{cat.title}</span>
                              <span className="text-[11px] text-slate-400 font-normal">— {cat.subtitle}</span>
                            </div>
                          </td>
                        </tr>

                        {/* Category Items */}
                        {items.map((perm) => (
                          <tr key={perm.key} className="hover:bg-slate-50/50 transition-colors">
                            {/* Permission Name & Description */}
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-800">{perm.label}</div>
                              <div className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                                {perm.deskripsi}
                              </div>
                            </td>

                            {/* Petugas PPOB Toggle */}
                            <td className="py-3 px-3 text-center">
                              <SwitchToggle
                                checked={!!rolePermissions.PETUGAS_PPOB?.[perm.key]}
                                onChange={() => handleTogglePermission('PETUGAS_PPOB', perm.key, !!rolePermissions.PETUGAS_PPOB?.[perm.key])}
                              />
                            </td>

                            {/* Keuangan Distribusi Toggle */}
                            <td className="py-3 px-3 text-center">
                              <SwitchToggle
                                checked={!!rolePermissions.KEUANGAN_DISTRIBUSI?.[perm.key]}
                                onChange={() => handleTogglePermission('KEUANGAN_DISTRIBUSI', perm.key, !!rolePermissions.KEUANGAN_DISTRIBUSI?.[perm.key])}
                              />
                            </td>

                            {/* Supervisor Toggle */}
                            <td className="py-3 px-3 text-center">
                              <SwitchToggle
                                checked={!!rolePermissions.SUPERVISOR?.[perm.key]}
                                onChange={() => handleTogglePermission('SUPERVISOR', perm.key, !!rolePermissions.SUPERVISOR?.[perm.key])}
                              />
                            </td>

                            {/* Akuntansi UPJ Toggle */}
                            <td className="py-3 px-3 text-center">
                              <SwitchToggle
                                checked={!!rolePermissions.AKUNTANSI_UPJ?.[perm.key]}
                                onChange={() => handleTogglePermission('AKUNTANSI_UPJ', perm.key, !!rolePermissions.AKUNTANSI_UPJ?.[perm.key])}
                              />
                            </td>

                            {/* Pelanggan Toggle */}
                            <td className="py-3 px-3 text-center">
                              <SwitchToggle
                                checked={!!rolePermissions.PELANGGAN?.[perm.key]}
                                onChange={() => handleTogglePermission('PELANGGAN', perm.key, !!rolePermissions.PELANGGAN?.[perm.key])}
                              />
                            </td>

                            {/* Admin Toggle */}
                            <td className="py-3 px-3 text-center">
                              <SwitchToggle
                                checked={!!rolePermissions.ADMIN?.[perm.key]}
                                onChange={() => handleTogglePermission('ADMIN', perm.key, !!rolePermissions.ADMIN?.[perm.key])}
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT TRAIL */}
        {activeTab === 'logs' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Riwayat Perubahan Akun & Izin Pengguna</h3>
                <p className="text-xs text-slate-500">Mencatat aktivitas pembuatan akun, reset kata sandi, dan perubahan matriks wewenang.</p>
              </div>
              <span className="text-xs text-slate-400 font-medium">Total: {userLogs.length} Aktivitas</span>
            </div>

            <div className="space-y-2.5">
              {userLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Belum ada log aktivitas terkait manajemen pengguna.
                </div>
              ) : (
                userLogs.map((log) => (
                  <div key={log.log_id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-blue-700">
                          {log.log_id}
                        </span>
                        <span className="font-bold text-slate-900">{log.aksi}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                          {log.entitas}: {log.entitas_id}
                        </span>
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-2">
                        <span>Aktor: <strong>{log.aktor_sistem}</strong></span>
                        <span>•</span>
                        <span>Korelasi: <code className="text-slate-600 font-medium">{log.correlation_id}</code></span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 shrink-0 font-medium">
                      {log.waktu}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: TAMBAH PENGGUNA */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Tambah Akun Pengguna Baru</h3>
                <p className="text-xs text-slate-500">Daftarkan personel baru ke dalam sistem PPOB PLN.</p>
              </div>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Raden Hendra Saputra"
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    placeholder="hendra"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Akun *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="PETUGAS_PPOB">Petugas PPOB</option>
                    <option value="KEUANGAN_DISTRIBUSI">Keuangan Distribusi</option>
                    <option value="SUPERVISOR">Supervisor Keuangan</option>
                    <option value="AKUNTANSI_UPJ">Akuntansi UPJ</option>
                    <option value="ADMIN">Admin Sistem</option>
                    <option value="PELANGGAN">Pelanggan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email PLN / Pribadi *</label>
                  <input
                    type="email"
                    required
                    placeholder="hendra@pln.co.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    placeholder="0812-3456-7890"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit Kerja PLN</label>
                <input
                  type="text"
                  placeholder="Loket Gambir UP3 Menteng"
                  value={formData.unit_pln}
                  onChange={(e) => setFormData({ ...formData, unit_pln: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Kata sandi bawaan pertama kali: <strong className="text-slate-800 font-semibold">password123</strong></span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PENGGUNA */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Edit Pengguna: {editingUser.nama_lengkap}</h3>
                <p className="text-xs text-slate-500">Perbarui informasi profil dan penugasan role akun.</p>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingUser.nama_lengkap}
                  onChange={(e) => setEditingUser({ ...editingUser, nama_lengkap: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Akun</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="PETUGAS_PPOB">Petugas PPOB</option>
                    <option value="KEUANGAN_DISTRIBUSI">Keuangan Distribusi</option>
                    <option value="SUPERVISOR">Supervisor Keuangan</option>
                    <option value="AKUNTANSI_UPJ">Akuntansi UPJ</option>
                    <option value="ADMIN">Admin Sistem</option>
                    <option value="PELANGGAN">Pelanggan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Akun</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="AKTIF">AKTIF</option>
                    <option value="NONAKTIF">NONAKTIF</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telepon</label>
                  <input
                    type="text"
                    value={editingUser.telepon || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, telepon: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit PLN</label>
                <input
                  type="text"
                  value={editingUser.unit_pln}
                  onChange={(e) => setEditingUser({ ...editingUser, unit_pln: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HAPUS PENGGUNA */}
      {deleteTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">Hapus Pengguna?</h3>
              <p className="text-xs text-slate-500">
                Apakah Anda yakin ingin menghapus akun <strong>{deleteTargetUser.nama_lengkap}</strong> (<span className="font-semibold text-slate-700">{deleteTargetUser.username}</span>)? Tindakan ini akan dicatat dalam audit log sistem.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm cursor-pointer"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOM PERMISSIONS OVERRIDE FOR USER */}
      {customPermUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span>Izin Khusus: {customPermUser.nama_lengkap}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    Role: {roleMeta[customPermUser.role].label}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tetapkan override izin khusus di luar default role untuk akun pengguna ini.
                </p>
              </div>
              <button 
                onClick={() => setCustomPermUser(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Izin yang di-override di sini akan diprioritaskan dibandingkan hak akses bawaan role.
                </span>
              </div>

              <div className="space-y-3">
                {permissionItems.map((perm) => {
                  const roleDefault = !!rolePermissions[customPermUser.role]?.[perm.key];
                  const hasCustom = customPermUser.custom_permissions && typeof customPermUser.custom_permissions[perm.key] === 'boolean';
                  const effectiveVal = hasCustom ? customPermUser.custom_permissions![perm.key] : roleDefault;

                  return (
                    <div key={perm.key} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-800 flex items-center gap-2">
                          <span>{perm.label}</span>
                          {hasCustom && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700">
                              Custom Override
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{perm.deskripsi}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Bawaan Role: <span className="font-semibold">{roleDefault ? 'Diizinkan' : 'Dilarang'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <SwitchToggle
                          checked={effectiveVal}
                          onChange={() => {
                            updateUserCustomPermission(customPermUser.user_id, perm.key, !effectiveVal);
                            showToast(`Izin khusus "${perm.label}" untuk ${customPermUser.nama_lengkap} diubah`);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setCustomPermUser(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Switch Toggle Component
const SwitchToggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
        checked ? 'bg-blue-600' : 'bg-slate-300'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
