import * as v from "valibot";
import {
  pemindahbukuanTable,
  penarikanTable,
  setoranTable,
} from "~~/server/database/schema/simpanan";

const bodySchema = v.object({
  id: v.optional(v.number()),
  anggotaId: v.pipe(v.number(), v.minValue(1, "Required")),
  keterangan: v.string(),
  nilai: v.pipe(v.number(), v.minValue(1, "Required")),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  jenis: v.picklist(["Saham", "Anggota"]),
  noAnggota: v.number(),
  jumlahSaham: v.number(),
});

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
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
