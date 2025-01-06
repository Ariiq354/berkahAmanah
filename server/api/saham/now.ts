export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getSahamNow();

  if (res) {
    return {
      id: res.id,
      nilai: res.nilai,
      tanggal: res.createdAt,
    };
  }

  console.log("cek shama");

  return;
});
