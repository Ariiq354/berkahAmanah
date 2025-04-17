import * as v from "valibot";
import { penarikanTable } from "~~/server/database/schema/simpanan";

const bodySchema = v.object({
  anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
  keterangan: v.string(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  const kodeTransaksi = await getTransactionCode("TRK", penarikanTable);

  if (user.role !== "admin") {
    formData.anggotaId = user.id;
  }

  await createPenarikan({
    ...formData,
    kodeTransaksi,
  });

  return;
});
