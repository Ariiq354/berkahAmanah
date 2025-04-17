import * as v from "valibot";

const bodySchema = v.object({
  id: v.optional(v.number()),
  kodeAkun: v.string(),
  namaAkun: v.string(),
  status: v.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  if (formData.id) {
    await updateAkun(formData.id, formData);
  } else {
    await createAkun(formData);
  }

  return;
});
