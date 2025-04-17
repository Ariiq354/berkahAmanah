import * as v from "valibot";
import { pembiayaanTable } from "~~/server/database/schema/pembiayaan";

const bodySchema = v.object({
  pembiayaanId: v.number(),
  keterangan: v.string(),
  jumlah: v.number(),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  const check = await getPembiayaanById(formData.pembiayaanId);
  if (user.role !== "admin" && check?.anggotaId !== user.id) {
    throw createError({
      statusCode: 403,
      message: "Unauthorized",
    });
  }

  const kodeTransaksi = await getTransactionCode("AGS", pembiayaanTable);

  await createAngsuran({
    ...formData,
    kodeTransaksi,
  });

  return;
});
