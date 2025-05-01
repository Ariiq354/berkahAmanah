import * as v from "valibot";
import { KODE_AKUN } from "~~/server/utils/common/constants";

const bodySchema = v.object({
  setoranId: v.number(),
  alasan: v.string(),
  tanggal: v.pipe(v.string(), v.minLength(1, "Required")),
  setuju: v.boolean(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const formData = await readValidatedBody(event, (body) =>
    v.parse(bodySchema, body)
  );

  await createPersetujuanSetoran({
    ...formData,
  });

  const res = await getSetoranById(formData.setoranId);

  if (formData.setuju) {
    await updateSetoranStatus(1, formData.setoranId);

    const commonData = {
      keterangan: res!.keterangan,
      kodeTransaksi: res!.kodeTransaksi,
      tanggal: res!.tanggal,
    };

    await createTransaksi({
      ...commonData,
      kodeAkun: KODE_AKUN.debitBank,
      anggotaId: res!.anggotaId,
      nilai: res!.nilai,
    });

    if (res!.jenis === "Simpanan") {
      await createTransaksi({
        ...commonData,
        kodeAkun: KODE_AKUN.kreditSimpanan,
        anggotaId: res!.anggotaId,
        nilai: -res!.nilai,
      });
    } else {
      await createTransaksi({
        ...commonData,
        kodeAkun: KODE_AKUN.kreditSaham,
        anggotaId: res!.anggotaId,
        nilai: -res!.nilai,
      });
    }
  } else {
    await updateSetoranStatus(2, formData.setoranId);
  }

  return;
});
