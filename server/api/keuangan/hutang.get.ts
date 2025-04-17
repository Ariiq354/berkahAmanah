import * as v from "valibot";

const querySchema = v.object({
  tahun: v.string(),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const query = await getValidatedQuery(event, (query) =>
    v.parse(querySchema, query)
  );

  const res = await getAccountsData(query.tahun, "2%");

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
