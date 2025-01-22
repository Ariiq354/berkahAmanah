export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  let res;
  if (user.role !== "admin") {
    res = await getAllPenarikan(user.id);
  } else {
    res = await getAllPenarikan();
  }

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
