import * as v from "valibot";

const bodySchema = v.array(
  v.object({
    anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
    sumSetoran: v.number(),
    sumSaham: v.number(),
    tahun: v.number(),
  })
);

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  await createShu(formData);

  return;
});
