import React, { useState } from 'react';
import { 
  Zap, 
  CreditCard, 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  User,
  Copy,
  Check
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah, formatNumber } from '../../utils/formatters';

export const PelangganPortalView: React.FC = () => {
  const { 
    pelangganList, 
    tagihanList, 
    pembayaranList, 
    selectedPelangganId, 
    setSelectedPelangganId,
    processPayment,
    setSelectedTrxId,
    setActivePage
  } = usePPOB();

  const [activePaymentBank, setActivePaymentBank] = useState('MANDIRI');
  const [isPaying, setIsPaying] = useState(false);
  const [copiedVA, setCopiedVA] = useState(false);
  const [paySuccessMessage, setPaySuccessMessage] = useState<string | null>(null);

  // Active customer
  const currentCustomer = pelangganList.find(p => p.pelanggan_id === selectedPelangganId) || pelangganList[2]; // Default Pelanggan C
  const customerBill = tagihanList.find(t => t.pelanggan_id === currentCustomer.pelanggan_id);
  const customerPayments = pembayaranList.filter(p => p.nomor_pelanggan === currentCustomer.nomor_pelanggan);

  // Simulated consumption history (kWh)
  const monthlyConsumption = [
    { bulan: 'Mei', kwh: 310, biaya: 420000 },
    { bulan: 'Jun', kwh: 325, biaya: 440000 },
    { bulan: 'Jul', kwh: 315, biaya: 428000 },
    { bulan: 'Agu', kwh: 340, biaya: 460000 },
    { bulan: 'Sep', kwh: 330, biaya: 445000 },
    { bulan: 'Okt', kwh: 335, biaya: customerBill ? customerBill.pokok : 450000 }
  ];

  const maxKwh = Math.max(...monthlyConsumption.map(m => m.kwh));

  const adminKanal = 2500;
  const totalBayar = customerBill ? customerBill.pokok + customerBill.denda + adminKanal : 0;
  const virtualAccountNo = `88019${currentCustomer.nomor_pelanggan}`;

  const handleCopyVA = () => {
    navigator.clipboard.writeText(virtualAccountNo);
    setCopiedVA(true);
    setTimeout(() => setCopiedVA(false), 2000);
  };

  const handlePayBillOnline = async () => {
    if (!customerBill || customerBill.status === 'LUNAS') return;

    setIsPaying(true);
    setPaySuccessMessage(null);

    setTimeout(async () => {
      const res = await processPayment({
        pelangganId: currentCustomer.pelanggan_id,
        tagihanId: customerBill.tagihan_id,
        nominalPln: customerBill.pokok + customerBill.denda,
        adminKanal
      });

      setIsPaying(false);
      if (res.success) {
        setPaySuccessMessage(`Pembayaran tagihan listrik periode ${customerBill.periode} berhasil! Struk resmi telah diterbitkan.`);
        setSelectedTrxId(res.pembayaranId);
      }
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <Zap className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-white border border-white/20">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              Portal Layanan Mandiri Pelanggan PLN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {currentCustomer.nama}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
              Pantau status tagihan listrik, rincian stand meter, pembayaran mandiri online, dan cetak struk pembayaran resmi kapan saja.
            </p>
          </div>

          {/* Customer Switcher Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 text-xs space-y-2">
            <div className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">
              Pilih Akun Simulasi:
            </div>
            <select
              value={currentCustomer.pelanggan_id}
              onChange={(e) => setSelectedPelangganId(e.target.value)}
              className="bg-white text-slate-800 text-xs font-bold rounded-xl px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer shadow-xs"
            >
              {pelangganList.map(p => (
                <option key={p.pelanggan_id} value={p.pelanggan_id}>
                  {p.nama} ({p.nomor_pelanggan})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-blue-100 font-mono">
              Tarif: {currentCustomer.tarif_daya}
            </div>
          </div>
        </div>
      </div>

      {paySuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{paySuccessMessage}</span>
          </div>
          <button
            onClick={() => setActivePage('bukti')}
            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shrink-0"
          >
            Lihat Struk Bayar &rarr;
          </button>
        </div>
      )}

      {/* Main Grid: Left Bill Card & Payment, Right Details & Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Status Tagihan Berjalan */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tagihan Berjalan
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                customerBill?.status === 'LUNAS'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {customerBill?.status === 'LUNAS' ? 'LUNAS' : 'BELUM LUNAS'}
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-medium">Periode Pemakaian:</div>
              <div className="text-lg font-bold text-slate-900 mt-0.5">
                {customerBill?.periode || 'Oktober 2026'}
              </div>
              <div className="text-3xl font-black text-blue-600 mt-2 font-mono tabular-nums">
                {formatRupiah(customerBill?.status === 'LUNAS' ? 0 : totalBayar)}
              </div>
              {customerBill?.status === 'LUNAS' ? (
                <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tagihan periode ini telah terbayar lunas</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400 mt-1">
                  Jatuh tempo: <strong>20 Oktober 2026</strong>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Pokok Tagihan Listrik:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatRupiah(customerBill?.pokok || 0)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Denda Keterlambatan:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {formatRupiah(customerBill?.denda || 0)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Admin Kanal:</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(adminKanal)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Total Biaya:</span>
                <span className="text-blue-700 font-bold">
                  {formatRupiah(totalBayar)}
                </span>
              </div>
            </div>

            {/* Payment action if not paid */}
            {customerBill?.status === 'BELUM LUNAS' ? (
              <div className="space-y-4 pt-2">
                <div className="text-xs font-bold text-slate-800">
                  Bayar Sekarang via Virtual Account:
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {['MANDIRI', 'BRI', 'BCA'].map(b => (
                    <button
                      key={b}
                      onClick={() => setActivePaymentBank(b)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        activePaymentBank === b
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs font-extrabold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Nomor VA ({activePaymentBank}):</div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-blue-900 text-sm">
                      {virtualAccountNo}
                    </span>
                    <button
                      onClick={handleCopyVA}
                      className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 text-[11px]"
                    >
                      {copiedVA ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedVA ? 'Disalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePayBillOnline}
                  disabled={isPaying}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Simulasikan Pembayaran Pelanggan</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (customerPayments.length > 0) {
                    setSelectedTrxId(customerPayments[0].pembayaran_id);
                  }
                  setActivePage('bukti');
                }}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Struk Resmi Pembayaran</span>
              </button>
            )}
          </div>

          {/* Identitas Pelanggan Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 text-xs">
            <div className="font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Profil Pelanggan Terdaftar</span>
            </div>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>ID Pelanggan:</span>
                <span className="font-mono font-bold text-slate-900">{currentCustomer.nomor_pelanggan}</span>
              </div>
              <div className="flex justify-between">
                <span>Nama:</span>
                <span className="font-semibold text-slate-900">{currentCustomer.nama}</span>
              </div>
              <div className="flex justify-between">
                <span>Tarif / Daya:</span>
                <span className="font-bold text-blue-700">{currentCustomer.tarif_daya}</span>
              </div>
              <div className="flex justify-between">
                <span>Unit UPJ:</span>
                <span className="text-slate-800">UPJ Simulasi Jakarta</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-400">
                Alamat: {currentCustomer.alamat}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (2/3): Consumption History & Receipt Archive */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grafik Pemakaian Listrik 6 Bulan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Riwayat Konsumsi Listrik (6 Bulan Terakhir)
                </h3>
                <p className="text-xs text-slate-500">
                  Rata-rata penggunaan energi bulanan pelanggan: ~326 kWh
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                Stand Meter Normal
              </span>
            </div>

            {/* Consumption Bar Chart */}
            <div className="pt-6 pb-2">
              <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-48 border-b border-slate-200 px-2 pb-2">
                {monthlyConsumption.map((item, idx) => {
                  const heightPercent = Math.round((item.kwh / maxKwh) * 100);
                  const isCurrent = idx === monthlyConsumption.length - 1;
                  return (
                    <div key={item.bulan} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                        {item.kwh} kWh
                      </div>
                      <div className="w-full max-w-[40px] bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            isCurrent 
                              ? 'bg-gradient-to-t from-blue-600 to-indigo-500 shadow-sm' 
                              : 'bg-blue-300 hover:bg-blue-400'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>
                      <div className={`text-xs font-bold ${isCurrent ? 'text-blue-700' : 'text-slate-500'}`}>
                        {item.bulan}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
              <span>*Pengukuran konsumsi berdasarkan pencatatan Automatic Meter Reading (AMR) PLN</span>
              <span className="font-semibold text-slate-600">Tarif per kWh: Rp1.444,70</span>
            </div>
          </div>

          {/* Riwayat Pembayaran & Struk Bukti Bayar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Arsip Struk Bukti Bayar Resmi
                </h3>
                <p className="text-xs text-slate-500">
                  Bukti pelunasan tagihan listrik yang sah diterbitkan oleh sistem PPOB PLN
                </p>
              </div>
            </div>

            {customerPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5 rounded-l-lg">No. Transaksi</th>
                      <th className="px-4 py-2.5">Periode</th>
                      <th className="px-4 py-2.5">Waktu Pembayaran</th>
                      <th className="px-4 py-2.5 text-right">Total Bayar</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                      <th className="px-4 py-2.5 text-right rounded-r-lg">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customerPayments.map(p => (
                      <tr key={p.pembayaran_id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-blue-700">
                          {p.pembayaran_id}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {p.periode_tagihan}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-[11px]">
                          {p.waktu_bayar}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {formatRupiah(p.nominal_pln + p.admin)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            LUNAS
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedTrxId(p.pembayaran_id);
                              setActivePage('bukti');
                            }}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-end gap-1 ml-auto"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Buka Struk</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                Belum ada riwayat transaksi pembayaran pada akun ini. Lakukan pembayaran di panel sebelah kiri.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
