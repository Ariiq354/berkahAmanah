export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const res = await getAllAngsuranInactive();

  const data = res.map((item) => {
    return {
      id: item.id,
      kodeTransaksi: item.kodeTransaksi,
      namaLengkap: item.pembiayaan.anggota.namaLengkap,
      jumlah: item.jumlah,
      pokok:
        (item.jumlah * item.pembiayaan.persetujuan.nilai) /
        (item.pembiayaan.persetujuan.nilai +
          item.pembiayaan.persetujuan.margin),
      margin:
        (item.jumlah * item.pembiayaan.persetujuan.margin) /
        (item.pembiayaan.persetujuan.nilai +
          item.pembiayaan.persetujuan.margin),
      tanggal: item.tanggal,
      keterangan: item.keterangan,
      noPembiayaan: item.pembiayaan.kodeTransaksi,
      noUser: item.pembiayaan.anggota.noUser,
    };
  });

  return data;
});
