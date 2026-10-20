export const formatRupiah = (amount: number): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(absAmount).replace(/\s+/g, '');

  return isNegative ? `-${formatted}` : formatted;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

export const getStatusBadgeStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case 'SUKSES':
    case 'LUNAS':
    case 'COCOK':
    case 'POSTED':
    case 'SELESAI':
    case 'DITERIMA':
    case 'DISETUJUI':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    
    case 'DIPROSES':
    case 'DIAJUKAN':
    case 'DIKIRIM':
    case 'DRAF':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    
    case 'BELUM LUNAS':
    case 'TERTUNDA':
    case 'MENUNGGU_KONFIRMASI':
    case 'TERBUKA':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    
    case 'GAGAL':
    case 'SELISIH':
    case 'TIMEOUT':
    case 'DIKEMBALIKAN':
      return 'bg-rose-50 text-rose-700 border-rose-200';

    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};
