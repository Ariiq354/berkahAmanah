import { z } from "zod";

const querySchema = z.object({
  anggotaId: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await getValidatedQuery(event, (query) =>
    querySchema.parse(query)
  );

  let saldo;
  if (user.role !== "admin") {
    saldo = await getSaldoSimpanan(user.id);
  } else {
    saldo = await getSaldoSimpanan(formData.anggotaId);
  }

  return {
    saldo,
  };
});
