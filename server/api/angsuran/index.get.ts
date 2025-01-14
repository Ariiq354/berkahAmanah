export default defineEventHandler(async (event) => {
  protectFunction(event);

  const resMurabahah = await getAllPembiayaanActive();
  const resAngsuran = await getAllAngsuran();

  const murabahah = resMurabahah.map((item) => {
    return {
      id: item.id,
      namaLengkap: item.namaLengkap,
      margin: item.margin,
      kodeTransaksi: item.kodeTransaksi,
      tempo: item.tempo,
      tujuan: item.tujuan,
      noUser: item.noUser,
      pokok: item.pokok,
      sisa: item.pokok + item.margin - item.totalAngsuran,
    };
  });

  const angsuran = resAngsuran.map((item) => {
    return {
      id: item.id,
      kodeTransaksi: item.kodeTransaksi,
      namaLengkap: item.pembiayaan.anggota.namaLengkap,
      status: item.status,
      tanggal: item.tanggal,
      noPembiayaan: item.pembiayaan.kodeTransaksi,
      jumlah: item.jumlah,
      pembiayaanId: item.pembiayaanId,
      pokok:
        (item.jumlah * item.pembiayaan.persetujuan.nilai) /
        (item.pembiayaan.persetujuan.nilai +
          item.pembiayaan.persetujuan.margin),
      margin:
        (item.jumlah * item.pembiayaan.persetujuan.margin) /
        (item.pembiayaan.persetujuan.nilai +
          item.pembiayaan.persetujuan.margin),
    };
  });

  return {
    murabahah,
    angsuran,
  };
});
