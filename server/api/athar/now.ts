export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAtharNow();

  if (res) {
    return {
      id: res.id,
      nilai: res.nilai,
      tanggal: res.createdAt,
    };
  }

  return;
});
