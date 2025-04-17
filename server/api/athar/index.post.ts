import * as v from "valibot";

const bodySchema = v.object({
  id: v.optional(v.number()),
  nilai: v.number(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  if (formData.id) {
    await updateAthar(formData.id, formData);
  } else {
    await createAthar(formData);
  }

  return;
});
