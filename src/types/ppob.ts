export type UserRole = 
  | 'PELANGGAN'
  | 'PETUGAS_PPOB' 
  | 'KEUANGAN_DISTRIBUSI' 
  | 'SUPERVISOR' 
  | 'AKUNTANSI_UPJ' 
  | 'ADMIN';

export type StatusPembayaran = 'BARU' | 'DIPROSES' | 'SUKSES' | 'GAGAL' | 'TIMEOUT';
export type StatusTagihan = 'BELUM LUNAS' | 'LUNAS';
export type StatusSettlement = 'DIJADWALKAN' | 'DIKIRIM' | 'DITERIMA';
export type StatusHasilRekonsiliasi = 'COCOK' | 'SELISIH' | 'TERTUNDA';
export type StatusKasus = 'TERBUKA' | 'DIAJUKAN' | 'DISETUJUI' | 'DIKEMBALIKAN' | 'SELESAI';
export type StatusJurnal = 'DRAF' | 'POSTED';

export interface UnitPLN {
  unit_id: string;
  kode_unit: string;
  nama_unit: string;
  jenis_unit: string;
}

export interface Pelanggan {
  pelanggan_id: string;
  unit_id: string;
  nomor_pelanggan: string;
  nama: string;
  alamat: string;
  tarif_daya: string;
}

export interface Tagihan {
  tagihan_id: string;
  pelanggan_id: string;
  periode: string; // e.g. "Oktober 2026"
  pokok: number;
  denda: number;
  jatuh_tempo: string;
  status: StatusTagihan;
}

export interface Bank {
  bank_id: string;
  kode_bank: string;
  nama_bank: string;
  rekening_receipt: string;
}

export interface PaymentPoint {
  point_id: string;
  bank_id: string;
  kode_point: string;
  nama_point: string;
  status_aktif: boolean;
}

export interface Pembayaran {
  pembayaran_id: string; // UUID e.g. TRX-001
  point_id: string;
  petugas_id: string;
  idempotency_key: string;
  ref_bank: string; // e.g. BNK-20261020-001
  nominal_pln: number;
  admin: number;
  status: StatusPembayaran;
  waktu_bayar: string;
  nomor_pelanggan: string;
  nama_pelanggan: string;
  periode_tagihan: string;
  tagihan_id: string;
}

export interface AlokasiBayar {
  alokasi_id: string;
  pembayaran_id: string;
  tagihan_id: string;
  nominal: number;
}

export interface Settlement {
  settlement_id: string; // e.g. SET-001
  bank_id: string;
  ref_settlement: string;
  tanggal: string;
  status: StatusSettlement;
  pembayaran_id: string;
  nominal_pln: number;
}

export interface MutasiBank {
  mutasi_id: string; // e.g. MUT-001
  bank_id: string;
  ref_transfer: string; // e.g. TF-001
  waktu_mutasi: string;
  kredit: number; // nominal received by bank
  keterangan: string;
}

export interface DetailRekonsiliasi {
  hasil_id: string;
  rekonsiliasi_id: string;
  settlement_id: string;
  mutasi_id: string | null;
  status_hasil: StatusHasilRekonsiliasi;
  ekspektasi: number;
  aktual: number;
  selisih: number; // aktual - ekspektasi
  kasus_id?: string;
  tindakan: string;
}

export interface KasusRiwayatItem {
  waktu: string;
  aktor: string;
  keterangan: string;
  status: StatusKasus;
}

export interface KasusSelisih {
  kasus_id: string; // e.g. KAS-001
  hasil_id: string;
  settlement_id: string;
  mutasi_id: string;
  ekspektasi: number;
  aktual: number;
  kekurangan: number;
  pembuat_id: string;
  pembuat_nama: string;
  penyetuju_id: string | null;
  penyetuju_nama: string | null;
  penyebab: string;
  bukti_uri: string;
  usulan: string;
  status: StatusKasus;
  riwayat: KasusRiwayatItem[];
}

export interface Akun {
  akun_id: string;
  kode_akun: string; // e.g. "1101"
  nama_akun: string; // e.g. "Kas / Bank receipt PLN"
  tipe_akun: 'ASET' | 'KEWAJIBAN' | 'EKUITAS' | 'PENDAPATAN' | 'BEBAN';
  status_aktif: boolean;
}

export interface DetailJurnal {
  baris_id: string;
  jurnal_id: string;
  kode_akun: string;
  nama_akun: string;
  debit: number;
  kredit: number;
  keterangan?: string;
}

export interface Jurnal {
  jurnal_id: string; // e.g. JRN-001
  hasil_id: string;
  settlement_id: string;
  unit_id: string;
  pembuat_id: string;
  tanggal: string;
  status: StatusJurnal;
  total_debit: number;
  total_kredit: number;
  keterangan: string;
  detail: DetailJurnal[];
}

export interface AuditLog {
  log_id: string;
  pengguna_id?: string;
  aktor_sistem: string;
  entitas: string;
  entitas_id: string;
  aksi: string;
  correlation_id: string;
  sebelum?: Record<string, unknown> | null;
  sesudah?: Record<string, unknown> | null;
  waktu: string;
}

export type UserStatus = 'AKTIF' | 'NONAKTIF';

export interface AppUser {
  user_id: string;
  username: string;
  nama_lengkap: string;
  email: string;
  telepon?: string;
  role: UserRole;
  unit_pln: string;
  status: UserStatus;
  last_login?: string;
  created_at: string;
  custom_permissions?: Record<string, boolean>;
}

export type PermissionCategory = 'TRANSAKSI' | 'SETTLEMENT' | 'REKONSILIASI' | 'JURNAL' | 'SISTEM';

export interface PermissionItem {
  key: string;
  label: string;
  deskripsi: string;
  kategori: PermissionCategory;
}

