export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  let res;
  if (user.role !== "admin") {
    res = await getAllSetoran(user.id);
  } else {
    res = await getAllSetoran();
  }

  const data = res.map((item) => {
    return {
      id: item.id,
      anggotaId: item.anggotaId,
      keterangan: item.keterangan,
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      tanggal: item.tanggal,
      jenis: item.jenis,
      jumlahSaham: item.jumlahSaham,
      status: item.status,
      namaLengkap: item.anggota.namaLengkap,
    };
  });

  return data;
});
