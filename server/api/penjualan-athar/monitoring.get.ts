export default defineEventHandler(async (event) => {
  const data = await getRemainingGalon();

  return data;
});
