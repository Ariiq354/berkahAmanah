export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const res = await getAllSaham();

  const data = res.map((item) => {
    return {
      id: item.id,
      nilai: item.nilai,
      tanggal: item.createdAt,
    };
  });

  return data;
});
