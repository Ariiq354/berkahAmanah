import * as v from "valibot";

const querySchema = v.object({
  tahun: v.pipe(v.string(), v.transform(Number)),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const query = await getValidatedQuery(event, (query) =>
    v.parse(querySchema, query)
  );

  const data = await getAllSetoranByTahun(query.tahun);

  return data;
});
