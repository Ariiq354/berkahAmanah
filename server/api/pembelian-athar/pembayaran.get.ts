export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const res = await getAllPembelianAtharInactive();

  const data = res.map((item) => {
    return {
      id: item.id,
      kodeTransaksi: item.kodeTransaksi,
      jumlahGalon: item.jumlahGalon,
      tanggal: item.tanggal,
      nilai: item.nilai,
      status: item.status,
    };
  });

  return data;
});
