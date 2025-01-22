export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const res = await getAllPenjualanAtharInactive();

  const data = res.map((item) => {
    return {
      id: item.id,
      kodeTransaksi: item.kodeTransaksi,
      jumlahGalon: item.jumlahGalon,
      tanggal: item.tanggal,
      nilai: item.nilai,
      margin: item.margin,
      status: item.status,
    };
  });

  return data;
});
