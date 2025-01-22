import { z } from "zod";
import {
  pemindahbukuanTable,
  penarikanTable,
  setoranTable,
} from "~~/server/database/schema/simpanan";

const bodySchema = z.object({
  id: z.number().optional(),
  anggotaId: z.number(),
  keterangan: z.string(),
  nilai: z.number(),
  tanggal: z.string(),
  jenis: z.enum(["Saham", "Anggota"]),
  noAnggota: z.number(),
  jumlahSaham: z.number(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  const kodeSetoran = await getTransactionCode("STR", setoranTable);
  const kodePenarikan = await getTransactionCode("TRK", penarikanTable);
  const kodeTransaksi = await getTransactionCode("PBK", pemindahbukuanTable);

  if (user.role !== "admin") {
    formData.anggotaId = user.id;
  }

  const commonData = {
    keterangan: formData.keterangan,
    kodeTransaksi: kodeSetoran,
    nilai: formData.nilai,
    tanggal: formData.tanggal,
    status: 4,
  };

  const penarikanPayload = {
    ...commonData,
    anggotaId: formData.anggotaId,
    kodeTransaksi: kodePenarikan,
  };

  enum JenisSetoran {
    Simpanan = "Simpanan",
    Saham = "Saham",
  }

  const setoranPayload = {
    ...commonData,
    anggotaId:
      formData.jenis === "Anggota" ? formData.noAnggota : formData.anggotaId,
    jenis:
      formData.jenis === "Anggota" ? JenisSetoran.Simpanan : JenisSetoran.Saham,
    ...(formData.jenis !== "Anggota" && {
      jumlahSaham: formData.jumlahSaham,
    }),
  };

  const [setoran] = await createSetoran(setoranPayload);
  const [penarikan] = await createPenarikan(penarikanPayload);
  await createPemindahbukuan({
    ...formData,
    idSetoran: setoran!.insertedId,
    idPenarikan: penarikan!.insertedId,
    kodeTransaksi,
  });

  return;
});
