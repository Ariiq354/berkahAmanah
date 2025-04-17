export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const res = await getAllPembiayaanInactive();

  const data = res.map((item) => {
    return {
      id: item.id,
      anggotaId: item.anggotaId,
      catatan: item.catatan,
      kodeTransaksi: item.kodeTransaksi,
      jumlah: item.jumlah,
      tempo: item.tempo,
      status: item.status,
      tujuan: item.tujuan,
      namaLengkap: item.anggota.namaLengkap,
      noUser: item.anggota.noUser,
    };
  });

  return data;
});
