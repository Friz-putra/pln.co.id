import {
  Pelanggan,
  Tagihan,
  Bank,
  Pembayaran,
  Settlement,
  MutasiBank,
  DetailRekonsiliasi,
  KasusSelisih,
  Jurnal,
  Akun,
  AuditLog,
  AppUser,
  PermissionItem,
  UserRole
} from '../types/ppob';


export const INITIAL_BANKS: Bank[] = [
  {
    bank_id: 'BANK-01',
    kode_bank: 'BANK-SIM',
    nama_bank: 'Bank Mitra Simulasi (Aggregator)',
    rekening_receipt: '0001234567'
  },
  {
    bank_id: 'BANK-02',
    kode_bank: 'MANDIRI',
    nama_bank: 'Bank Mandiri Receipt PLN',
    rekening_receipt: '142001928374'
  },
  {
    bank_id: 'BANK-03',
    kode_bank: 'BRI',
    nama_bank: 'Bank BRI Penerimaan UPJ',
    rekening_receipt: '034101000543501'
  }
];

export const INITIAL_PELANGGAN: Pelanggan[] = [
  {
    pelanggan_id: 'PEL-001',
    unit_id: 'UPJ-01',
    nomor_pelanggan: '530000000001',
    nama: 'Pelanggan Simulasi A',
    alamat: 'Jl. Merdeka No. 12, Kebayoran Baru, Jakarta Selatan',
    tarif_daya: 'R1 / 1.300 VA'
  },
  {
    pelanggan_id: 'PEL-002',
    unit_id: 'UPJ-01',
    nomor_pelanggan: '530000000002',
    nama: 'Pelanggan Simulasi B',
    alamat: 'Jl. Melati Raya No. 45, Bintaro, Tangerang Selatan',
    tarif_daya: 'R1 / 2.200 VA'
  },
  {
    pelanggan_id: 'PEL-003',
    unit_id: 'UPJ-01',
    nomor_pelanggan: '530000000003',
    nama: 'Friz',
    alamat: 'Jl. Gatot Subroto Kav. 52, Setiabudi, Jakarta Selatan',
    tarif_daya: 'R1 / 1.300 VA'
  },
  {
    pelanggan_id: 'PEL-004',
    unit_id: 'UPJ-01',
    nomor_pelanggan: '530000000004',
    nama: 'PT Sinar Mandiri Elektronik',
    alamat: 'Kawasan Industri Pulogadung Blok B-4, Jakarta Timur',
    tarif_daya: 'B2 / 13.200 VA'
  },
  {
    pelanggan_id: 'PEL-005',
    unit_id: 'UPJ-01',
    nomor_pelanggan: '530000000005',
    nama: 'Dra. Endang Wulandari',
    alamat: 'Komplek Pertamina D-15, Cilandak, Jakarta Selatan',
    tarif_daya: 'R1 / 900 VA'
  }
];

export const INITIAL_TAGIHAN: Tagihan[] = [
  {
    tagihan_id: 'TAG-001',
    pelanggan_id: 'PEL-001',
    periode: 'Oktober 2026',
    pokok: 450000,
    denda: 0,
    jatuh_tempo: '2026-10-20',
    status: 'LUNAS'
  },
  {
    tagihan_id: 'TAG-002',
    pelanggan_id: 'PEL-002',
    periode: 'Oktober 2026',
    pokok: 450000,
    denda: 0,
    jatuh_tempo: '2026-10-20',
    status: 'LUNAS'
  },
  {
    tagihan_id: 'TAG-003',
    pelanggan_id: 'PEL-003',
    periode: 'Oktober 2026',
    pokok: 450000,
    denda: 0,
    jatuh_tempo: '2026-10-20',
    status: 'LUNAS'
  },
  {
    tagihan_id: 'TAG-004',
    pelanggan_id: 'PEL-004',
    periode: 'Oktober 2026',
    pokok: 1250000,
    denda: 0,
    jatuh_tempo: '2026-10-20',
    status: 'BELUM LUNAS'
  },
  {
    tagihan_id: 'TAG-005',
    pelanggan_id: 'PEL-005',
    periode: 'Oktober 2026',
    pokok: 275000,
    denda: 0,
    jatuh_tempo: '2026-10-20',
    status: 'BELUM LUNAS'
  }
];

export const INITIAL_PEMBAYARAN: Pembayaran[] = [
  {
    pembayaran_id: 'TRX-001',
    point_id: 'PPOB-JKT-01',
    petugas_id: 'USR-PETUGAS-01',
    idempotency_key: 'IDEMP-20261020-001-A99',
    ref_bank: 'BNK-20261020-001',
    nominal_pln: 450000,
    admin: 2500,
    status: 'SUKSES',
    waktu_bayar: '2026-10-20 08:30:15 WIB',
    nomor_pelanggan: '530000000001',
    nama_pelanggan: 'Pelanggan Simulasi A',
    periode_tagihan: 'Oktober 2026',
    tagihan_id: 'TAG-001'
  },
  {
    pembayaran_id: 'TRX-002',
    point_id: 'PPOB-JKT-01',
    petugas_id: 'USR-PETUGAS-01',
    idempotency_key: 'IDEMP-20261020-002-B88',
    ref_bank: 'BNK-20261020-002',
    nominal_pln: 450000,
    admin: 2500,
    status: 'SUKSES',
    waktu_bayar: '2026-10-20 08:45:22 WIB',
    nomor_pelanggan: '530000000002',
    nama_pelanggan: 'Pelanggan Simulasi B',
    periode_tagihan: 'Oktober 2026',
    tagihan_id: 'TAG-002'
  },
  {
    pembayaran_id: 'TRX-003',
    point_id: 'PPOB-JKT-01',
    petugas_id: 'USR-PETUGAS-01',
    idempotency_key: 'IDEMP-20261020-003-C77',
    ref_bank: 'BNK-20261020-003',
    nominal_pln: 450000,
    admin: 2500,
    status: 'SUKSES',
    waktu_bayar: '2026-10-20 09:05:00 WIB',
    nomor_pelanggan: '530000000003',
    nama_pelanggan: 'Pelanggan Simulasi C',
    periode_tagihan: 'Oktober 2026',
    tagihan_id: 'TAG-003'
  },
  {
    pembayaran_id: 'TRX-004',
    point_id: 'PPOB-JKT-01',
    petugas_id: 'USR-PETUGAS-01',
    idempotency_key: 'IDEMP-20261020-004-D66',
    ref_bank: 'BNK-20261020-004',
    nominal_pln: 1250000,
    admin: 2500,
    status: 'SUKSES',
    waktu_bayar: '2026-10-20 14:42:44 WIB',
    nomor_pelanggan: '530000000004',
    nama_pelanggan: 'PT Sinar Mandiri Elektronik',
    periode_tagihan: 'Oktober 2026',
    tagihan_id: 'TAG-004'
  },
  {
    pembayaran_id: 'TRX-005',
    point_id: 'PPOB-JKT-01',
    petugas_id: 'USR-PETUGAS-02',
    idempotency_key: 'IDEMP-20261020-005-E55',
    ref_bank: 'BNK-20261020-005',
    nominal_pln: 275000,
    admin: 2500,
    status: 'SUKSES',
    waktu_bayar: '2026-10-20 15:10:18 WIB',
    nomor_pelanggan: '530000000005',
    nama_pelanggan: 'Dra. Endang Wulandari',
    periode_tagihan: 'Oktober 2026',
    tagihan_id: 'TAG-005'
  },
  {
    pembayaran_id: 'TRX-006',
    point_id: 'PPOB-BDG-01',
    petugas_id: 'USR-PETUGAS-01',
    idempotency_key: 'IDEMP-20261020-006-F44',
    ref_bank: 'BNK-20261020-006',
    nominal_pln: 350000,
    admin: 2500,
    status: 'SUKSES',
    waktu_bayar: '2026-10-20 15:35:00 WIB',
    nomor_pelanggan: '530000000006',
    nama_pelanggan: 'Koperasi Warga Mandiri',
    periode_tagihan: 'Oktober 2026',
    tagihan_id: 'TAG-006'
  },
  {
    pembayaran_id: 'TRX-007',
    point_id: 'PPOB-SBY-01',
    petugas_id: 'USR-PETUGAS-02',
    idempotency_key: 'IDEMP-20261020-007-G33',
    ref_bank: 'BNK-20261020-007',
    nominal_pln: 820000,
    admin: 2500,
    status: 'SUKSES',
    waktu_bayar: '2026-10-20 16:02:11 WIB',
    nomor_pelanggan: '530000000007',
    nama_pelanggan: 'CV Berkah Teknik Prima',
    periode_tagihan: 'Oktober 2026',
    tagihan_id: 'TAG-007'
  },
  {
    pembayaran_id: 'TRX-008',
    point_id: 'PPOB-JKT-02',
    petugas_id: 'USR-PETUGAS-01',
    idempotency_key: 'IDEMP-20261020-008-H22',
    ref_bank: 'BNK-20261020-008',
    nominal_pln: 520000,
    admin: 2500,
    status: 'SUKSES',
    waktu_bayar: '2026-10-20 16:28:45 WIB',
    nomor_pelanggan: '530000000008',
    nama_pelanggan: 'Bambang Sugiono',
    periode_tagihan: 'Oktober 2026',
    tagihan_id: 'TAG-008'
  }
];

export const INITIAL_SETTLEMENT: Settlement[] = [
  {
    settlement_id: 'SET-001',
    bank_id: 'BANK-01',
    ref_settlement: 'TF-001',
    tanggal: '2026-10-20',
    status: 'DITERIMA',
    pembayaran_id: 'TRX-001',
    nominal_pln: 450000
  },
  {
    settlement_id: 'SET-002',
    bank_id: 'BANK-01',
    ref_settlement: 'TF-002',
    tanggal: '2026-10-20',
    status: 'DITERIMA',
    pembayaran_id: 'TRX-002',
    nominal_pln: 450000
  },
  {
    settlement_id: 'SET-003',
    bank_id: 'BANK-01',
    ref_settlement: 'TF-003',
    tanggal: '2026-10-20',
    status: 'DITERIMA',
    pembayaran_id: 'TRX-003',
    nominal_pln: 450000
  }
];

export const INITIAL_MUTASI_BANK: MutasiBank[] = [
  {
    mutasi_id: 'MUT-001',
    bank_id: 'BANK-01',
    ref_transfer: 'TF-001',
    waktu_mutasi: '2026-10-20 09:10:00 WIB',
    kredit: 450000,
    keterangan: 'Settlement PPOB PLN Batch 1 - TRX-001'
  },
  {
    mutasi_id: 'MUT-002',
    bank_id: 'BANK-01',
    ref_transfer: 'TF-002',
    waktu_mutasi: '2026-10-20 09:12:00 WIB',
    kredit: 450000,
    keterangan: 'Settlement PPOB PLN Batch 2 - TRX-002'
  },
  {
    mutasi_id: 'MUT-003',
    bank_id: 'BANK-01',
    ref_transfer: 'TF-003',
    waktu_mutasi: '2026-10-20 09:14:00 WIB',
    kredit: 400000, // Shortfall of 50.000!
    keterangan: 'Settlement PPOB PLN Batch 3 - TRX-003 (Kurang Transfer)'
  }
];

export const INITIAL_DETAIL_REKONSILIASI: DetailRekonsiliasi[] = [
  {
    hasil_id: 'RKN-001',
    rekonsiliasi_id: 'RKN-20261020-01',
    settlement_id: 'SET-001',
    mutasi_id: 'MUT-001',
    status_hasil: 'COCOK',
    ekspektasi: 450000,
    aktual: 450000,
    selisih: 0,
    tindakan: 'Siap jurnal'
  },
  {
    hasil_id: 'RKN-002',
    rekonsiliasi_id: 'RKN-20261020-01',
    settlement_id: 'SET-002',
    mutasi_id: 'MUT-002',
    status_hasil: 'COCOK',
    ekspektasi: 450000,
    aktual: 450000,
    selisih: 0,
    tindakan: 'Siap jurnal'
  },
  {
    hasil_id: 'RKN-003',
    rekonsiliasi_id: 'RKN-20261020-01',
    settlement_id: 'SET-003',
    mutasi_id: 'MUT-003',
    status_hasil: 'SELISIH',
    ekspektasi: 450000,
    aktual: 400000,
    selisih: -50000,
    kasus_id: 'KAS-001',
    tindakan: 'Buka KAS-001'
  }
];

export const INITIAL_KASUS_SELISIH: KasusSelisih[] = [
  {
    kasus_id: 'KAS-001',
    hasil_id: 'RKN-003',
    settlement_id: 'SET-003',
    mutasi_id: 'MUT-003',
    ekspektasi: 450000,
    aktual: 400000,
    kekurangan: 50000,
    pembuat_id: 'USR-KEUANGAN-01',
    pembuat_nama: 'Petugas Keuangan A',
    penyetuju_id: null,
    penyetuju_nama: null,
    penyebab: 'Transfer bank belum lengkap; perlu konfirmasi bank aggregator mitra.',
    bukti_uri: 'konfirmasi-bank-simulasi.pdf',
    usulan: 'Minta pelengkapan transfer Rp50.000 oleh bank mitra. Setelah mutasi susulan tersedia, jalankan rekonsiliasi ulang. Jangan mengubah nominal transaksi pembayaran asal.',
    status: 'DIAJUKAN',
    riwayat: [
      {
        waktu: '09.15 WIB',
        aktor: 'Sistem Otomatis (W08)',
        keterangan: 'Selisih terdeteksi pada rekonsiliasi RKN-20261020-01 (-Rp50.000); kasus dibuat otomatis.',
        status: 'TERBUKA'
      },
      {
        waktu: '09.25 WIB',
        aktor: 'Petugas Keuangan A',
        keterangan: 'Bukti pendukung diunggah & usulan tindak lanjut diajukan kepada Supervisor.',
        status: 'DIAJUKAN'
      }
    ]
  }
];

export const INITIAL_AKUN: Akun[] = [
  {
    akun_id: 'AK-01',
    kode_akun: '1101',
    nama_akun: 'Kas / Bank receipt PLN',
    tipe_akun: 'ASET',
    status_aktif: true
  },
  {
    akun_id: 'AK-02',
    kode_akun: '1201',
    nama_akun: 'Piutang pelanggan',
    tipe_akun: 'ASET',
    status_aktif: true
  },
  {
    akun_id: 'AK-03',
    kode_akun: '1109',
    nama_akun: 'Rekening Perantara Settlement Bank Mitra',
    tipe_akun: 'ASET',
    status_aktif: true
  },
  {
    akun_id: 'AK-04',
    kode_akun: '4101',
    nama_akun: 'Pendapatan Tenaga Listrik UPJ',
    tipe_akun: 'PENDAPATAN',
    status_aktif: true
  }
];

export const INITIAL_JURNAL: Jurnal[] = [
  {
    jurnal_id: 'JRN-001',
    hasil_id: 'RKN-001',
    settlement_id: 'SET-001',
    unit_id: 'UPJ Simulasi',
    pembuat_id: 'USR-AKUNTANSI-01',
    tanggal: '2026-10-20',
    status: 'DRAF',
    total_debit: 450000,
    total_kredit: 450000,
    keterangan: 'Penerimaan Kas PPOB PLN - SET-001 / TRX-001 Pelanggan 530000000001',
    detail: [
      {
        baris_id: 'B-01',
        jurnal_id: 'JRN-001',
        kode_akun: '1101',
        nama_akun: 'Kas / Bank receipt PLN',
        debit: 450000,
        kredit: 0,
        keterangan: 'Penerimaan dana terkonfirmasi hasil rekonsiliasi RKN-001'
      },
      {
        baris_id: 'B-02',
        jurnal_id: 'JRN-001',
        kode_akun: '1201',
        nama_akun: 'Piutang pelanggan',
        debit: 0,
        kredit: 450000,
        keterangan: 'Pelunasan piutang tagihan pelanggan periode Oktober 2026'
      }
    ]
  },
  {
    jurnal_id: 'JRN-002',
    hasil_id: 'RKN-002',
    settlement_id: 'SET-002',
    unit_id: 'UPJ Simulasi',
    pembuat_id: 'USR-AKUNTANSI-01',
    tanggal: '2026-10-20',
    status: 'DRAF',
    total_debit: 450000,
    total_kredit: 450000,
    keterangan: 'Penerimaan Kas PPOB PLN - SET-002 / TRX-002 Pelanggan 530000000002',
    detail: [
      {
        baris_id: 'B-03',
        jurnal_id: 'JRN-002',
        kode_akun: '1101',
        nama_akun: 'Kas / Bank receipt PLN',
        debit: 450000,
        kredit: 0,
        keterangan: 'Penerimaan dana terkonfirmasi hasil rekonsiliasi RKN-002'
      },
      {
        baris_id: 'B-04',
        jurnal_id: 'JRN-002',
        kode_akun: '1201',
        nama_akun: 'Piutang pelanggan',
        debit: 0,
        kredit: 450000,
        keterangan: 'Pelunasan piutang tagihan pelanggan periode Oktober 2026'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOG: AuditLog[] = [
  {
    log_id: 'LOG-001',
    aktor_sistem: 'Petugas PPOB',
    entitas: 'PEMBAYARAN',
    entitas_id: 'TRX-001',
    aksi: 'PEMBAYARAN_SUKSES',
    correlation_id: 'IDEMP-20261020-001-A99',
    sebelum: { status: 'DIPROSES' },
    sesudah: { status: 'SUKSES', ref_bank: 'BNK-20261020-001', nominal_pln: 450000 },
    waktu: '2026-10-20 08:30:15 WIB'
  },
  {
    log_id: 'LOG-002',
    aktor_sistem: 'Petugas PPOB',
    entitas: 'PEMBAYARAN',
    entitas_id: 'TRX-002',
    aksi: 'PEMBAYARAN_SUKSES',
    correlation_id: 'IDEMP-20261020-002-B88',
    sebelum: { status: 'DIPROSES' },
    sesudah: { status: 'SUKSES', ref_bank: 'BNK-20261020-002', nominal_pln: 450000 },
    waktu: '2026-10-20 08:45:22 WIB'
  },
  {
    log_id: 'LOG-003',
    aktor_sistem: 'Petugas PPOB',
    entitas: 'PEMBAYARAN',
    entitas_id: 'TRX-003',
    aksi: 'PEMBAYARAN_SUKSES',
    correlation_id: 'IDEMP-20261020-003-C77',
    sebelum: { status: 'DIPROSES' },
    sesudah: { status: 'SUKSES', ref_bank: 'BNK-20261020-003', nominal_pln: 450000 },
    waktu: '2026-10-20 09:05:00 WIB'
  },
  {
    log_id: 'LOG-004',
    aktor_sistem: 'Keuangan / Sistem Rekonsiliasi (W08)',
    entitas: 'DETAIL_REKONSILIASI',
    entitas_id: 'RKN-003',
    aksi: 'DETEKSI_SELISIH',
    correlation_id: 'RUN-RKN-20261020-01',
    sebelum: { status: 'DRAF' },
    sesudah: { ekspektasi: 450000, aktual: 400000, selisih: -50000, kasus_id: 'KAS-001' },
    waktu: '2026-10-20 09:15:00 WIB'
  },
  {
    log_id: 'LOG-005',
    aktor_sistem: 'Petugas Keuangan A',
    entitas: 'KASUS_SELISIH',
    entitas_id: 'KAS-001',
    aksi: 'PENGAJUAN_USULAN_KOREKSI',
    correlation_id: 'KAS-001-FLOW',
    sebelum: { status: 'TERBUKA' },
    sesudah: { status: 'DIAJUKAN', usulan: 'Minta pelengkapan transfer Rp50.000' },
    waktu: '2026-10-20 09:25:00 WIB'
  }
];

export const INITIAL_USERS: AppUser[] = [
  {
    user_id: 'USR-001',
    username: 'petugas',
    nama_lengkap: 'Ivan',
    email: 'ivan.loket@pln.co.id',
    telepon: '0812-9876-5432',
    role: 'PETUGAS_PPOB',
    unit_pln: 'Loket Gambir UP3 Menteng',
    status: 'AKTIF',
    last_login: '20 Okt 2026, 14:35 WIB',
    created_at: '2026-01-15'
  },
  {
    user_id: 'USR-002',
    username: 'keuangan',
    nama_lengkap: 'Valda',
    email: 'valda.keuangan@pln.co.id',
    telepon: '0811-2345-6789',
    role: 'KEUANGAN_DISTRIBUSI',
    unit_pln: 'UID Jakarta Raya - Divisi Keuangan',
    status: 'AKTIF',
    last_login: '20 Okt 2026, 14:42 WIB',
    created_at: '2026-01-10'
  },
  {
    user_id: 'USR-003',
    username: 'supervisor',
    nama_lengkap: 'Khurin',
    email: 'khurin.supervisor@pln.co.id',
    telepon: '0813-4567-8901',
    role: 'SUPERVISOR',
    unit_pln: 'UID Jakarta Raya - Pengawasan Kas',
    status: 'AKTIF',
    last_login: '20 Okt 2026, 11:20 WIB',
    created_at: '2026-01-05'
  },
  {
    user_id: 'USR-004',
    username: 'akuntansi',
    nama_lengkap: 'Levina',
    email: 'levina.akuntansi@pln.co.id',
    telepon: '0815-6789-0123',
    role: 'AKUNTANSI_UPJ',
    unit_pln: 'UP3 Jakarta Pusat - Akuntansi',
    status: 'AKTIF',
    last_login: '20 Okt 2026, 13:10 WIB',
    created_at: '2026-01-12'
  },
  {
    user_id: 'USR-005',
    username: 'admin',
    nama_lengkap: 'Admin',
    email: 'admin.ppob@pln.co.id',
    telepon: '0812-1111-2222',
    role: 'ADMIN',
    unit_pln: 'PLN Kantor Pusat - TI & Keamanan',
    status: 'AKTIF',
    last_login: '20 Okt 2026, 14:48 WIB',
    created_at: '2026-01-01'
  },
  {
    user_id: 'USR-006',
    username: 'pelanggan',
    nama_lengkap: 'Friz',
    email: 'friz.pelanggan@gmail.com',
    telepon: '0857-8901-2345',
    role: 'PELANGGAN',
    unit_pln: 'Konsumen Pascabayar R1/1300VA',
    status: 'AKTIF',
    last_login: '20 Okt 2026, 10:05 WIB',
    created_at: '2026-02-01'
  }
];

export const PERMISSION_ITEMS: PermissionItem[] = [
  // Transaksi & Kasir
  {
    key: 'inquiry_tagihan',
    label: 'Inquiry Tagihan Listrik',
    deskripsi: 'Mencari ID Pelanggan dan mengecek rincian tagihan PLN (W01)',
    kategori: 'TRANSAKSI'
  },
  {
    key: 'bayar_tagihan',
    label: 'Proses Pembayaran & Cetak Struk',
    deskripsi: 'Menerima pembayaran kas dan menerbitkan nomor referensi/struk (W05-W07)',
    kategori: 'TRANSAKSI'
  },
  {
    key: 'batal_transaksi',
    label: 'Pembatalan Transaksi Kasir',
    deskripsi: 'Melakukan void/pembatalan transaksi kasir sebelum proses settlement',
    kategori: 'TRANSAKSI'
  },
  {
    key: 'cetak_ulang_struk',
    label: 'Cetak Ulang Bukti Bayar',
    deskripsi: 'Mengunduh dan mencetak salinan struk bukti pembayaran sah',
    kategori: 'TRANSAKSI'
  },

  // Settlement & Perbankan
  {
    key: 'buat_settlement',
    label: 'Generate Batch Settlement',
    deskripsi: 'Membuat paket data transaksi loket untuk dikirimkan ke bank (W07A)',
    kategori: 'SETTLEMENT'
  },
  {
    key: 'upload_mutasi',
    label: 'Upload Mutasi Rekening Bank',
    deskripsi: 'Mengunggah rekening koran / mutasi kredit bank receipt (W07B)',
    kategori: 'SETTLEMENT'
  },
  {
    key: 'validasi_fee',
    label: 'Verifikasi Biaya Admin Kanal',
    deskripsi: 'Memeriksa selisih fee kanal agregator vs pendapatan PLN',
    kategori: 'SETTLEMENT'
  },

  // Rekonsiliasi & Investigasi
  {
    key: 'jalankan_rekonsiliasi',
    label: 'Eksekusi Pencocokan Otomatis',
    deskripsi: 'Menjalankan engine pencocokan 3-way matching settlement vs mutasi (W08)',
    kategori: 'REKONSILIASI'
  },
  {
    key: 'buat_kasus_selisih',
    label: 'Buka Tiket Investigasi Selisih',
    deskripsi: 'Membuka lembar kerja investigasi untuk transaksi selisih/pending (W09)',
    kategori: 'REKONSILIASI'
  },
  {
    key: 'approval_selisih',
    label: 'Otorisasi & Approval Selisih Kas',
    deskripsi: 'Menyetujui usulan penyelesaian selisih penerimaan dan pelengkap transfer (W10)',
    kategori: 'REKONSILIASI'
  },
  {
    key: 'write_off_selisih',
    label: 'Persetujuan Write-off Selisih',
    deskripsi: 'Memberikan wewenang pembebanan selisih ke rekening penampungan selisih',
    kategori: 'REKONSILIASI'
  },

  // Jurnal & Akuntansi
  {
    key: 'buat_draft_jurnal',
    label: 'Generate Draf Jurnal Penerimaan',
    deskripsi: 'Membuat draf jurnal double-entry otomatis hasil rekonsiliasi cocok (W11)',
    kategori: 'JURNAL'
  },
  {
    key: 'posting_buku_besar',
    label: 'Posting Jurnal ke General Ledger',
    deskripsi: 'Memposting jurnal draf ke Buku Besar (GL) ERP SAP PLN (W11B)',
    kategori: 'JURNAL'
  },
  {
    key: 'ekspor_laporan',
    label: 'Ekspor Laporan Keuangan & Audit',
    deskripsi: 'Mengunduh laporan rekapitulasi penerimaan harian/bulanan dalam PDF/Excel',
    kategori: 'JURNAL'
  },

  // Sistem & Administrasi
  {
    key: 'lihat_audit_log',
    label: 'Akses Jejak Audit Log Sistem',
    deskripsi: 'Melihat riwayat log audit perubahan data transaksi, sistem, dan aktor',
    kategori: 'SISTEM'
  },
  {
    key: 'kelola_pengguna',
    label: 'Manajemen Akun Pengguna',
    deskripsi: 'Menambah, mengubah profil, reset kata sandi, dan nonaktifkan pengguna',
    kategori: 'SISTEM'
  },
  {
    key: 'atur_permission',
    label: 'Konfigurasi Matriks Hak Akses',
    deskripsi: 'Mengubah dan menetapkan hak akses / permission untuk setiap role pengguna',
    kategori: 'SISTEM'
  }
];

export const INITIAL_ROLE_PERMISSIONS: Record<UserRole, Record<string, boolean>> = {
  PETUGAS_PPOB: {
    inquiry_tagihan: true,
    bayar_tagihan: true,
    batal_transaksi: true,
    cetak_ulang_struk: true,
    buat_settlement: false,
    upload_mutasi: false,
    validasi_fee: false,
    jalankan_rekonsiliasi: false,
    buat_kasus_selisih: false,
    approval_selisih: false,
    write_off_selisih: false,
    buat_draft_jurnal: false,
    posting_buku_besar: false,
    ekspor_laporan: false,
    lihat_audit_log: false,
    kelola_pengguna: false,
    atur_permission: false
  },
  KEUANGAN_DISTRIBUSI: {
    inquiry_tagihan: true,
    bayar_tagihan: false,
    batal_transaksi: false,
    cetak_ulang_struk: true,
    buat_settlement: true,
    upload_mutasi: true,
    validasi_fee: true,
    jalankan_rekonsiliasi: true,
    buat_kasus_selisih: true,
    approval_selisih: false,
    write_off_selisih: false,
    buat_draft_jurnal: true,
    posting_buku_besar: false,
    ekspor_laporan: true,
    lihat_audit_log: true,
    kelola_pengguna: false,
    atur_permission: false
  },
  SUPERVISOR: {
    inquiry_tagihan: true,
    bayar_tagihan: false,
    batal_transaksi: true,
    cetak_ulang_struk: true,
    buat_settlement: true,
    upload_mutasi: true,
    validasi_fee: true,
    jalankan_rekonsiliasi: true,
    buat_kasus_selisih: true,
    approval_selisih: true,
    write_off_selisih: true,
    buat_draft_jurnal: true,
    posting_buku_besar: true,
    ekspor_laporan: true,
    lihat_audit_log: true,
    kelola_pengguna: true,
    atur_permission: true
  },
  AKUNTANSI_UPJ: {
    inquiry_tagihan: true,
    bayar_tagihan: false,
    batal_transaksi: false,
    cetak_ulang_struk: true,
    buat_settlement: false,
    upload_mutasi: false,
    validasi_fee: true,
    jalankan_rekonsiliasi: true,
    buat_kasus_selisih: false,
    approval_selisih: false,
    write_off_selisih: false,
    buat_draft_jurnal: true,
    posting_buku_besar: true,
    ekspor_laporan: true,
    lihat_audit_log: true,
    kelola_pengguna: false,
    atur_permission: false
  },
  PELANGGAN: {
    inquiry_tagihan: true,
    bayar_tagihan: true,
    batal_transaksi: false,
    cetak_ulang_struk: true,
    buat_settlement: false,
    upload_mutasi: false,
    validasi_fee: false,
    jalankan_rekonsiliasi: false,
    buat_kasus_selisih: false,
    approval_selisih: false,
    write_off_selisih: false,
    buat_draft_jurnal: false,
    posting_buku_besar: false,
    ekspor_laporan: false,
    lihat_audit_log: false,
    kelola_pengguna: false,
    atur_permission: false
  },
  ADMIN: {
    inquiry_tagihan: true,
    bayar_tagihan: true,
    batal_transaksi: true,
    cetak_ulang_struk: true,
    buat_settlement: true,
    upload_mutasi: true,
    validasi_fee: true,
    jalankan_rekonsiliasi: true,
    buat_kasus_selisih: true,
    approval_selisih: true,
    write_off_selisih: true,
    buat_draft_jurnal: true,
    posting_buku_besar: true,
    ekspor_laporan: true,
    lihat_audit_log: true,
    kelola_pengguna: true,
    atur_permission: true
  }
};

