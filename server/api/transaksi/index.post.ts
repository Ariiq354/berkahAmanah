import * as v from "valibot";

const bodySchema = v.object({
  id: v.optional(v.number()),
  kodeAkun: v.string(),
  anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
  keterangan: v.string(),
  kodeTransaksi: v.string(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  if (formData.id) {
    await updateTransaksi(formData.id, formData);
  } else {
    await createTransaksi(formData);
  }

  return;
});
