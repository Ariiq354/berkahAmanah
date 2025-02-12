import { z } from "zod";
import { pembiayaanTable } from "~~/server/database/schema/pembiayaan";

const bodySchema = z.object({
  anggotaId: z.number(),
  catatan: z.string(),
  jumlah: z.number(),
  tempo: z.number(),
  tujuan: z.string(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
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
