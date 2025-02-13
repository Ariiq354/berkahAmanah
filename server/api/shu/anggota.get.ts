export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const data = await getAllShuByAnggotaId(user.id);

  return data;
});
