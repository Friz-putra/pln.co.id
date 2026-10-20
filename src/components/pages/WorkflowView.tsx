import React from 'react';
import { 
  GitMerge, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Users, 
  Layers 
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';

interface WorkflowSpec {
  id: string;
  pelaksana: string;
  pemicu: string;
  ioTabel: string;
  aturan: string;
  wireframe: string;
  pageTarget?: string;
}

const WORKFLOW_SPECS: WorkflowSpec[] = [
  {
    id: 'W01',
    pelaksana: 'Petugas PPOB',
    pemicu: 'Pelanggan memberikan ID',
    ioTabel: 'PELANGGAN, TAGIHAN → info tagihan',
    aturan: 'ID valid dan ada tagihan terbuka; tidak ditemukan → perbaiki ID',
    wireframe: '08 Pembayaran',
    pageTarget: 'pembayaran'
  },
  {
    id: 'W02',
    pelaksana: 'Petugas PPOB',
    pemicu: 'Konfirmasi data dan nominal',
    ioTabel: 'TAGIHAN → PEMBAYARAN + ALOKASI',
    aturan: 'Kirim sekali dengan idempotency key; perubahan nominal tidak diperbolehkan',
    wireframe: '08 Pembayaran',
    pageTarget: 'pembayaran'
  },
  {
    id: 'W03',
    pelaksana: 'Switching / sistem',
    pemicu: 'Permintaan pembayaran diterima',
    ioTabel: 'PEMBAYARAN → status DIPROSES',
    aturan: 'Validasi format, routing dan duplikasi. Duplikat → kembalikan hasil lama',
    wireframe: '09 Status',
    pageTarget: 'bukti'
  },
  {
    id: 'W04',
    pelaksana: 'Bank mitra',
    pemicu: 'Validasi data dan saldo deposit',
    ioTabel: 'Referensi transaksi → hasil validasi',
    aturan: 'Data salah / saldo kurang → GAGAL. Timeout → MENUNGGU_KONFIRMASI',
    wireframe: '09 Status',
    pageTarget: 'bukti'
  },
  {
    id: 'W05',
    pelaksana: 'Bank mitra',
    pemicu: 'Debit berhasil dikonfirmasi',
    ioTabel: 'PEMBAYARAN → SUKSES, ref_bank',
    aturan: 'Sukses tervalidasi memicu cabang status dan dana; gagal tidak melunasi tagihan',
    wireframe: '09 Status',
    pageTarget: 'bukti'
  },
  {
    id: 'W06A',
    pelaksana: 'Switching / PLN',
    pemicu: 'Notifikasi sukses terverifikasi',
    ioTabel: 'ALOKASI_BAYAR → TAGIHAN LUNAS',
    aturan: 'Update idempoten. Gagal sinkronisasi → retry tanpa debit ulang',
    wireframe: '09 Status',
    pageTarget: 'bukti'
  },
  {
    id: 'W06B',
    pelaksana: 'Bank / integrasi',
    pemicu: 'Jadwal settlement bank',
    ioTabel: 'DETAIL_SETTLEMENT → MUTASI_BANK',
    aturan: 'Nilai hak PLN dijumlahkan; belum ada dana aktual → TERTUNDA',
    wireframe: '10 Settlement',
    pageTarget: 'settlement'
  },
  {
    id: 'W07',
    pelaksana: 'Petugas / kanal',
    pemicu: 'Pembayaran sukses dan terverifikasi',
    ioTabel: 'PEMBAYARAN → bukti pembayaran',
    aturan: 'Bukti memuat referensi bank; pelanggan dapat menerima bukti walau settlement menunggu',
    wireframe: '09 Bukti',
    pageTarget: 'bukti'
  },
  {
    id: 'W08',
    pelaksana: 'Keuangan / sistem',
    pemicu: 'Data transaksi dan mutasi tersedia',
    ioTabel: 'SETTLEMENT + MUTASI → HASIL_REKON',
    aturan: 'Bank + referensi + nilai + tanggal cocok → final; selisih → kasus; tanpa pasangan → tertunda',
    wireframe: '11 Rekonsiliasi',
    pageTarget: 'rekonsiliasi'
  },
  {
    id: 'W09',
    pelaksana: 'Keuangan distribusi',
    pemicu: 'Kasus selisih terbuka',
    ioTabel: 'KASUS_SELISIH → bukti + usulan',
    aturan: 'Investigasi dapat diulang; dilarang mengubah bukti bank atau menimpa transaksi asal',
    wireframe: '12 Investigasi',
    pageTarget: 'investigasi'
  },
  {
    id: 'W10',
    pelaksana: 'Supervisor',
    pemicu: 'Koreksi diajukan oleh pembuat',
    ioTabel: 'Usulan → persetujuan / pengembalian',
    aturan: 'Penyetuju ≠ pembuat; koreksi disetujui memicu rekonsiliasi ulang, tidak otomatis cocok',
    wireframe: '12 Investigasi',
    pageTarget: 'investigasi'
  },
  {
    id: 'W11',
    pelaksana: 'Akuntansi UPJ/APJ',
    pemicu: 'Hasil COCOK final tersedia',
    ioTabel: 'HASIL_REKON → JURNAL + laporan',
    aturan: 'Posting jika periode terbuka dan debit = kredit; hasil yang belum selesai diblokir',
    wireframe: '13 Jurnal',
    pageTarget: 'jurnal'
  }
];

export const WorkflowView: React.FC = () => {
  const { setActivePage } = usePPOB();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Workflow To-Be • Pembayaran sampai pembukuan
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          W01–W11 menghubungkan proses, pemilik pekerjaan, tabel input/output, kondisi transisi, dan wireframe.
        </p>
      </div>

      {/* Visual Swimlane Diagram Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-sky-600" />
          <span>Diagram Alur Berbasis Peran (Swimlane To-Be)</span>
        </h3>

        <div className="space-y-3 text-xs">
          {/* Lane 1 */}
          <div className="p-3 rounded-lg bg-sky-50/50 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="w-44 font-bold text-sky-900 uppercase tracking-wider text-[11px]">
              PELANGGAN / PPOB
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-sky-200 rounded font-semibold text-sky-800">
                W01 Cek tagihan
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 bg-white border border-sky-200 rounded font-semibold text-sky-800">
                W02 Konfirmasi bayar
              </span>
              <span className="text-slate-400 ml-auto hidden md:inline">→</span>
              <span className="px-2.5 py-1 bg-white border border-sky-200 rounded font-semibold text-emerald-800">
                W07 Bukti pembayaran
              </span>
            </div>
          </div>

          {/* Lane 2 */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="w-44 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              SWITCHING / SISTEM
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800">
                W03 Validasi / routing
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 bg-white border border-slate-300 rounded font-semibold text-slate-800">
                W06A Status lunas (PLN)
              </span>
            </div>
          </div>

          {/* Lane 3 */}
          <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="w-44 font-bold text-blue-900 uppercase tracking-wider text-[11px]">
              BANK MITRA
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-blue-200 rounded font-semibold text-blue-800">
                W04 Validasi deposit
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 bg-white border border-blue-200 rounded font-semibold text-blue-800">
                W05 Proses debit SUKSES
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 bg-white border border-blue-200 rounded font-semibold text-blue-800">
                W06B Settlement bank
              </span>
            </div>
          </div>

          {/* Lane 4 */}
          <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="w-44 font-bold text-indigo-900 uppercase tracking-wider text-[11px]">
              KEUANGAN DISTRIBUSI
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-indigo-200 rounded font-semibold text-indigo-800">
                W08 Rekonsiliasi otomatis
              </span>
              <span className="text-slate-400 mx-1">XOR:</span>
              <span className="px-2.5 py-1 bg-white border border-rose-200 text-rose-800 rounded font-semibold">
                W09 Investigasi selisih
              </span>
            </div>
          </div>

          {/* Lane 5 */}
          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="w-44 font-bold text-emerald-900 uppercase tracking-wider text-[11px]">
              SUPERVISOR / UPJ
            </div>
            <div className="flex-1 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-emerald-200 rounded font-semibold text-emerald-800">
                W10 Review supervisor
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="px-2.5 py-1 bg-white border border-emerald-200 rounded font-semibold text-emerald-800">
                W11 Laporan & jurnal UPJ
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 text-[11px] text-slate-600 border border-slate-200">
          <strong>Join logis W08:</strong> Menunggu data transaksi sukses dan mutasi aktual. Belum ada mutasi → TERTUNDA. Tidak ada SLA bank yang diasumsikan sebagai fakta.
        </div>
      </div>

      {/* Full W01-W11 Specification Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">
            Workflow specification • Who, what, when, data, condition
          </h3>
          <p className="text-xs text-slate-500">
            Matriks keterhubungan aktivitas bisnis dengan entitas database dan aturan transisi
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e2a47] text-white uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 w-16">ID</th>
                <th className="px-4 py-3 w-36">Pelaksana</th>
                <th className="px-4 py-3">Pemicu / Aktivitas</th>
                <th className="px-4 py-3">Input → Output / Tabel</th>
                <th className="px-4 py-3">Aturan Transisi / Pengecualian</th>
                <th className="px-4 py-3 text-right">Layar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {WORKFLOW_SPECS.map((spec) => (
                <tr key={spec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-sky-800">
                    {spec.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {spec.pelaksana}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {spec.pemicu}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                    {spec.ioTabel}
                  </td>
                  <td className="px-4 py-3 text-slate-600 leading-relaxed">
                    {spec.aturan}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {spec.pageTarget ? (
                      <button
                        onClick={() => setActivePage(spec.pageTarget as any)}
                        className="text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline"
                      >
                        {spec.wireframe}
                      </button>
                    ) : (
                      <span className="text-slate-400">{spec.wireframe}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
