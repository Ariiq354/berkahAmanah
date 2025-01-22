export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  let resMurabahah;
  if (user.role !== "admin") {
    resMurabahah = await getAllPembiayaanActive(user.id);
  } else {
    resMurabahah = await getAllPembiayaanActive();
  }

  let resAngsuran;
  if (user.role !== "admin") {
    resAngsuran = await getAllAngsuran(user.id);
  } else {
    resAngsuran = await getAllAngsuran();
  }

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
      namaLengkap: item.namaLengkap,
      status: item.status,
      tanggal: item.tanggal,
      noPembiayaan: item.kodePembiayaan,
      jumlah: item.jumlah,
      pembiayaanId: item.pembiayaanId,
      pokok:
        (item.jumlah * item.nilaiPersetujuan) /
        (item.nilaiPersetujuan + item.marginPersetujuan),
      margin:
        (item.jumlah * item.marginPersetujuan) /
        (item.nilaiPersetujuan + item.marginPersetujuan),
    };
  });

  return {
    murabahah,
    angsuran,
  };
});
