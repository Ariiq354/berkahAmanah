import { z } from "zod";

const querySchema = z.object({
  anggotaId: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await getValidatedQuery(event, (query) =>
    querySchema.parse(query)
  );

  const saldo = await getSaldoSimpanan(formData.anggotaId);

  return {
    saldo,
  };
});
