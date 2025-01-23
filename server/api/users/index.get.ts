export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const res = await getAllUser();

  let data;
  if (user.role !== "admin") {
    data = res.map((item) => {
      return {
        id: item.id,
        namaLengkap: item.namaLengkap,
      };
    });
  } else {
    data = res.map((item) => {
      return {
        id: item.id,
        email: item.email,
        namaLengkap: item.namaLengkap,
        noTelepon: item.noTelepon,
        role: item.role,
        noUser: item.noUser,
      };
    });
  }

  return data;
});
