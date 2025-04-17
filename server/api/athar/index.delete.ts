import * as v from "valibot";

const bodySchema = v.object({
  id: v.array(v.number()),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  await deleteAthar(formData.id);

  return;
});
