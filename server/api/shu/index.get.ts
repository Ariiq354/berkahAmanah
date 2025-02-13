import { z } from "zod";

const querySchema = z.object({
  profit: z.coerce.number(),
  tahun: z.coerce.number(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const query = await getValidatedQuery(event, (q) => querySchema.parse(q));

  const setoranList = await getAllSetoranByTahun(query.tahun);
  const penarikanList = await getAllPenarikanByTahun(query.tahun);

  const processedResults = processSimpanan(setoranList, penarikanList);

  const shuCalc = shuCalculation(query.profit, processedResults);

  const sumSimpanan = sumSimpananResults(shuCalc);

  return sumSimpanan;
});
