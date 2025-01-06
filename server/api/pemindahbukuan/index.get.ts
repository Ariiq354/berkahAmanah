export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllPemindahbukuan();

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
      noAnggota: item.setoran.anggotaId,
      jumlahSaham: item.setoran.jumlahSaham,
    };
  });

  return data;
});
