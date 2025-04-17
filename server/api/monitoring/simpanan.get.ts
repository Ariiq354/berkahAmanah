import * as v from "valibot";

const querySchema = v.object({
  anggotaId: v.pipe(v.string(), v.transform(Number)),
});

export default defineEventHandler(async (event) => {
  resourceFunction(event, "role:admin");

  const query = await getValidatedQuery(event, (query) =>
    v.parse(querySchema, query)
  );

  const setoran = await getAllSetoranByAnggotaId(query.anggotaId);
  const penarikan = await getAllPenarikanByAnggotaId(query.anggotaId);
  const saham = setoran.filter((item) => item.jenis === "Saham");

  const simpananDetail = [...setoran, ...penarikan].map((item) => {
    return {
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      tanggal: item.tanggal,
      keterangan: item.keterangan,
    };
  });

  const sahamDetail = saham.map((item) => {
    return {
      kodeTransaksi: item.kodeTransaksi,
      nilai: item.nilai,
      jumlahSaham: item.jumlahSaham,
      tanggal: item.tanggal,
      keterangan: item.keterangan,
    };
  });

  const sahamSimpanan = saham.reduce(
    (acc, item) => {
      acc.jumlah += item.nilai;
      acc.lembar += item.jumlahSaham;
      return acc;
    },
    { jumlah: 0, lembar: 0 }
  );

  const saldoSimpanan = await getSaldoSimpanan(query.anggotaId);
  const totalSaham = await getTotalSaham();

  const data = [
    {
      jenis: "Simpanan",
      jumlahSimpanan: saldoSimpanan,
    },
    {
      jenis: "Saham",
      jumlahSimpanan: sahamSimpanan.jumlah,
      jumlahLembar: sahamSimpanan.lembar,
      persenSaham: sahamSimpanan.jumlah / totalSaham,
    },
  ];

  return {
    data,
    simpananDetail,
    sahamDetail,
  };
});
