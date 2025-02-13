import { desc, eq } from "drizzle-orm";
import { db } from "~~/server/database";
import type { Penarikan, Setoran } from "~~/server/database/schema/simpanan";
import { type NewShu, shuTable } from "~~/server/database/schema/transaksi";

interface Result {
  anggotaId: number;
  nilai: number;
  jenis: "Simpanan" | "Saham";
  umur: number;
}

interface SummedResult {
  anggotaId: number;
  sumSimpanan: number;
  sumSaham: number;
}

export function processSimpanan(
  setoran: Setoran[],
  penarikan: Penarikan[]
): Result[] {
  const oneYearDays = 365;
  const result: Result[] = new Array<Result>();

  // Buat Map anggotaId → setoran & penarikan yang sudah diurutkan
  const setoranByUser = new Map<number, Setoran[]>();
  const penarikanByUser = new Map<number, Penarikan[]>();

  setoran.forEach((s) => {
    if (!setoranByUser.has(s.anggotaId)) setoranByUser.set(s.anggotaId, []);
    setoranByUser.get(s.anggotaId)!.push(s);
  });

  penarikan.forEach((p) => {
    if (!penarikanByUser.has(p.anggotaId)) penarikanByUser.set(p.anggotaId, []);
    penarikanByUser.get(p.anggotaId)!.push(p);
  });

  setoranByUser.forEach((setoranList, anggotaId) => {
    // Urutkan setoran & penarikan berdasarkan createdAt
    setoranList.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const penarikans = penarikanByUser.get(anggotaId) || [];
    penarikans.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let index = setoranList.length - 1; // Mulai dari setoran terbaru

    for (const p of penarikans) {
      let amountToReduce = p.nilai;

      while (amountToReduce > 0 && index >= 0) {
        const setoran = setoranList[index]!;

        if (setoran.jenis === "Simpanan") {
          const available = setoran.nilai;

          const umur = Math.round(
            (new Date(p.createdAt).getTime() -
              new Date(setoran.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          if (available <= amountToReduce) {
            result.push({
              anggotaId,
              nilai: available,
              jenis: "Simpanan",
              umur,
            });
            index--; // Hapus setoran yang habis
            amountToReduce -= available;
          } else {
            result.push({
              anggotaId,
              nilai: amountToReduce,
              jenis: "Simpanan",
              umur,
            });
            setoran.nilai -= amountToReduce;
            amountToReduce = 0;
          }
        } else {
          index--; // Lewati saham
        }
      }
    }

    // Tambahkan sisa setoran yang belum dipakai (umur penuh 365 hari)
    while (index >= 0) {
      const s = setoranList[index]!;
      result.push({
        anggotaId,
        nilai: s.nilai,
        jenis: s.jenis,
        umur: oneYearDays,
      });
      index--;
    }
  });

  return result;
}

export function sumSimpananResults(results: Result[]): SummedResult[] {
  const summary = new Map<number, { sumSimpanan: number; sumSaham: number }>();

  results.forEach(({ anggotaId, nilai, jenis }) => {
    if (!summary.has(anggotaId)) {
      summary.set(anggotaId, { sumSimpanan: 0, sumSaham: 0 });
    }

    if (jenis === "Simpanan") {
      summary.get(anggotaId)!.sumSimpanan += nilai;
    } else if (jenis === "Saham") {
      summary.get(anggotaId)!.sumSaham += nilai;
    }
  });

  return Array.from(summary.entries()).map(
    ([anggotaId, { sumSimpanan, sumSaham }]) => ({
      anggotaId,
      sumSimpanan,
      sumSaham,
    })
  );
}

export function shuCalculation(profit: number, results: Result[]): Result[] {
  const setoranProfit = (profit * 40) / 100;
  const sahamProfit = (profit * 60) / 100;
  const resultSaham = results.filter((i) => i.jenis === "Saham");
  const resultSetoran = results.filter((i) => i.jenis === "Simpanan");
  const { sumSaham, sumSetoran } = results.reduce(
    (acc, i) => {
      if (i.jenis === "Saham") acc.sumSaham += i.nilai;
      else acc.sumSetoran += i.nilai;
      return acc;
    },
    { sumSaham: 0, sumSetoran: 0 }
  );

  const shuSahamAwal = resultSaham.map((i) => {
    return {
      anggotaId: i.anggotaId,
      jenis: i.jenis,
      nilai: (((i.nilai / sumSaham) * i.umur) / 365) * sahamProfit,
      umur: i.umur,
    };
  });

  const shuSetoranAwal = resultSetoran.map((i) => {
    return {
      anggotaId: i.anggotaId,
      jenis: i.jenis,
      nilai: (((i.nilai / sumSetoran) * i.umur) / 365) * setoranProfit,
      umur: i.umur,
    };
  });

  const sisaProfitSaham =
    sahamProfit - shuSahamAwal.reduce((a, i) => (a += i.nilai), 0);
  const sisaProfitSetoran =
    setoranProfit - shuSetoranAwal.reduce((a, i) => (a += i.nilai), 0);

  function distributeRemainingSHU(
    shuAwal: Result[],
    sisaProfit: number
  ): Result[] {
    const length = shuAwal.length;
    if (length === 0) return shuAwal;

    const totalWeight = (length * (length - 1)) / 2;
    if (totalWeight === 0) return shuAwal;

    return shuAwal.map((i, index) => ({
      ...i,
      nilai: i.nilai + (sisaProfit * index) / totalWeight,
    }));
  }

  const sortedShuSaham = shuSahamAwal.sort((a, b) => a.umur - b.umur);
  const sortedShuSetoran = shuSetoranAwal.sort((a, b) => a.umur - b.umur);

  const shuSahamAkhir = distributeRemainingSHU(sortedShuSaham, sisaProfitSaham);
  const shuSetoranAkhir = distributeRemainingSHU(
    sortedShuSetoran,
    sisaProfitSetoran
  );

  return [...shuSahamAkhir, ...shuSetoranAkhir];
}

export async function getAllShu(tahun: number) {
  return await db.query.shuTable.findMany({
    where: eq(shuTable.tahun, tahun),
    orderBy: desc(shuTable.createdAt),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
        },
      },
    },
  });
}

export async function createShu(data: NewShu[]) {
  return await db.insert(shuTable).values(data);
}

export async function getAllShuByAnggotaId(anggotaId: number) {
  return await db.query.shuTable.findMany({
    where: eq(shuTable.anggotaId, anggotaId),
    orderBy: desc(shuTable.createdAt),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
        },
      },
    },
  });
}
