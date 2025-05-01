import { and, desc, eq, like, or, sql, type SQL } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { setoranTable } from "~~/server/database/schema/simpanan";
import { InternalError } from "../../common/error";
import type { TSetoranCreate } from "./dto/create-setoran.dto";
import type { TSetoranList } from "./dto/list-setoran.dto";

export async function listAllSetoran(
  { limit, page, search }: TSetoranList,
  anggotaId?: number
) {
  const offset = (page - 1) * limit;
  const conditions: (SQL<unknown> | undefined)[] = [];

  if (anggotaId) {
    conditions.push(eq(setoranTable.anggotaId, anggotaId));
  }

  if (search) {
    const searchCondition = `%${search}%`;

    conditions.push(
      or(
        like(setoranTable.kodeTransaksi, searchCondition),
        like(setoranTable.keterangan, searchCondition),
        like(setoranTable.tanggal, searchCondition),
        like(userTable.namaLengkap, searchCondition)
      )
    );
  }

  try {
    const query = db
      .select({
        id: setoranTable.id,
        status: setoranTable.status,
        anggotaId: setoranTable.anggotaId,
        kodeTransaksi: setoranTable.kodeTransaksi,
        tanggal: setoranTable.tanggal,
        nilai: setoranTable.nilai,
        keterangan: setoranTable.keterangan,
        jenis: setoranTable.jenis,
        jumlahSaham: setoranTable.jumlahSaham,
        namaLengkap: userTable.namaLengkap,
      })
      .from(setoranTable)
      .leftJoin(userTable, eq(setoranTable.anggotaId, userTable.id))
      .where(and(...conditions));

    const data = await query.limit(limit).offset(offset);
    const countResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(setoranTable)
      .leftJoin(userTable, eq(setoranTable.anggotaId, userTable.id))
      .where(and(...conditions));
    const count = countResult[0]?.count ?? 0;

    return {
      data,
      count,
    };
  } catch (error) {
    console.error("Failed to get All Setoran", error);
    throw InternalError;
  }
}

export async function createSetoran(
  body: TSetoranCreate,
  kodeTransaksi: string
) {
  try {
    await db
      .insert(setoranTable)
      .values({
        ...body,
        kodeTransaksi,
      })
      .returning({ insertedId: setoranTable.id });
  } catch (error) {
    console.error("Failed to insert Setoran", error);
    throw InternalError;
  }
}

export async function getAllSetoranInactive() {
  return await db.query.setoranTable.findMany({
    orderBy: desc(setoranTable.createdAt),
    where: eq(setoranTable.status, 0),
    with: {
      anggota: {
        columns: {
          namaLengkap: true,
          noUser: true,
        },
      },
    },
    extras: {
      count: db.$count(setoranTable, eq(setoranTable.status, 0)).as("count"),
    },
  });
}

export async function getSetoranById(id: number) {
  return await db.query.setoranTable.findFirst({
    where: eq(setoranTable.id, id),
  });
}
