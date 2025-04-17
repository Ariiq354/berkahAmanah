import * as v from "valibot";
import { pembiayaanTable } from "~~/server/database/schema/pembiayaan";

const bodySchema = v.object({
  anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
  catatan: v.string(),
  jumlah: v.number(),
  tempo: v.number(),
  tujuan: v.string(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  const kodeTransaksi = await getTransactionCode("MRB", pembiayaanTable);

  if (user.role !== "admin") {
    formData.anggotaId = user.id;
  }

  await createPembiayaan({
    ...formData,
    kodeTransaksi,
  });

  const commonData = {
    keterangan: formData.catatan,
    kodeTransaksi,
    tanggal: getCurrentDate(),
  };

  // Debut Uang Muka Pembelian
  await createTransaksi({
    ...commonData,
    kodeAkun: "1303",
    anggotaId: formData.anggotaId,
    nilai: formData.jumlah,
  });

  // Kredit Bank
  await createTransaksi({
    ...commonData,
    kodeAkun: "1102",
    anggotaId: formData.anggotaId,
    nilai: -formData.jumlah,
  });

  return;
});
