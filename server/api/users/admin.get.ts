export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const res = await getAllUserAdmin();

  const data = res.map((item) => {
    return {
      id: item.id,
      email: item.email,
      namaLengkap: item.namaLengkap,
      noTelepon: item.noTelepon,
      role: item.role,
      noUser: item.noUser,
    };
  });

  return data;
});
