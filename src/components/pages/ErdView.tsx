import React, { useState } from 'react';
import { 
  Database, 
  Key, 
  Layers, 
  ShieldAlert, 
  CheckCircle, 
  Lock, 
  FileCode,
  BookOpen
} from 'lucide-react';

export const ErdView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'erd01' | 'erd02' | 'erd03' | 'rules'>('erd01');

  const rulesList = [
    {
      num: '01',
      title: 'Kunci dan tipe data',
      desc: 'UUID untuk transaksi lintas sistem; bigint untuk master. Nomor pelanggan, rekening dan referensi disimpan sebagai teks agar nol awal tetap utuh. Uang memakai numeric(18,2), bukan float. Timestamp disimpan dengan zona waktu; tampilan UI WIB.'
    },
    {
      num: '02',
      title: 'Keunikan dan relasi',
      desc: 'UK TAGIHAN(pelanggan_id, periode). FK aktif dengan ON DELETE RESTRICT pada transaksi. Master dinonaktifkan tanpa menghapus riwayat. UK DETAIL_SETTLEMENT(pembayaran_id); UK JURNAL(hasil_id). Total settlement diturunkan dari detail.'
    },
    {
      num: '03',
      title: 'Cegah pembayaran ganda',
      desc: 'Idempotency key unik untuk satu permintaan. Ref bank unik per bank melalui payment point; divalidasi saat penerimaan callback. Kunci baris tagihan saat finalisasi. Satu alokasi efektif sukses per tagihan ditegakkan dalam transaksi atomik/trigger lintas tabel.'
    },
    {
      num: '04',
      title: 'Validasi nominal',
      desc: 'Pokok, denda dan admin ≥ 0; alokasi > 0. Jumlah alokasi = nominal_pln untuk pembayaran sukses. Pelunasan penuh = pokok + denda. Admin kanal tidak masuk penerimaan PLN pada contoh. Selisih = aktual - ekspektasi; toleransi contoh Rp0.'
    },
    {
      num: '05',
      title: 'Rekonsiliasi dan run ulang',
      desc: 'DETAIL_REKONSILIASI wajib memiliki settlement_id atau mutasi_id. Pasangan lengkap: unik (run, settlement, mutasi). Data tanpa pasangan tetap disimpan sebagai TERTUNDA/TIDAK_TERIDENTIFIKASI. Satu settlement dan mutasi hanya boleh digunakan sekali pada hasil final yang dibukukan.'
    },
    {
      num: '06',
      title: 'Mesin status',
      desc: 'Pembayaran: BARU → DIPROSES → SUKSES/GAGAL; TIMEOUT = MENUNGGU_KONFIRMASI, bukan gagal final. Settlement: DIJADWALKAN → DIKIRIM → DITERIMA. Rekonsiliasi: DRAF → DIPROSES → SELESAI. Kasus: TERBUKA → DIAJUKAN → DISETUJUI/DIKEMBALIKAN → SELESAI.'
    },
    {
      num: '07',
      title: 'Posting dan koreksi',
      desc: 'Per baris jurnal hanya satu sisi positif (debit atau kredit). Saat POSTED, SUM(debit)=SUM(kredit) melalui prosedur posting/constraint trigger. Kasus selisih belum selesai memblokir posting hasil tersebut. Hasil lain yang sudah cocok boleh dibukukan terpisah.'
    },
    {
      num: '08',
      title: 'Integrasi dan keamanan',
      desc: 'Bank serta switching adalah sistem eksternal; simpan referensi dan correlation_id, tanpa menyimpan saldo otoritatif bank. Verifikasi callback, gunakan retry idempoten, pembatasan akses per unit, hash kata sandi, dan audit append-only. Transfer bank dan status tagihan dapat selesai pada waktu berbeda.'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Database Design • ERD & Aturan Implementasi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Target konseptual PostgreSQL • 18 tabel unik • Skema logis dengan atribut fisik & kardinalitas bisnis
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('erd01')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'erd01'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ERD 01: Tagihan & Pembayaran
        </button>
        <button
          onClick={() => setActiveTab('erd02')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'erd02'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ERD 02: Settlement & Rekonsiliasi
        </button>
        <button
          onClick={() => setActiveTab('erd03')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'erd03'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ERD 03: Pembukuan & Jejak Audit
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'rules'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          8 Aturan Implementasi
        </button>
      </div>

      {/* ERD 01 Content */}
      {activeTab === 'erd01' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Table Card 1 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>UNIT_PLN</span>
                <span className="text-sky-300">Master</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK unit_id : bigint</div>
                <div className="pt-1 text-slate-700">UK kode_unit : varchar(20)</div>
                <div className="pt-1 text-slate-700">nama_unit : varchar(100)</div>
                <div className="pt-1 text-slate-700">jenis_unit : varchar(15)</div>
              </div>
            </div>

            {/* Table Card 2 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>PELANGGAN</span>
                <span className="text-sky-300">Master</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK pelanggan_id : bigint</div>
                <div className="pt-1 text-sky-800">FK unit_id → UNIT_PLN</div>
                <div className="pt-1 text-slate-700">UK nomor_pelanggan : varchar(20)</div>
                <div className="pt-1 text-slate-700">nama : varchar(100)</div>
                <div className="pt-1 text-slate-700">alamat : text</div>
              </div>
            </div>

            {/* Table Card 3 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>TAGIHAN</span>
                <span className="text-sky-300">Transaksi</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK tagihan_id : bigint</div>
                <div className="pt-1 text-sky-800">FK pelanggan_id → PELANGGAN</div>
                <div className="pt-1 text-slate-700">periode : date</div>
                <div className="pt-1 text-slate-700">pokok, denda : numeric(18,2)</div>
                <div className="pt-1 text-slate-700">jatuh_tempo : date</div>
                <div className="pt-1 text-slate-700">status : varchar(20)</div>
              </div>
            </div>

            {/* Table Card 4 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>PAYMENT_POINT</span>
                <span className="text-sky-300">Kanal</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK point_id : bigint</div>
                <div className="pt-1 text-sky-800">FK bank_id → BANK</div>
                <div className="pt-1 text-slate-700">UK kode_point : varchar(30)</div>
                <div className="pt-1 text-slate-700">nama_point : varchar(100)</div>
                <div className="pt-1 text-slate-700">status_aktif : boolean</div>
              </div>
            </div>

            {/* Table Card 5 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>PEMBAYARAN</span>
                <span className="text-sky-300">Transaksi Utama</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK pembayaran_id : uuid</div>
                <div className="pt-1 text-sky-800">FK point_id → PAYMENT_POINT</div>
                <div className="pt-1 text-sky-800">FK petugas_id → PENGGUNA</div>
                <div className="pt-1 text-slate-700">UK idempotency_key : varchar(100)</div>
                <div className="pt-1 text-slate-700">ref_bank : varchar(100) [UK/bank]</div>
                <div className="pt-1 text-slate-700">nominal_pln, admin : numeric(18,2)</div>
                <div className="pt-1 text-slate-700">status : varchar(20)</div>
                <div className="pt-1 text-slate-700">waktu_bayar : timestamptz</div>
              </div>
            </div>

            {/* Table Card 6 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>ALOKASI_BAYAR</span>
                <span className="text-sky-300">Jembatan N:M</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK alokasi_id : bigint</div>
                <div className="pt-1 text-sky-800">FK pembayaran_id → PEMBAYARAN</div>
                <div className="pt-1 text-sky-800">FK tagihan_id → TAGIHAN</div>
                <div className="pt-1 text-slate-700">nominal : numeric(18,2)</div>
                <div className="pt-1 text-slate-700">UK (pembayaran_id, tagihan_id)</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
            <div className="font-bold">Aturan Transaksi Tagihan & Pembayaran:</div>
            <p className="leading-relaxed text-slate-700">
              PELANGGAN 1 : 0..N TAGIHAN. Satu pembayaran dapat melunasi beberapa periode melalui ALOKASI_BAYAR. Percobaan gagal tetap disimpan; hanya pembayaran SUKSES mengubah tagihan menjadi LUNAS. Dalam rancangan ini tidak ada cicilan: satu tagihan hanya boleh memiliki satu alokasi efektif yang sukses. Biaya admin dipisahkan dari nominal hak PLN.
            </p>
          </div>
        </div>
      )}

      {/* ERD 02 Content */}
      {activeTab === 'erd02' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>SETTLEMENT</span>
                <span className="text-sky-300">Batch Perbankan</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK settlement_id : uuid</div>
                <div className="pt-1 text-sky-800">FK bank_id → BANK</div>
                <div className="pt-1 text-slate-700">UK (bank_id, ref_settlement)</div>
                <div className="pt-1 text-slate-700">tanggal : date</div>
                <div className="pt-1 text-slate-700">status : varchar(20)</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>DETAIL_SETTLEMENT</span>
                <span className="text-sky-300">Detail Agregasi</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK detail_id : bigint</div>
                <div className="pt-1 text-sky-800">FK settlement_id → SETTLEMENT</div>
                <div className="pt-1 text-sky-800">FK pembayaran_id → PEMBAYARAN</div>
                <div className="pt-1 text-slate-700">UK pembayaran_id</div>
                <div className="pt-1 text-slate-700">nominal_pln : numeric(18,2)</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>MUTASI_BANK</span>
                <span className="text-sky-300">Rekening Koran</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK mutasi_id : uuid</div>
                <div className="pt-1 text-sky-800">FK bank_id → BANK</div>
                <div className="pt-1 text-slate-700">UK (bank_id, ref_mutasi)</div>
                <div className="pt-1 text-slate-700">ref_transfer : varchar(100)</div>
                <div className="pt-1 text-slate-700">waktu_mutasi : timestamptz</div>
                <div className="pt-1 text-slate-700">kredit : numeric(18,2)</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>REKONSILIASI</span>
                <span className="text-sky-300">Run Batch</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK rekonsiliasi_id : uuid</div>
                <div className="pt-1 text-sky-800">FK bank_id → BANK</div>
                <div className="pt-1 text-sky-800">FK petugas_id → PENGGUNA</div>
                <div className="pt-1 text-slate-700">periode_awal, akhir : date</div>
                <div className="pt-1 text-slate-700">status : varchar(20)</div>
                <div className="pt-1 text-slate-700">dibuat_pada : timestamptz</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>DETAIL_REKONSILIASI</span>
                <span className="text-sky-300">Hasil Pencocokan</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK hasil_id : uuid</div>
                <div className="pt-1 text-sky-800">FK rekonsiliasi_id → REKONSILIASI</div>
                <div className="pt-1 text-sky-800">FK settlement_id [nullable]</div>
                <div className="pt-1 text-sky-800">FK mutasi_id [nullable]</div>
                <div className="pt-1 text-slate-700">status_hasil : varchar(20)</div>
                <div className="pt-1 text-slate-700">ekspektasi, aktual : numeric(18,2)</div>
                <div className="pt-1 text-slate-700">selisih : numeric(18,2) [turunan]</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>KASUS_SELISIH</span>
                <span className="text-rose-300">Investigasi</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK kasus_id : uuid</div>
                <div className="pt-1 text-sky-800">FK hasil_id → DETAIL_REKONSILIASI</div>
                <div className="pt-1 text-sky-800">FK pembuat_id → PENGGUNA</div>
                <div className="pt-1 text-sky-800">FK penyetuju_id → PENGGUNA</div>
                <div className="pt-1 text-slate-700">penyebab, bukti_uri, usulan : text</div>
                <div className="pt-1 text-slate-700">status : varchar(20)</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
            <div className="font-bold">Kardinalitas Khusus & Pencocokan 4-Vektor:</div>
            <p className="leading-relaxed text-slate-700">
              Pencocokan menggunakan <strong>bank + referensi transfer + nominal + tanggal</strong>. Nominal sama saja tidak cukup untuk menetapkan COCOK. Satu pembayaran sukses masuk maksimal satu settlement (0..1). Satu hasil rekonsiliasi merujuk 0..1 settlement dan 0..1 mutasi; salah satu harus terisi.
            </p>
          </div>
        </div>
      )}

      {/* ERD 03 Content */}
      {activeTab === 'erd03' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>PENGGUNA</span>
                <span className="text-sky-300">RBAC User</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK pengguna_id : bigint</div>
                <div className="pt-1 text-sky-800">FK unit_id → UNIT_PLN</div>
                <div className="pt-1 text-sky-800">FK point_id → PAYMENT_POINT</div>
                <div className="pt-1 text-slate-700">UK username : varchar(60)</div>
                <div className="pt-1 text-slate-700">role : varchar(30)</div>
                <div className="pt-1 text-slate-700">status_aktif : boolean</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>JURNAL</span>
                <span className="text-sky-300">Header Pembukuan</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK jurnal_id : uuid</div>
                <div className="pt-1 text-sky-800">FK hasil_id → DETAIL_REKONSILIASI</div>
                <div className="pt-1 text-sky-800">FK unit_id → UNIT_PLN</div>
                <div className="pt-1 text-sky-800">FK pembuat_id → PENGGUNA</div>
                <div className="pt-1 text-slate-700">UK hasil_id</div>
                <div className="pt-1 text-slate-700">tanggal : date; status : varchar(20)</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>DETAIL_JURNAL</span>
                <span className="text-sky-300">Double Entry Row</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK baris_id : bigint</div>
                <div className="pt-1 text-sky-800">FK jurnal_id → JURNAL</div>
                <div className="pt-1 text-sky-800">FK akun_id → AKUN</div>
                <div className="pt-1 text-slate-700">debit, kredit : numeric(18,2)</div>
                <div className="pt-1 text-slate-700">keterangan : text</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>AKUN</span>
                <span className="text-sky-300">Chart of Accounts</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK akun_id : bigint</div>
                <div className="pt-1 text-slate-700">UK kode_akun : varchar(20)</div>
                <div className="pt-1 text-slate-700">nama_akun : varchar(100)</div>
                <div className="pt-1 text-slate-700">tipe_akun : varchar(20)</div>
                <div className="pt-1 text-slate-700">status_aktif : boolean</div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden md:col-span-2">
              <div className="bg-[#0e2a47] text-white px-4 py-2 font-mono text-xs font-bold flex justify-between">
                <span>AUDIT_LOG</span>
                <span className="text-emerald-300">Immutable Audit Trail</span>
              </div>
              <div className="p-3.5 text-xs font-mono space-y-1.5 divide-y divide-slate-100">
                <div className="text-amber-800 font-bold">PK log_id : uuid</div>
                <div className="pt-1 text-sky-800">FK pengguna_id → PENGGUNA [null for system]</div>
                <div className="pt-1 text-slate-700">aktor_sistem, entitas, aksi, correlation_id : varchar</div>
                <div className="pt-1 text-slate-700">sebelum, sesudah : jsonb</div>
                <div className="pt-1 text-slate-700">waktu : timestamptz</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
            <div className="font-bold">Kontrol Pembukuan & Otorisasi:</div>
            <p className="leading-relaxed text-slate-700">
              Hasil final COCOK mempunyai maksimal satu jurnal (0..1). Jurnal terposting wajib memiliki minimal dua baris, <strong>total debit = total kredit</strong>, dan tidak dapat dihapus. Koreksi memakai jurnal pembalik. Laporan dihitung dari transaksi dan jurnal, bukan tabel duplikat.
            </p>
          </div>
        </div>
      )}

      {/* 8 Rules Content */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rulesList.map(rule => (
            <div key={rule.num} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-sky-100 text-sky-800 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                  {rule.num}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {rule.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
