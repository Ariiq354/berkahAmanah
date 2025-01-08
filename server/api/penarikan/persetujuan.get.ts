export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllPenarikanInactive();

  const data = res.map((item) => {
    return {
      id: item.id,
      anggotaId: item.anggotaId,
      keterangan: item.keterangan,
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      tanggal: item.tanggal,
      namaLengkap: item.anggota.namaLengkap,
      noUser: item.anggota.noUser,
    };
  });

  return data;
});
