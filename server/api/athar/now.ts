export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

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
