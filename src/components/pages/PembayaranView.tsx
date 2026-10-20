import React, { useState } from 'react';
import { 
  CheckCircle, 
  Search, 
  AlertCircle, 
  Zap, 
  RotateCcw,
  ShieldCheck,
  User,
  ArrowRight
} from 'lucide-react';
import { usePPOB } from '../../context/PPOBContext';
import { formatRupiah } from '../../utils/formatters';

export const PembayaranView: React.FC = () => {
  const { 
    pelangganList, 
    tagihanList, 
    processPayment, 
    setActivePage,
    setSelectedTrxId 
  } = usePPOB();

  // Search input state (default to 530000000003 or 530000000004 for interactive testing)
  const [inputNoPelanggan, setInputNoPelanggan] = useState('530000000004');
  const [queriedPelangganId, setQueriedPelangganId] = useState<string | null>('PEL-004');
  const [selectedTagihanId, setSelectedTagihanId] = useState<string | null>('TAG-004');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick preset accounts for testing
  const presets = [
    { no: '530000000004', name: 'PT Sinar Mandiri (Belum Lunas Rp1.250.000)' },
    { no: '530000000005', name: 'Dra. Endang Wulandari (Belum Lunas Rp275.000)' },
    { no: '530000000003', name: 'Pelanggan Simulasi C (Studi Kasus KAS-001)' }
  ];

  const handleInquiry = () => {
    setErrorMessage(null);
    const cleanNo = inputNoPelanggan.trim();
    const pel = pelangganList.find(p => p.nomor_pelanggan === cleanNo);
    if (!pel) {
      setErrorMessage(`Nomor pelanggan ${cleanNo} tidak ditemukan pada database induk PLN.`);
      setQueriedPelangganId(null);
      setSelectedTagihanId(null);
      return;
    }

    setQueriedPelangganId(pel.pelanggan_id);
    const tag = tagihanList.find(t => t.pelanggan_id === pel.pelanggan_id);
    if (tag) {
      setSelectedTagihanId(tag.tagihan_id);
    } else {
      setSelectedTagihanId(null);
    }
  };

  const currentPelanggan = pelangganList.find(p => p.pelanggan_id === queriedPelangganId);
  const currentTagihan = tagihanList.find(t => t.tagihan_id === selectedTagihanId);

  const adminKanal = 2500;
  const pokok = currentTagihan ? currentTagihan.pokok : 0;
  const denda = currentTagihan ? currentTagihan.denda : 0;
  const hakPln = pokok + denda;
  const totalPelanggan = hakPln > 0 ? hakPln + adminKanal : 0;

  const handleConfirmAndPay = async () => {
    if (!currentPelanggan || !currentTagihan) return;
    if (currentTagihan.status === 'LUNAS') {
      setErrorMessage('Tagihan ini sudah berstatus LUNAS. Pembayaran ganda dicegah oleh sistem (Idempotency W03).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Simulate switching network latency (W03-W05)
    setTimeout(async () => {
      const res = await processPayment({
        pelangganId: currentPelanggan.pelanggan_id,
        tagihanId: currentTagihan.tagihan_id,
        nominalPln: hakPln,
        adminKanal
      });

      setIsProcessing(false);
      if (res.success) {
        setSelectedTrxId(res.pembayaranId);
        setActivePage('bukti');
      } else {
        setErrorMessage(res.error || 'Gagal memproses pembayaran');
      }
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Pembayaran tagihan PPOB
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          W01–W04 • Petugas melakukan inquiry dan konfirmasi sebelum pembayaran dikirim.
        </p>
      </div>

      {/* Preset quick test shortcuts */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-xs">
        <span className="font-semibold text-sky-900 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-sky-600" />
          Uji Coba Cepat ID Pelanggan:
        </span>
        {presets.map(p => (
          <button
            key={p.no}
            onClick={() => {
              setInputNoPelanggan(p.no);
              const target = pelangganList.find(item => item.nomor_pelanggan === p.no);
              if (target) {
                setQueriedPelangganId(target.pelanggan_id);
                const tag = tagihanList.find(t => t.pelanggan_id === target.pelanggan_id);
                setSelectedTagihanId(tag ? tag.tagihan_id : null);
              }
              setErrorMessage(null);
            }}
            className={`px-2.5 py-1 rounded-md transition-all font-mono text-xs ${
              inputNoPelanggan === p.no 
                ? 'bg-sky-600 text-white font-semibold' 
                : 'bg-white text-slate-700 hover:bg-sky-100 border border-slate-200'
            }`}
          >
            {p.no}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Steps 1 & 2, Right Payment Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 1. Identifikasi & 2. Pilih Tagihan */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Identifikasi Pelanggan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              1. Identifikasi pelanggan
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  ID pelanggan
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputNoPelanggan}
                      onChange={(e) => setInputNoPelanggan(e.target.value)}
                      placeholder="Masukkan 12 digit ID Pelanggan PLN"
                      className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
                    />
                  </div>
                  <button
                    onClick={handleInquiry}
                    className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Cek tagihan</span>
                  </button>
                </div>
              </div>

              {/* Customer Verified Info Card */}
              {currentPelanggan ? (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 mt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        Pelanggan: {currentPelanggan.nama}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Unit: UPJ Simulasi • {currentPelanggan.tarif_daya}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Alamat: {currentPelanggan.alamat}
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      IDENTITAS TERVERIFIKASI
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  Masukkan ID pelanggan dan klik tombol &quot;Cek tagihan&quot; untuk memuat data.
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Pilih Tagihan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              2. Pilih tagihan
            </h3>

            {currentPelanggan ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0e2a47] text-white text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-2.5 w-16 text-center">Pilih</th>
                      <th className="px-4 py-2.5">Periode</th>
                      <th className="px-4 py-2.5 text-right">Nominal PLN</th>
                      <th className="px-4 py-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentTagihan ? (
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedTagihanId === currentTagihan.tagihan_id}
                            onChange={() => {
                              setSelectedTagihanId(
                                selectedTagihanId === currentTagihan.tagihan_id ? null : currentTagihan.tagihan_id
                              );
                            }}
                            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                          />
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-800">
                          {currentTagihan.periode}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono font-bold text-slate-900 text-right">
                          {formatRupiah(currentTagihan.pokok)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            currentTagihan.status === 'LUNAS'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {currentTagihan.status}
                          </span>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-xs text-slate-400">
                          Tidak ada tagihan tertunggak untuk pelanggan ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                Pilih atau cari ID Pelanggan terlebih dahulu di Langkah 1.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ringkasan Pembayaran */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Ringkasan pembayaran
              </h3>

              <div className="divide-y divide-slate-100 text-xs py-3 space-y-2.5">
                <div className="flex justify-between text-slate-600 pt-2">
                  <span>Pokok tagihan</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatRupiah(pokok)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pt-2">
                  <span>Denda</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatRupiah(denda)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-800 font-semibold pt-2">
                  <span>Hak PLN</span>
                  <span className="font-mono font-bold text-sky-900">
                    {formatRupiah(hakPln)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 pt-2">
                  <span>Biaya admin kanal</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {hakPln > 0 ? formatRupiah(adminKanal) : 'Rp0'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t-2 border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total pelanggan
                </div>
                <div className="text-3xl font-extrabold text-sky-700 mt-1 font-mono tabular-nums">
                  {formatRupiah(totalPelanggan)}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Admin kanal bukan hak PLN pada simulasi ini.
                </p>
              </div>
            </div>

            {/* Quick Link to View Past Bill */}
            {currentTagihan?.status === 'LUNAS' && (
              <div className="mt-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                Tagihan ini sudah lunas. Anda dapat melihat struk bukti bayar di menu Status Transaksi.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <p className="text-xs text-sky-900 font-medium bg-sky-50 p-3 rounded-lg border border-sky-100 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            Konfirmasikan identitas dan total kepada pelanggan. Pemeriksaan saldo dilakukan oleh bank, bukan dari tampilan ini.
          </span>
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirmAndPay}
              disabled={isProcessing || !currentTagihan || currentTagihan.status === 'LUNAS'}
              className="px-6 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memvalidasi & Memproses Pembayaran...</span>
                </>
              ) : (
                <>
                  <span>Konfirmasi & bayar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <button
              onClick={() => {
                setQueriedPelangganId(null);
                setSelectedTagihanId(null);
                setErrorMessage(null);
              }}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
            >
              Batalkan
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Selama DIPROSES, tombol bayar dinonaktifkan.
          </div>
        </div>
      </div>
    </div>
  );
};
