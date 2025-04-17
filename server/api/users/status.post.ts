import * as v from "valibot";

const bodySchema = v.object({
  id: v.number(),
  status: v.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");
  const body = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  if (body.status) {
    await updateUser(body.id, {
      status: true,
    });
  } else {
    await deleteUser([body.id]);
  }

  return;
});
