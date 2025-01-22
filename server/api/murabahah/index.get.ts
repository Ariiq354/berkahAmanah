export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  let res;
  if (user.role !== "admin") {
    res = await getAllPembiayaan(user.id);
  } else {
    res = await getAllPembiayaan();
  }

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
      nilaiPersetujuan: item.persetujuan.nilai,
      marginPersetujuan: item.persetujuan.margin,
    };
  });

  return data;
});
