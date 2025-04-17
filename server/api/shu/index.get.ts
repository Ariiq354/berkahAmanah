import * as v from "valibot";

const querySchema = v.object({
  profit: v.pipe(v.string(), v.transform(Number)),
  tahun: v.pipe(v.string(), v.transform(Number)),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const query = await getValidatedQuery(event, (query) =>
    v.parse(querySchema, query)
  );

  const setoranList = await getAllSetoranByTahun(query.tahun);
  const penarikanList = await getAllPenarikanByTahun(query.tahun);

  const processedResults = processSimpanan(setoranList, penarikanList);

  const shuCalc = shuCalculation(query.profit, processedResults);

  const sumSimpanan = sumSimpananResults(shuCalc);

  return sumSimpanan;
});
