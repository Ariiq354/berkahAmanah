export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllPenarikan();

  const data = res.map((item) => {
    return {
      id: item.id,
      anggotaId: item.anggotaId,
      keterangan: item.keterangan,
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      tanggal: item.tanggal,
      status: item.status,
      namaLengkap: item.anggota.namaLengkap,
    };
  });

  return data;
});
