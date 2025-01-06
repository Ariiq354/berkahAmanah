export default defineEventHandler(async (event) => {
  protectFunction(event);

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
