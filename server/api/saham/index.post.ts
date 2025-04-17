import * as v from "valibot";

const bodySchema = v.object({
  id: v.optional(v.number()),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  if (formData.id) {
    await updateSaham(formData.id, formData);
  } else {
    await createSaham(formData);
  }

  return;
});
