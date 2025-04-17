import * as v from "valibot";
import { setoranTable } from "~~/server/database/schema/simpanan";

const bodySchema = v.object({
  anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
  keterangan: v.string(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  jenis: v.picklist(["Saham", "Simpanan"]),
  jumlahSaham: v.number(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  const kodeTransaksi = await getTransactionCode("STR", setoranTable);

  if (user.role !== "admin") {
    formData.anggotaId = user.id;
  }

  await createSetoran({
    ...formData,
    kodeTransaksi,
  });

  return;
});
