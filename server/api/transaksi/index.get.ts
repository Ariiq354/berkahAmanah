export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllTransaksi();

  const data = res.map((item) => {
    return {
      id: item.id,
      anggotaId: item.anggotaId,
      keterangan: item.keterangan,
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      tanggal: item.tanggal,
      kodeAkun: item.akun.kodeAkun,
      namaAkun: item.akun.namaAkun,
      namaLengkap: item.anggota.namaLengkap,
    };
  });

  return data;
});
