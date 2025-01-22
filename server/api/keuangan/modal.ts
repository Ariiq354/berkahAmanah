import { z } from "zod";

const querySchema = z.object({
  tahun: z.string(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "admin");

  const query = await getValidatedQuery(event, (q) => querySchema.parse(q));

  const res = await getAccountsData(query.tahun, "3%");

  const transaksi = res.map((item) => {
    return {
      namaAkun: item.namaAkun,
      jan: item.jan,
      feb: item.feb,
      mar: item.mar,
      apr: item.apr,
      may: item.may,
      jun: item.jun,
      jul: item.jul,
      aug: item.aug,
      sep: item.sep,
      oct: item.oct,
      nov: item.nov,
      dec: item.dec,
    };
  });

  return transaksi;
});
