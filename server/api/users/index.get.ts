export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllUser();

  const data = res.map((item) => {
    return {
      id: item.id,
      username: item.username,
      isActive: item.isActive,
    };
  });

  return data;
});
