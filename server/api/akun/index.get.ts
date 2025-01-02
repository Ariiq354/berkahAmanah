export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllAkun();

  const data = res.map((item) => {
    return {
      id: item.id,
      kodeAkun: item.kodeAkun,
      namaAkun: item.namaAkun,
      status: item.status,
    };
  });

  return data;
});
