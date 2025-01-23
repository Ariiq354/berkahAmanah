export default defineEventHandler(async (event) => {
  protectFunction(event);

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
