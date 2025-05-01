import * as v from "valibot";
import { HttpResponse } from "~~/server/utils/common/function";
import type { TPaginationMetadata } from "~~/server/utils/common/type";

export default defineEventHandler(async (event) => {
  const user = protectFunction(event);
  const query = await getValidatedQuery(event, (q) => v.parse(OSetoranList, q));

  let res;
  if (user.role !== "admin") {
    res = await listAllSetoran(query, user.id);
  } else {
    res = await listAllSetoran(query);
  }

  const data = res.data.map((item) => {
    return {
      id: item.id,
      anggotaId: item.anggotaId,
      keterangan: item.keterangan,
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      tanggal: item.tanggal,
      jenis: item.jenis,
      jumlahSaham: item.jumlahSaham,
      status: item.status,
      namaLengkap: item.namaLengkap,
    };
  });

  const total = res.count;
  const itemPerPage = Math.ceil(total / query.limit);

  const metadata: TPaginationMetadata = {
    page: query.page,
    total,
    itemPerPage,
  };

  return new HttpResponse<typeof data>()
    .setData(data)
    .setMeta(metadata)
    .getResponse();
});
