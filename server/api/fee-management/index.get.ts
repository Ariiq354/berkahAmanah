export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const res = await getAllFeeManagement();

  const data = res.map((item) => {
    return {
      id: item.id,
      anggotaId: item.anggotaId,
      keterangan: item.keterangan,
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      tanggal: item.tanggal,
      namaLengkap: item.anggota.namaLengkap,
    };
  });

  return data;
});
