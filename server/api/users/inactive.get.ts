export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const res = await getAllUserInactive();

  const data = res.map((item) => {
    return {
      id: item.id,
      email: item.email,
      namaLengkap: item.namaLengkap,
      noTelepon: item.noTelepon,
      role: item.role,
    };
  });

  return data;
});
