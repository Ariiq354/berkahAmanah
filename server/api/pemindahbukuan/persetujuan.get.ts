export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllPemindahbukuanInactive();

  const data = res.map((item) => {
    return {
      id: item.id,
      anggotaId: item.anggotaId,
      keterangan: item.keterangan,
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      tanggal: item.tanggal,
      namaLengkap: item.anggota.namaLengkap,
      jenis: item.jenis,
      noUser: item.anggota.noUser,
      jumlahSaham: item.setoran.jumlahSaham,
      idSetoran: item.idSetoran,
      idPenarikan: item.idPenarikan,
    };
  });

  return data;
});
