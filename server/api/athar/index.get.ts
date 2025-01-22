export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const res = await getAllAthar();

  const data = res.map((item) => {
    return {
      id: item.id,
      nilai: item.nilai,
      tanggal: item.createdAt,
    };
  });

  return data;
});
