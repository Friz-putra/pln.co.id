import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Pelanggan,
  Tagihan,
  Pembayaran,
  Settlement,
  MutasiBank,
  DetailRekonsiliasi,
  KasusSelisih,
  Jurnal,
  AuditLog,
  Bank
} from '../types/ppob';
import {
  INITIAL_BANKS,
  INITIAL_PELANGGAN,
  INITIAL_TAGIHAN,
  INITIAL_PEMBAYARAN,
  INITIAL_SETTLEMENT,
  INITIAL_MUTASI_BANK,
  INITIAL_DETAIL_REKONSILIASI,
  INITIAL_KASUS_SELISIH,
  INITIAL_JURNAL,
  INITIAL_AUDIT_LOG
} from '../data/initialData';

export type PageId = 
  | 'dashboard'
  | 'pembayaran'
  | 'bukti'
  | 'settlement'
  | 'rekonsiliasi'
  | 'investigasi'
  | 'jurnal'
  | 'workflow'
  | 'erd'
  | 'audit'
  | 'portal_pelanggan';

interface PPOBContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedTrxId: string;
  setSelectedTrxId: (id: string) => void;
  selectedKasusId: string;
  setSelectedKasusId: (id: string) => void;
  selectedPelangganId: string;
  setSelectedPelangganId: (id: string) => void;
  
  // Data
  banks: Bank[];
  pelangganList: Pelanggan[];
  tagihanList: Tagihan[];
  pembayaranList: Pembayaran[];
  settlementList: Settlement[];
  mutasiBankList: MutasiBank[];
  rekonsiliasiList: DetailRekonsiliasi[];
  kasusSelisihList: KasusSelisih[];
  jurnalList: Jurnal[];
  auditLogs: AuditLog[];

  // Actions
  findPelangganWithTagihan: (nomor: string) => { pelanggan?: Pelanggan; tagihan?: Tagihan } | null;
  processPayment: (params: {
    pelangganId: string;
    tagihanId: string;
    nominalPln: number;
    adminKanal: number;
  }) => Promise<{ success: boolean; pembayaranId: string; error?: string }>;
  
  runReconciliation: (bankCode: string, date: string) => void;
  approveInvestigation: (kasusId: string, approve: boolean, notes?: string) => { success: boolean; message: string };
  completeDiscrepancyTransfer: (kasusId: string) => { success: boolean; message: string };
  updateKasusProposal: (kasusId: string, penyebab: string, usulan: string) => void;
  postJournals: (jurnalIds: string[]) => { success: boolean; count: number; error?: string };
  resetDataToDefault: () => void;
}

const PPOBContext = createContext<PPOBContextType | undefined>(undefined);

const STORAGE_KEY = 'sia_ppob_pln_state_v1';

export const PPOBProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('KEUANGAN_DISTRIBUSI');
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [selectedTrxId, setSelectedTrxId] = useState<string>('TRX-003');
  const [selectedKasusId, setSelectedKasusId] = useState<string>('KAS-001');
  const [selectedPelangganId, setSelectedPelangganId] = useState<string>('PEL-003');

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (role === 'PELANGGAN') {
      setActivePage('portal_pelanggan');
    } else if (activePage === 'portal_pelanggan') {
      setActivePage('dashboard');
    }
  };

  // Core state collections
  const [banks] = useState<Bank[]>(INITIAL_BANKS);
  const [pelangganList, setPelangganList] = useState<Pelanggan[]>(INITIAL_PELANGGAN);
  const [tagihanList, setTagihanList] = useState<Tagihan[]>(INITIAL_TAGIHAN);
  const [pembayaranList, setPembayaranList] = useState<Pembayaran[]>(INITIAL_PEMBAYARAN);
  const [settlementList, setSettlementList] = useState<Settlement[]>(INITIAL_SETTLEMENT);
  const [mutasiBankList, setMutasiBankList] = useState<MutasiBank[]>(INITIAL_MUTASI_BANK);
  const [rekonsiliasiList, setRekonsiliasiList] = useState<DetailRekonsiliasi[]>(INITIAL_DETAIL_REKONSILIASI);
  const [kasusSelisihList, setKasusSelisihList] = useState<KasusSelisih[]>(INITIAL_KASUS_SELISIH);
  const [jurnalList, setJurnalList] = useState<Jurnal[]>(INITIAL_JURNAL);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOG);

  // Load from local storage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pembayaranList) setPembayaranList(parsed.pembayaranList);
        if (parsed.tagihanList) setTagihanList(parsed.tagihanList);
        if (parsed.settlementList) setSettlementList(parsed.settlementList);
        if (parsed.mutasiBankList) setMutasiBankList(parsed.mutasiBankList);
        if (parsed.rekonsiliasiList) setRekonsiliasiList(parsed.rekonsiliasiList);
        if (parsed.kasusSelisihList) setKasusSelisihList(parsed.kasusSelisihList);
        if (parsed.jurnalList) setJurnalList(parsed.jurnalList);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      const payload = {
        pembayaranList,
        tagihanList,
        settlementList,
        mutasiBankList,
        rekonsiliasiList,
        kasusSelisihList,
        jurnalList,
        auditLogs
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [pembayaranList, tagihanList, settlementList, mutasiBankList, rekonsiliasiList, kasusSelisihList, jurnalList, auditLogs]);

  // Lookup customer and bill
  const findPelangganWithTagihan = (nomor: string) => {
    const cleanNo = nomor.trim();
    const pel = pelangganList.find(p => p.nomor_pelanggan === cleanNo);
    if (!pel) return null;
    const tagihan = tagihanList.find(t => t.pelanggan_id === pel.pelanggan_id);
    return { pelanggan: pel, tagihan };
  };

  // Payment process simulation (W01-W07)
  const processPayment = async ({
    pelangganId,
    tagihanId,
    nominalPln,
    adminKanal
  }: {
    pelangganId: string;
    tagihanId: string;
    nominalPln: number;
    adminKanal: number;
  }): Promise<{ success: boolean; pembayaranId: string; error?: string }> => {
    const pel = pelangganList.find(p => p.pelanggan_id === pelangganId);
    const tag = tagihanList.find(t => t.tagihan_id === tagihanId);

    if (!pel || !tag) {
      return { success: false, pembayaranId: '', error: 'Data pelanggan atau tagihan tidak ditemukan' };
    }

    if (tag.status === 'LUNAS') {
      return { success: false, pembayaranId: '', error: 'Tagihan untuk periode ini sudah LUNAS' };
    }

    // Sequence identifiers
    const nextIdx = pembayaranList.length + 1;
    const padIdx = String(nextIdx).padStart(3, '0');
    const newTrxId = `TRX-${padIdx}`;
    const newBankRef = `BNK-20261020-${padIdx}`;
    const newIdempKey = `IDEMP-20261020-${padIdx}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newSetId = `SET-${padIdx}`;
    const newMutId = `MUT-${padIdx}`;
    const newTfRef = `TF-${padIdx}`;
    const newRknId = `RKN-${padIdx}`;
    const newJrnId = `JRN-${padIdx}`;
    const nowWIB = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';

    // 1. Mark Tagihan LUNAS (W06A)
    const updatedTagihan = tagihanList.map(t => 
      t.tagihan_id === tagihanId ? { ...t, status: 'LUNAS' as const } : t
    );
    setTagihanList(updatedTagihan);

    // 2. Create Pembayaran (W05)
    const newPembayaran: Pembayaran = {
      pembayaran_id: newTrxId,
      point_id: 'PPOB-JKT-01',
      petugas_id: 'USR-PETUGAS-01',
      idempotency_key: newIdempKey,
      ref_bank: newBankRef,
      nominal_pln: nominalPln,
      admin: adminKanal,
      status: 'SUKSES',
      waktu_bayar: `2026-10-20 ${nowWIB}`,
      nomor_pelanggan: pel.nomor_pelanggan,
      nama_pelanggan: pel.nama,
      periode_tagihan: tag.periode,
      tagihan_id: tag.tagihan_id
    };
    setPembayaranList(prev => [...prev, newPembayaran]);

    // 3. Create Settlement (W06B)
    const newSettlement: Settlement = {
      settlement_id: newSetId,
      bank_id: 'BANK-01',
      ref_settlement: newTfRef,
      tanggal: '2026-10-20',
      status: 'DITERIMA',
      pembayaran_id: newTrxId,
      nominal_pln: nominalPln
    };
    setSettlementList(prev => [...prev, newSettlement]);

    // 4. Create Mutasi Bank (W06B)
    const newMutasi: MutasiBank = {
      mutasi_id: newMutId,
      bank_id: 'BANK-01',
      ref_transfer: newTfRef,
      waktu_mutasi: `2026-10-20 ${nowWIB}`,
      kredit: nominalPln, // full transfer
      keterangan: `Settlement PPOB PLN Batch ${nextIdx} - ${newTrxId}`
    };
    setMutasiBankList(prev => [...prev, newMutasi]);

    // 5. Create Detail Rekonsiliasi (W08)
    const newRecon: DetailRekonsiliasi = {
      hasil_id: newRknId,
      rekonsiliasi_id: 'RKN-20261020-01',
      settlement_id: newSetId,
      mutasi_id: newMutId,
      status_hasil: 'COCOK',
      ekspektasi: nominalPln,
      aktual: nominalPln,
      selisih: 0,
      tindakan: 'Siap jurnal'
    };
    setRekonsiliasiList(prev => [...prev, newRecon]);

    // 6. Create Draft Journal (W11)
    const newJurnal: Jurnal = {
      jurnal_id: newJrnId,
      hasil_id: newRknId,
      settlement_id: newSetId,
      unit_id: 'UPJ Simulasi',
      pembuat_id: 'USR-AKUNTANSI-01',
      tanggal: '2026-10-20',
      status: 'DRAF',
      total_debit: nominalPln,
      total_kredit: nominalPln,
      keterangan: `Penerimaan Kas PPOB PLN - ${newSetId} / ${newTrxId} Pelanggan ${pel.nomor_pelanggan}`,
      detail: [
        {
          baris_id: `B-${padIdx}-1`,
          jurnal_id: newJrnId,
          kode_akun: '1101',
          nama_akun: 'Kas / Bank receipt PLN',
          debit: nominalPln,
          kredit: 0,
          keterangan: `Penerimaan dana terkonfirmasi hasil rekonsiliasi ${newRknId}`
        },
        {
          baris_id: `B-${padIdx}-2`,
          jurnal_id: newJrnId,
          kode_akun: '1201',
          nama_akun: 'Piutang pelanggan',
          debit: 0,
          kredit: nominalPln,
          keterangan: `Pelunasan piutang tagihan pelanggan periode ${tag.periode}`
        }
      ]
    };
    setJurnalList(prev => [...prev, newJurnal]);

    // 7. Audit log
    const newLog: AuditLog = {
      log_id: `LOG-${padIdx}`,
      aktor_sistem: 'Petugas PPOB & Switching PLN (W01-W07)',
      entitas: 'PEMBAYARAN',
      entitas_id: newTrxId,
      aksi: 'TRANSAKSI_LUNAS_TERVERIFIKASI',
      correlation_id: newIdempKey,
      sebelum: { status_tagihan: 'BELUM LUNAS' },
      sesudah: { status: 'SUKSES', nominal_pln: nominalPln, ref_bank: newBankRef },
      waktu: `2026-10-20 ${nowWIB}`
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setSelectedTrxId(newTrxId);
    return { success: true, pembayaranId: newTrxId };
  };

  // Re-run automatic reconciliation
  const runReconciliation = (_bankCode: string, _date: string) => {
    // Re-check each settlement with mutasi bank
    const recomputed = settlementList.map((set, idx) => {
      const mut = mutasiBankList.find(m => m.ref_transfer === set.ref_settlement);
      const existing = rekonsiliasiList.find(r => r.settlement_id === set.settlement_id);

      const ekspektasi = set.nominal_pln;
      const aktual = mut ? mut.kredit : 0;
      const selisih = aktual - ekspektasi;

      let status_hasil: 'COCOK' | 'SELISIH' | 'TERTUNDA' = 'COCOK';
      let tindakan = 'Siap jurnal';

      if (!mut) {
        status_hasil = 'TERTUNDA';
        tindakan = 'Tunggu mutasi bank';
      } else if (selisih !== 0) {
        status_hasil = 'SELISIH';
        tindakan = `Buka ${existing?.kasus_id || 'KAS-001'}`;
      }

      return {
        hasil_id: existing ? existing.hasil_id : `RKN-${String(idx + 1).padStart(3, '0')}`,
        rekonsiliasi_id: 'RKN-20261020-01',
        settlement_id: set.settlement_id,
        mutasi_id: mut ? mut.mutasi_id : null,
        status_hasil,
        ekspektasi,
        aktual,
        selisih,
        kasus_id: existing?.kasus_id,
        tindakan
      };
    });

    setRekonsiliasiList(recomputed);

    const newLog: AuditLog = {
      log_id: `LOG-RECON-${Date.now().toString().slice(-4)}`,
      aktor_sistem: `${currentRole} (W08)`,
      entitas: 'REKONSILIASI',
      entitas_id: 'RKN-20261020-01',
      aksi: 'JALANKAN_PENCOCOKAN_OTOMATIS',
      correlation_id: `RKN-RUN-${Date.now()}`,
      sebelum: null,
      sesudah: { total_items: recomputed.length, matched: recomputed.filter(r => r.status_hasil === 'COCOK').length },
      waktu: `2026-10-20 ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Update proposal by Keuangan
  const updateKasusProposal = (kasusId: string, penyebab: string, usulan: string) => {
    setKasusSelisihList(prev => prev.map(k => {
      if (k.kasus_id === kasusId) {
        return {
          ...k,
          penyebab,
          usulan,
          status: 'DIAJUKAN',
          riwayat: [
            ...k.riwayat,
            {
              waktu: `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
              aktor: 'Petugas Keuangan',
              keterangan: 'Penyebab dan usulan tindak lanjut diperbarui.',
              status: 'DIAJUKAN'
            }
          ]
        };
      }
      return k;
    }));
  };

  // Supervisor Approval (W10) - Segregation of duties enforced
  const approveInvestigation = (kasusId: string, approve: boolean, notes?: string) => {
    if (currentRole !== 'SUPERVISOR' && currentRole !== 'ADMIN') {
      return {
        success: false,
        message: 'Akses Ditolak: Hanya role SUPERVISOR atau ADMIN yang memiliki otorisasi persetujuan investigasi (Pemisahan Tugas W10).'
      };
    }

    const target = kasusSelisihList.find(k => k.kasus_id === kasusId);
    if (!target) return { success: false, message: 'Kasus selisih tidak ditemukan' };

    const newStatus = approve ? 'DISETUJUI' : 'DIKEMBALIKAN';
    const nowTime = `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const updated = kasusSelisihList.map(k => {
      if (k.kasus_id === kasusId) {
        return {
          ...k,
          status: newStatus as any,
          penyetuju_id: 'USR-SPV-01',
          penyetuju_nama: 'Supervisor Keuangan & Pendapatan',
          riwayat: [
            ...k.riwayat,
            {
              waktu: nowTime,
              aktor: 'Supervisor Keuangan (W10)',
              keterangan: approve 
                ? (notes || 'Usulan disetujui. Menunggu penerimaan pelengkapan dana oleh bank aggregator.')
                : (notes || 'Usulan dikembalikan untuk perbaikan verifikasi.'),
              status: newStatus as any
            }
          ]
        };
      }
      return k;
    });

    setKasusSelisihList(updated);

    setAuditLogs(prev => [
      {
        log_id: `LOG-APPR-${Date.now().toString().slice(-4)}`,
        aktor_sistem: 'Supervisor Keuangan (W10)',
        entitas: 'KASUS_SELISIH',
        entitas_id: kasusId,
        aksi: approve ? 'PERSETUJUAN_USULAN_SELESAI' : 'REVISI_USULAN_DIMINTA',
        correlation_id: `SPV-APPR-${kasusId}`,
        sebelum: { status: target.status },
        sesudah: { status: newStatus },
        waktu: `2026-10-20 ${nowTime}`
      },
      ...prev
    ]);

    return {
      success: true,
      message: approve 
        ? 'Usulan investigasi berhasil disetujui oleh Supervisor!' 
        : 'Kasus berhasil dikembalikan ke Keuangan untuk revisi.'
    };
  };

  // Complete Discrepancy Transfer (+50.000) simulation
  const completeDiscrepancyTransfer = (kasusId: string) => {
    const target = kasusSelisihList.find(k => k.kasus_id === kasusId);
    if (!target) return { success: false, message: 'Kasus tidak ditemukan' };

    // 1. Update Mutasi Bank credit to full 450.000
    setMutasiBankList(prev => prev.map(m => {
      if (m.mutasi_id === target.mutasi_id) {
        return {
          ...m,
          kredit: 450000,
          keterangan: 'Settlement PPOB PLN Batch 3 - Pelunasan transfer susulan +Rp50.000 terverifikasi'
        };
      }
      return m;
    }));

    // 2. Update Detail Rekonsiliasi to COCOK
    setRekonsiliasiList(prev => prev.map(r => {
      if (r.settlement_id === target.settlement_id) {
        return {
          ...r,
          aktual: 450000,
          selisih: 0,
          status_hasil: 'COCOK',
          tindakan: 'Siap jurnal'
        };
      }
      return r;
    }));

    // 3. Update Kasus to SELESAI
    const nowTime = `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
    setKasusSelisihList(prev => prev.map(k => {
      if (k.kasus_id === kasusId) {
        return {
          ...k,
          aktual: 450000,
          kekurangan: 0,
          status: 'SELESAI',
          riwayat: [
            ...k.riwayat,
            {
              waktu: nowTime,
              aktor: 'Bank Aggregator & Rekonsiliasi Otomatis',
              keterangan: 'Pelengkapan transfer Rp50.000 diterima & rekonsiliasi berhasil COCOK (0 selisih). Kasus ditutup.',
              status: 'SELESAI'
            }
          ]
        };
      }
      return k;
    }));

    // 4. Create Jurnal for SET-003 now that it's matched!
    const existingJrn = jurnalList.find(j => j.settlement_id === target.settlement_id);
    if (!existingJrn) {
      const newJrn: Jurnal = {
        jurnal_id: 'JRN-003',
        hasil_id: target.hasil_id,
        settlement_id: target.settlement_id,
        unit_id: 'UPJ Simulasi',
        pembuat_id: 'USR-AKUNTANSI-01',
        tanggal: '2026-10-20',
        status: 'DRAF',
        total_debit: 450000,
        total_kredit: 450000,
        keterangan: `Penerimaan Kas PPOB PLN - ${target.settlement_id} (Paska Resolusi Selisih)`,
        detail: [
          {
            baris_id: 'B-05',
            jurnal_id: 'JRN-003',
            kode_akun: '1101',
            nama_akun: 'Kas / Bank receipt PLN',
            debit: 450000,
            kredit: 0,
            keterangan: 'Penerimaan dana terkonfirmasi paska penutupan kasus KAS-001'
          },
          {
            baris_id: 'B-06',
            jurnal_id: 'JRN-003',
            kode_akun: '1201',
            nama_akun: 'Piutang pelanggan',
            debit: 0,
            kredit: 450000,
            keterangan: 'Pelunasan piutang pelanggan periode Oktober 2026'
          }
        ]
      };
      setJurnalList(prev => [...prev, newJrn]);
    }

    setAuditLogs(prev => [
      {
        log_id: `LOG-RESOLVE-${Date.now().toString().slice(-4)}`,
        aktor_sistem: 'Sistem Integrasi Perbankan & Rekonsiliasi',
        entitas: 'KASUS_SELISIH',
        entitas_id: kasusId,
        aksi: 'PELUNASAN_DANA_DAN_RESOLUSI_KASUS',
        correlation_id: `RES-${kasusId}`,
        sebelum: { status: 'DISETUJUI', kekurangan: 50000 },
        sesudah: { status: 'SELESAI', kekurangan: 0, hasil_rekonsiliasi: 'COCOK' },
        waktu: `2026-10-20 ${nowTime}`
      },
      ...prev
    ]);

    return {
      success: true,
      message: 'Pelengkapan transfer Rp50.000 berhasil dicatatkan! Hasil rekonsiliasi kini COCOK dan siap dijurnal.'
    };
  };

  // Post journals to general ledger (W11)
  const postJournals = (jurnalIds: string[]) => {
    // Check if any belongs to an unresolved discrepancy
    const blockedJurnals = jurnalList.filter(j => {
      if (!jurnalIds.includes(j.jurnal_id)) return false;
      const rekon = rekonsiliasiList.find(r => r.settlement_id === j.settlement_id);
      return rekon && rekon.status_hasil === 'SELISIH';
    });

    if (blockedJurnals.length > 0) {
      return {
        success: false,
        count: 0,
        error: `Gagal posting: Jurnal ${blockedJurnals.map(j => j.jurnal_id).join(', ')} diblokir karena masih dalam kasus selisih yang belum selesai.`
      };
    }

    setJurnalList(prev => prev.map(j => {
      if (jurnalIds.includes(j.jurnal_id)) {
        return { ...j, status: 'POSTED' };
      }
      return j;
    }));

    const nowTime = `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
    setAuditLogs(prev => [
      {
        log_id: `LOG-POST-${Date.now().toString().slice(-4)}`,
        aktor_sistem: `${currentRole} (W11)`,
        entitas: 'JURNAL',
        entitas_id: jurnalIds.join(', '),
        aksi: 'POSTING_JURNAL_KE_BUKU_BESAR',
        correlation_id: `POST-BATCH-${Date.now().toString().slice(-4)}`,
        sebelum: { status: 'DRAF' },
        sesudah: { status: 'POSTED', posted_count: jurnalIds.length },
        waktu: `2026-10-20 ${nowTime}`
      },
      ...prev
    ]);

    return {
      success: true,
      count: jurnalIds.length
    };
  };

  // Reset to default
  const resetDataToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPelangganList(INITIAL_PELANGGAN);
    setTagihanList(INITIAL_TAGIHAN);
    setPembayaranList(INITIAL_PEMBAYARAN);
    setSettlementList(INITIAL_SETTLEMENT);
    setMutasiBankList(INITIAL_MUTASI_BANK);
    setRekonsiliasiList(INITIAL_DETAIL_REKONSILIASI);
    setKasusSelisihList(INITIAL_KASUS_SELISIH);
    setJurnalList(INITIAL_JURNAL);
    setAuditLogs(INITIAL_AUDIT_LOG);
    setSelectedTrxId('TRX-003');
    setSelectedKasusId('KAS-001');
    setActivePage('dashboard');
  };

  return (
    <PPOBContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activePage,
        setActivePage,
        selectedTrxId,
        setSelectedTrxId,
        selectedKasusId,
        setSelectedKasusId,
        selectedPelangganId,
        setSelectedPelangganId,
        banks,
        pelangganList,
        tagihanList,
        pembayaranList,
        settlementList,
        mutasiBankList,
        rekonsiliasiList,
        kasusSelisihList,
        jurnalList,
        auditLogs,
        findPelangganWithTagihan,
        processPayment,
        runReconciliation,
        approveInvestigation,
        completeDiscrepancyTransfer,
        updateKasusProposal,
        postJournals,
        resetDataToDefault
      }}
    >
      {children}
    </PPOBContext.Provider>
  );
};

export const usePPOB = () => {
  const context = useContext(PPOBContext);
  if (!context) {
    throw new Error('usePPOB must be used within a PPOBProvider');
  }
  return context;
};
