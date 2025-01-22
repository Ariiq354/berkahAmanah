export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  let res;
  if (user.role !== "admin") {
    res = await getAllPemindahbukuan(user.id);
  } else {
    res = await getAllPemindahbukuan();
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
      jenis: item.jenis,
      namaLengkap: item.anggota.namaLengkap,
      jumlahSaham: item.setoran ? item.setoran.jumlahSaham : 0,
    };
  });

  return data;
});
