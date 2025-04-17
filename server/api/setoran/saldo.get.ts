import * as v from "valibot";

const querySchema = v.object({
  anggotaId: v.pipe(v.string(), v.transform(Number)),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await getValidatedQuery(event, (query) =>
    v.parse(querySchema, query)
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
