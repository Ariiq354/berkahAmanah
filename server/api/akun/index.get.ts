export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");
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
