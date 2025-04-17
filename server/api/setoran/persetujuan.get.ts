export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const res = await getAllSetoranInactive();

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
      namaLengkap: item.anggota.namaLengkap,
      noUser: item.anggota.noUser,
    };
  });

  return data;
});
