import { z } from "zod";

const querySchema = z.object({
  tahun: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const query = await getValidatedQuery(event, (q) => querySchema.parse(q));

  const data = await getAllSetoranByTahun(query.tahun);

  return data;
});
