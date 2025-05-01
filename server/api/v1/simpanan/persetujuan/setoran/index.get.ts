import { HttpResponse } from "~~/server/utils/common/function";
import * as v from "valibot";
import type { TPaginationMetadata } from "~~/server/utils/common/type";

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const query = await getValidatedQuery(event, (query) =>
    v.parse(OPagination, query)
  );

  const res = await getAllSetoranInactive();

  const data = res.map((item) => {
    return {
      id: item.id,
      anggotaId: item.anggotaId,
      keterangan: item.keterangan,
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      tanggal: item.tanggal,
      jenis: item.jenis,
      jumlahSaham: item.jumlahSaham,
      namaLengkap: item.anggota.namaLengkap,
      noUser: item.anggota.noUser,
    };
  });

  const total = res[0].count ?? 0;
  const itemPerPage = Math.ceil(total / query.limit);

  const metadata: TPaginationMetadata = {
    page: query.page,
    total,
    itemPerPage,
  };

  return new HttpResponse().setData(data).setMeta(metadata).getResponse();
});
